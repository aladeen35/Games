import 'dart:convert';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:screen_brightness/screen_brightness.dart';
import 'package:volume_controller/volume_controller.dart';
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

/// ملف ترجمة SRT أو VTT من الجهاز.
Future<({String name, String text})?> pickSubtitleFile() async {
  final f = await FilePicker.pickFile(type: FileType.custom, allowedExtensions: const ['srt', 'vtt', 'txt']);
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
  await appOrientation();
}

/// الهاتف: الواجهة بالطول دائمًا. اللوحي والتلفاز: حر.
bool get isPhone {
  final v = WidgetsBinding.instance.platformDispatcher.views.first;
  return v.physicalSize.shortestSide / v.devicePixelRatio < 600;
}

Future<void> appOrientation() => SystemChrome.setPreferredOrientations(
    isPhone ? const [DeviceOrientation.portraitUp] : const []);

/// المشغل على الهاتف يدور للعرض تلقائيًا، إلا فيديوهات الجوال الطولية فتبقى بالطول.
Future<void> playerOrientation({required bool portraitVideo}) async {
  if (!isPhone) return;
  await SystemChrome.setPreferredOrientations(portraitVideo
      ? const [DeviceOrientation.portraitUp]
      : const [DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight]);
}

/// زر ملء الشاشة: على الهاتف يبدّل بين العرض والطول.
Future<void> setLandscape(bool on) => SystemChrome.setPreferredOrientations(on
    ? const [DeviceOrientation.landscapeLeft, DeviceOrientation.landscapeRight]
    : (isPhone ? const [DeviceOrientation.portraitUp] : const []));

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

/// صوت الجهاز (0..1). على الجوال نتحكم بصوت النظام دون إظهار شريطه.
bool get systemVolume => true;
Future<double> getVolume() async {
  try {
    VolumeController.instance.showSystemUI = false;
    return await VolumeController.instance.getVolume();
  } catch (_) {
    return 1;
  }
}

Future<void> setVolume(double v) async {
  try { await VolumeController.instance.setVolume(v.clamp(0, 1)); } catch (_) {}
}

/// إضاءة الشاشة لهذا التطبيق فقط، وتعود تلقائيًا عند الخروج من المشغل.
bool get realBrightness => true;
Future<double> getBrightness() async {
  try { return await ScreenBrightness.instance.application; } catch (_) { return .5; }
}

Future<void> setBrightness(double v) async {
  try { await ScreenBrightness.instance.setApplicationScreenBrightness(v.clamp(.02, 1)); } catch (_) {}
}

Future<void> resetBrightness() async {
  try { await ScreenBrightness.instance.resetApplicationScreenBrightness(); } catch (_) {}
}

Future<bool> saveTextFile(String name, String text) async {
  final uri = await FilePicker.saveFile(fileName: name, bytes: Uint8List.fromList(utf8.encode(text)), mimeType: 'application/json');
  return uri != null;
}

Future<String?> pickTextFile() async {
  final f = await FilePicker.pickFile(type: FileType.any);
  if (f == null) return null;
  return utf8.decode(await f.readAsBytes(), allowMalformed: true);
}

/// صورة من المعرض أو الملفات (لصورة الملف الشخصي).
Future<Uint8List?> pickImageBytes() async {
  final f = await FilePicker.pickFile(type: FileType.image);
  if (f == null) return null;
  return await f.readAsBytes();
}

const _voice = MethodChannel('bushra/voice');

/// البحث الصوتي: نافذة التعرف على الكلام في أندرويد (بالعربية).
Future<bool> voiceAvailable() async {
  if (!Platform.isAndroid) return false;
  try {
    return await _voice.invokeMethod<bool>('available') ?? false;
  } catch (_) {
    return false;
  }
}

Future<String?> listenVoice() async {
  try {
    return await _voice.invokeMethod<String>('listen');
  } catch (_) {
    return null;
  }
}
