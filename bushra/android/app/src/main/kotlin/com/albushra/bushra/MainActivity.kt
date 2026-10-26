package com.albushra.bushra

import android.app.Activity
import android.app.PictureInPictureParams
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.speech.RecognizerIntent
import android.util.Rational
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

/**
 * يضيف للمشغل: «صورة داخل صورة»، وروابط الشاشة الرئيسية في Android TV (تابع المشاهدة والمفضلة)،
 * والبحث الصوتي، واكتشاف أجهزة Chromecast على الشبكة.
 */
class MainActivity : FlutterActivity() {
    private var autoPip = false
    private var tvChannel: MethodChannel? = null
    private var pendingLink: String? = null
    private var voiceResult: MethodChannel.Result? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        val messenger = flutterEngine.dartExecutor.binaryMessenger
        MethodChannel(messenger, "bushra/pip").setMethodCallHandler { call, result ->
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

        pendingLink = intent?.data?.toString()?.takeIf { it.startsWith("bushra://") }
        val tv = MethodChannel(messenger, "bushra/tv")
        tv.setMethodCallHandler { call, result ->
            when (call.method) {
                "initialLink" -> {
                    result.success(pendingLink)
                    pendingLink = null
                }
                "sync" -> {
                    val args = call.arguments as? Map<*, *>
                    val ctx = applicationContext
                    Thread { TvHome.sync(ctx, args) }.start()
                    result.success(null)
                }
                else -> result.notImplemented()
            }
        }
        tvChannel = tv

        MethodChannel(messenger, "bushra/voice").setMethodCallHandler { call, result ->
            when (call.method) {
                "available" -> result.success(speechIntent().resolveActivity(packageManager) != null)
                "listen" -> {
                    voiceResult?.success(null)
                    voiceResult = result
                    try {
                        startActivityForResult(speechIntent(), VOICE_REQ)
                    } catch (e: Exception) {
                        voiceResult = null
                        result.success(null)
                    }
                }
                else -> result.notImplemented()
            }
        }

        MethodChannel(messenger, "bushra/cast").setMethodCallHandler { call, result ->
            when (call.method) {
                "discover" -> {
                    val ms = (call.argument<Int>("ms") ?: 4500).toLong()
                    CastDiscovery(applicationContext).discover(ms) { list -> result.success(list) }
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun speechIntent() = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ar-SA")
        putExtra(RecognizerIntent.EXTRA_PROMPT, "قل اسم القناة أو البرنامج")
        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == VOICE_REQ) {
            val text = if (resultCode == Activity.RESULT_OK) {
                data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
            } else {
                null
            }
            voiceResult?.success(text)
            voiceResult = null
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val link = intent.data?.toString() ?: return
        if (!link.startsWith("bushra://")) return
        val ch = tvChannel
        if (ch != null) ch.invokeMethod("open", link) else pendingLink = link
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

    companion object {
        private const val VOICE_REQ = 4242
    }
}
