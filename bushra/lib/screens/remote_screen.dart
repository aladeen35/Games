import 'dart:math';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../core/theme.dart';
import '../data/remote_server.dart';
import '../data/store.dart';
import '../widgets/common.dart';

/// «الجوال ريموت»: رمز QR دائم يفتح على الجوال ريموتًا كاملًا للتطبيق (أسهم، تشغيل، قنوات، صوت، بحث بالكتابة).
class RemoteScreen extends StatefulWidget {
  const RemoteScreen({super.key});
  @override
  State<RemoteScreen> createState() => _RemoteScreenState();
}

class _RemoteScreenState extends State<RemoteScreen> {
  String? url;
  bool busy = false;

  @override
  void initState() {
    super.initState();
    final st = AppStore.I.settings;
    if (!st.remoteOn) {
      st.remoteOn = true;
      AppStore.I.saveSettings();
    }
    _start();
  }

  Future<void> _start() async {
    setState(() => busy = true);
    final u = await startRemote();
    if (mounted) setState(() { url = u; busy = false; });
  }

  Future<void> _newCode() async {
    final r = Random.secure();
    AppStore.I.settings.remoteToken = List.generate(10, (_) => 'abcdefghjkmnpqrstuvwxyz23456789'[r.nextInt(31)]).join();
    AppStore.I.saveSettings();
    await _start();
    if (mounted) toast(context, 'رمز جديد: الأجهزة السابقة لم تعد تتحكم بالتطبيق', icon: Icons.lock_reset_rounded);
  }

  Future<void> _off() async {
    AppStore.I.settings.remoteOn = false;
    AppStore.I.saveSettings();
    await RemoteServer.I.stop();
    if (mounted) Navigator.of(context).maybePop();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final qr = Container(
      width: 260, height: 260, padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(22),
          boxShadow: [BoxShadow(color: p.accent.withValues(alpha: .25), blurRadius: 40)]),
      child: url == null
          ? Center(child: busy ? const CircularProgressIndicator() : const Icon(Icons.wifi_off_rounded, size: 60, color: Colors.black38))
          : QrImageView(data: url!, gapless: true,
              eyeStyle: const QrEyeStyle(eyeShape: QrEyeShape.square, color: Color(0xFF080B12)),
              dataModuleStyle: const QrDataModuleStyle(dataModuleShape: QrDataModuleShape.square, color: Color(0xFF080B12))),
    );
    Widget tip(IconData i, String s) => Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: Row(children: [
            Icon(i, color: p.accent, size: 22),
            const SizedBox(width: 12),
            Expanded(child: Text(s, style: t.bodyLarge)),
          ]),
        );
    final info = Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
      Text('جوالك ريموت للتلفاز', style: t.headlineMedium),
      const SizedBox(height: 6),
      Text('امسح الرمز مرة واحدة بكاميرا الجوال، واحفظ الصفحة على شاشته الرئيسية لتفتحها متى شئت.', style: t.bodyMedium),
      const SizedBox(height: 18),
      tip(Icons.gamepad_outlined, 'أسهم و OK ورجوع — تتنقل في التطبيق كريموت التلفاز'),
      tip(Icons.play_circle_outline_rounded, 'تشغيل وإيقاف، تقديم وتأخير، تقليب القنوات والصوت'),
      tip(Icons.keyboard_rounded, 'اكتب البحث بلوحة مفاتيح الجوال بدل الأحرف على الشاشة'),
      tip(Icons.dialpad_rounded, 'أرقام القنوات، وما يُعرض الآن على شاشة الجوال'),
      if (url != null) ...[
        const SizedBox(height: 6),
        Text('أو افتح في متصفح الجوال:', style: t.bodySmall),
        SelectableText(url!, textDirection: TextDirection.ltr, style: t.titleSmall!.copyWith(color: p.accent)),
      ] else if (!busy)
        Text('الجهاز غير متصل بشبكة محلية (Wi‑Fi أو سلك).', style: t.bodyMedium!.copyWith(color: p.danger)),
      const SizedBox(height: 16),
      Wrap(spacing: 10, runSpacing: 10, children: [
        OutlinedButton.icon(onPressed: _newCode, icon: const Icon(Icons.lock_reset_rounded), label: const Text('رمز جديد')),
        TextButton.icon(onPressed: _off, icon: const Icon(Icons.power_settings_new_rounded), label: const Text('إيقاف الريموت')),
      ]),
      const SizedBox(height: 10),
      Text('يعمل على شبكة البيت فقط، وبالرمز الظاهر هنا فقط.', style: t.bodySmall),
    ]);
    return Scaffold(
      appBar: AppBar(title: const Text('الجوال ريموت')),
      body: SafeArea(child: Center(child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 940),
          child: context.isWide
              ? Row(children: [qr, const SizedBox(width: 40), Expanded(child: info)])
              : Column(children: [qr, const SizedBox(height: 24), info]),
        ),
      ))),
    );
  }
}

/// يشغّل خادم ريموت الجوال إن كان مفعّلًا (برمز دائم يُنشأ مرة واحدة).
Future<String?> startRemote() async {
  final st = AppStore.I.settings;
  if (!RemoteServer.supported || !st.remoteOn) return null;
  if (st.remoteToken == null) {
    final r = Random.secure();
    st.remoteToken = List.generate(10, (_) => 'abcdefghjkmnpqrstuvwxyz23456789'[r.nextInt(31)]).join();
    AppStore.I.saveSettings();
  }
  try {
    return await RemoteServer.I.start(st.remoteToken!);
  } catch (_) {
    return null;
  }
}
