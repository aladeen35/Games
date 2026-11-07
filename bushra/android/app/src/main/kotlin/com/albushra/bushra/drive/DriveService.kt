package com.albushra.bushra.drive

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.provider.Settings
import com.albushra.bushra.MainActivity

/**
 * خدمة وضع القيادة: تُبقي نافذتي الفيديو والكاميرا فوق الخرائط وأي تطبيق آخر،
 * وتراقب السرعة لقفل الصورة أثناء الحركة.
 */
class DriveService : Service() {
    private var video: DriveVideoWindow? = null
    private var camera: DriveCameraWindow? = null
    private var speed: DriveSpeed? = null

    companion object {
        private const val CHANNEL = "bushra_drive"
        private const val ACTION_START = "start"
        private const val ACTION_STOP = "stop"
        private const val ACTION_CAMERA = "camera"

        /** الطابور يُمرَّر هنا لا عبر Intent (قد يكون طويلًا). */
        @Volatile private var pendingQueue: List<DriveItem> = emptyList()
        @Volatile private var pendingIndex = 0
        @Volatile var running = false
            private set

        fun start(c: Context, queue: List<DriveItem>, index: Int) {
            pendingQueue = queue
            pendingIndex = index
            c.startForegroundService(Intent(c, DriveService::class.java).setAction(ACTION_START))
        }

        fun toggleCamera(c: Context) {
            c.startForegroundService(Intent(c, DriveService::class.java).setAction(ACTION_CAMERA))
        }

        fun stop(c: Context) {
            if (running) c.startService(Intent(c, DriveService::class.java).setAction(ACTION_STOP))
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        running = true
        getSystemService(NotificationManager::class.java)
            .createNotificationChannel(NotificationChannel(CHANNEL, "وضع القيادة", NotificationManager.IMPORTANCE_LOW))
        goForeground()
        speed = DriveSpeed(this) { driving ->
            if (DrivePrefs.speedLock(this)) video?.setDriving(driving)
        }.also { it.start() }
    }

    private fun goForeground() {
        val open = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val stop = PendingIntent.getService(this, 1, Intent(this, DriveService::class.java).setAction(ACTION_STOP),
            PendingIntent.FLAG_IMMUTABLE)
        val n = Notification.Builder(this, CHANNEL)
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentTitle("البشرى — وضع القيادة")
            .setContentText("الفيديو والكاميرا تعمل فوق الخرائط")
            .setContentIntent(open)
            .addAction(Notification.Action.Builder(null, "إنهاء وضع القيادة", stop).build())
            .setOngoing(true)
            .build()
        var types = ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED)
            types = types or ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA
        if (DriveSpeed.hasPermission(this))
            types = types or ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) startForeground(7, n, types) else startForeground(7, n)
        } catch (_: Exception) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q)
                startForeground(7, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> { closeAll(); return START_NOT_STICKY }
            ACTION_START -> {
                if (!Settings.canDrawOverlays(this)) { closeAll(); return START_NOT_STICKY }
                val q = pendingQueue
                pendingQueue = emptyList()
                video?.close()
                if (q.isNotEmpty()) {
                    video = DriveVideoWindow(this, q, pendingIndex.coerceIn(0, q.size - 1)).also { w ->
                        w.onClosed = { video = null; stopIfEmpty() }
                        w.show()
                        if (DrivePrefs.speedLock(this) && speed?.driving == true) w.setDriving(true)
                    }
                }
                if (DrivePrefs.cameraOn(this) && camera == null) openCamera()
            }
            ACTION_CAMERA -> {
                if (!Settings.canDrawOverlays(this)) { stopIfEmpty(); return START_NOT_STICKY }
                if (camera != null) camera?.close() else openCamera()
            }
        }
        stopIfEmpty()
        return START_NOT_STICKY
    }

    private fun openCamera() {
        camera = DriveCameraWindow(this).also { w ->
            w.onClosed = { camera = null; stopIfEmpty() }
            w.show()
        }
    }

    private fun closeAll() {
        video?.close()
        camera?.close()
        stopIfEmpty()
    }

    private fun stopIfEmpty() {
        if (video == null && camera == null) stopSelf()
    }

    override fun onDestroy() {
        running = false
        speed?.stop()
        video?.close()
        camera?.close()
        super.onDestroy()
    }
}
