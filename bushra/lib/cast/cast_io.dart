import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// جهاز Chromecast أو تلفاز يدعم Google Cast على الشبكة.
class CastDevice {
  final String name, host, model;
  final int port;
  const CastDevice(this.name, this.host, this.port, [this.model = '']);
}

const _ch = MethodChannel('bushra/cast');

bool get castSupported => Platform.isAndroid;

/// اكتشاف الأجهزة عبر خدمة الشبكة في أندرويد (mDNS: _googlecast._tcp).
Future<List<CastDevice>> discoverCast() async {
  if (!castSupported) return const [];
  try {
    final l = await _ch.invokeMethod<List>('discover', {'ms': 4500}) ?? const [];
    return [
      for (final m in l)
        if (m is Map) CastDevice('${m['name']}', '${m['host']}', (m['port'] as num?)?.toInt() ?? 8009, '${m['model'] ?? ''}')
    ];
  } catch (_) {
    return const [];
  }
}

const _nsConn = 'urn:x-cast:com.google.cast.tp.connection';
const _nsBeat = 'urn:x-cast:com.google.cast.tp.heartbeat';
const _nsRecv = 'urn:x-cast:com.google.cast.receiver';
const _nsMedia = 'urn:x-cast:com.google.cast.media';
/// مشغّل الوسائط الافتراضي في Chromecast.
const _appId = 'CC1AD845';

/// رسالة CastMessage بترميز protobuf يدوي (الحقول: 1 الإصدار، 2 المرسل، 3 المستقبل، 4 النطاق، 5 النوع، 6 النص).
Uint8List encodeCastMessage(String src, String dst, String ns, String payload) {
  final b = BytesBuilder();
  void varint(int v) {
    while (v >= 0x80) {
      b.addByte((v & 0x7f) | 0x80);
      v >>= 7;
    }
    b.addByte(v);
  }
  void str(int field, String s) {
    final bytes = utf8.encode(s);
    varint(field << 3 | 2);
    varint(bytes.length);
    b.add(bytes);
  }
  varint(1 << 3);
  varint(0);
  str(2, src);
  str(3, dst);
  str(4, ns);
  varint(5 << 3);
  varint(0);
  str(6, payload);
  final body = b.toBytes();
  final n = body.length;
  return Uint8List.fromList([(n >> 24) & 255, (n >> 16) & 255, (n >> 8) & 255, n & 255, ...body]);
}

/// يفك رسالة واحدة (بلا بادئة الطول) إلى (المرسل، المستقبل، النطاق، النص).
({String src, String dst, String ns, String payload}) decodeCastMessage(Uint8List m) {
  var i = 0;
  int varint() {
    var shift = 0, v = 0;
    while (true) {
      final x = m[i++];
      v |= (x & 0x7f) << shift;
      if (x < 0x80) return v;
      shift += 7;
    }
  }
  final f = <int, String>{};
  while (i < m.length) {
    final key = varint();
    final wire = key & 7, field = key >> 3;
    if (wire == 0) {
      varint();
    } else if (wire == 2) {
      final len = varint();
      if (field <= 6) f[field] = utf8.decode(m.sublist(i, i + len), allowMalformed: true);
      i += len;
    } else {
      break;
    }
  }
  return (src: f[2] ?? '', dst: f[3] ?? '', ns: f[4] ?? '', payload: f[6] ?? '');
}

/// جلسة عرض على Chromecast بالبروتوكول CASTV2 مباشرة (اتصال TLS على المنفذ 8009).
class CastSession extends ChangeNotifier {
  final CastDevice device;
  CastSession._(this.device);

  SecureSocket? _sock;
  final _buf = BytesBuilder();
  String? _transport, _sessionId;
  int? _media;
  int _req = 1;
  Timer? _ping, _poll;
  Completer<void>? _launch;
  bool _closed = false;

  /// connecting · loading · PLAYING · PAUSED · BUFFERING · IDLE · ended · error · closed
  String state = 'connecting';
  String? error;
  double position = 0, duration = 0;
  bool get playing => state == 'PLAYING' || state == 'BUFFERING';

  static Future<CastSession> connect(CastDevice d) async {
    final c = CastSession._(d);
    c._sock = await SecureSocket.connect(d.host, d.port, onBadCertificate: (_) => true, timeout: const Duration(seconds: 6));
    c._sock!.listen(c._onData, onError: (_) => c._fail('انقطع الاتصال بالجهاز'), onDone: () => c._fail('انقطع الاتصال بالجهاز'));
    c._send('receiver-0', _nsConn, {'type': 'CONNECT'});
    c._ping = Timer.periodic(const Duration(seconds: 5), (_) => c._send('receiver-0', _nsBeat, {'type': 'PING'}));
    c._launch = Completer();
    c._send('receiver-0', _nsRecv, {'type': 'LAUNCH', 'appId': _appId, 'requestId': c._req++});
    await c._launch!.future.timeout(const Duration(seconds: 15));
    return c;
  }

  void _send(String dst, String ns, Map<String, dynamic> payload) {
    if (_closed) return;
    try {
      _sock?.add(encodeCastMessage('sender-0', dst, ns, jsonEncode(payload)));
    } catch (_) {}
  }

  void _onData(Uint8List data) {
    _buf.add(data);
    var bytes = _buf.takeBytes();
    var off = 0;
    while (bytes.length - off >= 4) {
      final n = (bytes[off] << 24) | (bytes[off + 1] << 16) | (bytes[off + 2] << 8) | bytes[off + 3];
      if (bytes.length - off - 4 < n) break;
      _onMessage(decodeCastMessage(Uint8List.sublistView(bytes, off + 4, off + 4 + n)));
      off += 4 + n;
    }
    if (off < bytes.length) _buf.add(bytes.sublist(off));
  }

  void _onMessage(({String src, String dst, String ns, String payload}) m) {
    Map<String, dynamic> j;
    try {
      j = Map<String, dynamic>.from(jsonDecode(m.payload));
    } catch (_) {
      return;
    }
    final type = '${j['type']}';
    if (m.ns == _nsBeat && type == 'PING') return _send(m.src, _nsBeat, {'type': 'PONG'});
    if (m.ns == _nsConn && type == 'CLOSE') return _fail('أُغلق العرض على الجهاز', closed: true);
    if (m.ns == _nsRecv && type == 'RECEIVER_STATUS') {
      final apps = (j['status']?['applications'] as List?) ?? const [];
      final app = apps.cast<Map>().where((a) => a['appId'] == _appId).firstOrNull;
      if (app != null && _transport == null) {
        _transport = '${app['transportId']}';
        _sessionId = '${app['sessionId']}';
        _send(_transport!, _nsConn, {'type': 'CONNECT'});
        if (!(_launch?.isCompleted ?? true)) _launch!.complete();
      } else if (app == null && _transport != null) {
        _fail('أُغلق العرض على الجهاز', closed: true);
      }
      return;
    }
    if (m.ns == _nsRecv && type == 'LAUNCH_ERROR') {
      if (!(_launch?.isCompleted ?? true)) _launch!.completeError(StateError('launch'));
      return;
    }
    if (m.ns == _nsMedia) {
      if (type == 'LOAD_FAILED' || type == 'LOAD_CANCELLED' || type == 'INVALID_REQUEST') {
        return _fail('تعذّر تشغيل هذا الرابط على الجهاز. قد يكون بثًا غير مشفّر أو بصيغة لا يدعمها Chromecast.');
      }
      if (type == 'MEDIA_STATUS') {
        final st = (j['status'] as List?) ?? const [];
        if (st.isEmpty) return;
        final s = Map<String, dynamic>.from(st.first);
        _media = (s['mediaSessionId'] as num?)?.toInt() ?? _media;
        position = (s['currentTime'] as num?)?.toDouble() ?? position;
        final d = (s['media'] is Map) ? (s['media']['duration'] as num?)?.toDouble() : null;
        if (d != null && d > 0) duration = d;
        final ps = '${s['playerState'] ?? state}';
        if (ps == 'IDLE') {
          final why = '${s['idleReason'] ?? ''}';
          if (why == 'ERROR') return _fail('تعذّر تشغيل هذا الرابط على الجهاز. قد يكون بثًا غير مشفّر أو بصيغة لا يدعمها Chromecast.');
          state = why == 'FINISHED' ? 'ended' : 'IDLE';
        } else {
          state = ps;
        }
        notifyListeners();
      }
    }
  }

  void _fail(String msg, {bool closed = false}) {
    if (_closed) return;
    error = closed ? null : msg;
    state = closed ? 'closed' : 'error';
    if (!(_launch?.isCompleted ?? true)) _launch!.completeError(StateError(msg));
    notifyListeners();
  }

  static String _type(String url) {
    final u = url.toLowerCase().split('?').first;
    if (u.endsWith('.m3u8') || u.contains('m3u8')) return 'application/x-mpegURL';
    if (u.endsWith('.ts')) return 'video/mp2t';
    if (u.endsWith('.mkv')) return 'video/x-matroska';
    if (u.endsWith('.webm')) return 'video/webm';
    if (u.endsWith('.mpd')) return 'application/dash+xml';
    return 'video/mp4';
  }

  Future<void> load({required String url, required String title, String? image, bool live = false, double start = 0}) async {
    if (_transport == null) return;
    state = 'loading';
    notifyListeners();
    _send(_transport!, _nsMedia, {
      'type': 'LOAD', 'requestId': _req++, 'sessionId': _sessionId, 'autoplay': true, 'currentTime': start,
      'media': {
        'contentId': url, 'contentType': _type(url), 'streamType': live ? 'LIVE' : 'BUFFERED',
        'metadata': {'metadataType': 0, 'title': title, if (image != null) 'images': [{'url': image}]},
      },
    });
    _poll?.cancel();
    _poll = Timer.periodic(const Duration(seconds: 2), (_) {
      if (_transport != null) _send(_transport!, _nsMedia, {'type': 'GET_STATUS', 'requestId': _req++});
    });
  }

  void _cmd(String type, [Map<String, dynamic> extra = const {}]) {
    if (_transport == null || _media == null) return;
    _send(_transport!, _nsMedia, {'type': type, 'mediaSessionId': _media, 'requestId': _req++, ...extra});
  }

  Future<void> play() async => _cmd('PLAY');
  Future<void> pause() async => _cmd('PAUSE');
  Future<void> seek(double secs) async => _cmd('SEEK', {'currentTime': secs < 0 ? 0 : secs});

  /// يوقف العرض على الجهاز ويغلق الاتصال.
  Future<void> close() async {
    if (_closed) return;
    _cmd('STOP');
    if (_sessionId != null) _send('receiver-0', _nsRecv, {'type': 'STOP', 'sessionId': _sessionId, 'requestId': _req++});
    _closed = true;
    _ping?.cancel();
    _poll?.cancel();
    await Future.delayed(const Duration(milliseconds: 150));
    try {
      await _sock?.close();
    } catch (_) {}
    _sock = null;
  }
}
