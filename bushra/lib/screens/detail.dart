import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../data/xtream.dart';
import '../player/player_screen.dart';
import 'catalog.dart';
import 'continue.dart';

/// خلفية البطل: صورة عريضة واضحة إن وُجدت، وإلا الملصق نفسه مصغّرًا جدًا فيبدو ضبابيًا ناعمًا،
/// وتتلاشى أطرافها في خلفية التطبيق دون حدود ظاهرة.
class HeroBackdrop extends StatelessWidget {
  final String? url;
  final bool sharp;
  final Widget? fallback;
  const HeroBackdrop({super.key, this.url, this.sharp = false, this.fallback});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final img = url == null
        ? (fallback ?? const SizedBox.expand())
        : Image.network(url!, fit: BoxFit.cover, width: double.infinity, height: double.infinity,
            cacheWidth: sharp ? 1280 : 42, filterQuality: FilterQuality.medium, gaplessPlayback: true,
            errorBuilder: (_, _, _) => fallback ?? const SizedBox.expand());
    return Stack(fit: StackFit.expand, children: [
      ShaderMask(
        blendMode: BlendMode.dstIn,
        shaderCallback: (r) => const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [Colors.white, Colors.white, Color(0x00FFFFFF)], stops: [0, .5, 1]).createShader(r),
        child: Opacity(opacity: sharp ? .9 : .75, child: img),
      ),
      // تعتيم يضمن قراءة النص فوق أي صورة
      DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(
        begin: AlignmentDirectional.centerStart, end: AlignmentDirectional.centerEnd,
        colors: [p.bgDeep.withValues(alpha: .82), p.bgDeep.withValues(alpha: .35), p.bgDeep.withValues(alpha: .05)],
      ))),
      DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(
        begin: Alignment.topCenter, end: Alignment.bottomCenter,
        colors: [p.bgDeep.withValues(alpha: .55), p.bgDeep.withValues(alpha: 0), p.bgDeep.withValues(alpha: 0)],
        stops: const [0, .25, 1],
      ))),
    ]);
  }
}

/// ملصق بحواف دائرية وظل عميق.
class PosterArt extends StatelessWidget {
  final String? url;
  final String name;
  final double width;
  final IconData icon;
  const PosterArt({super.key, this.url, required this.name, required this.width, this.icon = Icons.movie_outlined});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final ph = Container(
      color: p.highlight, alignment: Alignment.center, padding: const EdgeInsets.all(12),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, color: p.text3, size: width * .22),
        const SizedBox(height: 8),
        Text(name, maxLines: 3, textAlign: TextAlign.center, style: t.titleSmall),
      ]),
    );
    return Container(
      width: width, height: width * 1.5,
      decoration: BoxDecoration(borderRadius: BorderRadius.circular(14),
          boxShadow: const [BoxShadow(color: Color(0xAA000000), blurRadius: 30, offset: Offset(0, 14))]),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: url == null ? ph : Image.network(url!, fit: BoxFit.cover, cacheWidth: (width * 2.5).round(), errorBuilder: (_, _, _) => ph),
      ),
    );
  }
}

/// رأس صفحات التفاصيل بأسلوب Apple TV: خلفية عريضة، عنوان كبير، بيانات، وصف، وأزرار.
class DetailHero extends StatelessWidget {
  final String title;
  final String? poster, backdrop, desc, eyebrow;
  final List<String> meta;
  final List<Widget> actions;
  final IconData icon;
  const DetailHero({super.key, required this.title, this.poster, this.backdrop, this.desc, this.eyebrow,
      this.meta = const [], this.actions = const [], this.icon = Icons.movie_outlined});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final size = MediaQuery.sizeOf(context);
    final wide = context.isWide;
    final top = MediaQuery.paddingOf(context).top + kToolbarHeight;
    final metaRow = Wrap(spacing: 10, runSpacing: 6, alignment: wide ? WrapAlignment.start : WrapAlignment.center, children: [
      for (final (i, m) in meta.indexed) ...[
        if (i > 0) Text('·', style: t.bodyMedium!.copyWith(color: p.text3)),
        Text(m, style: t.bodyMedium!.copyWith(color: m.startsWith('★') ? p.gold : p.text2, fontWeight: FontWeight.w500)),
      ],
    ]);
    final bg = HeroBackdrop(url: backdrop ?? poster, sharp: backdrop != null);
    if (wide) {
      final h = (size.height * .66).clamp(420.0, 680.0);
      return SizedBox(
        height: h,
        child: Stack(fit: StackFit.expand, children: [
          bg,
          Padding(
            padding: EdgeInsets.fromLTRB(48, top + 12, 48, 32),
            child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.end, children: [
                if (eyebrow != null) Text(eyebrow!, style: t.labelLarge!.copyWith(color: p.gold, letterSpacing: .5)),
                const SizedBox(height: 6),
                ConstrainedBox(constraints: const BoxConstraints(maxWidth: 680),
                    child: Text(title, maxLines: 2, overflow: TextOverflow.ellipsis,
                        style: t.displaySmall!.copyWith(fontSize: context.isTv ? 46 : 38, height: 1.15))),
                const SizedBox(height: 12),
                metaRow,
                if (desc != null) ...[
                  const SizedBox(height: 14),
                  ConstrainedBox(constraints: const BoxConstraints(maxWidth: 620),
                      child: Text(desc!, maxLines: 4, overflow: TextOverflow.ellipsis, style: t.bodyLarge!.copyWith(color: p.text2, height: 1.6))),
                ],
                const SizedBox(height: 22),
                Wrap(spacing: 12, runSpacing: 10, children: actions),
              ])),
              const SizedBox(width: 40),
              if (poster != null) PosterArt(url: poster, name: title, width: context.isTv ? 250 : 210, icon: icon),
            ]),
          ),
        ]),
      );
    }
    final pw = (size.width * .5).clamp(150.0, 230.0);
    return Stack(children: [
      Positioned.fill(child: bg),
      Padding(
        padding: EdgeInsets.fromLTRB(20, top, 20, 8),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Center(child: PosterArt(url: poster, name: title, width: pw, icon: icon)),
          const SizedBox(height: 18),
          if (eyebrow != null) Text(eyebrow!, textAlign: TextAlign.center, style: t.labelLarge!.copyWith(color: p.gold)),
          Text(title, textAlign: TextAlign.center, style: t.headlineMedium!.copyWith(fontSize: 26)),
          const SizedBox(height: 8),
          metaRow,
          const SizedBox(height: 16),
          ...[for (final a in actions) Padding(padding: const EdgeInsets.only(bottom: 8), child: a)],
          if (desc != null) ...[
            const SizedBox(height: 6),
            Text(desc!, style: t.bodyMedium!.copyWith(height: 1.6)),
          ],
        ]),
      ),
    ]);
  }
}

String fmtRuntime(Duration d) => d.inHours > 0 ? '${d.inHours} س ${d.inMinutes % 60} د' : '${d.inMinutes} د';

/// صفحة الفيلم بأسلوب نتفليكس: الخلفية، الأزرار (تشغيل/أكمل/من البداية/المفضلة/الإعلان)، القصة، ومشابهة.
class MovieDetailScreen extends StatefulWidget {
  final Channel movie;
  final List<Channel> list;
  const MovieDetailScreen({super.key, required this.movie, this.list = const []});
  @override
  State<MovieDetailScreen> createState() => _MovieDetailScreenState();
}

class _MovieDetailScreenState extends State<MovieDetailScreen> {
  VodInfo? info;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final id = XtreamClient.vodIdOf(widget.movie.url);
    if (id == null) return;
    try {
      final sec = await AppStore.I.secretOf(widget.movie.sourceId);
      if (sec.server == null) return;
      final i = await XtreamClient(sec.server!, sec.username ?? '', sec.password ?? '').vodInfo(id);
      if (mounted) setState(() => info = i);
    } catch (_) {}
  }

  void _play({bool fromStart = false}) {
    final s = AppStore.I;
    final m = widget.movie;
    final key = Playable.channel(m).key;
    final h = s.historyOf(key);
    if (fromStart && h != null) s.updateProgress(key, Duration.zero, Duration(milliseconds: h.durationMs));
    openPlayer(context, Playable.channel(m), queue: [for (final x in widget.list.take(2000)) Playable.channel(x)])
        .then((_) { if (mounted) setState(() {}); });
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final m = widget.movie;
    final i = info;
    final h = s.historyOf(Playable.channel(m).key);
    final fav = s.isFav(m.id);
    final similar = [
      for (final x in (widget.list.isNotEmpty ? widget.list : s.visible(kind: ChannelKind.vod)))
        if (x.group == m.group && x.id != m.id) x
    ];
    final meta = [
      if (i?.year != null) i!.year!,
      if (i?.rating != null) '★ ${i!.rating!.toStringAsFixed(1)}',
      if (i?.duration != null) fmtRuntime(i!.duration!),
      if (i?.genre != null) i!.genre! else m.group,
    ];
    final actions = <Widget>[
      FilledButton.icon(
        autofocus: true,
        onPressed: _play,
        icon: const Icon(Icons.play_arrow_rounded, size: 26),
        label: Text(h != null && h.resumable ? 'أكمل · ${remainingText(h)}' : 'تشغيل'),
      ),
      if (h != null && h.resumable)
        OutlinedButton.icon(onPressed: () => _play(fromStart: true), icon: const Icon(Icons.replay_rounded), label: const Text('من البداية')),
      OutlinedButton.icon(
        onPressed: () => setState(() => s.toggleFav(m)),
        icon: Icon(fav ? Icons.check_rounded : Icons.add_rounded, color: fav ? p.gold : null),
        label: Text(fav ? 'في مفضلتي' : 'مفضلتي'),
      ),
      if (i?.trailer != null)
        OutlinedButton.icon(
          onPressed: () => launchUrl(Uri.parse('https://www.youtube.com/watch?v=${i!.trailer}'), mode: LaunchMode.externalApplication),
          icon: const Icon(Icons.smart_display_outlined),
          label: const Text('الإعلان'),
        ),
    ];
    final hp = context.isWide ? 48.0 : 20.0;
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent),
      body: CustomScrollView(slivers: [
        SliverToBoxAdapter(child: DetailHero(
          title: m.name, poster: i?.poster ?? m.logo, backdrop: i?.backdrop, desc: i?.plot,
          eyebrow: 'فيلم', meta: meta, actions: actions,
        )),
        if (h != null && h.resumable)
          SliverToBoxAdapter(child: Padding(
            padding: EdgeInsets.fromLTRB(hp, 4, hp, 0),
            child: Row(children: [
              Expanded(child: Directionality(textDirection: TextDirection.ltr, child: ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: LinearProgressIndicator(value: h.progress, minHeight: 4, backgroundColor: p.highlight)))),
              const SizedBox(width: 12),
              Text(remainingText(h), style: t.bodySmall),
            ]),
          )),
        if (i?.cast != null || i?.director != null)
          SliverToBoxAdapter(child: Padding(
            padding: EdgeInsets.fromLTRB(hp, 16, hp, 0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (i?.cast != null) Text.rich(TextSpan(children: [
                TextSpan(text: 'بطولة: ', style: t.bodyMedium!.copyWith(color: p.text3)),
                TextSpan(text: i!.cast, style: t.bodyMedium),
              ]), maxLines: 2, overflow: TextOverflow.ellipsis),
              if (i?.director != null) Text.rich(TextSpan(children: [
                TextSpan(text: 'إخراج: ', style: t.bodyMedium!.copyWith(color: p.text3)),
                TextSpan(text: i!.director, style: t.bodyMedium),
              ])),
            ]),
          )),
        if (similar.isNotEmpty)
          SliverToBoxAdapter(child: PosterRow(title: 'مشابهة', icon: Icons.auto_awesome_rounded, items: similar, hp: hp,
              onMore: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => GroupGridScreen(title: m.group, items: similar))))),
        const SliverToBoxAdapter(child: SizedBox(height: 40)),
      ]),
    );
  }
}
