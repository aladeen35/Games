package sd.abujanan.games;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // تسجيل إضافة البلوتوث — أي خلل فيها يجب ألا يمنع اللعبة من العمل
        try {
            registerPlugin(BluetoothLinkPlugin.class);
        } catch (Throwable t) {
            Log.e("AbuJanan", "تعذّر تسجيل إضافة البلوتوث", t);
        }
        super.onCreate(savedInstanceState);
        clearWebViewCacheOnUpgrade();
    }

    /**
     * بعد تحديث التطبيق قد يظلّ WebView يعرض نسخة الصفحة القديمة من ذاكرته المؤقتة،
     * فتبدو الميزات الجديدة كأنها غير موجودة. نمسح الذاكرة مرة واحدة فقط عند أول
     * تشغيل بعد كل تحديث، فلا يتأثر زمن الإقلاع في التشغيل العادي.
     */
    private void clearWebViewCacheOnUpgrade() {
        try {
            long code = getPackageManager()
                    .getPackageInfo(getPackageName(), 0).getLongVersionCode();
            SharedPreferences sp = getSharedPreferences("abujanan", MODE_PRIVATE);
            if (sp.getLong("lastVersionCode", -1L) != code) {
                if (bridge != null && bridge.getWebView() != null) {
                    bridge.getWebView().clearCache(true);
                }
                sp.edit().putLong("lastVersionCode", code).apply();
                Log.i("AbuJanan", "مُسحت ذاكرة WebView بعد التحديث إلى الإصدار " + code);
            }
        } catch (Throwable t) {
            Log.e("AbuJanan", "تعذّر مسح ذاكرة WebView بعد التحديث", t);
        }
    }
}
