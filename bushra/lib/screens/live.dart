import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/net.dart';
import '../data/open_channels.dart';
import '../data/store.dart';
import '../widgets/common.dart';
import 'series.dart';
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
  ChannelKind get kind => widget.initialKind;
  /// مصدر العرض: قوائم المستخدم أو القنوات المفتوحة المضمّنة (للبث المباشر فقط).
  late bool open = widget.initialKind == ChannelKind.live && AppStore.I.sources.isEmpty && widget.initialGroup.isEmpty;
  bool get _liveTab => widget.initialKind == ChannelKind.live;
  String filter = '';
  Channel? focused;
  final _filterCtl = TextEditingController();

  @override
  void initState() {
    super.initState();
    if (open) WidgetsBinding.instance.addPostFrameCallback((_) => AppStore.I.loadOpen());
  }

  void selectGroup(String g) => setState(() {
        open = false;
        group = g;
      });

  void _setOpen(bool v) {
    setState(() { open = v; group = ''; filter = ''; _filterCtl.clear(); focused = null; });
    if (v) AppStore.I.loadOpen();
  }

  bool _match(Channel c) => switch (kind) {
        ChannelKind.live => c.isLive,
        ChannelKind.vod => c.kind == ChannelKind.vod,
        ChannelKind.series => c.kind == ChannelKind.series,
      };

  String get _unit => switch (kind) { ChannelKind.live => 'قناة', ChannelKind.vod => 'فيلم', ChannelKind.series => 'مسلسل' };

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final wide = context.isWide;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (wide ? 24.0 : 16.0);

    // ——— اختيار المصدر في الأعلى (البث المباشر فقط) ———
    final Widget switcher = !_liveTab ? const SizedBox(height: 6) : Padding(
      padding: EdgeInsets.fromLTRB(hp, 14, hp, 4),
      child: Align(
        alignment: AlignmentDirectional.centerStart,
        child: SegmentedButton<bool>(
          showSelectedIcon: false,
          segments: const [
            ButtonSegment(value: false, label: Text('قوائمي وملفاتي'), icon: Icon(Icons.playlist_play_rounded)),
            ButtonSegment(value: true, label: Text('قنوات مفتوحة'), icon: Icon(Icons.public_rounded)),
          ],
          selected: {open},
          onSelectionChanged: (v) => _setOpen(v.first),
        ),
      ),
    );

    List<Channel> base;
    List<MapEntry<String, int>> groups;
    Widget status;
    Widget? notice;
    if (open) {
      base = s.visibleOpen();
      groups = s.groupsOf(base)..sort((a, b) => b.value.compareTo(a.value));
      final arab = base.where(OpenChannels.isArab).length;
      if (arab > 0) groups.insert(0, MapEntry(OpenChannels.arabGroup, arab));
      status = Wrap(crossAxisAlignment: WrapCrossAlignment.center, spacing: 10, runSpacing: 8, children: [
        Text('القنوات المفتوحة', style: t.headlineSmall),
        Text('${base.length} قناة${s.openUpdated != null ? ' · آخر تحديث ${ago(s.openUpdated!)}' : ''}', style: t.bodySmall),
        if (s.openLoading)
          StatusPill(text: 'يتم التحديث', icon: Icons.sync_rounded, color: p.accent, dense: true)
        else if (s.openError != null)
          StatusPill(text: base.isEmpty ? 'لا يمكن الوصول للمصدر' : 'بيانات قديمة', icon: Icons.cloud_off_rounded, color: p.gold, dense: true)
        else if (base.isNotEmpty)
          StatusPill(text: 'متصل', icon: Icons.check_circle_rounded, color: p.live, dense: true),
        TextButton.icon(
          onPressed: s.openLoading ? null : () => s.loadOpen(force: true),
          icon: const Icon(Icons.refresh_rounded, size: 20), label: const Text('تحديث القائمة'),
        ),
      ]);
      notice = Padding(
        padding: EdgeInsets.fromLTRB(hp, 0, hp, 4),
        child: Row(children: [
          Icon(Icons.info_outline_rounded, size: 16, color: p.text3),
          const SizedBox(width: 6),
          Expanded(child: Text('قنوات مجانية عامة من مشروع iptv-org مفتوح المصدر. بعضها قد لا يعمل أو يكون محجوبًا في منطقتك.',
              style: t.bodySmall)),
        ]),
      );
    } else {
      if (!_liveTab && !s.allChannels.any(_match)) {
        final movies = kind == ChannelKind.vod;
        return SafeArea(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Padding(padding: EdgeInsets.fromLTRB(hp, 18, hp, 0), child: Text(movies ? 'الأفلام' : 'المسلسلات', style: t.headlineSmall)),
          Expanded(child: EmptyState(
            icon: movies ? Icons.movie_outlined : Icons.theaters_rounded,
            title: movies ? 'لا توجد أفلام في قوائمك بعد' : 'لا توجد مسلسلات في قوائمك بعد',
            body: movies
                ? 'تظهر هنا الأفلام الثابتة فقط (ملفات تُشاهَد من البداية)، لا قنوات التلفاز التي تعرض أفلامًا. أضف حساب مزود أو قائمة فيها أفلام.'
                : 'تظهر هنا مسلسلات حسابات المزودين بمواسمها وحلقاتها. أضف حساب مزود (Xtream) يحوي مسلسلات.',
            action: 'إضافة حساب أو قائمة',
            onAction: () => openAddSource(context),
          )),
        ]));
      }
      if (s.sources.isEmpty) {
        return SafeArea(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          switcher,
          Expanded(child: EmptyState(
            icon: Icons.live_tv_rounded,
            title: 'لا توجد قوائم بعد',
            body: 'أضف رابط M3U أو ملفًا أو حساب Xtream لتظهر قنواتك هنا — أو تصفّح القنوات المفتوحة المضمّنة.',
            action: 'أضف قائمة الآن',
            onAction: () => openAddSource(context),
          )),
          Center(child: TextButton.icon(onPressed: () => _setOpen(true), icon: const Icon(Icons.public_rounded), label: const Text('تصفح القنوات المفتوحة'))),
          const SizedBox(height: 24),
        ]));
      }
      base = s.visible(sourceId: sourceId).where(_match).toList();
      groups = s.groupsOf(base);
      final src = sourceId == null ? null : s.sources[sourceId];
      final updating = s.status.values.contains(SourceStatus.updating);
      final lastUpd = (src != null ? [src] : s.sources.values.toList())
          .map((x) => x.lastUpdated).whereType<DateTime>().fold<DateTime?>(null, (a, b) => a == null || b.isAfter(a) ? b : a);
      status = Wrap(crossAxisAlignment: WrapCrossAlignment.center, spacing: 10, runSpacing: 8, children: [
        Text(switch (kind) { ChannelKind.live => 'البث المباشر', ChannelKind.vod => 'الأفلام', ChannelKind.series => 'المسلسلات' },
            style: t.headlineSmall),
        _SourcePicker(value: sourceId, onChanged: (v) => setState(() { sourceId = v; group = ''; })),
        Text('${base.length} $_unit${lastUpd != null ? ' · آخر تحديث ${ago(lastUpd)}' : ''}', style: t.bodySmall),
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
      ]);
    }

    List<Channel> list;
    if (group == '★') {
      list = s.favorites.values.where(_match).toList();
    } else if (group.isEmpty) {
      list = base;
    } else if (open && group == OpenChannels.arabGroup) {
      list = base.where(OpenChannels.isArab).toList();
    } else {
      list = base.where((c) => c.group == group).toList();
    }
    if (filter.isNotEmpty) {
      final f = filter.toLowerCase();
      list = list.where((c) => c.name.toLowerCase().contains(f) || (c.altName?.toLowerCase().contains(f) ?? false)).toList();
    }

    final Widget grid;
    if (list.isEmpty && open && s.openLoading) {
      grid = Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
        const CircularProgressIndicator(),
        const SizedBox(height: 14),
        Text('جارٍ تحميل القنوات المفتوحة…', style: t.bodyMedium),
      ]));
    } else if (list.isEmpty && open && s.openError != null && base.isEmpty) {
      grid = EmptyState(icon: Icons.cloud_off_rounded, title: 'تعذر تحميل القنوات المفتوحة', body: s.openError!,
          action: 'إعادة المحاولة', onAction: () => s.loadOpen(force: true));
    } else if (list.isEmpty) {
      grid = EmptyState(
          icon: group == '★' ? Icons.star_outline_rounded : Icons.search_off_rounded,
          title: group == '★' ? 'لم تضف قنوات مفضلة بعد' : 'لا توجد قنوات هنا',
          body: group == '★' ? 'اضغط على النجمة أثناء المشاهدة لتجدها هنا.' : 'جرّب مجموعة أخرى أو امسح التصفية.');
    } else {
      grid = GridView.builder(
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
                onTap: () => openChannel(context, c, list),
                onLongPress: () => showChannelSheet(context, c, list),
              ),
            ),
          );
        },
      );
    }

    return SafeArea(
      bottom: false,
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        switcher,
        Padding(padding: EdgeInsets.fromLTRB(hp, 8, hp, 6), child: status),
        ?notice,
        // المجموعات: اسم + أيقونة صغيرة، لا ألوان مستقلة
        SizedBox(
          height: 58,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: hp, vertical: 10),
            children: [
              _GroupTab(label: 'الكل', icon: Icons.apps_rounded, selected: group.isEmpty, onTap: () => setState(() => group = '')),
              _GroupTab(label: 'المفضلة', icon: Icons.star_rounded, selected: group == '★', onTap: () => setState(() => group = '★')),
              for (final g in groups.take(open ? 60 : 500))
                _GroupTab(label: g.key, count: g.value,
                    icon: g.key == OpenChannels.arabGroup ? Icons.translate_rounded : groupIcon(g.key),
                    selected: group == g.key, onTap: () => setState(() => group = g.key)),
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
              hintText: 'تصفية ${list.length} $_unit في هذه المجموعة',
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
