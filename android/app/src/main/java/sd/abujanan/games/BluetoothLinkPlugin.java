package sd.abujanan.games;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * جسر بلوتوث كلاسيكي (RFCOMM) للعب بلا إنترنت.
 * المضيف يستمع ويقبل عدة لاعبين، والضيف يتصل بالمضيف.
 * كل رسالة سطر JSON واحد ينتهي بسطر جديد.
 */
@CapacitorPlugin(
    name = "BluetoothLink",
    permissions = {
        @Permission(alias = "btNew", strings = {
            Manifest.permission.BLUETOOTH_CONNECT,
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_ADVERTISE
        }),
        @Permission(alias = "btOld", strings = {
            Manifest.permission.ACCESS_FINE_LOCATION
        })
    }
)
public class BluetoothLinkPlugin extends Plugin {

    private static final UUID SERVICE_UUID = UUID.fromString("6a1b0c7e-3f2d-4a58-9e11-ab0c1a2e3d40");
    private static final String SERVICE_NAME = "SudaniGames";

    private BluetoothAdapter adapter;
    private AcceptThread acceptThread;
    private final Map<String, Conn> conns = new ConcurrentHashMap<>();
    private final AtomicInteger seq = new AtomicInteger(0);

    private final Map<String, String> found = Collections.synchronizedMap(new LinkedHashMap<>());
    private BroadcastReceiver discoveryReceiver;
    private PluginCall pendingPermCall;
    private String pendingPermAction;

    @Override
    public void load() {
        try {
            BluetoothManager bm = (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
            adapter = bm != null ? bm.getAdapter() : BluetoothAdapter.getDefaultAdapter();
        } catch (Throwable t) {
            adapter = null;
        }
    }

    /* ---------------- الأذونات ---------------- */

    private String[] neededAliases() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
            ? new String[]{"btNew"}
            : new String[]{"btOld"};
    }

    private boolean ensurePerms(PluginCall call, String action) {
        for (String alias : neededAliases()) {
            if (getPermissionState(alias) != com.getcapacitor.PermissionState.GRANTED) {
                pendingPermCall = call;
                pendingPermAction = action;
                requestPermissionForAlias(alias, call, "permsResult");
                return false;
            }
        }
        return true;
    }

    @PermissionCallback
    private void permsResult(PluginCall call) {
        for (String alias : neededAliases()) {
            if (getPermissionState(alias) != com.getcapacitor.PermissionState.GRANTED) {
                call.reject("PERM_DENIED");
                pendingPermCall = null;
                return;
            }
        }
        String action = pendingPermAction;
        pendingPermCall = null;
        pendingPermAction = null;
        if ("host".equals(action)) doHost(call);
        else if ("scan".equals(action)) doScan(call);
        else if ("connect".equals(action)) doConnect(call);
        else call.resolve();
    }

    /** هل الأذونات المطلوبة ممنوحة؟ */
    @PluginMethod
    public void checkPerms(PluginCall call) {
        boolean granted = true;
        for (String alias : neededAliases()) {
            if (getPermissionState(alias) != com.getcapacitor.PermissionState.GRANTED) granted = false;
        }
        JSObject r = new JSObject();
        r.put("granted", granted);
        r.put("legacy", Build.VERSION.SDK_INT < Build.VERSION_CODES.S);
        call.resolve(r);
    }

    /** يطلب الأذونات ويعيد النتيجة بدل أن يفشل بصمت */
    @PluginMethod
    public void requestPerms(PluginCall call) {
        for (String alias : neededAliases()) {
            if (getPermissionState(alias) != com.getcapacitor.PermissionState.GRANTED) {
                pendingPermCall = call;
                pendingPermAction = "report";
                requestPermissionForAlias(alias, call, "reportPerms");
                return;
            }
        }
        JSObject r = new JSObject();
        r.put("granted", true);
        call.resolve(r);
    }

    @PermissionCallback
    private void reportPerms(PluginCall call) {
        boolean granted = true;
        for (String alias : neededAliases()) {
            if (getPermissionState(alias) != com.getcapacitor.PermissionState.GRANTED) granted = false;
        }
        pendingPermCall = null;
        pendingPermAction = null;
        JSObject r = new JSObject();
        r.put("granted", granted);
        call.resolve(r);
    }

    /** اسم جهاز البلوتوث الظاهر للآخرين */
    @PluginMethod
    @SuppressLint("MissingPermission")
    public void deviceName(PluginCall call) {
        JSObject r = new JSObject();
        String n = "جهازي";
        try { if (adapter != null) n = safeName(adapter.getName()); } catch (Throwable ignored) {}
        r.put("name", n);
        call.resolve(r);
    }

    /** إعادة إظهار الجهاز للبحث (تنتهي مدة الظهور بعد 5 دقائق) */
    @PluginMethod
    @SuppressLint("MissingPermission")
    public void makeDiscoverable(PluginCall call) {
        try {
            Intent disc = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
            disc.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
            if (getActivity() != null) {
                getActivity().startActivity(disc);
            } else {
                disc.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(disc);
            }
            call.resolve();
        } catch (Throwable t) {
            call.reject("DISCOVERABLE_FAIL: " + t.getMessage());
        }
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject r = new JSObject();
        r.put("available", adapter != null);
        r.put("enabled", adapter != null && adapter.isEnabled());
        call.resolve(r);
    }

    @PluginMethod
    @SuppressLint("MissingPermission")
    public void enable(PluginCall call) {
        if (adapter == null) { call.reject("NO_BT"); return; }
        if (!adapter.isEnabled()) {
            Intent i = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        }
        call.resolve();
    }

    /* ---------------- المضيف ---------------- */

    @PluginMethod
    public void startHost(PluginCall call) {
        if (adapter == null) { call.reject("NO_BT"); return; }
        if (!ensurePerms(call, "host")) return;
        doHost(call);
    }

    @SuppressLint("MissingPermission")
    private void doHost(PluginCall call) {
        try {
            stopAll();
            Intent disc = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
            disc.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
            if (getActivity() != null) {
                getActivity().startActivity(disc);
            } else {
                disc.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(disc);
            }

            acceptThread = new AcceptThread();
            acceptThread.start();
            JSObject r = new JSObject();
            r.put("name", safeName(adapter.getName()));
            call.resolve(r);
        } catch (Exception e) {
            call.reject("HOST_FAIL: " + e.getMessage());
        }
    }

    private class AcceptThread extends Thread {
        private BluetoothServerSocket server;
        private volatile boolean running = true;

        @SuppressLint("MissingPermission")
        public void run() {
            try {
                server = adapter.listenUsingRfcommWithServiceRecord(SERVICE_NAME, SERVICE_UUID);
            } catch (Exception e) {
                notifyErr("LISTEN_FAIL: " + e.getMessage());
                return;
            }
            while (running) {
                try {
                    BluetoothSocket s = server.accept();
                    if (s != null) addConn(s);
                } catch (IOException e) {
                    break;
                }
            }
        }

        void cancel() {
            running = false;
            try { if (server != null) server.close(); } catch (IOException ignored) {}
        }
    }

    /* ---------------- البحث والاتصال ---------------- */

    @PluginMethod
    public void scan(PluginCall call) {
        if (adapter == null) { call.reject("NO_BT"); return; }
        if (!ensurePerms(call, "scan")) return;
        doScan(call);
    }

    @SuppressLint("MissingPermission")
    private void doScan(PluginCall call) {
        found.clear();
        try {
            for (BluetoothDevice d : adapter.getBondedDevices()) {
                found.put(d.getAddress(), safeName(d.getName()));
            }
        } catch (Exception ignored) {}

        if (discoveryReceiver == null) {
            discoveryReceiver = new BroadcastReceiver() {
                @Override
                @SuppressLint("MissingPermission")
                public void onReceive(Context c, Intent i) {
                    if (BluetoothDevice.ACTION_FOUND.equals(i.getAction())) {
                        BluetoothDevice d = i.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                        if (d != null) {
                            found.put(d.getAddress(), safeName(d.getName()));
                            JSObject ev = new JSObject();
                            ev.put("id", d.getAddress());
                            ev.put("name", safeName(d.getName()));
                            notifyListeners("deviceFound", ev);
                        }
                    }
                }
            };
            IntentFilter f = new IntentFilter(BluetoothDevice.ACTION_FOUND);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                getContext().registerReceiver(discoveryReceiver, f, Context.RECEIVER_EXPORTED);
            } else {
                getContext().registerReceiver(discoveryReceiver, f);
            }
        }
        try {
            if (adapter.isDiscovering()) adapter.cancelDiscovery();
            adapter.startDiscovery();
        } catch (Exception ignored) {}

        call.resolve(devicesResult());
    }

    @PluginMethod
    public void devices(PluginCall call) {
        call.resolve(devicesResult());
    }

    private JSObject devicesResult() {
        JSArray arr = new JSArray();
        synchronized (found) {
            for (Map.Entry<String, String> e : found.entrySet()) {
                JSObject o = new JSObject();
                o.put("id", e.getKey());
                o.put("name", e.getValue());
                arr.put(o);
            }
        }
        JSObject r = new JSObject();
        r.put("devices", arr);
        return r;
    }

    @PluginMethod
    public void connect(PluginCall call) {
        if (adapter == null) { call.reject("NO_BT"); return; }
        if (!ensurePerms(call, "connect")) return;
        doConnect(call);
    }

    @SuppressLint("MissingPermission")
    private void doConnect(PluginCall call) {
        String id = call.getString("id");
        if (id == null) { call.reject("NO_ID"); return; }
        new Thread(() -> {
            try {
                if (adapter.isDiscovering()) adapter.cancelDiscovery();
                BluetoothDevice dev = adapter.getRemoteDevice(id);
                BluetoothSocket s = dev.createRfcommSocketToServiceRecord(SERVICE_UUID);
                s.connect();
                addConn(s);
                call.resolve();
            } catch (Exception e) {
                call.reject("CONNECT_FAIL: " + e.getMessage());
            }
        }).start();
    }

    /* ---------------- الاتصالات والرسائل ---------------- */

    @SuppressLint("MissingPermission")
    private void addConn(BluetoothSocket socket) {
        String addr;
        try { addr = socket.getRemoteDevice().getAddress(); }
        catch (Exception e) { addr = "peer" + seq.incrementAndGet(); }
        String name;
        try { name = safeName(socket.getRemoteDevice().getName()); }
        catch (Exception e) { name = "لاعب"; }

        Conn c = new Conn(addr, name, socket);
        conns.put(addr, c);
        c.start();

        JSObject ev = new JSObject();
        ev.put("id", addr);
        ev.put("name", name);
        notifyListeners("peerJoin", ev);
    }

    private class Conn extends Thread {
        final String id, name;
        final BluetoothSocket socket;
        OutputStream out;

        Conn(String id, String name, BluetoothSocket socket) {
            this.id = id; this.name = name; this.socket = socket;
        }

        public void run() {
            try {
                out = socket.getOutputStream();
                InputStream in = socket.getInputStream();
                StringBuilder buf = new StringBuilder();
                byte[] chunk = new byte[4096];
                int n;
                while ((n = in.read(chunk)) != -1) {
                    buf.append(new String(chunk, 0, n, StandardCharsets.UTF_8));
                    int nl;
                    while ((nl = buf.indexOf("\n")) >= 0) {
                        String line = buf.substring(0, nl);
                        buf.delete(0, nl + 1);
                        if (!line.trim().isEmpty()) {
                            JSObject ev = new JSObject();
                            ev.put("from", id);
                            ev.put("msg", line);
                            notifyListeners("data", ev);
                        }
                    }
                }
            } catch (Exception ignored) {
            } finally {
                dropConn(id);
            }
        }

        void write(String line) {
            try {
                if (out != null) {
                    out.write((line + "\n").getBytes(StandardCharsets.UTF_8));
                    out.flush();
                }
            } catch (Exception e) {
                dropConn(id);
            }
        }

        void close() {
            try { socket.close(); } catch (Exception ignored) {}
        }
    }

    private void dropConn(String id) {
        Conn c = conns.remove(id);
        if (c != null) {
            c.close();
            JSObject ev = new JSObject();
            ev.put("id", id);
            notifyListeners("peerLeave", ev);
        }
    }

    @PluginMethod
    public void send(PluginCall call) {
        String msg = call.getString("msg");
        if (msg == null) { call.reject("NO_MSG"); return; }
        String to = call.getString("to");
        if (to != null && !to.isEmpty()) {
            Conn c = conns.get(to);
            if (c != null) c.write(msg);
        } else {
            for (Conn c : conns.values()) c.write(msg);
        }
        call.resolve();
    }

    @PluginMethod
    public void peers(PluginCall call) {
        JSArray arr = new JSArray();
        for (Conn c : conns.values()) {
            JSObject o = new JSObject();
            o.put("id", c.id);
            o.put("name", c.name);
            arr.put(o);
        }
        JSObject r = new JSObject();
        r.put("peers", arr);
        call.resolve(r);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        stopAll();
        call.resolve();
    }

    @SuppressLint("MissingPermission")
    private void stopAll() {
        if (acceptThread != null) { acceptThread.cancel(); acceptThread = null; }
        for (Conn c : new ArrayList<>(conns.values())) c.close();
        conns.clear();
        try { if (adapter != null && adapter.isDiscovering()) adapter.cancelDiscovery(); } catch (Exception ignored) {}
        if (discoveryReceiver != null) {
            try { getContext().unregisterReceiver(discoveryReceiver); } catch (Exception ignored) {}
            discoveryReceiver = null;
        }
    }

    @Override
    protected void handleOnDestroy() {
        stopAll();
    }

    private void notifyErr(String m) {
        JSObject ev = new JSObject();
        ev.put("error", m);
        notifyListeners("btError", ev);
    }

    private static String safeName(String n) {
        return (n == null || n.trim().isEmpty()) ? "جهاز" : n;
    }
}
