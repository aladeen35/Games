import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../widgets/common.dart';

/// الإعدادات: مركز تحكم لا صفحة اجتماعية. بطاقات أقسام تفتح صفحاتها.
class SettingsScreen extends StatelessWidget {
  final bool standalone;
  const SettingsScreen({super.key, this.standalone = true});

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final isRoute = ModalRoute.of(context)?.settings.name == null && Navigator.of(context).canPop() && standalone && !context.isWide;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);
    final sections = [
      (Icons.play_circle_outline_rounded, 'التشغيل', 'خيارات التشغيل والجودة والسلوك العام', _Section.playback, p.gold),
      (Icons.volume_up_outlined, 'الصوت والترجمة', 'إعدادات الصوت، المسارات، والترجمة', _Section.audio, p.accent),
      (Icons.palette_outlined, 'المظهر', 'نمط التصميم، الألوان، وحجم النص', _Section.look, p.gold),
      (Icons.shield_outlined, 'الرقابة الأبوية', 'إدارة المحتوى وحماية الأطفال', _Section.parental, p.gold),
      if (kIsWeb) (Icons.lan_outlined, 'الشبكة', 'وسيط الويب للمصادر التي تمنع المتصفح', _Section.network, p.accent),
      (Icons.cloud_sync_outlined, 'النسخ الاحتياطي والبيانات', 'انقل قوائمك ومفضلتك لجهاز آخر، والسجل', _Section.data, p.accent),
    ];
    final body = ListView(padding: EdgeInsets.fromLTRB(hp, 14, hp, 32), children: [
      if (!isRoute) Text('الإعدادات', style: t.headlineSmall),
      if (!isRoute) Text('خصّص تجربة المشاهدة بما يناسبك', style: t.bodySmall),
      const SizedBox(height: 16),
      // الملف: محلي، والمزامنة معطلة افتراضيًا
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
        child: Row(children: [
          CircleAvatar(radius: 26, backgroundColor: p.highlight, child: Icon(Icons.person_rounded, color: p.text2, size: 28)),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('هذا الجهاز', style: t.titleMedium),
            Text('${s.sources.length} قائمة · ${s.favorites.length} مفضلة · المزامنة متوقفة', style: t.bodySmall),
          ])),
          Tooltip(
            message: 'كل بياناتك محفوظة على هذا الجهاز فقط ولا تُرسل لأي خادم.',
            child: Icon(Icons.verified_user_outlined, color: p.live),
          ),
        ]),
      ),
      const SizedBox(height: 16),
      LayoutBuilder(builder: (context, c) {
        final cols = c.maxWidth > 900 ? 3 : (c.maxWidth > 560 ? 2 : 1);
        return Wrap(spacing: 12, runSpacing: 12, children: [
          for (final x in sections)
            SizedBox(
              width: (c.maxWidth - 12 * (cols - 1)) / cols,
              child: BTap(
                color: p.container,
                onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => _SectionPage(section: x.$4, title: x.$2))),
                padding: const EdgeInsets.all(16),
                child: Row(children: [
                  Icon(x.$1, color: x.$5, size: 30),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(x.$2, style: t.titleMedium),
                    Text(x.$3, style: t.bodySmall),
                  ])),
                  Icon(Icons.chevron_left_rounded, color: p.text3),
                ]),
              ),
            ),
        ]);
      }),
      const SizedBox(height: 28),
      Center(child: Column(children: [
        const BushraLogo(size: 44, tagline: true),
        const SizedBox(height: 10),
        Text('الإصدار 1.0.0 — من إنتاج البشرى تكنولوجي', style: t.bodySmall),
        const SizedBox(height: 4),
        SizedBox(width: 460, child: Text(
          'البشرى مشغّل ومنظّم للقوائم فقط ولا يوفّر أي محتوى. المستخدم مسؤول عن حقوق المصادر التي يضيفها.',
          style: t.bodySmall, textAlign: TextAlign.center)),
      ])),
    ]);
    if (isRoute) return Scaffold(appBar: AppBar(title: const Text('الحساب والإعدادات')), body: body);
    return SafeArea(bottom: false, child: body);
  }
}

enum _Section { playback, audio, look, parental, network, data }

/// يفتح قسم إعدادات مباشرة (من «قوائمي» مثلًا).
void openSettingsSection(BuildContext context, String id) {
  final (sec, title) = switch (id) {
    'audio' => (_Section.audio, 'الصوت والترجمة'),
    'look' => (_Section.look, 'المظهر'),
    'parental' => (_Section.parental, 'الرقابة الأبوية'),
    _ => (_Section.playback, 'التشغيل'),
  };
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => _SectionPage(section: sec, title: title)));
}

class _SectionPage extends StatefulWidget {
  final _Section section;
  final String title;
  const _SectionPage({required this.section, required this.title});
  @override
  State<_SectionPage> createState() => _SectionPageState();
}

class _SectionPageState extends State<_SectionPage> {
  final s = AppStore.I;
  Settings get st => s.settings;
  void save() { s.saveSettings(); setState(() {}); }

  Widget sw(String title, String sub, bool v, ValueChanged<bool> on) => SwitchListTile(
        contentPadding: EdgeInsets.zero, title: Text(title), subtitle: Text(sub), value: v,
        onChanged: (x) { on(x); save(); });

  Widget seg<T>(String title, T value, List<(T, String)> opts, ValueChanged<T> on) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          SegmentedButton<T>(
            showSelectedIcon: false,
            segments: [for (final o in opts) ButtonSegment(value: o.$1, label: Text(o.$2))],
            selected: {value},
            onSelectionChanged: (v) { on(v.first); save(); },
          ),
        ]),
      );

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final items = <Widget>[];
    switch (widget.section) {
      case _Section.playback:
        items.addAll([
          sw('التشغيل التلقائي للتالي', 'عند انتهاء فيديو أو ملف ينتقل للتالي في القائمة', st.autoplayNext, (v) => st.autoplayNext = v),
          sw('الاستمرار من آخر موضع', 'يكمل الأفلام والملفات من حيث توقفت', st.resume, (v) => st.resume = v),
          sw('إعادة الاتصال تلقائيًا', 'يحاول مجددًا بعد 5 ثوانٍ عند انقطاع البث', st.autoReconnect, (v) => st.autoReconnect = v),
          seg('العرض الافتراضي', st.fillScreen, const [(false, 'ملاءمة'), (true, 'ملء الشاشة')], (v) => st.fillScreen = v),
          sw('معلومات البث على الشاشة', 'الجودة الحالية وحالة الاتصال أثناء المشاهدة', st.showStreamInfo, (v) => st.showStreamInfo = v),
          sw('إخفاء القنوات المعطلة', 'القنوات التي فشل فحصها أو تشغيلها تختفي من القوائم', st.hideBroken, (v) => st.hideBroken = v),
          if (!kIsWeb)
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.health_and_safety_outlined),
              title: const Text('فحص القنوات الآن'),
              subtitle: Text(s.healthChecking
                  ? 'جارٍ الفحص… ${s.healthDone} من ${s.healthTotal}'
                  : '${s.health.values.where((v) => !v).length} قناة لا تعمل من ${s.health.length} مفحوصة'),
              trailing: s.healthChecking ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : null,
              onTap: s.healthChecking ? null : () async { setState(() {}); await s.checkHealth(); if (mounted) setState(() {}); },
            ),
          const SizedBox(height: 8),
          Text('الجودة تُختار تلقائيًا حسب سرعة الاتصال، ويمكن تغييرها يدويًا من المشغل.', style: t.bodySmall),
        ]);
      case _Section.audio:
        items.addAll([
          seg('لغة الصوت المفضلة', st.preferredAudio, const [('ar', 'العربية'), ('en', 'English'), ('und', 'الأصلية')], (v) => st.preferredAudio = v),
          Text('حجم الترجمة', style: t.titleSmall),
          Slider(value: st.subtitleScale, min: .8, max: 1.6, divisions: 4, label: '${(st.subtitleScale * 100).round()}%',
              onChanged: (v) { st.subtitleScale = v; save(); }),
          sw('خلفية للترجمة', 'شريط داكن شفاف خلف النص لسهولة القراءة', st.subtitleBackground, (v) => st.subtitleBackground = v),
        ]);
      case _Section.look:
        items.addAll([
          Text('نمط التصميم', style: t.titleSmall),
          const SizedBox(height: 10),
          Row(children: [
            Expanded(child: _StyleCard(title: 'هادئ', body: 'الأساسي: أسطح متدرجة وتركيز على المحتوى', selected: !st.cinematic,
                onTap: () { st.cinematic = false; save(); })),
            const SizedBox(width: 12),
            Expanded(child: _StyleCard(title: 'سينمائي', body: 'البديل: زجاج متوهج وأزرار ذهبية وشريط ضوئي', selected: st.cinematic,
                cinematic: true, onTap: () { st.cinematic = true; save(); })),
          ]),
          seg('الوضع', st.theme, const [(ThemeMode.dark, 'داكن'), (ThemeMode.light, 'فاتح'), (ThemeMode.system, 'تلقائي')], (v) => st.theme = v),
          Text('حجم النص', style: t.titleSmall),
          Slider(value: st.textScale, min: .9, max: 1.4, divisions: 5, label: '${(st.textScale * 100).round()}%',
              onChanged: (v) { st.textScale = v; save(); }),
          sw('تقليل الحركة', 'إيقاف التكبير والانتقالات المتحركة', st.reduceMotion, (v) => st.reduceMotion = v),
          sw('تباين أعلى', 'نص أوضح وحدود أقوى', st.highContrast, (v) => st.highContrast = v),
          sw('عرض الأسماء الأصلية', 'يظهر الاسم الأصلي للقناة تحت الاسم العربي', st.showOriginalNames, (v) => st.showOriginalNames = v),
        ]);
      case _Section.parental:
        final groups = {for (final c in s.allChannels) c.group}.toList()..sort();
        items.addAll([
          Text('الرمز الأبوي يقفل المجموعات المختارة، ويحمي إعدادات المصادر من التعديل.', style: t.bodyMedium),
          const SizedBox(height: 12),
          if (st.parentalPin == null)
            FilledButton.icon(onPressed: _setPin, icon: const Icon(Icons.lock_outline_rounded), label: const Text('تعيين رمز من 4 أرقام'))
          else
            Row(children: [
              StatusPill(text: 'الرقابة مفعّلة', icon: Icons.verified_user_rounded, color: p.live),
              const Spacer(),
              TextButton(onPressed: () async {
                if (await askPin(context)) { st.parentalPin = null; st.lockedGroups.clear(); s.parentalUnlocked = false; save(); }
              }, child: const Text('إلغاء الرمز')),
            ]),
          if (st.parentalPin != null) ...[
            const SizedBox(height: 16),
            Text('المجموعات المقفلة', style: t.titleSmall),
            const SizedBox(height: 8),
            if (groups.isEmpty) Text('أضف قائمة أولًا لتظهر مجموعاتها هنا.', style: t.bodySmall),
            Wrap(spacing: 8, runSpacing: 8, children: [
              for (final g in groups)
                FilterChip(label: Text(g), selected: st.lockedGroups.contains(g), onSelected: (v) {
                  v ? st.lockedGroups.add(g) : st.lockedGroups.remove(g);
                  save();
                }),
            ]),
          ],
        ]);
      case _Section.network:
        final c = TextEditingController(text: st.corsProxy);
        items.addAll([
          Text('بعض المصادر تمنع التشغيل من صفحات الويب (CORS) أو تبث بدون تشفير (http). يمكنك وضع عنوان وسيط تملكه، يُضاف قبل الرابط.',
              style: t.bodyMedium),
          const SizedBox(height: 12),
          TextField(controller: c, textDirection: TextDirection.ltr,
              decoration: const InputDecoration(labelText: 'عنوان الوسيط', hintText: 'https://proxy.example.com/?url=')),
          const SizedBox(height: 10),
          FilledButton(onPressed: () { st.corsProxy = c.text.trim(); save(); toast(context, 'حُفظ الوسيط'); }, child: const Text('حفظ')),
          const SizedBox(height: 10),
          Text('تطبيق الجوال والتلفاز لا يحتاج وسيطًا.', style: t.bodySmall),
        ]);
      case _Section.data:
        items.addAll([
          Text('كل بياناتك محفوظة على هذا الجهاز فقط. لنقلها إلى جوال أو تلفاز آخر: احفظ نسخة احتياطية ثم افتحها هناك.', style: t.bodyMedium),
          const SizedBox(height: 16),
          FilledButton.icon(
            onPressed: () async {
              final text = await s.exportBackup();
              final d = DateTime.now();
              final ok = await plat.saveTextFile('bushra-backup-${d.year}-${d.month}-${d.day}.json', text);
              if (mounted && ok) toast(this.context, 'حُفظت النسخة الاحتياطية');
            },
            icon: const Icon(Icons.download_rounded), label: const Text('حفظ نسخة احتياطية'),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: p.gold.withValues(alpha: .1), borderRadius: BorderRadius.circular(10)),
            child: Row(children: [
              Icon(Icons.info_outline_rounded, size: 16, color: p.gold),
              const SizedBox(width: 6),
              Expanded(child: Text('الملف يحتوي بيانات دخول حساباتك، فاحفظه في مكان آمن ولا ترسله لأحد.', style: t.bodySmall)),
            ]),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: () async {
              final text = await plat.pickTextFile();
              if (text == null) return;
              try {
                final n = await s.importBackup(text);
                if (mounted) { setState(() {}); toast(this.context, 'استُعيدت النسخة: $n قائمة، والمفضلة والسجل والتذكيرات'); }
              } catch (_) {
                if (mounted) toast(this.context, 'هذا الملف ليس نسخة احتياطية من البشرى', icon: Icons.error_outline_rounded);
              }
            },
            icon: const Icon(Icons.upload_rounded), label: const Text('استعادة من نسخة احتياطية'),
          ),
          const SizedBox(height: 20),
          ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.history_rounded),
              title: const Text('مسح سجل المشاهدة'), subtitle: Text('${s.history.length} عنصر'),
              onTap: () { s.clearHistory(); setState(() {}); toast(context, 'مُسح السجل'); }),
        ]);
    }
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Center(child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 680),
        child: ListView(padding: const EdgeInsets.all(16), children: items),
      )),
    );
  }

  Future<void> _setPin() async {
    final c = TextEditingController();
    final v = await showDialog<String>(context: context, builder: (ctx) => AlertDialog(
      title: const Text('رمز أبوي جديد'),
      content: TextField(controller: c, autofocus: true, keyboardType: TextInputType.number, obscureText: true, maxLength: 6,
          textAlign: TextAlign.center, decoration: const InputDecoration(hintText: '••••')),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('إلغاء')),
        FilledButton(onPressed: () => Navigator.pop(ctx, c.text), child: const Text('حفظ')),
      ],
    ));
    if (v != null && RegExp(r'^\d{4,6}$').hasMatch(v)) {
      st.parentalPin = v;
      save();
    } else if (v != null && mounted) {
      toast(context, 'الرمز يجب أن يكون من 4 إلى 6 أرقام', icon: Icons.error_outline_rounded);
    }
  }
}

class _StyleCard extends StatelessWidget {
  final String title, body;
  final bool selected, cinematic;
  final VoidCallback onTap;
  const _StyleCard({required this.title, required this.body, required this.selected, required this.onTap, this.cinematic = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return BTap(
      onTap: onTap,
      color: p.container,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(BRadius.card),
          border: Border.all(color: selected ? p.accent : p.border, width: selected ? 2 : 1),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            height: 70,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              gradient: cinematic
                  ? const LinearGradient(colors: [Color(0xFF06222B), Color(0xFF0A1424), Color(0xFF2A2210)])
                  : const LinearGradient(colors: [BColors.surfaceContainer, BColors.surface]),
            ),
            child: Center(child: Container(
              width: 70, height: 22,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                gradient: cinematic ? const LinearGradient(colors: [Color(0xFFFCCB4D), Color(0xFFC98E22)]) : null,
                color: cinematic ? null : BColors.teal,
              ),
            )),
          ),
          const SizedBox(height: 10),
          Row(children: [
            Text(title, style: t.titleSmall),
            const Spacer(),
            if (selected) Icon(Icons.check_circle_rounded, color: p.accent, size: 20),
          ]),
          Text(body, style: t.bodySmall),
        ]),
      ),
    );
  }
}
