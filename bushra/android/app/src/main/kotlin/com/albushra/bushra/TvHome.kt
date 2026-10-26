package com.albushra.bushra

import android.content.Context
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import androidx.tvprovider.media.tv.PreviewChannel
import androidx.tvprovider.media.tv.PreviewChannelHelper
import androidx.tvprovider.media.tv.PreviewProgram
import androidx.tvprovider.media.tv.TvContractCompat
import androidx.tvprovider.media.tv.WatchNextProgram

/** الشاشة الرئيسية في Android TV: صف «تابع المشاهدة» وقناة «البشرى — المفضلة». */
object TvHome {
    private const val PREFS = "bushra_tv"

    fun sync(ctx: Context, args: Map<*, *>?) {
        if (args == null) return
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        if (!ctx.packageManager.hasSystemFeature(PackageManager.FEATURE_LEANBACK)) return
        try {
            syncWatchNext(ctx, args["next"] as? List<*> ?: emptyList<Any>())
        } catch (e: Exception) {
        }
        try {
            syncChannel(ctx, args["favs"] as? List<*> ?: emptyList<Any>())
        } catch (e: Exception) {
        }
    }

    private fun link(key: String): Uri = Uri.parse("bushra://play?k=" + Uri.encode(key))

    @RequiresApi(Build.VERSION_CODES.O)
    private fun syncWatchNext(ctx: Context, items: List<*>) {
        val cr = ctx.contentResolver
        // يعيد المزود برامج تطبيقنا فقط
        val existing = HashMap<String, WatchNextProgram>()
        cr.query(TvContractCompat.WatchNextPrograms.CONTENT_URI, WatchNextProgram.PROJECTION, null, null, null)?.use { c ->
            while (c.moveToNext()) {
                val p = WatchNextProgram.fromCursor(c)
                val id = p.internalProviderId
                if (id != null) existing[id] = p
            }
        }
        val keep = HashSet<String>()
        for (raw in items) {
            val m = raw as? Map<*, *> ?: continue
            val key = m["key"] as? String ?: continue
            keep.add(key)
            val old = existing[key]
            // أزاله المستخدم من الشاشة الرئيسية: لا نعيده
            if (old != null && !old.isBrowsable) continue
            val b = WatchNextProgram.Builder()
            b.setType(if (m["type"] == "episode") TvContractCompat.WatchNextPrograms.TYPE_TV_EPISODE else TvContractCompat.WatchNextPrograms.TYPE_MOVIE)
            b.setWatchNextType(TvContractCompat.WatchNextPrograms.WATCH_NEXT_TYPE_CONTINUE)
            b.setLastEngagementTimeUtcMillis((m["at"] as? Number)?.toLong() ?: System.currentTimeMillis())
            b.setTitle(m["title"] as? String ?: "")
            b.setDescription(m["desc"] as? String ?: "")
            b.setIntentUri(link(key))
            b.setInternalProviderId(key)
            b.setLastPlaybackPositionMillis((m["pos"] as? Number)?.toInt() ?: 0)
            b.setDurationMillis((m["dur"] as? Number)?.toInt() ?: 0)
            val img = m["img"] as? String
            if (!img.isNullOrEmpty()) b.setPosterArtUri(Uri.parse(img))
            val values = b.build().toContentValues()
            if (old != null) {
                cr.update(TvContractCompat.buildWatchNextProgramUri(old.id), values, null, null)
            } else {
                cr.insert(TvContractCompat.WatchNextPrograms.CONTENT_URI, values)
            }
        }
        for ((key, p) in existing) {
            if (!keep.contains(key)) cr.delete(TvContractCompat.buildWatchNextProgramUri(p.id), null, null)
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun syncChannel(ctx: Context, items: List<*>) {
        val helper = PreviewChannelHelper(ctx)
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        var channelId = prefs.getLong("channel", -1L)
        if (channelId != -1L && helper.getPreviewChannel(channelId) == null) channelId = -1L
        if (channelId == -1L) {
            if (items.isEmpty()) return
            val logo = BitmapFactory.decodeResource(ctx.resources, R.drawable.splash_mark)
            val ch = PreviewChannel.Builder()
                .setDisplayName("البشرى — المفضلة")
                .setAppLinkIntentUri(Uri.parse("bushra://home"))
                .setInternalProviderId("bushra_favs")
                .setLogo(logo)
                .build()
            channelId = helper.publishDefaultChannel(ch)
            prefs.edit().putLong("channel", channelId).apply()
        }
        // نعيد نشر البرامج: نحذف السابقة ثم نضيف الحالية
        for (id in prefs.getStringSet("programs", emptySet()) ?: emptySet<String>()) {
            try {
                helper.deletePreviewProgram(id.toLong())
            } catch (e: Exception) {
            }
        }
        val ids = HashSet<String>()
        for (raw in items) {
            val m = raw as? Map<*, *> ?: continue
            val key = m["key"] as? String ?: continue
            val live = m["live"] == true
            val b = PreviewProgram.Builder()
            b.setChannelId(channelId)
            b.setType(if (live) TvContractCompat.PreviewPrograms.TYPE_CHANNEL else TvContractCompat.PreviewPrograms.TYPE_MOVIE)
            b.setTitle(m["title"] as? String ?: "")
            b.setDescription(m["desc"] as? String ?: "")
            b.setIntentUri(link(key))
            b.setInternalProviderId(key)
            b.setLive(live)
            val img = m["img"] as? String
            if (!img.isNullOrEmpty()) {
                b.setPosterArtUri(Uri.parse(img))
                b.setPosterArtAspectRatio(if (live) TvContractCompat.PreviewPrograms.ASPECT_RATIO_1_1 else TvContractCompat.PreviewPrograms.ASPECT_RATIO_2_3)
            }
            ids.add(helper.publishPreviewProgram(b.build()).toString())
        }
        prefs.edit().putStringSet("programs", ids).apply()
    }
}
