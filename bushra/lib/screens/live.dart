import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/net.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'add_source.dart';
import 'home.dart';
import 'shell.dart';

/// أهم شاشة: شريط حالة القائمة، المجموعات أفقيًا، شبكة القنوات، ولوحة معلومات جانبية على الشاشات الكبيرة.
class LiveScreen extends StatefulWidget {
  final ChannelKind initialKind;
  final String initialGroup;
  const LiveScreen({super.key, this.initialKind = ChannelKind.live, this.initialGroup = ''});
  @override
  State<LiveScreen> createState() => LiveScreenState();
}

class LiveScreenState extends State<LiveScreen> {
  String? sourceId; // null = كل القوائم
  late String group = widget.initialGroup;
  late ChannelKind kind = widget.initialKind;
  String filter = '';
  Channel? focused;
  final _filterCtl = TextEditingController();

  void selectGroup(String g) => setState(() {
        kind = ChannelKind.live;
        group = g;
      });

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    if (s.sources.isEmpty) {
      return SafeArea(child: EmptyState(
        icon: Icons.live_tv_rounded,
        title: 'لا توجد قوائم بعد',
        body: 'أضف رابط M3U أو ملفًا أو حساب Xtream لتظهر قنواتك هنا.',
        action: 'أضف قائمة الآن',
        onAction: () => openAddSource(context),
      ));
    }
    final hasVod = s.allChannels.any((c) => c.kind != ChannelKind.live);
    final base = s.visible(sourceId: sourceId).where((c) => kind == ChannelKind.live ? c.isLive : !c.isLive).toList();
    final groups = s.groupsOf(base);
    List<Channel> list;
    if (group == '★') {
      list = s.favorites.values.where((c) => kind == ChannelKind.live ? c.isLive : !c.isLive).toList();
    } else if (group.isEmpty) {
      list = base;
    } else {
      list = base.where((c) => c.group == group).toList();
    }
    if (filter.isNotEmpty) {
      final f = filter.toLowerCase();
      list = list.where((c) => c.name.toLowerCase().contains(f) || (c.altName?.toLowerCase().contains(f) ?? false)).toList();
    }
    final wide = context.isWide;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (wide ? 24.0 : 16.0);
    final src = sourceId == null ? null : s.sources[sourceId];
    final updating = s.status.values.contains(SourceStatus.updating);
    final lastUpd = (src != null ? [src] : s.sources.values.toList())
        .map((x) => x.lastUpdated).whereType<DateTime>().fold<DateTime?>(null, (a, b) => a == null || b.isAfter(a) ? b : a);

    final grid = list.isEmpty
        ? EmptyState(
            icon: group == '★' ? Icons.star_outline_rounded : Icons.search_off_rounded,
            title: group == '★' ? 'لم تضف قنوات مفضلة بعد' : 'لا توجد قنوات هنا',
            body: group == '★' ? 'اضغط على النجمة أثناء المشاهدة لتجدها هنا.' : 'جرّب مجموعة أخرى أو امسح التصفية.')
        : GridView.builder(
            padding: EdgeInsets.fromLTRB(hp, 8, hp, 24),
            gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: context.isTv ? 420 : (wide ? 360 : 400),
              mainAxisExtent: 84, crossAxisSpacing: 12, mainAxisSpacing: 12,
            ),
            itemCount: list.length,
            itemBuilder: (_, i) {
              final c = list[i];
              return Focus(
                canRequestFocus: false,
                skipTraversal: true,
                onFocusChange: (f) { if (f && wide) setState(() => focused = c); },
                child: MouseRegion(
                  onEnter: (_) { if (wide && focused != c) setState(() => focused = c); },
                  child: ChannelCard(
                    channel: c,
                    selected: wide && focused?.id == c.id,
                    onTap: () => openPlayer(context, Playable.channel(c), queue: queueOf(list)),
                    onLongPress: () => showChannelSheet(context, c, list),
                  ),
                ),
              );
            },
          );

    return SafeArea(
      bottom: false,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        // شريط الحالة العلوي
        Padding(
          padding: EdgeInsets.fromLTRB(hp, 14, hp, 6),
          child: Wrap(crossAxisAlignment: WrapCrossAlignment.center, spacing: 10, runSpacing: 8, children: [
            Text(kind == ChannelKind.live ? 'البث المباشر' : 'أفلام ومسلسلات', style: t.headlineSmall),
            _SourcePicker(value: sourceId, onChanged: (v) => setState(() { sourceId = v; group = ''; })),
            Text('${base.length} ${kind == ChannelKind.live ? 'قناة' : 'عنوان'}'
                '${lastUpd != null ? ' · آخر تحديث ${ago(lastUpd)}' : ''}', style: t.bodySmall),
            if (updating)
              StatusPill(text: 'يتم التحديث', icon: Icons.sync_rounded, color: p.accent, dense: true)
            else if (src?.lastError != null)
              StatusPill(text: src!.stale ? 'بيانات قديمة' : src.lastError!, icon: Icons.history_toggle_off_rounded, color: p.gold, dense: true)
            else
              const ConnectionPill(),
            TextButton.icon(
              onPressed: updating ? null : () async {
                for (final id in (sourceId == null ? s.sources.keys.toList() : [sourceId!])) {
                  try {
                    await s.refresh(id);
                  } catch (e) {
                    if (context.mounted) {
                      toast(context, 'تعذر تحديث «${s.sources[id]?.name}». ستظل النسخة السابقة متاحة.', icon: Icons.error_outline_rounded);
                    }
                  }
                }
              },
              icon: const Icon(Icons.refresh_rounded, size: 20),
              label: const Text('تحديث القائمة'),
            ),
          ]),
        ),
        if (hasVod)
          Padding(
            padding: EdgeInsets.symmetric(horizontal: hp),
            child: Align(alignment: AlignmentDirectional.centerStart, child: SegmentedButton<ChannelKind>(
              showSelectedIcon: false,
              segments: const [
                ButtonSegment(value: ChannelKind.live, label: Text('قنوات'), icon: Icon(Icons.sensors_rounded)),
                ButtonSegment(value: ChannelKind.vod, label: Text('أفلام ومسلسلات'), icon: Icon(Icons.movie_outlined)),
              ],
              selected: {kind},
              onSelectionChanged: (v) => setState(() { kind = v.first; group = ''; }),
            )),
          ),
        // المجموعات: اسم + أيقونة صغيرة، لا ألوان مستقلة
        SizedBox(
          height: 58,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: hp, vertical: 10),
            children: [
              _GroupTab(label: 'الكل', icon: Icons.apps_rounded, selected: group.isEmpty, onTap: () => setState(() => group = '')),
              _GroupTab(label: 'المفضلة', icon: Icons.star_rounded, selected: group == '★', onTap: () => setState(() => group = '★')),
              for (final g in groups)
                _GroupTab(label: g.key, count: g.value, icon: groupIcon(g.key), selected: group == g.key,
                    onTap: () => setState(() => group = g.key)),
            ],
          ),
        ),
        Padding(
          padding: EdgeInsets.fromLTRB(hp, 0, hp, 4),
          child: TextField(
            controller: _filterCtl,
            onChanged: (v) => setState(() => filter = v.trim()),
            decoration: InputDecoration(
              isDense: true,
              prefixIcon: const Icon(Icons.filter_list_rounded),
              hintText: 'تصفية ${list.length} ${kind == ChannelKind.live ? 'قناة' : 'عنوانًا'} في هذه المجموعة',
              suffixIcon: filter.isEmpty ? null : IconButton(onPressed: () { _filterCtl.clear(); setState(() => filter = ''); },
                  icon: const Icon(Icons.close_rounded), tooltip: 'مسح'),
            ),
          ),
        ),
        Expanded(
          child: wide && focused != null && context.isTv
              ? Row(children: [
                  Expanded(child: grid),
                  SizedBox(width: 360, child: Container(
                    margin: EdgeInsetsDirectional.only(end: hp, bottom: 24, top: 8),
                    decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
                    child: SingleChildScrollView(child: ChannelInfoPanel(channel: focused!, queue: list, sidePanel: true)),
                  )),
                ])
              : grid,
        ),
      ]),
    );
  }
}

class _GroupTab extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool selected;
  final int? count;
  final VoidCallback onTap;
  const _GroupTab({required this.label, required this.icon, required this.selected, required this.onTap, this.count});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return Padding(
      padding: const EdgeInsetsDirectional.only(end: 8),
      child: BTap(
        radius: 999,
        onTap: onTap,
        color: selected ? p.accent.withValues(alpha: .16) : p.container,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Icon(icon, size: 17, color: selected ? p.accent : p.text3),
          const SizedBox(width: 6),
          ConstrainedBox(constraints: const BoxConstraints(maxWidth: 180), child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.labelLarge!.copyWith(color: selected ? p.text : p.text2))),
          if (count != null) ...[const SizedBox(width: 6), Text('$count', style: Theme.of(context).textTheme.labelSmall)],
        ]),
      ),
    );
  }
}

class _SourcePicker extends StatelessWidget {
  final String? value;
  final ValueChanged<String?> onChanged;
  const _SourcePicker({required this.value, required this.onChanged});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    if (s.sources.length < 2) {
      final only = s.sources.values.first;
      return Text('· ${only.name}', style: Theme.of(context).textTheme.titleSmall);
    }
    return PopupMenuButton<String>(
      tooltip: 'اختيار القائمة',
      onSelected: (v) => onChanged(v.isEmpty ? null : v),
      itemBuilder: (_) => [
        const PopupMenuItem(value: '', child: Text('كل القوائم')),
        for (final x in s.sources.values) PopupMenuItem(value: x.id, child: Text(x.name)),
      ],
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(color: context.bc.container, borderRadius: BorderRadius.circular(999)),
        child: Row(mainAxisSize: MainAxisSize.min, children: [
          Text(value == null ? 'كل القوائم' : s.sources[value]?.name ?? '', style: Theme.of(context).textTheme.labelLarge),
          const Icon(Icons.expand_more_rounded, size: 18),
        ]),
      ),
    );
  }
}

String hostOf(Source s) => s.type == SourceType.m3uFile ? s.displayHost : Net.safeHost('http://${s.displayHost}');
