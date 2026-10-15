import 'dart:math' as math;
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
  @override
  void paint(Canvas canvas, Size s) {
    final r = Offset.zero & s;
    canvas.drawRect(r, Paint()..shader = const LinearGradient(
      begin: Alignment.topLeft, end: Alignment.bottomRight,
      colors: [Color(0xFF071A24), Color(0xFF06101A), Color(0xFF050B13)],
    ).createShader(r));
    final w = s.width, h = s.height;
    // توهج عام
    canvas.drawCircle(Offset(w * .08, h * .18), math.max(w, h) * .45, Paint()
      ..shader = RadialGradient(colors: [const Color(0xFF2EE6D6).withValues(alpha: .10), const Color(0x002EE6D6)])
          .createShader(Rect.fromCircle(center: Offset(w * .08, h * .18), radius: math.max(w, h) * .45)));
    canvas.drawCircle(Offset(w * .02, h * .32), h * .3, Paint()
      ..shader = RadialGradient(colors: [const Color(0xFFF7C04F).withValues(alpha: .08), const Color(0x00F7C04F)])
          .createShader(Rect.fromCircle(center: Offset(w * .02, h * .32), radius: h * .3)));

    Path ribbon(double k) => Path()
      ..moveTo(-w * .05, h * (.02 + k))
      ..cubicTo(w * .18, h * (-.02 + k), w * .26, h * (.22 + k), w * .14, h * (.42 + k))
      ..cubicTo(w * .04, h * (.60 + k), w * .16, h * (.82 + k), w * .30, h * 1.05);
    // الشريط الفيروزي العريض
    canvas.drawPath(ribbon(0), Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * .035
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 18)
      ..color = const Color(0xFF2EE6D6).withValues(alpha: .22));
    canvas.drawPath(ribbon(0), Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..color = const Color(0xFF2EE6D6).withValues(alpha: .35));
    // خط ذهبي رفيع موازٍ
    canvas.drawPath(ribbon(.06), Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.4
      ..color = const Color(0xFFF7C04F).withValues(alpha: .28));
    // نقطة الباء الذهبية المتوهجة
    final dot = Offset(w * .09, h * .34);
    canvas.drawCircle(dot, 26, Paint()
      ..color = const Color(0xFFF7C04F).withValues(alpha: .18)
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 22));
    canvas.drawCircle(dot, 7, Paint()..color = const Color(0xFFF7C04F).withValues(alpha: .55));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
