import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';

String remainingText(HistoryEntry h) {
  final left = Duration(milliseconds: h.durationMs - h.positionMs);
  if (left.inMinutes >= 60) return 'متبقٍ ${left.inHours} س ${left.inMinutes % 60} د';
  return 'متبقٍ ${left.inMinutes.clamp(1, 59)} دقيقة';
}

/// بطاقة «تابع المشاهدة»: ما بدأته، أين توقفت، وكم بقي — مع زر إكمال كبير.
class WatchCard extends StatelessWidget {
  final HistoryEntry entry;
  final double? width;
  const WatchCard({super.key, required this.entry, this.width});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final item = entry.item;
    final w = width ?? (context.isTv ? 380.0 : 290.0);
    final done = !item.isLive && entry.durationMs > 0 && entry.progress >= .95;
    final status = item.isLive
        ? 'شاهدته ${ago(entry.updatedAt)}'
        : done
            ? 'شوهد بالكامل'
            : entry.resumable
                ? 'استكمال من ${fmtDur(Duration(milliseconds: entry.positionMs))} · ${remainingText(entry)}'
                : 'بدأته ${ago(entry.updatedAt)}';
    return SizedBox(
      width: w,
      child: BTap(
        color: p.container,
        semantic: 'متابعة ${item.title}',
        onTap: () => openPlayer(context, item),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(BRadius.card)),
                gradient: RadialGradient(center: const Alignment(.6, -.4), radius: 1.2,
                    colors: [p.accent.withValues(alpha: .22), p.highlight.withValues(alpha: .4), p.container]),
              ),
              child: Stack(children: [
                Center(child: item.logo != null
                    ? ChannelLogo(url: item.logo, name: item.title, size: 64)
                    : Icon(item.isLocal ? Icons.smartphone_rounded : Icons.movie_outlined, size: 44, color: p.text3)),
                PositionedDirectional(bottom: 10, end: 10, child: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(shape: BoxShape.circle,
                      color: (p.cinematic ? p.gold : p.accent).withValues(alpha: .92),
                      boxShadow: [BoxShadow(color: (p.cinematic ? p.gold : p.accent).withValues(alpha: .35), blurRadius: 18)]),
                  child: Icon(done ? Icons.replay_rounded : Icons.play_arrow_rounded, size: 28,
                      color: p.dark ? BColors.midnight950 : Colors.white),
                )),
                if (item.isLive) const PositionedDirectional(top: 10, start: 10, child: LiveBadge(small: true)),
                if (item.isLocal)
                  PositionedDirectional(top: 10, start: 10, child: StatusPill(text: 'من جهازك', icon: Icons.smartphone_rounded, color: p.text2, dense: true)),
                PositionedDirectional(top: 2, end: 2, child: PopupMenuButton<String>(
                  tooltip: 'خيارات',
                  icon: Icon(Icons.more_vert_rounded, color: p.text2),
                  onSelected: (v) {
                    if (v == 'rm') AppStore.I.removeHistory(item.key);
                    if (v == 'start') {
                      AppStore.I.updateProgress(item.key, Duration.zero, Duration(milliseconds: entry.durationMs));
                      openPlayer(context, item);
                    }
                  },
                  itemBuilder: (_) => [
                    if (!item.isLive && entry.durationMs > 0) const PopupMenuItem(value: 'start', child: Text('شاهد من البداية')),
                    const PopupMenuItem(value: 'rm', child: Text('إزالة من السجل')),
                  ],
                )),
              ]),
            ),
          ),
          if (!item.isLive && entry.durationMs > 0)
            Directionality(textDirection: TextDirection.ltr,
                child: LinearProgressIndicator(value: entry.progress, minHeight: 4, backgroundColor: p.highlight)),
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleSmall),
              Text(status, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodySmall),
            ]),
          ),
        ]),
      ),
    );
  }
}

/// قسم «تابع المشاهدة» في الرئيسية: تبويبان — «أكمل المشاهدة» و«بدأت مشاهدته».
class ContinueSection extends StatefulWidget {
  final VoidCallback onSeeAll;
  const ContinueSection({super.key, required this.onSeeAll});
  @override
  State<ContinueSection> createState() => _ContinueSectionState();
}

class _ContinueSectionState extends State<ContinueSection> {
  bool resumeTab = true;

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final prog = s.inProgress, recent = s.recentlyStarted;
    if (prog.isEmpty && recent.isEmpty) return const SizedBox.shrink();
    final tab = prog.isEmpty ? false : resumeTab;
    final list = tab ? prog : recent;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(0, 24, 0, 12),
        child: Wrap(crossAxisAlignment: WrapCrossAlignment.center, spacing: 12, runSpacing: 8, children: [
          Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(Icons.play_circle_outline_rounded, size: 22, color: p.cinematic ? p.gold : p.accent),
            const SizedBox(width: 8),
            Text('تابع المشاهدة', style: t.titleLarge),
          ]),
          if (prog.isNotEmpty)
            SegmentedButton<bool>(
              showSelectedIcon: false,
              style: const ButtonStyle(visualDensity: VisualDensity.compact),
              segments: [
                ButtonSegment(value: true, label: Text('أكمل المشاهدة (${prog.length})')),
                ButtonSegment(value: false, label: Text('بدأت مشاهدته (${recent.length})')),
              ],
              selected: {tab},
              onSelectionChanged: (v) => setState(() => resumeTab = v.first),
            ),
          TextButton(onPressed: widget.onSeeAll, child: const Text('عرض الكل')),
        ]),
      ),
      SizedBox(
        height: context.isTv ? 236 : 200,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          clipBehavior: Clip.none,
          padding: const EdgeInsets.symmetric(vertical: 4),
          itemCount: list.length.clamp(0, 16),
          separatorBuilder: (_, _) => const SizedBox(width: 12),
          itemBuilder: (_, i) => WatchCard(entry: list[i]),
        ),
      ),
    ]);
  }
}

/// صفحة «المتابعة»: ما ستكمله، ما بدأت مشاهدته، وما أنهيته.
class ContinueScreen extends StatelessWidget {
  const ContinueScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);
    if (s.history.isEmpty) {
      return const SafeArea(child: EmptyState(icon: Icons.history_rounded, title: 'لم تبدأ مشاهدة شيء بعد',
          body: 'كل ما تشاهده يظهر هنا لتكمله من حيث توقفت.'));
    }
    Widget grid(List<HistoryEntry> l) => LayoutBuilder(builder: (context, c) {
          final cols = (c.maxWidth / (context.isTv ? 380 : 300)).floor().clamp(1, 6);
          final w = (c.maxWidth - 12 * (cols - 1)) / cols;
          return Wrap(spacing: 12, runSpacing: 12, children: [
            for (final h in l) SizedBox(height: context.isTv ? 236 : 200, child: WatchCard(entry: h, width: w)),
          ]);
        });
    return SafeArea(
      bottom: false,
      child: ListView(padding: EdgeInsets.fromLTRB(hp, 14, hp, 32), children: [
        Row(children: [
          Expanded(child: Text('المتابعة', style: t.headlineSmall)),
          TextButton.icon(onPressed: s.clearHistory, icon: const Icon(Icons.delete_sweep_outlined), label: const Text('مسح السجل')),
        ]),
        if (s.inProgress.isNotEmpty) ...[
          SectionHeader('أكمل المشاهدة', subtitle: 'ما بدأته ولم تنهه بعد', icon: Icons.play_circle_outline_rounded),
          grid(s.inProgress),
        ],
        SectionHeader('بدأت مشاهدته', subtitle: 'قنوات وأفلام وملفات حديثة', icon: Icons.history_rounded),
        grid(s.recentlyStarted.where((h) => !h.resumable).toList()),
        if (s.finished.isNotEmpty) ...[
          SectionHeader('شاهدته بالكامل', icon: Icons.task_alt_rounded),
          grid(s.finished),
        ],
      ]),
    );
  }
}
