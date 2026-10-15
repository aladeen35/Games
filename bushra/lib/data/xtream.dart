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
    return out;
  }
}
