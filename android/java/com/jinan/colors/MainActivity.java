package com.jinan.colors;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
import android.util.Base64;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.app.Activity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Locale;

/**
 * عالم الألوان مع جنان — غلاف أصلي لتطبيق التلوين.
 * يقدّم ملفات التطبيق من assets عبر نطاق https وهمي كي تعمل قواعد
 * البيانات المحلية (IndexedDB) بشكل كامل داخل WebView.
 */
public class MainActivity extends Activity {

    /** نطاق داخلي: لا يخرج أي طلب إلى الشبكة، كل شيء من assets. */
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";

    private WebView web;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

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
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setTextZoom(100);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setBackgroundColor(0xFFFFF8EE);
        web.setWebViewClient(new AssetClient());
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        setContentView(web);
        web.loadUrl(START_URL);

        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    int r = tts.setLanguage(new Locale("ar"));
                    ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
                }
            }
        });
    }

    /* ---------------- تقديم ملفات التطبيق من assets ---------------- */
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
                // الترميز يُذكر للنصوص فقط؛ الصور والخطوط ثنائية
                String enc = mime.startsWith("text/") || mime.endsWith("javascript")
                          || mime.endsWith("json") || mime.endsWith("svg+xml") ? "utf-8" : null;
                return new WebResourceResponse(mime, enc, in);
            } catch (IOException e) {
                return null;
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // التطبيق مغلق: لا فتح لأي رابط خارجي (أمان الطفل)
            return url == null || !url.startsWith("https://" + HOST);
        }
    }

    private static String mimeOf(String p) {
        String l = p.toLowerCase(Locale.US);
        if (l.endsWith(".html")) return "text/html";
        if (l.endsWith(".js"))   return "application/javascript";
        if (l.endsWith(".css"))  return "text/css";
        if (l.endsWith(".json")) return "application/json";
        if (l.endsWith(".png"))  return "image/png";
        if (l.endsWith(".jpg") || l.endsWith(".jpeg")) return "image/jpeg";
        if (l.endsWith(".svg"))  return "image/svg+xml";
        if (l.endsWith(".woff2")) return "font/woff2";
        return "application/octet-stream";
    }

    /* ---------------- الجسر بين الويب وأندرويد ---------------- */
    private class Bridge {
        /** نطق نص عربي (أسماء الألوان والمهن). */
        @JavascriptInterface
        public void speak(String text) {
            if (!ttsReady || text == null) return;
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }

        /** حفظ اللوحة في معرض صور الجهاز. */
        @JavascriptInterface
        public boolean saveImage(String base64Png, String filename) {
            try {
                byte[] bytes = Base64.decode(base64Png, Base64.DEFAULT);
                String name = sanitize(filename);
                boolean ok = (Build.VERSION.SDK_INT >= 29)
                        ? saveScoped(bytes, name)
                        : saveLegacy(bytes, name);
                toast(ok ? getString(R.string.saved_ok) : getString(R.string.need_perm));
                return ok;
            } catch (Throwable t) {
                toast(getString(R.string.need_perm));
                return false;
            }
        }
    }

    private static String sanitize(String n) {
        if (n == null || n.trim().isEmpty()) n = "لوحة.png";
        n = n.replaceAll("[\\\\/:*?\"<>|]", "-");
        if (!n.toLowerCase(Locale.US).endsWith(".png")) n = n + ".png";
        return n;
    }

    /** أندرويد 10 فأحدث: التخزين المحدود عبر MediaStore بلا أذونات. */
    private boolean saveScoped(byte[] bytes, String name) throws IOException {
        ContentResolver cr = getContentResolver();
        ContentValues v = new ContentValues();
        v.put("_display_name", name);
        v.put("mime_type", "image/png");
        v.put("relative_path", "Pictures/عالم الألوان مع جنان");
        Uri uri = cr.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, v);
        if (uri == null) return false;
        OutputStream out = cr.openOutputStream(uri);
        if (out == null) return false;
        try { out.write(bytes); } finally { out.close(); }
        return true;
    }

    /** أندرويد 9 وما دون: يحتاج إذن الكتابة. */
    private boolean saveLegacy(byte[] bytes, String name) {
        if (Build.VERSION.SDK_INT >= 23
                && checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                   != PackageManager.PERMISSION_GRANTED) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 7);
                }
            });
            return false;
        }
        Bitmap bmp = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        if (bmp == null) return false;
        String url = MediaStore.Images.Media.insertImage(getContentResolver(), bmp, name, "عالم الألوان مع جنان");
        return url != null;
    }

    private void toast(final String msg) {
        runOnUiThread(new Runnable() {
            @Override public void run() { Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show(); }
        });
    }

    /* ---------------- زر الرجوع: تسلّم للتطبيق أولًا ---------------- */
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.__androidBack ? window.__androidBack() : 'exit')",
            new ValueCallback<String>() {
                @Override public void onReceiveValue(String value) {
                    if (value == null || value.contains("exit")) finish();
                }
            });
    }

    /* ---------------- شاشة كاملة (تقليل الخروج بالخطأ) ---------------- */
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (!hasFocus) return;
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
              | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
              | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
              | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
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
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
