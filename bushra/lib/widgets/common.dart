import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';

/// عنصر قابل للضغط والتركيز: حلقة فيروزية 2.5 بكسل وتكبير 1.03 عند التركيز (للتلفاز والريموت).
class BTap extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap, onLongPress;
  final double radius;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final bool autofocus;
  final String? semantic;
  /// تكبير عند التركيز أو مرور المؤشر (الملصقات أكبر قليلًا مثل نتفليكس).
  final double zoom;
  const BTap({super.key, required this.child, this.onTap, this.onLongPress, this.radius = BRadius.card,
      this.color, this.padding, this.autofocus = false, this.semantic, this.zoom = 1.03});
  @override
  State<BTap> createState() => _BTapState();
}

class _BTapState extends State<BTap> {
  bool _focus = false, _hover = false;
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final reduce = AppStore.I.settings.reduceMotion;
    final br = BorderRadius.circular(widget.radius);
    return Semantics(
      button: true,
      label: widget.semantic,
      child: AnimatedScale(
        scale: (_focus || _hover) && !reduce ? widget.zoom : 1,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOutCubic,
        child: AnimatedContainer(
          duration: BMotion.fast,
          decoration: BoxDecoration(
            borderRadius: br,
            color: widget.color,
            // في النمط السينمائي: زجاج بحافة ضوئية رفيعة
            gradient: p.cinematic && widget.color != null
                ? LinearGradient(begin: Alignment.topRight, end: Alignment.bottomLeft,
                    colors: [widget.color!, Color.lerp(widget.color!, const Color(0xFF041019), .55)!])
                : null,
            border: Border.all(
                color: _focus ? p.accent : (p.cinematic && widget.color != null ? p.border : Colors.transparent),
                width: _focus ? 2.5 : (p.cinematic ? 1 : 2.5)),
            boxShadow: _focus
                ? [BoxShadow(color: p.accent.withValues(alpha: .25), blurRadius: 18)]
                : (_hover && widget.zoom > 1.03 ? const [BoxShadow(color: Color(0x88000000), blurRadius: 22, offset: Offset(0, 10))] : null),
          ),
          child: Material(
            type: MaterialType.transparency,
            child: InkWell(
              autofocus: widget.autofocus,
              borderRadius: br,
              onTap: widget.onTap,
              onLongPress: widget.onLongPress,
              onHover: widget.zoom > 1.03 ? (h) => setState(() => _hover = h) : null,
              onFocusChange: (f) => setState(() => _focus = f),
              child: widget.padding == null ? widget.child : Padding(padding: widget.padding!, child: widget.child),
            ),
          ),
        ),
      ),
    );
  }
}

/// الحرف المميز للاسم: يتجاوز «ال» التعريف وكلمة «قناة» حتى لا تتشابه البدائل.
String _initial(String name) {
  // كلمات حقيقية فقط (يتجاهل الأقواس والرموز مثل «(بث)» و«|»)
  final words = name.replaceAll(RegExp(r'\([^)]*\)|\[[^\]]*\]'), ' ').trim().split(RegExp(r'\s+'))
      .map((w) => w.replaceAll(RegExp(r'[^\p{L}\p{N}]', unicode: true), ''))
      .where((w) => w.isNotEmpty && w != 'قناة').toList();
  if (words.isEmpty) return '•';
  // الكلمة الأخيرة تميّز عادةً قنوات الشبكة الواحدة (الإخبارية، الرياضية…)
  var n = words.length > 1 ? words.last : words.first;
  if (n.startsWith('ال') && n.length > 2) n = n.substring(2);
  if (n.startsWith('لل') && n.length > 2) n = n.substring(2);
  return n.characters.first.toUpperCase();
}

/// شعار القناة مع بديل أنيق (الحرف الأول) إذا لم يتوفر أو فشل تحميله.
class ChannelLogo extends StatelessWidget {
  final String? url;
  final String name;
  final double size;
  final double radius;
  const ChannelLogo({super.key, this.url, required this.name, this.size = 48, this.radius = 12});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final fallback = Container(
      width: size, height: size, alignment: Alignment.center,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        gradient: LinearGradient(begin: Alignment.topRight, end: Alignment.bottomLeft,
            colors: [p.highlight, p.container]),
      ),
      child: Text(
        _initial(name),
        style: TextStyle(fontFamily: kFont, fontWeight: FontWeight.w700, fontSize: size * .4, color: p.text2),
      ),
    );
    if (url == null || url!.isEmpty) return fallback;
    return ClipRRect(
      borderRadius: BorderRadius.circular(radius),
      child: Container(
        width: size, height: size, color: p.dark ? const Color(0xFF1B2433) : const Color(0xFFF0F3F7),
        padding: EdgeInsets.all(size * .1),
        child: Image.network(url!, fit: BoxFit.contain, gaplessPlayback: true,
            cacheWidth: (size * 2).round(),
            errorBuilder: (_, _, _) => fallback),
      ),
    );
  }
}

class SectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final VoidCallback? onSeeAll;
  final IconData? icon;
  const SectionHeader(this.title, {super.key, this.subtitle, this.onSeeAll, this.icon});
  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    return Padding(
      padding: const EdgeInsets.fromLTRB(0, 24, 0, 12),
      child: Row(children: [
        if (icon != null) ...[Icon(icon, size: 20, color: p.accent), const SizedBox(width: 8)],
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: t.titleLarge),
          if (subtitle != null) Text(subtitle!, style: t.bodySmall),
        ])),
        if (onSeeAll != null)
          TextButton(onPressed: onSeeAll, child: const Row(mainAxisSize: MainAxisSize.min, children: [
            Text('عرض الكل'), SizedBox(width: 4), Icon(Icons.chevron_left_rounded, size: 20),
          ])),
      ]),
    );
  }
}

class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title, body;
  final String? action;
  final VoidCallback? onAction;
  const EmptyState({super.key, required this.icon, required this.title, required this.body, this.action, this.onAction});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(
              width: 84, height: 84,
              decoration: BoxDecoration(shape: BoxShape.circle, color: p.container,
                  boxShadow: [BoxShadow(color: p.accent.withValues(alpha: .12), blurRadius: 40, spreadRadius: 4)]),
              child: Icon(icon, size: 38, color: p.accent),
            ),
            const SizedBox(height: 20),
            Text(title, style: t.titleLarge, textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text(body, style: t.bodyMedium, textAlign: TextAlign.center),
            if (action != null) ...[
              const SizedBox(height: 20),
              FilledButton(onPressed: onAction, child: Text(action!)),
            ],
          ]),
        ),
      ),
    );
  }
}

/// حالة نصية + أيقونة (لا يُعتمد على اللون وحده).
class StatusPill extends StatelessWidget {
  final String text;
  final IconData icon;
  final Color color;
  final bool dense;
  const StatusPill({super.key, required this.text, required this.icon, required this.color, this.dense = false});
  @override
  Widget build(BuildContext context) => Container(
        padding: EdgeInsets.symmetric(horizontal: dense ? 8 : 10, vertical: dense ? 3 : 5),
        decoration: BoxDecoration(color: color.withValues(alpha: .14), borderRadius: BorderRadius.circular(999)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: dense ? 13 : 15, color: color),
          const SizedBox(width: 5),
          Text(text, style: TextStyle(fontFamily: kFont, fontSize: dense ? 11 : 12.5, fontWeight: FontWeight.w600, color: color)),
        ]),
      );
}

class LiveBadge extends StatelessWidget {
  final bool small;
  const LiveBadge({super.key, this.small = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return Container(
      padding: EdgeInsets.symmetric(horizontal: small ? 6 : 8, vertical: small ? 2 : 3),
      decoration: BoxDecoration(color: p.danger, borderRadius: BorderRadius.circular(6)),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Container(width: small ? 5 : 6, height: small ? 5 : 6, decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
        const SizedBox(width: 4),
        Text('مباشر', style: TextStyle(fontFamily: kFont, fontSize: small ? 10 : 11.5, fontWeight: FontWeight.w700, color: Colors.white, height: 1.2)),
      ]),
    );
  }
}

/// بطاقة قناة للشبكة: الشعار، الاسم (والأصلي)، المجموعة، مؤشر البث، والبرنامج الحالي.
class ChannelCard extends StatelessWidget {
  final Channel channel;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;
  final bool selected;
  const ChannelCard({super.key, required this.channel, required this.onTap, this.onLongPress, this.selected = false});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final s = AppStore.I;
    final (now, _) = s.nowNext(channel.tvgId);
    final fav = s.isFav(channel.id);
    return BTap(
      onTap: onTap,
      onLongPress: onLongPress,
      color: selected ? p.highlight : p.container,
      semantic: channel.name,
      padding: const EdgeInsets.all(12),
      child: Row(children: [
        ChannelLogo(url: channel.logo, name: channel.name, size: 48),
        const SizedBox(width: 12),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
            Text(channel.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleSmall),
            if (s.settings.showOriginalNames && channel.altName != null)
              Text(channel.altName!, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.labelSmall),
            const SizedBox(height: 2),
            Text(now?.title ?? channel.group, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodySmall),
            if (now != null) ...[
              const SizedBox(height: 6),
              ClipRRect(borderRadius: BorderRadius.circular(2),
                  child: LinearProgressIndicator(value: now.progress(DateTime.now()), minHeight: 3)),
            ],
          ]),
        ),
        const SizedBox(width: 6),
        Column(mainAxisSize: MainAxisSize.min, children: [
          if (channel.isLive && s.isBroken(channel.id))
            StatusPill(text: 'غير متاح', icon: Icons.portable_wifi_off_rounded, color: p.danger, dense: true)
          else if (channel.isLive) Icon(Icons.sensors_rounded, size: 16, color: p.live, semanticLabel: 'يبث'),
          if (fav) ...[const SizedBox(height: 6), Icon(Icons.star_rounded, size: 16, color: p.gold, semanticLabel: 'مفضلة')],
        ]),
      ]),
    );
  }
}

String ago(DateTime t) {
  final d = DateTime.now().difference(t);
  if (d.inMinutes < 1) return 'الآن';
  if (d.inMinutes < 60) return 'منذ ${d.inMinutes} دقيقة';
  if (d.inHours < 24) return 'منذ ${d.inHours} ساعة';
  return 'منذ ${d.inDays} يوم';
}

String hhmm(DateTime t) => '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';

String fmtDur(Duration d) {
  final h = d.inHours, m = d.inMinutes % 60, s = d.inSeconds % 60;
  final ms = '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  return h > 0 ? '$h:$ms' : ms;
}

String fmtSize(int? b) {
  if (b == null) return '';
  if (b > 1 << 30) return '${(b / (1 << 30)).toStringAsFixed(1)} GB';
  if (b > 1 << 20) return '${(b / (1 << 20)).toStringAsFixed(0)} MB';
  return '${(b / 1024).toStringAsFixed(0)} KB';
}

void toast(BuildContext context, String msg, {IconData icon = Icons.check_circle_rounded}) {
  final p = context.bc;
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(SnackBar(content: Row(children: [
      Icon(icon, color: p.accent, size: 20), const SizedBox(width: 10), Expanded(child: Text(msg)),
    ])));
}

/// حوار إدخال الرمز الأبوي. يعيد true عند صحته.
Future<bool> askPin(BuildContext context, {String title = 'أدخل الرمز الأبوي'}) async {
  final pin = AppStore.I.settings.parentalPin;
  if (pin == null) return true;
  final c = TextEditingController();
  final ok = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(title),
      content: TextField(controller: c, autofocus: true, obscureText: true, keyboardType: TextInputType.number,
          maxLength: 6, textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, letterSpacing: 8),
          onSubmitted: (v) => Navigator.pop(ctx, v == pin)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('إلغاء')),
        FilledButton(onPressed: () => Navigator.pop(ctx, c.text == pin), child: const Text('تأكيد')),
      ],
    ),
  );
  if (ok == false && context.mounted) toast(context, 'الرمز غير صحيح', icon: Icons.lock_rounded);
  return ok ?? false;
}


/// يطلب رمزًا ويقارنه بالمتوقع.
Future<bool> askCode(BuildContext context, {required String title, required String expected}) async {
  final c = TextEditingController();
  final ok = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text(title),
      content: TextField(controller: c, autofocus: true, obscureText: true, keyboardType: TextInputType.number,
          maxLength: 6, textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, letterSpacing: 8),
          onSubmitted: (v) => Navigator.pop(ctx, v == expected)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('إلغاء')),
        FilledButton(onPressed: () => Navigator.pop(ctx, c.text == expected), child: const Text('تأكيد')),
      ],
    ),
  );
  if (ok == false && context.mounted) toast(context, 'الرمز غير صحيح', icon: Icons.lock_rounded);
  return ok ?? false;
}

/// يطلب رمزًا جديدًا من 4 إلى 6 أرقام (مع التأكيد). يعيد null عند الإلغاء.
Future<String?> askNewCode(BuildContext context, {required String title, String? hint}) async {
  final a = TextEditingController(), b = TextEditingController();
  String? err;
  final v = await showDialog<String>(
    context: context,
    builder: (ctx) => StatefulBuilder(builder: (ctx, set) => AlertDialog(
      title: Text(title),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        if (hint != null) ...[Text(hint, style: Theme.of(ctx).textTheme.bodyMedium), const SizedBox(height: 12)],
        TextField(controller: a, autofocus: true, obscureText: true, keyboardType: TextInputType.number, maxLength: 6,
            textAlign: TextAlign.center, decoration: const InputDecoration(hintText: 'الرمز', counterText: '')),
        const SizedBox(height: 10),
        TextField(controller: b, obscureText: true, keyboardType: TextInputType.number, maxLength: 6,
            textAlign: TextAlign.center, decoration: InputDecoration(hintText: 'تأكيد الرمز', counterText: '', errorText: err)),
      ]),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('لاحقًا')),
        FilledButton(onPressed: () {
          if (!RegExp(r'^\d{4,6}$').hasMatch(a.text)) return set(() => err = 'من 4 إلى 6 أرقام');
          if (a.text != b.text) return set(() => err = 'الرمزان غير متطابقين');
          Navigator.pop(ctx, a.text);
        }, child: const Text('حفظ')),
      ],
    )),
  );
  return v;
}


/// بطاقة ملصق للأفلام والمسلسلات (2:3) مع شريط التقدم إن بدأت مشاهدته.
class PosterCard extends StatelessWidget {
  final Channel channel;
  final VoidCallback onTap;
  final VoidCallback? onLongPress;
  final double progress;
  const PosterCard({super.key, required this.channel, required this.onTap, this.onLongPress, this.progress = 0});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final fav = AppStore.I.isFav(channel.id);
    final placeholder = Container(
      decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topRight, end: Alignment.bottomLeft,
          colors: [p.highlight, p.container])),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(10),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(channel.kind == ChannelKind.series ? Icons.theaters_rounded : Icons.movie_outlined, color: p.text3, size: 34),
        const SizedBox(height: 8),
        Text(channel.name, maxLines: 3, textAlign: TextAlign.center, overflow: TextOverflow.ellipsis, style: t.labelLarge),
      ]),
    );
    return BTap(
      onTap: onTap,
      onLongPress: onLongPress,
      semantic: channel.name,
      zoom: 1.07,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(BRadius.card),
            child: Stack(fit: StackFit.expand, children: [
              channel.logo == null
                  ? placeholder
                  : Image.network(channel.logo!, fit: BoxFit.cover, cacheWidth: 360, errorBuilder: (_, _, _) => placeholder),
              const DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Color(0x00000000), Color(0x00000000), Color(0x99000000)]))),
              if (fav) PositionedDirectional(top: 6, end: 6, child: Icon(Icons.star_rounded, color: p.gold, size: 20)),
              if (channel.kind == ChannelKind.series)
                PositionedDirectional(top: 6, start: 6, child: StatusPill(text: 'مسلسل', icon: Icons.theaters_rounded, color: p.accent, dense: true)),
              if (progress > 0)
                Positioned(left: 0, right: 0, bottom: 0, child: Directionality(textDirection: TextDirection.ltr,
                    child: LinearProgressIndicator(value: progress, minHeight: 4, backgroundColor: Colors.black45))),
            ]),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(4, 8, 4, 2),
          child: Text(channel.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.titleSmall),
        ),
      ]),
    );
  }
}
