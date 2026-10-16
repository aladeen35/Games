import 'package:bushra/data/m3u.dart';
import 'package:bushra/data/models.dart';
import 'package:bushra/data/open_channels.dart';
import 'package:bushra/data/search.dart';
import 'package:bushra/data/store.dart';
import 'package:bushra/data/epg.dart';
import 'package:bushra/player/subtitles.dart';
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
}
