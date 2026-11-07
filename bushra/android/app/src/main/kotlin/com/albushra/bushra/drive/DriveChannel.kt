package com.albushra.bushra.drive

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import io.flutter.plugin.common.BinaryMessenger
import io.flutter.plugin.common.MethodChannel

/** القناة «bushra/drive» بين Flutter ووضع القيادة الأصلي. */
object DriveChannel {
    fun register(activity: Activity, messenger: BinaryMessenger) {
        MethodChannel(messenger, "bushra/drive").setMethodCallHandler { call, result ->
            val ctx = activity.applicationContext
            when (call.method) {
                "supported" -> result.success(supported(activity))
                "status" -> result.success(status(ctx))
                "requestOverlay" -> {
                    try {
                        activity.startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                            Uri.parse("package:" + activity.packageName)))
                    } catch (_: Exception) {
                        activity.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                            Uri.parse("package:" + activity.packageName)))
                    }
                    result.success(null)
                }
                "requestPermissions" -> {
                    val perms = mutableListOf(Manifest.permission.CAMERA, Manifest.permission.ACCESS_FINE_LOCATION)
                    if (Build.VERSION.SDK_INT >= 33) perms += Manifest.permission.POST_NOTIFICATIONS
                    activity.requestPermissions(perms.toTypedArray(), 7301)
                    result.success(null)
                }
                "setPref" -> {
                    DrivePrefs.set(ctx, call.argument<String>("key") ?: "", call.argument<Any>("value"))
                    result.success(null)
                }
                "start" -> {
                    if (!Settings.canDrawOverlays(ctx)) { result.success("overlay"); return@setMethodCallHandler }
                    val raw = call.argument<List<Map<String, Any?>>>("queue") ?: emptyList()
                    val queue = raw.mapNotNull { m ->
                        val url = m["u"] as? String ?: return@mapNotNull null
                        @Suppress("UNCHECKED_CAST")
                        DriveItem(
                            key = m["k"] as? String ?: url,
                            title = m["t"] as? String ?: "",
                            url = url,
                            headers = (m["h"] as? Map<String, String>) ?: emptyMap(),
                            isLive = m["live"] as? Boolean ?: false,
                            startMs = (m["pos"] as? Number)?.toLong() ?: 0L,
                        )
                    }
                    DriveService.start(ctx, queue, call.argument<Int>("index") ?: 0)
                    if (DrivePrefs.mapsOn(ctx)) openMaps(activity)
                    result.success("ok")
                }
                "camera" -> {
                    if (!Settings.canDrawOverlays(ctx)) { result.success("overlay"); return@setMethodCallHandler }
                    DriveService.toggleCamera(ctx)
                    result.success("ok")
                }
                "maps" -> { openMaps(activity); result.success(null) }
                "stop" -> { DriveService.stop(ctx); result.success(null) }
                else -> result.notImplemented()
            }
        }
    }

    /** النوافذ العائمة تحتاج أندرويد 8 فأحدث، ولا معنى لها على التلفاز. */
    fun supported(c: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return false
        val tv = (c.resources.configuration.uiMode and Configuration.UI_MODE_TYPE_MASK) == Configuration.UI_MODE_TYPE_TELEVISION
        return !tv
    }

    private fun status(c: Context): Map<String, Any?> {
        val cameras = mutableListOf<Map<String, String>>()
        try {
            val cm = c.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            for (id in cm.cameraIdList) {
                val f = cm.getCameraCharacteristics(id).get(CameraCharacteristics.LENS_FACING)
                cameras += mapOf("id" to id, "facing" to when (f) {
                    CameraCharacteristics.LENS_FACING_BACK -> "back"
                    CameraCharacteristics.LENS_FACING_FRONT -> "front"
                    else -> "external"
                })
            }
        } catch (_: Exception) {}
        val pm = c.packageManager
        return mapOf(
            "overlay" to Settings.canDrawOverlays(c),
            "camera" to (c.checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED),
            "location" to DriveSpeed.hasPermission(c),
            "running" to DriveService.running,
            "cameras" to cameras,
            "googleMaps" to (pm.getLaunchIntentForPackage("com.google.android.apps.maps") != null),
            "waze" to (pm.getLaunchIntentForPackage("com.waze") != null),
            "prefs" to DrivePrefs.all(c),
        )
    }

    private fun openMaps(a: Activity) {
        val pm = a.packageManager
        val i = pm.getLaunchIntentForPackage(DrivePrefs.mapsPackage(a))
            ?: pm.getLaunchIntentForPackage("com.google.android.apps.maps")
            ?: pm.getLaunchIntentForPackage("com.waze")
            ?: Intent(Intent.ACTION_VIEW, Uri.parse("geo:0,0?q="))
        try { a.startActivity(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } catch (_: Exception) {}
    }
}
