package com.albushra.bushra.drive

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Matrix
import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import android.util.Size
import android.util.TypedValue
import android.view.Gravity
import android.view.Surface
import android.view.TextureView
import android.view.View
import android.widget.FrameLayout
import android.widget.TextView
import kotlin.math.abs
import kotlin.math.max

/** مرآة الكاميرا الخلفية: كاميرا شاشة السيارة عبر Camera2 في نافذة عائمة معكوسة كالمرآة. */
class DriveCameraWindow(ctx: Context) :
    DriveWindow(ctx, "drive_cam", "الكاميرا الخلفية", .62f, .03f, .36f, .36f),
    TextureView.SurfaceTextureListener {

    private val cm = ctx.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private val texture = TextureView(ctx)
    private val status = TextView(ctx)
    private val main = Handler(Looper.getMainLooper())
    private var thread: HandlerThread? = null
    private var bg: Handler? = null
    private var device: CameraDevice? = null
    private var session: CameraCaptureSession? = null
    private var preview = Size(1280, 720)
    private var currentId: String? = null
    private var closing = false
    private val retry = Runnable { openCamera() }

    init {
        texture.surfaceTextureListener = this
        content.addView(texture, FrameLayout.LayoutParams(-1, -1))
        status.apply {
            setTextColor(DriveColors.MIST)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(12), dp(12), dp(12))
            text = "جارٍ تشغيل الكاميرا…"
        }
        content.addView(status, FrameLayout.LayoutParams(-1, -1))

        addButton("⇄") { DrivePrefs.set(ctx, "cam_mirror", !DrivePrefs.cameraMirror(ctx)); applyTransform() }
        addButton("⟳") { DrivePrefs.set(ctx, "cam_rot", (DrivePrefs.cameraRotation(ctx) + 90) % 360); applyTransform() }
        addButton("⇆") { nextCamera() }
    }

    override fun onShown() {
        thread = HandlerThread("drive-cam").also { it.start(); bg = Handler(it.looper) }
        if (texture.isAvailable) openCamera()
    }

    override fun onClosing() {
        closing = true
        main.removeCallbacks(retry)
        closeCamera()
        thread?.quitSafely()
    }

    override fun onResized() = applyTransform()

    private fun pickId(): String? {
        val ids = cm.cameraIdList
        if (ids.isEmpty()) return null
        val saved = DrivePrefs.cameraId(ctx)
        ids.firstOrNull { it == saved }?.let { return it }
        // كاميرا الرجوع تظهر غالبًا كخلفية أو خارجية
        return ids.firstOrNull {
            val f = cm.getCameraCharacteristics(it).get(CameraCharacteristics.LENS_FACING)
            f == CameraCharacteristics.LENS_FACING_BACK || f == CameraCharacteristics.LENS_FACING_EXTERNAL
        } ?: ids[0]
    }

    private fun nextCamera() {
        try {
            val ids = cm.cameraIdList
            if (ids.isEmpty()) return
            val i = ids.indexOf(currentId)
            DrivePrefs.set(ctx, "cam_id", ids[(i + 1) % ids.size])
            closeCamera()
            openCamera()
        } catch (e: Exception) { show("خطأ: ${e.message}") }
    }

    @SuppressLint("MissingPermission")
    private fun openCamera() {
        if (closing || !texture.isAvailable) return
        if (ctx.checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            show("لا يوجد إذن للكاميرا.\nافتح البشرى ← الإعدادات ← وضع القيادة")
            return
        }
        try {
            val id = pickId()
            currentId = id
            if (id == null) {
                show("الشاشة لا تتيح الكاميرا للتطبيقات.\nجرّب تشغيلها مرة من تطبيق الشاشة الأصلي.")
                later(5000); return
            }
            val map = cm.getCameraCharacteristics(id).get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP)
            val sizes = map?.getOutputSizes(SurfaceTexture::class.java)
            if (!sizes.isNullOrEmpty()) preview = sizes.minBy { abs(it.width.toLong() * it.height - 1280L * 720L) }
            show("جارٍ تشغيل الكاميرا $id…")
            cm.openCamera(id, object : CameraDevice.StateCallback() {
                override fun onOpened(d: CameraDevice) { device = d; startPreview() }
                override fun onDisconnected(d: CameraDevice) {
                    d.close(); device = null
                    show("الكاميرا مستخدمة من النظام (وضع الرجوع R)…\nإعادة الاتصال تلقائيًا"); later(2500)
                }
                override fun onError(d: CameraDevice, error: Int) {
                    d.close(); device = null
                    show("تعذّر فتح الكاميرا (رمز $error)\nإعادة المحاولة…"); later(3000)
                }
            }, bg)
        } catch (e: Exception) {
            show("تعذّر فتح الكاميرا: ${e.message}"); later(4000)
        }
    }

    private fun startPreview() {
        val d = device ?: return
        val st = texture.surfaceTexture ?: return
        try {
            st.setDefaultBufferSize(preview.width, preview.height)
            val surface = Surface(st)
            val req = d.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW).apply { addTarget(surface) }
            @Suppress("DEPRECATION")
            d.createCaptureSession(listOf(surface),
                object : CameraCaptureSession.StateCallback() {
                    override fun onConfigured(s: CameraCaptureSession) {
                        if (device == null) return
                        session = s
                        try {
                            s.setRepeatingRequest(req.build(), null, bg)
                            main.post { status.visibility = View.GONE; applyTransform() }
                        } catch (e: Exception) { show("خطأ في العرض: ${e.message}") }
                    }
                    override fun onConfigureFailed(s: CameraCaptureSession) { show("فشل إعداد عرض الكاميرا"); later(3000) }
                }, bg)
        } catch (e: Exception) { show("خطأ: ${e.message}"); later(3000) }
    }

    private fun closeCamera() {
        try { session?.close() } catch (_: Exception) {}
        try { device?.close() } catch (_: Exception) {}
        session = null; device = null
    }

    private fun later(ms: Long) {
        if (closing) return
        main.removeCallbacks(retry)
        main.postDelayed(retry, ms)
    }

    private fun show(msg: String) = main.post { status.text = msg; status.visibility = View.VISIBLE }

    /** ملء النافذة (قص من المنتصف) مع التدوير والعكس كالمرآة. */
    private fun applyTransform() {
        val vw = texture.width.toFloat(); val vh = texture.height.toFloat()
        if (vw == 0f || vh == 0f) return
        val bw = preview.width.toFloat(); val bh = preview.height.toFloat()
        val rot = DrivePrefs.cameraRotation(ctx)
        val swap = rot == 90 || rot == 270
        val rw = if (swap) bh else bw; val rh = if (swap) bw else bh
        val cx = vw / 2; val cy = vh / 2
        val m = Matrix()
        m.setScale(bw / vw, bh / vh, cx, cy)
        m.postRotate(rot.toFloat(), cx, cy)
        val s = max(vw / rw, vh / rh)
        m.postScale(s, s, cx, cy)
        if (DrivePrefs.cameraMirror(ctx)) m.postScale(-1f, 1f, cx, cy)
        texture.setTransform(m)
    }

    override fun onSurfaceTextureAvailable(s: SurfaceTexture, w: Int, h: Int) { if (bg != null) openCamera() }
    override fun onSurfaceTextureSizeChanged(s: SurfaceTexture, w: Int, h: Int) = applyTransform()
    override fun onSurfaceTextureDestroyed(s: SurfaceTexture): Boolean { closeCamera(); return true }
    override fun onSurfaceTextureUpdated(s: SurfaceTexture) {}
}
