/// ترجمة خارجية (SRT أو WebVTT) تُعرض فوق الفيديو في كل المنصات بنفس الشكل.
class Cue {
  final Duration start, end;
  final String text;
  const Cue(this.start, this.end, this.text);
}

class SubtitleTrack {
  final String name;
  final List<Cue> cues;
  const SubtitleTrack(this.name, this.cues);

  /// النص المعروض عند موضع التشغيل (مع إزاحة المزامنة).
  String? at(Duration pos, Duration offset) {
    final t = pos - offset;
    // بحث ثنائي لأن الملفات قد تحوي آلاف المقاطع
    var lo = 0, hi = cues.length - 1;
    while (lo <= hi) {
      final mid = (lo + hi) >> 1;
      final c = cues[mid];
      if (t < c.start) {
        hi = mid - 1;
      } else if (t >= c.end) {
        lo = mid + 1;
      } else {
        return c.text;
      }
    }
    return null;
  }
}

final _time = RegExp(r'(?:(\d+):)?(\d{1,2}):(\d{2})[,.](\d{1,3})');

Duration? _parseTime(String s) {
  final m = _time.firstMatch(s.trim());
  if (m == null) return null;
  final ms = m.group(4)!.padRight(3, '0');
  return Duration(
    hours: int.parse(m.group(1) ?? '0'),
    minutes: int.parse(m.group(2)!),
    seconds: int.parse(m.group(3)!),
    milliseconds: int.parse(ms),
  );
}

final _tags = RegExp(r'<[^>]+>|\{\\[^}]+\}');

/// يقرأ SRT و VTT (ويتجاهل الترويسة والوسوم والتنسيق).
SubtitleTrack parseSubtitles(String name, String raw) {
  final text = raw.replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceFirst('﻿', '');
  final cues = <Cue>[];
  for (final block in text.split(RegExp(r'\n\s*\n'))) {
    final lines = block.split('\n').where((l) => l.trim().isNotEmpty).toList();
    final i = lines.indexWhere((l) => l.contains('-->'));
    if (i < 0) continue;
    final parts = lines[i].split('-->');
    final a = _parseTime(parts[0]), b = _parseTime(parts[1]);
    if (a == null || b == null) continue;
    final body = lines.skip(i + 1).join('\n').replaceAll(_tags, '').trim();
    if (body.isNotEmpty) cues.add(Cue(a, b, body));
  }
  if (cues.isEmpty) throw const FormatException('no cues');
  cues.sort((x, y) => x.start.compareTo(y.start));
  return SubtitleTrack(name, cues);
}
