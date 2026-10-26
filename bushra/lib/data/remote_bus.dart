import 'dart:async';

/// أمر من ريموت الجوال: up/down/left/right/ok/back/home/toggle/next/prev/fwd/rew/volup/voldown/mute/num/search.
typedef RemoteCmd = ({String a, String? v});

/// قناة الأوامر بين خادم الريموت والتطبيق، ومن يتحكم بالمشغل الآن.
class RemoteBus {
  static final _c = StreamController<RemoteCmd>.broadcast();
  static Stream<RemoteCmd> get stream => _c.stream;
  static void send(RemoteCmd c) => _c.add(c);

  /// المشغل المفتوح يسجّل نفسه هنا ليستقبل أوامر التشغيل؛ يعيد true إن نفّذ الأمر.
  static bool Function(RemoteCmd c)? player;

  /// حالة المشاهدة الحالية لعرضها على الجوال.
  static Map<String, dynamic> Function()? state;
}
