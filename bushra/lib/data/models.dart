import 'dart:convert';

enum ChannelKind { live, vod, series }

enum SourceType { m3uUrl, m3uFile, xtream }

/// بصمة ثابتة قصيرة لنص (FNV-1a) تُستخدم معرّفًا للقنوات والمصادر.
String stableId(String s) {
  var h = 0x811c9dc5;
  for (final c in utf8.encode(s)) {
    h ^= c;
    h = (h * 0x01000193) & 0xffffffff;
  }
  return h.toRadixString(36);
}

class Channel {
  final String id, sourceId, name, group, url;
  final String? altName, logo, tvgId, userAgent, referrer;
  final ChannelKind kind;
  final int? number;

  Channel({
    required this.sourceId, required this.name, required this.group, required this.url,
    this.altName, this.logo, this.tvgId, this.userAgent, this.referrer,
    this.kind = ChannelKind.live, this.number, String? id,
  }) : id = id ?? stableId('$sourceId|$url|$name');

  bool get isLive => kind == ChannelKind.live;

  Channel withKind(ChannelKind k) => k == kind ? this : Channel(
        id: id, sourceId: sourceId, name: name, group: group, url: url, altName: altName, logo: logo,
        tvgId: tvgId, userAgent: userAgent, referrer: referrer, kind: k, number: number);

  Map<String, dynamic> toJson() => {
        'i': id, 's': sourceId, 'n': name, 'g': group, 'u': url,
        if (altName != null) 'a': altName, if (logo != null) 'l': logo, if (tvgId != null) 't': tvgId,
        if (userAgent != null) 'ua': userAgent, if (referrer != null) 'rf': referrer,
        'k': kind.index, if (number != null) 'no': number,
      };

  factory Channel.fromJson(Map<String, dynamic> j) => Channel(
        id: j['i'], sourceId: j['s'], name: j['n'], group: j['g'] ?? '', url: j['u'],
        altName: j['a'], logo: j['l'], tvgId: j['t'], userAgent: j['ua'], referrer: j['rf'],
        kind: ChannelKind.values[j['k'] ?? 0], number: j['no'],
      );

  Map<String, String> get headers => {
        'User-Agent': ?userAgent,
        'Referer': ?referrer,
      };
}

class Source {
  final String id;
  String name;
  final SourceType type;
  /// للعرض فقط: نطاق المصدر دون أي بيانات سرية.
  String displayHost;
  String? epgUrl;
  DateTime? lastUpdated;
  String? lastError;
  DateTime? lastErrorAt;
  int liveCount, vodCount;
  List<String> groups;
  bool hasLogos, hasEpg;
  int autoRefreshHours;

  Source({
    required this.id, required this.name, required this.type, required this.displayHost,
    this.epgUrl, this.lastUpdated, this.lastError, this.lastErrorAt, this.liveCount = 0,
    this.vodCount = 0, this.groups = const [], this.hasLogos = false, this.hasEpg = false,
    this.autoRefreshHours = 24,
  });

  int get total => liveCount + vodCount;
  /// آخر تحديث فشل لكن ما زالت نسخة سابقة ناجحة متاحة.
  bool get stale => lastError != null && lastUpdated != null;

  Map<String, dynamic> toJson() => {
        'id': id, 'name': name, 'type': type.index, 'host': displayHost, 'epg': epgUrl,
        'upd': lastUpdated?.millisecondsSinceEpoch, 'err': lastError,
        'errAt': lastErrorAt?.millisecondsSinceEpoch, 'live': liveCount, 'vod': vodCount,
        'groups': groups, 'logos': hasLogos, 'hasEpg': hasEpg, 'auto': autoRefreshHours,
      };

  factory Source.fromJson(Map<String, dynamic> j) => Source(
        id: j['id'], name: j['name'], type: SourceType.values[j['type']], displayHost: j['host'] ?? '',
        epgUrl: j['epg'],
        lastUpdated: j['upd'] == null ? null : DateTime.fromMillisecondsSinceEpoch(j['upd']),
        lastError: j['err'],
        lastErrorAt: j['errAt'] == null ? null : DateTime.fromMillisecondsSinceEpoch(j['errAt']),
        liveCount: j['live'] ?? 0, vodCount: j['vod'] ?? 0,
        groups: List<String>.from(j['groups'] ?? const []), hasLogos: j['logos'] ?? false,
        hasEpg: j['hasEpg'] ?? false, autoRefreshHours: j['auto'] ?? 24,
      );
}

/// بيانات الدخول السرية لكل مصدر — تُحفظ في التخزين الآمن لا في النص العادي.
class SourceSecret {
  final String? url, server, username, password;
  const SourceSecret({this.url, this.server, this.username, this.password});
  Map<String, dynamic> toJson() => {'url': url, 'server': server, 'user': username, 'pass': password};
  factory SourceSecret.fromJson(Map<String, dynamic> j) =>
      SourceSecret(url: j['url'], server: j['server'], username: j['user'], password: j['pass']);
}

/// ما يُشغَّل فعليًا: قناة من قائمة، أو ملف من الجهاز، أو رابط مباشر.
class Playable {
  final String key, title, url;
  final String? subtitle, logo, sourceId, tvgId, channelId;
  final bool isLive, isLocal;
  final Map<String, String> headers;
  const Playable({
    required this.key, required this.title, required this.url, this.subtitle, this.logo,
    this.sourceId, this.tvgId, this.channelId, this.isLive = false, this.isLocal = false,
    this.headers = const {},
  });

  factory Playable.channel(Channel c) => Playable(
        key: c.id, channelId: c.id, title: c.name, subtitle: c.group, url: c.url, logo: c.logo,
        sourceId: c.sourceId, tvgId: c.tvgId, isLive: c.isLive, headers: c.headers,
      );

  Map<String, dynamic> toJson() => {
        'k': key, 't': title, 'u': url, 'st': subtitle, 'l': logo, 's': sourceId, 'tv': tvgId,
        'c': channelId, 'live': isLive, 'loc': isLocal, 'h': headers,
      };
  factory Playable.fromJson(Map<String, dynamic> j) => Playable(
        key: j['k'], title: j['t'], url: j['u'], subtitle: j['st'], logo: j['l'], sourceId: j['s'],
        tvgId: j['tv'], channelId: j['c'], isLive: j['live'] ?? false, isLocal: j['loc'] ?? false,
        headers: Map<String, String>.from(j['h'] ?? const {}),
      );
}

class HistoryEntry {
  final Playable item;
  int positionMs, durationMs;
  DateTime updatedAt;
  int plays;
  HistoryEntry({required this.item, this.positionMs = 0, this.durationMs = 0, DateTime? updatedAt, this.plays = 1})
      : updatedAt = updatedAt ?? DateTime.now();

  double get progress => durationMs > 0 ? (positionMs / durationMs).clamp(0, 1) : 0;
  bool get resumable => !item.isLive && durationMs > 0 && positionMs > 15000 && progress < .95;

  Map<String, dynamic> toJson() => {
        'i': item.toJson(), 'p': positionMs, 'd': durationMs, 'at': updatedAt.millisecondsSinceEpoch, 'n': plays,
      };
  factory HistoryEntry.fromJson(Map<String, dynamic> j) => HistoryEntry(
        item: Playable.fromJson(Map<String, dynamic>.from(j['i'])), positionMs: j['p'] ?? 0,
        durationMs: j['d'] ?? 0, updatedAt: DateTime.fromMillisecondsSinceEpoch(j['at'] ?? 0), plays: j['n'] ?? 1,
      );
}

class LocalVideo {
  final String uri, name;
  final int? size;
  final DateTime addedAt;
  /// على الويب روابط blob تعيش لجلسة المتصفح فقط.
  final bool sessionOnly;
  LocalVideo({required this.uri, required this.name, this.size, DateTime? addedAt, this.sessionOnly = false})
      : addedAt = addedAt ?? DateTime.now();

  Playable toPlayable() => Playable(key: 'local:$uri', title: name, url: uri, isLocal: true, subtitle: 'من جهازك');

  Map<String, dynamic> toJson() => {'u': uri, 'n': name, 'sz': size, 'at': addedAt.millisecondsSinceEpoch};
  factory LocalVideo.fromJson(Map<String, dynamic> j) => LocalVideo(
      uri: j['u'], name: j['n'], size: j['sz'], addedAt: DateTime.fromMillisecondsSinceEpoch(j['at'] ?? 0));
}

class EpgProgram {
  final String channel, title;
  final String? desc, lang, category;
  final DateTime start, stop;
  EpgProgram({required this.channel, required this.title, required this.start, required this.stop, this.desc, this.lang, this.category});

  bool isNow(DateTime t) => !t.isBefore(start) && t.isBefore(stop);
  double progress(DateTime t) =>
      ((t.difference(start).inSeconds) / stop.difference(start).inSeconds.clamp(1, 1 << 30)).clamp(0, 1).toDouble();

  Map<String, dynamic> toJson() => {
        'c': channel, 't': title, 'd': desc, 'l': lang, 'g': category,
        's': start.millisecondsSinceEpoch, 'e': stop.millisecondsSinceEpoch,
      };
  factory EpgProgram.fromJson(Map<String, dynamic> j) => EpgProgram(
        channel: j['c'], title: j['t'], desc: j['d'], lang: j['l'], category: j['g'],
        start: DateTime.fromMillisecondsSinceEpoch(j['s']), stop: DateTime.fromMillisecondsSinceEpoch(j['e']),
      );
}

/// تذكير ببرنامج من الدليل.
class Reminder {
  final int id;
  final String channelId, channelName, title;
  final String? logo;
  final DateTime start;
  Reminder({required this.id, required this.channelId, required this.channelName, required this.title, required this.start, this.logo});

  static int idFor(String channelId, DateTime start) =>
      int.parse(stableId('$channelId|${start.millisecondsSinceEpoch}'), radix: 36) & 0x7fffffff;

  Map<String, dynamic> toJson() => {'id': id, 'c': channelId, 'cn': channelName, 't': title, 'l': logo, 's': start.millisecondsSinceEpoch};
  factory Reminder.fromJson(Map<String, dynamic> j) => Reminder(
      id: j['id'], channelId: j['c'], channelName: j['cn'], title: j['t'], logo: j['l'],
      start: DateTime.fromMillisecondsSinceEpoch(j['s']));
}

/// حلقة مسلسل من حساب Xtream.
class Episode {
  final String id, title, url;
  final int season, number;
  final String? plot, image;
  final Duration? duration;
  Episode({required this.id, required this.title, required this.url, required this.season, required this.number, this.plot, this.image, this.duration});
}

class SeriesInfo {
  final String name;
  final String? plot, cover, genre, year;
  final Map<int, List<Episode>> seasons;
  SeriesInfo({required this.name, required this.seasons, this.plot, this.cover, this.genre, this.year});
}
