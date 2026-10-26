import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/models.dart';
import 'catalog.dart';
import 'continue.dart';
import '../data/store.dart';
import '../widgets/common.dart';
import 'epg_screen.dart';
import 'home.dart';
import 'library.dart';
import 'live.dart';
import 'search.dart';
import 'settings.dart';

/// التنقل: شريط سفلي من خمسة عناصر على الهاتف، وشريط جانبي ثابت (يمين) على اللوحي والتلفاز.
/// في النمط السينمائي يصبح الشريط الجانبي لوحة زجاجية بالشعار الكبير وعنصر نشط متوهج.
class Shell extends StatefulWidget {
  const Shell({super.key});
  static final globalKey = GlobalKey<_ShellState>();
  /// انتقال برمجي إلى قسم بمعرّفه (مع مجموعة اختيارية في البث المباشر).
  static void go(String id, {String? group}) => globalKey.currentState?._go(id, group: group);
  @override
  State<Shell> createState() => _ShellState();
}

class _Dest {
  final String id;
  final IconData icon, active;
  final String label;
  final bool phone;
  const _Dest(this.id, this.icon, this.active, this.label, {this.phone = false});
}

/// الشريط الثابت: الرئيسية، الأفلام، المسلسلات، البث المباشر، الدليل — ثم «قوائمي» (القوائم + ملفاتي).
const _all = [
  _Dest('home', Icons.home_outlined, Icons.home_rounded, 'الرئيسية', phone: true),
  _Dest('movies', Icons.movie_outlined, Icons.movie_rounded, 'الأفلام', phone: true),
  _Dest('series', Icons.theaters_outlined, Icons.theaters_rounded, 'المسلسلات', phone: true),
  _Dest('live', Icons.live_tv_outlined, Icons.live_tv_rounded, 'البث المباشر', phone: true),
  _Dest('epg', Icons.calendar_view_week_outlined, Icons.calendar_view_week_rounded, 'الدليل', phone: true),
  _Dest('library', Icons.video_library_outlined, Icons.video_library_rounded, 'قوائمي', phone: true),
  _Dest('continue', Icons.history_rounded, Icons.history_rounded, 'المتابعة'),
  _Dest('favorites', Icons.star_outline_rounded, Icons.star_rounded, 'المفضلة'),
  _Dest('settings', Icons.settings_outlined, Icons.settings_rounded, 'الإعدادات'),
];

class _ShellState extends State<Shell> {
  String current = 'home';
  final liveKey = GlobalKey<LiveScreenState>();

  int libraryTab = 0;

  void _go(String id, {String? group}) {
    // «قوائمي» و«ملفاتي» صارا تبويبين داخل قسم واحد
    if (id == 'lists' || id == 'local') {
      libraryTab = id == 'local' ? 1 : 0;
      id = 'library';
    }
    final phone = !context.isWide;
    if (phone && !_all.firstWhere((d) => d.id == id).phone) {
      // على الهاتف تُفتح الأقسام الإضافية كصفحات فوق الشريط السفلي
      Navigator.of(context).push(MaterialPageRoute(builder: (_) => Scaffold(
        appBar: AppBar(title: Text(_all.firstWhere((d) => d.id == id).label)),
        body: _page(id, standalone: true),
      )));
      return;
    }
    setState(() => current = id);
    if (group != null) WidgetsBinding.instance.addPostFrameCallback((_) => liveKey.currentState?.selectGroup(group));
  }

  Widget _page(String id, {bool standalone = false}) => switch (id) {
        'live' => LiveScreen(key: standalone ? null : liveKey),
        'movies' => const CatalogScreen(kind: ChannelKind.vod),
        'series' => const CatalogScreen(kind: ChannelKind.series),
        'epg' => const EpgScreen(),
        'continue' => const ContinueScreen(),
        'favorites' => const LiveScreen(initialGroup: '★'),
        'library' => LibraryScreen(key: ValueKey('lib$libraryTab'), initialTab: libraryTab),
        'settings' => const SettingsScreen(standalone: false),
        _ => const HomeScreen(),
      };

  @override
  Widget build(BuildContext context) {
    final wide = context.isWide;
    final p = context.bc;
    final dests = [for (final d in _all) if (wide || d.phone) d];
    if (!dests.any((d) => d.id == current)) current = 'home';
    final body = AnimatedSwitcher(
      duration: AppStore.I.settings.reduceMotion ? Duration.zero : BMotion.page,
      switchInCurve: Curves.easeOutCubic,
      transitionBuilder: (c, a) => FadeTransition(opacity: a,
          child: SlideTransition(position: Tween(begin: const Offset(0, .015), end: Offset.zero).animate(a), child: c)),
      child: KeyedSubtree(key: ValueKey(current), child: _page(current)),
    );
    final index = dests.indexWhere((d) => d.id == current);
    if (!wide) {
      return Scaffold(
        body: body,
        bottomNavigationBar: NavigationBar(
          selectedIndex: index,
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          onDestinationSelected: (v) => setState(() { current = dests[v].id; libraryTab = 0; }),
          destinations: [
            for (final d in dests)
              NavigationDestination(icon: Icon(d.icon), selectedIcon: Icon(d.active), label: d.id == 'live' ? 'مباشر' : d.label, tooltip: d.label),
          ],
        ),
      );
    }
    final Widget nav = p.cinematic
        ? _CineNav(dests: dests, current: current, onTap: (id) => setState(() => current = id))
        : NavigationRail(
            selectedIndex: index,
            extended: context.isTv,
            minExtendedWidth: 220,
            labelType: context.isTv ? NavigationRailLabelType.none : NavigationRailLabelType.all,
            onDestinationSelected: (v) => setState(() => current = dests[v].id),
            leading: Padding(
              padding: const EdgeInsets.symmetric(vertical: 20),
              child: context.isTv ? const BushraLogo(size: 34) : const BushraMark(size: 38),
            ),
            destinations: [
              for (final d in dests) NavigationRailDestination(icon: Icon(d.icon), selectedIcon: Icon(d.active), label: Text(d.label)),
            ],
          );
    return Scaffold(
      body: Row(children: [
        FocusTraversalGroup(child: nav),
        if (!p.cinematic) VerticalDivider(width: 1, color: p.border),
        Expanded(child: body),
      ]),
    );
  }
}

class _CineNav extends StatelessWidget {
  final List<_Dest> dests;
  final String current;
  final ValueChanged<String> onTap;
  const _CineNav({required this.dests, required this.current, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final compact = !context.isTv && MediaQuery.sizeOf(context).width < 1000;
    return Container(
      width: compact ? 96 : 236,
      decoration: BoxDecoration(
        gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [const Color(0xE60A1A26), const Color(0xF2050C14)]),
        border: BorderDirectional(start: BorderSide(color: p.accent.withValues(alpha: .12))),
      ),
      child: SafeArea(
        child: Column(children: [
          const SizedBox(height: 24),
          if (compact) const BushraMark(size: 48) else Column(children: [
            const BushraMark(size: 84),
            const SizedBox(height: 6),
            Text('البشرى', style: t.headlineMedium!.copyWith(fontSize: 30, height: 1.1)),
          ]),
          const SizedBox(height: 22),
          Expanded(child: ListView(padding: const EdgeInsets.symmetric(horizontal: 12), children: [
            for (final d in dests)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: _CineItem(d: d, selected: d.id == current, compact: compact, onTap: () => onTap(d.id)),
              ),
          ])),
        ]),
      ),
    );
  }
}

class _CineItem extends StatefulWidget {
  final _Dest d;
  final bool selected, compact;
  final VoidCallback onTap;
  const _CineItem({required this.d, required this.selected, required this.compact, required this.onTap});
  @override
  State<_CineItem> createState() => _CineItemState();
}

class _CineItemState extends State<_CineItem> {
  bool focus = false;
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final sel = widget.selected;
    final on = sel || focus;
    return Tooltip(
      message: widget.compact ? widget.d.label : '',
      child: AnimatedContainer(
        duration: BMotion.fast,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: on ? LinearGradient(colors: [p.accent.withValues(alpha: .20), p.accent.withValues(alpha: .05)]) : null,
          border: Border.all(color: on ? p.accent.withValues(alpha: focus ? 1 : .7) : Colors.transparent, width: focus ? 2.5 : 1.4),
          boxShadow: on ? [BoxShadow(color: p.accent.withValues(alpha: .22), blurRadius: 20)] : null,
        ),
        child: Material(
          type: MaterialType.transparency,
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: widget.onTap,
            onFocusChange: (f) => setState(() => focus = f),
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: widget.compact ? 0 : 16, vertical: 14),
              child: Row(mainAxisAlignment: widget.compact ? MainAxisAlignment.center : MainAxisAlignment.start, children: [
                Icon(sel ? widget.d.active : widget.d.icon, color: on ? p.accent : p.text2, size: 26),
                if (!widget.compact) ...[
                  const SizedBox(width: 14),
                  Text(widget.d.label, style: Theme.of(context).textTheme.titleSmall!.copyWith(
                      color: on ? p.text : p.text2, fontWeight: sel ? FontWeight.w600 : FontWeight.w500)),
                ],
              ]),
            ),
          ),
        ),
      ),
    );
  }
}

class SearchBox extends StatelessWidget {
  const SearchBox({super.key});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return BTap(
      radius: 14,
      color: p.dark ? p.container : p.surface,
      onTap: () => Navigator.of(context).push(PageRouteBuilder(
        transitionDuration: BMotion.page,
        pageBuilder: (_, _, _) => const SearchScreen(),
        transitionsBuilder: (_, a, _, c) => FadeTransition(opacity: a, child: c),
      )),
      semantic: 'بحث',
      child: Container(
        height: 48,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), border: p.dark ? null : Border.all(color: p.border)),
        child: Row(children: [
          Icon(Icons.search_rounded, color: p.text3),
          const SizedBox(width: 10),
          Expanded(child: Text('ابحث عن قناة أو برنامج أو مجموعة…', maxLines: 1, overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodyMedium!.copyWith(color: p.text3))),
          InkResponse(
            radius: 22,
            onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SearchScreen(voice: true))),
            child: Padding(padding: const EdgeInsets.all(6), child: Icon(Icons.keyboard_voice_outlined, color: p.accent, size: 22, semanticLabel: 'بحث صوتي')),
          ),
        ]),
      ),
    );
  }
}

/// حالة الاتصال الإجمالية بالمصادر: نص + أيقونة.
class ConnectionPill extends StatelessWidget {
  const ConnectionPill({super.key});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    if (s.sources.isEmpty) return const SizedBox.shrink();
    if (s.status.values.any((v) => v == SourceStatus.updating)) {
      return StatusPill(text: 'يتم التحديث', icon: Icons.sync_rounded, color: p.accent, dense: !context.isWide);
    }
    final errs = s.sources.values.where((x) => x.lastError != null).toList();
    if (errs.isNotEmpty) {
      final auth = errs.any((x) => x.lastError!.contains('صلاحية'));
      return StatusPill(
        text: auth ? 'يحتاج إلى تسجيل الدخول' : (errs.every((x) => x.stale) ? 'بيانات قديمة' : 'لا يمكن الوصول للمصدر'),
        icon: auth ? Icons.key_rounded : Icons.cloud_off_rounded, color: auth ? p.gold : p.danger, dense: !context.isWide,
      );
    }
    return StatusPill(text: 'متصل', icon: Icons.check_circle_rounded, color: p.live, dense: !context.isWide);
  }
}

IconData groupIcon(String g) {
  final n = g.toLowerCase();
  bool has(List<String> k) => k.any(n.contains);
  if (has(['news', 'أخبار', 'اخبار', 'إخبار'])) return Icons.newspaper_rounded;
  if (has(['sport', 'رياض', 'bein', 'ssc', 'كرة'])) return Icons.sports_soccer_rounded;
  if (has(['kid', 'أطفال', 'اطفال', 'cartoon', 'كرتون'])) return Icons.child_care_rounded;
  if (has(['movie', 'film', 'أفلام', 'افلام', 'cinema', 'سينما', 'vod'])) return Icons.movie_outlined;
  if (has(['series', 'مسلسل', 'دراما', 'drama'])) return Icons.theaters_rounded;
  if (has(['music', 'موسيق', 'أغاني', 'اغاني'])) return Icons.music_note_rounded;
  if (has(['quran', 'قرآن', 'قران', 'islam', 'دين', 'إسلام'])) return Icons.menu_book_rounded;
  if (has(['doc', 'وثائق', 'geo', 'discovery'])) return Icons.public_rounded;
  return Icons.folder_outlined;
}

List<Playable> queueOf(List<Channel> l) => [for (final c in l.take(2000)) Playable.channel(c)];
