import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/search.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../player/engine.dart';
import '../player/player_screen.dart';
import '../player/session.dart';
import '../widgets/common.dart';

/// يفتح العرض المتعدد (2 أو 4 قنوات معًا) بالقنوات المعطاة.
Future<void> openMultiView(BuildContext context, {List<Channel> initial = const []}) {
  PlayerSession.I.close();
  return Navigator.of(context).push(PageRouteBuilder(
    opaque: true,
    transitionDuration: BMotion.page,
    pageBuilder: (_, _, _) => MultiViewScreen(initial: initial),
    transitionsBuilder: (_, a, _, c) => FadeTransition(opacity: a, child: c),
  ));
}

/// عرض متعدد: حتى 4 قنوات في شبكة، صوت قناة واحدة (المحددة)، والتبديل بلمسة.
class MultiViewScreen extends StatefulWidget {
  final List<Channel> initial;
  const MultiViewScreen({super.key, this.initial = const []});
  @override
  State<MultiViewScreen> createState() => _MultiViewScreenState();
}

class _MultiViewScreenState extends State<MultiViewScreen> {
  int layout = 2;
  final List<Channel?> slots = List.filled(4, null);
  final List<Engine?> engines = List.filled(4, null);
  int audio = 0;
  bool chrome = true;
  /// ما جُرّب لكل خانة من الروابط البديلة.
  final List<Set<String>> _tried = [for (var i = 0; i < 4; i++) <String>{}];
  Timer? _hide;

  @override
  void initState() {
    super.initState();
    WakelockPlus.enable().catchError((_) {});
    plat.enterPlayerMode();
    plat.playerOrientation(portraitVideo: false);
    for (var i = 0; i < widget.initial.length && i < 4; i++) {
      _set(i, widget.initial[i]);
    }
    if (widget.initial.length > 2) layout = 4;
    _poke();
  }

  void _poke() {
    _hide?.cancel();
    if (!chrome) setState(() => chrome = true);
    _hide = Timer(const Duration(seconds: 4), () { if (mounted) setState(() => chrome = false); });
  }

  void _set(int i, Channel c, {bool failover = false}) {
    engines[i]?.dispose();
    if (!failover) _tried[i].clear();
    _tried[i].add(c.id);
    final e = Engine.create();
    e.setVolume(i == audio ? 1 : 0);
    var failed = false;
    e.addListener(() {
      // قناة لا تعمل: نسختها من قائمة أخرى تلقائيًا (مرة لكل بديل)
      if (e.phase == Phase.error && !failed) {
        failed = true;
        final alt = _alt(i);
        if (alt != null && AppStore.I.settings.autoFailover) {
          Future.delayed(const Duration(milliseconds: 800), () { if (mounted && engines[i] == e) _set(i, alt, failover: true); });
        }
      }
      _refresh();
    });
    e.open(Playable.channel(c));
    engines[i] = e;
    slots[i] = c;
    AppStore.I.recordPlay(Playable.channel(c));
    setState(() {});
  }

  Channel? _alt(int i) {
    final c = slots[i];
    if (c == null) return null;
    for (final x in AppStore.I.alternatesFor(c)) {
      if (!_tried[i].contains(x.id)) return x;
    }
    return null;
  }

  void _clear(int i) {
    engines[i]?.dispose();
    engines[i] = null;
    slots[i] = null;
    setState(() {});
  }

  void _refresh() {
    if (mounted) setState(() {});
  }

  void _selectAudio(int i) {
    audio = i;
    for (var k = 0; k < 4; k++) {
      engines[k]?.setVolume(k == i ? 1 : 0);
    }
    setState(() {});
    _poke();
  }

  void _setLayout(int n) {
    for (var i = n; i < 4; i++) {
      _clear(i);
    }
    if (audio >= n) _selectAudio(0);
    setState(() => layout = n);
  }

  Future<void> _pick(int i) async {
    final c = await pickChannel(context, title: slots[i] == null ? 'أضف قناة' : 'تبديل القناة');
    if (c != null && mounted) {
      _set(i, c);
      if (slots.where((x) => x != null).length == 1) _selectAudio(i);
    }
  }

  /// يفتح القناة بملء الشاشة ويغلق العرض المتعدد.
  void _full(int i) {
    final c = slots[i];
    if (c == null) return;
    final nav = Navigator.of(context);
    nav.pop();
    openPlayer(nav.context, Playable.channel(c));
  }

  @override
  void dispose() {
    _hide?.cancel();
    for (final e in engines) {
      e?.dispose();
    }
    WakelockPlus.disable().catchError((_) {});
    plat.exitPlayerMode();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final tiles = [for (var i = 0; i < layout; i++) _tile(i)];
    final grid = layout == 2
        ? Flex(direction: MediaQuery.sizeOf(context).aspectRatio >= 1 ? Axis.horizontal : Axis.vertical,
            children: [for (final x in tiles) Expanded(child: x)])
        : Column(children: [
            Expanded(child: Row(children: [Expanded(child: tiles[0]), Expanded(child: tiles[1])])),
            Expanded(child: Row(children: [Expanded(child: tiles[2]), Expanded(child: tiles[3])])),
          ]);
    return Scaffold(
      backgroundColor: Colors.black,
      body: MouseRegion(
        onHover: (_) => _poke(),
        child: Stack(children: [
          Positioned.fill(child: FocusTraversalGroup(child: grid)),
          AnimatedOpacity(
            opacity: chrome ? 1 : 0,
            duration: const Duration(milliseconds: 200),
            child: IgnorePointer(
              ignoring: !chrome,
              child: SafeArea(child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  margin: const EdgeInsets.all(10),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                  decoration: BoxDecoration(color: const Color(0xCC0A1220), borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white12)),
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    IconButton(onPressed: () => Navigator.maybePop(context), tooltip: 'رجوع',
                        icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white)),
                    Text('عرض متعدد', style: t.titleSmall!.copyWith(color: Colors.white)),
                    const SizedBox(width: 10),
                    SegmentedButton<int>(
                      showSelectedIcon: false,
                      style: const ButtonStyle(visualDensity: VisualDensity.compact),
                      segments: const [
                        ButtonSegment(value: 2, label: Text('2'), icon: Icon(Icons.splitscreen_rounded)),
                        ButtonSegment(value: 4, label: Text('4'), icon: Icon(Icons.grid_view_rounded)),
                      ],
                      selected: {layout},
                      onSelectionChanged: (v) => _setLayout(v.first),
                    ),
                  ]),
                ),
              )),
            ),
          ),
        ]),
      ),
    );
  }

  Widget _tile(int i) {
    final c = slots[i];
    final e = engines[i];
    final on = audio == i && c != null;
    final t = Theme.of(context).textTheme;
    return Focus(
      onKeyEvent: (_, ev) {
        if (ev is! KeyDownEvent) return KeyEventResult.ignored;
        if (ev.logicalKey == LogicalKeyboardKey.contextMenu || ev.logicalKey == LogicalKeyboardKey.info) {
          _pick(i);
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: Padding(
        padding: const EdgeInsets.all(1.5),
        child: BTap(
          radius: 6,
          zoom: 1,
          autofocus: i == 0,
          onTap: () => c == null ? _pick(i) : _selectAudio(i),
          onLongPress: () => _pick(i),
          semantic: c?.name ?? 'أضف قناة',
          child: GestureDetector(
            onDoubleTap: () => _full(i),
            child: AnimatedContainer(
              duration: BMotion.fast,
              decoration: BoxDecoration(
                color: const Color(0xFF05070B),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: on ? BColors.teal : Colors.white10, width: on ? 2.5 : 1),
              ),
              // لا قص بحواف دائرية حول الفيديو: عناصر الفيديو في المتصفح تنحرف عن مكانها معه
              child: c == null || e == null
                  ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.add_circle_outline_rounded, color: Colors.white54, size: 40),
                      const SizedBox(height: 8),
                      Text('أضف قناة', style: t.titleSmall!.copyWith(color: Colors.white70)),
                    ]))
                  : Stack(fit: StackFit.expand, children: [
                      IgnorePointer(child: e.view(fill: false)),
                      if (e.phase == Phase.connecting || e.phase == Phase.buffering)
                        const Center(child: SizedBox(width: 30, height: 30, child: CircularProgressIndicator(strokeWidth: 2.5, color: BColors.teal))),
                      if (e.phase == Phase.error)
                        Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                          const Icon(Icons.wifi_off_rounded, color: BColors.gold, size: 30),
                          const SizedBox(height: 6),
                          Text('لا يعمل الآن', style: t.bodySmall!.copyWith(color: Colors.white70)),
                          TextButton(onPressed: () => _set(i, c), child: const Text('إعادة المحاولة')),
                          if (_alt(i) != null)
                            TextButton(onPressed: () => _set(i, _alt(i)!, failover: true), child: const Text('رابط بديل')),
                        ])),
                      PositionedDirectional(top: 8, start: 8, end: 8, child: AnimatedOpacity(
                        opacity: chrome || on ? 1 : 0,
                        duration: const Duration(milliseconds: 200),
                        child: Row(children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: const Color(0xB3000000), borderRadius: BorderRadius.circular(8)),
                            child: Row(mainAxisSize: MainAxisSize.min, children: [
                              Icon(on ? Icons.volume_up_rounded : Icons.volume_off_rounded, size: 16, color: on ? BColors.teal : Colors.white60),
                              const SizedBox(width: 6),
                              ConstrainedBox(constraints: const BoxConstraints(maxWidth: 180),
                                  child: Text(c.name, maxLines: 1, overflow: TextOverflow.ellipsis,
                                      style: t.labelMedium!.copyWith(color: Colors.white))),
                            ]),
                          ),
                          const Spacer(),
                          if (chrome) ...[
                            _TileBtn(icon: Icons.swap_horiz_rounded, tip: 'تبديل القناة', onTap: () => _pick(i)),
                            _TileBtn(icon: Icons.fullscreen_rounded, tip: 'ملء الشاشة', onTap: () => _full(i)),
                            _TileBtn(icon: Icons.close_rounded, tip: 'إزالة', onTap: () => _clear(i)),
                          ],
                        ]),
                      )),
                    ]),
            ),
          ),
        ),
      ),
    );
  }
}

class _TileBtn extends StatelessWidget {
  final IconData icon;
  final String tip;
  final VoidCallback onTap;
  const _TileBtn({required this.icon, required this.tip, required this.onTap});
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsetsDirectional.only(start: 4),
        child: Material(
          color: const Color(0xB3000000),
          shape: const CircleBorder(),
          child: IconButton(onPressed: onTap, tooltip: tip, visualDensity: VisualDensity.compact,
              icon: Icon(icon, color: Colors.white, size: 20)),
        ),
      );
}

/// يختار قناة مباشرة: المفضلة والأخيرة أولًا، مع بحث.
Future<Channel?> pickChannel(BuildContext context, {String title = 'اختر قناة'}) {
  return showModalBottomSheet<Channel>(
    context: context,
    isScrollControlled: true,
    builder: (ctx) => _ChannelPicker(title: title),
  );
}

class _ChannelPicker extends StatefulWidget {
  final String title;
  const _ChannelPicker({required this.title});
  @override
  State<_ChannelPicker> createState() => _ChannelPickerState();
}

class _ChannelPickerState extends State<_ChannelPicker> {
  String q = '';
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final live = s.visible(kind: ChannelKind.live);
    List<Channel> list;
    if (q.trim().isEmpty) {
      final favs = s.favorites.values.where((c) => c.isLive).toList();
      final recent = [
        for (final h in s.history)
          if (h.item.isLive && h.item.channelId != null) ?s.channelById(h.item.channelId!),
      ];
      final seen = <String>{};
      list = [for (final c in [...favs, ...recent, ...live]) if (seen.add(c.id)) c].take(300).toList();
    } else {
      final qs = expand(q);
      list = [for (final c in live) if (score(normalize(c.name), qs) > 0) c].take(200).toList();
    }
    return SafeArea(child: SizedBox(
      height: MediaQuery.sizeOf(context).height * .8,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text(widget.title, style: t.titleLarge),
          const SizedBox(height: 10),
          TextField(
            autofocus: false,
            onChanged: (v) => setState(() => q = v),
            decoration: const InputDecoration(isDense: true, prefixIcon: Icon(Icons.search_rounded), hintText: 'ابحث عن قناة'),
          ),
          const SizedBox(height: 10),
          Expanded(child: list.isEmpty
              ? const EmptyState(icon: Icons.live_tv_rounded, title: 'لا قنوات', body: 'أضف قائمة فيها قنوات مباشرة أولًا.')
              : ListView.separated(
                  itemCount: list.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (_, i) => ChannelCard(channel: list[i], onTap: () => Navigator.pop(context, list[i])),
                )),
        ]),
      ),
    ));
  }
}
