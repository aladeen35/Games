/// تطبيع عربي للبحث: إزالة التشكيل والتطويل وتوحيد الألف والياء والتاء المربوطة،
/// مع مطابقة تقريبية تسامح خطأ كتابة واحدًا في الكلمات الطويلة.
final _diacritics = RegExp('[ؐ-ًؚ-ٰٟۖ-ۭـ]');

String normalize(String s) {
  var t = s.toLowerCase().replaceAll(_diacritics, '');
  t = t
      .replaceAll(RegExp('[أإآٱ]'), 'ا')
      .replaceAll('ى', 'ي')
      .replaceAll('ة', 'ه')
      .replaceAll('ؤ', 'و')
      .replaceAll('ئ', 'ي')
      .replaceAll(RegExp(r'[|_\-:\[\]()]+'), ' ')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
  return t;
}

/// مرادفات بسيطة شائعة في قوائم IPTV.
const _syn = {
  'رياضه': ['sport', 'sports', 'bein', 'ssc'],
  'اخبار': ['news', 'جزيره'],
  'اطفال': ['kids', 'cartoon', 'كرتون', 'spacetoon'],
  'افلام': ['movie', 'movies', 'cinema', 'سينما'],
  'قران': ['quran', 'قرآن'],
  'وثائقي': ['doc', 'documentary', 'nat geo'],
};

List<String> expand(String q) {
  final n = normalize(q);
  final out = [n];
  _syn.forEach((k, v) {
    if (n == k || v.contains(n)) out.addAll([k, ...v]);
  });
  return out.toSet().toList();
}

bool _within1(String a, String b) {
  if ((a.length - b.length).abs() > 1) return false;
  var i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] == b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) {
      i++;
    } else if (b.length > a.length) {
      j++;
    } else {
      i++; j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/// درجة المطابقة (0 = لا تطابق). الأعلى أفضل.
int score(String haystackNorm, List<String> queries) {
  var best = 0;
  for (final q in queries) {
    if (q.isEmpty) continue;
    if (haystackNorm == q) return 100;
    if (haystackNorm.startsWith(q)) { best = best < 80 ? 80 : best; continue; }
    if (haystackNorm.contains(q)) { best = best < 60 ? 60 : best; continue; }
    if (q.length >= 4) {
      for (final w in haystackNorm.split(' ')) {
        if (w.length >= 3 && _within1(w, q)) { best = best < 40 ? 40 : best; break; }
      }
    }
  }
  return best;
}
