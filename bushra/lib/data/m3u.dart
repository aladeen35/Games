import 'models.dart';

class M3uResult {
  final List<Channel> channels;
  final String? epgUrl;
  M3uResult(this.channels, this.epgUrl);
}

final _attr = RegExp(r'([a-zA-Z0-9\-_]+)="([^"]*)"');
final _vodExt = RegExp(r'\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|mpg|mpeg|3gp)(\?|$)', caseSensitive: false);

/// نوع العنصر من رابطه فقط: الأفلام والحلقات ملفات ثابتة (mp4/mkv… أو مسار /movie/ و /series/).
/// اسم المجموعة لا يُعتد به، فقناة تلفزيونية في مجموعة «أفلام» تبقى بثًا مباشرًا.
ChannelKind guessKind(String url, [String group = '']) {
  final u = url.toLowerCase().split('?').first;
  if (u.contains('.m3u8') || u.endsWith('.ts') || u.endsWith('.mpd')) {
    // قوائم HLS تحت /movie/ أو /series/ (بعض المزودين) تبقى أفلامًا وحلقات
    if (u.contains('/series/')) return ChannelKind.series;
    if (u.contains('/movie/')) return ChannelKind.vod;
    return ChannelKind.live;
  }
  if (u.contains('/series/')) return ChannelKind.series;
  if (u.contains('/movie/') || _vodExt.hasMatch(u)) return ChannelKind.vod;
  return ChannelKind.live;
}

/// محلّل M3U/M3U8 متسامح: يدعم tvg-* و group-title و #EXTGRP و #EXTVLCOPT.
M3uResult parseM3u(Map<String, String> args) {
  final text = args['text']!;
  final sourceId = args['source']!;
  final lines = text.split(RegExp(r'\r?\n'));
  if (!lines.any((l) => l.startsWith('#EXTINF')) && !lines.first.trim().startsWith('#EXTM3U')) {
    // ملف روابط مجرّدة سطرًا بسطر
    final urls = lines.map((l) => l.trim()).where((l) => l.startsWith('http')).toList();
    if (urls.isEmpty) throw const FormatException('not m3u');
    var i = 0;
    return M3uResult([
      for (final u in urls)
        Channel(sourceId: sourceId, name: 'قناة ${++i}', group: 'بلا مجموعة', url: u, kind: guessKind(u, ''), number: i)
    ], null);
  }
  String? epg;
  final out = <Channel>[];
  Map<String, String> attrs = {};
  String? name, grp, ua, ref;
  var n = 0;
  for (var raw in lines) {
    final l = raw.trim();
    if (l.isEmpty) continue;
    if (l.startsWith('#EXTM3U')) {
      for (final m in _attr.allMatches(l)) {
        final k = m.group(1)!.toLowerCase();
        if (k == 'url-tvg' || k == 'x-tvg-url') epg ??= m.group(2)!.split(',').first.trim();
      }
    } else if (l.startsWith('#EXTINF')) {
      attrs = {for (final m in _attr.allMatches(l)) m.group(1)!.toLowerCase(): m.group(2)!.trim()};
      // الاسم بعد آخر فاصلة خارج علامات الاقتباس
      var inQ = false, cut = -1;
      for (var i = 0; i < l.length; i++) {
        if (l[i] == '"') inQ = !inQ;
        if (l[i] == ',' && !inQ) { cut = i; break; }
      }
      name = cut >= 0 ? l.substring(cut + 1).trim() : null;
      grp = null; ua = null; ref = null;
    } else if (l.startsWith('#EXTGRP:')) {
      grp = l.substring(8).trim();
    } else if (l.startsWith('#EXTVLCOPT:')) {
      final o = l.substring(11);
      if (o.startsWith('http-user-agent=')) ua = o.substring(16);
      if (o.startsWith('http-referrer=')) ref = o.substring(14);
    } else if (!l.startsWith('#')) {
      final group = (attrs['group-title']?.isNotEmpty == true ? attrs['group-title'] : grp) ?? 'بلا مجموعة';
      final tvgName = attrs['tvg-name'];
      final display = (name?.isNotEmpty == true ? name! : (tvgName ?? 'قناة ${n + 1}'));
      n++;
      out.add(Channel(
        sourceId: sourceId, name: display,
        altName: tvgName != null && tvgName.isNotEmpty && tvgName != display ? tvgName : null,
        group: group.split(';').first.trim(), url: l,
        logo: (attrs['tvg-logo']?.isNotEmpty ?? false) ? attrs['tvg-logo'] : null,
        tvgId: (attrs['tvg-id']?.isNotEmpty ?? false) ? attrs['tvg-id'] : null,
        userAgent: ua ?? attrs['http-user-agent'], referrer: ref ?? attrs['http-referrer'],
        kind: guessKind(l, group), number: int.tryParse(attrs['tvg-chno'] ?? '') ?? n,
      ));
      attrs = {}; name = null; grp = null; ua = null; ref = null;
    }
  }
  if (out.isEmpty) throw const FormatException('no entries');
  return M3uResult(out, epg);
}
