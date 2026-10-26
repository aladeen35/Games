import 'dart:ui' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme.dart';
import 'data/models.dart';
import 'data/reminders.dart';
import 'data/store.dart';
import 'platform/platform.dart' as plat;
import 'player/mini_player.dart';
import 'player/player_screen.dart';
import 'player/session.dart';
import 'screens/onboarding.dart';
import 'screens/profiles.dart';
import 'screens/series.dart';
import 'platform/tv_home.dart';
import 'dart:async';
import 'screens/shell.dart';
import 'widgets/backdrop.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent, systemNavigationBarColor: BColors.midnight950,
  ));
  // الواجهة بالطول على الهاتف؛ المشغل وحده يدور للعرض
  await plat.appOrientation();
  Reminders.onFire = _onReminder;
  Reminders.onOpen = _openChannelById;
  await AppStore.I.init();
  AppStore.onUserData = TvHome.schedule;
  runApp(const BushraApp());
  unawaited(TvHome.init(_openKey));
}

/// فتح عنصر من الشاشة الرئيسية لـ Android TV (تابع المشاهدة أو المفضلة).
void _openKey(String key) {
  final s = AppStore.I;
  if (!s.profileChosen && s.profile.pin == null) {
    s.profileChosen = true;
    s.notifyListeners();
  }
  WidgetsBinding.instance.addPostFrameCallback((_) {
    final ctx = navigatorKey.currentContext;
    if (ctx == null) return;
    final h = s.historyOf(key);
    if (h != null) {
      openPlayer(ctx, h.item);
      return;
    }
    final c = s.channelById(key);
    if (c != null) openChannel(ctx, c, [c]);
  });
}

final navigatorKey = GlobalKey<NavigatorState>();
final messengerKey = GlobalKey<ScaffoldMessengerState>();

void _openChannelById(String id) {
  final c = AppStore.I.channelById(id);
  final ctx = navigatorKey.currentContext;
  if (c == null || ctx == null) return;
  openPlayer(ctx, Playable.channel(c));
}

void _expandMini() {
  final ctx = navigatorKey.currentContext;
  final ss = PlayerSession.I;
  if (ctx == null || ss.item == null) return;
  openPlayer(ctx, ss.item!, queue: ss.queue);
}

/// لافتة داخل التطبيق حين يحين وقت تذكير والتطبيق مفتوح.
void _onReminder(Reminder r) {
  final m = messengerKey.currentState;
  if (m == null) return;
  m.clearMaterialBanners();
  m.showMaterialBanner(MaterialBanner(
    leading: const Icon(Icons.notifications_active_rounded, color: BColors.gold),
    content: Text('يبدأ قريبًا: ${r.title} — ${r.channelName}'),
    actions: [
      TextButton(onPressed: m.clearMaterialBanners, child: const Text('لاحقًا')),
      FilledButton(onPressed: () { m.clearMaterialBanners(); _openChannelById(r.channelId); }, child: const Text('شاهد الآن')),
    ],
  ));
}

class BushraApp extends StatelessWidget {
  const BushraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppStore.I,
      builder: (context, _) {
        final st = AppStore.I.settings;
        BPalette dark = st.cinematic ? BPalette.cinematicP : BPalette.darkP, light = BPalette.lightP;
        if (st.highContrast) {
          dark = dark.highContrast();
          light = light.highContrast();
        }
        return MaterialApp(
          title: 'البشرى',
          navigatorKey: navigatorKey,
          scaffoldMessengerKey: messengerKey,
          debugShowCheckedModeBanner: false,
          locale: const Locale('ar'),
          supportedLocales: const [Locale('ar'), Locale('en')],
          localizationsDelegates: GlobalMaterialLocalizations.delegates,
          themeMode: st.theme,
          scrollBehavior: const _BushraScroll(),
          theme: buildTheme(light),
          darkTheme: buildTheme(dark),
          shortcuts: {
            ...WidgetsApp.defaultShortcuts,
            // زر OK في ريموت التلفاز
            const SingleActivator(LogicalKeyboardKey.select): const ActivateIntent(),
          },
          builder: (context, child) => MediaQuery(
            data: MediaQuery.of(context).copyWith(
              textScaler: TextScaler.linear(st.textScale),
              disableAnimations: st.reduceMotion,
            ),
            // النافذة المصغرة تطفو فوق كل الصفحات أثناء التصفح
            child: Backdrop(child: Stack(children: [child!, MiniPlayer(onExpand: _expandMini)])),
          ),
          home: const _Root(),
        );
      },
    );
  }
}

class _Root extends StatefulWidget {
  const _Root();
  @override
  State<_Root> createState() => _RootState();
}

class _RootState extends State<_Root> {
  int _screen = -1;

  int get _which {
    final s = AppStore.I;
    if (!s.settings.onboarded && s.sources.isEmpty) return 0;
    if (!s.profileChosen && (s.settings.askProfile || s.profile.pin != null)) return 1;
    return 2;
  }

  void _onStore() {
    if (_which != _screen && mounted) setState(() {});
  }

  @override
  void initState() {
    super.initState();
    AppStore.I.addListener(_onStore);
  }

  @override
  void dispose() {
    AppStore.I.removeListener(_onStore);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // من أنهى الترحيب الآن لا يُسأل «من يشاهد؟» في الجلسة نفسها
    if (_screen == 0 && _which == 1) AppStore.I.profileChosen = true;
    _screen = _which;
    final s = AppStore.I;
    if (!s.settings.onboarded && s.sources.isEmpty) return Onboarding(onDone: () => setState(() {}));
    // «من يشاهد الآن؟» عند الفتح (أو إن كان الملف الأخير مقفلًا برمز)
    if (!s.profileChosen && (s.settings.askProfile || s.profile.pin != null)) {
      return ProfilesScreen(root: true, onChosen: () => setState(() {}));
    }
    return Shell(key: Shell.globalKey);
  }
}

/// تمرير ناعم بارتداد مثل Apple TV في كل المنصات، والسحب بالفأرة للصفوف الأفقية على الويب.
class _BushraScroll extends MaterialScrollBehavior {
  const _BushraScroll();
  @override
  Set<PointerDeviceKind> get dragDevices =>
      {PointerDeviceKind.touch, PointerDeviceKind.mouse, PointerDeviceKind.trackpad, PointerDeviceKind.stylus};
  @override
  ScrollPhysics getScrollPhysics(BuildContext context) => const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics());
}
