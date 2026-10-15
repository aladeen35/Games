import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'add_source.dart';

/// أول تشغيل: لا قناة عشوائية. ترحيب هادئ وثلاثة اختيارات كبيرة.
class Onboarding extends StatelessWidget {
  final VoidCallback onDone;
  const Onboarding({super.key, required this.onDone});

  void _finish() {
    AppStore.I.settings.onboarded = true;
    AppStore.I.saveSettings();
    onDone();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Scaffold(
      body: Stack(children: [
        // بؤرة ضوء دافئة من المساحة الداكنة
        Positioned.fill(child: DecoratedBox(decoration: BoxDecoration(gradient: RadialGradient(
          center: const Alignment(0, -.45), radius: 1.0,
          colors: [Color.alphaBlend(p.accent.withValues(alpha: .16), p.bg), Color.alphaBlend(p.gold.withValues(alpha: .04), p.bg), p.bg],
          stops: const [0, .45, 1],
        )))),
        SafeArea(child: Center(child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Column(children: [
              const BushraMark(size: 96),
              const SizedBox(height: 24),
              Text('أهلاً بك في البشرى', style: t.displaySmall, textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text('اجمع قوائمك وشاهدها في مكان واحد.', style: t.bodyLarge!.copyWith(color: p.text2), textAlign: TextAlign.center),
              const SizedBox(height: 36),
              _Choice(icon: Icons.playlist_add_rounded, title: 'أضف قائمة الآن', body: 'رابط M3U أو ملف من جهازك', primary: true,
                  onTap: () async { await openAddSource(context); if (AppStore.I.sources.isNotEmpty) _finish(); }),
              _Choice(icon: Icons.play_circle_outline_rounded, title: 'استكشف المشغل', body: 'جرّب بثًا تجريبيًا أو فيديو من جوالك',
                  onTap: () {
                    _finish();
                    openPlayer(context, const Playable(
                      key: 'demo', title: 'بث تجريبي', subtitle: 'عرض لقدرات المشغل',
                      url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'));
                  }),
              _Choice(icon: Icons.manage_accounts_outlined, title: 'لدي حساب', body: 'Xtream Codes: الخادم واسم المستخدم',
                  onTap: () async { await openAddSource(context, type: SourceType.xtream); if (AppStore.I.sources.isNotEmpty) _finish(); }),
              const SizedBox(height: 12),
              TextButton(onPressed: _finish, child: const Text('لاحقًا')),
            ]),
          ),
        ))),
      ]),
    );
  }
}

class _Choice extends StatelessWidget {
  final IconData icon;
  final String title, body;
  final VoidCallback onTap;
  final bool primary;
  const _Choice({required this.icon, required this.title, required this.body, required this.onTap, this.primary = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: BTap(
        autofocus: primary,
        onTap: onTap,
        color: primary ? p.accent.withValues(alpha: .14) : p.container,
        padding: const EdgeInsets.all(18),
        child: Row(children: [
          Icon(icon, size: 30, color: primary ? p.accent : p.text2),
          const SizedBox(width: 16),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: t.titleMedium),
            Text(body, style: t.bodySmall),
          ])),
          Icon(Icons.chevron_left_rounded, color: p.text3),
        ]),
      ),
    );
  }
}
