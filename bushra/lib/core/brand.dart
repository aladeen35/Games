import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'theme.dart';

enum MarkStyle { primary, mono }

/// رمز «البشرى»: إطار شاشة مستدير بشريط فيروزي وذهبي، ونافذة داكنة بمثلث تشغيل
/// ذهبي، ونقطة ذهبية أسفلها (نقطة الباء). مرسوم بالمتجهات ليبقى واضحًا حتى 20 بكسل.
class BushraMark extends StatelessWidget {
  final double size;
  final MarkStyle style;
  const BushraMark({super.key, this.size = 40, this.style = MarkStyle.primary});

  @override
  Widget build(BuildContext context) => SizedBox(
        width: size, height: size,
        child: CustomPaint(painter: _MarkPainter(style)),
      );
}

class _MarkPainter extends CustomPainter {
  final MarkStyle style;
  _MarkPainter(this.style);

  @override
  void paint(Canvas canvas, Size sz) {
    final s = sz.width;
    final mono = style == MarkStyle.mono;
    // الإطار: مستطيل مستدير مائل قليلًا كالشاشة في الشعار
    final frame = RRect.fromRectAndRadius(
        Rect.fromLTWH(s * .06, s * .10, s * .88, s * .66), Radius.circular(s * .2));
    canvas.save();
    canvas.translate(s / 2, s * .43);
    canvas.rotate(-math.pi / 60);
    canvas.translate(-s / 2, -s * .43);

    final stroke = s * .095;
    final teal = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..shader = mono
          ? null
          : const LinearGradient(colors: [Color(0xFF0D8F8A), Color(0xFF3FF0E0), Color(0xFF27D3C2)])
              .createShader(frame.outerRect);
    if (mono) teal.color = Colors.white;
    final inner = frame.deflate(stroke / 2);
    // النافذة الداكنة
    canvas.drawRRect(inner, Paint()..color = mono ? Colors.transparent : const Color(0xFF0A1B3A));
    final path = Path()..addRRect(inner);
    final metric = path.computeMetrics().first;
    final len = metric.length;
    // الشريط الفيروزي يغطي الأعلى واليمين، والذهبي يلتفّ أسفل اليسار
    canvas.drawPath(metric.extractPath(len * .02, len * .66), teal);
    final gold = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.round
      ..color = mono ? Colors.white.withValues(alpha: .75) : BColors.gold;
    canvas.drawPath(metric.extractPath(len * .70, len * .97), gold);

    // مثلث التشغيل: أبيض مستدير وفي داخله ذهبي
    final c = Offset(s * .52, s * .43);
    Path tri(double r) {
      return Path()
        ..moveTo(c.dx - r * .55, c.dy - r * .8)
        ..lineTo(c.dx + r * .85, c.dy)
        ..lineTo(c.dx - r * .55, c.dy + r * .8)
        ..close();
    }
    final white = Paint()
      ..color = mono ? Colors.white : Colors.white
      ..style = PaintingStyle.fill
      ..strokeJoin = StrokeJoin.round;
    canvas.drawPath(tri(s * .24), white);
    canvas.drawPath(tri(s * .24), Paint()
      ..color = white.color
      ..style = PaintingStyle.stroke
      ..strokeWidth = s * .06
      ..strokeJoin = StrokeJoin.round);
    canvas.drawPath(tri(s * .13), Paint()
      ..shader = mono ? null : const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
          colors: [Color(0xFFFCCB4D), Color(0xFFD99A2B)]).createShader(Rect.fromCircle(center: c, radius: s * .13))
      ..color = mono ? const Color(0xFF0D111A) : Colors.white);
    canvas.restore();

    // نقطة الباء الذهبية
    canvas.drawCircle(Offset(s * .32, s * .87), s * .075,
        Paint()..color = mono ? Colors.white : BColors.gold);
  }

  @override
  bool shouldRepaint(covariant _MarkPainter old) => old.style != style;
}

/// الرمز + اسم «البشرى» وتحته الوصف عند الحاجة.
class BushraLogo extends StatelessWidget {
  final double size;
  final bool tagline;
  const BushraLogo({super.key, this.size = 36, this.tagline = false});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return Row(mainAxisSize: MainAxisSize.min, children: [
      BushraMark(size: size),
      SizedBox(width: size * .28),
      Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text('البشرى', style: TextStyle(fontFamily: kFont, fontWeight: FontWeight.w700,
            fontSize: size * .62, height: 1.1, color: p.text)),
        if (tagline)
          Text('شاهد ما تحب، بسهولة.', style: TextStyle(fontFamily: kFont, fontSize: size * .3,
              color: p.text2, height: 1.4)),
      ]),
    ]);
  }
}
