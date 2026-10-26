import 'package:flutter/foundation.dart';

class CastDevice {
  final String name, host, model;
  final int port;
  const CastDevice(this.name, this.host, this.port, [this.model = '']);
}

/// البث إلى Chromecast غير متاح من المتصفح.
bool get castSupported => false;
Future<List<CastDevice>> discoverCast() async => const [];

class CastSession extends ChangeNotifier {
  final CastDevice device;
  CastSession._(this.device);
  String state = 'idle';
  String? error;
  double position = 0, duration = 0;
  bool get playing => false;
  static Future<CastSession> connect(CastDevice d) => throw UnsupportedError('cast');
  Future<void> load({required String url, required String title, String? image, bool live = false, double start = 0}) async {}
  Future<void> play() async {}
  Future<void> pause() async {}
  Future<void> seek(double secs) async {}
  Future<void> close() async {}
}
