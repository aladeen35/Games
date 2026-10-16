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
  bool cinematic = false;

  Map<String, dynamic> toJson() => {
        'theme': theme.index, 'hc': highContrast, 'rm': reduceMotion, 'orig': showOriginalNames,
        'ts': textScale, 'fill': fillScreen, 'resume': resume, 'reconnect': autoReconnect,
        'next': autoplayNext, 'info': showStreamInfo, 'audio': preferredAudio, 'sub': subtitleScale,
        'subBg': subtitleBackground, 'pin': parentalPin, 'locked': lockedGroups.toList(),
        'cors': corsProxy, 'onb': onboarded, 'cine': cinematic,
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
    cinematic = j['cine'] ?? false;
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
    for (final v in (_userBox.get('fav', defaultValue: const []) as List)) {
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
    for (final v in (_userBox.get('history', defaultValue: const []) as List)) {
      history.add(HistoryEntry.fromJson(Map<String, dynamic>.from(jsonDecode(v))));
    }
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
    for (final v in (_userBox.get('reminders', defaultValue: const []) as List)) {
      final r = Reminder.fromJson(Map<String, dynamic>.from(jsonDecode(v)));
      if (r.start.isAfter(DateTime.now().subtract(const Duration(minutes: 30)))) reminders.add(r);
    }
    ready = true;
    notifyListeners();
    unawaited(Reminders.init(reminders));
    // تحديث مجدول في الخلفية للقوائم القديمة، مع الإبقاء على آخر نسخة ناجحة
    Future.delayed(const Duration(seconds: 3), _autoRefresh);
  }

  void _autoRefresh() {
    for (final s in sources.values) {
      final age = s.lastUpdated == null ? null : DateTime.now().difference(s.lastUpdated!);
      if (s.type != SourceType.m3uFile && s.autoRefreshHours > 0 && (age == null || age.inHours >= s.autoRefreshHours)) {
        refresh(s.id).catchError((_) {});
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

  List<Channel> visible({ChannelKind? kind, String? sourceId}) {
    final base = sourceId == null ? allChannels : channelsOf(sourceId);
    return [for (final c in base) if ((kind == null || c.kind == kind) && !isLocked(c)) c];
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

  List<Channel> visibleOpen() => [for (final c in openChannels) if (!isLocked(c)) c];

  // ———————————————————— التذكير بالبرامج ————————————————————
  Reminder? reminderFor(String channelId, DateTime start) {
    final id = Reminder.idFor(channelId, start);
    for (final r in reminders) {
      if (r.id == id) return r;
    }
    return null;
  }

  Future<bool> addReminder(Channel c, EpgProgram p) async {
    final r = Reminder(id: Reminder.idFor(c.id, p.start), channelId: c.id, channelName: c.name, title: p.title, start: p.start, logo: c.logo);
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
    SourceSecret secret;
    String host;
    switch (type) {
      case SourceType.m3uUrl:
        final text = await Net.text(url!);
        sw.stop();
        final r = await _parse(text, id);
        chans = r.channels; epg = r.epgUrl;
        secret = SourceSecret(url: url.trim());
        host = Net.safeHost(url);
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
      type: type, displayHost: host, epgUrl: epg, lastUpdated: DateTime.now(),
      liveCount: live, vodCount: chans.length - live,
      groups: groupsOf(chans).map((e) => e.key).toList(),
      hasLogos: chans.any((c) => c.logo != null), hasEpg: epg != null || chans.any((c) => c.tvgId != null),
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
        ..epgUrl = s.epgUrl ?? p.source.epgUrl;
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
      final ids = {for (final c in channelsOf(id)) if (c.tvgId != null) c.tvgId!}.toList();
      final text = await Net.text(s.epgUrl!, timeout: const Duration(seconds: 90));
      final progs = await compute(parseXmltv, {'text': text, 'ids': ids});
      await _epgBox.put(id, jsonEncode([for (final p in progs) p.toJson()]));
      for (final tid in ids) {
        _epg.remove(tid);
      }
      _indexEpg(progs);
      s.hasEpg = progs.isNotEmpty;
      _persistSources();
    } catch (e) {
      epgError = e is NetError ? e.message : 'تعذر تحميل دليل البرامج';
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
    _userBox.put('fav', [for (final f in favorites.values) jsonEncode(f.toJson())]);
    notifyListeners();
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
    _userBox.put('history', [for (final h in history) jsonEncode(h.toJson())]);
    notifyListeners();
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

  // ———————————————————— البحث ————————————————————
  ({List<Channel> channels, List<(Channel, EpgProgram)> programs, List<Source> lists, List<LocalVideo> local}) search(String q) {
    final qs = expand(q);
    if (qs.first.isEmpty) return (channels: const [], programs: const [], lists: const [], local: const []);
    final scored = <(int, Channel)>[];
    final progs = <(Channel, EpgProgram)>[];
    final now = DateTime.now();
    for (final c in allChannels) {
      if (isLocked(c)) continue;
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
        if (isLocked(c)) continue;
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
