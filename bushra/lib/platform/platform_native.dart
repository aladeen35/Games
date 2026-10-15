import 'dart:convert';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/services.dart';
import '../data/models.dart';

const _pip = MethodChannel('bushra/pip');

/// اختيار فيديوهات من الجوال (المعرض أو الملفات) دون نسخها: نحتفظ بعنوانها فقط.
Future<List<LocalVideo>> pickVideos() async {
  final files = await FilePicker.pickFiles(type: FileType.video);
  return [
    for (final f in files)
      LocalVideo(uri: f.uri.toString(), name: f.name, size: f.lengthSync())
  ];
}

Future<({String name, String text})?> pickPlaylistFile() async {
  final f = await FilePicker.pickFile(type: FileType.any);
  if (f == null) return null;
  final b = await f.readAsBytes();
  String t;
  try {
    t = utf8.decode(b);
  } catch (_) {
    t = latin1.decode(b);
  }
  return (name: f.name, text: t);
}

Future<void> enterPlayerMode() async {
  await SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);
}

Future<void> exitPlayerMode() async {
  await SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  await SystemChrome.setPreferredOrientations(const []);
}

Future<void> setLandscape(bool on) => SystemChrome.setPreferredOrientations(on
    ? const [DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight]
    : const []);

bool get supportsPip => Platform.isAndroid;

Future<bool> enterPip() async {
  try {
    return await _pip.invokeMethod<bool>('enter') ?? false;
  } catch (_) {
    return false;
  }
}

/// يخبر النظام بأن الفيديو يعمل كي يدخل وضع الصورة داخل الصورة تلقائيًا عند الخروج.
Future<void> setAutoPip(bool on) async {
  try { await _pip.invokeMethod('auto', on); } catch (_) {}
}

bool get isWebHttps => false;
