package sd.abujanan.games;

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
    }
}
