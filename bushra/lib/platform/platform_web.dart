import 'dart:async';
import 'dart:js_interop';
import 'dart:js_interop_unsafe';
import 'dart:typed_data';
import 'package:web/web.dart' as web;
import '../data/models.dart';

Future<List<web.File>> _pick(String accept, {bool multiple = false}) {
  final c = Completer<List<web.File>>();
  final input = web.document.createElement('input') as web.HTMLInputElement
    ..type = 'file'
    ..accept = accept
    ..multiple = multiple;
  input.onchange = ((web.Event _) {
    final files = input.files;
    c.complete([for (var i = 0; i < (files?.length ?? 0); i++) files!.item(i)!]);
  }).toJS;
  input.oncancel = ((web.Event _) => c.complete(const [])).toJS;
  input.click();
  return c.future;
}

/// على الويب: روابط blob تُشغّل الملف مباشرة من القرص دون رفعه أو تحميله للذاكرة.
Future<List<LocalVideo>> pickVideos() async {
  final files = await _pick('video/*,.mkv,.ts,.m4v,.mov,.avi', multiple: true);
  return [
    for (final f in files)
      LocalVideo(uri: web.URL.createObjectURL(f), name: f.name, size: f.size, sessionOnly: true)
  ];
}

Future<({String name, String text})?> pickPlaylistFile() async {
  final files = await _pick('.m3u,.m3u8,.txt,audio/x-mpegurl,application/vnd.apple.mpegurl');
  if (files.isEmpty) return null;
  final t = (await files.first.text().toDart).toDart;
  return (name: files.first.name, text: t);
}

Future<({String name, String text})?> pickSubtitleFile() async {
  final files = await _pick('.srt,.vtt,text/vtt');
  if (files.isEmpty) return null;
  final t = (await files.first.text().toDart).toDart;
  return (name: files.first.name, text: t);
}

Future<void> enterPlayerMode() async {}
Future<void> exitPlayerMode() async {
  if (web.document.fullscreenElement != null) web.document.exitFullscreen();
}

Future<void> setLandscape(bool on) async {
  try {
    if (on) {
      await web.document.documentElement!.requestFullscreen().toDart;
    } else if (web.document.fullscreenElement != null) {
      await web.document.exitFullscreen().toDart;
    }
  } catch (_) {}
}

bool get supportsPip => false;
Future<bool> enterPip() async => false;
Future<void> setAutoPip(bool on) async {}

bool get isWebHttps => web.window.location.protocol == 'https:';

/// على المتصفح: صوت المشغل نفسه، والإضاءة تُحاكى بتعتيم فوق الفيديو.
bool get systemVolume => false;
Future<double> getVolume() async => 1;
Future<void> setVolume(double v) async {}
bool get realBrightness => false;
Future<double> getBrightness() async => 1;
Future<void> setBrightness(double v) async {}
Future<void> resetBrightness() async {}

Future<bool> saveTextFile(String name, String text) async {
  final blob = web.Blob([text.toJS].toJS, web.BlobPropertyBag(type: 'application/json'));
  final url = web.URL.createObjectURL(blob);
  final a = web.document.createElement('a') as web.HTMLAnchorElement
    ..href = url
    ..download = name;
  a.click();
  web.URL.revokeObjectURL(url);
  return true;
}

Future<String?> pickTextFile() async {
  final files = await _pick('.json,application/json');
  if (files.isEmpty) return null;
  return (await files.first.text().toDart).toDart;
}

bool get isPhone => false;
Future<void> appOrientation() async {}
Future<void> playerOrientation({required bool portraitVideo}) async {}

Future<Uint8List?> pickImageBytes() async {
  final files = await _pick('image/*');
  if (files.isEmpty) return null;
  final buf = await files.first.arrayBuffer().toDart;
  return buf.toDart.asUint8List();
}

JSFunction? get _speechCtor =>
    (globalContext['SpeechRecognition'] ?? globalContext['webkitSpeechRecognition']) as JSFunction?;

/// البحث الصوتي في المتصفح (Web Speech API في كروم وإيدج وسفاري).
Future<bool> voiceAvailable() async => _speechCtor != null;

Future<String?> listenVoice() {
  final ctor = _speechCtor;
  if (ctor == null) return Future.value(null);
  final c = Completer<String?>();
  try {
    final rec = ctor.callAsConstructor<JSObject>();
    rec['lang'] = 'ar-SA'.toJS;
    rec['interimResults'] = false.toJS;
    rec['maxAlternatives'] = 1.toJS;
    rec['onresult'] = ((JSObject ev) {
      try {
        final results = ev['results'] as JSObject;
        final first = (results.callMethod<JSObject>('item'.toJS, 0.toJS)).callMethod<JSObject>('item'.toJS, 0.toJS);
        if (!c.isCompleted) c.complete((first['transcript'] as JSString).toDart);
      } catch (_) {
        if (!c.isCompleted) c.complete(null);
      }
    }).toJS;
    rec['onerror'] = ((JSObject _) { if (!c.isCompleted) c.complete(null); }).toJS;
    rec['onend'] = ((JSObject _) { if (!c.isCompleted) c.complete(null); }).toJS;
    rec.callMethod('start'.toJS);
  } catch (_) {
    if (!c.isCompleted) c.complete(null);
  }
  return c.future;
}
