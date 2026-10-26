import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/net.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../widgets/common.dart';
import '../data/pairing.dart';
import 'pair_screen.dart';

Future<void> openAddSource(BuildContext context, {Source? editing, SourceType? type}) =>
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => AddSourceScreen(editing: editing, initialType: type)));

/// إضافة مصدر: ثلاث بطاقات واضحة ← نموذج ← اختبار ← معاينة ← حفظ.
class AddSourceScreen extends StatefulWidget {
  final Source? editing;
  final SourceType? initialType;
  const AddSourceScreen({super.key, this.editing, this.initialType});
  @override
  State<AddSourceScreen> createState() => _AddSourceScreenState();
}

class _AddSourceScreenState extends State<AddSourceScreen> {
  SourceType? type;
  final name = TextEditingController(), url = TextEditingController();
  final server = TextEditingController(), user = TextEditingController(), pass = TextEditingController();
  ({String name, String text})? file;
  bool busy = false, showPass = false;
  String? error;
  SourcePreview? preview;

  @override
  void initState() {
    super.initState();
    type = widget.editing?.type ?? widget.initialType;
    final e = widget.editing;
    if (e != null) {
      name.text = e.name;
      AppStore.I.secretOf(e.id).then((sec) {
        if (!mounted) return;
        setState(() {
          url.text = sec.url ?? '';
          server.text = sec.server ?? '';
          user.text = sec.username ?? '';
          pass.text = sec.password ?? '';
        });
      });
    }
  }

  Future<void> _test() async {
    setState(() { busy = true; error = null; preview = null; });
    try {
      final p = await AppStore.I.testSource(
        type: type!, name: name.text, url: url.text, fileText: file?.text, fileName: file?.name,
        server: server.text, username: user.text, password: pass.text, existingId: widget.editing?.id,
      );
      setState(() => preview = p);
    } on NetError catch (e) {
      setState(() => error = e.message);
    } catch (e) {
      setState(() => error = 'تعذر قراءة المصدر. تحقق من الرابط أو بيانات الدخول.');
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  Future<void> _save() async {
    final s = AppStore.I;
    await s.commit(preview!);
    if (!s.settings.onboarded) {
      s.settings.onboarded = true;
      s.saveSettings();
    }
    if (!mounted) return;
    Navigator.of(context).popUntil((r) => r.isFirst);
    toast(context, 'تمت إضافة القائمة \u2068${preview!.source.name}\u2069 بعدد ${preview!.channels.length} عنصر');
  }

  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: Text(widget.editing != null ? 'تعديل المصدر' : 'إضافة قائمة')),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 640),
            child: ListView(padding: const EdgeInsets.all(16), children: [
              if (preview != null)
                _Preview(p: preview!, onSave: _save, onBack: () => setState(() => preview = null))
              else if (type == null) ...[
                Text('من أين تأتي قنواتك؟', style: t.headlineSmall),
                const SizedBox(height: 6),
                Text('اختر طريقة واحدة، ويمكنك إضافة مصادر أخرى لاحقًا.', style: t.bodyMedium),
                const SizedBox(height: 20),
                // على التلفاز: الإضافة من الجوال أولًا (لا كتابة بالريموت)
                if (PairServer.supported && context.isTv) _pairCard(context, autofocus: true),
                _TypeCard(icon: Icons.link_rounded, title: 'رابط قائمة', body: 'رابط M3U أو M3U8 من مزود الخدمة.',
                    autofocus: !context.isTv, onTap: () => setState(() => type = SourceType.m3uUrl)),
                _TypeCard(icon: Icons.upload_file_rounded, title: 'ملف من الجهاز', body: 'ملف M3U/M3U8 محفوظ على جوالك أو حاسوبك.',
                    onTap: () => setState(() => type = SourceType.m3uFile)),
                _TypeCard(icon: Icons.manage_accounts_outlined, title: 'مزود أو حساب', body: 'الخادم واسم المستخدم وكلمة المرور (Xtream Codes).',
                    onTap: () => setState(() => type = SourceType.xtream)),
                if (PairServer.supported && !context.isTv) _pairCard(context),
                const SizedBox(height: 16),
                _rightsNote(context),
              ] else
                _form(context),
            ]),
          ),
        ),
      ),
    );
  }

  Widget _form(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final fields = <Widget>[
      TextField(controller: name, decoration: const InputDecoration(labelText: 'اسم القائمة (اختياري)', prefixIcon: Icon(Icons.label_outline_rounded))),
      const SizedBox(height: 12),
    ];
    switch (type!) {
      case SourceType.m3uUrl:
        fields.add(TextField(
          controller: url, autofocus: true, keyboardType: TextInputType.url, textDirection: TextDirection.ltr,
          decoration: const InputDecoration(labelText: 'رابط القائمة', hintText: 'https://example.com/playlist.m3u', prefixIcon: Icon(Icons.link_rounded)),
          onSubmitted: (_) => _test(),
        ));
      case SourceType.m3uFile:
        fields.add(BTap(
          color: p.dark ? p.container : p.bg,
          radius: BRadius.button,
          autofocus: true,
          onTap: () async {
            final f = await plat.pickPlaylistFile();
            if (f != null) setState(() => file = f);
          },
          padding: const EdgeInsets.all(18),
          child: Row(children: [
            Icon(file == null ? Icons.upload_file_rounded : Icons.check_circle_rounded, color: p.accent, size: 28),
            const SizedBox(width: 12),
            Expanded(child: Text(file?.name ?? 'اختر ملف M3U أو M3U8', style: t.titleSmall)),
          ]),
        ));
      case SourceType.xtream:
        fields.addAll([
          TextField(controller: server, autofocus: true, keyboardType: TextInputType.url, textDirection: TextDirection.ltr,
              decoration: const InputDecoration(labelText: 'عنوان الخادم', hintText: 'http://server.com:8080', prefixIcon: Icon(Icons.dns_outlined))),
          const SizedBox(height: 12),
          TextField(controller: user, textDirection: TextDirection.ltr, autocorrect: false,
              decoration: const InputDecoration(labelText: 'اسم المستخدم', prefixIcon: Icon(Icons.person_outline_rounded))),
          const SizedBox(height: 12),
          TextField(controller: pass, obscureText: !showPass, textDirection: TextDirection.ltr, autocorrect: false,
              onSubmitted: (_) => _test(),
              decoration: InputDecoration(labelText: 'كلمة المرور', prefixIcon: const Icon(Icons.key_outlined),
                  suffixIcon: IconButton(onPressed: () => setState(() => showPass = !showPass),
                      tooltip: showPass ? 'إخفاء' : 'إظهار',
                      icon: Icon(showPass ? Icons.visibility_off_outlined : Icons.visibility_outlined)))),
        ]);
    }
    final canTest = switch (type!) {
      SourceType.m3uUrl => url.text.trim().isNotEmpty,
      SourceType.m3uFile => file != null,
      SourceType.xtream => server.text.trim().isNotEmpty && user.text.trim().isNotEmpty,
    };
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Row(children: [
        if (widget.editing == null)
          IconButton(onPressed: () => setState(() { type = null; error = null; }), icon: const Icon(Icons.arrow_forward_rounded), tooltip: 'رجوع'),
        Text(switch (type!) { SourceType.m3uUrl => 'رابط قائمة', SourceType.m3uFile => 'ملف من الجهاز', SourceType.xtream => 'مزود أو حساب' },
            style: t.headlineSmall),
      ]),
      const SizedBox(height: 16),
      ...fields,
      if (error != null) ...[
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: p.danger.withValues(alpha: .1), borderRadius: BorderRadius.circular(12)),
          child: Row(children: [
            Icon(Icons.error_outline_rounded, color: p.danger),
            const SizedBox(width: 10),
            Expanded(child: Text(error!, style: t.bodyMedium!.copyWith(color: p.text))),
          ]),
        ),
      ],
      const SizedBox(height: 20),
      ListenableBuilder(
        listenable: Listenable.merge([url, server, user]),
        builder: (_, _) => FilledButton.icon(
          onPressed: busy || !(switch (type!) {
            SourceType.m3uUrl => url.text.trim().isNotEmpty,
            SourceType.m3uFile => file != null,
            SourceType.xtream => server.text.trim().isNotEmpty && user.text.trim().isNotEmpty,
          }) ? null : _test,
          icon: busy
              ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
              : const Icon(Icons.network_check_rounded),
          label: Text(busy ? 'جارٍ اختبار المصدر…' : 'اختبار ومعاينة'),
        ),
      ),
      if (!canTest && type == SourceType.m3uFile) const SizedBox.shrink(),
      const SizedBox(height: 16),
      _rightsNote(context),
    ]);
  }
}

Widget _pairCard(BuildContext context, {bool autofocus = false}) => _TypeCard(
      icon: Icons.qr_code_2_rounded, title: 'من جوالك (رمز QR)', autofocus: autofocus,
      body: 'امسح الرمز بكاميرا الجوال والصق الرابط هناك — يصل هنا فورًا.',
      onTap: () => openPairScreen(context),
    );

Widget _rightsNote(BuildContext context) => Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Icon(Icons.verified_user_outlined, size: 18, color: context.bc.text3),
      const SizedBox(width: 8),
      Expanded(child: Text(
        'البشرى أداة تشغيل وتنظيم فقط، ولا يوفّر أي محتوى. أنت مسؤول عن امتلاك حق استخدام المصادر التي تضيفها.',
        style: Theme.of(context).textTheme.bodySmall,
      )),
    ]);

class _TypeCard extends StatelessWidget {
  final IconData icon;
  final String title, body;
  final VoidCallback onTap;
  final bool autofocus;
  const _TypeCard({required this.icon, required this.title, required this.body, required this.onTap, this.autofocus = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: BTap(
        autofocus: autofocus,
        color: p.container,
        onTap: onTap,
        padding: const EdgeInsets.all(18),
        child: Row(children: [
          Container(
            width: 52, height: 52,
            decoration: BoxDecoration(color: p.accent.withValues(alpha: .12), borderRadius: BorderRadius.circular(14)),
            child: Icon(icon, color: p.accent, size: 26),
          ),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(title, style: t.titleMedium),
            const SizedBox(height: 2),
            Text(body, style: t.bodyMedium),
          ])),
          Icon(Icons.chevron_left_rounded, color: p.text3),
        ]),
      ),
    );
  }
}

class _Preview extends StatelessWidget {
  final SourcePreview p;
  final VoidCallback onSave, onBack;
  const _Preview({required this.p, required this.onSave, required this.onBack});
  @override
  Widget build(BuildContext context) {
    final c = context.bc;
    final t = Theme.of(context).textTheme;
    final src = p.source;
    final ms = p.latency.inMilliseconds;
    Widget row(IconData i, String k, String v, {bool ok = true}) => Padding(
          padding: const EdgeInsets.symmetric(vertical: 7),
          child: Row(children: [
            Icon(i, size: 20, color: ok ? c.accent : c.text3),
            const SizedBox(width: 12),
            Expanded(child: Text(k, style: t.bodyLarge)),
            Text(v, style: t.titleSmall),
          ]),
        );
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(color: c.live.withValues(alpha: .1), borderRadius: BorderRadius.circular(BRadius.card)),
        child: Row(children: [
          Icon(Icons.check_circle_rounded, color: c.live, size: 30),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('نجح الاختبار', style: t.titleMedium),
            Text(ms > 0 ? 'استجاب المصدر خلال ${(ms / 1000).toStringAsFixed(1)} ث — ${ms < 1500 ? 'اتصال سريع' : ms < 4000 ? 'اتصال جيد' : 'اتصال بطيء'}' : 'قُرئ الملف بنجاح',
                style: t.bodyMedium),
          ])),
        ]),
      ),
      const SizedBox(height: 18),
      Text(src.name, style: t.headlineSmall),
      Text(src.displayHost, style: t.bodySmall),
      const SizedBox(height: 12),
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(color: c.container, borderRadius: BorderRadius.circular(BRadius.card)),
        child: Column(children: [
          row(Icons.sensors_rounded, 'القنوات المباشرة', '${src.liveCount}'),
          if (src.vodCount > 0) row(Icons.movie_outlined, 'أفلام ومسلسلات', '${src.vodCount}'),
          row(Icons.category_outlined, 'المجموعات المكتشفة', '${src.groups.length}'),
          row(src.hasLogos ? Icons.image_outlined : Icons.hide_image_outlined, 'شعارات القنوات', src.hasLogos ? 'متوفرة' : 'غير متوفرة', ok: src.hasLogos),
          row(src.hasEpg ? Icons.calendar_month_outlined : Icons.event_busy_outlined, 'دليل البرامج', src.hasEpg ? 'متوفر' : 'غير متوفر', ok: src.hasEpg),
          row(Icons.schedule_rounded, 'آخر تحديث', 'الآن'),
          if (p.accountNote != null) row(Icons.event_available_outlined, 'الاشتراك', p.accountNote!),
        ]),
      ),
      const SizedBox(height: 14),
      Wrap(spacing: 8, runSpacing: 8, children: [
        for (final g in src.groups.take(14)) Chip(label: Text(g)),
        if (src.groups.length > 14) Chip(label: Text('+${src.groups.length - 14}')),
      ]),
      const SizedBox(height: 22),
      FilledButton.icon(autofocus: true, onPressed: onSave, icon: const Icon(Icons.check_rounded), label: const Text('حفظ والمتابعة')),
      const SizedBox(height: 8),
      TextButton(onPressed: onBack, child: const Text('تعديل البيانات')),
    ]);
  }
}
