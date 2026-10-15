import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'shell.dart';

/// دليل البرامج: وضع بطاقي للهاتف، ووضع زمني (شبكة أفقية) للشاشات الكبيرة.
class EpgScreen extends StatefulWidget {
  const EpgScreen({super.key});
  @override
  State<EpgScreen> createState() => _EpgScreenState();
}

class _EpgScreenState extends State<EpgScreen> {
  bool? timeline;
  int limit = 60;
  int day = 0; // 0 = اليوم، 1 = غدًا
  (Channel, EpgProgram)? selected;
  final _h = ScrollController();
  static const pxPerMin = 4.0;
  static const nameW = 168.0;

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final tl = timeline ?? context.isWide;
    final chans = s.visible(kind: ChannelKind.live).where((c) => s.programsOf(c.tvgId).isNotEmpty).toList();
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);

    final header = Padding(
      padding: EdgeInsets.fromLTRB(hp, 14, hp, 8),
      child: Wrap(crossAxisAlignment: WrapCrossAlignment.center, spacing: 12, runSpacing: 8, children: [
        Text('دليل البرامج', style: t.headlineSmall),
        if (s.epgLoading) StatusPill(text: 'يتم التحديث', icon: Icons.sync_rounded, color: p.accent, dense: true),
        Text('${hhmm(DateTime.now())}  ·  ${_dayLabel(DateTime.now().add(Duration(days: day)))}', style: t.titleSmall!.copyWith(color: p.text2)),
        if (chans.isNotEmpty) ...[
          SegmentedButton<int>(
            showSelectedIcon: false,
            segments: const [ButtonSegment(value: 0, label: Text('اليوم')), ButtonSegment(value: 1, label: Text('غدًا'))],
            selected: {day},
            onSelectionChanged: (v) => setState(() { day = v.first; if (_h.hasClients) _h.jumpTo(0); }),
          ),
          SegmentedButton<bool>(
            showSelectedIcon: false,
            segments: const [
              ButtonSegment(value: true, label: Text('زمني'), icon: Icon(Icons.view_timeline_outlined)),
              ButtonSegment(value: false, label: Text('بطاقات'), icon: Icon(Icons.view_agenda_outlined)),
            ],
            selected: {tl},
            onSelectionChanged: (v) => setState(() => timeline = v.first),
          ),
          if (tl && day == 0) FilledButton.tonalIcon(onPressed: _jumpNow, icon: const Icon(Icons.my_location_rounded, size: 18), label: const Text('ما يُعرض الآن')),
        ],
      ]),
    );

    if (chans.isEmpty) {
      return SafeArea(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        header,
        Expanded(child: EmptyState(
          icon: Icons.calendar_month_outlined,
          title: s.epgLoading ? 'جارٍ تحميل دليل البرامج…' : 'لا يتوفر دليل برامج بعد',
          body: s.epgError ?? (s.sources.isEmpty
              ? 'أضف قائمة أولًا. حسابات Xtream تجلب الدليل تلقائيًا.'
              : 'أضف رابط دليل XMLTV لقائمتك من «قوائمي»، وسيُطابق القنوات عبر tvg-id.'),
          action: s.sources.isEmpty ? null : 'إعداد الدليل',
          onAction: () => Shell.go('lists'),
        )),
      ]));
    }

    return SafeArea(
      bottom: false,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        header,
        Expanded(child: tl
            ? (context.isWide
                ? Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Expanded(child: _timeline(chans.take(limit).toList(), chans.length, hp)),
                    Padding(padding: EdgeInsetsDirectional.only(end: hp), child: _detail(chans)),
                  ])
                : _timeline(chans.take(limit).toList(), chans.length, hp))
            : _cards(chans, hp)),
      ]),
    );
  }

  void _jumpNow() {
    if (!_h.hasClients) return;
    final start = _windowStart();
    final x = DateTime.now().difference(start).inMinutes * pxPerMin - 60;
    _h.animateTo(x.clamp(0, _h.position.maxScrollExtent), duration: const Duration(milliseconds: 300), curve: Curves.easeOutCubic);
  }

  DateTime _windowStart() {
    if (day == 1) {
      final n = DateTime.now().add(const Duration(days: 1));
      return DateTime(n.year, n.month, n.day);
    }
    final n = DateTime.now().subtract(const Duration(hours: 1));
    return DateTime(n.year, n.month, n.day, n.hour, n.minute >= 30 ? 30 : 0);
  }

  static const _days = ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  static const _months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  String _dayLabel(DateTime d) => '${_days[d.weekday - 1]} ${d.day} ${_months[d.month - 1]} ${d.year}';

  /// لوحة تفاصيل البرنامج المحدد (الشاشات الكبيرة).
  Widget _detail(List<Channel> chans) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final s = AppStore.I;
    var sel = selected;
    if (sel == null) {
      for (final c in chans) {
        final (n, _) = s.nowNext(c.tvgId);
        if (n != null) { sel = (c, n); break; }
      }
    }
    if (sel == null) return const SizedBox.shrink();
    final (c, pr) = sel;
    final now = DateTime.now();
    final live = pr.isNow(now);
    return Container(
      width: 320,
      margin: const EdgeInsetsDirectional.only(start: 16, bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.player),
          border: Border.all(color: p.cinematic ? p.border : Colors.transparent)),
      child: SingleChildScrollView(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        AspectRatio(aspectRatio: 16 / 10, child: Container(
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(BRadius.card),
              gradient: RadialGradient(colors: [p.accent.withValues(alpha: .25), p.highlight, p.container], radius: 1.1)),
          child: Center(child: ChannelLogo(url: c.logo, name: c.name, size: 84, radius: 18)),
        )),
        const SizedBox(height: 14),
        if (live) Align(alignment: AlignmentDirectional.centerStart, child: const LiveBadge(small: true)),
        const SizedBox(height: 6),
        Text(pr.title, style: t.headlineSmall),
        Text(c.name, style: t.bodySmall),
        const SizedBox(height: 10),
        Row(children: [
          Text('${hhmm(pr.start)} - ${hhmm(pr.stop)}', style: t.titleSmall),
          const Spacer(),
          if (live) Text('${pr.stop.difference(now).inMinutes} دقيقة متبقية', style: t.bodySmall),
        ]),
        if (live) ...[
          const SizedBox(height: 8),
          Directionality(textDirection: TextDirection.ltr, child: ClipRRect(borderRadius: BorderRadius.circular(3),
              child: LinearProgressIndicator(value: pr.progress(now), minHeight: 5))),
        ],
        if (pr.desc != null) ...[const SizedBox(height: 12), Text(pr.desc!, style: t.bodyMedium, maxLines: 6, overflow: TextOverflow.ellipsis)],
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: () => openPlayer(context, Playable.channel(c), queue: queueOf(chans)),
          icon: const Icon(Icons.play_arrow_rounded),
          label: Text(live ? 'شاهد الآن' : 'شاهد القناة'),
        ),
      ])),
    );
  }

  Widget _timeline(List<Channel> chans, int total, double hp) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final start = _windowStart();
    final end = start.add(const Duration(hours: 12));
    final width = end.difference(start).inMinutes * pxPerMin;
    const rowH = 64.0;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_h.hasClients && _h.offset == 0) _jumpNow();
    });
    final nowX = DateTime.now().difference(start).inMinutes * pxPerMin;
    return SingleChildScrollView(
      padding: EdgeInsets.fromLTRB(hp, 0, hp, 24),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // عمود القنوات الثابت
        SizedBox(width: nameW, child: Column(children: [
          const SizedBox(height: 36),
          for (final c in chans)
            SizedBox(height: rowH, child: Padding(
              padding: const EdgeInsets.only(bottom: 6, left: 6),
              child: BTap(
                color: p.container,
                radius: 12,
                onTap: () => openPlayer(context, Playable.channel(c), queue: queueOf(chans)),
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: Row(children: [
                  ChannelLogo(url: c.logo, name: c.name, size: 36, radius: 8),
                  const SizedBox(width: 8),
                  Expanded(child: Text(c.name, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.labelLarge)),
                ]),
              ),
            )),
          if (total > chans.length)
            TextButton(onPressed: () => setState(() => limit += 60), child: Text('عرض المزيد (${total - chans.length})')),
        ])),
        // الشبكة الزمنية (الوقت من اليسار لليمين)
        Expanded(child: Directionality(
          textDirection: TextDirection.ltr,
          child: SingleChildScrollView(
            controller: _h,
            scrollDirection: Axis.horizontal,
            child: SizedBox(width: width, child: Stack(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                SizedBox(height: 36, child: Stack(children: [
                  for (var m = 0; m < end.difference(start).inMinutes; m += 30)
                    Positioned(left: m * pxPerMin, top: 8, child: Text(hhmm(start.add(Duration(minutes: m))), style: t.labelMedium)),
                ])),
                for (final c in chans)
                  SizedBox(height: rowH, child: Stack(children: [
                    for (final pr in s.programsOf(c.tvgId))
                      if (pr.stop.isAfter(start) && pr.start.isBefore(end))
                        _progBox(c, chans, pr, start, rowH),
                  ])),
              ]),
              // خط «الآن» مع فقاعة الوقت
              if (nowX > 0 && nowX < width) ...[
                Positioned(left: nowX, top: 30, bottom: 0, child: IgnorePointer(child: Container(width: 2,
                    decoration: BoxDecoration(color: p.accent, boxShadow: [BoxShadow(color: p.accent.withValues(alpha: .6), blurRadius: 8)])))),
                Positioned(left: nowX - 26, top: 2, child: IgnorePointer(child: Container(
                  width: 54, padding: const EdgeInsets.symmetric(vertical: 3),
                  decoration: BoxDecoration(color: p.accent, borderRadius: BorderRadius.circular(999)),
                  child: Text(hhmm(DateTime.now()), textAlign: TextAlign.center,
                      style: t.labelMedium!.copyWith(color: BColors.midnight950, fontWeight: FontWeight.w700)),
                ))),
              ],
            ])),
          ),
        )),
      ]),
    );
  }

  Widget _progBox(Channel c, List<Channel> chans, EpgProgram pr, DateTime start, double rowH) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final now = DateTime.now();
    final s0 = pr.start.isBefore(start) ? start : pr.start;
    final left = s0.difference(start).inMinutes * pxPerMin;
    final w = (pr.stop.difference(s0).inMinutes * pxPerMin - 4).clamp(24.0, 99999.0);
    final isNow = pr.isNow(now);
    final isNext = !isNow && pr.start.isAfter(now) && pr.start.difference(now).inMinutes < 120;
    return Positioned(
      left: left, top: 0, width: w, height: rowH - 6,
      child: Directionality(
        textDirection: TextDirection.rtl,
        child: BTap(
          radius: 10,
          color: isNow ? p.accent.withValues(alpha: .12) : (isNext ? p.elevated : p.container),
          onTap: () => context.isWide ? setState(() => selected = (c, pr)) : showProgramSheet(context, c, pr, chans),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: (selected?.$2 == pr) ? Border.all(color: p.gold, width: 2)
                  : isNow ? Border.all(color: p.accent, width: 1.5) : null,
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
              Text(pr.title, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.labelLarge),
              Text('${hhmm(pr.start)} – ${hhmm(pr.stop)}', maxLines: 1, style: t.labelSmall),
            ]),
          ),
        ),
      ),
    );
  }

  Widget _cards(List<Channel> chans, double hp) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return ListView.separated(
      padding: EdgeInsets.fromLTRB(hp, 4, hp, 24),
      itemCount: chans.length,
      separatorBuilder: (_, _) => const SizedBox(height: 12),
      itemBuilder: (_, i) {
        final c = chans[i];
        final (now, next) = s.nowNext(c.tvgId);
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(children: [
              ChannelLogo(url: c.logo, name: c.name, size: 40, radius: 10),
              const SizedBox(width: 10),
              Expanded(child: Text(c.name, style: t.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis)),
              FilledButton.tonalIcon(
                onPressed: () => openPlayer(context, Playable.channel(c), queue: queueOf(chans)),
                icon: const Icon(Icons.play_arrow_rounded, size: 18), label: const Text('مشاهدة'),
              ),
            ]),
            const SizedBox(height: 12),
            if (now != null)
              InkWell(
                onTap: () => showProgramSheet(context, c, now, chans),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text('الآن', style: t.labelMedium!.copyWith(color: p.accent)),
                    const SizedBox(width: 8),
                    Expanded(child: Text(now.title, style: t.titleSmall, maxLines: 1, overflow: TextOverflow.ellipsis)),
                    Text('${hhmm(now.start)} – ${hhmm(now.stop)}', style: t.labelMedium),
                  ]),
                  const SizedBox(height: 6),
                  Directionality(textDirection: TextDirection.ltr,
                      child: LinearProgressIndicator(value: now.progress(DateTime.now()), minHeight: 3)),
                ]),
              ),
            if (next != null) ...[
              const SizedBox(height: 10),
              InkWell(
                onTap: () => showProgramSheet(context, c, next, chans),
                child: Row(children: [
                  Text('القادم', style: t.labelMedium),
                  const SizedBox(width: 8),
                  Expanded(child: Text(next.title, style: t.bodyMedium, maxLines: 1, overflow: TextOverflow.ellipsis)),
                  Text(hhmm(next.start), style: t.labelMedium),
                ]),
              ),
            ],
          ]),
        );
      },
    );
  }
}

/// صفحة البرنامج المختصرة. لا وعود بالتسجيل أو التذكير لأن المصدر لا يضمنهما.
Future<void> showProgramSheet(BuildContext context, Channel c, EpgProgram pr, List<Channel> chans) {
  final t = Theme.of(context).textTheme;
  final p = context.bc;
  final now = pr.isNow(DateTime.now());
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (ctx) => SafeArea(child: Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        if (now) Align(alignment: AlignmentDirectional.centerStart,
            child: StatusPill(text: 'يبث الآن', icon: Icons.sensors_rounded, color: p.live, dense: true)),
        const SizedBox(height: 8),
        Text(pr.title, style: t.headlineSmall),
        const SizedBox(height: 6),
        Wrap(spacing: 14, runSpacing: 4, children: [
          Text(c.name, style: t.bodyMedium),
          Text('${hhmm(pr.start)} – ${hhmm(pr.stop)}', style: t.bodyMedium),
          if (pr.lang != null) Text('اللغة: ${pr.lang}', style: t.bodyMedium),
          if (pr.category != null) Text(pr.category!, style: t.bodyMedium),
        ]),
        if (pr.desc != null) ...[const SizedBox(height: 12), Text(pr.desc!, style: t.bodyLarge)],
        const SizedBox(height: 18),
        if (now)
          FilledButton.icon(
            onPressed: () { Navigator.pop(ctx); openPlayer(context, Playable.channel(c), queue: queueOf(chans)); },
            icon: const Icon(Icons.play_arrow_rounded), label: const Text('شاهد الآن'),
          )
        else
          Text('يبدأ ${pr.start.day}/${pr.start.month} الساعة ${hhmm(pr.start)}', style: t.bodySmall, textAlign: TextAlign.center),
      ]),
    )),
  );
}
