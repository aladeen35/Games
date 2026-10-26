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
import '../cast/cast.dart';
import '../data/open_channels.dart';
import '../screens/multiview.dart';
import 'engine.dart';
import 'session.dart';
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
  // إن كان البث نفسه يعمل في النافذة المصغرة نكمله بلا إعادة اتصال
  final ss = PlayerSession.I;
  Engine? attach;
  if (ss.active) {
    if (ss.item?.key == item.key) {
      queue ??= ss.queue;
      attach = ss.take();
    } else {
      ss.close();
    }
  }
  await Navigator.of(context).push(PageRouteBuilder(
    opaque: true,
    transitionDuration: BMotion.page,
    pageBuilder: (_, _, _) => PlayerScreen(item: item, queue: queue, attach: attach),
    transitionsBuilder: (_, a, _, child) => FadeTransition(opacity: a, child: child),
  ));
}

class PlayerScreen extends StatefulWidget {
  final Playable item;
  final List<Playable>? queue;
  /// مشغل قائم (من النافذة المصغرة) يُعرض بدل فتح البث من جديد.
  final Engine? attach;
  const PlayerScreen({super.key, required this.item, this.queue, this.attach});
  @override
  State<PlayerScreen> createState() => _PlayerScreenState();
}

class _PlayerScreenState extends State<PlayerScreen> {
  late Engine e;
  final s = AppStore.I;
  bool _minimizing = false;
  // الروابط البديلة: ما جُرّب في سلسلة الأعطال الحالية، وموضع القناة الأصلية في الطابور
  final _tried = <String>{};
  String? _anchor;
  Timer? _failT;
  ({String text, IconData icon})? _bannerMsg;
  Timer? _bannerT;
  // الحلقة التالية والمقدمة
  bool _upNextShown = false, _upNextDismissed = false, _introSkipped = false;
  int? _countdown;
  Timer? _cdT, _introLearnT;
  // التقليب الفوري: القناة المجاورة محمّلة مسبقًا
  Engine? _pre;
  Playable? _preItem;
  DateTime? _preAt;
  Timer? _preT;
  int _zapDir = 1;
  DateTime _lastZap = DateTime(0);
  // العرض على التلفاز (Chromecast)
  CastSession? _cast;
  CastDevice? _castDev;
  Future<List<CastDevice>>? _castFind;
  late Playable item = widget.item;
  late bool fill = s.settings.fillScreen;
  bool overlay = true, locked = false, fullscreen = false;
  Timer? _hide, _retry, _slow, _clock, _connectT;
  int retryIn = 0, reconnects = 0;
  bool slow = false;
  String? qualityLabel; // null = تلقائي
  final _focus = FocusNode();
  DateTime _bufferSince = DateTime.now();
  String? _seekFlash;
  Timer? _flashT;
  SubtitleTrack? sub;
  Duration subOffset = Duration.zero;

  // ——— الإيماءات ———
  double _vol = 1, _bright = 1, _dim = 0; // _dim: تعتيم محاكى على الويب
  Offset _dtPos = Offset.zero;
  int _dtSide = 0, _dtSum = 0;
  DateTime _dtAt = DateTime(0);
  String _gMode = ''; // '', 'seek', 'vol', 'bright', 'pinch', 'zap'
  Offset _gStart = Offset.zero;
  double _gStartVal = 0;
  Duration _gStartPos = Duration.zero, _gTarget = Duration.zero;
  ({IconData icon, String text, double? value})? _hud;
  Timer? _hudT;
  bool _boost = false;
  bool _orientDone = false;
  // مؤقت النوم وإدخال رقم القناة
  Timer? _sleepT, _digitT;
  DateTime? _sleepAt;
  String _digits = '';

  @override
  void initState() {
    super.initState();
    WakelockPlus.enable().catchError((_) {});
    plat.enterPlayerMode();
    plat.playerOrientation(portraitVideo: false);
    fullscreen = plat.isPhone;
    plat.setAutoPip(true);
    if (widget.attach != null) {
      // عائد من النافذة المصغرة: نفس البث بلا إعادة اتصال
      e = widget.attach!;
      fill = PlayerSession.I.fill;
      _last = e.phase;
      final was = e.phase == Phase.playing || e.phase == Phase.buffering;
      e.addListener(_onEngine);
      _tried.add(item.channelId ?? item.key);
      _poke();
      // نقل عنصر الفيديو في المتصفح قد يوقفه مؤقتًا
      if (was) Future.delayed(const Duration(milliseconds: 400), () { if (mounted && e.phase == Phase.paused) e.play(); });
    } else {
      e = Engine.create();
      e.addListener(_onEngine);
      _open(item);
    }
    plat.getVolume().then((v) => _vol = v);
    plat.getBrightness().then((v) => _bright = v);
    _clock = Timer.periodic(const Duration(seconds: 30), (_) { if (mounted) setState(() {}); });
  }

  /// [swapped]: المشغل الحالي صار المحمّل مسبقًا (لا نفتح البث مجددًا).
  void _open(Playable p, {bool resume = true, bool reconnect = false, bool failover = false, bool swapped = false}) {
    _retry?.cancel();
    _failT?.cancel();
    retryIn = 0;
    slow = false;
    if (!reconnect && p.key != item.key) {
      _orientDone = false;
      sub = null;
      subOffset = Duration.zero;
    }
    if (!reconnect && !failover) {
      _tried
        ..clear()
        ..add(p.channelId ?? p.key);
      _anchor = null;
    }
    if (!reconnect) {
      _introSkipped = false;
      _upNextDismissed = false;
      _cancelCountdown();
      _introLearnT?.cancel();
    }
    item = p;
    if (!reconnect) s.recordPlay(p);
    final h = s.historyOf(p.key);
    final startAt = resume && s.settings.resume && h != null && h.resumable ? Duration(milliseconds: h.positionMs) : null;
    if (!swapped) e.open(p, startAt: startAt);
    // لا يبقى المشغل معلقًا على «جارٍ الاتصال»: بعد 25 ثانية بلا صورة نعرض السبب ونعيد المحاولة
    _connectT?.cancel();
    _connectT = Timer(const Duration(seconds: 25), () {
      if (mounted && e.phase == Phase.connecting) {
        e.fail = FailKind.network;
        e.technicalError = 'timeout: no media after 25s';
        e.phase = Phase.error;
        _onEngine();
      }
    });
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
    // فيديو طولي (مثل فيديوهات الجوال) يعود بالطول تلقائيًا
    if (!_orientDone && e.videoSize.width > 0) {
      _orientDone = true;
      if (e.videoSize.height > e.videoSize.width * 1.1) {
        plat.playerOrientation(portraitVideo: true);
        fullscreen = false;
      }
    }
    if (e.phase == Phase.playing) {
      slow = false;
      _slow?.cancel();
    }
    if (e.phase == Phase.error && _last != Phase.error) {
      // تُعلَّم القناة معطلة فقط لأسباب تخص المصدر (لا قيود المتصفح)
      if (item.channelId != null && (e.fail == FailKind.network || e.fail == FailKind.unsupported)) s.markHealth(item.channelId!, false);
      // قناة لا تعمل: نسخة بديلة من قائمة أخرى أولًا، وإلا إعادة المحاولة
      if (!_tryFailover()) _scheduleRetry();
    }
    if (e.phase == Phase.playing && _last != Phase.playing) {
      if (item.channelId != null) s.markHealth(item.channelId!, true);
      if (_canPreload) {
        _preT?.cancel();
        _preT = Timer(const Duration(seconds: 2), _preload);
      }
    }
    if (e.phase == Phase.ended && _last != Phase.ended) _onEnded();
    if (!item.isLive && e.duration > Duration.zero) {
      s.updateProgress(item.key, e.position, e.duration);
      _checkUpNext();
      _checkIntro();
    }
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

  int get _qIndex => widget.queue?.indexWhere((q) => q.key == (_anchor ?? item.key)) ?? -1;

  Playable? _neighbor(int dir) {
    final q = widget.queue;
    if (q == null || q.length < 2) return null;
    final i = _qIndex;
    return q[((i < 0 ? 0 : i) + dir) % q.length];
  }

  void _next(int dir) {
    final target = _neighbor(dir);
    if (target == null) return;
    _zapDir = dir;
    _lastZap = DateTime.now();
    if (_pre != null && _preItem?.key == target.key && _preFresh && _pre!.phase != Phase.error) {
      _swapToPre();
    } else {
      _open(target, resume: true);
    }
  }

  // ———————————————————— التقليب الفوري ————————————————————
  bool get _canPreload => s.settings.fastZap && item.isLive && (widget.queue?.length ?? 0) > 2 && !_minimizing;
  bool get _preFresh => _preAt != null && DateTime.now().difference(_preAt!) < const Duration(seconds: 40);

  void _disposePre() {
    _preT?.cancel();
    _pre?.dispose();
    _pre = null;
    _preItem = null;
    _preAt = null;
  }

  /// يجهّز القناة المجاورة (في اتجاه آخر تقليب) دون صوت، ويجددها كل 40 ثانية ما دام المستخدم يقلّب.
  void _preload() {
    if (!mounted || !_canPreload || e.phase != Phase.playing) return;
    final target = _neighbor(_zapDir);
    if (target == null) return;
    if (_preItem?.key != target.key || !_preFresh) {
      _pre?.dispose();
      final pe = Engine.create();
      pe.setVolume(0);
      pe.open(target, preload: true);
      _pre = pe;
      _preItem = target;
      _preAt = DateTime.now();
    }
    _preT?.cancel();
    _preT = Timer(const Duration(seconds: 40), () {
      if (!mounted) return;
      // من لا يقلّب لا يحتاج القناة المجاورة: نحرر الموارد
      DateTime.now().difference(_lastZap) < const Duration(minutes: 3) ? _preload() : _disposePre();
    });
  }

  void _swapToPre() {
    final old = e;
    final vol = old.volume;
    final target = _preItem!;
    old.removeListener(_onEngine);
    e = _pre!;
    _pre = null;
    _preItem = null;
    _preAt = null;
    old.dispose();
    e.addListener(_onEngine);
    e.setVolume(vol == 0 ? 1 : vol);
    e.play();
    _last = e.phase;
    _open(target, swapped: true);
  }

  // ———————————————————— الروابط البديلة ————————————————————
  void _banner(String text, IconData icon) {
    _bannerT?.cancel();
    setState(() => _bannerMsg = (text: text, icon: icon));
    _bannerT = Timer(const Duration(seconds: 5), () { if (mounted) setState(() => _bannerMsg = null); });
  }

  List<Channel> get _alternates {
    if (!item.isLive || item.channelId == null) return const [];
    final ch = s.channelById(item.channelId!);
    if (ch == null) return const [];
    return [for (final c in s.alternatesFor(ch)) if (!_tried.contains(c.id)) c];
  }

  bool _tryFailover({bool manual = false}) {
    if (!manual && !s.settings.autoFailover) return false;
    final alts = _alternates;
    if (alts.isEmpty) return false;
    final alt = alts.first;
    _tried.add(alt.id);
    _anchor ??= item.key;
    final src = alt.sourceId == OpenChannels.sourceId ? 'القنوات المفتوحة' : (s.sources[alt.sourceId]?.name ?? 'قائمة أخرى');
    _banner('«${item.title}» لا تعمل — التحويل إلى نسخة من «$src»', Icons.alt_route_rounded);
    _retry?.cancel();
    retryIn = 0;
    _failT?.cancel();
    _failT = Timer(Duration(milliseconds: manual ? 50 : 1400), () { if (mounted) _open(Playable.channel(alt), failover: true); });
    return true;
  }

  // ———————————————————— الحلقة التالية والمقدمة ————————————————————
  Playable? get _upNext {
    final q = widget.queue;
    if (q == null || item.isLive) return null;
    final i = _qIndex;
    if (i < 0 || i + 1 >= q.length) return null;
    return q[i + 1];
  }

  bool get _autoNext => s.settings.autoplayNext && (item.isEpisode || item.isLocal);

  void _checkUpNext() {
    if (_upNextShown || _upNextDismissed || e.duration < const Duration(seconds: 45) || e.position <= Duration.zero) return;
    if (e.duration - e.position <= const Duration(seconds: 20) && _upNext != null) {
      _upNextShown = true;
      if (_autoNext) _startCountdown();
    }
  }

  void _startCountdown() {
    _cdT?.cancel();
    _countdown = 10;
    _cdT = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) return t.cancel();
      setState(() => _countdown = (_countdown ?? 1) - 1);
      if ((_countdown ?? 0) <= 0) {
        t.cancel();
        _countdown = null;
        _next(1);
      }
    });
  }

  void _cancelCountdown() {
    _cdT?.cancel();
    _countdown = null;
    _upNextShown = false;
  }

  void _onEnded() {
    if (_upNext == null || _upNextDismissed) return;
    if (_autoNext) {
      _cancelCountdown();
      _next(1);
    } else {
      setState(() => _upNextShown = true);
    }
  }

  int? get _introEnd => s.introOf(item.seriesId);

  bool get _showIntroBtn {
    if (!item.isEpisode || !e.canSeek || _introSkipped || locked) return false;
    if (e.phase != Phase.playing && e.phase != Phase.paused && e.phase != Phase.buffering) return false;
    final pos = e.position.inSeconds, end = _introEnd;
    if (end != null) return pos < end - 2;
    return pos >= 2 && pos < 240;
  }

  void _checkIntro() {
    final end = _introEnd;
    if (end == null || _introSkipped || !s.settings.autoSkipIntro || !item.isEpisode || e.phase != Phase.playing) return;
    if (e.position.inSeconds < end - 2) {
      _introSkipped = true;
      e.seek(Duration(seconds: end));
      _showHud(Icons.skip_next_rounded, 'تُخطيت المقدمة');
    }
  }

  /// بعد التعلّم: يقفز لنهاية المقدمة. أول مرة: كل ضغطة +30 ث، وحين تتوقف يُحفظ الموضع لكل حلقات المسلسل.
  void _skipIntro() {
    final end = _introEnd;
    if (end != null) {
      setState(() => _introSkipped = true);
      e.seek(Duration(seconds: end));
      _showHud(Icons.skip_next_rounded, 'تُخطيت المقدمة');
      return;
    }
    e.seek(e.position + const Duration(seconds: 30));
    _showHud(Icons.fast_forward_rounded, 'اضغط مجددًا حتى تنتهي المقدمة');
    _introLearnT?.cancel();
    _introLearnT = Timer(const Duration(seconds: 4), () {
      final sid = item.seriesId;
      if (!mounted || sid == null) return;
      final secs = e.position.inSeconds;
      s.setIntro(sid, secs);
      setState(() => _introSkipped = true);
      _banner('حُفظت نهاية المقدمة عند ${fmtDur(Duration(seconds: secs))} — يظهر «تخطي المقدمة» في كل حلقات المسلسل', Icons.check_circle_rounded);
    });
  }

  void _minimize() {
    _minimizing = true;
    _disposePre();
    PlayerSession.I.minimize(e, item, widget.queue, fill: fill);
    Navigator.of(context).maybePop();
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

  // ———————————————————— رقم القناة من الريموت ————————————————————
  static int? _digitOf(LogicalKeyboardKey k) {
    const keys = [
      LogicalKeyboardKey.digit0, LogicalKeyboardKey.digit1, LogicalKeyboardKey.digit2, LogicalKeyboardKey.digit3,
      LogicalKeyboardKey.digit4, LogicalKeyboardKey.digit5, LogicalKeyboardKey.digit6, LogicalKeyboardKey.digit7,
      LogicalKeyboardKey.digit8, LogicalKeyboardKey.digit9,
    ];
    const pad = [
      LogicalKeyboardKey.numpad0, LogicalKeyboardKey.numpad1, LogicalKeyboardKey.numpad2, LogicalKeyboardKey.numpad3,
      LogicalKeyboardKey.numpad4, LogicalKeyboardKey.numpad5, LogicalKeyboardKey.numpad6, LogicalKeyboardKey.numpad7,
      LogicalKeyboardKey.numpad8, LogicalKeyboardKey.numpad9,
    ];
    final i = keys.indexOf(k);
    if (i >= 0) return i;
    final j = pad.indexOf(k);
    return j >= 0 ? j : null;
  }

  /// تكتب 1 ثم 2 ثم 5 فينتقل للقناة 125 بعد ثانية ونصف.
  void _typeDigit(int d) {
    final q = widget.queue;
    if (q == null || q.length < 2 || _digits.length >= 4) return;
    _digits += '$d';
    _digitT?.cancel();
    _hudT?.cancel();
    setState(() => _hud = (icon: Icons.dialpad_rounded, text: 'القناة $_digits', value: null));
    _digitT = Timer(const Duration(milliseconds: 1500), () {
      final n = int.parse(_digits);
      _digits = '';
      final target = queueIndexForNumber(q, n);
      if (target == null) {
        _showHud(Icons.error_outline_rounded, 'لا توجد القناة $n');
      } else {
        _open(q[target]);
        _showHud(Icons.live_tv_rounded, '$n · ${q[target].title}');
      }
    });
  }

  // ———————————————————— مؤقت النوم ————————————————————
  void _setSleep(Duration? d) {
    _sleepT?.cancel();
    if (d == null) {
      setState(() => _sleepAt = null);
      return;
    }
    setState(() => _sleepAt = DateTime.now().add(d));
    _sleepT = Timer(d, () {
      if (!mounted) return;
      e.pause();
      setState(() { _sleepAt = null; overlay = true; });
      toast(context, 'توقف التشغيل بمؤقت النوم', icon: Icons.bedtime_rounded);
    });
  }

  // ———————————————————— الإيماءات الذكية ————————————————————
  Size get _size => MediaQuery.sizeOf(context);

  void _showHud(IconData icon, String text, [double? value]) {
    _hudT?.cancel();
    setState(() => _hud = (icon: icon, text: text, value: value));
    _hudT = Timer(const Duration(milliseconds: 900), () { if (mounted) setState(() => _hud = null); });
  }

  /// كشف الضغط المزدوج يدويًا: الضغطة الثانية خلال 300 ملّي ث قرب الأولى = مزدوجة،
  /// والضغطات المتتالية على الجانب نفسه تواصل التقديم (مثل يوتيوب). الضغطة المفردة تُنفَّذ بعد مهلة قصيرة.
  Timer? _tapT;
  DateTime _lastTap = DateTime(0);
  void _tapUp(Offset p) {
    final now = DateTime.now();
    final quick = now.difference(_lastTap).inMilliseconds < 300 && (p - _dtPos).distance < 80;
    final chaining = now.difference(_dtAt).inMilliseconds < 700 && _dtSide != 0 && (p.dx < _size.width / 2 ? -1 : 1) == _dtSide;
    _lastTap = now;
    _dtPos = p;
    if (quick || chaining) {
      _tapT?.cancel();
      _onDoubleTap(p);
      return;
    }
    _tapT?.cancel();
    _tapT = Timer(const Duration(milliseconds: 280), () { if (mounted) _onTap(p); });
  }

  /// ضغطة في الوسط = تشغيل/إيقاف، وفي غيره = إظهار/إخفاء الأدوات.
  void _onTap(Offset p) {
    if (locked) return _poke();
    final w = _size.width, h = _size.height;
    final center = p.dx > w * .3 && p.dx < w * .7 && p.dy > h * .25 && p.dy < h * .75;
    if (center && e.phase != Phase.error && e.phase != Phase.connecting) {
      final wasPlaying = e.phase == Phase.playing || e.phase == Phase.buffering;
      _toggle();
      _showHud(wasPlaying ? Icons.pause_rounded : Icons.play_arrow_rounded, wasPlaying ? 'إيقاف مؤقت' : 'تشغيل');
      return;
    }
    if (overlay && e.phase == Phase.playing) {
      setState(() => overlay = false);
    } else {
      _poke();
    }
  }

  /// ضغط مزدوج يسار/يمين = ±10 ث تتراكم مع كل ضغطة، وفي الوسط = ملاءمة/ملء.
  void _onDoubleTap(Offset p) {
    if (locked) return;
    final w = _size.width;
    if (p.dx > w * .35 && p.dx < w * .65) {
      setState(() => fill = !fill);
      _showHud(fill ? Icons.crop_free_rounded : Icons.fit_screen_rounded, fill ? 'ملء الشاشة' : 'ملاءمة');
      return;
    }
    if (!e.canSeek) return;
    final side = p.dx < w / 2 ? -1 : 1; // الزمن من اليسار لليمين
    final now = DateTime.now();
    _dtSum = (side == _dtSide && now.difference(_dtAt).inMilliseconds < 1200) ? _dtSum + 10 : 10;
    _dtSide = side;
    _dtAt = now;
    e.seek(e.position + Duration(seconds: 10 * side));
    _showHud(side < 0 ? Icons.fast_rewind_rounded : Icons.fast_forward_rounded, '${side < 0 ? '−' : '+'}$_dtSum ث');
  }

  void _boostOn() {
    if (locked || e.isLive || e.phase != Phase.playing) return;
    _boost = true;
    e.setSpeed(2);
    _hudT?.cancel();
    setState(() => _hud = (icon: Icons.fast_forward_rounded, text: 'سرعة ×2', value: null));
  }

  void _boostOff() {
    if (!_boost) return;
    _boost = false;
    e.setSpeed(1);
    _showHud(Icons.play_arrow_rounded, 'سرعة عادية');
  }

  void _gStartFn(ScaleStartDetails d) {
    _gMode = d.pointerCount >= 2 ? 'pinch' : '';
    _gStart = d.localFocalPoint;
    _gStartPos = e.position;
  }

  void _gUpdate(ScaleUpdateDetails d) {
    if (locked) return;
    final sz = _size;
    if (d.pointerCount >= 2 || _gMode == 'pinch') {
      _gMode = 'pinch';
      if (d.scale > 1.15 && !fill) {
        setState(() => fill = true);
        _showHud(Icons.crop_free_rounded, 'ملء الشاشة');
      } else if (d.scale < .87 && fill) {
        setState(() => fill = false);
        _showHud(Icons.fit_screen_rounded, 'ملاءمة');
      }
      return;
    }
    final delta = d.localFocalPoint - _gStart;
    if (_gMode.isEmpty) {
      if (delta.distance < 14) return;
      if (delta.dx.abs() > delta.dy.abs()) {
        _gMode = e.canSeek ? 'seek' : (item.isLive && (widget.queue?.length ?? 0) > 1 ? 'zap' : 'x');
      } else {
        // يمين الشاشة = الصوت، يسارها = الإضاءة
        _gMode = _gStart.dx > sz.width / 2 ? 'vol' : 'bright';
        _gStartVal = _gMode == 'vol' ? (plat.systemVolume ? _vol : e.volume) : (plat.realBrightness ? _bright : 1 - _dim / .8);
      }
    }
    switch (_gMode) {
      case 'vol':
        final v = (_gStartVal - delta.dy / (sz.height * .6)).clamp(0.0, 1.0);
        _vol = v;
        plat.systemVolume ? plat.setVolume(v) : e.setVolume(v);
        _showHud(v == 0 ? Icons.volume_off_rounded : (v < .5 ? Icons.volume_down_rounded : Icons.volume_up_rounded), 'الصوت ${(v * 100).round()}%', v);
      case 'bright':
        final v = (_gStartVal - delta.dy / (sz.height * .6)).clamp(0.05, 1.0);
        _bright = v;
        if (plat.realBrightness) {
          plat.setBrightness(v);
        } else {
          setState(() => _dim = (1 - v) * .8);
        }
        _showHud(v < .5 ? Icons.brightness_low_rounded : Icons.brightness_high_rounded, 'الإضاءة ${(v * 100).round()}%', v);
      case 'seek':
        final span = e.duration.inSeconds < 600 ? e.duration.inSeconds.toDouble() : 300.0;
        final secs = (delta.dx / sz.width * span).round();
        _gTarget = Duration(seconds: (_gStartPos.inSeconds + secs).clamp(0, e.duration.inSeconds));
        _showHud(secs < 0 ? Icons.fast_rewind_rounded : Icons.fast_forward_rounded,
            '${secs < 0 ? '−' : '+'}${fmtDur(Duration(seconds: secs.abs()))}  ·  ${fmtDur(_gTarget)}',
            e.duration.inMilliseconds == 0 ? null : _gTarget.inMilliseconds / e.duration.inMilliseconds);
      case 'zap':
        final next = delta.dx < 0;
        _showHud(next ? Icons.skip_next_rounded : Icons.skip_previous_rounded,
            delta.dx.abs() > sz.width * .2 ? (next ? 'أفلت للقناة التالية' : 'أفلت للقناة السابقة') : 'اسحب للتنقل بين القنوات');
    }
  }

  void _gEnd(ScaleEndDetails d) {
    if (_gMode == 'seek') e.seek(_gTarget);
    if (_gMode == 'zap') {
      final dx = (_hud?.text.contains('أفلت') ?? false);
      if (dx) _next(_hud!.text.contains('التالية') ? 1 : -1);
    }
    _gMode = '';
  }

  Widget _hudView() {
    final h = _hud!;
    return _Glass(child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(h.icon, color: Colors.white, size: 26),
          const SizedBox(width: 10),
          Text(h.text, textDirection: TextDirection.rtl,
              style: const TextStyle(fontFamily: kFont, fontSize: 17, color: Colors.white, fontWeight: FontWeight.w600)),
        ]),
        if (h.value != null) ...[
          const SizedBox(height: 10),
          SizedBox(width: 180, child: Directionality(textDirection: TextDirection.ltr, child: ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(value: h.value, minHeight: 5, color: BColors.teal, backgroundColor: Colors.white24),
          ))),
        ],
      ]),
    ));
  }

  KeyEventResult _onKey(FocusNode n, KeyEvent ev) {
    if (ev is! KeyDownEvent && ev is! KeyRepeatEvent) return KeyEventResult.ignored;
    if (_castDev != null) return KeyEventResult.ignored;
    final k = ev.logicalKey;
    final digit = _digitOf(k);
    if (digit != null) {
      _typeDigit(digit);
      return KeyEventResult.handled;
    }
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
    for (final t in [_hide, _retry, _slow, _clock, _flashT, _connectT, _tapT, _failT, _bannerT, _cdT, _introLearnT]) {
      t?.cancel();
    }
    if (!item.isLive && e.duration > Duration.zero) s.updateProgress(item.key, e.position, e.duration);
    e.removeListener(_onEngine);
    // عند التصغير يبقى البث يعمل في النافذة المصغرة
    if (!_minimizing) e.dispose();
    _disposePre();
    _cast?.removeListener(_onCast);
    _cast?.close();
    _focus.dispose();
    if (!_minimizing) WakelockPlus.disable().catchError((_) {});
    _hudT?.cancel();
    _sleepT?.cancel();
    _digitT?.cancel();
    plat.resetBrightness();
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
              onTapUp: (d) => _tapUp(d.localPosition),
              onLongPressStart: (_) => _boostOn(),
              onLongPressEnd: (_) => _boostOff(),
              onScaleStart: _gStartFn,
              onScaleUpdate: _gUpdate,
              onScaleEnd: _gEnd,
              child: Stack(fit: StackFit.expand, children: [
                Positioned.fill(child: IgnorePointer(child: e.view(fill: fill))),
                if (_dim > 0) Positioned.fill(child: IgnorePointer(child: ColoredBox(color: Colors.black.withValues(alpha: _dim)))),
                if (_hud != null) Positioned(top: 70, left: 0, right: 0, child: IgnorePointer(child: Center(child: _hudView()))),
                // علامة مائية صغيرة شفافة في الزاوية
                Positioned(top: 18, left: 18, child: IgnorePointer(
                    child: Opacity(opacity: overlay ? 0 : .18, child: const BushraMark(size: 22, style: MarkStyle.mono)))),
                if (_seekFlash != null)
                  Center(child: _Glass(child: Padding(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                      child: Text(_seekFlash!, style: const TextStyle(fontFamily: kFont, fontSize: 20, color: Colors.white, fontWeight: FontWeight.w600))))),
                if (sub != null) _subtitleLayer(),
                _stateLayer(p),
                if (_bannerMsg != null)
                  Positioned(top: 76, left: 16, right: 16, child: IgnorePointer(child: Center(child: _Glass(child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(_bannerMsg!.icon, color: BColors.gold, size: 20),
                      const SizedBox(width: 10),
                      Flexible(child: Text(_bannerMsg!.text, textAlign: TextAlign.center,
                          style: const TextStyle(fontFamily: kFont, fontSize: 14, color: Colors.white, fontWeight: FontWeight.w500))),
                    ]),
                  ))))),
                if (_showIntroBtn)
                  PositionedDirectional(end: 24, bottom: overlay ? 132 : 44, child: SafeArea(child: _SkipButton(
                    label: 'تخطي المقدمة',
                    hint: _introEnd == null ? '+30 ث' : null,
                    onTap: _skipIntro,
                  ))),
                if (_castDev != null) Positioned.fill(child: _castLayer()),
                if (_upNextShown && !_upNextDismissed && _upNext != null && _castDev == null)
                  PositionedDirectional(end: 20, bottom: overlay ? 132 : 32, child: SafeArea(child: _upNextCard())),
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
              if (_alternates.isNotEmpty)
                OutlinedButton.icon(
                  onPressed: () => _tryFailover(manual: true),
                  icon: const Icon(Icons.alt_route_rounded, color: BColors.gold),
                  label: Text('رابط بديل (${_alternates.length})', style: const TextStyle(color: Colors.white)),
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
              _CtrlBtn(icon: Icons.keyboard_arrow_down_rounded, tip: 'تصغير — تابع التصفح والبث يعمل', onTap: _minimize),
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
              if (castSupported && !item.isLocal)
                _CtrlBtn(icon: Icons.cast_rounded, tip: 'عرض على التلفاز (Chromecast)', onTap: _castSheet),
              if (_sleepAt != null)
                _CtrlBtn(icon: Icons.bedtime_rounded, tip: 'مؤقت النوم', color: BColors.gold, onTap: _more,
                    label: '${_sleepAt!.difference(DateTime.now()).inMinutes + 1} د'),
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

  // ———————————————————— Chromecast ————————————————————
  Future<void> _castSheet() async {
    _castFind = discoverCast();
    await _panel('عرض على التلفاز', (c, set) => FutureBuilder<List<CastDevice>>(
          future: _castFind,
          builder: (c, snap) {
            final t = Theme.of(c).textTheme;
            final list = snap.data ?? const <CastDevice>[];
            return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              if (snap.connectionState != ConnectionState.done)
                Row(children: [
                  const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)),
                  const SizedBox(width: 12),
                  Text('البحث عن أجهزة على الشبكة…', style: t.bodyMedium),
                ])
              else if (list.isEmpty) ...[
                const _Note('لم يُعثر على أجهزة Chromecast. تأكد أن الجوال والتلفاز على شبكة Wi‑Fi نفسها.'),
                const SizedBox(height: 8),
                OutlinedButton.icon(onPressed: () => set(() => _castFind = discoverCast()),
                    icon: const Icon(Icons.refresh_rounded), label: const Text('ابحث مجددًا')),
              ] else
                for (final d in list)
                  _Opt(label: d.name, hint: d.model.isEmpty ? d.host : d.model, selected: false, onTap: () {
                    Navigator.pop(c);
                    _startCast(d);
                  }),
              const SizedBox(height: 12),
              Text('يعمل مع Chromecast وأجهزة التلفاز التي تدعم Google Cast. بعض روابط IPTV (غير المشفّرة أو بصيغة TS) قد لا يشغّلها الجهاز.',
                  style: t.bodySmall),
            ]);
          },
        ));
  }

  Future<void> _startCast(CastDevice d) async {
    setState(() => _castDev = d);
    final wasPos = e.canSeek ? e.position.inMilliseconds / 1000 : 0.0;
    e.pause();
    try {
      final cs = await CastSession.connect(d);
      if (!mounted) {
        cs.close();
        return;
      }
      _cast = cs;
      cs.addListener(_onCast);
      await cs.load(url: item.url, title: item.title, image: item.logo, live: item.isLive || e.isLive, start: wasPos);
      setState(() {});
    } catch (_) {
      if (!mounted) return;
      setState(() => _castDev = null);
      toast(context, 'تعذر الاتصال بـ«${d.name}»', icon: Icons.cast_rounded);
      e.play();
    }
  }

  void _onCast() {
    final cs = _cast;
    if (cs == null || !mounted) return;
    if (cs.state == 'error' || cs.state == 'closed') {
      if (cs.error != null) _banner(cs.error!, Icons.cast_rounded);
      _stopCast();
      return;
    }
    setState(() {});
  }

  Future<void> _stopCast({bool resume = true}) async {
    final cs = _cast;
    final pos = cs?.position ?? 0;
    _cast = null;
    cs?.removeListener(_onCast);
    setState(() => _castDev = null);
    await cs?.close();
    if (!mounted || !resume) return;
    if (e.canSeek && pos > 0) e.seek(Duration(milliseconds: (pos * 1000).round()));
    e.play();
  }

  Widget _castLayer() {
    final t = Theme.of(context).textTheme;
    final cs = _cast;
    final st = cs?.state ?? 'connecting';
    final label = switch (st) {
      'connecting' => 'جارٍ الاتصال…',
      'loading' => 'جارٍ تحميل البث على الجهاز…',
      'PLAYING' => 'يعمل الآن على التلفاز',
      'PAUSED' => 'متوقف مؤقتًا',
      'BUFFERING' => 'يتم التخزين المؤقت…',
      'ended' => 'انتهى العرض',
      _ => 'متصل',
    };
    final vod = cs != null && cs.duration > 0;
    return Material(
      color: const Color(0xFF05070B),
      child: SafeArea(child: Stack(children: [
        Positioned.fill(child: DecoratedBox(decoration: BoxDecoration(gradient: RadialGradient(
          colors: [BColors.teal.withValues(alpha: .16), const Color(0xFF05070B)], radius: .9)))),
        Align(alignment: AlignmentDirectional.topStart, child: Padding(
          padding: const EdgeInsets.all(8),
          child: _CtrlBtn(icon: Icons.arrow_forward_rounded, tip: 'رجوع', onTap: () => Navigator.maybePop(context)),
        )),
        Center(child: SingleChildScrollView(child: Column(mainAxisSize: MainAxisSize.min, children: [
          if (item.logo != null) ChannelLogo(url: item.logo, name: item.title, size: 84, radius: 18)
          else const Icon(Icons.cast_connected_rounded, size: 72, color: BColors.teal),
          const SizedBox(height: 18),
          Text(item.title, textAlign: TextAlign.center, style: t.headlineSmall!.copyWith(color: Colors.white)),
          const SizedBox(height: 8),
          Row(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.cast_connected_rounded, color: BColors.teal, size: 20),
            const SizedBox(width: 8),
            Text('«${_castDev?.name}» · $label', style: t.bodyMedium!.copyWith(color: BColors.mist)),
          ]),
          if (vod) ...[
            const SizedBox(height: 10),
            Text('${fmtDur(Duration(seconds: cs.position.round()))} / ${fmtDur(Duration(seconds: cs.duration.round()))}',
                textDirection: TextDirection.ltr, style: t.labelLarge!.copyWith(color: Colors.white)),
          ],
          const SizedBox(height: 22),
          Directionality(textDirection: TextDirection.ltr, child: Row(mainAxisSize: MainAxisSize.min, children: [
            if (vod) _CtrlBtn(icon: Icons.replay_10_rounded, size: 34, tip: 'رجوع 10 ثوانٍ', onTap: () => cs.seek(cs.position - 10)),
            const SizedBox(width: 14),
            _BigPlay(playing: cs?.playing ?? false, onTap: () => (cs?.playing ?? false) ? cs?.pause() : cs?.play()),
            const SizedBox(width: 14),
            if (vod) _CtrlBtn(icon: Icons.forward_10_rounded, size: 34, tip: 'تقدم 10 ثوانٍ', onTap: () => cs.seek(cs.position + 10)),
          ])),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            autofocus: true,
            onPressed: _stopCast,
            icon: const Icon(Icons.cancel_presentation_rounded, color: Colors.white70),
            label: const Text('إيقاف العرض والمتابعة هنا', style: TextStyle(color: Colors.white)),
          ),
        ]))),
      ])),
    );
  }

  Widget _upNextCard() {
    final n = _upNext!;
    final t = Theme.of(context).textTheme;
    final ep = item.isEpisode;
    return _Glass(child: Container(
      width: 320,
      padding: const EdgeInsets.all(12),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(children: [
          if (n.logo != null) ...[
            ClipRRect(borderRadius: BorderRadius.circular(8),
                child: Image.network(n.logo!, width: 56, height: 56, fit: BoxFit.cover, errorBuilder: (_, _, _) => const SizedBox())),
            const SizedBox(width: 10),
          ],
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(_countdown != null ? '${ep ? 'الحلقة التالية' : 'التالي'} خلال $_countdown ث' : (ep ? 'الحلقة التالية' : 'التالي في القائمة'),
                style: t.labelMedium!.copyWith(color: BColors.gold)),
            const SizedBox(height: 2),
            Text(n.subtitle != null && ep ? n.subtitle! : n.title, maxLines: 2, overflow: TextOverflow.ellipsis,
                style: t.titleSmall!.copyWith(color: Colors.white)),
          ])),
        ]),
        if (_countdown != null) ...[
          const SizedBox(height: 10),
          Directionality(textDirection: TextDirection.ltr, child: ClipRRect(borderRadius: BorderRadius.circular(2),
              child: LinearProgressIndicator(value: 1 - (_countdown! / 10), minHeight: 3, color: BColors.teal, backgroundColor: Colors.white24))),
        ],
        const SizedBox(height: 10),
        Row(children: [
          Expanded(child: FilledButton.icon(
            autofocus: true,
            onPressed: () { _cancelCountdown(); _next(1); },
            icon: const Icon(Icons.skip_next_rounded),
            label: Text(ep ? 'الحلقة التالية' : 'شاهد التالي'),
          )),
          const SizedBox(width: 8),
          TextButton(
            onPressed: () => setState(() { _cdT?.cancel(); _countdown = null; _upNextDismissed = true; }),
            child: const Text('إلغاء', style: TextStyle(color: Colors.white70)),
          ),
        ]),
      ]),
    ));
  }

  String? _restartUrl(EpgProgram p) {
    final c = item.channelId == null ? null : s.channelById(item.channelId!);
    if (c == null) return null;
    return catchupUrl(c, p, s.sources[c.sourceId]?.tzOffset ?? 0);
  }

  Playable _catchupPlayable(EpgProgram p, String url) => Playable(
        key: 'cu:${item.channelId}:${p.start.millisecondsSinceEpoch}', title: '${p.title} — إعادة', url: url,
        subtitle: '${item.title} · ${hhmm(p.start)}', logo: item.logo, sourceId: item.sourceId, channelId: item.channelId,
      );

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
      if (now != null && _restartUrl(now) != null)
        TextButton.icon(
          onPressed: () => _open(_catchupPlayable(now, _restartUrl(now)!)),
          icon: const Icon(Icons.replay_rounded, size: 18),
          label: const Text('من البداية'),
        ),
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
        if (item.isEpisode) ...[
          const SizedBox(height: 16),
          Text('مقدمة المسلسل', style: t.titleSmall),
          const SizedBox(height: 4),
          Text(_introEnd == null
              ? 'لم تُحدَّد بعد. اضغط «تخطي المقدمة» حتى تنتهي، أو اجعل الموضع الحالي نهايتها.'
              : 'تنتهي عند ${fmtDur(Duration(seconds: _introEnd!))} في كل حلقات هذا المسلسل.', style: t.bodySmall),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 8, children: [
            ActionChip(
              avatar: const Icon(Icons.flag_rounded, size: 16),
              label: Text('النهاية هنا (${fmtDur(e.position)})'),
              onPressed: () { s.setIntro(item.seriesId!, e.position.inSeconds); _introSkipped = true; set(() {}); },
            ),
            if (_introEnd != null)
              ActionChip(avatar: const Icon(Icons.close_rounded, size: 16), label: const Text('مسح'),
                  onPressed: () { s.setIntro(item.seriesId!, null); _introSkipped = false; set(() {}); }),
          ]),
        ],
        const SizedBox(height: 16),
        Text('مؤقت النوم', style: t.titleSmall),
        const SizedBox(height: 8),
        Wrap(spacing: 8, runSpacing: 8, children: [
          for (final m in [15, 30, 60, 90])
            ChoiceChip(label: Text('$m د'), selected: false, onSelected: (_) { _setSleep(Duration(minutes: m)); Navigator.pop(c); }),
          if (s.nowNext(item.tvgId).$1 != null)
            ChoiceChip(label: const Text('نهاية البرنامج'), selected: false, onSelected: (_) {
              _setSleep(s.nowNext(item.tvgId).$1!.stop.difference(DateTime.now()));
              Navigator.pop(c);
            }),
          if (_sleepAt != null)
            ActionChip(avatar: const Icon(Icons.close_rounded, size: 16), label: const Text('إلغاء المؤقت'),
                onPressed: () { _setSleep(null); Navigator.pop(c); }),
        ]),
        if (_sleepAt != null) ...[
          const SizedBox(height: 6),
          Text('يتوقف التشغيل الساعة ${hhmm(_sleepAt!)}', style: t.bodySmall),
        ],
        if (item.isLive && item.channelId != null && s.channelById(item.channelId!) != null) ...[
          const SizedBox(height: 16),
          OutlinedButton.icon(
            onPressed: () {
              final ch = s.channelById(item.channelId!)!;
              Navigator.pop(c);
              final nav = Navigator.of(context);
              nav.pop();
              openMultiView(nav.context, initial: [ch]);
            },
            icon: const Icon(Icons.grid_view_rounded),
            label: const Text('عرض متعدد (حتى 4 قنوات معًا)'),
          ),
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

/// زر «تخطي المقدمة» بأسلوب نتفليكس: أبيض عريض في الزاوية.
class _SkipButton extends StatelessWidget {
  final String label;
  final String? hint;
  final VoidCallback onTap;
  const _SkipButton({required this.label, this.hint, required this.onTap});
  @override
  Widget build(BuildContext context) => BTap(
        onTap: onTap,
        radius: 10,
        semantic: label,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: .92), borderRadius: BorderRadius.circular(10),
            boxShadow: const [BoxShadow(color: Colors.black45, blurRadius: 16)],
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            const Icon(Icons.skip_next_rounded, color: BColors.midnight950),
            const SizedBox(width: 8),
            Text(label, style: const TextStyle(fontFamily: kFont, fontSize: 15, fontWeight: FontWeight.w700, color: BColors.midnight950)),
            if (hint != null) ...[
              const SizedBox(width: 6),
              Text(hint!, textDirection: TextDirection.rtl,
                  style: const TextStyle(fontFamily: kFont, fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF4A5566))),
            ],
          ]),
        ),
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


/// موقع القناة ذات الرقم n في الطابور: بالرقم الحقيقي للقناة إن وُجد، وإلا بترتيبها.
int? queueIndexForNumber(List<Playable> q, int n) {
  for (var i = 0; i < q.length; i++) {
    final c = q[i].channelId == null ? null : AppStore.I.channelById(q[i].channelId!);
    if (c?.number == n) return i;
  }
  return n >= 1 && n <= q.length ? n - 1 : null;
}
