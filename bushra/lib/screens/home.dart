import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'series.dart';
import 'add_source.dart';
import 'continue.dart';
import 'shell.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);
    return SafeArea(
      bottom: false,
      child: CustomScrollView(slivers: [
        const SliverToBoxAdapter(child: TopHeader()),
        if (!s.hasContent && s.history.isEmpty)
          SliverFillRemaining(
            hasScrollBody: false,
            child: EmptyState(
              icon: Icons.playlist_add_rounded,
              title: 'ابدأ بقائمة M3U أو ملف من جهازك',
              body: 'يمكنك إضافة أكثر من مصدر وتنظيمها في مكان واحد، أو تشغيل فيديوهات جوالك من «ملفاتي».',
              action: 'أضف قائمة الآن',
              onAction: () => openAddSource(context),
            ),
          )
        else
          SliverPadding(
            padding: EdgeInsets.symmetric(horizontal: hp),
            sliver: SliverList.list(children: _sections(context)),
          ),
        const SliverToBoxAdapter(child: SizedBox(height: 32)),
      ]),
    );
  }

  List<Widget> _sections(BuildContext context) {
    final s = AppStore.I;
    final out = <Widget>[];
    final live = s.visible(kind: ChannelKind.live);
    out.add(ContinueSection(onSeeAll: () => Shell.go('continue')));
    final hero = _pickHero(s, live);
    if (hero != null) out..add(const SizedBox(height: 20))..add(_Hero(channel: hero.$1, program: hero.$2, queue: live));

    final nowOn = <(Channel, EpgProgram)>[];
    if (s.hasEpg) {
      for (final c in live) {
        final (n, _) = s.nowNext(c.tvgId);
        if (n != null) nowOn.add((c, n));
        if (nowOn.length >= 20) break;
      }
    }
    if (nowOn.isNotEmpty || live.isNotEmpty) {
      out
        ..add(SectionHeader('يبث الآن', icon: Icons.sensors_rounded, onSeeAll: () => Shell.go('live')))
        ..add(_Row(children: [
          if (nowOn.isNotEmpty)
            for (final (c, p) in nowOn) _ChannelTile(channel: c, program: p, queue: live)
          else
            for (final c in live.take(20)) _ChannelTile(channel: c, queue: live),
        ]));
    }
    out.add(SectionHeader('قنواتك المفضلة', icon: Icons.star_rounded,
        onSeeAll: s.favorites.isEmpty ? null : () => Shell.go('live', group: '★')));
    if (s.favorites.isEmpty) {
      out.add(_InlineEmpty(text: 'لم تضف قنوات مفضلة بعد', hint: 'اضغط على النجمة أثناء المشاهدة لتجدها هنا.'));
    } else {
      final favs = s.favorites.values.toList();
      out.add(_Row(children: [for (final c in favs) _ChannelTile(channel: c, queue: favs)]));
    }
    final most = s.mostWatched;
    if (most.isNotEmpty) {
      out
        ..add(const SectionHeader('الأكثر مشاهدة في قوائمك', icon: Icons.trending_up_rounded))
        ..add(_Row(children: [
          for (final h in most) _PlayableTile(item: h.item, badge: '${h.plays}×'),
        ]));
    }
    if (s.sources.isNotEmpty) {
      final newest = (s.sources.values.toList()..sort((a, b) => (b.lastUpdated ?? DateTime(0)).compareTo(a.lastUpdated ?? DateTime(0)))).first;
      final vod = s.visible(sourceId: newest.id, kind: ChannelKind.vod);
      final recent = (vod.isNotEmpty ? vod.reversed : s.visible(sourceId: newest.id)).take(20).toList();
      if (recent.isNotEmpty) {
        out
          ..add(SectionHeader('أضيفت حديثًا', subtitle: newest.name, icon: Icons.fiber_new_rounded))
          ..add(recent.first.isLive
              ? _Row(children: [for (final c in recent) _ChannelTile(channel: c, queue: recent)])
              : SizedBox(height: context.isTv ? 330 : 260, child: ListView.separated(
                  scrollDirection: Axis.horizontal, clipBehavior: Clip.none, itemCount: recent.length,
                  separatorBuilder: (_, _) => const SizedBox(width: 12),
                  itemBuilder: (_, i) => SizedBox(width: context.isTv ? 170 : 130,
                      child: PosterCard(channel: recent[i], onTap: () => openChannel(context, recent[i], recent))),
                )));
      }
      final groups = s.groupsOf(live)..sort((a, b) => b.value.compareTo(a.value));
      if (groups.isNotEmpty) {
        out
          ..add(SectionHeader('حسب المجموعة', icon: Icons.category_outlined, onSeeAll: () => Shell.go('live')))
          ..add(Wrap(spacing: 10, runSpacing: 10, children: [
            for (final g in groups.take(context.isWide ? 18 : 10))
              _GroupChip(name: g.key, count: g.value, onTap: () => Shell.go('live', group: g.key)),
          ]));
      }
    }
    return out;
  }

  /// البطل يظهر فقط حين يوجد ما يستحق: برنامج يُعرض الآن على قناة مفضلة أو كثيرة المشاهدة.
  (Channel, EpgProgram?)? _pickHero(AppStore s, List<Channel> live) {
    final candidates = <Channel>[
      ...s.favorites.values.where((c) => c.isLive),
      for (final h in s.mostWatched)
        if (h.item.channelId != null && h.item.isLive) ?s.channelById(h.item.channelId!),
    ];
    // ثم أي قناة يُعرض عليها برنامج الآن
    candidates.addAll(live.where((c) => c.tvgId != null).take(50));
    for (final c in candidates) {
      final (n, _) = s.nowNext(c.tvgId);
      if (n != null) return (c, n);
    }
    return null;
  }
}

class _Row extends StatelessWidget {
  final List<Widget> children;
  const _Row({required this.children});
  @override
  Widget build(BuildContext context) {
    final h = context.isTv ? 236.0 : 188.0;
    return SizedBox(
      height: h,
      child: FocusTraversalGroup(
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          clipBehavior: Clip.none,
          padding: const EdgeInsets.symmetric(vertical: 4),
          itemCount: children.length,
          separatorBuilder: (_, _) => const SizedBox(width: 12),
          itemBuilder: (_, i) => children[i],
        ),
      ),
    );
  }
}

class _InlineEmpty extends StatelessWidget {
  final String text, hint;
  const _InlineEmpty({required this.text, required this.hint});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
      child: Row(children: [
        Icon(Icons.star_outline_rounded, color: p.gold, size: 28),
        const SizedBox(width: 14),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(text, style: Theme.of(context).textTheme.titleSmall),
          Text(hint, style: Theme.of(context).textTheme.bodySmall),
        ])),
      ]),
    );
  }
}

class _ChannelTile extends StatelessWidget {
  final Channel channel;
  final EpgProgram? program;
  final List<Channel> queue;
  const _ChannelTile({required this.channel, this.program, required this.queue});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final w = context.isTv ? 240.0 : 160.0;
    return SizedBox(
      width: w,
      child: BTap(
        semantic: channel.name,
        onTap: () => openChannel(context, channel, queue),
        onLongPress: () => showChannelSheet(context, channel, queue),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          AspectRatio(
            aspectRatio: 16 / 10,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(BRadius.card),
                gradient: LinearGradient(begin: Alignment.topRight, end: Alignment.bottomLeft,
                    colors: [p.highlight, p.container]),
              ),
              child: Stack(children: [
                Center(child: ChannelLogo(url: channel.logo, name: channel.name, size: w * .38, radius: 14)),
                if (channel.isLive) const PositionedDirectional(top: 8, start: 8, child: LiveBadge(small: true)),
                if (AppStore.I.isFav(channel.id))
                  PositionedDirectional(top: 8, end: 8, child: Icon(Icons.star_rounded, color: p.gold, size: 18)),
                if (program != null)
                  Positioned(left: 10, right: 10, bottom: 8, child: Directionality(textDirection: TextDirection.ltr,
                      child: ClipRRect(borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(value: program!.progress(DateTime.now()), minHeight: 3)))),
              ]),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(4, 8, 4, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(channel.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleSmall),
              Text(program?.title ?? channel.group, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodySmall),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _PlayableTile extends StatelessWidget {
  final Playable item;
  final String? badge;
  const _PlayableTile({required this.item, this.badge});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final c = item.channelId == null ? null : s.channelById(item.channelId!);
    if (c != null) return _ChannelTile(channel: c, queue: [c]);
    final p = context.bc;
    final w = context.isTv ? 240.0 : 160.0;
    return SizedBox(
      width: w,
      child: BTap(
        onTap: () => openPlayer(context, item),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          AspectRatio(aspectRatio: 16 / 10, child: Container(
            decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
            child: Center(child: Icon(item.isLocal ? Icons.smartphone_rounded : Icons.play_circle_outline_rounded, size: 40, color: p.text3)),
          )),
          Padding(padding: const EdgeInsets.fromLTRB(4, 8, 4, 0),
              child: Text(item.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.titleSmall)),
        ]),
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  final Channel channel;
  final EpgProgram? program;
  final List<Channel> queue;
  const _Hero({required this.channel, this.program, required this.queue});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final s = AppStore.I;
    final fav = s.isFav(channel.id);
    return ClipRRect(
      borderRadius: BorderRadius.circular(BRadius.player),
      child: Container(
        height: context.isTv ? 300 : 230,
        decoration: BoxDecoration(
          gradient: LinearGradient(begin: Alignment.centerRight, end: Alignment.centerLeft,
              colors: [p.dark ? BColors.surfaceContainer : p.surface, p.dark ? const Color(0xFF0E2A33) : const Color(0xFFDDF3F1)]),
        ),
        child: Stack(children: [
          // بؤرة ضوء دافئة خلف الشعار
          PositionedDirectional(end: -40, top: -40, bottom: -40, child: AspectRatio(aspectRatio: 1, child: DecoratedBox(
            decoration: BoxDecoration(shape: BoxShape.circle, gradient: RadialGradient(colors: [
              p.gold.withValues(alpha: .22), p.accent.withValues(alpha: .10), p.accent.withValues(alpha: 0),
            ])),
          ))),
          PositionedDirectional(end: 40, top: 0, bottom: 0,
              child: Center(child: Opacity(opacity: .95, child: ChannelLogo(url: channel.logo, name: channel.name, size: context.isWide ? 120 : 76, radius: 24)))),
          Padding(
            padding: const EdgeInsets.all(22),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.end, children: [
              Row(children: [
                Icon(Icons.sensors_rounded, size: 16, color: p.live),
                const SizedBox(width: 6),
                Text('يبث الآن', style: t.labelLarge!.copyWith(color: p.live)),
              ]),
              const SizedBox(height: 6),
              SizedBox(
                width: context.isWide ? 520 : MediaQuery.sizeOf(context).width * .55,
                child: Text(program != null ? '${program!.title} — ${channel.name}' : channel.name,
                    maxLines: 2, overflow: TextOverflow.ellipsis, style: t.headlineMedium),
              ),
              if (program != null)
                Text('${hhmm(program!.start)} – ${hhmm(program!.stop)}', style: t.bodyMedium),
              const SizedBox(height: 14),
              Wrap(spacing: 10, runSpacing: 8, children: [
                FilledButton.icon(
                  onPressed: () => openPlayer(context, Playable.channel(channel), queue: queueOf(queue)),
                  icon: const Icon(Icons.play_arrow_rounded), label: const Text('شاهد الآن'),
                ),
                OutlinedButton.icon(
                  onPressed: () => s.toggleFav(channel),
                  icon: Icon(fav ? Icons.star_rounded : Icons.star_outline_rounded, color: p.gold),
                  label: Text(fav ? 'في المفضلة' : 'إضافة للمفضلة'),
                ),
                if (context.isWide)
                  TextButton(onPressed: () => showChannelSheet(context, channel, queue), child: const Text('التفاصيل')),
              ]),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _GroupChip extends StatelessWidget {
  final String name;
  final int count;
  final VoidCallback onTap;
  const _GroupChip({required this.name, required this.count, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return BTap(
      radius: 999,
      color: p.container,
      onTap: onTap,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(groupIcon(name), size: 18, color: p.text2),
        const SizedBox(width: 8),
        Text(name, style: Theme.of(context).textTheme.labelLarge),
        const SizedBox(width: 6),
        Text('$count', style: Theme.of(context).textTheme.labelSmall),
      ]),
    );
  }
}

/// ورقة معلومات القناة: الاسم والأصلي، الآن والقادم، المفضلة، فتح المشغل.
Future<void> showChannelSheet(BuildContext context, Channel c, List<Channel> queue) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (ctx) => ListenableBuilder(
      listenable: AppStore.I,
      builder: (ctx, _) => ChannelInfoPanel(channel: c, queue: queue),
    ),
  );
}

class ChannelInfoPanel extends StatelessWidget {
  final Channel channel;
  final List<Channel> queue;
  final bool sidePanel;
  const ChannelInfoPanel({super.key, required this.channel, required this.queue, this.sidePanel = false});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final (now, next) = s.nowNext(channel.tvgId);
    final fav = s.isFav(channel.id);
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.fromLTRB(20, sidePanel ? 20 : 0, 20, 20),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            ChannelLogo(url: channel.logo, name: channel.name, size: 64, radius: 16),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(channel.name, style: t.titleLarge),
              if (channel.altName != null) Text(channel.altName!, style: t.bodySmall),
              const SizedBox(height: 4),
              Row(children: [
                if (channel.isLive) const LiveBadge(small: true) else StatusPill(text: channel.kind == ChannelKind.series ? 'مسلسل' : 'فيلم',
                    icon: channel.kind == ChannelKind.series ? Icons.theaters_rounded : Icons.movie_outlined, color: p.accent, dense: true),
                const SizedBox(width: 8),
                Flexible(child: Text(channel.group, style: t.bodySmall, overflow: TextOverflow.ellipsis)),
              ]),
            ])),
          ]),
          const SizedBox(height: 16),
          if (now != null) ...[
            _ProgLine(label: 'الآن', prog: now, highlight: true),
            const SizedBox(height: 8),
          ],
          if (next != null) _ProgLine(label: 'القادم', prog: next),
          if (now == null && next == null && channel.isLive)
            Text('لا تتوفر بيانات دليل البرامج لهذه القناة.', style: t.bodySmall),
          const SizedBox(height: 18),
          Row(children: [
            Expanded(child: FilledButton.icon(
              autofocus: true,
              onPressed: () {
                if (!sidePanel) Navigator.pop(context);
                openChannel(context, channel, queue);
              },
              icon: const Icon(Icons.play_arrow_rounded), label: const Text('شاهد الآن'),
            )),
            const SizedBox(width: 10),
            OutlinedButton(
              onPressed: () => s.toggleFav(channel),
              child: Icon(fav ? Icons.star_rounded : Icons.star_outline_rounded, color: p.gold, semanticLabel: 'المفضلة'),
            ),
          ]),
        ]),
      ),
    );
  }
}

class _ProgLine extends StatelessWidget {
  final String label;
  final EpgProgram prog;
  final bool highlight;
  const _ProgLine({required this.label, required this.prog, this.highlight = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: highlight ? p.accent.withValues(alpha: .10) : p.container,
        borderRadius: BorderRadius.circular(12),
        border: highlight ? Border.all(color: p.accent.withValues(alpha: .6)) : null,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Text(label, style: t.labelMedium!.copyWith(color: highlight ? p.accent : p.text3)),
          const Spacer(),
          Text('${hhmm(prog.start)} – ${hhmm(prog.stop)}', style: t.labelMedium),
        ]),
        const SizedBox(height: 4),
        Text(prog.title, style: t.titleSmall),
        if (highlight) ...[
          const SizedBox(height: 8),
          Directionality(textDirection: TextDirection.ltr,
              child: LinearProgressIndicator(value: prog.progress(DateTime.now()), minHeight: 3)),
          const SizedBox(height: 4),
          Text('ينتهي ${hhmm(prog.stop)} — بعد ${prog.stop.difference(DateTime.now()).inMinutes} دقيقة', style: t.bodySmall),
        ],
      ]),
    );
  }
}

/// شعار صغير مع اسم التطبيق — يستخدم في «حول».
class AboutBrand extends StatelessWidget {
  const AboutBrand({super.key});
  @override
  Widget build(BuildContext context) => const BushraLogo(size: 52, tagline: true);
}
