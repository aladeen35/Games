package com.albushra.bushra

import android.app.PictureInPictureParams
import android.content.pm.PackageManager
import android.os.Build
import android.util.Rational
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

/** يضيف وضع «صورة داخل صورة» للمشغل: يدويًا من الزر، وتلقائيًا عند الخروج أثناء التشغيل. */
class MainActivity : FlutterActivity() {
    private var autoPip = false

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "bushra/pip").setMethodCallHandler { call, result ->
            when (call.method) {
                "enter" -> result.success(enterPip())
                "auto" -> {
                    autoPip = call.arguments as? Boolean ?: false
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                        setPictureInPictureParams(params().setAutoEnterEnabled(autoPip).build())
                    }
                    result.success(null)
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun params() = PictureInPictureParams.Builder().setAspectRatio(Rational(16, 9))

    private fun enterPip(): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false
        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)) return false
        return try {
            enterPictureInPictureMode(params().build())
        } catch (e: Exception) {
            false
        }
    }

    override fun onUserLeaveHint() {
        super.onUserLeaveHint()
        if (autoPip && Build.VERSION.SDK_INT in Build.VERSION_CODES.O until Build.VERSION_CODES.S) enterPip()
    }
}
