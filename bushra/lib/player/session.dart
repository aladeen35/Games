import 'package:flutter/foundation.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../data/models.dart';
import '../data/store.dart';
import 'engine.dart';

/// جلسة التشغيل المصغّرة: حين يصغّر المستخدم المشغل يبقى البث نفسه يعمل في نافذة صغيرة
/// فوق التطبيق، ثم يعود بملء الشاشة دون إعادة الاتصال.
class PlayerSession extends ChangeNotifier {
  static final PlayerSession I = PlayerSession._();
  PlayerSession._();

  Engine? engine;
  Playable? item;
  List<Playable>? queue;
  bool fill = false;
  bool get active => engine != null;

  void minimize(Engine e, Playable it, List<Playable>? q, {bool fill = false}) {
    if (engine != null && engine != e) close();
    engine = e;
    item = it;
    queue = q;
    this.fill = fill;
    e.addListener(_tick);
    WakelockPlus.enable().catchError((_) {});
    notifyListeners();
  }

  /// يسلّم المشغل لشاشة التشغيل الكاملة.
  Engine? take() {
    final e = engine;
    e?.removeListener(_tick);
    engine = null;
    notifyListeners();
    return e;
  }

  void close() {
    final e = engine;
    engine = null;
    item = null;
    queue = null;
    e?.removeListener(_tick);
    e?.dispose();
    WakelockPlus.disable().catchError((_) {});
    notifyListeners();
  }

  void toggle() {
    final e = engine;
    if (e == null) return;
    e.phase == Phase.playing || e.phase == Phase.buffering ? e.pause() : e.play();
  }

  void _tick() {
    final e = engine, it = item;
    if (e == null || it == null) return;
    if (!it.isLive && e.duration > Duration.zero) AppStore.I.updateProgress(it.key, e.position, e.duration);
    notifyListeners();
  }
}
