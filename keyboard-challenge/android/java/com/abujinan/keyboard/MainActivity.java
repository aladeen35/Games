package com.abujinan.keyboard;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

/**
 * تحدي الـ Keyboard مع أبو جنان — غلاف أندرويد.
 * يقدّم ملفات اللعبة من assets عبر نطاق https داخلي، ويضيف جسر البلوتوث
 * للعب المباشر بين جهازين، بينما يتصل اللعب الأونلاين بالخادم المحدد في الإعدادات.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";

    private WebView web;
    private BtBridge bt;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // ملاحظة: لا نستخدم وضع ملء الشاشة لأنه يعطّل adjustResize مع كيبورد الهاتف.

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        // الخادم الأونلاين قد يكون http على الشبكة المحلية
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setBackgroundColor(0xFF09182B);
        web.setWebViewClient(new AssetClient());

        bt = new BtBridge(this, web);
        web.addJavascriptInterface(bt, "AndroidBT");

        setContentView(web);
        web.loadUrl(START_URL);
    }

    /* ---------------- تقديم ملفات اللعبة من assets ---------------- */
    private class AssetClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (u == null || !HOST.equals(u.getHost())) return null;
            String path = u.getPath();
            if (path == null || path.equals("/")) path = "/index.html";
            try {
                InputStream in = getAssets().open(path.substring(1));
                String mime = mimeOf(path);
                String enc = mime.startsWith("text/") || mime.endsWith("javascript") || mime.endsWith("json") ? "utf-8" : null;
                return new WebResourceResponse(mime, enc, in);
            } catch (IOException e) {
                return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, null);
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url != null && url.startsWith("https://" + HOST)) return false;
            // الروابط الخارجية تفتح في المتصفح
            try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); } catch (Exception ignored) { }
            return true;
        }
    }

    private static String mimeOf(String p) {
        String l = p.toLowerCase(Locale.US);
        if (l.endsWith(".html")) return "text/html";
        if (l.endsWith(".js")) return "application/javascript";
        if (l.endsWith(".css")) return "text/css";
        if (l.endsWith(".json")) return "application/json";
        if (l.endsWith(".webmanifest")) return "application/manifest+json";
        if (l.endsWith(".webp")) return "image/webp";
        if (l.endsWith(".png")) return "image/png";
        if (l.endsWith(".svg")) return "image/svg+xml";
        if (l.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }

    /* ---------------- نتائج الأذونات وتشغيل البلوتوث ---------------- */
    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        super.onRequestPermissionsResult(code, perms, results);
        if (code == BtBridge.REQ_PERMS) bt.onPermissionsResult(results);
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code == BtBridge.REQ_ENABLE) bt.onEnableResult(result == RESULT_OK);
    }

    /* ---------------- زر الرجوع: تسلّم للعبة أولًا ---------------- */
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.__androidBack ? window.__androidBack() : 'exit')",
            new ValueCallback<String>() {
                @Override public void onReceiveValue(String value) {
                    if (value == null || value.contains("exit")) finish();
                }
            });
    }

    @Override protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    @Override protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override protected void onDestroy() {
        if (bt != null) bt.shutdown();
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
