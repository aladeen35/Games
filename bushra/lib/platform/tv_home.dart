import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../data/store.dart';

/// الشاشة الرئيسية في Android TV: صف «تابع المشاهدة» (Watch Next) وقناة «البشرى — المفضلة»،
/// والضغط على أي عنصر هناك يفتحه في التطبيق مباشرة.
class TvHome {
  static const _ch = MethodChannel('bushra/tv');
  static bool get _android => !kIsWeb && defaultTargetPlatform == TargetPlatform.android;
  static Timer? _t;
  static void Function(String key)? _open;

  static Future<void> init(void Function(String key) open) async {
    if (!_android) return;
    _open = open;
    _ch.setMethodCallHandler((call) async {
      if (call.method == 'open') _handle('${call.arguments}');
    });
    try {
      final link = await _ch.invokeMethod<String>('initialLink');
      if (link != null) _handle(link);
    } catch (_) {}
    schedule();
  }

  static void _handle(String uri) {
    final k = Uri.tryParse(uri)?.queryParameters['k'];
    if (k != null && k.isNotEmpty) _open?.call(k);
  }

  /// مزامنة مؤجلة (تتجمع التغييرات المتتالية في طلب واحد).
  static void schedule() {
    if (!_android) return;
    _t?.cancel();
    _t = Timer(const Duration(seconds: 6), sync);
  }

  static Future<void> sync() async {
    final s = AppStore.I;
    final next = [
      for (final h in s.history.where((h) => h.resumable).take(12))
        {
          'key': h.item.key, 'title': h.item.title, 'desc': h.item.subtitle ?? '', 'img': h.item.logo ?? '',
          'pos': h.positionMs, 'dur': h.durationMs, 'at': h.updatedAt.millisecondsSinceEpoch,
          'type': h.item.isEpisode ? 'episode' : 'movie',
        },
    ];
    final favs = [
      for (final c in s.favorites.values.where(s.allowed).take(24))
        {'key': c.id, 'title': c.name, 'desc': c.group, 'img': c.logo ?? '', 'live': c.isLive},
    ];
    try {
      await _ch.invokeMethod('sync', {'next': next, 'favs': favs});
    } catch (_) {}
  }
}
