package com.albushra.bushra.drive

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper

/** يراقب سرعة GPS ويبلّغ عند بدء الحركة أو التوقف (مع تأخير بسيط لمنع التذبذب). */
class DriveSpeed(private val ctx: Context, private val onChange: (Boolean) -> Unit) : LocationListener {
    private var lm: LocationManager? = null
    var driving = false
        private set
    private var belowSince = 0L

    companion object {
        fun hasPermission(c: Context) =
            c.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
    }

    @SuppressLint("MissingPermission")
    fun start() {
        if (!hasPermission(ctx)) return
        val m = ctx.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        lm = m
        try {
            if (m.isProviderEnabled(LocationManager.GPS_PROVIDER))
                m.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000L, 0f, this, Looper.getMainLooper())
        } catch (_: Exception) {}
    }

    fun stop() {
        try { lm?.removeUpdates(this) } catch (_: Exception) {}
        lm = null
    }

    override fun onLocationChanged(loc: Location) {
        if (!loc.hasSpeed()) return
        val kmh = loc.speed * 3.6f
        val limit = DrivePrefs.speedKmh(ctx)
        val now = System.currentTimeMillis()
        if (!driving && kmh >= limit) {
            driving = true
            belowSince = 0
            onChange(true)
        } else if (driving) {
            if (kmh < maxOf(1, limit - 3)) {
                if (belowSince == 0L) belowSince = now
                else if (now - belowSince > 3000) {
                    driving = false
                    onChange(false)
                }
            } else belowSince = 0
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
    override fun onProviderEnabled(provider: String) {}
    override fun onProviderDisabled(provider: String) {}
}
