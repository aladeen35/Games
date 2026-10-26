import 'package:bushra/data/m3u.dart';
import 'package:bushra/data/models.dart';
import 'package:bushra/data/open_channels.dart';
import 'package:bushra/data/search.dart';
import 'package:bushra/data/store.dart';
import 'package:bushra/data/epg.dart';
import 'package:bushra/player/subtitles.dart';
import 'dart:convert';
import 'dart:io';
import 'package:bushra/cast/cast_io.dart';
import 'package:bushra/data/pairing_io.dart';
import 'package:bushra/data/remote_bus.dart';
import 'package:bushra/data/remote_io.dart';
import 'package:bushra/data/xtream.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('M3U parser reads attributes, groups and VLC options', () {
    const text = '''#EXTM3U url-tvg="https://e.example/epg.xml.gz"
#EXTINF:-1 tvg-id="aljazeera.qa" tvg-name="Al Jazeera" tvg-logo="https://l/aj.png" group-title="أخبار",الجزيرة
#EXTVLCOPT:http-user-agent=MyUA
http://s.example/live/1.m3u8
#EXTINF:-1 group-title="Movies, VOD",Film, Part 1
http://s.example/movie/u/p/9.mp4
''';
    final r = parseM3u({'text': text, 'source': 's1'});
    expect(r.epgUrl, 'https://e.example/epg.xml.gz');
    expect(r.channels.length, 2);
    final a = r.channels.first;
    expect(a.name, 'الجزيرة');
    expect(a.altName, 'Al Jazeera');
    expect(a.group, 'أخبار');
    expect(a.tvgId, 'aljazeera.qa');
    expect(a.userAgent, 'MyUA');
    expect(a.kind, ChannelKind.live);
    expect(r.channels[1].name, 'Film, Part 1');
    expect(r.channels[1].kind, ChannelKind.vod);
  });

  test('Kind comes from the URL, not the group name', () {
    expect(guessKind('http://x/live/MBC2.m3u8', 'أفلام'), ChannelKind.live);
    expect(guessKind('http://x/stream/12.ts', 'Movies'), ChannelKind.live);
    expect(guessKind('http://x/films/a.mkv'), ChannelKind.vod);
    expect(guessKind('http://x/movie/u/p/9.mp4'), ChannelKind.vod);
    expect(guessKind('http://x/series/u/p/77.mp4'), ChannelKind.series);
    expect(guessKind('http://x/movie/u/p/9.m3u8'), ChannelKind.vod);
  });

  test('Arabic search normalizes and tolerates one typo', () {
    expect(normalize('القُرْآن الكريم'), 'القران الكريم');
    expect(score(normalize('قناة الرياضة'), expand('رياضه')), greaterThan(0));
    expect(score(normalize('Discovery Science'), expand('discovry')), greaterThan(0));
    expect(score(normalize('beIN Sports 1'), expand('رياضة')), greaterThan(0));
  });

  test('Subtitles: SRT and VTT parse, lookup with offset', () {
    const srt = '1\n00:00:01,000 --> 00:00:03,500\n<i>مرحبا</i>\n\n2\n00:00:04,000 --> 00:00:06,000\nسطر ثانٍ\nوثالث\n';
    final t = parseSubtitles('a.srt', srt);
    expect(t.cues.length, 2);
    expect(t.at(const Duration(seconds: 2), Duration.zero), 'مرحبا');
    expect(t.at(const Duration(seconds: 5), Duration.zero), 'سطر ثانٍ\nوثالث');
    expect(t.at(const Duration(milliseconds: 3700), Duration.zero), isNull);
    // ترجمة متأخرة ثانيتين تُقدَّم بإزاحة موجبة
    expect(t.at(const Duration(seconds: 4), const Duration(seconds: 2)), 'مرحبا');
    const vtt = 'WEBVTT\n\n00:01.000 --> 00:02.000 align:middle\nHello\n';
    expect(parseSubtitles('b.vtt', vtt).at(const Duration(milliseconds: 1500), Duration.zero), 'Hello');
  });

  test('Open channels: names cleaned, categories in Arabic, Arab detection', () {
    const text = '''#EXTM3U
#EXTINF:-1 tvg-id="AlJazeera.qa@SD" tvg-logo="https://l/aj.png" group-title="News",Al Jazeera (1080p)
https://example.com/aj.m3u8
#EXTINF:-1 tvg-id="Cartoon.us" group-title="Animation;Kids",Cartoon TV (720p) [Geo-blocked]
https://example.com/c.m3u8
#EXTINF:-1 group-title="Movies",Some Movies Channel
https://example.com/m.m3u8
''';
    final l = OpenChannels.parse(text);
    expect(l.length, 3);
    expect(l[0].name, 'Al Jazeera');
    expect(l[0].group, 'أخبار');
    expect(l[0].altName, '1080p');
    expect(OpenChannels.isArab(l[0]), isTrue);
    expect(l[1].group, 'رسوم متحركة');
    expect(l[1].altName, contains('محجوب'));
    expect(OpenChannels.isArab(l[1]), isFalse);
    // تصنيف «أفلام» يبقى بثًا مباشرًا لا فيلمًا
    expect(l[2].kind, ChannelKind.live);
  });

  test('Xtream account detected inside get.php links, EPG guessed', () {
    expect(xtreamFromUrl('http://srv.tv:8080/get.php?username=ali&password=123&type=m3u_plus&output=ts'),
        ('http://srv.tv:8080', 'ali', '123'));
    expect(xtreamFromUrl('https://x.com/list.m3u'), isNull);
    expect(guessEpgUrl('http://srv.tv:8080/get.php?username=ali&password=123'),
        'http://srv.tv:8080/xmltv.php?username=ali&password=123');
  });

  test('Catch-up timeshift URL uses the server time offset', () {
    final c = Channel(sourceId: 's', name: 'News', group: 'g', url: 'http://srv.tv:8080/live/ali/123/456.m3u8', catchupDays: 3);
    final start = DateTime.now().subtract(const Duration(hours: 2));
    final p = EpgProgram(channel: 'x', title: 't', start: start, stop: start.add(const Duration(minutes: 60)));
    final url = catchupUrl(c, p, 180)!;
    final t = start.toUtc().add(const Duration(minutes: 180));
    String two(int v) => v.toString().padLeft(2, '0');
    expect(url, 'http://srv.tv:8080/timeshift/ali/123/60/${t.year}-${two(t.month)}-${two(t.day)}:${two(t.hour)}-${two(t.minute)}/456.ts');
    // لا إعادة لقناة بلا أرشيف
    expect(catchupUrl(Channel(sourceId: 's', name: 'n', group: 'g', url: c.url), p, 0), isNull);
  });

  test('EPG name matching ignores quality tags and country prefixes', () {
    expect(epgNameKey('AR: MBC 2 HD'), epgNameKey('MBC 2'));
    expect(epgNameKey('الجزيرة FHD'), epgNameKey('الجزيره'));
    final now = DateTime.now().toUtc();
    String f(DateTime t) => '${t.year}${t.month.toString().padLeft(2, '0')}${t.day.toString().padLeft(2, '0')}'
        '${t.hour.toString().padLeft(2, '0')}0000 +0000';
    final xml = '<tv><channel id="mbc2.ae"><display-name>MBC 2</display-name></channel>'
        '<programme start="${f(now.subtract(const Duration(hours: 1)))}" stop="${f(now.add(const Duration(hours: 1)))}" channel="mbc2.ae"><title>Film</title></programme></tv>';
    final r = parseXmltvMatched({'text': xml, 'ids': <String>[], 'names': [['ch1', 'AR: MBC 2 HD']]});
    expect(r['matches'], {'ch1': 'mbc2.ae'});
    expect((r['programs'] as List).length, 1);
  });

  test('Cast message protobuf framing round-trips', () {
    final m = encodeCastMessage('sender-0', 'receiver-0', 'urn:x-cast:com.google.cast.receiver', '{"type":"LAUNCH","appId":"CC1AD845"}');
    final n = (m[0] << 24) | (m[1] << 16) | (m[2] << 8) | m[3];
    expect(n, m.length - 4);
    final d = decodeCastMessage(m.sublist(4));
    expect(d.src, 'sender-0');
    expect(d.dst, 'receiver-0');
    expect(d.ns, 'urn:x-cast:com.google.cast.receiver');
    expect(jsonDecode(d.payload)['appId'], 'CC1AD845');
    // نص عربي طويل (أطوال متعددة البايتات)
    final long = 'ق' * 300;
    expect(decodeCastMessage(encodeCastMessage('a', 'b', 'c', long).sublist(4)).payload, long);
  });

  test('Pair server serves the page only with its token and forwards submissions', () async {
    Map<String, String>? got;
    final srv = PairServer();
    final url = await srv.start((f) async {
      got = f;
      return (ok: true, message: 'تمت');
    }, port: 0, host: '127.0.0.1');
    expect(url, contains('k=${srv.token}'));
    final c = HttpClient();
    final u = Uri.parse(url!);
    final page = await (await c.getUrl(u)).close();
    expect(page.statusCode, 200);
    expect(await utf8.decoder.bind(page).join(), contains('أرسل إلى التلفاز'));
    final bad = await (await c.getUrl(u.replace(queryParameters: {'k': 'wrong'}))).close();
    expect(bad.statusCode, 403);
    final req = await c.postUrl(u.replace(path: '/add'));
    req.add(utf8.encode(jsonEncode({'type': 'm3u', 'url': 'http://x/list.m3u', 'name': 'بيت'})));
    final res = await req.close();
    final j = jsonDecode(await utf8.decoder.bind(res).join());
    expect(j['ok'], true);
    expect(got?['url'], 'http://x/list.m3u');
    expect(got?['name'], 'بيت');
    c.close();
    await srv.stop();
  });

  test('Profiles, series ids and auto reminders survive JSON', () {
    final p = Profile.fromJson(Profile(id: 'p1', name: 'سارة', avatar: 4, kids: true, kidsOnly: true, pin: '1234').toJson());
    expect([p.name, p.avatar, p.kids, p.kidsOnly, p.pin], ['سارة', 4, true, true, '1234']);
    final e = Playable.fromJson(const Playable(key: 'ep:s:1', title: 't', url: 'u', seriesId: 'sx').toJson());
    expect(e.isEpisode, true);
    expect(e.seriesId, 'sx');
    final r = Reminder.fromJson(Reminder(id: 1, channelId: 'c', channelName: 'n', title: 't', start: DateTime(2026), auto: true).toJson());
    expect(r.auto, true);
  });

  test('Kids filter recognizes adult and kids groups', () {
    Channel ch(String g, [String n = 'x']) => Channel(sourceId: 's', name: n, group: g, url: 'u$g$n');
    expect(AppStore.isAdultContent(ch('XXX Adult 18+')), true);
    expect(AppStore.isAdultContent(ch('أخبار')), false);
    expect(AppStore.isKidsContent(ch('Kids')), true);
    expect(AppStore.isKidsContent(ch('كرتون')), true);
    expect(AppStore.isKidsContent(ch('رياضة')), false);
  });

  test('Xtream VOD ids are read from movie links', () {
    expect(XtreamClient.vodIdOf('http://s:80/movie/u/p/1234.mkv'), '1234');
    expect(XtreamClient.vodIdOf('http://s/live/u/p/1.ts'), isNull);
  });

  test('Phone remote forwards commands and reports what is playing', () async {
    final got = <RemoteCmd>[];
    final sub = RemoteBus.stream.listen(got.add);
    RemoteBus.state = () => {'title': 'قناة', 'live': true, 'playing': true};
    final url = await RemoteServer.I.start('tok123', port: 0, host: '127.0.0.1');
    final u = Uri.parse(url!);
    final c = HttpClient();
    final page = await (await c.getUrl(u)).close();
    expect(await utf8.decoder.bind(page).join(), contains('ريموت البشرى'));
    expect((await (await c.getUrl(u.replace(queryParameters: {'k': 'x'}))).close()).statusCode, 403);
    final req = await c.postUrl(u.replace(path: '/cmd'));
    req.add(utf8.encode(jsonEncode({'a': 'search', 'v': 'أخبار'})));
    await (await req.close()).drain();
    final st = await (await c.getUrl(u.replace(path: '/state'))).close();
    expect(jsonDecode(await utf8.decoder.bind(st).join())['title'], 'قناة');
    await Future.delayed(const Duration(milliseconds: 20));
    expect(got.single.a, 'search');
    expect(got.single.v, 'أخبار');
    c.close();
    await sub.cancel();
    await RemoteServer.I.stop();
  });
}
