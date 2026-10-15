import 'dart:js_interop';
import 'package:web/web.dart' as web;
import 'models.dart';

void Function(String)? _open;

Future<void> initNotifications(void Function(String channelId) onOpen) async {
  _open = onOpen;
}

/// المتصفح لا يجدول إشعارات والصفحة مغلقة؛ نطلب الإذن ونُظهر الإشعار من مؤقت داخل الصفحة.
Future<bool> scheduleSystem(Reminder r, DateTime at) async {
  try {
    if (web.Notification.permission == 'granted') return true;
    final p = (await web.Notification.requestPermission().toDart).toDart;
    return p == 'granted';
  } catch (_) {
    return false;
  }
}

Future<void> cancelSystem(Reminder r) async {}

void showNow(Reminder r) {
  try {
    if (web.Notification.permission != 'granted') return;
    final n = web.Notification('يبدأ قريبًا: ${r.title}',
        web.NotificationOptions(body: '${r.channelName} — اضغط للمشاهدة', icon: 'icons/Icon-192.png', lang: 'ar', dir: 'rtl'));
    n.onclick = ((web.Event _) {
      web.window.focus();
      _open?.call(r.channelId);
      n.close();
    }).toJS;
  } catch (_) {}
}
