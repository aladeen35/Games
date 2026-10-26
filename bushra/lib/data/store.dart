import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_ce_flutter/hive_ce_flutter.dart';
import 'epg.dart';
import 'm3u.dart';
import 'models.dart';
import 'net.dart';
import 'open_channels.dart';
import 'reminders.dart';
import 'search.dart';
import 'xtream.dart';

enum SourceStatus { idle, updating }

/// نتيجة اختبار مصدر قبل حفظه: تُعرض معاينة للمستخدم أولًا.
class SourcePreview {
  final Source source;
  final SourceSecret secret;
  final List<Channel> channels;
  final Duration latency;
  final String? accountNote;
  SourcePreview(this.source, this.secret, this.channels, this.latency, this.accountNote);
}

class Settings {
  ThemeMode theme = ThemeMode.dark;
  bool highContrast = false, reduceMotion = false, showOriginalNames = true;
  double textScale = 1.0;
  bool fillScreen = false, resume = true, autoReconnect = true, autoplayNext = true;
  bool showStreamInfo = false;
  String preferredAudio = 'ar';
  double subtitleScale = 1.0;
  bool subtitleBackground = true;
  String? parentalPin;
  Set<String> lockedGroups = {};
  String corsProxy = '';
  bool onboarded = false;
  /// نمط التصميم: false = الهادئ الأساسي، true = السينمائي البديل.
  bool cinematic = true;
  /// إخفاء القنوات التي تبيّن أنها لا تعمل.
  bool hideBroken = false;
  /// شاشة «من يشاهد؟» عند فتح التطبيق.
  bool askProfile = true;
  /// التحويل تلقائيًا لرابط بديل حين تتعطل القناة.
  bool autoFailover = true;
  /// تحميل القناة التالية مسبقًا ليصير التقليب فوريًا.
  bool fastZap = true;
  /// تخطي المقدمة تلقائيًا بعد أن يتعلم التطبيق طولها.
  bool autoSkipIntro = false;

  Map<String, dynamic> toJson() => {
        'theme': theme.index, 'hc': highContrast, 'rm': reduceMotion, 'orig': showOriginalNames,
        'ts': textScale, 'fill': fillScreen, 'resume': resume, 'reconnect': autoReconnect,
        'next': autoplayNext, 'info': showStreamInfo, 'audio': preferredAudio, 'sub': subtitleScale,
        'subBg': subtitleBackground, 'pin': parentalPin, 'locked': lockedGroups.toList(),
        'cors': corsProxy, 'onb': onboarded, 'cine': cinematic, 'hideBroken': hideBroken, 'v': 2,
        'askP': askProfile, 'failover': autoFailover, 'zap': fastZap, 'skipIntro': autoSkipIntro,
      };

  void load(Map j) {
    theme = ThemeMode.values[j['theme'] ?? ThemeMode.dark.index];
    highContrast = j['hc'] ?? false;
    reduceMotion = j['rm'] ?? false;
    showOriginalNames = j['orig'] ?? true;
    textScale = (j['ts'] ?? 1.0).toDouble();
    fillScreen = j['fill'] ?? false;
    resume = j['resume'] ?? true;
    autoReconnect = j['reconnect'] ?? true;
    autoplayNext = j['next'] ?? true;
    showStreamInfo = j['info'] ?? false;
    preferredAudio = j['audio'] ?? 'ar';
    subtitleScale = (j['sub'] ?? 1.0).toDouble();
    subtitleBackground = j['subBg'] ?? true;
    parentalPin = j['pin'];
    lockedGroups = Set<String>.from(j['locked'] ?? const []);
    corsProxy = j['cors'] ?? '';
    onboarded = j['onb'] ?? false;
    // من الإصدار 1.3 صار النمط السينمائي هو الافتراضي (إعدادات ما قبل v2 تنتقل إليه مرة واحدة)
    cinematic = (j['v'] ?? 1) >= 2 ? (j['cine'] ?? true) : true;
    hideBroken = j['hideBroken'] ?? false;
    askProfile = j['askP'] ?? true;
    autoFailover = j['failover'] ?? true;
    fastZap = j['zap'] ?? true;
    autoSkipIntro = j['skipIntro'] ?? false;
  }
}

/// مخزن التطبيق: المصادر والقنوات والدليل والمفضلة والسجل والإعدادات — كلها على الجهاز.
class AppStore extends ChangeNotifier {
  static final AppStore I = AppStore._();
  AppStore._();

  late Box _settingsBox, _metaBox, _userBox;
  late LazyBox<String> _channelsBox, _epgBox;
  final _secure = const FlutterSecureStorage();

  final settings = Settings();
  final Map<String, Source> sources = {};
  final Map<String, List<Channel>> _channels = {};
  final Map<String, SourceStatus> status = {};
  final Map<String, List<EpgProgram>> _epg = {}; // tvgId → برامج مرتبة
  final Map<String, Channel> favorites = {};
  final List<HistoryEntry> history = [];
  final List<LocalVideo> localVideos = [];
  final List<Reminder> reminders = [];

  /// الملفات الشخصية والملف الحالي. المفضلة والسجل وسجل أوقات المشاهدة لكل ملف على حدة.
  final List<Profile> profiles = [];
  late Profile profile;
  /// اختار المستخدم ملفه في هذه الجلسة (شاشة «من يشاهد؟»).
  bool profileChosen = false;
  bool get isKids => profile.kids;
  /// أوقات المشاهدة (للاقتراحات «تشاهده عادة في هذا الوقت»): [وقت، معرّف].
  final List<(DateTime, String)> watchLog = [];
  /// طول مقدمة كل مسلسل بالثواني (يتعلمه التطبيق من أول تخطٍّ).
  final Map<String, int> intro = {};
  /// كلمات «التنبيهات الذكية» (فرق، برامج…).
  final List<String> alertWords = [];
  final Set<int> _dismissedAuto = {};
  /// يُستدعى عند تغيّر المفضلة أو السجل (لمزامنة شاشة Android TV الرئيسية).
  static void Function()? onUserData;

  /// حالة القنوات: true تعمل، false لا تعمل (من الفحص أو من آخر محاولة تشغيل).
  final Map<String, bool> health = {};
  bool healthChecking = false;
  int healthDone = 0, healthTotal = 0;

  /// القنوات المفتوحة المصدر (iptv-org) — منفصلة عن قوائم المستخدم.
  List<Channel> openChannels = [];
  DateTime? openUpdated;
  bool openLoading = false;
  String? openError;
  bool parentalUnlocked = false;
  bool ready = false;

  bool _pending = false;

  /// إشعار آمن: إن جاء أثناء مرحلة البناء (مثل initState لشاشة المشغل) يُؤجَّل لما بعد الإطار،
  /// وإلا قد تعلق شجرة الواجهة العليا في حالة «متسخة» ولا يُعاد بناؤها.
  @override
  void notifyListeners() {
    final phase = SchedulerBinding.instance.schedulerPhase;
    if (phase == SchedulerPhase.persistentCallbacks || phase == SchedulerPhase.midFrameMicrotasks) {
      if (_pending) return;
      _pending = true;
      SchedulerBinding.instance.addPostFrameCallback((_) {
        _pending = false;
        super.notifyListeners();
      });
      return;
    }
    super.notifyListeners();
  }

  // ———————————————————— التهيئة ————————————————————
  Future<void> init() async {
    await Hive.initFlutter('bushra');
    _settingsBox = await Hive.openBox('settings');
    _metaBox = await Hive.openBox('meta');
    _userBox = await Hive.openBox('user');
    _channelsBox = await Hive.openLazyBox<String>('channels');
    _epgBox = await Hive.openLazyBox<String>('epg');

    settings.load(Map.from(_settingsBox.get('s', defaultValue: {})));
    Net.corsProxy = settings.corsProxy;
    for (final v in (_metaBox.get('sources', defaultValue: const []) as List)) {
      final s = Source.fromJson(Map<String, dynamic>.from(jsonDecode(v)));
      sources[s.id] = s;
    }
    for (final id in sources.keys) {
      final raw = await _channelsBox.get(id);
      if (raw != null) {
        final list = [for (final c in jsonDecode(raw) as List) Channel.fromJson(Map<String, dynamic>.from(c))];
        // قوائم M3U المحفوظة قبل 1.2 صُنّفت بالمجموعة؛ نعيد تصنيفها بالرابط
        _channels[id] = sources[id]!.type == SourceType.xtream ? list : [for (final c in list) c.withKind(guessKind(c.url))];
      }
      final ep = await _epgBox.get(id);
      if (ep != null) _indexEpg([for (final p in jsonDecode(ep) as List) EpgProgram.fromJson(Map<String, dynamic>.from(p))]);
    }
    _initProfiles();
    _loadProfileData();
    intro.addAll(Map<String, int>.from(_userBox.get('intro', defaultValue: const {}) as Map));
    alertWords.addAll(List<String>.from(_userBox.get('alerts', defaultValue: const []) as List));
    _dismissedAuto.addAll(List<int>.from(_userBox.get('alertsOff', defaultValue: const []) as List));
    if (!kIsWeb) {
      for (final v in (_userBox.get('local', defaultValue: const []) as List)) {
        localVideos.add(LocalVideo.fromJson(Map<String, dynamic>.from(jsonDecode(v))));
      }
    }
    final openRaw = await _channelsBox.get(OpenChannels.sourceId);
    if (openRaw != null) {
      openChannels = [for (final c in jsonDecode(openRaw) as List) Channel.fromJson(Map<String, dynamic>.from(c))];
      final t = _metaBox.get('openUpd');
      if (t is int) openUpdated = DateTime.fromMillisecondsSinceEpoch(t);
    }
    health.addAll(Map<String, bool>.from(_userBox.get('health', defaultValue: const {}) as Map));
    for (final v in (_userBox.get('reminders', defaultValue: const []) as List)) {
      final r = Reminder.fromJson(Map<String, dynamic>.from(jsonDecode(v)));
      if (r.start.isAfter(DateTime.now().subtract(const Duration(minutes: 30)))) reminders.add(r);
    }
    ready = true;
    notifyListeners();
    unawaited(Reminders.init(reminders));
    Future.delayed(const Duration(seconds: 8), () => scheduleAlerts());
    // تحديث مجدول في الخلفية للقوائم القديمة، مع الإبقاء على آخر نسخة ناجحة
    Future.delayed(const Duration(seconds: 3), _autoRefresh);
  }

  void _autoRefresh() {
    // فحص صحة القنوات مرة يوميًا على الجوال (في الخلفية)
    final last = _metaBox.get('healthAt');
    if (!kIsWeb && sources.isNotEmpty && (last is! int || DateTime.now().millisecondsSinceEpoch - last > 86400000)) {
      _metaBox.put('healthAt', DateTime.now().millisecondsSinceEpoch);
      Future.delayed(const Duration(seconds: 20), () => checkHealth(limit: 300));
    }
    for (final s in sources.values) {
      final age = s.lastUpdated == null ? null : DateTime.now().difference(s.lastUpdated!);
      if (s.type != SourceType.m3uFile && s.autoRefreshHours > 0 && (age == null || age.inHours >= s.autoRefreshHours)) {
        refresh(s.id).catchError((_) {});
      } else if (s.epgUrl != null && (s.epgUpdated == null || DateTime.now().difference(s.epgUpdated!).inHours >= 20)) {
        // الدليل يتجدد يوميًا تلقائيًا
        loadEpg(s.id);
      }
    }
  }

  void saveSettings() {
    Net.corsProxy = settings.corsProxy;
    _settingsBox.put('s', settings.toJson());
    notifyListeners();
  }

  // ———————————————————— القنوات ————————————————————
  List<Channel> get allChannels => [for (final l in _channels.values) ...l];
  List<Channel> channelsOf(String sourceId) => _channels[sourceId] ?? const [];
  bool get hasContent => _channels.values.any((l) => l.isNotEmpty);

  bool isLocked(Channel c) => settings.parentalPin != null && !parentalUnlocked && settings.lockedGroups.contains(c.group);

  bool isBroken(String id) => health[id] == false;
  bool _hidden(Channel c) {
    if (isKids) {
      // ملف الأطفال: لا محتوى للبالغين ولا مجموعات مقفلة أبدًا، ومجموعات الأطفال فقط إن طُلب ذلك
      if (isAdultContent(c) || settings.lockedGroups.contains(c.group)) return true;
      if (profile.kidsOnly && !isKidsContent(c)) return true;
    }
    return isLocked(c) || (settings.hideBroken && c.isLive && isBroken(c.id));
  }

  /// هل يظهر هذا العنصر في الملف الحالي؟
  bool allowed(Channel c) => !_hidden(c);

  Timer? _healthSave;
  void markHealth(String id, bool ok) {
    if (health[id] == ok) return;
    health[id] = ok;
    _healthSave?.cancel();
    _healthSave = Timer(const Duration(seconds: 2), () {
      _userBox.put('health', Map<String, bool>.from(health));
      notifyListeners();
    });
  }

  /// يفحص القنوات المباشرة في الخلفية (طلب خفيف لكل قناة، 6 في وقت واحد).
  /// على الويب لا يُستخدم لأن المتصفح يمنع كثيرًا من الطلبات (CORS) فتظهر نتائج خاطئة.
  Future<void> checkHealth({String? sourceId, int limit = 400}) async {
    if (healthChecking || kIsWeb) return;
    final list = [for (final c in (sourceId == null ? allChannels : channelsOf(sourceId))) if (c.isLive) c].take(limit).toList();
    healthChecking = true;
    healthDone = 0;
    healthTotal = list.length;
    notifyListeners();
    var i = 0;
    Future<void> worker() async {
      while (i < list.length) {
        final c = list[i++];
        markHealth(c.id, await Net.probe(c.url, c.headers));
        healthDone++;
        if (healthDone % 10 == 0) notifyListeners();
      }
    }
    await Future.wait([for (var k = 0; k < 6; k++) worker()]);
    healthChecking = false;
    _userBox.put('health', Map<String, bool>.from(health));
    notifyListeners();
  }

  List<Channel> visible({ChannelKind? kind, String? sourceId}) {
    final base = sourceId == null ? allChannels : channelsOf(sourceId);
    return [for (final c in base) if ((kind == null || c.kind == kind) && !_hidden(c)) c];
  }

  /// المجموعات بترتيب ظهورها مع عدد قنوات كل منها.
  List<MapEntry<String, int>> groupsOf(List<Channel> list) {
    final m = <String, int>{};
    for (final c in list) {
      m[c.group] = (m[c.group] ?? 0) + 1;
    }
    return m.entries.toList();
  }

  Channel? channelById(String id) {
    for (final l in _channels.values) {
      for (final c in l) {
        if (c.id == id) return c;
      }
    }
    for (final c in openChannels) {
      if (c.id == id) return c;
    }
    return favorites[id];
  }

  // ———————————————————— القنوات المفتوحة ————————————————————
  /// يحمّل قائمة iptv-org (مرة يوميًا، أو عند الطلب)، ويحتفظ بآخر نسخة ناجحة.
  Future<void> loadOpen({bool force = false}) async {
    if (openLoading) return;
    final fresh = openUpdated != null && DateTime.now().difference(openUpdated!).inHours < 24;
    if (!force && fresh && openChannels.isNotEmpty) return;
    openLoading = true;
    openError = null;
    notifyListeners();
    try {
      final text = await Net.text(OpenChannels.url, timeout: const Duration(seconds: 90));
      final list = await compute(parseOpenChannels, text);
      if (list.isEmpty) throw NetError(NetErrorKind.badFormat, 'empty');
      openChannels = list;
      _altReset();
      openUpdated = DateTime.now();
      await _channelsBox.put(OpenChannels.sourceId, jsonEncode([for (final c in list) c.toJson()]));
      await _metaBox.put('openUpd', openUpdated!.millisecondsSinceEpoch);
    } catch (e) {
      openError = e is NetError ? e.message : 'تعذر تحميل القنوات المفتوحة';
    } finally {
      openLoading = false;
      notifyListeners();
    }
  }

  List<Channel> visibleOpen() => [for (final c in openChannels) if (!_hidden(c)) c];

  // ———————————————————— التذكير بالبرامج ————————————————————
  Reminder? reminderFor(String channelId, DateTime start) {
    final id = Reminder.idFor(channelId, start);
    for (final r in reminders) {
      if (r.id == id) return r;
    }
    return null;
  }

  Future<bool> addReminder(Channel c, EpgProgram p, {bool auto = false}) async {
    final r = Reminder(id: Reminder.idFor(c.id, p.start), channelId: c.id, channelName: c.name, title: p.title, start: p.start, logo: c.logo, auto: auto);
    final ok = await Reminders.schedule(r);
    reminders.removeWhere((x) => x.id == r.id);
    reminders.add(r);
    reminders.sort((a, b) => a.start.compareTo(b.start));
    _saveReminders();
    return ok;
  }

  Future<void> removeReminder(Reminder r) async {
    await Reminders.cancel(r);
    reminders.removeWhere((x) => x.id == r.id);
    // تذكير تلقائي ألغاه المستخدم: لا نعيده في الفحص القادم
    if (r.auto) {
      _dismissedAuto.add(r.id);
      _userBox.put('alertsOff', _dismissedAuto.toList());
    }
    _saveReminders();
  }

  void _saveReminders() {
    _userBox.put('reminders', [for (final r in reminders) jsonEncode(r.toJson())]);
    notifyListeners();
  }

  // ———————————————————— المصادر ————————————————————
  Future<SourceSecret> secretOf(String id) async {
    try {
      final v = await _secure.read(key: 'src_$id');
      if (v != null) return SourceSecret.fromJson(jsonDecode(v));
    } catch (_) {}
    final fallback = _metaBox.get('sec_$id');
    if (fallback != null) {
      return SourceSecret.fromJson(jsonDecode(utf8.decode(base64.decode(fallback as String))));
    }
    return const SourceSecret();
  }

  Future<void> _saveSecret(String id, SourceSecret s) async {
    final raw = jsonEncode(s.toJson());
    try {
      await _secure.write(key: 'src_$id', value: raw);
      await _metaBox.delete('sec_$id');
    } catch (_) {
      // متصفح بلا WebCrypto: نحفظه مرمّزًا على الأقل ولا نعرضه في الواجهة
      await _metaBox.put('sec_$id', base64.encode(utf8.encode(raw)));
    }
  }

  /// يختبر المصدر ويعيد معاينة (العدد، المجموعات، الشعارات، الدليل، زمن الاستجابة).
  Future<SourcePreview> testSource({
    required SourceType type, String? name, String? url, String? fileText, String? fileName,
    String? server, String? username, String? password, String? existingId,
  }) async {
    final id = existingId ?? stableId('${DateTime.now().microsecondsSinceEpoch}|$url|$server|$fileName');
    final sw = Stopwatch()..start();
    List<Channel> chans;
    String? epg, note;
    var epgAuto = false;
    var tz = 0;
    SourceSecret secret;
    String host;
    switch (type) {
      case SourceType.m3uUrl:
        // روابط المزودين get.php?username=…&password=… هي حسابات Xtream: نستخدم الحساب مباشرة
        // فتظهر الأفلام والمسلسلات ودليل البرامج تلقائيًا
        final xt = xtreamFromUrl(url!);
        if (xt != null) {
          try {
            final p = await testSource(type: SourceType.xtream, name: name, server: xt.$1, username: xt.$2,
                password: xt.$3, existingId: existingId ?? id);
            return SourcePreview(p.source, p.secret, p.channels, p.latency,
                [if (p.accountNote != null) p.accountNote!, 'اكتُشف حساب مزود: الأفلام والمسلسلات والدليل تلقائيًا'].join(' · '));
          } catch (_) {
            // ليس حساب Xtream فعليًا؛ نكمل كقائمة M3U عادية
          }
        }
        final text = await Net.text(url);
        sw.stop();
        final r = await _parse(text, id);
        chans = r.channels; epg = r.epgUrl;
        secret = SourceSecret(url: url.trim());
        host = Net.safeHost(url);
        if (epg == null) {
          epg = guessEpgUrl(url);
          epgAuto = epg != null;
        }
      case SourceType.m3uFile:
        final r = await _parse(fileText!, id);
        sw.stop();
        chans = r.channels; epg = r.epgUrl;
        secret = const SourceSecret();
        host = fileName ?? 'ملف من الجهاز';
      case SourceType.xtream:
        final x = XtreamClient(server!, username!.trim(), password!);
        final info = await x.login();
        sw.stop();
        chans = await x.fetchAll(id);
        epg = x.epgUrl;
        tz = XtreamClient.tzOffsetOf(info);
        final exp = int.tryParse('${info['user_info']?['exp_date']}');
        if (exp != null) {
          final d = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
          note = 'ينتهي الاشتراك ${d.year}/${d.month}/${d.day}';
        }
        secret = SourceSecret(server: x.server, username: username.trim(), password: password);
        host = Net.safeHost(x.server);
    }
    if (chans.isEmpty) throw NetError(NetErrorKind.badFormat, 'empty');
    final live = chans.where((c) => c.isLive).length;
    final src = Source(
      id: id, name: (name?.trim().isNotEmpty ?? false) ? name!.trim() : (type == SourceType.xtream ? 'حساب $host' : host),
      type: type, displayHost: host, epgUrl: epg, epgAuto: epgAuto, lastUpdated: DateTime.now(), tzOffset: tz,
      liveCount: live, vodCount: chans.length - live,
      groups: groupsOf(chans).map((e) => e.key).toList(),
      hasLogos: chans.any((c) => c.logo != null), hasEpg: epg != null,
    );
    return SourcePreview(src, secret, chans, sw.elapsed, note);
  }

  Future<M3uResult> _parse(String text, String id) async {
    try {
      return await compute(parseM3u, {'text': text, 'source': id});
    } on FormatException {
      throw NetError(NetErrorKind.badFormat, 'm3u parse');
    }
  }

  Future<void> commit(SourcePreview p) async {
    sources[p.source.id] = p.source;
    _channels[p.source.id] = p.channels;
    await _saveSecret(p.source.id, p.secret);
    await _channelsBox.put(p.source.id, jsonEncode([for (final c in p.channels) c.toJson()]));
    _persistSources();
    _altReset();
    notifyListeners();
    unawaited(loadEpg(p.source.id));
  }

  void _persistSources() => _metaBox.put('sources', [for (final s in sources.values) jsonEncode(s.toJson())]);

  void renameSource(String id, String name) {
    sources[id]?.name = name;
    _persistSources();
    notifyListeners();
  }

  /// تحديث القائمة. عند الفشل تبقى النسخة السابقة متاحة مع شارة «بيانات قديمة».
  Future<void> refresh(String id) async {
    final s = sources[id];
    if (s == null || s.type == SourceType.m3uFile || status[id] == SourceStatus.updating) return;
    status[id] = SourceStatus.updating;
    notifyListeners();
    try {
      final sec = await secretOf(id);
      final p = await testSource(
        type: s.type, name: s.name, url: sec.url, server: sec.server, username: sec.username,
        password: sec.password, existingId: id,
      );
      p.source
        ..autoRefreshHours = s.autoRefreshHours
        ..epgUrl = s.epgUrl ?? p.source.epgUrl
        ..epgAuto = s.epgUrl == null ? p.source.epgAuto : s.epgAuto
        ..epgUpdated = s.epgUpdated;
      await commit(p);
    } catch (e) {
      s.lastError = e is NetError ? e.message : 'تعذر تحديث هذه القائمة';
      s.lastErrorAt = DateTime.now();
      _persistSources();
      rethrow;
    } finally {
      status[id] = SourceStatus.idle;
      notifyListeners();
    }
  }

  Future<void> removeSource(String id) async {
    sources.remove(id);
    _channels.remove(id);
    await _channelsBox.delete(id);
    await _epgBox.delete(id);
    try { await _secure.delete(key: 'src_$id'); } catch (_) {}
    await _metaBox.delete('sec_$id');
    _altReset();
    _persistSources();
    notifyListeners();
  }

  // ———————————————————— دليل البرامج ————————————————————
  bool epgLoading = false;
  String? epgError;
  bool get hasEpg => _epg.isNotEmpty;

  void _indexEpg(List<EpgProgram> list) {
    for (final p in list) {
      (_epg[p.channel] ??= []).add(p);
    }
    for (final l in _epg.values) {
      l.sort((a, b) => a.start.compareTo(b.start));
    }
  }

  Future<void> setEpgUrl(String id, String? url) async {
    sources[id]?.epgUrl = (url?.trim().isEmpty ?? true) ? null : url!.trim();
    sources[id]?.epgAuto = false;
    _persistSources();
    notifyListeners();
    await loadEpg(id);
  }

  Future<void> loadEpg(String id) async {
    final s = sources[id];
    if (s == null || s.epgUrl == null) return;
    epgLoading = true;
    epgError = null;
    notifyListeners();
    try {
      final chans = channelsOf(id);
      final ids = {for (final c in chans) if (c.tvgId != null) c.tvgId!}.toList();
      // القنوات الحية بلا tvg-id تُطابَق بأسمائها تلقائيًا
      final names = [for (final c in chans) if (c.tvgId == null && c.isLive) [c.id, c.name]];
      final text = await Net.text(s.epgUrl!, timeout: const Duration(seconds: 90));
      final res = await compute(parseXmltvMatched, {'text': text, 'ids': ids, 'names': names});
      final progs = res['programs'] as List<EpgProgram>;
      final matches = Map<String, String>.from(res['matches'] as Map);
      if (matches.isNotEmpty) {
        _channels[id] = [for (final c in chans) matches[c.id] != null ? c.withTvgId(matches[c.id]!) : c];
        await _channelsBox.put(id, jsonEncode([for (final c in _channels[id]!) c.toJson()]));
      }
      await _epgBox.put(id, jsonEncode([for (final p in progs) p.toJson()]));
      for (final tid in {...ids, ...matches.values}) {
        _epg.remove(tid);
      }
      _indexEpg(progs);
      s.hasEpg = progs.isNotEmpty;
      s.epgUpdated = DateTime.now();
      _persistSources();
      _altReset();
      unawaited(scheduleAlerts());
    } catch (e) {
      if (s.epgAuto) {
        // رابط خمّناه ولم ينجح: لا نزعج المستخدم ولا نكرر المحاولة
        s.epgUrl = null;
        s.epgAuto = false;
        _persistSources();
      } else {
        epgError = e is NetError ? e.message : 'تعذر تحميل دليل البرامج';
      }
    } finally {
      epgLoading = false;
      notifyListeners();
    }
  }

  List<EpgProgram> programsOf(String? tvgId) => tvgId == null ? const [] : (_epg[tvgId] ?? const []);

  /// البرنامج الحالي والقادم.
  (EpgProgram?, EpgProgram?) nowNext(String? tvgId) {
    final l = programsOf(tvgId);
    final t = DateTime.now();
    for (var i = 0; i < l.length; i++) {
      if (l[i].isNow(t)) return (l[i], i + 1 < l.length ? l[i + 1] : null);
      if (l[i].start.isAfter(t)) return (null, l[i]);
    }
    return (null, null);
  }

  // ———————————————————— المفضلة والسجل ————————————————————
  bool isFav(String id) => favorites.containsKey(id);

  void toggleFav(Channel c) {
    if (favorites.remove(c.id) == null) favorites[c.id] = c;
    _saveFavs();
    notifyListeners();
  }

  void _saveFavs() {
    _userBox.put(_pk('fav'), [for (final f in favorites.values) jsonEncode(f.toJson())]);
    onUserData?.call();
  }

  HistoryEntry? historyOf(String key) {
    for (final h in history) {
      if (h.item.key == key) return h;
    }
    return null;
  }

  void recordPlay(Playable p) {
    final h = historyOf(p.key);
    if (h != null) {
      history.remove(h);
      h.plays++;
      h.updatedAt = DateTime.now();
      history.insert(0, h);
    } else {
      history.insert(0, HistoryEntry(item: p));
    }
    if (history.length > 200) history.removeRange(200, history.length);
    watchLog.add((DateTime.now(), p.channelId ?? p.key));
    if (watchLog.length > 400) watchLog.removeRange(0, watchLog.length - 400);
    _userBox.put(_pk('log'), [for (final (t, id) in watchLog) '${t.millisecondsSinceEpoch}|$id']);
    _saveHistory();
  }

  Timer? _histTimer;
  void updateProgress(String key, Duration pos, Duration dur) {
    final h = historyOf(key);
    if (h == null) return;
    h.positionMs = pos.inMilliseconds;
    h.durationMs = dur.inMilliseconds;
    h.updatedAt = DateTime.now();
    _histTimer?.cancel();
    _histTimer = Timer(const Duration(seconds: 2), _saveHistory);
  }

  void removeHistory(String key) {
    history.removeWhere((h) => h.item.key == key);
    _saveHistory();
  }

  void clearHistory() {
    history.clear();
    _saveHistory();
  }

  void _saveHistory() {
    _userBox.put(_pk('history'), [for (final h in history) jsonEncode(h.toJson())]);
    notifyListeners();
    onUserData?.call();
  }

  List<HistoryEntry> get continueWatching =>
      history.where((h) => h.resumable || h.item.isLive).take(12).toList();

  /// ما ستكمله: أفلام وملفات بدأتها ولم تنهها، الأحدث أولًا.
  List<HistoryEntry> get inProgress => history.where((h) => h.resumable).toList();

  /// ما بدأت مشاهدته مؤخرًا (قنوات وأفلام وملفات).
  List<HistoryEntry> get recentlyStarted => history.take(30).toList();

  /// ما شاهدته حتى النهاية.
  List<HistoryEntry> get finished => history.where((h) => !h.item.isLive && h.durationMs > 0 && h.progress >= .95).toList();

  /// الأكثر مشاهدة في قوائمك (من السجل المحلي).
  List<HistoryEntry> get mostWatched {
    final l = history.where((h) => h.plays > 1).toList()..sort((a, b) => b.plays.compareTo(a.plays));
    return l.take(16).toList();
  }

  // ———————————————————— ملفات الجهاز ————————————————————
  void addLocal(List<LocalVideo> vids) {
    for (final v in vids) {
      localVideos.removeWhere((x) => x.uri == v.uri);
      localVideos.insert(0, v);
    }
    _saveLocal();
  }

  void removeLocal(LocalVideo v) {
    localVideos.remove(v);
    _saveLocal();
  }

  void _saveLocal() {
    if (!kIsWeb) _userBox.put('local', [for (final v in localVideos) jsonEncode(v.toJson())]);
    notifyListeners();
  }

  // ———————————————————— النسخ الاحتياطي ————————————————————
  /// ملف واحد فيه القوائم (مع بيانات الدخول) والمفضلة والسجل والتذكيرات والإعدادات.
  Future<String> exportBackup() async {
    final srcs = <Map<String, dynamic>>[];
    for (final src in sources.values) {
      srcs.add({
        'source': src.toJson(),
        'secret': (await secretOf(src.id)).toJson(),
        // ملفات M3U من الجهاز لا يمكن إعادة تحميلها، فنحفظ قنواتها
        if (src.type == SourceType.m3uFile) 'channels': [for (final c in channelsOf(src.id)) c.toJson()],
      });
    }
    return const JsonEncoder.withIndent(' ').convert({
      'app': 'bushra', 'v': 1, 'at': DateTime.now().toIso8601String(),
      'settings': settings.toJson()..remove('pin'),
      'sources': srcs,
      'favorites': [for (final f in favorites.values) f.toJson()],
      'history': [for (final h in history) h.toJson()],
      'reminders': [for (final r in reminders) r.toJson()],
      'profiles': [for (final p in profiles) p.toJson()],
      'intro': intro,
      'alerts': alertWords,
    });
  }

  /// يستعيد نسخة احتياطية (دمج: لا يحذف ما هو موجود). يعيد عدد القوائم المستعادة.
  Future<int> importBackup(String text) async {
    final j = jsonDecode(text);
    if (j is! Map || j['app'] != 'bushra') throw const FormatException('not a bushra backup');
    final pin = settings.parentalPin;
    settings.load(Map<String, dynamic>.from(j['settings'] ?? {}));
    settings.parentalPin = pin;
    _settingsBox.put('s', settings.toJson());
    var n = 0;
    for (final e in (j['sources'] as List? ?? const [])) {
      final src = Source.fromJson(Map<String, dynamic>.from(e['source']));
      sources[src.id] = src;
      await _saveSecret(src.id, SourceSecret.fromJson(Map<String, dynamic>.from(e['secret'] ?? {})));
      if (e['channels'] != null) {
        _channels[src.id] = [for (final c in e['channels'] as List) Channel.fromJson(Map<String, dynamic>.from(c))];
        await _channelsBox.put(src.id, jsonEncode(e['channels']));
      }
      n++;
    }
    _persistSources();
    for (final f in (j['favorites'] as List? ?? const [])) {
      final c = Channel.fromJson(Map<String, dynamic>.from(f));
      favorites.putIfAbsent(c.id, () => c);
    }
    _saveFavs();
    for (final p in (j['profiles'] as List? ?? const [])) {
      final pr = Profile.fromJson(Map<String, dynamic>.from(p));
      if (!profiles.any((x) => x.id == pr.id)) profiles.add(pr);
    }
    _saveProfiles();
    intro.addAll(Map<String, int>.from(j['intro'] ?? const {}));
    _userBox.put('intro', intro);
    for (final w in (j['alerts'] as List? ?? const [])) {
      if (!alertWords.contains(w)) alertWords.add('$w');
    }
    _userBox.put('alerts', alertWords);
    for (final h in (j['history'] as List? ?? const [])) {
      final e = HistoryEntry.fromJson(Map<String, dynamic>.from(h));
      if (historyOf(e.item.key) == null) history.add(e);
    }
    history.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    _saveHistory();
    for (final r in (j['reminders'] as List? ?? const [])) {
      final rem = Reminder.fromJson(Map<String, dynamic>.from(r));
      if (rem.start.isAfter(DateTime.now()) && !reminders.any((x) => x.id == rem.id)) {
        reminders.add(rem);
        unawaited(Reminders.schedule(rem));
      }
    }
    _saveReminders();
    Net.corsProxy = settings.corsProxy;
    notifyListeners();
    // نعيد تحميل قنوات القوائم والحسابات من مصادرها
    for (final src in sources.values) {
      if (src.type != SourceType.m3uFile && channelsOf(src.id).isEmpty) unawaited(refresh(src.id).catchError((_) {}));
    }
    return n;
  }

  // ———————————————————— الملفات الشخصية ————————————————————
  String _pk(String base) => '$base@${profile.id}';

  void _initProfiles() {
    for (final v in (_userBox.get('profiles', defaultValue: const []) as List)) {
      profiles.add(Profile.fromJson(Map<String, dynamic>.from(jsonDecode(v))));
    }
    if (profiles.isEmpty) {
      profiles.add(Profile(id: 'p0', name: 'أنا', avatar: 0));
      // بيانات ما قبل الملفات الشخصية تنتقل إلى الملف الأول
      for (final k in ['fav', 'history']) {
        if (_userBox.containsKey(k)) {
          _userBox.put('$k@p0', _userBox.get(k));
          _userBox.delete(k);
        }
      }
      _saveProfiles();
    }
    final cur = _userBox.get('curProfile');
    profile = profiles.firstWhere((p) => p.id == cur, orElse: () => profiles.first);
  }

  void _saveProfiles() => _userBox.put('profiles', [for (final p in profiles) jsonEncode(p.toJson())]);

  void _loadProfileData() {
    favorites.clear();
    history.clear();
    watchLog.clear();
    for (final v in (_userBox.get(_pk('fav'), defaultValue: const []) as List)) {
      final c = Channel.fromJson(Map<String, dynamic>.from(jsonDecode(v)));
      favorites[c.id] = c;
    }
    // المفضلة نسخ محفوظة؛ نحدّثها من القوائم الحالية (لتطابق التصنيف الجديد)
    for (final id in favorites.keys.toList()) {
      for (final l in _channels.values) {
        final i = l.indexWhere((c) => c.id == id);
        if (i >= 0) { favorites[id] = l[i]; break; }
      }
    }
    for (final v in (_userBox.get(_pk('history'), defaultValue: const []) as List)) {
      history.add(HistoryEntry.fromJson(Map<String, dynamic>.from(jsonDecode(v))));
    }
    for (final v in (_userBox.get(_pk('log'), defaultValue: const []) as List)) {
      final i = '$v'.indexOf('|');
      if (i > 0) watchLog.add((DateTime.fromMillisecondsSinceEpoch(int.parse('$v'.substring(0, i))), '$v'.substring(i + 1)));
    }
  }

  void selectProfile(Profile p) {
    profile = p;
    profileChosen = true;
    parentalUnlocked = false;
    _userBox.put('curProfile', p.id);
    _loadProfileData();
    notifyListeners();
    onUserData?.call();
  }

  Profile addProfile(String name, {int avatar = 0, String? image, bool kids = false}) {
    final p = Profile(id: 'p${DateTime.now().millisecondsSinceEpoch.toRadixString(36)}', name: name, avatar: avatar, image: image, kids: kids);
    profiles.add(p);
    _saveProfiles();
    notifyListeners();
    return p;
  }

  void saveProfile(Profile p) {
    _saveProfiles();
    notifyListeners();
  }

  void deleteProfile(Profile p) {
    if (profiles.length < 2) return;
    profiles.removeWhere((x) => x.id == p.id);
    for (final k in ['fav', 'history', 'log']) {
      _userBox.delete('$k@${p.id}');
    }
    _saveProfiles();
    if (profile.id == p.id) {
      selectProfile(profiles.first);
    } else {
      notifyListeners();
    }
  }

  static const _adultWords = ['adult', 'xxx', '18+', '+18', 'porn', 'erotic', 'sexy', 'playboy', 'hustler', 'brazzers',
    'nsfw', 'penthouse', 'dorcel', 'redlight', 'للكبار', 'كبار فقط', 'إباحي', 'اباحي', 'جنسي'];
  static const _kidsWords = ['kid', 'cartoon', 'toon', 'anime', 'disney', 'nick', 'baby', 'junior', 'children', 'family',
    'boomerang', 'cbeebies', 'spacetoon', 'أطفال', 'اطفال', 'كرتون', 'انمي', 'أنمي', 'ديزني', 'سبيستون', 'سبيس تون',
    'براعم', 'ماجد', 'جيم', 'عائل', 'نيكلودين', 'بوميرانج'];

  static bool _hasWord(String text, List<String> words) {
    final t = text.toLowerCase();
    return words.any(t.contains);
  }

  static bool isAdultContent(Channel c) => _hasWord(c.group, _adultWords) || _hasWord(c.name, _adultWords);
  static bool isKidsContent(Channel c) => _hasWord(c.group, _kidsWords) || _hasWord(c.name, _kidsWords);

  // ———————————————————— المقدمة ————————————————————
  int? introOf(String? seriesId) => seriesId == null ? null : intro[seriesId];

  void setIntro(String seriesId, int? secs) {
    if (secs == null) {
      intro.remove(seriesId);
    } else {
      intro[seriesId] = secs;
    }
    _userBox.put('intro', intro);
    notifyListeners();
  }

  // ———————————————————— التنبيهات الذكية ————————————————————
  void setAlertWords(List<String> words) {
    alertWords
      ..clear()
      ..addAll(words);
    _userBox.put('alerts', alertWords);
    notifyListeners();
    unawaited(scheduleAlerts());
  }

  /// البرامج القادمة في الدليل التي تطابق كلمات التنبيه (مرتبة بالوقت، بلا تكرار للبرنامج نفسه).
  List<(Channel, EpgProgram, String)> alertMatches({int limit = 80}) {
    final keys = [for (final w in alertWords) (w, normalize(w))].where((k) => k.$2.length >= 2).toList();
    if (keys.isEmpty) return const [];
    final now = DateTime.now();
    final out = <(Channel, EpgProgram, String)>[];
    final seen = <String>{};
    for (final c in allChannels) {
      if (!c.isLive || c.tvgId == null || _hidden(c)) continue;
      for (final p in programsOf(c.tvgId)) {
        if (!p.stop.isAfter(now)) continue;
        final t = normalize(p.title);
        for (final (word, k) in keys) {
          if (t.contains(k)) {
            if (seen.add('${t}_${p.start.millisecondsSinceEpoch}')) out.add((c, p, word));
            break;
          }
        }
      }
    }
    out.sort((a, b) => a.$2.start.compareTo(b.$2.start));
    return out.take(limit).toList();
  }

  bool _scheduling = false;
  /// يضبط تذكيرات تلقائية للمطابقات القادمة (حتى 30 تذكيرًا، ولا يعيد ما ألغاه المستخدم).
  Future<int> scheduleAlerts() async {
    if (alertWords.isEmpty || _scheduling) return 0;
    _scheduling = true;
    var added = 0;
    try {
      final now = DateTime.now();
      var n = reminders.where((r) => r.auto && r.start.isAfter(now)).length;
      for (final (c, p, _) in alertMatches()) {
        if (n >= 30) break;
        if (!p.start.isAfter(now.add(const Duration(minutes: 2)))) continue;
        final id = Reminder.idFor(c.id, p.start);
        if (_dismissedAuto.contains(id) || reminders.any((r) => r.id == id || (r.title == p.title && r.start == p.start))) continue;
        await addReminder(c, p, auto: true);
        n++;
        added++;
      }
    } finally {
      _scheduling = false;
    }
    return added;
  }

  // ———————————————————— الروابط البديلة ————————————————————
  Map<String, List<Channel>>? _alt;
  void _altReset() => _alt = null;

  Map<String, List<Channel>> _buildAlt() {
    final m = <String, List<Channel>>{};
    for (final c in [...allChannels, ...openChannels]) {
      if (!c.isLive) continue;
      final k = epgNameKey(c.name);
      if (k.length >= 3) (m['n:$k'] ??= []).add(c);
      final t = c.tvgId?.trim().toLowerCase();
      if (t != null && t.isNotEmpty) (m['t:$t'] ??= []).add(c);
    }
    return m;
  }

  /// نسخ أخرى من القناة نفسها في قوائمك الأخرى أو في القنوات المفتوحة (بالاسم أو بمعرّف الدليل).
  List<Channel> alternatesFor(Channel c) {
    if (!c.isLive) return const [];
    final idx = _alt ??= _buildAlt();
    final ids = <String>{c.id}, urls = <String>{c.url};
    final out = <Channel>[];
    void add(List<Channel>? l) {
      for (final x in l ?? const <Channel>[]) {
        if (ids.add(x.id) && urls.add(x.url) && !_hidden(x)) out.add(x);
      }
    }
    final t = c.tvgId?.trim().toLowerCase();
    if (t != null && t.isNotEmpty) add(idx['t:$t']);
    final k = epgNameKey(c.name);
    if (k.length >= 3) add(idx['n:$k']);
    int rank(Channel x) => (isBroken(x.id) ? 2 : 0) + (x.sourceId == OpenChannels.sourceId ? 1 : 0);
    out.sort((a, b) => rank(a).compareTo(rank(b)));
    return out;
  }

  // ———————————————————— البحث ————————————————————
  ({List<Channel> channels, List<(Channel, EpgProgram)> programs, List<Source> lists, List<LocalVideo> local}) search(String q) {
    final qs = expand(q);
    if (qs.first.isEmpty) return (channels: const [], programs: const [], lists: const [], local: const []);
    final scored = <(int, Channel)>[];
    final progs = <(Channel, EpgProgram)>[];
    final now = DateTime.now();
    for (final c in allChannels) {
      if (_hidden(c)) continue;
      var sc = score(normalize(c.name), qs);
      if (c.altName != null) sc = sc > score(normalize(c.altName!), qs) ? sc : score(normalize(c.altName!), qs);
      final g = score(normalize(c.group), qs) ~/ 2;
      if (g > sc) sc = g;
      if (sc > 0) scored.add((sc + (c.isLive ? 5 : 0), c));
      if (c.tvgId != null && progs.length < 30) {
        for (final p in programsOf(c.tvgId)) {
          if (p.stop.isAfter(now) && p.start.isBefore(now.add(const Duration(hours: 6))) && score(normalize(p.title), qs) > 0) {
            progs.add((c, p));
            break;
          }
        }
      }
    }
    if (scored.length < 120) {
      for (final c in openChannels) {
        if (_hidden(c)) continue;
        final sc = score(normalize(c.name), qs);
        if (sc > 0) scored.add((sc - 10, c));
      }
    }
    scored.sort((a, b) => b.$1.compareTo(a.$1));
    return (
      channels: scored.take(120).map((e) => e.$2).toList(),
      programs: progs,
      lists: sources.values.where((s) => score(normalize(s.name), qs) > 0).toList(),
      local: localVideos.where((v) => score(normalize(v.name), qs) > 0).toList(),
    );
  }
}

/// يستخرج (الخادم، المستخدم، كلمة المرور) من روابط المزودين get.php أو player_api.php.
(String, String, String)? xtreamFromUrl(String url) {
  final u = Uri.tryParse(url.trim());
  if (u == null || !u.hasScheme) return null;
  final q = u.queryParameters;
  final user = q['username'], pass = q['password'];
  if (user == null || pass == null || user.isEmpty) return null;
  if (!RegExp(r'/(get|player_api|panel_api)\.php$').hasMatch(u.path)) return null;
  return ('${u.scheme}://${u.host}${u.hasPort ? ':${u.port}' : ''}', user, pass);
}

/// رابط دليل محتمل على نفس خادم القائمة حين لا تذكر القائمة دليلها.
String? guessEpgUrl(String url) {
  final u = Uri.tryParse(url.trim());
  if (u == null || !u.hasScheme) return null;
  final q = u.queryParameters;
  final origin = '${u.scheme}://${u.host}${u.hasPort ? ':${u.port}' : ''}';
  if (q['username'] != null && q['password'] != null) {
    return '$origin/xmltv.php?username=${Uri.encodeComponent(q['username']!)}&password=${Uri.encodeComponent(q['password']!)}';
  }
  return null;
}
