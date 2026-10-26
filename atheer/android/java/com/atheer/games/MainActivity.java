package com.atheer.games;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

/**
 * ألعاب أثير وبشرى — غلاف أصلي يعرض الألعاب الثلاث من assets عبر نطاق https داخلي،
 * فلا يخرج أي طلب إلى الشبكة ويعمل التطبيق دون إنترنت.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";

    private WebView web;
    private TextToSpeech tts, ttsEn;
    private boolean ttsReady = false, ttsEnReady = false;

    /** اختيار صورة الطفل من المعرض أو الكاميرا لحقل <input type=file> */
    private static final int REQ_PHOTO = 4101;
    private ValueCallback<Uri[]> photoCb;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setTextZoom(100);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setBackgroundColor(0xFFFFF0F6);
        web.setWebViewClient(new AssetClient());
        web.setWebChromeClient(new PhotoChooser());
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        setContentView(web);
        web.loadUrl(START_URL);

        initEn();
        tts = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    int r = tts.setLanguage(new Locale("ar"));
                    ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
                }
            }
        });
    }

    /** نطق إنجليزي لحروف وكلمات لعبة «حروفي». */
    private void initEn() {
        ttsEn = new TextToSpeech(this, new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS) {
                    int r = ttsEn.setLanguage(Locale.US);
                    ttsEnReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
                }
            }
        });
    }

    /** نطق عربي لأسماء الأشكال والتشجيع داخل الألعاب. */
    private class Bridge {
        @JavascriptInterface
        public void speak(String text) {
            if (!ttsReady || text == null) return;
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }

        @JavascriptInterface
        public void speakEn(String text) {
            if (!ttsEnReady || text == null) return;
            ttsEn.speak(text, TextToSpeech.QUEUE_FLUSH, null);
        }
    }

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
                return null;
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            // لا فتح لأي رابط خارجي
            return url == null || !url.startsWith("https://" + HOST);
        }
    }

    /**
     * حقل الصورة في نموذج الطفل: بلا capture ← قائمة (المعرض/الملفات + الكاميرا)،
     * ومع capture ← الكاميرا مباشرة. الكاميرا تُرجع صورة مصغّرة (تكفي للصورة الدائرية)،
     * فلا حاجة إلى أي صلاحية أو FileProvider.
     */
    private class PhotoChooser extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> cb, FileChooserParams params) {
            if (photoCb != null) photoCb.onReceiveValue(null);
            photoCb = cb;
            Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
            pick.addCategory(Intent.CATEGORY_OPENABLE);
            pick.setType("image/*");
            Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            boolean capture = params != null && params.isCaptureEnabled();
            if (capture) {
                try { startActivityForResult(cam, REQ_PHOTO); return true; }
                catch (ActivityNotFoundException | SecurityException e) { /* لا كاميرا: نفتح المعرض */ }
            }
            Intent chooser = Intent.createChooser(pick, "اختر صورة");
            if (!capture) chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{cam});
            try {
                startActivityForResult(chooser, REQ_PHOTO);
            } catch (ActivityNotFoundException | SecurityException e) {
                photoCb = null;
                cb.onReceiveValue(null);
            }
            return true;
        }
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        if (req != REQ_PHOTO) { super.onActivityResult(req, res, data); return; }
        ValueCallback<Uri[]> cb = photoCb;
        photoCb = null;
        if (cb == null) return;
        Uri[] out = null;
        if (res == RESULT_OK && data != null) {
            if (data.getData() != null) {
                out = new Uri[]{data.getData()};
            } else if (data.getClipData() != null && data.getClipData().getItemCount() > 0) {
                out = new Uri[]{data.getClipData().getItemAt(0).getUri()};
            } else if (data.getExtras() != null && data.getExtras().get("data") instanceof Bitmap) {
                // صورة الكاميرا المصغّرة: نحفظها مؤقتًا ونمرّر مسارها للصفحة
                try {
                    Bitmap bmp = (Bitmap) data.getExtras().get("data");
                    File f = new File(getCacheDir(), "kid-photo.jpg");
                    FileOutputStream fo = new FileOutputStream(f);
                    bmp.compress(Bitmap.CompressFormat.JPEG, 92, fo);
                    fo.close();
                    out = new Uri[]{Uri.fromFile(f)};
                } catch (IOException e) { out = null; }
            }
        }
        cb.onReceiveValue(out);
    }

    private static String mimeOf(String p) {
        String l = p.toLowerCase(Locale.US);
        if (l.endsWith(".html")) return "text/html";
        if (l.endsWith(".js"))   return "application/javascript";
        if (l.endsWith(".json")) return "application/json";
        if (l.endsWith(".png"))  return "image/png";
        if (l.endsWith(".jpg") || l.endsWith(".jpeg")) return "image/jpeg";
        if (l.endsWith(".woff2")) return "font/woff2";
        if (l.endsWith(".mp3"))  return "audio/mpeg";
        return "application/octet-stream";
    }

    /** زر الرجوع: يعود إلى قائمة الألعاب أولًا، ثم يغلق التطبيق. */
    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(window.__androidBack ? window.__androidBack() : 'exit')",
            new ValueCallback<String>() {
                @Override public void onReceiveValue(String value) {
                    if (value == null || value.contains("exit")) finish();
                }
            });
    }

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

    @Override protected void onPause() { if (web != null) web.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (ttsEn != null) { ttsEn.stop(); ttsEn.shutdown(); }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
