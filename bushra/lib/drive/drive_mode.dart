import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../data/models.dart';

/// حالة وضع القيادة كما يراها الجانب الأصلي (الأذونات، الكاميرات، الإعدادات).
class DriveStatus {
  final bool overlay, camera, location, running, googleMaps, waze;
  final List<({String id, String facing})> cameras;
  final Map<String, Object?> prefs;
  const DriveStatus({
    this.overlay = false, this.camera = false, this.location = false, this.running = false,
    this.googleMaps = false, this.waze = false, this.cameras = const [], this.prefs = const {},
  });

  bool get ready => overlay && camera && location;
  bool pref(String k, bool def) => prefs[k] as bool? ?? def;
  int intPref(String k, int def) => (prefs[k] as num?)?.toInt() ?? def;
  String strPref(String k, String def) => prefs[k] as String? ?? def;

  factory DriveStatus.from(Map m) => DriveStatus(
        overlay: m['overlay'] == true, camera: m['camera'] == true, location: m['location'] == true,
        running: m['running'] == true, googleMaps: m['googleMaps'] == true, waze: m['waze'] == true,
        cameras: [
          for (final c in (m['cameras'] as List? ?? const []))
            (id: '${(c as Map)['id']}', facing: '${c['facing']}'),
        ],
        prefs: Map<String, Object?>.from(m['prefs'] as Map? ?? const {}),
      );
}

/// وضع القيادة (أندرويد فقط): الفيديو في نافذة عائمة فوق الخرائط، ومرآة الكاميرا الخلفية،
/// وقفل الصورة أثناء الحركة. التنفيذ في android/.../drive/.
class DriveMode {
  static const _ch = MethodChannel('bushra/drive');
  static bool? _supported;

  /// يُستدعى مرة عند الإقلاع حتى تكون [supported] جاهزة بلا انتظار في الواجهة.
  static Future<void> init() async {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) {
      _supported = false;
      return;
    }
    try {
      _supported = await _ch.invokeMethod<bool>('supported') ?? false;
    } catch (_) {
      _supported = false;
    }
  }

  static bool get supported => _supported ?? false;

  static Future<DriveStatus> status() async {
    try {
      final m = await _ch.invokeMethod<Map>('status');
      return m == null ? const DriveStatus() : DriveStatus.from(m);
    } catch (_) {
      return const DriveStatus();
    }
  }

  static Future<void> requestOverlay() => _ch.invokeMethod('requestOverlay');
  static Future<void> requestPermissions() => _ch.invokeMethod('requestPermissions');
  static Future<void> setPref(String key, Object? value) => _ch.invokeMethod('setPref', {'key': key, 'value': value});
  static Future<void> openMaps() => _ch.invokeMethod('maps');
  static Future<void> stop() => _ch.invokeMethod('stop');

  /// يبدأ وضع القيادة. يعيد 'ok'، أو 'overlay' إن كان إذن الظهور فوق التطبيقات ناقصًا.
  static Future<String> start(List<Playable> queue, int index, {Duration position = Duration.zero}) async {
    final q = [
      for (var i = 0; i < queue.length; i++)
        {
          'k': queue[i].key, 't': queue[i].title, 'u': queue[i].url, 'h': queue[i].headers,
          'live': queue[i].isLive, 'pos': i == index ? position.inMilliseconds : 0,
        },
    ];
    try {
      return await _ch.invokeMethod<String>('start', {'queue': q, 'index': index}) ?? 'error';
    } catch (_) {
      return 'error';
    }
  }

  /// الكاميرا والخرائط فقط (بلا فيديو).
  static Future<String> cameraOnly() async {
    try {
      final r = await _ch.invokeMethod<String>('camera') ?? 'error';
      return r;
    } catch (_) {
      return 'error';
    }
  }
}
