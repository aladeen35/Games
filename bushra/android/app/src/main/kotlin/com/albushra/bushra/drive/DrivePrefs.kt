package com.albushra.bushra.drive

import android.content.Context
import android.content.SharedPreferences

/** إعدادات وضع القيادة (تُقرأ من الخدمة الأصلية وتُعدَّل من شاشة الإعدادات في Flutter). */
object DrivePrefs {
    fun of(c: Context): SharedPreferences = c.getSharedPreferences("bushra_drive", Context.MODE_PRIVATE)

    fun speedLock(c: Context) = of(c).getBoolean("speed_lock", true)
    fun speedKmh(c: Context) = of(c).getInt("speed_kmh", 8)
    /** true: إيقاف الفيديو تمامًا أثناء الحركة. false: تختفي الصورة ويبقى الصوت. */
    fun pauseWhileDriving(c: Context) = of(c).getBoolean("pause", false)
    fun cameraOn(c: Context) = of(c).getBoolean("camera_on", true)
    fun cameraId(c: Context) = of(c).getString("cam_id", "") ?: ""
    fun cameraMirror(c: Context) = of(c).getBoolean("cam_mirror", true)
    fun cameraRotation(c: Context) = of(c).getInt("cam_rot", 0)
    fun mapsOn(c: Context) = of(c).getBoolean("maps_on", true)
    fun mapsPackage(c: Context) = of(c).getString("maps_pkg", "com.google.android.apps.maps") ?: ""

    fun all(c: Context): Map<String, Any> = mapOf(
        "speed_lock" to speedLock(c), "speed_kmh" to speedKmh(c), "pause" to pauseWhileDriving(c),
        "camera_on" to cameraOn(c), "cam_id" to cameraId(c), "cam_mirror" to cameraMirror(c),
        "cam_rot" to cameraRotation(c), "maps_on" to mapsOn(c), "maps_pkg" to mapsPackage(c),
    )

    fun set(c: Context, key: String, value: Any?) {
        val e = of(c).edit()
        when (value) {
            is Boolean -> e.putBoolean(key, value)
            is Int -> e.putInt(key, value)
            is Long -> e.putInt(key, value.toInt())
            is String -> e.putString(key, value)
            null -> e.remove(key)
        }
        e.apply()
    }
}
