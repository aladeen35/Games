import 'dart:async';
import 'package:flutter/foundation.dart';
import 'models.dart';
import 'reminders_native.dart' if (dart.library.js_interop) 'reminders_web.dart' as impl;

/// جدولة تذكيرات البرامج: إشعار من النظام على الجوال، وإشعار المتصفح على الويب،
/// ولافتة داخل التطبيق إن كان مفتوحًا وقت البدء.
class Reminders {
  /// كم دقيقة قبل البدء يصل التذكير.
  static const lead = Duration(minutes: 5);

  /// تُستدعى عند حلول التذكير والتطبيق مفتوح.
  static void Function(Reminder r)? onFire;

  /// تُستدعى عند الضغط على إشعار (لفتح القناة).
  static void Function(String channelId)? onOpen;

  static final Map<int, Timer> _timers = {};

  static DateTime fireAt(Reminder r) {
    final t = r.start.subtract(lead);
    return t.isBefore(DateTime.now()) ? DateTime.now().add(const Duration(seconds: 5)) : t;
  }

  static Future<void> init(List<Reminder> all) async {
    try {
      await impl.initNotifications((id) => onOpen?.call(id));
    } catch (e) {
      debugPrint('notifications init: $e');
    }
    for (final r in all) {
      _arm(r);
    }
  }

  static void _arm(Reminder r) {
    _timers.remove(r.id)?.cancel();
    final d = fireAt(r).difference(DateTime.now());
    if (d.isNegative || d.inDays > 7) return;
    _timers[r.id] = Timer(d, () {
      _timers.remove(r.id);
      onFire?.call(r);
      impl.showNow(r);
    });
  }

  /// يعيد false إن لم يُمنح إذن الإشعارات (يبقى التذكير داخل التطبيق فقط).
  static Future<bool> schedule(Reminder r) async {
    _arm(r);
    try {
      return await impl.scheduleSystem(r, fireAt(r));
    } catch (e) {
      debugPrint('schedule: $e');
      return false;
    }
  }

  static Future<void> cancel(Reminder r) async {
    _timers.remove(r.id)?.cancel();
    try {
      await impl.cancelSystem(r);
    } catch (_) {}
  }
}
