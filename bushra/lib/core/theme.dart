import 'package:flutter/material.dart';

/// لوحة ألوان «البشرى»: ضوء دافئ يخرج من مساحة داكنة.
/// الفيروزي = الحركة والإجراء، الذهبي = التمييز فقط (لا يُستخدم زرًّا رئيسيًا).
class BColors {
  // الوضع الداكن (الافتراضي)
  static const midnight950 = Color(0xFF080B12);
  static const midnight900 = Color(0xFF0D111A);
  static const surface = Color(0xFF111722);
  static const surfaceContainer = Color(0xFF171F2C);
  static const surfaceElevated = Color(0xFF202B3A);
  static const surfaceHighlight = Color(0xFF29384A);
  static const pearl = Color(0xFFF5F7FA);
  static const mist = Color(0xFFB8C2D1);
  static const muted = Color(0xFF7F8A9A);
  static const teal = Color(0xFF27D3C2);
  static const tealDeep = Color(0xFF0D8F8A);
  static const gold = Color(0xFFF2B84B);
  static const red = Color(0xFFFF5F6D);
  static const green = Color(0xFF58D68D);

  // الوضع الفاتح (ليس انعكاسًا آليًا)
  static const lightBg = Color(0xFFF5F7FA);
  static const lightSurface = Color(0xFFFFFFFF);
  static const lightText = Color(0xFF101722);
  static const lightTeal = Color(0xFF087B78);
  static const lightBorder = Color(0xFFDCE3EB);
  static const lightMist = Color(0xFF4A5566);
  static const lightGold = Color(0xFFB27A12);
}

/// ألوان دلالية تتبدّل بين الوضعين، يصل إليها أي عنصر عبر `context.bc`.
@immutable
class BPalette extends ThemeExtension<BPalette> {
  final Color bg, bgDeep, surface, container, elevated, highlight;
  final Color text, text2, text3, accent, accentDeep, gold, danger, live, border;
  final bool dark;
  /// النمط السينمائي البديل: زجاج متوهج، أزرار ذهبية، شريط ضوئي في الخلفية.
  final bool cinematic;
  const BPalette({
    required this.bg, required this.bgDeep, required this.surface, required this.container,
    required this.elevated, required this.highlight, required this.text, required this.text2,
    required this.text3, required this.accent, required this.accentDeep, required this.gold,
    required this.danger, required this.live, required this.border, required this.dark,
    this.cinematic = false,
  });

  static const darkP = BPalette(
    bg: BColors.midnight900, bgDeep: BColors.midnight950, surface: BColors.surface,
    container: BColors.surfaceContainer, elevated: BColors.surfaceElevated,
    highlight: BColors.surfaceHighlight, text: BColors.pearl, text2: BColors.mist,
    text3: BColors.muted, accent: BColors.teal, accentDeep: BColors.tealDeep, gold: BColors.gold,
    danger: BColors.red, live: BColors.green, border: Color(0x14FFFFFF), dark: true,
  );

  static const lightP = BPalette(
    bg: BColors.lightBg, bgDeep: Color(0xFFE9EEF4), surface: BColors.lightSurface,
    container: BColors.lightSurface, elevated: BColors.lightSurface, highlight: Color(0xFFE3F4F3),
    text: BColors.lightText, text2: BColors.lightMist, text3: Color(0xFF6B7686),
    accent: BColors.lightTeal, accentDeep: Color(0xFF05605E), gold: BColors.lightGold,
    danger: Color(0xFFD63445), live: Color(0xFF1E9E55), border: BColors.lightBorder, dark: false,
  );

  static const cinematicP = BPalette(
    bg: Color(0xFF06101A), bgDeep: Color(0xFF040A12), surface: Color(0xFF0A1824),
    container: Color(0xE60D1E2C), elevated: Color(0xFF10212F), highlight: Color(0xFF15334A),
    text: BColors.pearl, text2: Color(0xFFB4C4D4), text3: Color(0xFF7D93A8),
    accent: Color(0xFF2EE6D6), accentDeep: BColors.tealDeep, gold: Color(0xFFF7C04F),
    danger: BColors.red, live: BColors.green, border: Color(0x2E2EE6D6), dark: true, cinematic: true,
  );

  /// وضع «تباين أعلى» من الإعدادات.
  BPalette highContrast() => BPalette(
    bg: dark ? BColors.midnight950 : Colors.white, bgDeep: bgDeep, surface: surface,
    container: container, elevated: elevated, highlight: highlight,
    text: dark ? Colors.white : Colors.black, text2: dark ? BColors.pearl : BColors.lightText,
    text3: dark ? BColors.mist : BColors.lightMist, accent: accent, accentDeep: accentDeep,
    gold: gold, danger: danger, live: live,
    border: dark ? const Color(0x40FFFFFF) : const Color(0xFF9AA6B5), dark: dark, cinematic: cinematic,
  );

  @override
  BPalette copyWith() => this;
  @override
  BPalette lerp(ThemeExtension<BPalette>? other, double t) => t < .5 ? this : (other as BPalette? ?? this);
}

extension BCtx on BuildContext {
  BPalette get bc => Theme.of(this).extension<BPalette>()!;
  bool get isTv => MediaQuery.sizeOf(this).width >= 1100;
  bool get isWide => MediaQuery.sizeOf(this).width >= 760;
}

class BRadius {
  static const card = 16.0, button = 12.0, player = 20.0, dialog = 24.0;
}

class BMotion {
  static const page = Duration(milliseconds: 220);
  static const fast = Duration(milliseconds: 160);
}

const kFont = 'Plex';

ThemeData buildTheme(BPalette p) {
  final base = p.dark ? ThemeData.dark(useMaterial3: true) : ThemeData.light(useMaterial3: true);
  final scheme = ColorScheme(
    brightness: p.dark ? Brightness.dark : Brightness.light,
    primary: p.accent, onPrimary: p.dark ? BColors.midnight950 : Colors.white,
    secondary: p.gold, onSecondary: BColors.midnight950,
    error: p.danger, onError: Colors.white,
    surface: p.surface, onSurface: p.text,
    surfaceContainerLowest: p.bgDeep, surfaceContainerLow: p.bg,
    surfaceContainer: p.container, surfaceContainerHigh: p.elevated,
    surfaceContainerHighest: p.highlight, onSurfaceVariant: p.text2,
    outline: p.border, outlineVariant: p.border,
  );
  TextStyle s(double size, FontWeight w, Color c, [double h = 1.4]) =>
      TextStyle(fontFamily: kFont, fontSize: size, fontWeight: w, color: c, height: h);
  final text = TextTheme(
    displaySmall: s(30, FontWeight.w700, p.text, 1.25),
    headlineMedium: s(24, FontWeight.w700, p.text, 1.3),
    headlineSmall: s(20, FontWeight.w600, p.text, 1.3),
    titleLarge: s(18, FontWeight.w600, p.text),
    titleMedium: s(15, FontWeight.w600, p.text),
    titleSmall: s(14, FontWeight.w500, p.text),
    bodyLarge: s(15, FontWeight.w400, p.text),
    bodyMedium: s(14, FontWeight.w400, p.text2),
    bodySmall: s(12.5, FontWeight.w400, p.text3),
    labelLarge: s(14, FontWeight.w600, p.text),
    labelMedium: s(12.5, FontWeight.w500, p.text2),
    labelSmall: s(11, FontWeight.w500, p.text3),
  );
  return base.copyWith(
    colorScheme: scheme,
    scaffoldBackgroundColor: p.cinematic ? Colors.transparent : p.bg,
    canvasColor: p.bg,
    textTheme: text,
    extensions: [p],
    splashFactory: InkSparkle.splashFactory,
    focusColor: p.accent.withValues(alpha: .14),
    hoverColor: p.accent.withValues(alpha: .06),
    dividerTheme: DividerThemeData(color: p.border, thickness: 1, space: 1),
    iconTheme: IconThemeData(color: p.text2, size: 22),
    appBarTheme: AppBarTheme(
      backgroundColor: p.cinematic ? Colors.transparent : p.bg, surfaceTintColor: Colors.transparent, elevation: 0,
      titleTextStyle: text.titleLarge, foregroundColor: p.text, centerTitle: false,
    ),
    filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(
      backgroundColor: p.cinematic ? p.gold : p.accent, foregroundColor: p.dark ? BColors.midnight950 : Colors.white,
      elevation: p.cinematic ? 6 : 0, shadowColor: p.cinematic ? p.gold.withValues(alpha: .45) : null,
      minimumSize: const Size(44, 48), padding: const EdgeInsets.symmetric(horizontal: 20),
      textStyle: text.labelLarge,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.button)),
    )),
    outlinedButtonTheme: OutlinedButtonThemeData(style: OutlinedButton.styleFrom(
      foregroundColor: p.text, side: BorderSide(color: p.cinematic ? p.accent.withValues(alpha: .45) : p.border, width: 1.2),
      backgroundColor: p.cinematic ? const Color(0x3315334A) : null,
      minimumSize: const Size(44, 48), padding: const EdgeInsets.symmetric(horizontal: 18),
      textStyle: text.labelLarge,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.button)),
    )),
    textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(
      foregroundColor: p.accent, minimumSize: const Size(44, 44), textStyle: text.labelLarge,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.button)),
    )),
    iconButtonTheme: IconButtonThemeData(style: IconButton.styleFrom(
      minimumSize: const Size(44, 44), foregroundColor: p.text2,
    )),
    inputDecorationTheme: InputDecorationTheme(
      filled: true, fillColor: p.dark ? p.container : p.bg,
      hintStyle: text.bodyMedium?.copyWith(color: p.text3),
      labelStyle: text.bodyMedium,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(BRadius.button), borderSide: BorderSide.none),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(BRadius.button),
          borderSide: BorderSide(color: p.dark ? Colors.transparent : p.border)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(BRadius.button),
          borderSide: BorderSide(color: p.accent, width: 2)),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: p.container, selectedColor: p.accent.withValues(alpha: .16),
      labelStyle: text.labelMedium, side: BorderSide(color: p.border),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
    ),
    dialogTheme: DialogThemeData(
      backgroundColor: p.elevated, surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.dialog)),
      titleTextStyle: text.titleLarge, contentTextStyle: text.bodyMedium,
    ),
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: p.elevated, surfaceTintColor: Colors.transparent, showDragHandle: true,
      dragHandleColor: p.text3,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(BRadius.dialog))),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: p.elevated, contentTextStyle: text.bodyLarge, behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.button)),
    ),
    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? (p.dark ? BColors.midnight950 : Colors.white) : p.text3),
      trackColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? p.accent : p.highlight),
      trackOutlineColor: WidgetStateProperty.all(Colors.transparent),
    ),
    sliderTheme: SliderThemeData(
      activeTrackColor: p.accent, inactiveTrackColor: p.text3.withValues(alpha: .35),
      thumbColor: p.accent, overlayColor: p.accent.withValues(alpha: .15), trackHeight: 3,
    ),
    progressIndicatorTheme: ProgressIndicatorThemeData(color: p.accent, linearTrackColor: p.highlight),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: p.cinematic ? const Color(0xF0050C14) : (p.dark ? BColors.midnight950 : Colors.white),
      indicatorColor: p.accent.withValues(alpha: .16), surfaceTintColor: Colors.transparent, height: 68,
      labelTextStyle: WidgetStateProperty.resolveWith((s) => text.labelMedium!.copyWith(
          color: s.contains(WidgetState.selected) ? p.text : p.text3)),
      iconTheme: WidgetStateProperty.resolveWith((s) => IconThemeData(
          color: s.contains(WidgetState.selected) ? p.accent : p.text3, size: 24)),
    ),
    navigationRailTheme: NavigationRailThemeData(
      backgroundColor: p.dark ? BColors.midnight950 : Colors.white,
      indicatorColor: p.accent.withValues(alpha: .16),
      selectedIconTheme: IconThemeData(color: p.accent, size: 26),
      unselectedIconTheme: IconThemeData(color: p.text3, size: 26),
      selectedLabelTextStyle: text.labelMedium!.copyWith(color: p.text),
      unselectedLabelTextStyle: text.labelMedium!.copyWith(color: p.text3),
    ),
    popupMenuTheme: PopupMenuThemeData(
      color: p.elevated, surfaceTintColor: Colors.transparent, textStyle: text.bodyLarge,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(BRadius.card)),
    ),
    pageTransitionsTheme: const PageTransitionsTheme(builders: {
      TargetPlatform.android: FadeForwardsPageTransitionsBuilder(),
      TargetPlatform.iOS: FadeForwardsPageTransitionsBuilder(),
    }),
  );
}
