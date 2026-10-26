import 'dart:io';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import '../data/models.dart';
import 'engine.dart';

Engine createEngine() => NativeEngine();

/// المشغل الأصلي: ExoPlayer (Media3) على أندرويد و AVPlayer على iOS عبر video_player.
/// يشغّل HLS و MPEG-TS و MP4/MKV وملفات الجوال (file:// و content://).
class NativeEngine extends Engine {
  VideoPlayerController? _c;
  Playable? _p;
  bool _live = false;

  @override
  bool get isLive => _live;

  @override
  Future<void> open(Playable p, {Duration? startAt, bool preload = false}) async {
    final old = _c;
    _c = null;
    old?.removeListener(_onTick);
    await old?.dispose();
    _p = p;
    phase = Phase.connecting;
    fail = null;
    technicalError = null;
    position = Duration.zero;
    duration = Duration.zero;
    _live = p.isLive;
    protocol = p.isLocal ? 'ملف محلي' : Engine.protocolOf(p.url);
    pipeline = Platform.isAndroid ? 'ExoPlayer (Media3)' : 'AVPlayer';
    notifyListeners();

    final uri = Uri.parse(p.url);
    final c = switch (uri.scheme) {
      'file' => VideoPlayerController.file(File(uri.toFilePath())),
      'content' => VideoPlayerController.contentUri(uri),
      '' => VideoPlayerController.file(File(p.url)),
      _ => VideoPlayerController.networkUrl(
          uri,
          httpHeaders: p.headers,
          formatHint: protocol == 'HLS' ? VideoFormat.hls : (protocol == 'DASH' ? VideoFormat.dash : null),
          videoPlayerOptions: VideoPlayerOptions(allowBackgroundPlayback: true),
        ),
    };
    _c = c;
    c.addListener(_onTick);
    try {
      await c.initialize();
      if (_c != c) return;
      final d = c.value.duration;
      if (d == Duration.zero || d.inHours > 48) _live = true;
      if (startAt != null && !_live && startAt < d) await c.seekTo(startAt);
      await c.setPlaybackSpeed(speed);
      await c.setVolume(volume);
      if (!preload) await c.play();
    } catch (e) {
      if (_c != c) return;
      _setError('$e');
    }
  }

  void _setError(String e) {
    technicalError = e;
    final l = e.toLowerCase();
    fail = l.contains('403') || l.contains('401') || l.contains('forbidden') || l.contains('unauthorized')
        ? FailKind.auth
        : l.contains('drm') || l.contains('widevine') || l.contains('license')
            ? FailKind.drm
            : l.contains('unrecognized') || l.contains('format') || l.contains('decoder') || l.contains('codec') || l.contains('unsupported')
                ? FailKind.unsupported
                : FailKind.network;
    phase = Phase.error;
    notifyListeners();
  }

  void _onTick() {
    final c = _c;
    if (c == null) return;
    final v = c.value;
    if (v.hasError) {
      if (phase != Phase.error) _setError(v.errorDescription ?? 'error');
      return;
    }
    position = v.position;
    duration = _live ? Duration.zero : v.duration;
    buffered = v.buffered.isEmpty ? Duration.zero : v.buffered.last.end;
    videoSize = v.size;
    if (!v.isInitialized) {
      phase = Phase.connecting;
    } else if (v.isCompleted && !_live) {
      phase = Phase.ended;
    } else if (v.isBuffering) {
      phase = Phase.buffering;
    } else {
      phase = v.isPlaying ? Phase.playing : Phase.paused;
    }
    notifyListeners();
  }

  @override
  Future<void> play() async => _c?.play();
  @override
  Future<void> pause() async => _c?.pause();
  @override
  Future<void> seek(Duration to) async => _c?.seekTo(to < Duration.zero ? Duration.zero : to);
  @override
  Future<void> setSpeed(double s) async {
    speed = s;
    await _c?.setPlaybackSpeed(s);
    notifyListeners();
  }

  @override
  Future<void> setVolume(double v) async {
    volume = v;
    await _c?.setVolume(v);
    notifyListeners();
  }

  @override
  Future<void> goLive() async {
    if (_p != null) await open(_p!);
  }

  @override
  Future<List<TrackOpt>> audioTracks() async {
    final c = _c;
    if (c == null || !c.value.isInitialized || !c.isAudioTrackSupportAvailable()) return const [];
    try {
      final t = await c.getAudioTracks();
      return [
        for (final a in t)
          TrackOpt(a.id, [a.label, a.language].whereType<String>().where((s) => s.isNotEmpty).join(' · ').ifEmpty('مسار ${a.id}'),
              selected: a.isSelected)
      ];
    } catch (_) {
      return const [];
    }
  }

  @override
  Future<void> selectAudio(String id) async {
    try { await _c?.selectAudioTrack(id); } catch (_) {}
  }

  List<VideoTrack> _vt = [];

  @override
  Future<List<TrackOpt>> qualities() async {
    final c = _c;
    if (c == null || !c.value.isInitialized || !c.isVideoTrackSupportAvailable()) return const [];
    try {
      _vt = await c.getVideoTracks();
      return [
        for (final t in _vt)
          if ((t.height ?? 0) > 0)
            TrackOpt(t.id, '${t.height}p', selected: t.isSelected, height: t.height, bitrate: t.bitrate)
      ];
    } catch (_) {
      return const [];
    }
  }

  @override
  Future<void> selectQuality(String? id) async {
    try {
      await _c?.selectVideoTrack(id == null ? null : _vt.firstWhere((t) => t.id == id));
    } catch (_) {}
  }

  @override
  Widget view({required bool fill}) {
    final c = _c;
    if (c == null || !c.value.isInitialized) return const SizedBox.expand();
    final ar = c.value.aspectRatio;
    final video = AspectRatio(aspectRatio: ar, child: VideoPlayer(c));
    // ملاءمة: الصورة كاملة بلا تمدد. ملء: تغطية الشاشة مع قص الأطراف (لا تمدد أبدًا).
    return fill
        ? FittedBox(fit: BoxFit.cover, clipBehavior: Clip.hardEdge,
            child: SizedBox(width: c.value.size.width, height: c.value.size.height, child: VideoPlayer(c)))
        : Center(child: video);
  }

  @override
  void dispose() {
    _c?.removeListener(_onTick);
    _c?.dispose();
    _c = null;
    super.dispose();
  }
}

extension on String {
  String ifEmpty(String v) => isEmpty ? v : this;
}
