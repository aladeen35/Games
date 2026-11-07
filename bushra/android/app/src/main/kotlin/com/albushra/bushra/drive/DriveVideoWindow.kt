package com.albushra.bushra.drive

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.TypedValue
import android.view.Gravity
import android.view.TextureView
import android.view.View
import android.widget.FrameLayout
import android.widget.TextView
import androidx.media3.common.MediaItem
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.common.VideoSize
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory

/** قناة أو فيديو في طابور وضع القيادة. */
data class DriveItem(
    val key: String,
    val title: String,
    val url: String,
    val headers: Map<String, String>,
    val isLive: Boolean,
    val startMs: Long,
)

/** نافذة الفيديو العائمة: مشغل ExoPlayer مستقل مع التنقل بين القنوات وقفل السرعة. */
class DriveVideoWindow(
    ctx: Context,
    private val queue: List<DriveItem>,
    private var index: Int,
) : DriveWindow(ctx, "drive_video", "البشرى", .02f, .42f, .44f, .52f) {

    private val main = Handler(Looper.getMainLooper())
    private val texture = TextureView(ctx)
    private val status = TextView(ctx)
    private val cover = TextView(ctx)
    private var player: ExoPlayer? = null
    private var playBtn: TextView? = null
    private var muteBtn: TextView? = null
    private var videoW = 16; private var videoH = 9
    private var retries = 0
    private val retry = Runnable { play(resume = true) }

    init {
        content.addView(texture, FrameLayout.LayoutParams(-1, -1, Gravity.CENTER))

        status.apply {
            setTextColor(DriveColors.MIST)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            gravity = Gravity.CENTER
            setPadding(dp(12), dp(12), dp(12), dp(12))
        }
        content.addView(status, FrameLayout.LayoutParams(-1, -1))

        cover.apply {
            setTextColor(DriveColors.PEARL)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 16f)
            gravity = Gravity.CENTER
            setBackgroundColor(0xF2080B12.toInt())
            visibility = View.GONE
            isClickable = true // يمنع اللمس أثناء القفل
        }
        content.addView(cover, FrameLayout.LayoutParams(-1, -1))

        // الأزرار تُضاف من اليمين لليسار: (فتح في البشرى) (السابق) (تشغيل) (التالي) (الصوت)
        muteBtn = addButton("🔊") { toggleMute() }
        if (queue.size > 1) addButton("⏭") { step(1) }
        playBtn = addButton("⏸") { togglePlay() }
        if (queue.size > 1) addButton("⏮") { step(-1) }
        addButton("↗") { openInApp() }
    }

    override fun onShown() { play(resume = false) }

    override fun onClosing() {
        main.removeCallbacks(retry)
        player?.release()
        player = null
    }

    override fun onResized() { fitVideo() }

    private fun current() = queue[index]

    private fun play(resume: Boolean) {
        val item = current()
        titleView.text = item.title
        status.text = "جارٍ التشغيل…"
        status.visibility = View.VISIBLE
        val p = player ?: buildPlayer().also { player = it }
        val headers = item.headers.filterKeys { !it.equals("User-Agent", true) }
        val ua = item.headers.entries.firstOrNull { it.key.equals("User-Agent", true) }?.value
        val http = DefaultHttpDataSource.Factory()
            .setAllowCrossProtocolRedirects(true)
            .setDefaultRequestProperties(headers)
            .setConnectTimeoutMs(12000)
            .setReadTimeoutMs(15000)
        if (ua != null) http.setUserAgent(ua)
        val source = DefaultMediaSourceFactory(ctx).setDataSourceFactory(http)
            .createMediaSource(MediaItem.fromUri(Uri.parse(item.url)))
        val pos = if (resume && !item.isLive) p.currentPosition else item.startMs
        p.setMediaSource(source, !item.isLive && pos > 0)
        if (!item.isLive && pos > 0) p.seekTo(pos)
        p.prepare()
        p.playWhenReady = true
    }

    private fun buildPlayer(): ExoPlayer {
        val p = ExoPlayer.Builder(ctx).build()
        p.setVideoTextureView(texture)
        p.addListener(object : Player.Listener {
            override fun onPlaybackStateChanged(state: Int) {
                when (state) {
                    Player.STATE_READY -> { status.visibility = View.GONE; retries = 0 }
                    Player.STATE_BUFFERING -> if (status.visibility != View.VISIBLE) {
                        status.text = "جارٍ التحميل…"; status.visibility = View.VISIBLE
                    }
                    Player.STATE_ENDED -> if (queue.size > 1 && !current().isLive) step(1)
                    else -> {}
                }
            }

            override fun onIsPlayingChanged(isPlaying: Boolean) {
                playBtn?.text = if (isPlaying || player?.playWhenReady == true) "⏸" else "▶"
            }

            override fun onVideoSizeChanged(size: VideoSize) {
                if (size.width > 0 && size.height > 0) {
                    videoW = (size.width * size.pixelWidthHeightRatio).toInt()
                    videoH = size.height
                    fitVideo()
                }
            }

            override fun onPlayerError(error: PlaybackException) {
                retries++
                if (error.errorCode == PlaybackException.ERROR_CODE_BEHIND_LIVE_WINDOW) {
                    player?.seekToDefaultPosition(); player?.prepare(); return
                }
                status.text = "تعذّر التشغيل — إعادة المحاولة (${retries})…"
                status.visibility = View.VISIBLE
                main.removeCallbacks(retry)
                main.postDelayed(retry, minOf(15000L, 2500L * retries))
            }
        })
        return p
    }

    /** ملاءمة الفيديو داخل النافذة مع الحفاظ على النسبة. */
    private fun fitVideo() {
        content.post {
            val cw = content.width; val ch = content.height
            if (cw == 0 || ch == 0) return@post
            val r = videoW.toFloat() / videoH
            val (w, h) = if (cw.toFloat() / ch > r) Pair((ch * r).toInt(), ch) else Pair(cw, (cw / r).toInt())
            val lp = texture.layoutParams as FrameLayout.LayoutParams
            if (lp.width != w || lp.height != h) {
                lp.width = w; lp.height = h; lp.gravity = Gravity.CENTER
                texture.layoutParams = lp
            }
        }
    }

    private fun step(d: Int) {
        if (queue.size < 2) return
        index = (index + d + queue.size) % queue.size
        main.removeCallbacks(retry)
        retries = 0
        play(resume = false)
    }

    private fun togglePlay() {
        val p = player ?: return
        p.playWhenReady = !p.playWhenReady
        if (p.playWhenReady && current().isLive) { p.seekToDefaultPosition(); p.prepare() }
        playBtn?.text = if (p.playWhenReady) "⏸" else "▶"
    }

    private fun toggleMute() {
        val p = player ?: return
        p.volume = if (p.volume > 0f) 0f else 1f
        muteBtn?.text = if (p.volume > 0f) "🔊" else "🔇"
    }

    /** يرجع للتطبيق ويفتح القناة نفسها بملء الشاشة. */
    private fun openInApp() {
        val i = Intent(Intent.ACTION_VIEW, Uri.parse("bushra://play?k=" + Uri.encode(current().key)))
            .setPackage(ctx.packageName)
            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try { ctx.startActivity(i) } catch (_: Exception) {}
        DriveService.stop(ctx)
    }

    /** يُستدعى من الخدمة عند تغيّر حالة الحركة. */
    fun setDriving(driving: Boolean) {
        if (driving) {
            if (DrivePrefs.pauseWhileDriving(ctx)) {
                player?.playWhenReady = false
                cover.text = "🚗\nتم إيقاف الفيديو أثناء القيادة\nاضغط ▶ بعد التوقف"
            } else {
                cover.text = "🚗\nالصورة متوقفة أثناء القيادة\nالصوت مستمر — تعود الصورة عند التوقف"
            }
            cover.visibility = View.VISIBLE
        } else {
            cover.visibility = View.GONE
        }
    }
}
