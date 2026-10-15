import 'm3u.dart';
import 'models.dart';

/// القنوات المفتوحة المصدر المضمّنة في التطبيق: قائمة مشروع iptv-org العامة.
class OpenChannels {
  static const url = 'https://iptv-org.github.io/iptv/index.m3u';
  static const sourceId = 'open';
  static const arabGroup = 'قنوات عربية';

  /// أسماء تصنيفات iptv-org بالعربية.
  static const categories = {
    'animation': 'رسوم متحركة', 'auto': 'سيارات', 'business': 'أعمال', 'classic': 'كلاسيكيات',
    'comedy': 'كوميديا', 'cooking': 'طبخ', 'culture': 'ثقافة', 'documentary': 'وثائقي',
    'education': 'تعليم', 'entertainment': 'ترفيه', 'family': 'عائلة', 'general': 'عام',
    'interactive': 'تفاعلي', 'kids': 'أطفال', 'legislative': 'برلمان', 'lifestyle': 'أسلوب حياة',
    'movies': 'أفلام', 'music': 'موسيقى', 'news': 'أخبار', 'outdoor': 'طبيعة ومغامرة',
    'public': 'عامة', 'relax': 'استرخاء', 'religious': 'ديني', 'science': 'علوم', 'series': 'مسلسلات',
    'shop': 'تسوق', 'sports': 'رياضة', 'travel': 'سفر', 'weather': 'طقس', 'undefined': 'أخرى',
  };

  static const arabCountries = {
    'ae', 'sa', 'qa', 'kw', 'bh', 'om', 'eg', 'jo', 'lb', 'sy', 'iq', 'ps', 'ye', 'ly', 'tn', 'dz', 'ma',
    'sd', 'mr', 'so', 'dj', 'km',
  };

  static final _tags = RegExp(r'\s*(\((\d{3,4}p)\)|\[([^\]]+)\])');

  /// رمز الدولة من tvg-id مثل AlJazeera.qa@SD
  static String? countryOf(Channel c) {
    final id = c.tvgId;
    if (id == null) return null;
    final m = RegExp(r'\.([a-z]{2})(@|$)').firstMatch(id.toLowerCase());
    return m?.group(1);
  }

  static bool isArab(Channel c) {
    final cc = countryOf(c);
    if (cc != null) return arabCountries.contains(cc);
    return RegExp('[؀-ۿ]').hasMatch(c.name);
  }

  /// يحلل القائمة وينظف الأسماء: يزيل (1080p) و[Geo-blocked] ويضعها وصفًا صغيرًا.
  static List<Channel> parse(String text) {
    final r = parseM3u({'text': text, 'source': sourceId});
    return [
      for (final c in r.channels)
        () {
          final notes = <String>[];
          for (final m in _tags.allMatches(c.name)) {
            if (m.group(2) != null) notes.add(m.group(2)!);
            final t = m.group(3)?.toLowerCase();
            if (t == 'geo-blocked') notes.add('قد يكون محجوبًا جغرافيًا');
            if (t == 'not 24/7') notes.add('لا يبث طوال اليوم');
          }
          final name = c.name.replaceAll(_tags, '').trim();
          final g = c.group.toLowerCase().trim();
          return Channel(
            id: c.id, sourceId: sourceId, name: name.isEmpty ? c.name : name,
            altName: notes.isEmpty ? null : notes.join(' · '),
            group: categories[g] ?? (c.group.isEmpty ? 'أخرى' : c.group),
            url: c.url, logo: c.logo, tvgId: c.tvgId, userAgent: c.userAgent, referrer: c.referrer,
            kind: ChannelKind.live, number: c.number,
          );
        }()
    ];
  }
}

List<Channel> parseOpenChannels(String text) => OpenChannels.parse(text);
