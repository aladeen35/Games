import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'models.dart';

final _plugin = FlutterLocalNotificationsPlugin();
bool _ready = false;

const _details = NotificationDetails(
  android: AndroidNotificationDetails(
    'bushra_reminders', 'تذكير البرامج',
    channelDescription: 'تنبيه قبل بدء البرامج التي اخترت تذكيرها',
    importance: Importance.high, priority: Priority.high, icon: 'ic_stat_bushra',
  ),
  iOS: DarwinNotificationDetails(),
);

Future<void> initNotifications(void Function(String channelId) onOpen) async {
  await _plugin.initialize(
    settings: const InitializationSettings(
      android: AndroidInitializationSettings('ic_stat_bushra'),
      iOS: DarwinInitializationSettings(requestAlertPermission: false, requestBadgePermission: false, requestSoundPermission: false),
    ),
    onDidReceiveNotificationResponse: (r) {
      if (r.payload != null) onOpen(r.payload!);
    },
  );
  _ready = true;
  final launch = await _plugin.getNotificationAppLaunchDetails();
  final payload = launch?.notificationResponse?.payload;
  if ((launch?.didNotificationLaunchApp ?? false) && payload != null) {
    Future.delayed(const Duration(milliseconds: 800), () => onOpen(payload));
  }
}

Future<bool> scheduleSystem(Reminder r, DateTime at) async {
  if (!_ready) return false;
  var granted = true;
  final android = _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
  if (android != null) granted = await android.requestNotificationsPermission() ?? true;
  final ios = _plugin.resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>();
  if (ios != null) granted = await ios.requestPermissions(alert: true, sound: true) ?? false;
  if (!granted) return false;
  await _plugin.zonedSchedule(
    id: r.id,
    title: 'يبدأ قريبًا: ${r.title}',
    body: '${r.channelName} — اضغط للمشاهدة',
    scheduledDate: tz.TZDateTime.from(at.toUtc(), tz.UTC),
    notificationDetails: _details,
    androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
    payload: r.channelId,
  );
  return true;
}

Future<void> cancelSystem(Reminder r) async {
  if (_ready) await _plugin.cancel(id: r.id);
}

/// على الجوال يتولى النظام الإشعار المجدول، فلا حاجة لإشعار إضافي.
void showNow(Reminder r) {}
