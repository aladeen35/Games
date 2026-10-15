import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'core/theme.dart';
import 'data/store.dart';
import 'screens/onboarding.dart';
import 'screens/shell.dart';
import 'widgets/backdrop.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent, systemNavigationBarColor: BColors.midnight950,
  ));
  await AppStore.I.init();
  runApp(const BushraApp());
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
