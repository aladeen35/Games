import 'dart:async';
import 'dart:js_interop';
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
