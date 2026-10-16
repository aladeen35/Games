import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../widgets/common.dart';
import 'add_source.dart';
import 'continue.dart';
import 'home.dart';
import 'series.dart';

/// الأفلام والمسلسلات بأسلوب المتاجر: صف أفقي لكل مجموعة يعرض 10 ملصقات و«عرض المزيد».
class CatalogScreen extends StatefulWidget {
  final ChannelKind kind;
  const CatalogScreen({super.key, required this.kind});
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String filter = '';
  final _ctl = TextEditingController();

  bool get movies => widget.kind == ChannelKind.vod;
  String get title => movies ? 'الأفلام' : 'المسلسلات';
  String get unit => movies ? 'فيلم' : 'مسلسل';

  @override
  void dispose() {
    _ctl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);
    final all = s.visible(kind: widget.kind);

    if (all.isEmpty) {
      return SafeArea(child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Padding(padding: EdgeInsets.fromLTRB(hp, 18, hp, 0), child: Text(title, style: t.headlineSmall)),
        Expanded(child: EmptyState(
          icon: movies ? Icons.movie_outlined : Icons.theaters_rounded,
          title: movies ? 'لا توجد أفلام في قوائمك بعد' : 'لا توجد مسلسلات في قوائمك بعد',
          body: movies
              ? 'تظهر هنا الأفلام الثابتة فقط (ملفات تُشاهَد من البداية)، لا قنوات التلفاز التي تعرض أفلامًا. أضف حساب مزود أو قائمة فيها أفلام.'
              : 'تظهر هنا مسلسلات حسابات المزودين بمواسمها وحلقاتها. أضف حساب مزود يحوي مسلسلات.',
          action: 'إضافة حساب أو قائمة',
          onAction: () => openAddSource(context),
        )),
      ]));
    }

    // المجموعات بترتيب المزود، كل منها بعناصرها
    final groups = <String, List<Channel>>{};
    for (final c in all) {
      (groups[c.group] ??= []).add(c);
    }
    final ids = {for (final c in all) c.id};
    final resume = [
      for (final h in s.history)
        if (!h.item.isLive && h.item.channelId != null && ids.contains(h.item.channelId) && h.progress < .95) h
    ];
    final favs = s.favorites.values.where((c) => c.kind == widget.kind).toList();
    final recent = all.reversed.take(10).toList();

    final header = Padding(
      padding: EdgeInsets.fromLTRB(hp, 14, hp, 4),
      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Row(children: [
          Text(title, style: t.headlineSmall),
          const SizedBox(width: 10),
          Expanded(child: Text('${all.length} $unit · ${groups.length} مجموعة', style: t.bodySmall)),
        ]),
        const SizedBox(height: 10),
        TextField(
          controller: _ctl,
          onChanged: (v) => setState(() => filter = v.trim()),
          decoration: InputDecoration(
            isDense: true,
            prefixIcon: const Icon(Icons.search_rounded),
            hintText: 'ابحث في ${all.length} $unit',
            suffixIcon: filter.isEmpty ? null : IconButton(tooltip: 'مسح', icon: const Icon(Icons.close_rounded),
                onPressed: () { _ctl.clear(); setState(() => filter = ''); }),
          ),
        ),
      ]),
    );

    // عند البحث: شبكة نتائج واحدة
    if (filter.isNotEmpty) {
      final f = filter.toLowerCase();
      final res = all.where((c) => c.name.toLowerCase().contains(f) || c.group.toLowerCase().contains(f)).toList();
      return SafeArea(bottom: false, child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        header,
        Expanded(child: res.isEmpty
            ? const EmptyState(icon: Icons.search_off_rounded, title: 'لا نتائج', body: 'جرّب كلمة أقصر أو اسمًا بالإنجليزية.')
            : PosterGrid(items: res, padding: EdgeInsets.fromLTRB(hp, 8, hp, 24))),
      ]));
    }

    final sections = <Widget Function()>[
      if (resume.isNotEmpty)
        () => _Section(
              title: 'تابع المشاهدة', icon: Icons.play_circle_outline_rounded, hp: hp,
              height: context.isTv ? 236 : 196,
              onMore: resume.length > 10 ? () => _openGroup('تابع المشاهدة', [for (final h in resume) ?s.channelById(h.item.channelId!)]) : null,
              children: [for (final h in resume.take(10)) WatchCard(entry: h, width: context.isTv ? 340 : 270)],
            ),
      if (favs.isNotEmpty)
        () => PosterRow(title: 'مفضلتي', icon: Icons.star_rounded, items: favs, hp: hp, onMore: () => _openGroup('مفضلتي', favs)),
      () => PosterRow(title: 'أضيفت حديثًا', icon: Icons.fiber_new_rounded, items: recent, hp: hp),
      for (final g in groups.entries)
        () => PosterRow(title: g.key, items: g.value, hp: hp, onMore: () => _openGroup(g.key, g.value)),
    ];

    return SafeArea(
      bottom: false,
      child: ListView.builder(
        padding: const EdgeInsets.only(bottom: 24),
        itemCount: sections.length + 1,
        itemBuilder: (_, i) => i == 0 ? header : sections[i - 1](),
      ),
    );
  }

  void _openGroup(String name, List<Channel> items) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => GroupGridScreen(title: name, items: items)));
  }
}

class _Section extends StatelessWidget {
  final String title;
  final IconData? icon;
  final List<Widget> children;
  final double height, hp;
  final VoidCallback? onMore;
  const _Section({required this.title, this.icon, required this.children, required this.height, required this.hp, this.onMore});

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Padding(
        padding: EdgeInsets.fromLTRB(hp, 22, hp > 6 ? hp - 6 : 0, 10),
        child: Row(children: [
          if (icon != null) ...[Icon(icon, size: 20, color: p.cinematic ? p.gold : p.accent), const SizedBox(width: 8)],
          Expanded(child: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleLarge)),
          if (onMore != null)
            IconButton(onPressed: onMore, tooltip: 'عرض المزيد', icon: Icon(Icons.chevron_left_rounded, color: p.text2, size: 28)),
        ]),
      ),
      SizedBox(
        height: height,
        child: FocusTraversalGroup(
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            clipBehavior: Clip.none,
            padding: EdgeInsets.symmetric(horizontal: hp),
            itemCount: children.length,
            separatorBuilder: (_, _) => const SizedBox(width: 12),
            itemBuilder: (_, i) => children[i],
          ),
        ),
      ),
    ]);
  }
}

/// صف ملصقات: أول 10 عناصر ثم بطاقة «عرض المزيد».
class PosterRow extends StatelessWidget {
  final String title;
  final IconData? icon;
  final List<Channel> items;
  final double hp;
  final VoidCallback? onMore;
  const PosterRow({super.key, required this.title, this.icon, required this.items, required this.hp, this.onMore});

  @override
  Widget build(BuildContext context) {
    final w = context.isTv ? 170.0 : (context.isWide ? 150.0 : 118.0);
    final s = AppStore.I;
    final shown = items.take(10).toList();
    return _Section(
      title: title, icon: icon, hp: hp, height: w * 1.5 + 52, onMore: items.length > 10 ? onMore : null,
      children: [
        for (final c in shown)
          SizedBox(width: w, child: PosterCard(
            channel: c,
            progress: s.historyOf(Playable.channel(c).key)?.progress ?? 0,
            onTap: () => openChannel(context, c, items),
            onLongPress: () => showChannelSheet(context, c, items),
          )),
        if (items.length > 10 && onMore != null)
          SizedBox(width: w, child: _MoreTile(count: items.length - 10, onTap: onMore!, height: w * 1.5)),
      ],
    );
  }
}

class _MoreTile extends StatelessWidget {
  final int count;
  final double height;
  final VoidCallback onTap;
  const _MoreTile({required this.count, required this.onTap, required this.height});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Column(children: [
      SizedBox(
        height: height,
        child: BTap(
          onTap: onTap,
          color: p.container,
          child: Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
            Container(
              width: 48, height: 48,
              decoration: BoxDecoration(shape: BoxShape.circle, color: p.accent.withValues(alpha: .15),
                  border: Border.all(color: p.accent.withValues(alpha: .5))),
              child: Icon(Icons.chevron_left_rounded, color: p.accent, size: 30),
            ),
            const SizedBox(height: 10),
            Text('عرض المزيد', style: t.titleSmall),
            Text('+$count', style: t.bodySmall),
          ])),
        ),
      ),
    ]);
  }
}

/// كل عناصر مجموعة في شبكة ملصقات مع بحث.
class GroupGridScreen extends StatefulWidget {
  final String title;
  final List<Channel> items;
  const GroupGridScreen({super.key, required this.title, required this.items});
  @override
  State<GroupGridScreen> createState() => _GroupGridScreenState();
}

class _GroupGridScreenState extends State<GroupGridScreen> {
  String filter = '';
  @override
  Widget build(BuildContext context) {
    final f = filter.toLowerCase();
    final list = f.isEmpty ? widget.items : widget.items.where((c) => c.name.toLowerCase().contains(f)).toList();
    final hp = context.isWide ? 24.0 : 16.0;
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Padding(
          padding: EdgeInsets.fromLTRB(hp, 4, hp, 4),
          child: TextField(
            onChanged: (v) => setState(() => filter = v.trim()),
            decoration: InputDecoration(isDense: true, prefixIcon: const Icon(Icons.search_rounded),
                hintText: 'ابحث في ${widget.items.length} عنصر'),
          ),
        ),
        Expanded(child: PosterGrid(items: list, padding: EdgeInsets.fromLTRB(hp, 8, hp, 24))),
      ]),
    );
  }
}

class PosterGrid extends StatelessWidget {
  final List<Channel> items;
  final EdgeInsets padding;
  const PosterGrid({super.key, required this.items, required this.padding});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    return GridView.builder(
      padding: padding,
      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: context.isTv ? 210 : 150, childAspectRatio: .52, crossAxisSpacing: 12, mainAxisSpacing: 14,
      ),
      itemCount: items.length,
      itemBuilder: (_, i) => PosterCard(
        channel: items[i],
        progress: s.historyOf(Playable.channel(items[i]).key)?.progress ?? 0,
        onTap: () => openChannel(context, items[i], items),
        onLongPress: () => showChannelSheet(context, items[i], items),
      ),
    );
  }
}
