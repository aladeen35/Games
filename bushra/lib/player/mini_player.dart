import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../widgets/common.dart';
import 'engine.dart';
import 'session.dart';

/// النافذة المصغّرة العائمة: تبقى فوق كل الصفحات أثناء التصفح، تُسحب لأي زاوية،
/// وبلمسة تعود للمشغل بملء الشاشة.
class MiniPlayer extends StatefulWidget {
  final VoidCallback onExpand;
  const MiniPlayer({super.key, required this.onExpand});
  @override
  State<MiniPlayer> createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> {
  Offset? pos; // موضع الزاوية العليا للنافذة
  Offset? _drag;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: PlayerSession.I,
      builder: (context, _) {
        final ss = PlayerSession.I;
        final e = ss.engine, it = ss.item;
        if (e == null || it == null) return const SizedBox.shrink();
        final mq = MediaQuery.of(context);
        final size = mq.size;
        final wide = size.width >= 760, tv = size.width >= 1100;
        final w = tv ? 380.0 : (wide ? 320.0 : (size.width * .56).clamp(190.0, 260.0));
        final h = w * 9 / 16 + 44;
        // فوق الشريط السفلي على الهاتف
        final bottomGap = (wide ? 24.0 : 84.0) + mq.padding.bottom;
        final def = Offset(16, size.height - h - bottomGap);
        var at = _drag ?? pos ?? def;
        at = Offset(at.dx.clamp(8.0, size.width - w - 8), at.dy.clamp(mq.padding.top + 8, size.height - h - 8));
        final playing = e.phase == Phase.playing || e.phase == Phase.buffering;
        final t = Theme.of(context).textTheme;
        return Positioned(
          left: at.dx, top: at.dy, width: w, height: h,
          child: GestureDetector(
            onPanUpdate: (d) => setState(() => _drag = (_drag ?? at) + d.delta),
            onPanEnd: (d) {
              // يلتصق بأقرب زاوية
              final c = _drag ?? at;
              final left = c.dx + w / 2 < size.width / 2;
              final top = c.dy + h / 2 < size.height / 2;
              setState(() {
                pos = Offset(left ? 16 : size.width - w - 16, top ? mq.padding.top + 16 : size.height - h - bottomGap);
                _drag = null;
              });
            },
            onTap: widget.onExpand,
            child: Material(
              color: const Color(0xFF0A1220),
              elevation: 18,
              shadowColor: Colors.black,
              borderRadius: BorderRadius.circular(16),
              child: Column(children: [
                AspectRatio(
                  aspectRatio: 16 / 9,
                  child: Stack(fit: StackFit.expand, children: [
                    IgnorePointer(child: e.view(fill: ss.fill)),
                    if (e.phase == Phase.connecting || e.phase == Phase.buffering)
                      const Center(child: SizedBox(width: 26, height: 26, child: CircularProgressIndicator(strokeWidth: 2.5, color: BColors.teal))),
                    if (e.phase == Phase.error)
                      const Center(child: Icon(Icons.wifi_off_rounded, color: BColors.gold, size: 30)),
                    if (it.isLive) const PositionedDirectional(top: 6, start: 6, child: LiveBadge(small: true)),
                    if (!it.isLive && e.duration > Duration.zero)
                      Positioned(left: 0, right: 0, bottom: 0, child: Directionality(
                        textDirection: TextDirection.ltr,
                        child: LinearProgressIndicator(
                          value: (e.position.inMilliseconds / e.duration.inMilliseconds).clamp(0, 1).toDouble(),
                          minHeight: 3, color: BColors.teal, backgroundColor: Colors.white24),
                      )),
                  ]),
                ),
                Expanded(child: Row(children: [
                  const SizedBox(width: 10),
                  Expanded(child: Text(it.title, maxLines: 1, overflow: TextOverflow.ellipsis,
                      style: t.labelLarge!.copyWith(color: Colors.white))),
                  _MiniBtn(icon: playing ? Icons.pause_rounded : Icons.play_arrow_rounded, label: playing ? 'إيقاف مؤقت' : 'تشغيل', onTap: ss.toggle),
                  _MiniBtn(icon: Icons.open_in_full_rounded, label: 'ملء الشاشة', onTap: widget.onExpand),
                  _MiniBtn(icon: Icons.close_rounded, label: 'إغلاق', onTap: ss.close),
                ])),
              ]),
            ),
          ),
        );
      },
    );
  }
}

class _MiniBtn extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _MiniBtn({required this.icon, required this.label, required this.onTap});
  @override
  Widget build(BuildContext context) => Semantics(
        button: true,
        label: label,
        child: InkResponse(
          onTap: onTap,
          radius: 22,
          child: Padding(padding: const EdgeInsets.all(8), child: Icon(icon, color: Colors.white, size: 22)),
        ),
      );
}
