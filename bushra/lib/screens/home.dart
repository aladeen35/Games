import 'dart:async';
import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../data/recommend.dart';
import 'detail.dart';
import 'profiles.dart';
import 'search.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'series.dart';
import 'add_source.dart';
import 'catalog.dart';
import 'continue.dart';
import 'shell.dart';

/// الرئيسية بأسلوب نتفليكس و Apple TV: بطل متحرك بعرض الشاشة، رأس شفاف يصير معتمًا مع التمرير،
/// ثم صفوف أفقية: تابع المشاهدة، الاقتراحات، يبث الآن، الأكثر مشاهدة، المفضلة، والجديد.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _sc = ScrollController();
  double _solid = 0;

  @override
  void initState() {
    super.initState();
    _sc.addListener(() {
      final v = (_sc.offset / 160).clamp(0.0, 1.0);
      if ((v - _solid).abs() > .04 || (v == 1 && _solid != 1) || (v == 0 && _solid != 0)) setState(() => _solid = v);
    });
  }

  @override
  void dispose() {
    _sc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 32.0 : 16.0);
    final empty = !s.hasContent && s.history.isEmpty;
    final feats = empty ? const <_Feat>[] : _featured(s);
    final headerH = MediaQuery.paddingOf(context).top + (context.isWide ? 76 : 108);
    return Stack(children: [
      CustomScrollView(controller: _sc, slivers: [
        if (feats.isNotEmpty)
          SliverToBoxAdapter(child: _HeroCarousel(items: feats, headerH: headerH))
        else
          SliverToBoxAdapter(child: SizedBox(height: headerH)),
        if (empty)
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
          SliverList.list(children: _sections(context, hp)),
        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ]),
      Positioned(top: 0, left: 0, right: 0, child: _HomeHeader(solid: feats.isEmpty ? 1 : _solid)),
    ]);
  }

  /// عناصر البطل: ما تكمله، ما يُعرض الآن، المفضلة، المقترح، والجديد — بصور فقط.
  List<_Feat> _featured(AppStore s) {
    final out = <_Feat>[];
    final seen = <String>{};
    void add(_Feat f) {
      if (out.length < 7 && seen.add(f.key)) out.add(f);
    }
    for (final h in s.inProgress.where((h) => h.item.logo != null && !h.item.isLocal).take(2)) {
      final c = h.item.channelId == null ? null : s.channelById(h.item.channelId!);
      add(_Feat(key: h.item.key, title: h.item.isEpisode ? (h.item.title.split(' — ').first) : h.item.title,
          image: h.item.logo, eyebrow: 'أكمل المشاهدة', sub: h.item.isEpisode ? h.item.subtitle : remainingText(h),
          play: h.item, channel: c, progress: h.progress));
    }
    final live = s.visible(kind: ChannelKind.live);
    final hero = _pickHero(s, live);
    if (hero != null) {
      add(_Feat(key: hero.$1.id, title: hero.$2?.title ?? hero.$1.name, image: hero.$1.logo, eyebrow: 'يبث الآن',
          sub: hero.$2 == null ? hero.$1.group : '${hero.$1.name} · ${hhmm(hero.$2!.start)} – ${hhmm(hero.$2!.stop)}',
          channel: hero.$1, program: hero.$2, queue: live));
    }
    for (final c in s.favorites.values.where((c) => !c.isLive && c.logo != null && s.allowed(c)).take(2)) {
      add(_Feat(key: c.id, title: c.name, image: c.logo, eyebrow: 'من مفضلتك', sub: c.group, channel: c));
    }
    for (final r in recommendations(s).where((r) => r.kind != 'time')) {
      for (final c in r.items.where((c) => c.logo != null).take(2)) {
        add(_Feat(key: c.id, title: c.name, image: c.logo, eyebrow: 'مقترح لك', sub: c.group, channel: c, queue: r.items));
      }
    }
    for (final kind in [ChannelKind.vod, ChannelKind.series]) {
      final l = s.visible(kind: kind);
      for (final c in l.reversed.where((c) => c.logo != null).take(2)) {
        add(_Feat(key: c.id, title: c.name, image: c.logo, eyebrow: kind == ChannelKind.vod ? 'فيلم جديد' : 'مسلسل جديد',
            sub: c.group, channel: c, queue: l));
      }
    }
    return out;
  }

  List<Widget> _sections(BuildContext context, double hp) {
    final s = AppStore.I;
    final out = <Widget>[];
    Widget pad(Widget w) => Padding(padding: EdgeInsets.symmetric(horizontal: hp), child: w);
    final live = s.visible(kind: ChannelKind.live);
    out.add(ContinueSection(hp: hp, onSeeAll: () => Shell.go('continue')));

    // اقتراحات محسوبة على الجهاز من سجل هذا الملف
    for (final r in recommendations(s)) {
      final icon = switch (r.kind) { 'because' => Icons.auto_awesome_rounded, 'time' => Icons.schedule_rounded, _ => Icons.recommend_rounded };
      if (r.items.first.isLive) {
        out
          ..add(pad(SectionHeader(r.title, icon: icon)))
          ..add(_Row(hp: hp, children: [for (final c in r.items) _ChannelTile(channel: c, queue: r.items)]));
      } else {
        out.add(PosterRow(title: r.title, icon: icon, items: r.items, hp: hp));
      }
    }

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
        ..add(pad(SectionHeader('يبث الآن', icon: Icons.sensors_rounded, onSeeAll: () => Shell.go('live'))))
        ..add(_Row(hp: hp, children: [
          if (nowOn.isNotEmpty)
            for (final (c, p) in nowOn) _ChannelTile(channel: c, program: p, queue: live)
          else
            for (final c in live.take(20)) _ChannelTile(channel: c, queue: live),
        ]));
    }

    final top = [
      for (final h in s.mostWatched)
        if (h.item.channelId == null || s.channelById(h.item.channelId!) == null || s.allowed(s.channelById(h.item.channelId!)!)) h
    ].take(10).toList();
    if (top.length >= 3) {
      out
        ..add(pad(const SectionHeader('الأكثر مشاهدة لديك', icon: Icons.local_fire_department_rounded)))
        ..add(_Top10Row(entries: top, hp: hp));
    }

    final favLive = s.favorites.values.where((c) => c.isLive && s.allowed(c)).toList();
    out.add(pad(SectionHeader('قنواتك المفضلة', icon: Icons.star_rounded,
        onSeeAll: favLive.isEmpty ? null : () => Shell.go('live', group: '★'))));
    if (favLive.isEmpty) {
      out.add(pad(const _InlineEmpty(text: 'لم تضف قنوات مفضلة بعد', hint: 'اضغط على النجمة أثناء المشاهدة لتجدها هنا.')));
    } else {
      out.add(_Row(hp: hp, children: [for (final c in favLive) _ChannelTile(channel: c, queue: favLive)]));
    }

    // الأفلام والمسلسلات: المفضلة أولًا، ثم صفوف للمشاهدة (الجديد وأكبر المجموعات)
    void more(String title, List<Channel> items) =>
        Navigator.of(context).push(MaterialPageRoute(builder: (_) => GroupGridScreen(title: title, items: items)));
    for (final (kind, favTitle, newTitle, tab) in [
      (ChannelKind.vod, 'أفلامي المفضلة', 'أفلام جديدة', 'movies'),
      (ChannelKind.series, 'مسلسلاتي المفضلة', 'مسلسلات جديدة', 'series'),
    ]) {
      final favs = s.favorites.values.where((c) => c.kind == kind && s.allowed(c)).toList();
      if (favs.isNotEmpty) {
        out.add(PosterRow(title: favTitle, icon: Icons.star_rounded, items: favs, hp: hp, onMore: () => more(favTitle, favs)));
      }
      final all = s.visible(kind: kind);
      if (all.isEmpty) continue;
      final fresh = all.reversed.toList();
      out.add(PosterRow(title: newTitle, icon: kind == ChannelKind.vod ? Icons.movie_outlined : Icons.theaters_rounded,
          items: fresh, hp: hp, onMore: () => Shell.go(tab)));
      final groups = <String, List<Channel>>{};
      for (final c in all) {
        (groups[c.group] ??= []).add(c);
      }
      final topG = groups.entries.toList()..sort((a, b) => b.value.length.compareTo(a.value.length));
      for (final g in topG.take(2)) {
        out.add(PosterRow(title: g.key, items: g.value, hp: hp, onMore: () => more(g.key, g.value)));
      }
    }
    if (s.sources.isNotEmpty) {
      final newest = (s.sources.values.toList()..sort((a, b) => (b.lastUpdated ?? DateTime(0)).compareTo(a.lastUpdated ?? DateTime(0)))).first;
      final vod = s.visible(sourceId: newest.id, kind: ChannelKind.vod);
      final recent = (vod.isNotEmpty ? vod.reversed : s.visible(sourceId: newest.id)).take(20).toList();
      // الأفلام الجديدة لها صفوفها أعلاه؛ هنا للقوائم التي فيها قنوات فقط
      if (recent.isNotEmpty && recent.first.isLive) {
        out
          ..add(pad(SectionHeader('أضيفت حديثًا', subtitle: newest.name, icon: Icons.fiber_new_rounded)))
          ..add(_Row(hp: hp, children: [for (final c in recent) _ChannelTile(channel: c, queue: recent)]));
      }
      final groups = s.groupsOf(live)..sort((a, b) => b.value.compareTo(a.value));
      if (groups.isNotEmpty) {
        out
          ..add(pad(SectionHeader('حسب المجموعة', icon: Icons.category_outlined, onSeeAll: () => Shell.go('live'))))
          ..add(pad(Wrap(spacing: 10, runSpacing: 10, children: [
            for (final g in groups.take(context.isWide ? 18 : 10))
              _GroupChip(name: g.key, count: g.value, onTap: () => Shell.go('live', group: g.key)),
          ])));
      }
    }
    return out;
  }

  /// البطل يظهر فقط حين يوجد ما يستحق: برنامج يُعرض الآن على قناة مفضلة أو كثيرة المشاهدة.
  (Channel, EpgProgram?)? _pickHero(AppStore s, List<Channel> live) {
    final candidates = <Channel>[
      ...s.favorites.values.where((c) => c.isLive && s.allowed(c)),
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

class _Feat {
  final String key, title, eyebrow;
  final String? image, sub;
  final Playable? play;
  final Channel? channel;
  final EpgProgram? program;
  final List<Channel>? queue;
  final double progress;
  const _Feat({required this.key, required this.title, required this.eyebrow, this.image, this.sub, this.play,
      this.channel, this.program, this.queue, this.progress = 0});
  bool get live => channel?.isLive ?? play?.isLive ?? false;
}

/// رأس الرئيسية: شفاف فوق البطل، ويعتم تدريجيًا مع التمرير (مثل نتفليكس).
class _HomeHeader extends StatelessWidget {
  final double solid;
  const _HomeHeader({required this.solid});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final wide = context.isWide;
    final t = Theme.of(context).textTheme;
    final searchBtn = IconButton(
      tooltip: 'بحث',
      onPressed: () => Navigator.of(context).push(PageRouteBuilder(
        transitionDuration: BMotion.page,
        pageBuilder: (_, _, _) => const SearchScreen(),
        transitionsBuilder: (_, a, _, c) => FadeTransition(opacity: a, child: c),
      )),
      icon: const Icon(Icons.search_rounded, size: 26, color: Colors.white),
    );
    Widget chip(String label, String id) => Padding(
          padding: const EdgeInsetsDirectional.only(end: 8),
          child: OutlinedButton(
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(0, 34), padding: const EdgeInsets.symmetric(horizontal: 14),
              side: const BorderSide(color: Colors.white38), backgroundColor: Colors.transparent,
              shape: const StadiumBorder(), foregroundColor: Colors.white,
            ),
            onPressed: () => Shell.go(id),
            child: Text(label, style: t.labelLarge!.copyWith(color: Colors.white)),
          ),
        );
    return DecoratedBox(
      decoration: BoxDecoration(
        color: p.bgDeep.withValues(alpha: .94 * solid),
        gradient: solid > .98 ? null : LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Colors.black.withValues(alpha: .55 * (1 - solid)), Colors.black.withValues(alpha: 0)]),
        border: Border(bottom: BorderSide(color: p.border.withValues(alpha: p.border.a * solid))),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: EdgeInsets.fromLTRB(wide ? 28 : 12, 8, wide ? 28 : 12, 8),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Row(children: [
              if (!context.isTv) const BushraLogo(size: 28),
              const Spacer(),
              if (wide) ...[
                ConstrainedBox(constraints: const BoxConstraints(maxWidth: 380), child: const SizedBox(width: 380, child: SearchBox())),
                const SizedBox(width: 14),
                const ConnectionPill(),
                const SizedBox(width: 12),
              ] else ...[
                IconButton(
                  tooltip: 'بحث صوتي',
                  onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SearchScreen(voice: true))),
                  icon: const Icon(Icons.mic_none_rounded, size: 24, color: Colors.white),
                ),
                searchBtn,
                const SizedBox(width: 4),
              ],
              ProfileButton(size: wide ? 40 : 34),
            ]),
            if (!wide)
              SizedBox(
                height: 44,
                child: ListView(scrollDirection: Axis.horizontal, padding: const EdgeInsets.only(top: 8), children: [
                  chip('الأفلام', 'movies'),
                  chip('المسلسلات', 'series'),
                  chip('مباشر', 'live'),
                  chip('الدليل', 'epg'),
                ]),
              ),
          ]),
        ),
      ),
    );
  }
}

/// البطل المتحرك: يتنقل تلقائيًا كل 7 ثوانٍ، ويتوقف حين يركّز المستخدم عليه.
class _HeroCarousel extends StatefulWidget {
  final List<_Feat> items;
  final double headerH;
  const _HeroCarousel({required this.items, required this.headerH});
  @override
  State<_HeroCarousel> createState() => _HeroCarouselState();
}

class _HeroCarouselState extends State<_HeroCarousel> {
  final _pc = PageController();
  int page = 0;
  bool hold = false;
  Timer? _auto;

  @override
  void initState() {
    super.initState();
    _auto = Timer.periodic(const Duration(seconds: 7), (_) {
      if (!mounted || hold || widget.items.length < 2 || !_pc.hasClients || AppStore.I.settings.reduceMotion) return;
      _go(page + 1);
    });
  }

  void _go(int i) {
    final n = widget.items.length;
    _pc.animateToPage(((i % n) + n) % n, duration: const Duration(milliseconds: 650), curve: Curves.easeInOutCubic);
  }

  @override
  void dispose() {
    _auto?.cancel();
    _pc.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final wide = context.isWide;
    final h = wide ? (size.height * .64).clamp(420.0, 660.0) : (size.width * 1.42).clamp(500.0, 660.0);
    final n = widget.items.length;
    return Focus(
      canRequestFocus: false,
      skipTraversal: true,
      onFocusChange: (f) => hold = f,
      child: MouseRegion(
        onEnter: (_) => hold = true,
        onExit: (_) => hold = false,
        child: SizedBox(
          height: h,
          child: Stack(children: [
            PageView.builder(
              controller: _pc,
              itemCount: n,
              onPageChanged: (i) => setState(() => page = i),
              itemBuilder: (_, i) => _HeroSlide(f: widget.items[i], headerH: widget.headerH),
            ),
            if (n > 1)
              Positioned(left: 0, right: 0, bottom: 14, child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                for (var i = 0; i < n; i++)
                  AnimatedContainer(
                    duration: BMotion.fast,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: i == page ? 22 : 7, height: 7,
                    decoration: BoxDecoration(
                      color: i == page ? Colors.white : Colors.white38,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
              ])),
            if (wide && n > 1) ...[
              PositionedDirectional(start: 6, top: 0, bottom: 0, child: Center(child: _Arrow(icon: Icons.chevron_right_rounded, onTap: () => _go(page - 1)))),
              PositionedDirectional(end: 6, top: 0, bottom: 0, child: Center(child: _Arrow(icon: Icons.chevron_left_rounded, onTap: () => _go(page + 1)))),
            ],
          ]),
        ),
      ),
    );
  }
}

class _Arrow extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _Arrow({required this.icon, required this.onTap});
  @override
  Widget build(BuildContext context) => Material(
        color: Colors.black26,
        shape: const CircleBorder(),
        child: IconButton(onPressed: onTap, icon: Icon(icon, color: Colors.white, size: 34), tooltip: icon == Icons.chevron_left_rounded ? 'التالي' : 'السابق'),
      );
}

class _HeroSlide extends StatelessWidget {
  final _Feat f;
  final double headerH;
  const _HeroSlide({required this.f, required this.headerH});

  void _play(BuildContext context) {
    if (f.play != null) {
      openPlayer(context, f.play!);
    } else if (f.channel != null) {
      playChannel(context, f.channel!, f.queue ?? [f.channel!]);
    }
  }

  void _info(BuildContext context) {
    final c = f.channel;
    if (c == null) {
      _play(context);
    } else if (c.isLive) {
      showChannelSheet(context, c, f.queue ?? [c]);
    } else {
      openChannel(context, c, f.queue ?? [c]);
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final wide = context.isWide;
    final c = f.channel;
    final fav = c != null && s.isFav(c.id);
    final resume = f.progress > 0;
    final playBtn = FilledButton.icon(
      onPressed: () => _play(context),
      icon: const Icon(Icons.play_arrow_rounded, size: 28),
      label: Text(resume ? 'أكمل' : (f.live ? 'شاهد الآن' : 'تشغيل')),
    );
    final bg = HeroBackdrop(
      url: f.live ? null : f.image,
      fallback: DecoratedBox(decoration: BoxDecoration(gradient: RadialGradient(
        center: const AlignmentDirectional(.5, -.2).resolve(Directionality.of(context)), radius: 1.1,
        colors: [p.accent.withValues(alpha: .28), p.gold.withValues(alpha: .06), Colors.transparent],
      ))),
    );
    final eyebrow = Row(mainAxisSize: MainAxisSize.min, children: [
      if (f.live) ...[const LiveBadge(small: true), const SizedBox(width: 8)],
      Text(f.eyebrow, style: t.labelLarge!.copyWith(color: f.live ? p.live : p.gold, letterSpacing: .4)),
    ]);
    final art = f.live
        ? Container(
            width: wide ? 300 : 230, height: wide ? 190 : 140,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              gradient: LinearGradient(colors: [p.highlight, p.container]),
              boxShadow: const [BoxShadow(color: Color(0xAA000000), blurRadius: 30, offset: Offset(0, 14))],
            ),
            child: Stack(children: [
              Center(child: ChannelLogo(url: f.image, name: c?.name ?? f.title, size: wide ? 110 : 84, radius: 20)),
              if (f.program != null)
                Positioned(left: 14, right: 14, bottom: 12, child: Directionality(textDirection: TextDirection.ltr,
                    child: ClipRRect(borderRadius: BorderRadius.circular(2),
                        child: LinearProgressIndicator(value: f.program!.progress(DateTime.now()), minHeight: 3)))),
            ]),
          )
        : PosterArt(url: f.image, name: f.title, width: wide ? (context.isTv ? 250 : 215) : 0,
            icon: c?.kind == ChannelKind.series ? Icons.theaters_rounded : Icons.movie_outlined);
    if (wide) {
      return Stack(fit: StackFit.expand, children: [
        bg,
        Padding(
          padding: EdgeInsets.fromLTRB(56, headerH + 16, 56, 44),
          child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.end, children: [
              eyebrow,
              const SizedBox(height: 8),
              ConstrainedBox(constraints: const BoxConstraints(maxWidth: 700),
                  child: Text(f.title, maxLines: 2, overflow: TextOverflow.ellipsis,
                      style: t.displaySmall!.copyWith(fontSize: context.isTv ? 48 : 40, height: 1.15, color: Colors.white))),
              if (f.sub != null) ...[
                const SizedBox(height: 10),
                Text(f.sub!, style: t.titleMedium!.copyWith(color: p.text2, fontWeight: FontWeight.w500)),
              ],
              if (resume) ...[
                const SizedBox(height: 12),
                SizedBox(width: 260, child: Directionality(textDirection: TextDirection.ltr, child: ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(value: f.progress, minHeight: 4, backgroundColor: Colors.white24)))),
              ],
              const SizedBox(height: 22),
              Wrap(spacing: 12, runSpacing: 10, children: [
                playBtn,
                OutlinedButton.icon(onPressed: () => _info(context), icon: const Icon(Icons.info_outline_rounded), label: const Text('المزيد من المعلومات')),
                if (c != null)
                  OutlinedButton(
                    onPressed: () => s.toggleFav(c),
                    child: Icon(fav ? Icons.check_rounded : Icons.add_rounded, color: fav ? p.gold : null, semanticLabel: 'مفضلتي'),
                  ),
              ]),
            ])),
            const SizedBox(width: 40),
            art,
          ]),
        ),
      ]);
    }
    // الهاتف: الملصق في الوسط، ثم العنوان، ثم ثلاثة أزرار كنتفليكس
    Widget side(IconData icon, String label, VoidCallback onTap) => InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: SizedBox(width: 78, child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Icon(icon, color: Colors.white, size: 26),
              const SizedBox(height: 2),
              Text(label, style: t.labelSmall!.copyWith(color: Colors.white70)),
            ]),
          )),
        );
    return LayoutBuilder(builder: (context, box) {
      final ph = (box.maxHeight - headerH - 190).clamp(150.0, 420.0);
      return Stack(fit: StackFit.expand, children: [
        bg,
        Padding(
          padding: EdgeInsets.fromLTRB(16, headerH + 4, 16, 34),
          child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
            if (f.live) art else PosterArt(url: f.image, name: f.title, width: ph / 1.5,
                icon: c?.kind == ChannelKind.series ? Icons.theaters_rounded : Icons.movie_outlined),
            const SizedBox(height: 14),
            eyebrow,
            const SizedBox(height: 4),
            Text(f.title, maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center,
                style: t.headlineSmall!.copyWith(color: Colors.white)),
            if (f.sub != null)
              Text(f.sub!, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodyMedium!.copyWith(color: p.text2)),
            const SizedBox(height: 12),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              if (c != null) side(fav ? Icons.check_rounded : Icons.add_rounded, 'مفضلتي', () => s.toggleFav(c)) else const SizedBox(width: 78),
              const SizedBox(width: 8),
              playBtn,
              const SizedBox(width: 8),
              side(Icons.info_outline_rounded, 'معلومات', () => _info(context)),
            ]),
          ]),
        ),
      ]);
    });
  }
}

/// صف «الأكثر مشاهدة» بأرقام كبيرة مفرّغة بجانب الملصقات.
class _Top10Row extends StatelessWidget {
  final List<HistoryEntry> entries;
  final double hp;
  const _Top10Row({required this.entries, required this.hp});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final w = context.isTv ? 150.0 : (context.isWide ? 130.0 : 104.0);
    return SizedBox(
      height: w * 1.5 + 8,
      child: FocusTraversalGroup(child: ListView.builder(
        scrollDirection: Axis.horizontal,
        clipBehavior: Clip.none,
        padding: EdgeInsets.symmetric(horizontal: hp),
        itemCount: entries.length,
        itemBuilder: (context, i) {
          final h = entries[i];
          final c = h.item.channelId == null ? null : s.channelById(h.item.channelId!);
          final live = h.item.isLive;
          final card = ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Container(
              width: w, height: w * 1.5,
              decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [p.highlight, p.container])),
              child: live || h.item.logo == null
                  ? Center(child: ChannelLogo(url: h.item.logo, name: h.item.title, size: w * .62, radius: 14))
                  : Image.network(h.item.logo!, fit: BoxFit.cover, cacheWidth: (w * 2.5).round(),
                      errorBuilder: (_, _, _) => Center(child: ChannelLogo(url: null, name: h.item.title, size: w * .62))),
            ),
          );
          return SizedBox(
            width: w * 1.62,
            child: BTap(
              radius: 10,
              semantic: '${i + 1}: ${h.item.title}',
              onTap: () => c != null && c.kind == ChannelKind.series ? openChannel(context, c, [c]) : openPlayer(context, h.item),
              child: Stack(clipBehavior: Clip.none, children: [
                PositionedDirectional(start: 0, bottom: -w * .12, child: Text('${i + 1}', style: TextStyle(
                  fontFamily: kFont, fontSize: w * 1.05, fontWeight: FontWeight.w800, height: 1,
                  foreground: Paint()
                    ..style = PaintingStyle.stroke
                    ..strokeWidth = 3.5
                    ..color = p.text3,
                ))),
                PositionedDirectional(end: 0, top: 0, child: card),
              ]),
            ),
          );
        },
      )),
    );
  }
}

class _Row extends StatelessWidget {
  final List<Widget> children;
  final double hp;
  const _Row({required this.children, this.hp = 0});
  @override
  Widget build(BuildContext context) {
    final h = context.isTv ? 236.0 : 188.0;
    return SizedBox(
      height: h,
      child: FocusTraversalGroup(
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          clipBehavior: Clip.none,
          padding: EdgeInsets.symmetric(vertical: 4, horizontal: hp),
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
