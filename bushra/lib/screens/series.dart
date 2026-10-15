import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/net.dart';
import '../data/store.dart';
import '../data/xtream.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'continue.dart';

bool isXtreamSeries(Channel c) => c.url.startsWith(XtreamClient.seriesScheme);

/// يفتح العنصر بالطريقة المناسبة: صفحة المسلسل لمسلسلات Xtream، وإلا المشغل مباشرة.
Future<void> openChannel(BuildContext context, Channel c, List<Channel> list) {
  if (isXtreamSeries(c)) {
    return Navigator.of(context).push(MaterialPageRoute(builder: (_) => SeriesScreen(series: c)));
  }
  return openPlayer(context, Playable.channel(c), queue: [
    for (final x in list.take(2000)) if (!isXtreamSeries(x)) Playable.channel(x),
  ]);
}

/// عنوان الحلقة الخاص إن وُجد (لا يكرر «الحلقة 3» أو اسم المسلسل مع S01E03).
String? episodeTitle(Channel series, Episode e) {
  var t = e.title.replaceAll(series.name, '').replaceAll(RegExp(r'[Ss]\d+\s*[Ee]\d+'), '').replaceAll(RegExp(r'^[\s\-–—:|]+|[\s\-–—:|]+$'), '').trim();
  if (RegExp(r'^(الحلقة|حلقة|episode|ep)\.?\s*\d+$', caseSensitive: false).hasMatch(t) || RegExp(r'^\d+$').hasMatch(t)) t = '';
  return t.isEmpty ? null : t;
}

Playable episodePlayable(Channel series, Episode e) => Playable(
      key: 'ep:${series.sourceId}:${e.id}',
      title: '${series.name} — الحلقة ${e.number}${episodeTitle(series, e) != null ? ': ${episodeTitle(series, e)}' : ''}',
      subtitle: 'الموسم ${e.season} · الحلقة ${e.number}',
      url: e.url, logo: series.logo, sourceId: series.sourceId,
    );

/// صفحة المسلسل: الغلاف والوصف، المواسم، الحلقات بتقدّم كل منها، وزر «أكمل».
class SeriesScreen extends StatefulWidget {
  final Channel series;
  const SeriesScreen({super.key, required this.series});
  @override
  State<SeriesScreen> createState() => _SeriesScreenState();
}

class _SeriesScreenState extends State<SeriesScreen> {
  SeriesInfo? info;
  String? error;
  int? season;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { error = null; info = null; });
    try {
      final sec = await AppStore.I.secretOf(widget.series.sourceId);
      if (sec.server == null) throw NetError(NetErrorKind.auth, 'no credentials');
      final x = XtreamClient(sec.server!, sec.username ?? '', sec.password ?? '');
      final i = await x.seriesInfo(widget.series.url.substring(XtreamClient.seriesScheme.length));
      if (!mounted) return;
      setState(() {
        info = i;
        season = _resumeEpisode(i)?.season ?? (i.seasons.isEmpty ? null : i.seasons.keys.first);
      });
    } catch (e) {
      if (mounted) setState(() => error = e is NetError ? e.message : 'تعذر تحميل حلقات المسلسل');
    }
  }

  /// الحلقة التي يكمل منها المستخدم: آخر حلقة لم تنتهِ، أو التالية لآخر حلقة انتهت.
  Episode? _resumeEpisode(SeriesInfo i) {
    final all = [for (final l in i.seasons.values) ...l];
    HistoryEntry? last;
    Episode? lastEp;
    for (final e in all) {
      final h = AppStore.I.historyOf(episodePlayable(widget.series, e).key);
      if (h != null && (last == null || h.updatedAt.isAfter(last.updatedAt))) {
        last = h;
        lastEp = e;
      }
    }
    if (lastEp == null) return null;
    if (last!.progress >= .95) {
      final idx = all.indexOf(lastEp);
      return idx + 1 < all.length ? all[idx + 1] : null;
    }
    return lastEp;
  }

  void _play(Episode e, List<Episode> season) {
    openPlayer(context, episodePlayable(widget.series, e),
        queue: [for (final x in season) episodePlayable(widget.series, x)]).then((_) { if (mounted) setState(() {}); });
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final c = widget.series;
    final i = info;
    final fav = AppStore.I.isFav(c.id);
    Widget body;
    if (error != null) {
      body = EmptyState(icon: Icons.cloud_off_rounded, title: 'تعذر تحميل الحلقات', body: error!, action: 'إعادة المحاولة', onAction: _load);
    } else if (i == null) {
      body = const Center(child: CircularProgressIndicator());
    } else {
      final resume = _resumeEpisode(i);
      final eps = i.seasons[season] ?? const <Episode>[];
      final hp = context.isWide ? 28.0 : 16.0;
      body = ListView(padding: EdgeInsets.fromLTRB(hp, 8, hp, 32), children: [
        Flex(
          direction: context.isWide ? Axis.horizontal : Axis.vertical,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(BRadius.player),
              child: SizedBox(
                width: context.isWide ? 220 : double.infinity, height: context.isWide ? 320 : 200,
                child: (i.cover ?? c.logo) != null
                    ? Image.network(i.cover ?? c.logo!, fit: BoxFit.cover, errorBuilder: (_, _, _) => ColoredBox(color: p.container))
                    : ColoredBox(color: p.container, child: Icon(Icons.theaters_rounded, size: 64, color: p.text3)),
              ),
            ),
            SizedBox(width: 24, height: 16),
            Flexible(
              fit: FlexFit.loose,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(i.name.isNotEmpty ? i.name : c.name, style: t.headlineMedium),
                const SizedBox(height: 6),
                Wrap(spacing: 10, runSpacing: 6, children: [
                  if (i.year != null) Text(i.year!, style: t.bodyMedium),
                  if (i.genre != null) Text(i.genre!, style: t.bodyMedium),
                  Text('${i.seasons.length} موسم · ${i.seasons.values.fold(0, (a, l) => a + l.length)} حلقة', style: t.bodyMedium),
                ]),
                if (i.plot != null) ...[const SizedBox(height: 10), Text(i.plot!, style: t.bodyLarge, maxLines: 6, overflow: TextOverflow.ellipsis)],
                const SizedBox(height: 16),
                Wrap(spacing: 10, runSpacing: 10, children: [
                  if (i.seasons.isNotEmpty)
                    FilledButton.icon(
                      autofocus: true,
                      onPressed: () {
                        final e = resume ?? i.seasons.values.first.first;
                        _play(e, i.seasons[e.season]!);
                      },
                      icon: const Icon(Icons.play_arrow_rounded),
                      label: Text(resume == null ? 'شاهد الحلقة الأولى' : 'أكمل: الموسم ${resume.season} · الحلقة ${resume.number}'),
                    ),
                  OutlinedButton.icon(
                    onPressed: () => setState(() => AppStore.I.toggleFav(c)),
                    icon: Icon(fav ? Icons.star_rounded : Icons.star_outline_rounded, color: p.gold),
                    label: Text(fav ? 'في المفضلة' : 'إضافة للمفضلة'),
                  ),
                ]),
              ]),
            ),
          ],
        ),
        const SizedBox(height: 24),
        if (i.seasons.isEmpty)
          const EmptyState(icon: Icons.video_library_outlined, title: 'لا توجد حلقات بعد', body: 'لم يضف المزود حلقات لهذا المسلسل.')
        else ...[
          SizedBox(
            height: 44,
            child: ListView(scrollDirection: Axis.horizontal, children: [
              for (final s in i.seasons.keys)
                Padding(
                  padding: const EdgeInsetsDirectional.only(end: 8),
                  child: ChoiceChip(label: Text('الموسم $s'), selected: s == season, onSelected: (_) => setState(() => season = s)),
                ),
            ]),
          ),
          const SizedBox(height: 12),
          for (final e in eps) _EpisodeTile(series: c, ep: e, onTap: () => _play(e, eps)),
        ],
      ]);
    }
    return Scaffold(appBar: AppBar(title: Text(c.name)), body: SafeArea(child: body));
  }
}

class _EpisodeTile extends StatelessWidget {
  final Channel series;
  final Episode ep;
  final VoidCallback onTap;
  const _EpisodeTile({required this.series, required this.ep, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final h = AppStore.I.historyOf(episodePlayable(series, ep).key);
    final done = h != null && h.progress >= .95;
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: BTap(
        color: p.container,
        onTap: onTap,
        padding: const EdgeInsets.all(10),
        child: Row(children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(width: 120, height: 68, child: Stack(fit: StackFit.expand, children: [
              ep.image != null
                  ? Image.network(ep.image!, fit: BoxFit.cover, errorBuilder: (_, _, _) => ColoredBox(color: p.highlight))
                  : ColoredBox(color: p.highlight, child: Center(child: Text('${ep.number}', style: t.headlineSmall))),
              Center(child: Icon(done ? Icons.check_circle_rounded : Icons.play_circle_fill_rounded,
                  color: Colors.white.withValues(alpha: .9), size: 30)),
              if (h != null && h.durationMs > 0)
                Positioned(left: 0, right: 0, bottom: 0, child: Directionality(textDirection: TextDirection.ltr,
                    child: LinearProgressIndicator(value: h.progress, minHeight: 3, backgroundColor: Colors.black45))),
            ])),
          ),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('الحلقة ${ep.number}${episodeTitle(series, ep) != null ? ' — ${episodeTitle(series, ep)}' : ''}', maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleSmall),
            Text([
              if (ep.duration != null) '${ep.duration!.inMinutes} دقيقة',
              if (h != null && h.resumable) remainingText(h),
              if (done) 'شوهدت',
            ].join(' · '), style: t.bodySmall),
            if (ep.plot != null) Text(ep.plot!, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.bodySmall),
          ])),
        ]),
      ),
    );
  }
}
