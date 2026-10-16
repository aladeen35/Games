import 'package:bushra/data/m3u.dart';
import 'package:bushra/data/models.dart';
import 'package:bushra/data/open_channels.dart';
import 'package:bushra/data/search.dart';
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
}
