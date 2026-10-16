import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme.dart';
import 'data/models.dart';
import 'data/reminders.dart';
import 'data/store.dart';
import 'platform/platform.dart' as plat;
import 'player/player_screen.dart';
import 'screens/onboarding.dart';
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
  runApp(const BushraApp());
}

final navigatorKey = GlobalKey<NavigatorState>();
final messengerKey = GlobalKey<ScaffoldMessengerState>();

void _openChannelById(String id) {
  final c = AppStore.I.channelById(id);
  final ctx = navigatorKey.currentContext;
  if (c == null || ctx == null) return;
  openPlayer(ctx, Playable.channel(c));
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
            child: Backdrop(child: child!),
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
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    if (!s.settings.onboarded && s.sources.isEmpty) return Onboarding(onDone: () => setState(() {}));
    return Shell(key: Shell.globalKey);
  }
}
