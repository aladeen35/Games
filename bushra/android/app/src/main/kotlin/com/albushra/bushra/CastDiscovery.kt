package com.albushra.bushra

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.os.Handler
import android.os.Looper

/** يكتشف أجهزة Google Cast على الشبكة (mDNS عبر خدمة النظام) ويعيد الاسم والعنوان والمنفذ. */
class CastDiscovery(ctx: Context) {
    private val nsd = ctx.getSystemService(Context.NSD_SERVICE) as NsdManager
    private val main = Handler(Looper.getMainLooper())
    private val queue = ArrayDeque<NsdServiceInfo>()
    private val results = LinkedHashMap<String, Map<String, Any>>()
    private var resolving = false
    private var done = false

    fun discover(ms: Long, cb: (List<Map<String, Any>>) -> Unit) {
        val listener = object : NsdManager.DiscoveryListener {
            override fun onDiscoveryStarted(serviceType: String) {}
            override fun onDiscoveryStopped(serviceType: String) {}
            override fun onStartDiscoveryFailed(serviceType: String, errorCode: Int) {
                main.post { finish(cb) }
            }
            override fun onStopDiscoveryFailed(serviceType: String, errorCode: Int) {}
            override fun onServiceFound(info: NsdServiceInfo) {
                main.post {
                    queue.addLast(info)
                    next()
                }
            }
            override fun onServiceLost(info: NsdServiceInfo) {}
        }
        try {
            nsd.discoverServices("_googlecast._tcp", NsdManager.PROTOCOL_DNS_SD, listener)
        } catch (e: Exception) {
            cb(emptyList())
            return
        }
        main.postDelayed({
            try {
                nsd.stopServiceDiscovery(listener)
            } catch (e: Exception) {
            }
            finish(cb)
        }, ms)
    }

    private fun next() {
        if (resolving || done || queue.isEmpty()) return
        val info = queue.removeFirst()
        resolving = true
        try {
            @Suppress("DEPRECATION")
            nsd.resolveService(info, object : NsdManager.ResolveListener {
                override fun onResolveFailed(si: NsdServiceInfo, errorCode: Int) {
                    main.post {
                        resolving = false
                        next()
                    }
                }
                override fun onServiceResolved(si: NsdServiceInfo) {
                    main.post {
                        @Suppress("DEPRECATION")
                        val host = si.host?.hostAddress
                        if (host != null) {
                            val attrs = si.attributes
                            val fn = attrs["fn"]?.let { String(it, Charsets.UTF_8) } ?: si.serviceName ?: "Chromecast"
                            val md = attrs["md"]?.let { String(it, Charsets.UTF_8) } ?: ""
                            results[host] = mapOf("name" to fn, "host" to host, "port" to si.port, "model" to md)
                        }
                        resolving = false
                        next()
                    }
                }
            })
        } catch (e: Exception) {
            resolving = false
            main.post { next() }
        }
    }

    private fun finish(cb: (List<Map<String, Any>>) -> Unit) {
        if (done) return
        done = true
        cb(ArrayList(results.values))
    }
}
