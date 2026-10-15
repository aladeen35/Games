import 'package:bushra/data/m3u.dart';
import 'package:bushra/data/models.dart';
import 'package:bushra/data/search.dart';
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

  test('Arabic search normalizes and tolerates one typo', () {
    expect(normalize('القُرْآن الكريم'), 'القران الكريم');
    expect(score(normalize('قناة الرياضة'), expand('رياضه')), greaterThan(0));
    expect(score(normalize('Discovery Science'), expand('discovry')), greaterThan(0));
    expect(score(normalize('beIN Sports 1'), expand('رياضة')), greaterThan(0));
  });
}
