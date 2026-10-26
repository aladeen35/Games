import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import '../data/models.dart';

/// صور الملفات المضمّنة: وجوه مرسومة برمجيًا وأيقونات على تدرجات زاهية (بلا ملفات صور).
class AvatarArt {
  final List<Color> colors;
  final int face; // -1 = أيقونة
  final IconData? icon;
  const AvatarArt(this.colors, {this.face = -1, this.icon});

  static const all = [
    AvatarArt([Color(0xFF3D7BFF), Color(0xFF1B3FA8)], face: 0),
    AvatarArt([Color(0xFFFF5F6D), Color(0xFFB0233A)], face: 1),
    AvatarArt([Color(0xFFF7C04F), Color(0xFFD9822B)], face: 2),
    AvatarArt([Color(0xFF2EE6D6), Color(0xFF0B7F86)], face: 3),
    AvatarArt([Color(0xFFB57BFF), Color(0xFF5B2CA8)], face: 4),
    AvatarArt([Color(0xFF58D68D), Color(0xFF1E8A4C)], face: 5),
    AvatarArt([Color(0xFF8A9BB0), Color(0xFF3B4A5E)], face: 6),
    AvatarArt([Color(0xFFFF8FC7), Color(0xFFC2307A)], face: 7),
    AvatarArt([Color(0xFF1A2B4A), Color(0xFF070D1A)], icon: Icons.rocket_launch_rounded),
    AvatarArt([Color(0xFF16A34A), Color(0xFF0B4F26)], icon: Icons.sports_soccer_rounded),
    AvatarArt([Color(0xFFFF9F43), Color(0xFFC0561B)], icon: Icons.pets_rounded),
    AvatarArt([Color(0xFF7C4DFF), Color(0xFF311B92)], icon: Icons.sports_esports_rounded),
    AvatarArt([Color(0xFFE84393), Color(0xFF7A1E4F)], icon: Icons.music_note_rounded),
    AvatarArt([Color(0xFF00B894), Color(0xFF006C57)], icon: Icons.local_florist_rounded),
    AvatarArt([Color(0xFFFFD166), Color(0xFFB8860B)], icon: Icons.auto_awesome_rounded),
    AvatarArt([Color(0xFF74B9FF), Color(0xFF2D6CB5)], icon: Icons.child_care_rounded),
  ];
}

final _imgCache = <int, Uint8List>{};

/// صورة الملف الشخصي: مربع بحواف دائرية مثل نتفليكس.
class ProfileAvatar extends StatelessWidget {
  final Profile? profile;
  final int? avatar;
  final String? image;
  final double size;
  const ProfileAvatar({super.key, this.profile, this.avatar, this.image, this.size = 48});

  @override
  Widget build(BuildContext context) {
    final a = avatar ?? profile?.avatar ?? 0;
    final img = image ?? profile?.image;
    final r = BorderRadius.circular(size * .16);
    if (a < 0 && img != null) {
      final bytes = _imgCache[img.hashCode] ??= base64Decode(img);
      return ClipRRect(borderRadius: r, child: Image.memory(bytes, width: size, height: size, fit: BoxFit.cover, gaplessPlayback: true));
    }
    final art = AvatarArt.all[a.clamp(0, AvatarArt.all.length - 1)];
    return Container(
      width: size, height: size,
      decoration: BoxDecoration(
        borderRadius: r,
        gradient: LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: art.colors),
      ),
      child: art.face >= 0
          ? CustomPaint(painter: _FacePainter(art.face))
          : Icon(art.icon, color: Colors.white.withValues(alpha: .92), size: size * .52),
    );
  }
}

class _FacePainter extends CustomPainter {
  final int face;
  _FacePainter(this.face);

  @override
  void paint(Canvas canvas, Size s) {
    final w = s.width;
    final ink = Paint()..color = Colors.white;
    final line = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = w * .06
      ..strokeCap = StrokeCap.round;
    final ey = w * .40, el = w * .33, er = w * .67;
    void smile({double y = .62, double width = .36, double depth = .14}) {
      final p = Path()
        ..moveTo(w * (.5 - width / 2), w * y)
        ..quadraticBezierTo(w * .5, w * (y + depth * 1.6), w * (.5 + width / 2), w * y);
      canvas.drawPath(p, line);
    }

    switch (face) {
      case 0: // ابتسامة
        canvas.drawOval(Rect.fromCenter(center: Offset(el, ey), width: w * .09, height: w * .14), ink);
        canvas.drawOval(Rect.fromCenter(center: Offset(er, ey), width: w * .09, height: w * .14), ink);
        smile();
      case 1: // غمزة
        canvas.drawOval(Rect.fromCenter(center: Offset(el, ey), width: w * .09, height: w * .14), ink);
        canvas.drawArc(Rect.fromCenter(center: Offset(er, ey + w * .02), width: w * .14, height: w * .10), math.pi, math.pi, false, line);
        smile(width: .40);
      case 2: // نظارة شمسية
        final g = Paint()..color = const Color(0xFF14181F);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(el, ey), width: w * .25, height: w * .15), Radius.circular(w * .05)), g);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(er, ey), width: w * .25, height: w * .15), Radius.circular(w * .05)), g);
        canvas.drawLine(Offset(el + w * .1, ey - w * .03), Offset(er - w * .1, ey - w * .03), line..color = const Color(0xFF14181F));
        line.color = Colors.white;
        final p = Path()
          ..moveTo(w * .38, w * .66)
          ..quadraticBezierTo(w * .55, w * .74, w * .66, w * .60);
        canvas.drawPath(p, line);
      case 3: // متفاجئ
        canvas.drawCircle(Offset(el, ey), w * .07, ink);
        canvas.drawCircle(Offset(er, ey), w * .07, ink);
        canvas.drawOval(Rect.fromCenter(center: Offset(w * .5, w * .68), width: w * .14, height: w * .17), line);
      case 4: // قطة
        final ear = Paint()..color = Colors.white.withValues(alpha: .9);
        canvas.drawPath(Path()..moveTo(w * .14, w * .30)..lineTo(w * .2, w * .06)..lineTo(w * .38, w * .2)..close(), ear);
        canvas.drawPath(Path()..moveTo(w * .86, w * .30)..lineTo(w * .8, w * .06)..lineTo(w * .62, w * .2)..close(), ear);
        canvas.drawOval(Rect.fromCenter(center: Offset(el, ey + w * .04), width: w * .08, height: w * .13), ink);
        canvas.drawOval(Rect.fromCenter(center: Offset(er, ey + w * .04), width: w * .08, height: w * .13), ink);
        final thin = Paint()..color = Colors.white..strokeWidth = w * .025..strokeCap = StrokeCap.round;
        for (final dy in [-.03, .03]) {
          canvas.drawLine(Offset(w * .12, w * (.62 + dy)), Offset(w * .32, w * (.6 + dy / 2)), thin);
          canvas.drawLine(Offset(w * .88, w * (.62 + dy)), Offset(w * .68, w * (.6 + dy / 2)), thin);
        }
        final m = Path()
          ..moveTo(w * .4, w * .64)
          ..quadraticBezierTo(w * .45, w * .72, w * .5, w * .64)
          ..quadraticBezierTo(w * .55, w * .72, w * .6, w * .64);
        canvas.drawPath(m, line..strokeWidth = w * .045);
      case 5: // سعيد جدًا
        canvas.drawArc(Rect.fromCenter(center: Offset(el, ey + w * .03), width: w * .15, height: w * .12), math.pi, math.pi, false, line);
        canvas.drawArc(Rect.fromCenter(center: Offset(er, ey + w * .03), width: w * .15, height: w * .12), math.pi, math.pi, false, line);
        canvas.drawPath(Path()
          ..moveTo(w * .3, w * .58)
          ..quadraticBezierTo(w * .5, w * .9, w * .7, w * .58)
          ..close(), ink);
      case 6: // روبوت
        canvas.drawLine(Offset(w * .5, w * .1), Offset(w * .5, w * .2), line);
        canvas.drawCircle(Offset(w * .5, w * .09), w * .045, ink);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(el, ey), width: w * .17, height: w * .1), Radius.circular(w * .02)), ink);
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(er, ey), width: w * .17, height: w * .1), Radius.circular(w * .02)), ink);
        final grill = Paint()..color = Colors.white..style = PaintingStyle.stroke..strokeWidth = w * .035;
        canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromCenter(center: Offset(w * .5, w * .68), width: w * .36, height: w * .13), Radius.circular(w * .03)), grill);
        for (final x in [.42, .5, .58]) {
          canvas.drawLine(Offset(w * x, w * .62), Offset(w * x, w * .74), grill);
        }
      default: // عيون نجوم
        for (final c in [Offset(el, ey), Offset(er, ey)]) {
          canvas.drawPath(_star(c, w * .1, w * .045), ink);
        }
        smile(width: .34, depth: .16);
    }
  }

  Path _star(Offset c, double r1, double r2) {
    final p = Path();
    for (var i = 0; i < 10; i++) {
      final r = i.isEven ? r1 : r2;
      final a = -math.pi / 2 + i * math.pi / 5;
      final o = c + Offset(math.cos(a) * r, math.sin(a) * r);
      i == 0 ? p.moveTo(o.dx, o.dy) : p.lineTo(o.dx, o.dy);
    }
    return p..close();
  }

  @override
  bool shouldRepaint(_FacePainter old) => old.face != face;
}

/// يصغّر صورة من الجهاز إلى مربع (قص من الوسط) ويعيدها PNG بترميز base64.
Future<String?> squareAvatar(Uint8List bytes, {int size = 220}) async {
  try {
    final buf = await ui.ImmutableBuffer.fromUint8List(bytes);
    final codec = await ui.instantiateImageCodecWithSize(buf, getTargetSize: (w, h) {
      final scale = size / math.min(w, h);
      return ui.TargetImageSize(width: (w * scale).ceil(), height: (h * scale).ceil());
    });
    final img = (await codec.getNextFrame()).image;
    final side = math.min(img.width, img.height).toDouble();
    final rec = ui.PictureRecorder();
    Canvas(rec).drawImageRect(img,
        Rect.fromLTWH((img.width - side) / 2, (img.height - side) / 2, side, side),
        Rect.fromLTWH(0, 0, size.toDouble(), size.toDouble()), Paint()..filterQuality = FilterQuality.medium);
    final out = await rec.endRecording().toImage(size, size);
    final data = await out.toByteData(format: ui.ImageByteFormat.png);
    if (data == null) return null;
    return base64Encode(data.buffer.asUint8List());
  } catch (_) {
    return null;
  }
}
