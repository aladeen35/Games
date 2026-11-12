package com.rugempire.game;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Rug Empire — native shell. The web game in assets/www is served to the WebView over the
 * virtual origin https://appassets.rugempire.game/ (no file://, no network needed).
 *
 * JS API (window.AndroidBridge):
 *   saveFile(base64, filename, mime) -> boolean   save into public Downloads
 *   beginFile(filename, mime) -> id; appendFile(id, base64); finishFile(id) -> boolean; cancelFile(id)
 *                                                 same, in chunks, for big files (videos)
 *   vibrate(ms), share(text), isAndroidApp() -> true
 * JS hook: window.onAndroidBack() — return true if the page handled the back button.
 * `<a download href="blob:|data:">` clicks are routed to the bridge automatically (see DOWNLOAD_SHIM).
 */
public class MainActivity extends Activity {

    private static final String TAG = "RugEmpire";
    private static final String HOST = "appassets.rugempire.game";
    private static final String ORIGIN = "https://" + HOST;
    private static final String START_URL = ORIGIN + "/index.html";
    private static final String ASSET_ROOT = "www";
    private static final String DOWNLOAD_SUBDIR = "RugEmpire";
    private static final long EXIT_WINDOW_MS = 2000;

    private static final Map<String, String> MIME = new HashMap<String, String>();
    static {
        MIME.put("html", "text/html");
        MIME.put("htm", "text/html");
        MIME.put("js", "text/javascript");
        MIME.put("mjs", "text/javascript");
        MIME.put("css", "text/css");
        MIME.put("json", "application/json");
        MIME.put("webmanifest", "application/manifest+json");
        MIME.put("txt", "text/plain");
        MIME.put("xml", "text/xml");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("jpeg", "image/jpeg");
        MIME.put("gif", "image/gif");
        MIME.put("webp", "image/webp");
        MIME.put("svg", "image/svg+xml");
        MIME.put("ico", "image/x-icon");
        MIME.put("woff2", "font/woff2");
        MIME.put("woff", "font/woff");
        MIME.put("ttf", "font/ttf");
        MIME.put("otf", "font/otf");
        MIME.put("ogg", "audio/ogg");
        MIME.put("mp3", "audio/mpeg");
        MIME.put("wav", "audio/wav");
        MIME.put("m4a", "audio/mp4");
        MIME.put("webm", "video/webm");
        MIME.put("mp4", "video/mp4");
        MIME.put("wasm", "application/wasm");
        MIME.put("glb", "model/gltf-binary");
        MIME.put("bin", "application/octet-stream");
    }

    /** Routes blob:/data: downloads (anchor with the download attribute) to AndroidBridge. */
    private static final String DOWNLOAD_SHIM =
        "(function(){"
      + "if(window.__rugEmpireShim||!window.AndroidBridge)return;window.__rugEmpireShim=1;"
      + "var CH=384*1024;"
      + "function send(blob,name){"
      +   "var id=AndroidBridge.beginFile(String(name||'download'),String(blob.type||'')),off=0;"
      +   "(function next(){"
      +     "if(off>=blob.size){AndroidBridge.finishFile(id);return;}"
      +     "var r=new FileReader();"
      +     "r.onload=function(){var s=String(r.result);AndroidBridge.appendFile(id,s.substring(s.indexOf(',')+1));off+=CH;next();};"
      +     "r.onerror=function(){AndroidBridge.cancelFile(id);};"
      +     "r.readAsDataURL(blob.slice(off,off+CH));"
      +   "})();"
      + "}"
      + "window.AndroidSaveBlob=send;"
      + "function handle(a){"
      +   "if(!a||!a.hasAttribute||!a.hasAttribute('download'))return false;"
      +   "var h=String(a.href||'');"
      +   "if(h.indexOf('blob:')!==0&&h.indexOf('data:')!==0)return false;"
      +   "var n=a.getAttribute('download');"
      +   "fetch(h).then(function(r){return r.blob();}).then(function(b){send(b,n);})"
      +   ".catch(function(e){console.error('download failed',e);});"
      +   "return true;"
      + "}"
      + "document.addEventListener('click',function(e){"
      +   "var a=e.target&&e.target.closest?e.target.closest('a[download]'):null;"
      +   "if(handle(a)){e.preventDefault();e.stopPropagation();}"
      + "},true);"
      + "var oc=HTMLAnchorElement.prototype.click;"
      + "HTMLAnchorElement.prototype.click=function(){if(!handle(this))oc.call(this);};"
      + "})();";

    private WebView web;
    private long lastBackAt = 0;
    private final Map<String, File> pendingFiles = new HashMap<String, File>();
    private int nextFileId = 1;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                           | WindowManager.LayoutParams.FLAG_FULLSCREEN);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage, persisted in the app data dir
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setTextZoom(100);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setCacheMode(WebSettings.LOAD_NO_CACHE); // assets are local; never serve a stale copy after an update
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.setBackgroundColor(0xFF14234B);
        web.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        web.setWebViewClient(new AssetClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        setContentView(web);
        applyImmersive();
        if (state == null || web.restoreState(state) == null) web.loadUrl(START_URL);
    }

    // ───────────────────────── asset server ─────────────────────────

    private class AssetClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (u == null || !HOST.equalsIgnoreCase(u.getHost())) return null;
            String path = u.getPath();
            if (path == null || path.length() == 0) path = "/";
            if (path.endsWith("/")) path += "index.html";
            if (path.contains("..") || path.contains("//")) return notFound();
            String mime = mimeOf(path);
            try {
                InputStream in = getAssets().open(ASSET_ROOT + path);
                Map<String, String> headers = new HashMap<String, String>();
                headers.put("Cache-Control", "no-cache");
                headers.put("Access-Control-Allow-Origin", "*");
                String enc = isText(mime) ? "utf-8" : null;
                return new WebResourceResponse(mime, enc, 200, "OK", headers, in);
            } catch (IOException e) {
                return notFound();
            }
        }

        private WebResourceResponse notFound() {
            return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found",
                    new HashMap<String, String>(), new ByteArrayInputStream(new byte[0]));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (u == null) return true;
            if (HOST.equalsIgnoreCase(u.getHost())) return false;
            String scheme = u.getScheme();
            if ("http".equals(scheme) || "https".equals(scheme) || "mailto".equals(scheme)) {
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
            }
            return true; // never navigate the game WebView away from the local origin
        }

        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
            view.evaluateJavascript(DOWNLOAD_SHIM, null);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            view.evaluateJavascript(DOWNLOAD_SHIM, null);
        }
    }

    private static String mimeOf(String path) {
        int dot = path.lastIndexOf('.');
        int slash = path.lastIndexOf('/');
        if (dot < 0 || dot < slash) return "application/octet-stream";
        String m = MIME.get(path.substring(dot + 1).toLowerCase(Locale.US));
        return m != null ? m : "application/octet-stream";
    }

    private static boolean isText(String mime) {
        return mime.startsWith("text/") || mime.endsWith("json") || mime.endsWith("+xml");
    }

    // ───────────────────────── JS bridge ─────────────────────────

    private class Bridge {
        @JavascriptInterface
        public boolean isAndroidApp() { return true; }

        @JavascriptInterface
        public boolean saveFile(String base64, String filename, String mime) {
            try {
                byte[] data = Base64.decode(stripDataUrl(base64), Base64.DEFAULT);
                String where = store(new ByteArrayInputStream(data), filename, mime);
                toast(getString(R.string.saved_to_downloads, where));
                return true;
            } catch (Throwable e) {
                Log.e(TAG, "saveFile failed", e);
                toast(getString(R.string.save_failed));
                return false;
            }
        }

        @JavascriptInterface
        public String beginFile(String filename, String mime) {
            synchronized (pendingFiles) {
                String id = (nextFileId++) + "|" + safeName(filename) + "|" + (mime == null ? "" : mime);
                pendingFiles.put(id, new File(getCacheDir(), "export-" + System.nanoTime() + ".part"));
                return id;
            }
        }

        @JavascriptInterface
        public boolean appendFile(String id, String base64) {
            File f;
            synchronized (pendingFiles) { f = pendingFiles.get(id); }
            if (f == null) return false;
            try {
                FileOutputStream out = new FileOutputStream(f, true);
                try { out.write(Base64.decode(stripDataUrl(base64), Base64.DEFAULT)); } finally { out.close(); }
                return true;
            } catch (Throwable e) {
                Log.e(TAG, "appendFile failed", e);
                return false;
            }
        }

        @JavascriptInterface
        public boolean finishFile(String id) {
            File f;
            synchronized (pendingFiles) { f = pendingFiles.remove(id); }
            if (f == null) return false;
            String[] parts = id.split("\\|", 3);
            try {
                if (!f.exists()) f.createNewFile();
                InputStream in = new FileInputStream(f);
                String where;
                try { where = store(in, parts[1], parts.length > 2 ? parts[2] : ""); } finally { in.close(); }
                toast(getString(R.string.saved_to_downloads, where));
                return true;
            } catch (Throwable e) {
                Log.e(TAG, "finishFile failed", e);
                toast(getString(R.string.save_failed));
                return false;
            } finally {
                f.delete();
            }
        }

        @JavascriptInterface
        public void cancelFile(String id) {
            File f;
            synchronized (pendingFiles) { f = pendingFiles.remove(id); }
            if (f != null) f.delete();
            toast(getString(R.string.save_failed));
        }

        @JavascriptInterface
        public void vibrate(int ms) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v == null || !v.hasVibrator()) return;
                long d = Math.max(1, Math.min(ms, 2000));
                if (Build.VERSION.SDK_INT >= 26) {
                    v.vibrate(VibrationEffect.createOneShot(d, VibrationEffect.DEFAULT_AMPLITUDE));
                } else {
                    v.vibrate(d);
                }
            } catch (Throwable e) {
                Log.w(TAG, "vibrate failed", e);
            }
        }

        @JavascriptInterface
        public void share(final String text) {
            if (text == null) return;
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    try {
                        Intent i = new Intent(Intent.ACTION_SEND);
                        i.setType("text/plain");
                        i.putExtra(Intent.EXTRA_TEXT, text);
                        startActivity(Intent.createChooser(i, getString(R.string.share_title)));
                    } catch (Throwable e) {
                        Log.w(TAG, "share failed", e);
                    }
                }
            });
        }
    }

    private static String stripDataUrl(String b64) {
        if (b64 == null) return "";
        if (b64.startsWith("data:")) {
            int c = b64.indexOf(',');
            if (c >= 0) return b64.substring(c + 1);
        }
        return b64;
    }

    private static String safeName(String name) {
        String n = name == null ? "" : name.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_").trim();
        if (n.length() == 0 || n.startsWith(".")) n = "rug-empire-" + System.currentTimeMillis() + n;
        if (n.length() > 100) n = n.substring(n.length() - 100);
        return n;
    }

    /** Writes the stream into public Downloads/RugEmpire (API 29+) or the app's external files dir. */
    private String store(InputStream in, String filename, String mime) throws IOException {
        String name = safeName(filename);
        if (mime == null || mime.length() == 0) mime = mimeOf("/" + name);
        int semi = mime.indexOf(';');
        if (semi > 0) mime = mime.substring(0, semi).trim(); // "video/webm;codecs=vp9" -> "video/webm"

        if (Build.VERSION.SDK_INT >= 29) {
            ContentResolver cr = getContentResolver();
            ContentValues cv = new ContentValues();
            cv.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
            cv.put(MediaStore.MediaColumns.MIME_TYPE, mime);
            cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/" + DOWNLOAD_SUBDIR);
            cv.put(MediaStore.MediaColumns.IS_PENDING, 1);
            Uri uri = cr.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
            if (uri == null) throw new IOException("MediaStore insert failed");
            try {
                OutputStream out = cr.openOutputStream(uri);
                if (out == null) throw new IOException("MediaStore open failed");
                try { copy(in, out); } finally { out.close(); }
                ContentValues done = new ContentValues();
                done.put(MediaStore.MediaColumns.IS_PENDING, 0);
                cr.update(uri, done, null, null);
            } catch (IOException e) {
                cr.delete(uri, null, null);
                throw e;
            } catch (RuntimeException e) {
                cr.delete(uri, null, null);
                throw e;
            }
            return DOWNLOAD_SUBDIR + "/" + name;
        }

        // API 24–28: no storage permission requested, so use the app-specific external dir
        // (Android/data/com.rugempire.game/files/Download), visible in file managers.
        File dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
        if (dir == null) dir = new File(getFilesDir(), "Download");
        if (!dir.exists() && !dir.mkdirs()) throw new IOException("cannot create " + dir);
        File f = new File(dir, name);
        OutputStream out = new FileOutputStream(f);
        try { copy(in, out); } finally { out.close(); }
        return f.getAbsolutePath();
    }

    private static void copy(InputStream in, OutputStream out) throws IOException {
        byte[] buf = new byte[64 * 1024];
        int n;
        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        out.flush();
    }

    private void toast(final String msg) {
        runOnUiThread(new Runnable() {
            @Override public void run() {
                Toast.makeText(MainActivity.this, msg, Toast.LENGTH_LONG).show();
            }
        });
    }

    // ───────────────────────── back button ─────────────────────────

    @Override
    public void onBackPressed() {
        if (web == null) { finish(); return; }
        web.evaluateJavascript(
            "(function(){try{return !!(window.onAndroidBack&&window.onAndroidBack());}catch(e){return false;}})()",
            new ValueCallback<String>() {
                @Override public void onReceiveValue(String value) {
                    if ("true".equals(value)) return; // the page handled it
                    long now = System.currentTimeMillis();
                    if (now - lastBackAt < EXIT_WINDOW_MS) {
                        finish();
                    } else {
                        lastBackAt = now;
                        Toast.makeText(MainActivity.this, R.string.back_again_to_exit, Toast.LENGTH_SHORT).show();
                    }
                }
            });
    }

    // ───────────────────────── lifecycle / immersive ─────────────────────────

    private void applyImmersive() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
              | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_FULLSCREEN
              | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyImmersive();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        if (web != null) web.saveState(out);
    }

    @Override protected void onPause() { if (web != null) web.onPause(); super.onPause(); }

    @Override protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
        applyImmersive();
    }

    @Override protected void onDestroy() {
        if (web != null) {
            web.removeJavascriptInterface("AndroidBridge");
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
