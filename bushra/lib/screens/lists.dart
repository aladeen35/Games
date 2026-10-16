import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../widgets/common.dart';
import 'series.dart';
import 'add_source.dart';
import 'settings.dart';
import 'shell.dart';

/// قوائمي وإعدادات المصادر: ثلاث بطاقات إضافة، المصادر المحفوظة بحالتها، وإعدادات التطبيق السريعة.
class ListsScreen extends StatelessWidget {
  const ListsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 28.0 : 16.0);
    Widget cols(List<Widget> items, double min) => LayoutBuilder(builder: (context, c) {
          final n = (c.maxWidth / min).floor().clamp(1, items.length);
          final w = (c.maxWidth - 14 * (n - 1)) / n;
          return Wrap(spacing: 14, runSpacing: 14, children: [for (final i in items) SizedBox(width: w, child: i)]);
        });
    return SafeArea(
      bottom: false,
      child: ListView(padding: EdgeInsets.fromLTRB(hp, 18, hp, 32), children: [
        Text('قوائمي وإعدادات المصادر', style: t.headlineMedium),
        const SizedBox(height: 4),
        Text('أضف مصادر القنوات الخاصة بك وأدر إعدادات التطبيق بسهولة', style: t.bodyMedium),
        const SizedBox(height: 20),
        cols([
          _AddCard(icon: Icons.link_rounded, color: p.gold, title: 'رابط قائمة M3U', body: 'إضافة رابط قائمة قنوات بصيغة M3U من الإنترنت',
              action: 'إضافة رابط', actionIcon: Icons.add_link_rounded, gold: true,
              onTap: () => _guarded(context, () => openAddSource(context, type: SourceType.m3uUrl))),
          _AddCard(icon: Icons.insert_drive_file_outlined, color: p.accent, title: 'ملف من الجهاز', body: 'إضافة ملف قائمة قنوات بصيغة M3U من جهازك',
              action: 'اختيار ملف', actionIcon: Icons.folder_open_rounded,
              onTap: () => _guarded(context, () => openAddSource(context, type: SourceType.m3uFile))),
          _AddCard(icon: Icons.person_add_alt_1_outlined, color: p.gold, title: 'حساب المزود', body: 'تسجيل الدخول بحساب مزود خدمة IPTV الخاص بك',
              action: 'إضافة حساب', actionIcon: Icons.person_add_alt_rounded, gold: true,
              onTap: () => _guarded(context, () => openAddSource(context, type: SourceType.xtream))),
        ], 230),
        SectionHeader('المصادر المحفوظة', subtitle: 'إدارة قوائمك المضافة ومتابعة حالتها', icon: Icons.storage_rounded),
        if (s.sources.isEmpty)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
            child: Column(children: [
              Text('ابدأ بقائمة M3U أو ملف من جهازك', style: t.titleMedium),
              const SizedBox(height: 4),
              Text('يمكنك إضافة أكثر من مصدر وتنظيمها في مكان واحد.', style: t.bodyMedium, textAlign: TextAlign.center),
            ]),
          )
        else
          for (final src in s.sources.values) ...[_SourceCard(src: src), const SizedBox(height: 12)],
        SectionHeader('إعدادات التطبيق', subtitle: 'خصّص تجربة المشاهدة بما يناسبك', icon: Icons.tune_rounded),
        cols([
          _SettingCard(icon: Icons.play_circle_outline_rounded, color: p.gold, title: 'التشغيل', body: 'خيارات التشغيل والجودة والسلوك العام',
              onTap: () => openSettingsSection(context, 'playback')),
          _SettingCard(icon: Icons.volume_up_outlined, color: p.accent, title: 'الصوت والترجمة', body: 'إعدادات الصوت، المسارات، والترجمة',
              onTap: () => openSettingsSection(context, 'audio')),
          _SettingCard(icon: Icons.palette_outlined, color: p.gold, title: 'المظهر', body: 'تخصيص الواجهة والألوان وأنماط العرض',
              onTap: () => openSettingsSection(context, 'look')),
          _SettingCard(icon: Icons.verified_user_outlined, color: p.gold, title: 'الرقابة الأبوية', body: 'إدارة المحتوى وحماية الأطفال',
              onTap: () => openSettingsSection(context, 'parental')),
        ], 220),
        SectionHeader('المفضلة', icon: Icons.star_rounded,
            onSeeAll: s.favorites.isEmpty ? null : () => Shell.go('live', group: '★')),
        if (s.favorites.isEmpty)
          Text('لم تضف قنوات مفضلة بعد. اضغط على النجمة أثناء المشاهدة لتجدها هنا.', style: t.bodyMedium)
        else
          for (final c in s.favorites.values.take(6))
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: ChannelCard(channel: c, onTap: () => openChannel(context, c, s.favorites.values.toList())),
            ),
        SectionHeader('الملفات المحلية', subtitle: '${s.localVideos.length} ملف من جهازك', icon: Icons.smartphone_rounded,
            onSeeAll: () => Shell.go('local')),
      ]),
    );
  }
}

class _AddCard extends StatelessWidget {
  final IconData icon, actionIcon;
  final Color color;
  final String title, body, action;
  final bool gold;
  final VoidCallback onTap;
  const _AddCard({required this.icon, required this.color, required this.title, required this.body, required this.action,
      required this.actionIcon, required this.onTap, this.gold = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 22, 18, 18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(BRadius.card + 4),
        color: p.container,
        border: Border.all(color: p.cinematic ? p.border : Colors.transparent),
        gradient: p.cinematic ? LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
            colors: [p.highlight.withValues(alpha: .55), p.container]) : null,
      ),
      child: Column(children: [
        Icon(icon, size: 44, color: color, shadows: p.cinematic ? [Shadow(color: color.withValues(alpha: .6), blurRadius: 18)] : null),
        const SizedBox(height: 12),
        Text(title, style: t.titleLarge, textAlign: TextAlign.center),
        const SizedBox(height: 6),
        Text(body, style: t.bodyMedium, textAlign: TextAlign.center, maxLines: 2),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: gold || !p.cinematic
              ? FilledButton.icon(onPressed: onTap, icon: Icon(actionIcon), label: Text(action))
              : FilledButton.icon(
                  style: tealButtonStyle(p),
                  onPressed: onTap, icon: Icon(actionIcon), label: Text(action)),
        ),
      ]),
    );
  }
}

class _SettingCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title, body;
  final VoidCallback onTap;
  const _SettingCard({required this.icon, required this.color, required this.title, required this.body, required this.onTap});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return BTap(
      color: p.container,
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: color, size: 32),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: t.titleMedium),
          const SizedBox(height: 2),
          Text(body, style: t.bodySmall),
        ])),
        Icon(Icons.chevron_left_rounded, color: p.text3),
      ]),
    );
  }
}

/// قفل إعدادات المصادر بالرمز الأبوي إن كان مفعّلًا.
Future<void> _guarded(BuildContext context, VoidCallback f) async {
  if (await askPin(context, title: 'إعدادات المصادر مقفلة')) f();
}

class _SourceCard extends StatelessWidget {
  final Source src;
  const _SourceCard({required this.src});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final updating = s.status[src.id] == SourceStatus.updating;
    final Widget status = updating
        ? StatusPill(text: 'يتم التحديث', icon: Icons.sync_rounded, color: p.accent, dense: true)
        : src.lastError == null
            ? StatusPill(text: 'متصل', icon: Icons.check_circle_rounded, color: p.live, dense: true)
            : src.lastError!.contains('صلاحية')
                ? StatusPill(text: 'يحتاج إلى تسجيل الدخول', icon: Icons.key_rounded, color: p.gold, dense: true)
                : StatusPill(text: 'بيانات قديمة', icon: Icons.history_toggle_off_rounded, color: p.gold, dense: true);
    final menu = PopupMenuButton<String>(
      tooltip: 'خيارات القائمة',
      icon: Icon(Icons.more_vert_rounded, color: p.text2),
      onSelected: (v) => _guarded(context, () => _action(context, v)),
      itemBuilder: (_) => [
        if (src.type != SourceType.m3uFile) const PopupMenuItem(value: 'refresh', child: Text('تحديث القائمة')),
        const PopupMenuItem(value: 'rename', child: Text('إعادة التسمية')),
        const PopupMenuItem(value: 'epg', child: Text('رابط دليل البرامج (XMLTV)')),
        if (src.type != SourceType.m3uFile) const PopupMenuItem(value: 'edit', child: Text('تعديل المصدر')),
        const PopupMenuItem(value: 'delete', child: Text('حذف')),
      ],
    );
    // أيقونة دائرية متوهجة كما في التصميم
    final badge = Container(
      width: 56, height: 56,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(colors: [p.accent.withValues(alpha: .28), p.accent.withValues(alpha: .06)]),
        border: Border.all(color: p.accent.withValues(alpha: .3)),
        boxShadow: p.cinematic ? [BoxShadow(color: p.accent.withValues(alpha: .2), blurRadius: 16)] : null,
      ),
      child: Icon(src.type == SourceType.xtream ? Icons.manage_accounts_outlined : Icons.storage_rounded, color: p.accent, size: 28),
    );
    final title = Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
      Text(src.name, style: t.titleMedium, maxLines: 1, overflow: TextOverflow.ellipsis),
      const SizedBox(height: 4),
      status,
    ]);
    final upd = src.lastUpdated;
    String two(int v) => v.toString().padLeft(2, '0');
    Widget stat(IconData i, String value, String label) => Column(mainAxisSize: MainAxisSize.min, children: [
          Row(mainAxisSize: MainAxisSize.min, children: [
            Text(value, style: t.titleSmall, textDirection: TextDirection.ltr),
            const SizedBox(width: 8),
            Icon(i, size: 22, color: p.text2),
          ]),
          const SizedBox(height: 2),
          Text(label, style: t.bodySmall),
        ]);
    final stats = [
      stat(Icons.schedule_rounded, upd == null ? '—' : '${upd.year}/${two(upd.month)}/${two(upd.day)}  ${hhmm(upd)}', 'آخر تحديث'),
      stat(Icons.live_tv_rounded, '${src.liveCount}', 'قناة'),
      if (src.vodCount > 0) stat(Icons.movie_outlined, '${src.vodCount}', 'فيلم ومسلسل'),
    ];
    final buttons = [
      if (src.type != SourceType.m3uFile) ...[
        OutlinedButton.icon(
          onPressed: () => _guarded(context, () => _action(context, 'edit')),
          icon: const Icon(Icons.edit_outlined), label: const Text('تعديل'),
        ),
        const SizedBox(width: 10),
        FilledButton.icon(
          style: tealButtonStyle(p),
          onPressed: updating ? null : () => _guarded(context, () => _action(context, 'refresh')),
          icon: updating
              ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
              : const Icon(Icons.sync_rounded),
          label: const Text('تحديث'),
        ),
      ],
    ];
    Widget divider() => Container(width: 1, height: 44, margin: const EdgeInsets.symmetric(horizontal: 20), color: p.border);
    final error = src.lastError == null ? null : Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: p.gold.withValues(alpha: .08), borderRadius: BorderRadius.circular(12)),
      child: Row(children: [
        Icon(Icons.info_outline_rounded, color: p.gold, size: 20),
        const SizedBox(width: 10),
        Expanded(child: Text('تعذر تحديث هذه القائمة: ${src.lastError}. ستظل النسخة السابقة متاحة.', style: t.bodySmall!.copyWith(color: p.text2))),
      ]),
    );
    return LayoutBuilder(builder: (context, box) {
      final wide = box.maxWidth >= 820;
      return Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: wide ? 18 : 14),
        decoration: BoxDecoration(
          color: p.container, borderRadius: BorderRadius.circular(BRadius.card + 4),
          border: Border.all(color: p.cinematic ? p.border : Colors.transparent),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          if (wide)
            Row(children: [
              menu, badge, const SizedBox(width: 14),
              Expanded(child: title),
              for (final st in stats) ...[divider(), st],
              const SizedBox(width: 24),
              ...buttons,
            ])
          else ...[
            Row(children: [badge, const SizedBox(width: 12), Expanded(child: title), menu]),
            const SizedBox(height: 14),
            Wrap(spacing: 24, runSpacing: 12, alignment: WrapAlignment.spaceAround, children: stats),
            if (buttons.isNotEmpty) ...[
              const SizedBox(height: 14),
              Row(children: [for (final b in buttons) b is SizedBox ? b : Expanded(child: b)]),
            ],
          ],
          ?error,
        ]),
      );
    });
  }

  Future<void> _action(BuildContext context, String v) async {
    final s = AppStore.I;
    switch (v) {
      case 'refresh':
        try {
          await s.refresh(src.id);
          if (context.mounted) toast(context, 'تم تحديث «${src.name}»');
        } catch (_) {
          if (context.mounted) toast(context, 'تعذر تحديث هذه القائمة. ستظل النسخة السابقة متاحة.', icon: Icons.error_outline_rounded);
        }
      case 'rename':
        final name = await _prompt(context, 'إعادة التسمية', src.name, 'اسم القائمة');
        if (name != null && name.trim().isNotEmpty) s.renameSource(src.id, name.trim());
      case 'epg':
        final url = await _prompt(context, 'رابط دليل البرامج', src.epgUrl ?? '', 'https://…/epg.xml(.gz)', ltr: true);
        if (url != null) await s.setEpgUrl(src.id, url);
      case 'edit':
        if (context.mounted) openAddSource(context, editing: src);
      case 'delete':
        final ok = await showDialog<bool>(context: context, builder: (c) => AlertDialog(
          title: const Text('حذف القائمة؟'),
          content: Text('ستُحذف «${src.name}» وقنواتها من هذا الجهاز. المفضلة تبقى.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('إلغاء')),
            FilledButton(style: FilledButton.styleFrom(backgroundColor: context.bc.danger, foregroundColor: Colors.white,
                    backgroundBuilder: (_, _, child) => DecoratedBox(decoration: BoxDecoration(color: context.bc.danger,
                        borderRadius: BorderRadius.circular(BRadius.button)), child: child)),
                onPressed: () => Navigator.pop(c, true), child: const Text('حذف')),
          ],
        ));
        if (ok == true) await s.removeSource(src.id);
    }
  }
}

Future<String?> _prompt(BuildContext context, String title, String initial, String hint, {bool ltr = false}) {
  final c = TextEditingController(text: initial);
  return showDialog<String>(context: context, builder: (ctx) => AlertDialog(
    title: Text(title),
    content: TextField(controller: c, autofocus: true, textDirection: ltr ? TextDirection.ltr : null,
        decoration: InputDecoration(hintText: hint), onSubmitted: (v) => Navigator.pop(ctx, v)),
    actions: [
      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('إلغاء')),
      FilledButton(onPressed: () => Navigator.pop(ctx, c.text), child: const Text('حفظ')),
    ],
  ));
}
