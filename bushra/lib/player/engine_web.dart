import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:ui_web' as ui_web;
import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;
import '../data/models.dart';
import '../data/net.dart';
import 'engine.dart';

Engine createEngine() => WebEngine();

int _seq = 0;

/// مشغل الويب: عنصر <video> أصلي، مع HLS.js عبر MediaSource عند توفره، و mpegts.js
/// لبث MPEG-TS، أو HLS الأصلي في المتصفحات التي تدعمه (Safari). يُكشف ذلك بالقدرات لا بالافتراض.
class WebEngine extends Engine {
  late final web.HTMLVideoElement _v;
  late final String _viewType;
  JSObject? _hls, _ts;
  Playable? _p;
  bool _live = false;
  final _subs = <StreamSubscription>[];
  bool _recovered = false;

  WebEngine() {
    _viewType = 'bushra-video-${_seq++}';
    _v = web.document.createElement('video') as web.HTMLVideoElement
      ..autoplay = true
      ..controls = false
      ..setAttribute('playsinline', 'true');
    _v.style
      ..width = '100%'
      ..height = '100%'
      ..backgroundColor = '#05070B'
      ..objectFit = 'contain'
      ..pointerEvents = 'none';
    ui_web.platformViewRegistry.registerViewFactory(_viewType, (int _) => _v);
    void on(String ev, void Function() f) => _subs.add(web.EventStreamProvider<web.Event>(ev).forTarget(_v).listen((_) => f()));
    on('loadedmetadata', _tick);
    on('durationchange', _tick);
    on('timeupdate', _tick);
    on('progress', _tick);
    on('playing', () { phase = Phase.playing; _tick(); });
    on('pause', () { if (phase != Phase.error && phase != Phase.ended) phase = Phase.paused; _tick(); });
    on('waiting', () { if (phase != Phase.error) phase = Phase.buffering; notifyListeners(); });
    on('ended', () { phase = _live ? Phase.buffering : Phase.ended; notifyListeners(); });
    on('error', () {
      final code = _v.error?.code ?? 0;
      _fail(code == 4 ? FailKind.unsupported : FailKind.network, 'MediaError $code ${_v.error?.message ?? ''}');
    });
  }

  @override
  bool get isLive => _live;

  void _tick() {
    final d = _v.duration;
    if (d.isInfinite) _live = true;
    duration = _live || d.isNaN ? Duration.zero : Duration(milliseconds: (d * 1000).round());
    position = Duration(milliseconds: (_v.currentTime * 1000).round());
    final b = _v.buffered;
    buffered = b.length > 0 ? Duration(milliseconds: (b.end(b.length - 1) * 1000).round()) : Duration.zero;
    videoSize = Size(_v.videoWidth.toDouble(), _v.videoHeight.toDouble());
    notifyListeners();
  }

  void _fail(FailKind k, String tech) {
    fail = k;
    technicalError = tech;
    phase = Phase.error;
    notifyListeners();
  }

  void _teardown() {
    _hls?.callMethod('destroy'.toJS);
    _hls = null;
    if (_ts != null) {
      try {
        _ts!.callMethod('pause'.toJS);
        _ts!.callMethod('unload'.toJS);
        _ts!.callMethod('detachMediaElement'.toJS);
        _ts!.callMethod('destroy'.toJS);
      } catch (_) {}
      _ts = null;
    }
    _v.removeAttribute('src');
    _v.load();
  }

  String _route(String url) {
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;
    if (Net.corsProxy.isNotEmpty) return Net.wrap(url).toString();
    return url;
  }

  @override
  Future<void> open(Playable p, {Duration? startAt}) async {
    _teardown();
    _p = p;
    _recovered = false;
    phase = Phase.connecting;
    fail = null;
    technicalError = null;
    _live = p.isLive;
    position = duration = Duration.zero;
    protocol = p.isLocal ? 'ملف محلي' : Engine.protocolOf(p.url);
    notifyListeners();

    final pageHttps = web.window.location.protocol == 'https:';
    if (pageHttps && p.url.startsWith('http:') && Net.corsProxy.isEmpty) {
      _fail(FailKind.mixedContent, 'http stream on https page');
      return;
    }
    _v.playbackRate = speed;
    _v.volume = volume;
    final hlsCtor = globalContext['Hls'] as JSFunction?;
    final mpegts = globalContext['mpegts'] as JSObject?;
    final nativeHls = _v.canPlayType('application/vnd.apple.mpegurl').isNotEmpty;
    final hlsOk = hlsCtor != null && (hlsCtor.getProperty<JSFunction>('isSupported'.toJS).callAsFunction() as JSBoolean).toDart;

    if (protocol == 'HLS' && hlsOk) {
      pipeline = 'HLS.js (MediaSource)';
      final cfg = JSObject()
        ..['enableWorker'] = true.toJS
        ..['lowLatencyMode'] = false.toJS
        ..['backBufferLength'] = 30.toJS
        ..['manifestLoadingMaxRetry'] = 2.toJS;
      if (Net.corsProxy.isNotEmpty) {
        cfg['xhrSetup'] = ((JSObject xhr, JSString url) {
          final orig = url.toDart;
          xhr.callMethod('open'.toJS, 'GET'.toJS, Net.wrap(orig).toString().toJS, true.toJS);
          // يبقى عنوان الأساس هو الأصلي كي تُحلّ المقاطع النسبية بشكل صحيح
          final desc = JSObject()..['get'] = (() => orig.toJS).toJS;
          (globalContext['Object'] as JSObject).callMethod('defineProperty'.toJS, xhr, 'responseURL'.toJS, desc);
        }).toJS;
      }
      final h = hlsCtor.callAsConstructor<JSObject>(cfg);
      _hls = h;
      h.callMethod('on'.toJS, 'hlsError'.toJS, ((JSString _, JSObject data) {
        if (_hls != h) return;
        final fatal = (data['fatal'] as JSBoolean?)?.toDart ?? false;
        if (!fatal) return;
        final type = (data['type'] as JSString?)?.toDart ?? '';
        final details = (data['details'] as JSString?)?.toDart ?? '';
        final code = ((data['response'] as JSObject?)?['code'] as JSNumber?)?.toDartInt ?? 0;
        if (type == 'mediaError' && !_recovered) {
          _recovered = true;
          h.callMethod('recoverMediaError'.toJS);
          return;
        }
        if (code == 401 || code == 403) {
          _fail(FailKind.auth, '$details HTTP $code');
        } else if (details.contains('keySystem') || details.contains('KEY_SYSTEM') || details.contains('key')) {
          _fail(FailKind.drm, details);
        } else if (type == 'networkError') {
          _fail(code == 0 ? FailKind.blocked : FailKind.network, '$details HTTP $code');
        } else {
          _fail(FailKind.unsupported, '$type $details');
        }
      }).toJS);
      h.callMethod('on'.toJS, 'hlsLevelSwitched'.toJS, ((JSString _, JSObject _) => _tick()).toJS);
      h.callMethod('loadSource'.toJS, p.url.toJS);
      h.callMethod('attachMedia'.toJS, _v);
    } else if (protocol == 'MPEG-TS' && mpegts != null &&
        (mpegts.callMethod('isSupported'.toJS) as JSBoolean).toDart) {
      pipeline = 'mpegts.js (MediaSource)';
      _live = true;
      final cfg = JSObject()
        ..['type'] = 'mpegts'.toJS
        ..['isLive'] = true.toJS
        ..['url'] = _route(p.url).toJS;
      final opt = JSObject()..['enableStashBuffer'] = false.toJS..['liveBufferLatencyChasing'] = true.toJS;
      final t = mpegts.callMethod<JSObject>('createPlayer'.toJS, cfg, opt);
      _ts = t;
      t.callMethod('on'.toJS, 'error'.toJS, ((JSString type, JSString detail) {
        if (_ts != t) return;
        _fail(type.toDart == 'NetworkError' ? FailKind.blocked : FailKind.unsupported, '${type.toDart} ${detail.toDart}');
      }).toJS);
      t.callMethod('attachMediaElement'.toJS, _v);
      t.callMethod('load'.toJS);
      t.callMethod('play'.toJS);
    } else {
      pipeline = protocol == 'HLS' && nativeHls ? 'HLS أصلي في المتصفح' : 'مشغل المتصفح';
      if (protocol == 'HLS' && !nativeHls && !hlsOk) {
        _fail(FailKind.unsupported, 'no MSE / no native HLS');
        return;
      }
      _v.src = _route(p.url);
      if (startAt != null) {
        late StreamSubscription s;
        s = web.EventStreamProvider<web.Event>('loadedmetadata').forTarget(_v).listen((_) {
          s.cancel();
          if (!_live) _v.currentTime = startAt.inMilliseconds / 1000;
        });
      }
    }
    try {
      await _v.play().toDart;
    } catch (_) {
      // قد يرفض المتصفح التشغيل التلقائي بالصوت؛ يكمل المستخدم بزر التشغيل
      if (phase == Phase.connecting) {
        phase = Phase.paused;
        notifyListeners();
      }
    }
  }

  @override
  Future<void> play() async {
    try { await _v.play().toDart; } catch (_) {}
  }

  @override
  Future<void> pause() async => _v.pause();

  @override
  Future<void> seek(Duration to) async => _v.currentTime = (to.inMilliseconds / 1000).clamp(0, double.infinity);

  @override
  Future<void> setSpeed(double s) async {
    speed = s;
    _v.playbackRate = s;
    notifyListeners();
  }

  @override
  Future<void> setVolume(double v) async {
    volume = v;
    _v.volume = v;
    notifyListeners();
  }

  @override
  Future<void> goLive() async {
    final h = _hls;
    final sync = (h?['liveSyncPosition'] as JSNumber?)?.toDartDouble;
    if (sync != null) {
      _v.currentTime = sync;
    } else if (_p != null) {
      await open(_p!);
    }
  }

  @override
  Future<List<TrackOpt>> audioTracks() async {
    final h = _hls;
    if (h == null) return const [];
    final arr = (h['audioTracks'] as JSArray<JSObject>?)?.toDart ?? const [];
    final cur = (h['audioTrack'] as JSNumber?)?.toDartInt ?? -1;
    return [
      for (var i = 0; i < arr.length; i++)
        TrackOpt('$i', [
          (arr[i]['name'] as JSString?)?.toDart,
          (arr[i]['lang'] as JSString?)?.toDart,
        ].whereType<String>().where((s) => s.isNotEmpty).join(' · '), selected: i == cur)
    ];
  }

  @override
  Future<void> selectAudio(String id) async => _hls?['audioTrack'] = int.parse(id).toJS;

  @override
  Future<List<TrackOpt>> qualities() async {
    final h = _hls;
    if (h == null) return const [];
    final arr = (h['levels'] as JSArray<JSObject>?)?.toDart ?? const [];
    final cur = (h['currentLevel'] as JSNumber?)?.toDartInt ?? -1;
    final auto = (h['autoLevelEnabled'] as JSBoolean?)?.toDart ?? true;
    return [
      for (var i = 0; i < arr.length; i++)
        TrackOpt('$i', '${(arr[i]['height'] as JSNumber?)?.toDartInt ?? 0}p',
            selected: !auto && i == cur,
            height: (arr[i]['height'] as JSNumber?)?.toDartInt,
            bitrate: (arr[i]['bitrate'] as JSNumber?)?.toDartInt)
    ];
  }

  @override
  Future<void> selectQuality(String? id) async => _hls?['currentLevel'] = (id == null ? -1 : int.parse(id)).toJS;

  @override
  int? get bitrate {
    final h = _hls;
    if (h == null) return null;
    final cur = (h['currentLevel'] as JSNumber?)?.toDartInt ?? -1;
    final arr = (h['levels'] as JSArray<JSObject>?)?.toDart ?? const [];
    if (cur < 0 || cur >= arr.length) return null;
    return (arr[cur]['bitrate'] as JSNumber?)?.toDartInt;
  }

  @override
  Widget view({required bool fill}) {
    _v.style.objectFit = fill ? 'cover' : 'contain';
    return HtmlElementView(viewType: _viewType);
  }

  @override
  void dispose() {
    for (final s in _subs) {
      s.cancel();
    }
    _teardown();
    _v.remove();
    super.dispose();
  }
}
