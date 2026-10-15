import 'package:xml/xml_events.dart';
import 'models.dart';

DateTime? _xmltvTime(String? s) {
  if (s == null || s.length < 14) return null;
  final y = int.parse(s.substring(0, 4)), mo = int.parse(s.substring(4, 6)), d = int.parse(s.substring(6, 8));
  final h = int.parse(s.substring(8, 10)), mi = int.parse(s.substring(10, 12)), se = int.parse(s.substring(12, 14));
  var t = DateTime.utc(y, mo, d, h, mi, se);
  final tz = s.substring(14).trim();
  final m = RegExp(r'^([+-])(\d{2})(\d{2})').firstMatch(tz);
  if (m != null) {
    final off = Duration(hours: int.parse(m.group(2)!), minutes: int.parse(m.group(3)!));
    t = m.group(1) == '+' ? t.subtract(off) : t.add(off);
  }
  return t.toLocal();
}

/// يحلل XMLTV بالبث المتدفق (لا يبني شجرة كاملة) ويحتفظ فقط بالقنوات المعروفة
/// وبنافذة زمنية محدودة حتى يبقى خفيفًا على الهاتف والمتصفح.
List<EpgProgram> parseXmltv(Map<String, dynamic> args) {
  final text = args['text'] as String;
  final wanted = Set<String>.from(args['ids'] as List);
  final now = DateTime.now();
  final from = now.subtract(const Duration(hours: 3)), to = now.add(const Duration(hours: 36));
  final out = <EpgProgram>[];
  String? ch, title, desc, cat, lang, field;
  DateTime? start, stop;
  var inProg = false;
  for (final e in parseEvents(text)) {
    if (e is XmlStartElementEvent) {
      if (e.name == 'programme') {
        final a = {for (final x in e.attributes) x.name: x.value};
        ch = a['channel'];
        start = _xmltvTime(a['start']);
        stop = _xmltvTime(a['stop']);
        inProg = ch != null && (wanted.isEmpty || wanted.contains(ch)) && start != null && stop != null &&
            stop.isAfter(from) && start.isBefore(to);
        title = desc = cat = lang = null;
        if (e.isSelfClosing) inProg = false;
      } else if (inProg) {
        field = e.name;
        if (e.name == 'title') {
          for (final x in e.attributes) {
            if (x.name == 'lang') lang ??= x.value;
          }
        }
      }
    } else if (e is XmlTextEvent || e is XmlCDATAEvent) {
      if (!inProg || field == null) continue;
      final v = (e is XmlTextEvent ? e.value : (e as XmlCDATAEvent).value).trim();
      if (v.isEmpty) continue;
      if (field == 'title') title ??= v;
      if (field == 'desc') desc ??= v;
      if (field == 'category') cat ??= v;
    } else if (e is XmlEndElementEvent) {
      if (e.name == 'programme' && inProg && title != null) {
        out.add(EpgProgram(channel: ch!, title: title, desc: desc, category: cat, lang: lang, start: start!, stop: stop!));
        inProg = false;
      }
      field = null;
    }
  }
  out.sort((a, b) => a.start.compareTo(b.start));
  return out;
}
