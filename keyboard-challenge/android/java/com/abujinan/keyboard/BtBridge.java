package com.abujinan.keyboard;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * جسر البلوتوث للعبة: اتصال RFCOMM بين مضيف وعدة لاعبين.
 * الرسائل أسطر JSON بترميز UTF-8. الأحداث ترسل للويب عبر window.__btEvent(type, json).
 */
public class BtBridge {

    static final int REQ_PERMS = 41;
    static final int REQ_ENABLE = 42;
    private static final UUID APP_UUID = UUID.fromString("7f3c9b2e-4a1d-4e8b-9c6a-2b5d8e1f0a37");
    private static final String SERVICE = "AbuJinanKeyboard";
    private static final Charset UTF8 = Charset.forName("UTF-8");
    private static final int MAX_PEERS = 6;

    private final Activity act;
    private final WebView web;
    private final BluetoothAdapter adapter;
    private final Map<String, Conn> conns = new ConcurrentHashMap<String, Conn>();
    private volatile BluetoothServerSocket server;
    private volatile boolean hosting = false;
    private int nextId = 1;
    private BroadcastReceiver scanReceiver;

    BtBridge(Activity act, WebView web) {
        this.act = act;
        this.web = web;
        this.adapter = BluetoothAdapter.getDefaultAdapter();
    }

    /* ---------------- الأحداث نحو الويب ---------------- */
    private void emit(final String type, final JSONObject data) {
        final String js = "window.__btEvent&&window.__btEvent(" + JSONObject.quote(type) + ","
                + JSONObject.quote(data == null ? "{}" : data.toString()) + ")";
        act.runOnUiThread(new Runnable() {
            @Override public void run() { web.evaluateJavascript(js, null); }
        });
    }

    private static JSONObject obj(Object... kv) {
        JSONObject o = new JSONObject();
        try {
            for (int i = 0; i + 1 < kv.length; i += 2) o.put(String.valueOf(kv[i]), kv[i + 1]);
        } catch (Exception ignored) { }
        return o;
    }

    private void error(String message) { emit("error", obj("message", message)); }

    /* ---------------- الأذونات والتشغيل ---------------- */
    private String[] neededPermissions() {
        List<String> list = new ArrayList<String>();
        if (Build.VERSION.SDK_INT >= 31) {
            list.add("android.permission.BLUETOOTH_SCAN");
            list.add("android.permission.BLUETOOTH_CONNECT");
            list.add("android.permission.BLUETOOTH_ADVERTISE");
        }
        list.add("android.permission.ACCESS_FINE_LOCATION");
        List<String> missing = new ArrayList<String>();
        if (Build.VERSION.SDK_INT >= 23) {
            for (String p : list) {
                if (act.checkSelfPermission(p) != PackageManager.PERMISSION_GRANTED) missing.add(p);
            }
        }
        return missing.toArray(new String[0]);
    }

    private boolean hasConnectPermission() {
        return Build.VERSION.SDK_INT < 31
                || act.checkSelfPermission("android.permission.BLUETOOTH_CONNECT") == PackageManager.PERMISSION_GRANTED;
    }

    @JavascriptInterface
    public boolean isSupported() { return adapter != null; }

    @JavascriptInterface
    public void ensureReady() {
        act.runOnUiThread(new Runnable() {
            @Override public void run() {
                if (adapter == null) { emit("ready", obj("ok", false, "reason", "unsupported")); return; }
                String[] missing = neededPermissions();
                if (missing.length > 0 && Build.VERSION.SDK_INT >= 23) {
                    act.requestPermissions(missing, REQ_PERMS);
                    return;
                }
                continueEnable();
            }
        });
    }

    void onPermissionsResult(int[] results) {
        // الموقع مطلوب للبحث فقط؛ أذونات الاتصال ضرورية
        if (!hasConnectPermission()) { emit("ready", obj("ok", false, "reason", "denied")); return; }
        continueEnable();
    }

    private void continueEnable() {
        try {
            if (adapter.isEnabled()) { emit("ready", obj("ok", true)); return; }
            act.startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), REQ_ENABLE);
        } catch (SecurityException e) {
            emit("ready", obj("ok", false, "reason", "denied"));
        }
    }

    void onEnableResult(boolean ok) {
        emit("ready", obj("ok", ok, "reason", ok ? "" : "off"));
    }

    /* ---------------- المضيف ---------------- */
    @JavascriptInterface
    public void host(final String name) {
        stopHost();
        hosting = true;
        act.runOnUiThread(new Runnable() {
            @Override public void run() {
                try {
                    Intent i = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
                    i.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
                    act.startActivity(i);
                } catch (Exception ignored) { }
            }
        });
        new Thread(new Runnable() {
            @Override public void run() {
                try {
                    server = adapter.listenUsingRfcommWithServiceRecord(SERVICE, APP_UUID);
                    emit("hosting", obj("name", name));
                    while (hosting) {
                        BluetoothSocket s = server.accept();
                        if (s == null) continue;
                        if (conns.size() >= MAX_PEERS) { try { s.close(); } catch (IOException ignored) { } continue; }
                        startConn("p" + (nextId++), s);
                    }
                } catch (IOException e) {
                    if (hosting) error("توقف استقبال اللاعبين: " + e.getMessage());
                } catch (SecurityException e) {
                    error("لازم تسمح بأذونات البلوتوث");
                }
            }
        }, "bt-accept").start();
    }

    @JavascriptInterface
    public void stopHost() {
        hosting = false;
        BluetoothServerSocket s = server;
        server = null;
        if (s != null) try { s.close(); } catch (IOException ignored) { }
    }

    /* ---------------- اللاعب المنضم ---------------- */
    @JavascriptInterface
    public String paired() {
        JSONArray arr = new JSONArray();
        try {
            Set<BluetoothDevice> set = adapter == null ? null : adapter.getBondedDevices();
            if (set != null) for (BluetoothDevice d : set) arr.put(obj("name", safeName(d), "address", d.getAddress()));
        } catch (SecurityException ignored) { }
        return arr.toString();
    }

    private static String safeName(BluetoothDevice d) {
        try { String n = d.getName(); return n == null ? "" : n; } catch (SecurityException e) { return ""; }
    }

    @JavascriptInterface
    public void scan() {
        act.runOnUiThread(new Runnable() {
            @Override public void run() {
                try {
                    if (scanReceiver == null) {
                        scanReceiver = new BroadcastReceiver() {
                            @Override public void onReceive(Context c, Intent intent) {
                                String a = intent.getAction();
                                if (BluetoothDevice.ACTION_FOUND.equals(a)) {
                                    BluetoothDevice d = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                                    if (d != null) emit("device", obj("name", safeName(d), "address", d.getAddress()));
                                } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(a)) {
                                    emit("scanDone", null);
                                }
                            }
                        };
                        IntentFilter f = new IntentFilter(BluetoothDevice.ACTION_FOUND);
                        f.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
                        act.registerReceiver(scanReceiver, f);
                    }
                    adapter.cancelDiscovery();
                    if (!adapter.startDiscovery()) { error("تعذر البحث. فعّل الموقع وجرب تاني، أو اقرن الجهازين من الإعدادات."); emit("scanDone", null); }
                } catch (SecurityException e) {
                    error("لازم تسمح بأذونات البلوتوث والموقع للبحث");
                    emit("scanDone", null);
                }
            }
        });
    }

    @JavascriptInterface
    public void connect(final String address) {
        new Thread(new Runnable() {
            @Override public void run() {
                BluetoothSocket s = null;
                try {
                    try { adapter.cancelDiscovery(); } catch (SecurityException ignored) { }
                    BluetoothDevice d = adapter.getRemoteDevice(address);
                    try {
                        s = d.createRfcommSocketToServiceRecord(APP_UUID);
                        s.connect();
                    } catch (IOException first) {
                        if (s != null) try { s.close(); } catch (IOException ignored) { }
                        s = d.createInsecureRfcommSocketToServiceRecord(APP_UUID);
                        s.connect();
                    }
                    startConn("h", s);
                } catch (Exception e) {
                    if (s != null) try { s.close(); } catch (IOException ignored) { }
                    error("تعذر الاتصال بالجهاز. تأكد أن صاحبك فتح الغرفة.");
                }
            }
        }, "bt-connect").start();
    }

    /* ---------------- الاتصالات ---------------- */
    private void startConn(String id, BluetoothSocket s) {
        final Conn c = new Conn(id, s);
        conns.put(id, c);
        String name = "";
        try { name = safeName(s.getRemoteDevice()); } catch (Exception ignored) { }
        emit("connected", obj("id", id, "name", name));
        new Thread(c, "bt-read-" + id).start();
    }

    @JavascriptInterface
    public void send(String id, String text) {
        Conn c = conns.get(id);
        if (c != null) c.write(text);
    }

    @JavascriptInterface
    public void broadcast(String text) {
        for (Conn c : conns.values()) c.write(text);
    }

    @JavascriptInterface
    public void close() {
        stopHost();
        for (Conn c : conns.values()) c.close();
        conns.clear();
        try { if (adapter != null) adapter.cancelDiscovery(); } catch (SecurityException ignored) { }
    }

    void shutdown() {
        close();
        if (scanReceiver != null) {
            try { act.unregisterReceiver(scanReceiver); } catch (Exception ignored) { }
            scanReceiver = null;
        }
    }

    private class Conn implements Runnable {
        final String id;
        final BluetoothSocket socket;
        OutputStream out;
        volatile boolean open = true;

        Conn(String id, BluetoothSocket socket) {
            this.id = id;
            this.socket = socket;
            try { out = socket.getOutputStream(); } catch (IOException e) { open = false; }
        }

        synchronized void write(String text) {
            if (!open || out == null) return;
            try {
                out.write((text.replace('\n', ' ') + "\n").getBytes(UTF8));
                out.flush();
            } catch (IOException e) {
                close();
            }
        }

        @Override public void run() {
            try {
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), UTF8));
                String line;
                while (open && (line = in.readLine()) != null) {
                    if (line.length() > 0 && line.length() < 20000) emit("message", obj("id", id, "data", line));
                }
            } catch (IOException ignored) {
            } finally {
                close();
            }
        }

        void close() {
            boolean was = open;
            open = false;
            try { socket.close(); } catch (IOException ignored) { }
            if (conns.remove(id) != null || was) emit("disconnected", obj("id", id));
        }
    }
}
