import 'package:flutter/widgets.dart';
import '../data/models.dart';
import 'engine_native.dart' if (dart.library.js_interop) 'engine_web.dart' as impl;

enum Phase { idle, connecting, playing, paused, buffering, ended, error }

enum FailKind { network, auth, unsupported, blocked, mixedContent, drm, unknown }

class TrackOpt {
  final String id, label;
  final bool selected;
  final int? height, bitrate;
  const TrackOpt(this.id, this.label, {this.selected = false, this.height, this.bitrate});
}

/// واجهة موحّدة للمشغل؛ تنفيذ أصلي (ExoPlayer/AVPlayer) وتنفيذ ويب (HLS.js/mpegts.js).
abstract class Engine extends ChangeNotifier {
  Phase phase = Phase.idle;
  FailKind? fail;
  String? technicalError;
  Duration position = Duration.zero, duration = Duration.zero, buffered = Duration.zero;
  Size videoSize = Size.zero;
  double speed = 1, volume = 1;
  /// "HLS" أو "MPEG-TS" أو "MP4"…
  String protocol = '';
  String pipeline = '';
  bool get isLive;
  bool get canSeek => !isLive && duration > Duration.zero;

  Future<void> open(Playable p, {Duration? startAt});
  Future<void> play();
  Future<void> pause();
  Future<void> seek(Duration to);
  Future<void> setSpeed(double s);
  Future<void> setVolume(double v);
  Widget view({required bool fill});

  Future<List<TrackOpt>> audioTracks() async => const [];
  Future<void> selectAudio(String id) async {}
  Future<List<TrackOpt>> qualities() async => const [];
  /// null = تلقائي
  Future<void> selectQuality(String? id) async {}
  String? get currentQuality => videoSize.height > 0 ? '${videoSize.height.round()}p' : null;
  int? get bitrate => null;

  /// إعادة إلى الحافة الحية (للبث المباشر الذي يسمح بالتأخير).
  Future<void> goLive() async {}

  static Engine create() => impl.createEngine();

  static String protocolOf(String url) {
    final u = url.toLowerCase().split('?').first;
    if (u.endsWith('.m3u8') || u.contains('/hls/') || u.contains('m3u8')) return 'HLS';
    if (u.endsWith('.mpd')) return 'DASH';
    if (u.endsWith('.ts') || RegExp(r'/live/[^/]+/[^/]+/\d+$').hasMatch(u)) return 'MPEG-TS';
    if (u.endsWith('.mkv')) return 'MKV';
    if (u.endsWith('.webm')) return 'WebM';
    if (u.startsWith('rtmp')) return 'RTMP';
    if (u.startsWith('rtsp')) return 'RTSP';
    return 'MP4';
  }
}
