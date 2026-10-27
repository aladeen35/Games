package com.atheer.games;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
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
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * ألعاب أطفالنا — غلاف أصلي يعرض الألعاب من assets عبر نطاق https داخلي،
 * فلا يخرج أي طلب إلى الشبكة ويعمل التطبيق دون إنترنت.
 */
public class MainActivity extends Activity {

    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/index.html";

    private WebView web;
    /** حاوية الصفحة: تُزاح الصفحة عن أشرطة النظام (edge-to-edge في أندرويد 15+)، ويُلوَّن مكان الشريطين بلون الواجهة */
    private FrameLayout root;
    private View barTop, barBottom;
    private int insetTop = 0, insetBottom = 0, insetLeft = 0, insetRight = 0;
    private int colTop = SPLASH_BG, colBottom = SPLASH_BG;
    /** لون شاشة البداية (res/values/colors.xml و #splash في index.html) */
    private static final int SPLASH_BG = 0xFFFFF4FA;
    /** تبقى شاشة البداية الأصلية ظاهرة (الصفحة شفافة) حتى ترسم الصفحة شاشة بدايتها بنفس الشعار */
    private boolean revealed = false;
    private OnBackInvokedCallback backCb;
    private TextToSpeech tts, ttsEn;
    private boolean ttsReady = false, ttsEnReady = false;

    /** اختيار صورة الطفل من المعرض أو الكاميرا لحقل <input type=file> */
    private static final int REQ_PHOTO = 4101;
    private ValueCallback<Uri[]> photoCb;

    /** الميكروفون لاستوديو التسجيل: نطلب الصلاحية حين تطلبها الصفحة فقط */
    private static final int REQ_MIC = 4102;
    private PermissionRequest pendingMic;

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
        web.setBackgroundColor(SPLASH_BG);
        web.setAlpha(0f); // حتى تجهز شاشة البداية في الصفحة (Bridge.splashShown)
        web.setWebViewClient(new AssetClient());
        web.setWebChromeClient(new Chrome());
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");

        root = new FrameLayout(this);
        barTop = new View(this);
        barBottom = new View(this);
        barTop.setBackgroundColor(SPLASH_BG);
        barBottom.setBackgroundColor(SPLASH_BG);
        root.addView(web, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT));
        root.addView(barTop, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, 0, Gravity.TOP));
        root.addView(barBottom, new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, 0, Gravity.BOTTOM));
        root.setOnApplyWindowInsetsListener(new View.OnApplyWindowInsetsListener() {
            @Override public WindowInsets onApplyWindowInsets(View v, WindowInsets in) {
                applyInsets(in);
                return in;
            }
        });
        setContentView(root);
        edgeToEdge();
        registerBack();
        web.loadUrl(START_URL);
        // احتياط: إن لم تُبلغ الصفحة بجاهزيتها نُظهرها بعد قليل
        root.postDelayed(new Runnable() { @Override public void run() { reveal(); } }, 3500);

        initTts();
    }

    /** المحتوى خلف أشرطة النظام في كل الإصدارات (كما يفرضه أندرويد 15+)، ثم نزيحه بمقدار الأشرطة بأنفسنا */
    @SuppressWarnings("deprecation")
    private void edgeToEdge() {
        android.view.Window w = getWindow();
        w.setStatusBarColor(Color.TRANSPARENT);
        w.setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
            WindowInsetsController c = w.getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            w.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | (Build.VERSION.SDK_INT >= 23 && light(colTop) ? View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR : 0));
        }
        lightBars();
    }

    /** أيقونات داكنة فوق شريط فاتح، وفاتحة فوق شريط داكن */
    private void lightBars() {
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c == null) return;
            int m = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
            int v = (light(colTop) ? WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS : 0)
                  | (light(colBottom) ? WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS : 0);
            c.setSystemBarsAppearance(v, m);
        }
    }

    private static boolean light(int c) {
        return (Color.red(c) * 299 + Color.green(c) * 587 + Color.blue(c) * 114) / 1000 > 150;
    }

    @SuppressWarnings("deprecation")
    private void applyInsets(WindowInsets in) {
        int t, b, l, r;
        if (Build.VERSION.SDK_INT >= 30) {
            android.graphics.Insets i = in.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            t = i.top; b = i.bottom; l = i.left; r = i.right;
        } else {
            t = in.getSystemWindowInsetTop(); b = in.getSystemWindowInsetBottom();
            l = in.getSystemWindowInsetLeft(); r = in.getSystemWindowInsetRight();
        }
        if (t == insetTop && b == insetBottom && l == insetLeft && r == insetRight && web.getLayoutParams() != null
            && ((FrameLayout.LayoutParams) web.getLayoutParams()).topMargin == t) return;
        insetTop = t; insetBottom = b; insetLeft = l; insetRight = r;
        FrameLayout.LayoutParams wp = (FrameLayout.LayoutParams) web.getLayoutParams();
        wp.setMargins(l, t, r, b);
        web.setLayoutParams(wp);
        FrameLayout.LayoutParams tp = (FrameLayout.LayoutParams) barTop.getLayoutParams();
        tp.height = t; barTop.setLayoutParams(tp);
        FrameLayout.LayoutParams bp = (FrameLayout.LayoutParams) barBottom.getLayoutParams();
        bp.height = b; barBottom.setLayoutParams(bp);
    }

    /** إظهار الصفحة فوق شاشة البداية الأصلية (مرة واحدة) */
    private void reveal() {
        if (revealed || web == null) return;
        revealed = true;
        web.setAlpha(1f);
        // بعد إطار واحد: خلفية النافذة لون فقط (لا حاجة للشعار تحت الصفحة)
        root.postDelayed(new Runnable() { @Override public void run() {
            getWindow().setBackgroundDrawable(new ColorDrawable(colBottom));
        }}, 300);
    }

    private void setBarColors(int top, int bottom) {
        colTop = top; colBottom = bottom;
        barTop.setBackgroundColor(top);
        barBottom.setBackgroundColor(bottom);
        if (revealed) getWindow().setBackgroundDrawable(new ColorDrawable(bottom));
        if (Build.VERSION.SDK_INT >= 30) lightBars(); else edgeToEdge();
    }

    /** زر الرجوع في أندرويد 13+ (onBackPressed لا يُستدعى مع targetSdk 36 في أندرويد 16) */
    private void registerBack() {
        if (Build.VERSION.SDK_INT < 33) return;
        backCb = new OnBackInvokedCallback() {
            @Override public void onBackInvoked() { handleBack(); }
        };
        getOnBackInvokedDispatcher().registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, backCb);
    }

    /** يسأل الصفحة: تغلق نافذة أو تعود للقائمة، وإلا يُغلق التطبيق */
    private void handleBack() {
        if (web == null) { finish(); return; }
        web.evaluateJavascript("(window.__androidBack ? window.__androidBack() : 'exit')",
            new ValueCallback<String>() {
                @Override public void onReceiveValue(String value) {
                    if (value == null || value.contains("exit")) finish();
                }
            });
    }

    private SharedPreferences prefs() { return getSharedPreferences("tts", MODE_PRIVATE); }

    /** محرّكا النطق العربي والإنجليزي (بالمحرّك المختار إن وُجد)، مع تطبيق الصوت والسرعة والطبقة المحفوظة. */
    private void initTts() {
        String engine = prefs().getString("engine", "");
        TextToSpeech.OnInitListener arL = new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS && tts != null) {
                    int r = tts.setLanguage(new Locale("ar"));
                    ttsReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
                    applyPrefs(tts, "ar");
                }
            }
        };
        TextToSpeech.OnInitListener enL = new TextToSpeech.OnInitListener() {
            @Override public void onInit(int status) {
                if (status == TextToSpeech.SUCCESS && ttsEn != null) {
                    int r = ttsEn.setLanguage(Locale.US);
                    ttsEnReady = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
                    applyPrefs(ttsEn, "en");
                }
            }
        };
        if (engine.isEmpty()) { tts = new TextToSpeech(this, arL); ttsEn = new TextToSpeech(this, enL); }
        else { tts = new TextToSpeech(this, arL, engine); ttsEn = new TextToSpeech(this, enL, engine); }
    }

    private void applyPrefs(TextToSpeech t, String lang) {
        SharedPreferences p = prefs();
        try {
            t.setSpeechRate(p.getFloat(lang + ".rate", 0.9f));
            t.setPitch(p.getFloat(lang + ".pitch", 1.1f));
            Set<Voice> vs = t.getVoices();
            if (vs == null) return;
            String name = p.getString(lang + ".voice", "");
            Voice pick = null;
            if (!name.isEmpty()) for (Voice v : vs) if (name.equals(v.getName())) pick = v;
            if (pick == null) pick = bestVoice(vs, lang); // اختيار تلقائي لأفضل صوت
            if (pick != null) t.setVoice(pick);
        } catch (Exception e) { /* أجهزة قديمة: نُبقي الافتراضي */ }
    }

    private static boolean installed(Voice v) {
        Set<String> f = v.getFeatures();
        return f == null || !f.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED);
    }

    /** نفس معايير الويب: عربي سعودي/مصري، جودة عالية، أصوات Google، والأنثوية أولًا */
    private static int score(Voice v, String lang) {
        Locale l = v.getLocale();
        if (l == null || !lang.equals(l.getLanguage()) || !installed(v)) return -1;
        String c = l.getCountry() == null ? "" : l.getCountry().toUpperCase(Locale.US);
        String n = v.getName() == null ? "" : v.getName().toLowerCase(Locale.US);
        int s = 10 + v.getQuality() / 20;
        if (lang.equals("ar") ? (c.equals("SA") || c.equals("EG") || c.equals("XA") || c.equals("AE")) : (c.equals("US") || c.equals("GB"))) s += 30;
        if (v.isNetworkConnectionRequired()) s += 10;
        if (n.contains("female") || n.contains("-x-arc") || n.contains("-x-sfg") || n.contains("-x-tpc")) s += 8;
        return s;
    }

    private static Voice bestVoice(Set<Voice> vs, String lang) {
        Voice b = null; int bs = 0;
        for (Voice v : vs) { int s = score(v, lang); if (s > bs) { bs = s; b = v; } }
        return b;
    }

    private void openIntent(Intent... list) {
        for (Intent i : list) {
            try { i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); startActivity(i); return; }
            catch (Exception e) { /* جرّب التالي */ }
        }
    }

    /** نطق عربي لأسماء الأشكال والتشجيع داخل الألعاب. */
    private class Bridge {
        /** رسمت الصفحة شاشة بدايتها (الشعار في مكان شعار النظام نفسه): نُظهرها */
        @JavascriptInterface
        public void splashShown() {
            runOnUiThread(new Runnable() { @Override public void run() { reveal(); } });
        }

        /** مقدار أشرطة النظام بوحدة CSS (dp): "أعلى,أسفل" — كي تضع الصفحة الشعار في وسط الشاشة كلها */
        @JavascriptInterface
        public String insets() {
            float d = getResources().getDisplayMetrics().density;
            return Math.round(insetTop / d) + "," + Math.round(insetBottom / d);
        }

        /** لونا شريط الحالة وشريط التنقل (يتبعان ثيم الواجهة)، مثل "#FFB9DC" */
        @JavascriptInterface
        public void setBars(final String top, final String bottom) {
            runOnUiThread(new Runnable() { @Override public void run() {
                try { setBarColors(Color.parseColor(top), Color.parseColor(bottom)); } catch (Exception e) { /* لون غير صالح */ }
            }});
        }

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

        /** أصوات اللغة المثبّتة: [{name, lang, quality, network}] */
        @JavascriptInterface
        public String ttsVoices(String lang) {
            JSONArray a = new JSONArray();
            TextToSpeech t = "en".equals(lang) ? ttsEn : tts;
            try {
                Set<Voice> vs = t == null ? null : t.getVoices();
                if (vs != null) for (Voice v : vs) {
                    Locale l = v.getLocale();
                    if (l == null || !lang.equals(l.getLanguage())) continue;
                    JSONObject o = new JSONObject();
                    o.put("name", v.getName());
                    o.put("lang", l.toString().replace('_', '-'));
                    o.put("quality", v.getQuality());
                    o.put("network", v.isNetworkConnectionRequired());
                    o.put("notInstalled", !installed(v));
                    a.put(o);
                }
            } catch (Exception e) { /* لا شيء */ }
            return a.toString();
        }

        /** المحرّك الحالي والمحرّكات المثبّتة */
        @JavascriptInterface
        public String ttsInfo() {
            JSONObject o = new JSONObject();
            try {
                o.put("ar", ttsReady); o.put("en", ttsEnReady);
                if (tts != null) {
                    String def = tts.getDefaultEngine();
                    o.put("engine", prefs().getString("engine", def == null ? "" : def));
                    JSONArray es = new JSONArray();
                    List<TextToSpeech.EngineInfo> list = tts.getEngines();
                    if (list != null) for (TextToSpeech.EngineInfo e : list) {
                        JSONObject x = new JSONObject(); x.put("name", e.name); x.put("label", e.label); es.put(x);
                        if (e.name.equals(o.optString("engine"))) o.put("engineLabel", e.label);
                    }
                    o.put("engines", es);
                }
            } catch (Exception e) { /* لا شيء */ }
            return o.toString();
        }

        /** حفظ الصوت والسرعة والطبقة للغة وتطبيقها فورًا */
        @JavascriptInterface
        public void ttsSet(final String lang, String voice, float rate, float pitch) {
            prefs().edit().putString(lang + ".voice", voice == null ? "" : voice)
                .putFloat(lang + ".rate", rate).putFloat(lang + ".pitch", pitch).apply();
            runOnUiThread(new Runnable() { @Override public void run() {
                TextToSpeech t = "en".equals(lang) ? ttsEn : tts;
                if (t != null) applyPrefs(t, lang);
            }});
        }

        /** تبديل محرّك النطق (مثل com.google.android.tts) */
        @JavascriptInterface
        public void ttsEngine(final String engine) {
            prefs().edit().putString("engine", engine == null ? "" : engine).apply();
            runOnUiThread(new Runnable() { @Override public void run() {
                ttsReady = ttsEnReady = false;
                if (tts != null) tts.shutdown();
                if (ttsEn != null) ttsEn.shutdown();
                initTts();
            }});
        }

        @JavascriptInterface
        public void openTtsSettings() {
            openIntent(new Intent("com.android.settings.TTS_SETTINGS"), new Intent(android.provider.Settings.ACTION_SETTINGS));
        }

        /** تثبيت «خدمات Google للنطق» أو بيانات الصوت */
        @JavascriptInterface
        public void installTts() {
            openIntent(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.google.android.tts")),
                new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.google.android.tts")),
                new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA));
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
    private class Chrome extends WebChromeClient {
        /** الصفحة تطلب الميكروفون (استوديو التسجيل) */
        @Override
        public void onPermissionRequest(final PermissionRequest req) {
            boolean mic = false;
            for (String r : req.getResources()) if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r)) mic = true;
            if (!mic) { req.deny(); return; }
            if (Build.VERSION.SDK_INT < 23 || checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                req.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                return;
            }
            if (pendingMic != null) pendingMic.deny();
            pendingMic = req;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_MIC);
        }

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
    public void onRequestPermissionsResult(int code, String[] perms, int[] res) {
        if (code != REQ_MIC) return;
        PermissionRequest r = pendingMic;
        pendingMic = null;
        if (r == null) return;
        if (res.length > 0 && res[0] == PackageManager.PERMISSION_GRANTED) r.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        else r.deny();
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
        if (l.endsWith(".webp")) return "image/webp";
        if (l.endsWith(".css"))  return "text/css";
        if (l.endsWith(".mp3"))  return "audio/mpeg";
        return "application/octet-stream";
    }

    /** زر الرجوع: يعود إلى قائمة الألعاب أولًا، ثم يغلق التطبيق. */
    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() { handleBack(); } // أندرويد 12 وما قبله

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) edgeToEdge(); // إخفاء شريط التنقل من جديد بعد ظهوره
    }

    @Override protected void onPause() { if (web != null) web.onPause(); super.onPause(); }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() {
        if (tts != null) { tts.stop(); tts.shutdown(); }
        if (ttsEn != null) { ttsEn.stop(); ttsEn.shutdown(); }
        if (backCb != null && Build.VERSION.SDK_INT >= 33) getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backCb);
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}
