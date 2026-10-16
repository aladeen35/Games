import 'package:flutter/material.dart';
import '../core/theme.dart';

/// خلفية التطبيق. في النمط السينمائي: شريط ضوئي فيروزي وذهبي ينحني من الزاوية
/// (مستوحى من شعار البشرى) فوق ليل عميق، مع توهج خافت لا يشتت المحتوى.
class Backdrop extends StatelessWidget {
  final Widget child;
  const Backdrop({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    // بنية ثابتة في النمطين حتى لا يُعاد بناء ما تحتها عند التبديل
    return Stack(children: [
      Positioned.fill(child: p.cinematic
          ? const RepaintBoundary(child: CustomPaint(painter: _RibbonPainter()))
          : ColoredBox(color: p.bg)),
      child,
    ]);
  }
}

class _RibbonPainter extends CustomPainter {
  const _RibbonPainter();

  static const _teal = Color(0xFF2EE6D6), _tealDeep = Color(0xFF0B7F86), _gold = Color(0xFFF7C04F), _goldDeep = Color(0xFFC98A1E);

  @override
  void paint(Canvas canvas, Size s) {
    final r = Offset.zero & s;
    final w = s.width, h = s.height;
    // ليل عميق مع إضاءة خافتة من اليسار
    canvas.drawRect(r, Paint()..shader = const LinearGradient(
      begin: Alignment.topLeft, end: Alignment.bottomRight,
      colors: [Color(0xFF07202A), Color(0xFF06111C), Color(0xFF050B13)], stops: [0, .45, 1],
    ).createShader(r));

    // حجم العمل الفني يتكيف مع الشاشة: أصغر وأخفت على الهاتف
    // العمل الفني يسكن الهامش الأيسر فقط ولا يزاحم المحتوى: أصغر وأخفت على الهاتف
    final phone = w < 760;
    final u = phone ? w * .3 : (w * .13).clamp(130.0, 250.0);
    canvas.saveLayer(r, Paint()..color = Colors.white.withValues(alpha: phone ? .35 : .8));

    void glow(Offset c, double radius, Color col, double a) => canvas.drawCircle(c, radius, Paint()
      ..shader = RadialGradient(colors: [col.withValues(alpha: a), col.withValues(alpha: 0)])
          .createShader(Rect.fromCircle(center: c, radius: radius)));

    glow(Offset(u * .45, h * .22), u * 1.6, _teal, .16);
    glow(Offset(u * .25, h * .26), u * .9, _gold, .14);

    // الشريط الفيروزي العريض: ينحني من الأعلى ثم يلتف لأسفل يسارًا ثم يمتد للأسفل
    final band = Path()
      ..moveTo(-u * .25, -h * .04)
      ..cubicTo(u * .55, -h * .06, u * 1.15, h * .10, u * .95, h * .26)
      ..cubicTo(u * .80, h * .40, u * .05, h * .40, u * .02, h * .58)
      ..cubicTo(-u * .02, h * .78, u * .55, h * .86, u * 1.1, h * 1.08);
    final bandRect = Rect.fromLTWH(-u * .3, -h * .1, u * 1.6, h * 1.2);
    // توهج خارجي
    canvas.drawPath(band, Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = u * .34
      ..strokeCap = StrokeCap.round
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, u * .12)
      ..color = _teal.withValues(alpha: .18));
    // جسم الشريط بتدرج يعطي إحساس العمق
    canvas.drawPath(band, Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = u * .2
      ..strokeCap = StrokeCap.round
      ..shader = const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight,
          colors: [Color(0xFF59F5E8), _teal, _tealDeep, Color(0xFF0A3E4C)], stops: [0, .3, .65, 1]).createShader(bandRect)
      ..color = Colors.white.withValues(alpha: .55));
    // لمعة على الحافة
    canvas.drawPath(band, Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = u * .025
      ..strokeCap = StrokeCap.round
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, u * .01)
      ..color = const Color(0xFFB8FFF8).withValues(alpha: .35));

    // طيّة ذهبية تحت المثلث
    final goldFold = Path()
      ..moveTo(-u * .2, h * .16)
      ..cubicTo(u * .25, h * .18, u * .55, h * .26, u * .62, h * .34);
    canvas.drawPath(goldFold, Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = u * .13
      ..strokeCap = StrokeCap.round
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, u * .015)
      ..shader = const LinearGradient(colors: [_goldDeep, _gold, Color(0xFFFFE08A)])
          .createShader(Rect.fromLTWH(-u * .2, h * .15, u * .9, h * .2))
      ..color = Colors.white.withValues(alpha: .85));

    // مثلث التشغيل الذهبي المتوهج
    final c = Offset(u * .42, h * .2);
    final t = u * .26;
    final tri = Path()
      ..moveTo(c.dx - t * .55, c.dy - t * .72)
      ..lineTo(c.dx + t * .75, c.dy)
      ..lineTo(c.dx - t * .55, c.dy + t * .72)
      ..close();
    glow(c, t * 1.9, _gold, .45);
    canvas.drawPath(tri, Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = t * .22
      ..strokeJoin = StrokeJoin.round
      ..shader = const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight,
          colors: [Color(0xFFFFE9A6), _gold, _goldDeep]).createShader(Rect.fromCircle(center: c, radius: t)));
    canvas.drawPath(tri, Paint()
      ..shader = const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight,
          colors: [Color(0xFFFFE9A6), _gold, _goldDeep]).createShader(Rect.fromCircle(center: c, radius: t)));
    // لمعة صغيرة على المثلث
    canvas.drawCircle(Offset(c.dx - t * .25, c.dy - t * .3), t * .12, Paint()
      ..color = Colors.white.withValues(alpha: .55)
      ..maskFilter = MaskFilter.blur(BlurStyle.normal, t * .1));

    // الكرة الذهبية (نقطة الباء) بإضاءة ثلاثية الأبعاد
    final b = Offset(u * .55, h * .34);
    final br = u * .085;
    glow(b, br * 3.2, _gold, .35);
    canvas.drawCircle(b, br, Paint()
      ..shader = RadialGradient(center: const Alignment(-.35, -.4), radius: .95,
          colors: const [Color(0xFFFFF0B8), _gold, _goldDeep, Color(0xFF8A5A10)], stops: const [0, .35, .8, 1])
          .createShader(Rect.fromCircle(center: b, radius: br)));

    // موجات فيروزية رفيعة في الأسفل
    for (var i = 0; i < 4; i++) {
      final k = i * .045;
      final wave = Path()
        ..moveTo(-u * .1, h * (.62 + k))
        ..cubicTo(u * .6, h * (.55 + k), u * .9, h * (.95 + k), u * 1.6, h * (1.02 + k));
      canvas.drawPath(wave, Paint()
        ..style = PaintingStyle.stroke
        ..strokeWidth = 1.2
        ..color = _teal.withValues(alpha: .10 + i * .03));
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
