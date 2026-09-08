package sd.abujanan.games;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BluetoothLinkPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
