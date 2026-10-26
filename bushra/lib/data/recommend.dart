import 'models.dart';
import 'search.dart';
import 'store.dart';

/// صف اقتراحات محسوب على الجهاز من سجل الملف الحالي (بلا إنترنت ولا خادم).
class RecRow {
  final String title;
  final String kind; // because | foryou | time
  final List<Channel> items;
  const RecRow(this.title, this.kind, this.items);
}

/// كلمات مميزة في الاسم (لربط أجزاء السلسلة الواحدة مثل «الحلقة/الجزء 2»).
Set<String> _words(String name) => {
      for (final w in normalize(name).split(' '))
        if (w.length >= 3 && !RegExp(r'^\d+$').hasMatch(w) && !_stop.contains(w)) w
    };
const _stop = {'the', 'and', 'من', 'في', 'علي', 'الي', 'مع', 'hd', 'fhd', '4k', 'مدبلج', 'مترجم', 'dubbed', 'film', 'movie', 'فيلم', 'مسلسل'};

String _period(int h) => h < 5 ? 'في هذا الوقت من الليل' : h < 12 ? 'صباحًا' : h < 17 ? 'ظهرًا' : h < 21 ? 'مساءً' : 'في هذا الوقت من الليل';

List<RecRow> recommendations(AppStore s, {DateTime? now}) {
  final out = <RecRow>[];
  final t = now ?? DateTime.now();
  final watched = <String>{for (final h in s.history) ?h.item.channelId};
  final vod = s.visible(kind: ChannelKind.vod), ser = s.visible(kind: ChannelKind.series);
  final catalog = [...vod, ...ser];
  if (catalog.isNotEmpty) {
    final byGroup = <String, List<Channel>>{};
    for (final c in catalog) {
      (byGroup[c.group] ??= []).add(c);
    }

    // «لأنك شاهدت…»: من آخر فيلمين/مسلسلين في السجل
    var made = 0;
    final used = <String>{};
    for (final h in s.history) {
      if (made >= 2) break;
      final id = h.item.channelId;
      final c = id == null ? null : s.channelById(id);
      if (c == null || c.isLive || !used.add(c.group + c.kind.name)) continue;
      final w = _words(c.name);
      final same = [for (final x in byGroup[c.group] ?? const <Channel>[]) if (x.kind == c.kind && x.id != c.id && !watched.contains(x.id)) x];
      // الأقرب اسمًا أولًا (أجزاء السلسلة نفسها)، ثم الأحدث إضافة
      final ranked = [
        for (final (i, x) in same.indexed) (x, _words(x.name).intersection(w).length * 1000 + i),
      ]..sort((a, b) => b.$2.compareTo(a.$2));
      final items = ranked.map((e) => e.$1).take(20).toList();
      if (items.length >= 3) {
        out.add(RecRow('لأنك شاهدت «${c.name}»', 'because', items));
        made++;
      }
    }

    // «مقترح لك»: أكثر التصنيفات مشاهدة وتفضيلًا، بعناصر لم تشاهدها، متداخلة
    final weight = <String, double>{};
    for (final h in s.history) {
      final id = h.item.channelId;
      final c = id == null ? null : s.channelById(id);
      if (c == null || c.isLive) continue;
      weight[c.group] = (weight[c.group] ?? 0) + h.plays + (h.progress >= .95 ? 1 : 0);
    }
    for (final f in s.favorites.values) {
      if (!f.isLive) weight[f.group] = (weight[f.group] ?? 0) + 2;
    }
    final top = (weight.entries.toList()..sort((a, b) => b.value.compareTo(a.value))).take(3).map((e) => e.key).toList();
    if (top.isNotEmpty) {
      final pools = [
        for (final g in top) [for (final x in (byGroup[g] ?? const <Channel>[]).reversed) if (!watched.contains(x.id) && !s.isFav(x.id)) x]
      ];
      final mix = <Channel>[];
      for (var i = 0; mix.length < 24; i++) {
        var any = false;
        for (final p in pools) {
          if (i < p.length) {
            mix.add(p[i]);
            any = true;
          }
        }
        if (!any) break;
      }
      if (mix.length >= 4) out.add(RecRow('مقترح لك', 'foryou', mix));
    }
  }

  // «تشاهده عادة في هذا الوقت»: ما تكرر في هذه الساعة (±1) من الأيام السابقة
  final counts = <String, int>{};
  final days = <String, Set<int>>{};
  for (final (at, id) in s.watchLog) {
    final d = (at.hour - t.hour).abs();
    if (d > 1 && d < 23) continue;
    counts[id] = (counts[id] ?? 0) + 1;
    (days[id] ??= {}).add(at.year * 400 + at.month * 32 + at.day);
  }
  final habit = [
    for (final e in (counts.entries.toList()..sort((a, b) => b.value.compareTo(a.value))))
      if ((days[e.key]?.length ?? 0) >= 2) ?s.channelById(e.key),
  ].where(s.allowed).take(12).toList();
  if (habit.isNotEmpty) out.add(RecRow('تشاهده عادة ${_period(t.hour)}', 'time', habit));
  return out;
}
