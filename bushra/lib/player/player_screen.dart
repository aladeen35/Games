import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../widgets/common.dart';
import '../data/net.dart';
import 'engine.dart';
import 'subtitles.dart';

/// يفتح المشغل. [queue] قائمة القنوات للتنقل بالقناة التالية/السابقة.
Future<void> openPlayer(BuildContext context, Playable item, {List<Playable>? queue}) async {
  final s = AppStore.I;
  if (item.channelId != null) {
    final c = s.channelById(item.channelId!);
    if (c != null && s.settings.lockedGroups.contains(c.group) && !s.parentalUnlocked) {
      if (!await askPin(context)) return;
      s.parentalUnlocked = true;
    }
  }
  if (!context.mounted) return;
  await Navigator.of(context).push(PageRouteBuilder(
    opaque: true,
    transitionDuration: BMotion.page,
    pageBuilder: (_, _, _) => PlayerScreen(item: item, queue: queue),
    transitionsBuilder: (_, a, _, child) => FadeTransition(opacity: a, child: child),
  ));
}

class PlayerScreen extends StatefulWidget {
  final Playable item;
  final List<Playable>? queue;
  const PlayerScreen({super.key, required this.item, this.queue});
  @override
  State<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> {
  final e = Engine.create();
  final s = AppStore.I;
  late Playable item = widget.item;
  late bool fill = s.settings.fillScreen;
  bool overlay = true, locked = false, fullscreen = false;
  Timer? _hide, _retry, _slow, _clock;
  int retryIn = 0, reconnects = 0;
  bool slow = false;
  String? qualityLabel; // null = تلقائي
  final _focus = FocusNode();
  DateTime _bufferSince = DateTime.now();
  String? _seekFlash;
  Timer? _flashT;
  SubtitleTrack? sub;
  Duration subOffset = Duration.zero;

  @override
  void initState() {
    super.initState();
    WakelockPlus.enable().catchError((_) {});
    plat.enterPlayerMode();
    plat.setAutoPip(true);
    e.addListener(_onEngine);
    _open(item);
    _clock = Timer.periodic(const Duration(seconds: 30), (_) { if (mounted) setState(() {}); });
  }

  void _open(Playable p, {bool resume = true, bool reconnect = false}) {
    _retry?.cancel();
    retryIn = 0;
    slow = false;
    if (!reconnect && p.key != item.key) {
      sub = null;
      subOffset = Duration.zero;
    }
    item = p;
    if (!reconnect) s.recordPlay(p);
    final h = s.historyOf(p.key);
    final startAt = resume && s.settings.resume && h != null && h.resumable ? Duration(milliseconds: h.positionMs) : null;
    e.open(p, startAt: startAt);
    _poke();
    setState(() {});
  }

  Phase _last = Phase.idle;
  void _onEngine() {
    if (!mounted) return;
    if (e.phase == Phase.buffering && _last != Phase.buffering) {
      _bufferSince = DateTime.now();
      _slow?.cancel();
      _slow = Timer(const Duration(seconds: 6), () {
        if (mounted && e.phase == Phase.buffering) setState(() => slow = true);
      });
    }
    if (e.phase == Phase.playing) {
      slow = false;
      _slow?.cancel();
    }
    if (e.phase == Phase.error && _last != Phase.error) _scheduleRetry();
    if (e.phase == Phase.ended && _last != Phase.ended && s.settings.autoplayNext && !item.isLive) _next(1);
    if (!item.isLive && e.duration > Duration.zero) s.updateProgress(item.key, e.position, e.duration);
    _last = e.phase;
    setState(() {});
  }

  /// إعادة اتصال تلقائية بعد 5 ثوانٍ لانقطاع الشبكة فقط (لا لانتهاء الصلاحية أو الصيغة).
  void _scheduleRetry() {
    if (!s.settings.autoReconnect || e.fail != FailKind.network || item.isLocal) return;
    retryIn = 5;
    _retry?.cancel();
    _retry = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return t.cancel();
      setState(() => retryIn--);
      if (retryIn <= 0) {
        t.cancel();
        _reconnect();
      }
    });
  }

  void _reconnect() {
    reconnects++;
    _open(item, reconnect: true);
  }

  void _poke() {
    _hide?.cancel();
    if (!overlay) setState(() => overlay = true);
    _hide = Timer(const Duration(seconds: 4), () {
      if (mounted && e.phase == Phase.playing && !locked) setState(() => overlay = false);
    });
  }

  int get _qIndex => widget.queue?.indexWhere((q) => q.key == item.key) ?? -1;

  void _next(int dir) {
    final q = widget.queue;
    if (q == null || q.length < 2) return;
    final i = _qIndex;
    _open(q[((i < 0 ? 0 : i) + dir) % q.length], resume: true);
  }

  void _seekBy(int sec) {
    if (!e.canSeek) return;
    e.seek(e.position + Duration(seconds: sec));
    _flashT?.cancel();
    setState(() => _seekFlash = sec > 0 ? '+$sec ث' : '$sec ث');
    _flashT = Timer(const Duration(milliseconds: 700), () { if (mounted) setState(() => _seekFlash = null); });
    _poke();
  }

  void _toggle() {
    if (e.phase == Phase.playing || e.phase == Phase.buffering) {
      e.pause();
    } else {
      e.play();
    }
    _poke();
  }

  Future<void> _toggleFullscreen() async {
    fullscreen = !fullscreen;
    await plat.setLandscape(fullscreen);
    setState(() {});
  }

  KeyEventResult _onKey(FocusNode n, KeyEvent ev) {
    if (ev is! KeyDownEvent && ev is! KeyRepeatEvent) return KeyEventResult.ignored;
    final k = ev.logicalKey;
    if (k == LogicalKeyboardKey.space || k == LogicalKeyboardKey.mediaPlayPause || k == LogicalKeyboardKey.keyK) {
      _toggle();
    } else if (k == LogicalKeyboardKey.mediaPlay) {
      e.play();
    } else if (k == LogicalKeyboardKey.mediaPause) {
      e.pause();
    } else if (k == LogicalKeyboardKey.arrowRight || k == LogicalKeyboardKey.mediaFastForward) {
      if (!overlay || !e.canSeek) { e.canSeek ? _seekBy(10) : _poke(); } else { return KeyEventResult.ignored; }
    } else if (k == LogicalKeyboardKey.arrowLeft || k == LogicalKeyboardKey.mediaRewind) {
      if (!overlay || !e.canSeek) { e.canSeek ? _seekBy(-10) : _poke(); } else { return KeyEventResult.ignored; }
    } else if (k == LogicalKeyboardKey.channelUp || k == LogicalKeyboardKey.pageUp || (k == LogicalKeyboardKey.arrowUp && !overlay)) {
      item.isLive ? _next(-1) : _poke();
    } else if (k == LogicalKeyboardKey.channelDown || k == LogicalKeyboardKey.pageDown || (k == LogicalKeyboardKey.arrowDown && !overlay)) {
      item.isLive ? _next(1) : _poke();
    } else if (k == LogicalKeyboardKey.mediaTrackNext) {
      _next(1);
    } else if (k == LogicalKeyboardKey.mediaTrackPrevious) {
      _next(-1);
    } else if (k == LogicalKeyboardKey.keyF) {
      _toggleFullscreen();
    } else if (k == LogicalKeyboardKey.keyM) {
      e.setVolume(e.volume > 0 ? 0 : 1);
    } else if (k == LogicalKeyboardKey.contextMenu || k == LogicalKeyboardKey.info) {
      _more();
    } else if ((k == LogicalKeyboardKey.select || k == LogicalKeyboardKey.enter) && !overlay) {
      _poke();
    } else {
      if (!overlay) _poke();
      return KeyEventResult.ignored;
    }
    return KeyEventResult.handled;
  }

  @override
  void dispose() {
    for (final t in [_hide, _retry, _slow, _clock, _flashT]) {
      t?.cancel();
    }
    if (!item.isLive && e.duration > Duration.zero) s.updateProgress(item.key, e.position, e.duration);
    e.removeListener(_onEngine);
    e.dispose();
    _focus.dispose();
    WakelockPlus.disable().catchError((_) {});
    plat.setAutoPip(false);
    plat.exitPlayerMode();
    super.dispose();
  }

  // ———————————————————— الواجهة ————————————————————
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final ch = item.channelId == null ? null : s.channelById(item.channelId!);
    final (now, next) = s.nowNext(item.tvgId);
    return PopScope(
      canPop: !locked,
      onPopInvokedWithResult: (did, _) {
        if (!did && locked) _poke();
      },
      child: Focus(
        focusNode: _focus,
        autofocus: true,
        onKeyEvent: _onKey,
        child: Scaffold(
          backgroundColor: const Color(0xFF05070B),
          body: MouseRegion(
            onHover: (_) => _poke(),
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => overlay && e.phase == Phase.playing ? setState(() => overlay = false) : _poke(),
              onDoubleTapDown: (d) {
                final w = MediaQuery.sizeOf(context).width;
                // شريط الزمن من اليسار لليمين: يسار = رجوع، يمين = تقديم
                _seekBy(d.localPosition.dx < w / 2 ? -10 : 10);
              },
              child: Stack(fit: StackFit.expand, children: [
                Positioned.fill(child: IgnorePointer(child: e.view(fill: fill))),
                // علامة مائية صغيرة شفافة في الزاوية
                Positioned(top: 18, left: 18, child: IgnorePointer(
                    child: Opacity(opacity: overlay ? 0 : .18, child: const BushraMark(size: 22, style: MarkStyle.mono)))),
                if (_seekFlash != null)
                  Center(child: _Glass(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                      child: Text(_seekFlash!, style: const TextStyle(fontFamily: kFont, fontSize: 20, color: Colors.white, fontWeight: FontWeight.w600))))),
                if (sub != null) _subtitleLayer(),
                _stateLayer(p),
                AnimatedOpacity(
                  opacity: overlay ? 1 : 0,
                  duration: const Duration(milliseconds: 200),
                  child: IgnorePointer(ignoring: !overlay, child: locked ? _lockedLayer() : _controls(p, ch, now, next)),
                ),
              ]),
            ),
          ),
        ),
      ),
    );
  }

  Widget _lockedLayer() => SafeArea(
        child: Align(
          alignment: Alignment.bottomCenter,
          child: Padding(padding: const EdgeInsets.all(24), child: _Glass(child: TextButton.icon(
            onPressed: () => setState(() { locked = false; _poke(); }),
            icon: const Icon(Icons.lock_open_rounded, color: Colors.white),
            label: const Text('فتح القفل', style: TextStyle(color: Colors.white)),
          ))),
        ),
      );

  /// طبقة الحالات: لا تختفي تلقائيًا مع أدوات التحكم.
  Widget _stateLayer(BPalette p) {
    final t = Theme.of(context).textTheme;
    if (e.phase == Phase.connecting) {
      return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        _Pulse(child: item.logo != null
            ? ChannelLogo(url: item.logo, name: item.title, size: 84, radius: 20)
            : const BushraMark(size: 72)),
        const SizedBox(height: 18),
        Text(item.isLocal ? 'جارٍ فتح الملف…' : 'جارٍ الاتصال بالبث…', style: t.titleMedium!.copyWith(color: Colors.white)),
        const SizedBox(height: 4),
        Text(item.title, style: t.bodyMedium!.copyWith(color: Colors.white70)),
      ]));
    }
    if (e.phase == Phase.error) return _errorCard(p);
    if (e.phase == Phase.buffering) {
      return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        const SizedBox(width: 44, height: 44, child: CircularProgressIndicator(strokeWidth: 3, color: BColors.teal)),
        if (slow) ...[
          const SizedBox(height: 16),
          _Glass(child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 10, 8, 10),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.network_check_rounded, color: BColors.gold, size: 20),
              const SizedBox(width: 8),
              Text('الاتصال بطيء — البث يعمل بجودة منخفضة مؤقتًا', style: t.bodyMedium!.copyWith(color: Colors.white)),
              const SizedBox(width: 8),
              TextButton(onPressed: _qualitySheet, child: const Text('تبديل الجودة')),
            ]),
          )),
        ],
      ]));
    }
    return const SizedBox.shrink();
  }

  Widget _errorCard(BPalette p) {
    final t = Theme.of(context).textTheme;
    final (IconData icon, String title, String body) = switch (e.fail) {
      FailKind.auth => (Icons.key_off_rounded, 'انتهت صلاحية الرابط أو بيانات الدخول', 'المصدر رفض الاتصال. حدّث بيانات الحساب أو الرابط من «قوائمي».'),
      FailKind.unsupported => (Icons.extension_off_rounded, 'صيغة غير مدعومة على هذا الجهاز',
          'هذا الملف أو البث يستخدم ترميزًا لا يستطيع ${plat.supportsPip || !plat.isWebHttps ? 'الجهاز' : 'المتصفح'} فكّه. جرّب تطبيق البشرى على الجوال أو مصدرًا بجودة أخرى.'),
      FailKind.mixedContent => (Icons.shield_outlined, 'المتصفح يمنع هذا البث',
          'الصفحة آمنة (https) والبث غير مشفّر (http)، فيمنعه المتصفح. شغّله من تطبيق البشرى على الجوال أو التلفاز، أو فعّل وسيط الويب من الإعدادات.'),
      FailKind.blocked => (Icons.block_rounded, 'تعذر الوصول للبث من المتصفح',
          'المصدر لا يسمح بالتشغيل من صفحات الويب (CORS). يعمل عادةً من تطبيق الجوال، أو عبر وسيط الويب في الإعدادات.'),
      FailKind.drm => (Icons.lock_outline_rounded, 'بث محمي',
          'هذا المصدر يحتاج تفويضًا متوافقًا (DRM) لا يوفره الرابط. لا يتجاوز البشرى أنظمة الحماية.'),
      _ => (Icons.wifi_off_rounded, 'انقطع الاتصال',
          retryIn > 0 ? 'إعادة المحاولة خلال $retryIn ثوانٍ' : 'المصدر غير متاح مؤقتًا. تحقق من الإنترنت ثم أعد المحاولة.'),
    };
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 460),
        child: Container(
          margin: const EdgeInsets.all(24),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: const Color(0xEE111722), borderRadius: BorderRadius.circular(BRadius.dialog),
              border: Border.all(color: Colors.white10)),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: 44, color: e.fail == FailKind.network ? BColors.gold : BColors.red),
            const SizedBox(height: 14),
            Text(title, style: t.titleLarge!.copyWith(color: Colors.white), textAlign: TextAlign.center),
            const SizedBox(height: 8),
            Text(body, style: t.bodyMedium!.copyWith(color: BColors.mist), textAlign: TextAlign.center),
            const SizedBox(height: 20),
            Wrap(spacing: 10, runSpacing: 10, alignment: WrapAlignment.center, children: [
              FilledButton.icon(
                autofocus: true,
                onPressed: () { _retry?.cancel(); retryIn = 0; _reconnect(); },
                icon: const Icon(Icons.refresh_rounded),
                label: Text(retryIn > 0 ? 'أعد المحاولة الآن' : 'إعادة المحاولة'),
              ),
              if (e.fail == FailKind.auth && item.sourceId != null)
                OutlinedButton.icon(
                  onPressed: () => Navigator.of(context).popUntil((r) => r.isFirst),
                  icon: const Icon(Icons.edit_rounded, color: Colors.white70),
                  label: const Text('تعديل المصدر', style: TextStyle(color: Colors.white)),
                ),
              if ((widget.queue?.length ?? 0) > 1)
                OutlinedButton(onPressed: () => _next(1), child: const Text('القناة التالية', style: TextStyle(color: Colors.white))),
              TextButton(onPressed: () => Navigator.maybePop(context), child: const Text('رجوع')),
            ]),
            if (e.technicalError != null) ...[
              const SizedBox(height: 12),
              Text('التفاصيل: ${e.technicalError!.length > 120 ? e.technicalError!.substring(0, 120) : e.technicalError}',
                  style: t.labelSmall!.copyWith(color: BColors.muted), textAlign: TextAlign.center, textDirection: TextDirection.ltr),
            ],
          ]),
        ),
      ),
    );
  }

  Widget _controls(BPalette p, Channel? ch, EpgProgram? now, EpgProgram? next) {
    final t = Theme.of(context).textTheme;
    final playing = e.phase == Phase.playing || e.phase == Phase.buffering;
    final fav = item.channelId != null && s.isFav(item.channelId!);
    final hasQueue = (widget.queue?.length ?? 0) > 1;
    return Stack(fit: StackFit.expand, children: [
      // تدرج علوي وسفلي يضمن قراءة النص فوق أي صورة
      const DecoratedBox(decoration: BoxDecoration(gradient: LinearGradient(
        begin: Alignment.topCenter, end: Alignment.bottomCenter,
        colors: [Color(0xCC05070B), Color(0x0005070B), Color(0x0005070B), Color(0xE605070B)],
        stops: [0, .25, .55, 1],
      ))),
      SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Column(children: [
            // الرأس: رجوع، الاسم والحالة، المفضلة
            Row(children: [
              _CtrlBtn(icon: Icons.arrow_forward_rounded, tip: 'رجوع', onTap: () => Navigator.maybePop(context)),
              const SizedBox(width: 6),
              if (item.logo != null) ...[ChannelLogo(url: item.logo, name: item.title, size: 40, radius: 10), const SizedBox(width: 10)],
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Flexible(child: Text(item.title, maxLines: 1, overflow: TextOverflow.ellipsis,
                      style: t.titleMedium!.copyWith(color: Colors.white))),
                  if (item.isLive || e.isLive) ...[const SizedBox(width: 8), const LiveBadge(small: true)],
                ]),
                if (now != null)
                  Text('${now.title} · حتى ${hhmm(now.stop)}', maxLines: 1, overflow: TextOverflow.ellipsis,
                      style: t.bodySmall!.copyWith(color: BColors.mist))
                else if (item.subtitle != null)
                  Text(item.subtitle!, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.bodySmall!.copyWith(color: BColors.mist)),
              ])),
              if (ch != null)
                _CtrlBtn(icon: fav ? Icons.star_rounded : Icons.star_outline_rounded, tip: fav ? 'إزالة من المفضلة' : 'إضافة للمفضلة',
                    color: fav ? BColors.gold : null, onTap: () { s.toggleFav(ch); _poke(); }),
              _CtrlBtn(icon: Icons.lock_outline_rounded, tip: 'قفل الشاشة', onTap: () => setState(() => locked = true)),
            ]),
            if (s.settings.showStreamInfo) Align(alignment: AlignmentDirectional.centerStart, child: _infoChip()),
            const Spacer(),
            // المنتصف: تشغيل/إيقاف و ±10 ث (تختفي حين تعرض طبقة الحالة رسالة)
            if (e.phase != Phase.error && e.phase != Phase.connecting) Directionality(
              textDirection: TextDirection.ltr,
              child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                if (hasQueue && item.isLive) _CtrlBtn(icon: Icons.skip_previous_rounded, size: 34, tip: 'القناة السابقة', onTap: () => _next(-1)),
                if (e.canSeek) _CtrlBtn(icon: Icons.replay_10_rounded, size: 34, tip: 'رجوع 10 ثوانٍ', onTap: () => _seekBy(-10)),
                const SizedBox(width: 18),
                _BigPlay(playing: playing, onTap: _toggle),
                const SizedBox(width: 18),
                if (e.canSeek) _CtrlBtn(icon: Icons.forward_10_rounded, size: 34, tip: 'تقدم 10 ثوانٍ', onTap: () => _seekBy(10)),
                if (hasQueue && item.isLive) _CtrlBtn(icon: Icons.skip_next_rounded, size: 34, tip: 'القناة التالية', onTap: () => _next(1)),
              ]),
            ),
            const Spacer(),
            // شريط التقدم: زمني من اليسار لليمين دائمًا، أو مؤشر «مباشر» صادق
            if (e.canSeek) _seekBar() else _liveBar(now),
            const SizedBox(height: 6),
            Row(children: [
              _CtrlBtn(icon: e.volume == 0 ? Icons.volume_off_rounded : Icons.volume_up_rounded, tip: 'الصوت',
                  onTap: () => e.setVolume(e.volume > 0 ? 0 : 1)),
              _CtrlBtn(icon: sub != null ? Icons.closed_caption_rounded : Icons.closed_caption_outlined, tip: 'الترجمة',
                  color: sub != null ? BColors.teal : null, onTap: _subtitles),
              _CtrlBtn(icon: Icons.high_quality_outlined, tip: 'اختيار الجودة', onTap: _qualitySheet,
                  label: qualityLabel ?? 'تلقائي'),
              const Spacer(),
              _CtrlBtn(icon: fill ? Icons.fit_screen_rounded : Icons.crop_free_rounded, tip: fill ? 'ملاءمة' : 'ملء الشاشة',
                  onTap: () {
                    setState(() => fill = !fill);
                    if (fill) toast(context, 'ملء الشاشة: قد تُقص أطراف الصورة', icon: Icons.crop_rounded);
                  }),
              if (plat.supportsPip) _CtrlBtn(icon: Icons.picture_in_picture_alt_rounded, tip: 'صورة داخل صورة', onTap: plat.enterPip),
              _CtrlBtn(icon: fullscreen ? Icons.fullscreen_exit_rounded : Icons.fullscreen_rounded, tip: 'ملء الشاشة', onTap: _toggleFullscreen),
              _CtrlBtn(icon: Icons.more_horiz_rounded, tip: 'المزيد', onTap: _more),
            ]),
          ]),
        ),
      ),
    ]);
  }

  Widget _infoChip() {
    final q = e.currentQuality;
    final stable = e.phase == Phase.playing && reconnects == 0;
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: _Glass(child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Text('${q != null ? 'الجودة الحالية $q — ' : ''}${stable ? 'الاتصال مستقر' : e.phase == Phase.buffering ? 'يتم التخزين المؤقت' : 'أُعيد الاتصال $reconnects مرة'}',
            style: const TextStyle(fontFamily: kFont, fontSize: 12.5, color: Colors.white)),
      )),
    );
  }

  Widget _seekBar() {
    final dur = e.duration.inMilliseconds.toDouble();
    final pos = e.position.inMilliseconds.clamp(0, dur).toDouble();
    final t = Theme.of(context).textTheme.labelMedium!.copyWith(color: Colors.white, fontFeatures: const [FontFeature.tabularFigures()]);
    return Directionality(
      textDirection: TextDirection.ltr,
      child: Row(children: [
        Text(fmtDur(e.position), style: t),
        Expanded(child: SliderTheme(
          data: SliderTheme.of(context).copyWith(
            secondaryActiveTrackColor: Colors.white38,
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 7),
          ),
          child: Slider(
            value: pos, max: dur <= 0 ? 1 : dur,
            secondaryTrackValue: e.buffered.inMilliseconds.clamp(0, dur).toDouble(),
            onChanged: (v) { e.seek(Duration(milliseconds: v.round())); _poke(); },
          ),
        )),
        Text('-${fmtDur(e.duration - e.position)}', style: t),
      ]),
    );
  }

  Widget _liveBar(EpgProgram? now) {
    final t = Theme.of(context).textTheme;
    final n = DateTime.now();
    return Row(children: [
      const LiveBadge(),
      const SizedBox(width: 10),
      if (now != null) ...[
        Text(hhmm(now.start), style: t.labelMedium!.copyWith(color: Colors.white70)),
        const SizedBox(width: 8),
        Expanded(child: Directionality(textDirection: TextDirection.ltr, child: ClipRRect(
          borderRadius: BorderRadius.circular(2),
          child: LinearProgressIndicator(value: now.progress(n), minHeight: 3, backgroundColor: Colors.white24),
        ))),
        const SizedBox(width: 8),
        Text(hhmm(now.stop), style: t.labelMedium!.copyWith(color: Colors.white70)),
      ] else
        Expanded(child: Text(item.isLocal ? '' : 'بث مباشر', style: t.labelMedium!.copyWith(color: Colors.white70))),
      if (!item.isLocal)
        TextButton.icon(
          onPressed: () { e.goLive(); _poke(); },
          icon: const Icon(Icons.fast_forward_rounded, size: 18),
          label: const Text('العودة إلى البث المباشر'),
        ),
    ]);
  }

  // ———————————————————— اللوحات ————————————————————
  Future<T?> _panel<T>(String title, Widget Function(BuildContext, StateSetter) body) {
    _hide?.cancel();
    final wide = MediaQuery.sizeOf(context).width > 700;
    Widget wrap(BuildContext c) => StatefulBuilder(builder: (c, set) => SafeArea(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 4, 20, 20),
            child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(title, style: Theme.of(c).textTheme.titleLarge),
              const SizedBox(height: 12),
              Flexible(child: SingleChildScrollView(child: body(c, set))),
            ]),
          ),
        ));
    final f = wide
        ? showGeneralDialog<T>(
            context: context, barrierDismissible: true, barrierLabel: title,
            barrierColor: Colors.black38, transitionDuration: BMotion.page,
            pageBuilder: (c, _, _) => Align(
              alignment: AlignmentDirectional.centerEnd,
              child: Material(
                color: context.bc.elevated,
                borderRadius: const BorderRadiusDirectional.horizontal(start: Radius.circular(BRadius.dialog)),
                child: SizedBox(width: 380, height: double.infinity, child: Padding(padding: const EdgeInsets.only(top: 20), child: wrap(c))),
              ),
            ),
            transitionBuilder: (c, a, _, child) => SlideTransition(
              position: Tween(begin: const Offset(-.15, 0), end: Offset.zero).animate(CurvedAnimation(parent: a, curve: Curves.easeOutCubic)),
              child: FadeTransition(opacity: a, child: child)),
          )
        : showModalBottomSheet<T>(context: context, isScrollControlled: true, builder: wrap);
    return f.whenComplete(_poke);
  }

  Future<void> _qualitySheet() async {
    final q = await e.qualities();
    if (!mounted) return;
    await _panel('اختيار الجودة', (c, set) => Column(children: [
      _Opt(label: 'تلقائي', hint: 'حسب سرعة الاتصال وقدرة الجهاز', selected: qualityLabel == null, onTap: () {
        e.selectQuality(null);
        setState(() => qualityLabel = null);
        Navigator.pop(c);
      }),
      if (q.isEmpty)
        const _Note('هذا المصدر يقدّم جودة واحدة فقط.')
      else
        for (final o in (q.toList()..sort((a, b) => (b.height ?? 0).compareTo(a.height ?? 0))))
          _Opt(label: o.label, hint: o.bitrate != null ? '${(o.bitrate! / 1e6).toStringAsFixed(1)} Mbps' : null,
              selected: qualityLabel == o.label, onTap: () {
            e.selectQuality(o.id);
            setState(() => qualityLabel = o.label);
            Navigator.pop(c);
          }),
    ]));
  }

  /// سطر الترجمة: يرتفع فوق أدوات التحكم حين تظهر، بحجم وخلفية من الإعدادات.
  Widget _subtitleLayer() {
    final text = sub!.at(e.position, subOffset);
    if (text == null) return const SizedBox.shrink();
    final st = s.settings;
    final wide = MediaQuery.sizeOf(context).width > 700;
    return Positioned(
      left: 24, right: 24, bottom: overlay ? 150 : 36,
      child: IgnorePointer(
        child: Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: st.subtitleBackground
                ? BoxDecoration(color: const Color(0xB3000000), borderRadius: BorderRadius.circular(8))
                : null,
            child: Text(text, textAlign: TextAlign.center, style: TextStyle(
              fontFamily: kFont, color: Colors.white, height: 1.35, fontWeight: FontWeight.w500,
              fontSize: (wide ? 26 : 18) * st.subtitleScale,
              shadows: st.subtitleBackground ? null : const [Shadow(blurRadius: 4), Shadow(blurRadius: 8)],
            )),
          ),
        ),
      ),
    );
  }

  Future<void> _loadSubtitle(String name, String text) async {
    try {
      final t = parseSubtitles(name, text);
      setState(() { sub = t; subOffset = Duration.zero; });
      if (mounted) toast(context, 'حُمّلت الترجمة: ${t.cues.length} سطرًا', icon: Icons.closed_caption_rounded);
    } catch (_) {
      if (mounted) toast(context, 'الملف ليس ترجمة SRT أو VTT صالحة', icon: Icons.error_outline_rounded);
    }
  }

  Future<void> _subtitles() => _panel('الترجمة', (c, set) {
        final t = Theme.of(c).textTheme;
        final secs = subOffset.inMilliseconds / 1000;
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          if (sub == null) const _Note('لا تتوفر ترجمة لهذا المصدر. يمكنك إضافة ملف SRT أو VTT.'),
          _Opt(label: 'بدون ترجمة', selected: sub == null, onTap: () { setState(() => sub = null); set(() {}); }),
          if (sub != null) _Opt(label: sub!.name, hint: '${sub!.cues.length} سطرًا', selected: true, onTap: () {}),
          const SizedBox(height: 6),
          OutlinedButton.icon(
            onPressed: () async {
              final f = await plat.pickSubtitleFile();
              if (f == null) return;
              await _loadSubtitle(f.name, f.text);
              set(() {});
            },
            icon: const Icon(Icons.file_open_outlined), label: const Text('ملف ترجمة من الجهاز'),
          ),
          const SizedBox(height: 8),
          OutlinedButton.icon(
            onPressed: () async {
              final ctl = TextEditingController();
              final url = await showDialog<String>(context: c, builder: (d) => AlertDialog(
                title: const Text('رابط ملف ترجمة'),
                content: TextField(controller: ctl, autofocus: true, textDirection: TextDirection.ltr,
                    decoration: const InputDecoration(hintText: 'https://…/subtitle.srt')),
                actions: [
                  TextButton(onPressed: () => Navigator.pop(d), child: const Text('إلغاء')),
                  FilledButton(onPressed: () => Navigator.pop(d, ctl.text.trim()), child: const Text('تحميل')),
                ],
              ));
              if (url == null || url.isEmpty) return;
              try {
                final text = await Net.text(url);
                await _loadSubtitle(Uri.tryParse(url)?.pathSegments.lastOrNull ?? 'ترجمة', text);
              } catch (err) {
                if (mounted) toast(context, err is NetError ? err.message : 'تعذر تحميل الترجمة', icon: Icons.error_outline_rounded);
              }
              set(() {});
            },
            icon: const Icon(Icons.link_rounded), label: const Text('ترجمة من رابط'),
          ),
          if (sub != null) ...[
            const SizedBox(height: 16),
            Row(children: [
              Expanded(child: Text('مزامنة الترجمة', style: t.titleSmall)),
              Text('${secs > 0 ? '+' : ''}${secs.toStringAsFixed(1)} ث', style: t.titleSmall, textDirection: TextDirection.ltr),
            ]),
            Text('قدّم الترجمة إن ظهرت متأخرة، أو أخّرها إن سبقت الكلام.', style: t.bodySmall),
            Slider(value: secs.clamp(-10, 10), min: -10, max: 10, divisions: 40,
                onChanged: (v) { setState(() => subOffset = Duration(milliseconds: (v * 1000).round())); set(() {}); }),
          ],
          const SizedBox(height: 12),
          Text('حجم الترجمة', style: t.titleSmall),
          Slider(value: s.settings.subtitleScale, min: .8, max: 1.6, divisions: 4,
              label: '${(s.settings.subtitleScale * 100).round()}%',
              onChanged: (v) { s.settings.subtitleScale = v; s.saveSettings(); setState(() {}); set(() {}); }),
          SwitchListTile(
            contentPadding: EdgeInsets.zero, title: const Text('خلفية للترجمة'), value: s.settings.subtitleBackground,
            onChanged: (v) { s.settings.subtitleBackground = v; s.saveSettings(); setState(() {}); set(() {}); },
          ),
        ]);
      });

  Future<void> _more() async {
    final audio = await e.audioTracks();
    if (!mounted) return;
    await _panel('المزيد', (c, set) {
      final t = Theme.of(c).textTheme;
      return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text('الصوت', style: t.titleSmall),
        const SizedBox(height: 6),
        if (audio.length < 2)
          const _Note('مسار صوت واحد متاح.')
        else
          for (final a in audio)
            _Opt(label: a.label, selected: a.selected, onTap: () { e.selectAudio(a.id); Navigator.pop(c); }),
        const SizedBox(height: 16),
        Text('نسبة العرض', style: t.titleSmall),
        const SizedBox(height: 6),
        _Opt(label: 'ملاءمة', hint: 'الصورة كاملة دون قص', selected: !fill, onTap: () { setState(() => fill = false); set(() {}); }),
        _Opt(label: 'ملء الشاشة', hint: 'قد تُقص الأطراف — لا تمدد للصورة', selected: fill, onTap: () { setState(() => fill = true); set(() {}); }),
        if (!e.isLive) ...[
          const SizedBox(height: 16),
          Text('سرعة التشغيل', style: t.titleSmall),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            for (final sp in [.5, .75, 1.0, 1.25, 1.5, 2.0])
              ChoiceChip(label: Text('${sp}x'), selected: e.speed == sp, onSelected: (_) { e.setSpeed(sp); set(() {}); }),
          ]),
        ],
        const SizedBox(height: 16),
        Text('معلومات البث', style: t.titleSmall),
        const SizedBox(height: 8),
        _info('الجودة الحالية', e.currentQuality ?? 'غير معروفة بعد'),
        _info('الحالة', e.phase == Phase.playing ? 'الاتصال مستقر' : e.phase == Phase.buffering ? 'يتم التخزين المؤقت' : e.phase == Phase.error ? 'متوقف' : 'جاهز'),
        _info('نوع البث', item.isLive || e.isLive ? 'مباشر' : 'مسجّل'),
        _info('البروتوكول (Protocol)', e.protocol),
        _info('المشغل', e.pipeline),
        if (e.videoSize.width > 0) _info('الدقة', '${e.videoSize.width.round()}×${e.videoSize.height.round()}'),
        if (e.bitrate != null) _info('معدل البيانات', '${(e.bitrate! / 1e6).toStringAsFixed(2)} Mbps'),
        _info('إعادة الاتصال', '$reconnects'),
        if (e.canSeek) _info('المخزّن مؤقتًا', '${(e.buffered - e.position).inSeconds.clamp(0, 9999)} ث'),
        if (!item.isLocal) _info('المصدر', Uri.tryParse(item.url)?.host ?? '—'),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: () {
            Clipboard.setData(ClipboardData(text:
                'البشرى — تقرير مشكلة\nالقناة: ${item.title}\nالحالة: ${e.phase.name}\nالخطأ: ${e.technicalError ?? '-'}\n'
                'البروتوكول: ${e.protocol}\nالمشغل: ${e.pipeline}\nالدقة: ${e.videoSize}\nإعادة الاتصال: $reconnects\n'
                'منذ التخزين: ${DateTime.now().difference(_bufferSince).inSeconds}s'));
            Navigator.pop(c);
            toast(context, 'نُسخ تقرير المشكلة — أرسله لمزود الخدمة');
          },
          icon: const Icon(Icons.flag_outlined),
          label: const Text('الإبلاغ عن مشكلة'),
        ),
      ]);
    });
  }

  Widget _info(String k, String v) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(children: [
          Expanded(child: Text(k, style: Theme.of(context).textTheme.bodyMedium)),
          // القيم التقنية بأرقام لاتينية واتجاه ثابت حتى لا تنقلب
          Text(v, style: Theme.of(context).textTheme.titleSmall,
              textDirection: RegExp(r'[\u0600-\u06FF]').hasMatch(v) ? TextDirection.rtl : TextDirection.ltr),
        ]),
      );
}

class _Glass extends StatelessWidget {
  final Widget child;
  const _Glass({required this.child});
  @override
  Widget build(BuildContext context) => DecoratedBox(
        decoration: BoxDecoration(color: const Color(0xB3111722), borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white12)),
        child: child,
      );
}

class _CtrlBtn extends StatelessWidget {
  final IconData icon;
  final String tip;
  final VoidCallback? onTap;
  final double size;
  final Color? color;
  final String? label;
  const _CtrlBtn({required this.icon, required this.tip, this.onTap, this.size = 24, this.color, this.label});
  @override
  Widget build(BuildContext context) => Tooltip(
        message: tip,
        child: BTap(
          onTap: onTap,
          radius: 12,
          semantic: tip,
          padding: EdgeInsets.all(size > 28 ? 10 : 10),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            Icon(icon, size: size, color: color ?? Colors.white),
            if (label != null) ...[
              const SizedBox(width: 4),
              Text(label!, style: const TextStyle(fontFamily: kFont, fontSize: 12.5, color: Colors.white, fontWeight: FontWeight.w500)),
            ],
          ]),
        ),
      );
}

class _BigPlay extends StatelessWidget {
  final bool playing;
  final VoidCallback onTap;
  const _BigPlay({required this.playing, required this.onTap});
  @override
  Widget build(BuildContext context) => BTap(
        onTap: onTap,
        radius: 40,
        semantic: playing ? 'إيقاف مؤقت' : 'تشغيل',
        child: Container(
          width: 72, height: 72,
          decoration: BoxDecoration(shape: BoxShape.circle, color: BColors.teal.withValues(alpha: .92),
              boxShadow: [BoxShadow(color: BColors.teal.withValues(alpha: .35), blurRadius: 30)]),
          child: Icon(playing ? Icons.pause_rounded : Icons.play_arrow_rounded, size: 40, color: BColors.midnight950),
        ),
      );
}

class _Pulse extends StatefulWidget {
  final Widget child;
  const _Pulse({required this.child});
  @override
  State<_Pulse> createState() => _PulseState();
}

class _PulseState extends State<_Pulse> with SingleTickerProviderStateMixin {
  late final _a = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat(reverse: true);
  @override
  void dispose() {
    _a.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _a,
        builder: (_, c) => Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(shape: BoxShape.circle, boxShadow: [
            BoxShadow(color: BColors.teal.withValues(alpha: .12 + .25 * _a.value), blurRadius: 30 + 20 * _a.value, spreadRadius: 2),
          ]),
          child: c,
        ),
        child: widget.child,
      );
}

class _Opt extends StatelessWidget {
  final String label;
  final String? hint;
  final bool selected;
  final VoidCallback onTap;
  const _Opt({required this.label, this.hint, required this.selected, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: BTap(
        onTap: onTap,
        radius: 12,
        color: selected ? p.accent.withValues(alpha: .14) : p.container,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Row(children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(label, style: t.titleSmall),
            if (hint != null) Text(hint!, style: t.bodySmall),
          ])),
          if (selected) Icon(Icons.check_rounded, color: p.accent),
        ]),
      ),
    );
  }
}

class _Note extends StatelessWidget {
  final String text;
  const _Note(this.text);
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: context.bc.container, borderRadius: BorderRadius.circular(12)),
        child: Row(children: [
          Icon(Icons.info_outline_rounded, color: context.bc.text3, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text(text, style: Theme.of(context).textTheme.bodyMedium)),
        ]),
      );
}
