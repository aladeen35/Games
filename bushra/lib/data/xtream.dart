import 'models.dart';
import 'net.dart';

/// عميل Xtream Codes: تسجيل الدخول، ثم القنوات والأفلام بمجموعاتها.
class XtreamClient {
  final String server, user, pass;
  XtreamClient(String server, this.user, this.pass) : server = _norm(server);

  static String _norm(String s) {
    var v = s.trim();
    if (!v.startsWith('http')) v = 'http://$v';
    while (v.endsWith('/')) { v = v.substring(0, v.length - 1); }
    return v.replaceAll(RegExp(r'/player_api\.php.*$'), '');
  }

  String get _api => '$server/player_api.php?username=${Uri.encodeComponent(user)}&password=${Uri.encodeComponent(pass)}';
  String get epgUrl => '$server/xmltv.php?username=${Uri.encodeComponent(user)}&password=${Uri.encodeComponent(pass)}';

  /// فرق توقيت الخادم عن UTC بالدقائق، من time_now (محلي للخادم) و timestamp_now (UTC).
  static int tzOffsetOf(Map<String, dynamic> info) {
    try {
      final si = Map<String, dynamic>.from(info['server_info'] ?? {});
      final local = DateTime.parse('${'${si['time_now']}'.replaceFirst(' ', 'T')}Z');
      final utc = DateTime.fromMillisecondsSinceEpoch(int.parse('${si['timestamp_now']}') * 1000, isUtc: true);
      return ((local.difference(utc).inMinutes / 15).round() * 15);
    } catch (_) {
      return 0;
    }
  }

  Future<Map<String, dynamic>> login() async {
    final j = await Net.json(_api);
    if (j is! Map || j['user_info'] == null) throw NetError(NetErrorKind.badFormat, 'no user_info');
    final ui = Map<String, dynamic>.from(j['user_info']);
    if ('${ui['auth']}' == '0') throw NetError(NetErrorKind.auth, 'auth=0');
    final status = '${ui['status'] ?? ''}'.toLowerCase();
    if (status.isNotEmpty && status != 'active') throw NetError(NetErrorKind.auth, 'status=$status');
    return Map<String, dynamic>.from(j);
  }

  Future<Map<String, String>> _cats(String action) async {
    final j = await Net.json('$_api&action=$action');
    if (j is! List) return {};
    return {for (final c in j) '${c['category_id']}': '${c['category_name'] ?? ''}'};
  }

  Future<List<Channel>> fetchAll(String sourceId) async {
    final out = <Channel>[];
    final liveCats = await _cats('get_live_categories');
    final live = await Net.json('$_api&action=get_live_streams');
    if (live is List) {
      for (final s in live) {
        final id = s['stream_id'];
        out.add(Channel(
          sourceId: sourceId, name: '${s['name'] ?? ''}'.trim(),
          group: liveCats['${s['category_id']}'] ?? 'بلا مجموعة',
          url: '$server/live/$user/$pass/$id.m3u8',
          logo: (s['stream_icon'] as String?)?.isNotEmpty == true ? s['stream_icon'] : null,
          tvgId: (s['epg_channel_id'] as String?)?.isNotEmpty == true ? s['epg_channel_id'] : null,
          number: int.tryParse('${s['num']}'), kind: ChannelKind.live,
          catchupDays: '${s['tv_archive']}' == '1' ? (int.tryParse('${s['tv_archive_duration']}') ?? 0) : 0,
        ));
      }
    }
    try {
      final vodCats = await _cats('get_vod_categories');
      final vod = await Net.json('$_api&action=get_vod_streams');
      if (vod is List) {
        for (final s in vod) {
          final ext = (s['container_extension'] ?? 'mp4').toString();
          out.add(Channel(
            sourceId: sourceId, name: '${s['name'] ?? ''}'.trim(),
            group: vodCats['${s['category_id']}'] ?? 'أفلام',
            url: '$server/movie/$user/$pass/${s['stream_id']}.$ext',
            logo: (s['stream_icon'] as String?)?.isNotEmpty == true ? s['stream_icon'] : null,
            kind: ChannelKind.vod,
          ));
        }
      }
    } catch (_) {
      // بعض المزودين لا يوفّرون أفلامًا؛ القنوات تكفي
    }
    try {
      final serCats = await _cats('get_series_categories');
      final ser = await Net.json('$_api&action=get_series');
      if (ser is List) {
        for (final s in ser) {
          out.add(Channel(
            sourceId: sourceId, name: '${s['name'] ?? ''}'.trim(),
            group: serCats['${s['category_id']}'] ?? 'مسلسلات',
            url: '$seriesScheme${s['series_id']}',
            logo: (s['cover'] as String?)?.isNotEmpty == true ? s['cover'] : null,
            kind: ChannelKind.series,
          ));
        }
      }
    } catch (_) {}
    return out;
  }

  static const seriesScheme = 'xtream-series:';

  /// مواسم المسلسل وحلقاته.
  Future<SeriesInfo> seriesInfo(String seriesId) async {
    final j = await Net.json('$_api&action=get_series_info&series_id=$seriesId');
    if (j is! Map) throw NetError(NetErrorKind.badFormat, 'series info');
    final info = j['info'] is Map ? Map<String, dynamic>.from(j['info']) : <String, dynamic>{};
    final seasons = <int, List<Episode>>{};
    final eps = j['episodes'];
    void add(dynamic e, int fallbackSeason) {
      if (e is! Map) return;
      final season = int.tryParse('${e['season'] ?? fallbackSeason}') ?? fallbackSeason;
      final ext = '${e['container_extension'] ?? 'mp4'}';
      final ei = e['info'] is Map ? Map<String, dynamic>.from(e['info']) : <String, dynamic>{};
      final secs = int.tryParse('${ei['duration_secs'] ?? ''}');
      (seasons[season] ??= []).add(Episode(
        id: '${e['id']}',
        title: '${e['title'] ?? ''}'.trim(),
        number: int.tryParse('${e['episode_num']}') ?? (seasons[season]!.length + 1),
        season: season,
        url: '$server/series/$user/$pass/${e['id']}.$ext',
        plot: (ei['plot'] as String?)?.trim().isEmpty ?? true ? null : ei['plot'],
        image: (ei['movie_image'] as String?)?.isEmpty ?? true ? null : ei['movie_image'],
        duration: secs == null ? null : Duration(seconds: secs),
      ));
    }
    if (eps is Map) {
      eps.forEach((k, v) {
        if (v is List) {
          for (final e in v) {
            add(e, int.tryParse('$k') ?? 1);
          }
        }
      });
    } else if (eps is List) {
      for (final v in eps) {
        if (v is List) {
          for (final e in v) {
            add(e, 1);
          }
        }
      }
    }
    for (final l in seasons.values) {
      l.sort((a, b) => a.number.compareTo(b.number));
    }
    String? str(String k) => (info[k] is String && (info[k] as String).trim().isNotEmpty) ? (info[k] as String).trim() : null;
    return SeriesInfo(
      name: str('name') ?? '', plot: str('plot'), cover: str('cover'), genre: str('genre'),
      year: str('releaseDate') ?? str('release_date'),
      seasons: Map.fromEntries(seasons.entries.toList()..sort((a, b) => a.key.compareTo(b.key))),
    );
  }
}
