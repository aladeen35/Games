package com.albushra.bushra.drive

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/** ألوان هوية البشرى (مطابقة لـ BColors في lib/core/theme.dart). */
object DriveColors {
    const val MIDNIGHT = 0xFF080B12.toInt()
    const val CONTAINER = 0xFF171F2C.toInt()
    const val ELEVATED = 0xFF202B3A.toInt()
    const val TEAL = 0xFF27D3C2.toInt()
    const val TEAL_DEEP = 0xFF0D8F8A.toInt()
    const val GOLD = 0xFFF2B84B.toInt()
    const val PEARL = 0xFFF5F7FA.toInt()
    const val MIST = 0xFFB8C2D1.toInt()
}

/**
 * نافذة عائمة فوق كل التطبيقات (الخرائط، Android Auto…): تُسحب من شريطها،
 * ويتغير حجمها من الزاوية، وتُصغَّر بالضغط على العنوان. ترث منها نافذتا الفيديو والكاميرا.
 */
abstract class DriveWindow(
    protected val ctx: Context,
    private val key: String,
    title: String,
    defX: Float, defY: Float, defW: Float, defH: Float,
) {
    protected val wm = ctx.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    private val prefs = DrivePrefs.of(ctx)
    protected val lp: WindowManager.LayoutParams
    protected val root = FrameLayout(ctx)
    protected val actions = LinearLayout(ctx)
    protected val content = FrameLayout(ctx)
    protected val titleView = TextView(ctx)
    var onClosed: (() -> Unit)? = null
    var isShowing = false
        private set
    private var minimized = false
    private var maximized = false
    private var rx = 0; private var ry = 0; private var rw = 0; private var rh = 0

    init {
        val dm = ctx.resources.displayMetrics
        val sw = dm.widthPixels; val sh = dm.heightPixels
        lp = WindowManager.LayoutParams(
            prefs.getInt("${key}_w", (sw * defW).toInt()),
            prefs.getInt("${key}_h", (sh * defH).toInt()),
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            PixelFormat.TRANSLUCENT,
        ).apply {
            gravity = Gravity.TOP or Gravity.LEFT
            x = prefs.getInt("${key}_x", (sw * defX).toInt())
            y = prefs.getInt("${key}_y", (sh * defY).toInt())
        }
        clamp()

        root.background = GradientDrawable().apply {
            setColor(DriveColors.MIDNIGHT)
            cornerRadius = dp(14).toFloat()
            setStroke(dp(2), DriveColors.TEAL)
        }
        root.clipToOutline = true
        root.elevation = dp(10).toFloat()

        val col = LinearLayout(ctx).apply { orientation = LinearLayout.VERTICAL }
        root.addView(col, FrameLayout.LayoutParams(-1, -1))

        val bar = LinearLayout(ctx).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setBackgroundColor(DriveColors.CONTAINER)
            layoutDirection = View.LAYOUT_DIRECTION_LTR
            setPadding(dp(10), 0, dp(4), 0)
        }
        col.addView(bar, LinearLayout.LayoutParams(-1, dp(42)))

        // نقطة ذهبية (نقطة الباء في شعار البشرى) ثم العنوان
        bar.addView(View(ctx).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(DriveColors.GOLD) }
        }, LinearLayout.LayoutParams(dp(8), dp(8)).apply { marginEnd = dp(8) })
        titleView.apply {
            text = title
            setTextColor(DriveColors.PEARL)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            typeface = Typeface.DEFAULT_BOLD
            isSingleLine = true
            textDirection = View.TEXT_DIRECTION_RTL
        }
        bar.addView(titleView, LinearLayout.LayoutParams(0, -2, 1f))

        actions.orientation = LinearLayout.HORIZONTAL
        bar.addView(actions, LinearLayout.LayoutParams(-2, -1))
        addButton("⤢") { toggleMaximize() }
        addButton("–") { toggleMinimize() }
        addButton("✕") { close() }

        content.setBackgroundColor(Color.BLACK)
        col.addView(content, LinearLayout.LayoutParams(-1, 0, 1f))

        val grip = TextView(ctx).apply {
            text = "◢"
            setTextColor(DriveColors.TEAL)
            alpha = .85f
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 22f)
            gravity = Gravity.BOTTOM or Gravity.RIGHT
        }
        root.addView(grip, FrameLayout.LayoutParams(dp(44), dp(44), Gravity.BOTTOM or Gravity.RIGHT))

        bar.setOnTouchListener(DragListener())
        grip.setOnTouchListener(ResizeListener())
    }

    fun show() {
        if (isShowing) return
        wm.addView(root, lp)
        isShowing = true
        onShown()
    }

    fun close() {
        if (!isShowing) return
        onClosing()
        try { wm.removeView(root) } catch (_: Exception) {}
        isShowing = false
        onClosed?.invoke()
    }

    var focusable: Boolean
        get() = lp.flags and WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE == 0
        set(v) {
            lp.flags = if (v) lp.flags and WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE.inv()
            else lp.flags or WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
            update()
        }

    protected open fun onShown() {}
    protected open fun onClosing() {}
    protected open fun onResized() {}

    protected fun addButton(label: String, onTap: (TextView) -> Unit): TextView {
        val b = TextView(ctx).apply {
            text = label
            setTextColor(DriveColors.PEARL)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 18f)
            gravity = Gravity.CENTER
            setBackgroundResource(android.R.drawable.list_selector_background)
        }
        b.setOnClickListener { onTap(b) }
        actions.addView(b, 0, LinearLayout.LayoutParams(dp(44), -1))
        return b
    }

    protected fun dp(v: Number): Int =
        TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), ctx.resources.displayMetrics).toInt()

    private fun update() {
        if (isShowing) try { wm.updateViewLayout(root, lp) } catch (_: Exception) {}
    }

    private fun save() {
        val e = prefs.edit().putInt("${key}_x", lp.x).putInt("${key}_y", lp.y)
        if (!minimized && !maximized) e.putInt("${key}_w", lp.width).putInt("${key}_h", lp.height)
        e.apply()
    }

    private fun clamp() {
        val dm = ctx.resources.displayMetrics
        val w = if (lp.width > 0) lp.width else dp(200)
        lp.x = max(-w + dp(80), min(lp.x, dm.widthPixels - dp(80)))
        lp.y = max(0, min(lp.y, dm.heightPixels - dp(42)))
    }

    /** المحتوى يُقلَّص ولا يُخفى، فيستمر الصوت في الخلفية. */
    private fun toggleMinimize() {
        if (!minimized) {
            if (maximized) toggleMaximize()
            rh = lp.height
            lp.height = dp(43)
            minimized = true
        } else {
            lp.height = rh
            minimized = false
        }
        update(); onResized()
    }

    private fun toggleMaximize() {
        val dm = ctx.resources.displayMetrics
        if (minimized) toggleMinimize()
        if (!maximized) {
            rx = lp.x; ry = lp.y; rw = lp.width; rh = lp.height
            lp.x = dp(8); lp.y = dp(8)
            lp.width = dm.widthPixels - dp(16)
            lp.height = dm.heightPixels - dp(16)
            maximized = true
        } else {
            lp.x = rx; lp.y = ry; lp.width = rw; lp.height = rh
            maximized = false
        }
        update(); onResized()
    }

    private inner class DragListener : View.OnTouchListener {
        var dx0 = 0f; var dy0 = 0f; var sx = 0; var sy = 0; var moved = false

        @SuppressLint("ClickableViewAccessibility")
        override fun onTouch(v: View, e: MotionEvent): Boolean {
            when (e.actionMasked) {
                MotionEvent.ACTION_DOWN -> { dx0 = e.rawX; dy0 = e.rawY; sx = lp.x; sy = lp.y; moved = false }
                MotionEvent.ACTION_MOVE -> {
                    val dx = e.rawX - dx0; val dy = e.rawY - dy0
                    if (abs(dx) + abs(dy) > dp(4)) moved = true
                    lp.x = sx + dx.toInt(); lp.y = sy + dy.toInt()
                    clamp(); update()
                }
                MotionEvent.ACTION_UP -> { if (!moved) toggleMinimize(); save() }
            }
            return true
        }
    }

    private inner class ResizeListener : View.OnTouchListener {
        var dx0 = 0f; var dy0 = 0f; var sw = 0; var sh = 0

        @SuppressLint("ClickableViewAccessibility")
        override fun onTouch(v: View, e: MotionEvent): Boolean {
            when (e.actionMasked) {
                MotionEvent.ACTION_DOWN -> {
                    if (minimized) toggleMinimize()
                    maximized = false
                    dx0 = e.rawX; dy0 = e.rawY; sw = lp.width; sh = lp.height
                }
                MotionEvent.ACTION_MOVE -> {
                    lp.width = max(dp(220), sw + (e.rawX - dx0).toInt())
                    lp.height = max(dp(150), sh + (e.rawY - dy0).toInt())
                    update(); onResized()
                }
                MotionEvent.ACTION_UP -> save()
            }
            return true
        }
    }
}
