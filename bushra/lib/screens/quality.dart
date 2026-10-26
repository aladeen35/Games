import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../widgets/common.dart';

/// تقرير جودة المزود: نسبة القنوات التي تعمل، سرعة بدء التشغيل، نجاح التشغيل، والانقطاعات —
/// من فحوصك ومشاهداتك الفعلية على هذا الجهاز.
class QualityScreen extends StatelessWidget {
  final String? sourceId;
  const QualityScreen({super.key, this.sourceId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('جودة المزود')),
      body: ListenableBuilder(
        listenable: AppStore.I,
        builder: (context, _) {
          final s = AppStore.I;
          final t = Theme.of(context).textTheme;
          final list = [for (final x in s.sources.values) if (sourceId == null || x.id == sourceId) x];
          return Center(child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 760),
            child: ListView(padding: const EdgeInsets.all(16), children: [
              Text('يُحسب من فحص القنوات ومن مشاهداتك على هذا الجهاز، فيصير أدق كلما شاهدت أكثر.', style: t.bodyMedium),
              const SizedBox(height: 14),
              if (list.isEmpty)
                const EmptyState(icon: Icons.analytics_outlined, title: 'لا قوائم بعد', body: 'أضف قائمة أو حساب مزود ليظهر تقريره هنا.')
              else
                for (final src in list) Padding(padding: const EdgeInsets.only(bottom: 14), child: _SourceReport(src: src)),
              if (list.length > 1) ...[
                const SizedBox(height: 6),
                Row(children: [
                  Icon(Icons.merge_type_rounded, color: context.bc.accent, size: 20),
                  const SizedBox(width: 8),
                  Expanded(child: Text(s.settings.unified
                      ? 'القائمة الموحدة مفعّلة: ${s.mergedCount} قناة مكررة تُعرض من المزود الأفضل لها.'
                      : 'فعّل «القائمة الموحدة» من إعدادات التشغيل لتظهر كل قناة مرة واحدة من أفضل مزود.', style: t.bodySmall)),
                ]),
              ],
            ]),
          ));
        },
      ),
    );
  }
}

class _SourceReport extends StatelessWidget {
  final Source src;
  const _SourceReport({required this.src});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final live = [for (final c in s.channelsOf(src.id)) if (c.isLive) c];
    final checked = live.where((c) => s.health.containsKey(c.id)).length;
    final ok = live.where((c) => s.health[c.id] == true).length;
    final st = s.srcStats[src.id] ?? const {};
    final plays = st['plays'] ?? 0, fails = st['fails'] ?? 0, starts = st['starts'] ?? 0;
    final avgStart = starts > 0 ? (st['startMs'] ?? 0) / starts / 1000 : null;
    final success = plays > 0 ? (plays - fails) / plays : null;
    final working = checked > 0 ? ok / checked : null;
    // التقييم: متوسط ما توفر من المؤشرات
    final parts = <double>[
      ?working,
      ?success,
      if (avgStart != null) (avgStart <= 2 ? 1 : avgStart <= 5 ? .7 : avgStart <= 10 ? .4 : .15),
    ];
    final score = parts.isEmpty ? null : parts.reduce((a, b) => a + b) / parts.length;
    final (label, color, icon) = score == null
        ? ('لا بيانات كافية بعد', p.text3, Icons.hourglass_empty_rounded)
        : score >= .85
            ? ('ممتاز', p.live, Icons.verified_rounded)
            : score >= .65
                ? ('جيد', p.accent, Icons.thumb_up_alt_rounded)
                : score >= .45
                    ? ('متوسط', p.gold, Icons.trending_flat_rounded)
                    : ('ضعيف', p.danger, Icons.trending_down_rounded);
    String pct(double? v) => v == null ? '—' : '${(v * 100).round()}%';
    Widget metric(IconData i, String k, String v, String hint, [double? bar]) => Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: p.bg.withValues(alpha: .5), borderRadius: BorderRadius.circular(12)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              Icon(i, size: 18, color: p.text3),
              const SizedBox(width: 6),
              Expanded(child: Text(k, style: t.labelMedium)),
            ]),
            const SizedBox(height: 6),
            Text(v, style: t.headlineSmall),
            Text(hint, style: t.bodySmall, maxLines: 2),
            if (bar != null) ...[
              const SizedBox(height: 6),
              Directionality(textDirection: TextDirection.ltr, child: ClipRRect(borderRadius: BorderRadius.circular(2),
                  child: LinearProgressIndicator(value: bar.clamp(0, 1).toDouble(), minHeight: 4, color: color))),
            ],
          ]),
        );
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(src.name, style: t.titleLarge),
            Text('${src.displayHost} · ${src.liveCount} قناة · ${src.vodCount} فيلم ومسلسل', style: t.bodySmall),
          ])),
          StatusPill(text: label, icon: icon, color: color),
        ]),
        const SizedBox(height: 14),
        LayoutBuilder(builder: (context, c) {
          final cols = c.maxWidth > 560 ? 4 : 2;
          final w = (c.maxWidth - 10 * (cols - 1)) / cols;
          return Wrap(spacing: 10, runSpacing: 10, children: [
            for (final m in [
              metric(Icons.health_and_safety_outlined, 'القنوات التي تعمل', pct(working),
                  checked == 0 ? 'لم تُفحص بعد' : '$ok من $checked مفحوصة', working),
              metric(Icons.speed_rounded, 'بدء التشغيل', avgStart == null ? '—' : '${avgStart.toStringAsFixed(1)} ث',
                  starts == 0 ? 'لا مشاهدات بعد' : 'متوسط $starts مشاهدة', avgStart == null ? null : (1 - (avgStart / 12))),
              metric(Icons.play_circle_outline_rounded, 'نجاح التشغيل', pct(success),
                  plays == 0 ? 'لا مشاهدات بعد' : '${plays - fails} من $plays محاولة', success),
              metric(Icons.sync_problem_rounded, 'الانقطاعات', '${st['reconnects'] ?? 0}',
                  'إعادة اتصال أثناء المشاهدة'),
            ])
              SizedBox(width: w, child: m),
          ]);
        }),
        const SizedBox(height: 12),
        Wrap(spacing: 14, runSpacing: 6, children: [
          if (src.latencyMs != null) Text('استجابة الخادم: ${(src.latencyMs! / 1000).toStringAsFixed(1)} ث', style: t.bodySmall),
          if (src.lastUpdated != null) Text('آخر تحديث: ${ago(src.lastUpdated!)}', style: t.bodySmall),
          Text('دليل البرامج: ${src.hasEpg ? 'متوفر' : 'غير متوفر'}', style: t.bodySmall),
          if (src.lastError != null) Text('آخر خطأ: ${src.lastError}', style: t.bodySmall!.copyWith(color: p.danger)),
        ]),
        if (!kIsWeb) ...[
          const SizedBox(height: 10),
          Align(
            alignment: AlignmentDirectional.centerStart,
            child: OutlinedButton.icon(
              onPressed: s.healthChecking ? null : () => s.checkHealth(sourceId: src.id),
              icon: s.healthChecking
                  ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Icon(Icons.health_and_safety_outlined),
              label: Text(s.healthChecking ? 'جارٍ الفحص ${s.healthDone}/${s.healthTotal}' : 'افحص القنوات الآن'),
            ),
          ),
        ],
      ]),
    );
  }
}
