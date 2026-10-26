import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/net.dart';
import '../data/pairing.dart';
import '../data/store.dart';
import '../widgets/common.dart';

/// «أضف من جوالك»: رمز QR يفتح صفحة على الجوال يُلصق فيها الرابط، فيصل للتلفاز مباشرة.
class PairScreen extends StatefulWidget {
  const PairScreen({super.key});
  @override
  State<PairScreen> createState() => _PairScreenState();
}

class _PairScreenState extends State<PairScreen> {
  final server = PairServer();
  String? url;
  bool starting = true;
  final log = <({bool ok, String text, bool busy})>[];

  @override
  void initState() {
    super.initState();
    server.start(_onSubmit).then((u) {
      if (mounted) setState(() { url = u; starting = false; });
    }).catchError((_) {
      if (mounted) setState(() => starting = false);
    });
  }

  @override
  void dispose() {
    server.stop();
    super.dispose();
  }

  Future<({bool ok, String message})> _onSubmit(Map<String, String> f) async {
    final s = AppStore.I;
    final xt = f['type'] == 'xtream';
    final label = (f['name'] ?? '').isNotEmpty ? f['name']! : (xt ? f['server']! : Net.safeHost(f['url'] ?? ''));
    if (mounted) setState(() => log.insert(0, (ok: false, text: 'وصل من الجوال: $label — جارٍ الاختبار…', busy: true)));
    ({bool ok, String message}) out;
    try {
      final p = await s.testSource(
        type: xt ? SourceType.xtream : SourceType.m3uUrl, name: f['name'], url: f['url'],
        server: f['server'], username: f['user'], password: f['pass'],
      );
      await s.commit(p);
      if (!s.settings.onboarded) {
        s.settings.onboarded = true;
        s.saveSettings();
      }
      out = (ok: true, message: 'أُضيفت «${p.source.name}» إلى التلفاز: ${p.channels.length} عنصر');
    } on NetError catch (e) {
      out = (ok: false, message: e.message);
    } catch (_) {
      out = (ok: false, message: 'تعذر قراءة المصدر. تحقق من الرابط أو بيانات الدخول.');
    }
    if (mounted) setState(() => log[0] = (ok: out.ok, text: out.message, busy: false));
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final wide = context.isWide;
    final qr = Container(
      width: 280, height: 280,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(22),
          boxShadow: [BoxShadow(color: p.accent.withValues(alpha: .25), blurRadius: 40)]),
      child: url == null
          ? Center(child: starting ? const CircularProgressIndicator() : const Icon(Icons.wifi_off_rounded, size: 64, color: Colors.black38))
          : QrImageView(data: url!, version: QrVersions.auto, gapless: true,
              eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: Color(0xFF080B12)),
              dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: Color(0xFF080B12))),
    );
    Widget step(int n, String text) => Padding(
          padding: const EdgeInsets.only(bottom: 14),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(
              width: 30, height: 30, alignment: Alignment.center,
              decoration: BoxDecoration(shape: BoxShape.circle, color: p.accent.withValues(alpha: .16), border: Border.all(color: p.accent)),
              child: Text('$n', style: t.labelLarge!.copyWith(color: p.accent)),
            ),
            const SizedBox(width: 12),
            Expanded(child: Padding(padding: const EdgeInsets.only(top: 4), child: Text(text, style: t.bodyLarge))),
          ]),
        );
    final info = Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
      Text('أضف قائمتك من الجوال', style: t.headlineMedium),
      const SizedBox(height: 6),
      Text('بلا كتابة بالريموت: الرابط يُلصق على الجوال ويصل للتلفاز فورًا.', style: t.bodyMedium),
      const SizedBox(height: 22),
      step(1, 'افتح كاميرا الجوال وامسح الرمز.'),
      step(2, 'في الصفحة التي تفتح: الصق رابط القائمة أو بيانات حساب المزود.'),
      step(3, 'اضغط «أرسل إلى التلفاز» — تظهر القنوات هنا مباشرة.'),
      if (url != null) ...[
        const SizedBox(height: 4),
        Text('أو اكتب هذا العنوان في متصفح الجوال:', style: t.bodySmall),
        const SizedBox(height: 4),
        SelectableText(url!, textDirection: TextDirection.ltr, style: t.titleSmall!.copyWith(color: p.accent)),
      ] else if (!starting) ...[
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: p.danger.withValues(alpha: .1), borderRadius: BorderRadius.circular(12)),
          child: Text('الجهاز غير متصل بشبكة محلية (Wi‑Fi أو سلك). اتصل بالشبكة ثم افتح هذه الصفحة من جديد.', style: t.bodyMedium),
        ),
      ],
      const SizedBox(height: 12),
      Row(children: [
        Icon(Icons.wifi_rounded, size: 18, color: p.text3),
        const SizedBox(width: 6),
        Expanded(child: Text('يجب أن يكون الجوال والتلفاز على شبكة Wi‑Fi نفسها.', style: t.bodySmall)),
      ]),
    ]);
    return Scaffold(
      appBar: AppBar(title: const Text('من جوالك')),
      body: SafeArea(child: Center(child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 980),
          child: Column(children: [
            if (wide)
              Row(crossAxisAlignment: CrossAxisAlignment.center, children: [qr, const SizedBox(width: 40), Expanded(child: info)])
            else ...[qr, const SizedBox(height: 24), info],
            if (log.isNotEmpty) ...[
              const SizedBox(height: 28),
              for (final e in log)
                Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: e.busy ? p.container : (e.ok ? p.live : p.danger).withValues(alpha: .1),
                    borderRadius: BorderRadius.circular(BRadius.card),
                  ),
                  child: Row(children: [
                    if (e.busy)
                      const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(strokeWidth: 2.5))
                    else
                      Icon(e.ok ? Icons.check_circle_rounded : Icons.error_outline_rounded, color: e.ok ? p.live : p.danger),
                    const SizedBox(width: 12),
                    Expanded(child: Text(e.text, style: t.bodyLarge)),
                  ]),
                ),
              if (log.any((e) => e.ok))
                Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: FilledButton.icon(
                    autofocus: true,
                    onPressed: () => Navigator.of(context).popUntil((r) => r.isFirst),
                    icon: const Icon(Icons.live_tv_rounded),
                    label: const Text('ابدأ المشاهدة'),
                  ),
                ),
            ],
          ]),
        ),
      ))),
    );
  }
}

/// يفتح «من جوالك» إن كان مدعومًا على هذا الجهاز.
void openPairScreen(BuildContext context) {
  if (!PairServer.supported) {
    toast(context, 'متاح في تطبيق الجوال والتلفاز', icon: Icons.info_outline_rounded);
    return;
  }
  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const PairScreen()));
}
