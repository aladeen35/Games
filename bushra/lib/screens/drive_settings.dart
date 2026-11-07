import 'dart:async';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../drive/drive_mode.dart';
import '../widgets/common.dart';

/// إعدادات «وضع القيادة»: الأذونات، الأمان أثناء الحركة، الكاميرا، والخرائط.
class DriveSettingsScreen extends StatefulWidget {
  const DriveSettingsScreen({super.key});
  @override
  State<DriveSettingsScreen> createState() => _DriveSettingsScreenState();
}

class _DriveSettingsScreenState extends State<DriveSettingsScreen> with WidgetsBindingObserver {
  DriveStatus st = const DriveStatus();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _load();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  // العودة من صفحة إذن النظام تحدّث الحالة
  @override
  void didChangeAppLifecycleState(AppLifecycleState s) {
    if (s == AppLifecycleState.resumed) _load();
  }

  Future<void> _load() async {
    final v = await DriveMode.status();
    if (mounted) setState(() => st = v);
  }

  Future<void> _set(String k, Object v) async {
    await DriveMode.setPref(k, v);
    await _load();
  }

  Future<void> _askPermissions() async {
    await DriveMode.requestPermissions();
    await Future<void>.delayed(const Duration(milliseconds: 600));
    await _load();
  }

  /// تشغيل سريع: آخر قناة شوهدت + المفضلة كطابور، أو الكاميرا والخرائط فقط.
  Future<void> _startNow() async {
    if (!st.overlay) {
      await DriveMode.requestOverlay();
      return;
    }
    final s = AppStore.I;
    final queue = <Playable>[
      for (final c in s.favorites.values.where(s.allowed)) Playable.channel(c),
    ];
    // آخر ما شوهد، مع احترام قيود ملف الأطفال
    bool ok(Playable x) {
      final c = x.channelId == null ? null : s.channelById(x.channelId!);
      return c == null ? !s.profile.kids : s.allowed(c);
    }
    final last = s.history.map((h) => h.item).where(ok).firstOrNull;
    if (last != null && !queue.any((q) => q.key == last.key)) queue.insert(0, last);
    if (queue.isEmpty) {
      await DriveMode.cameraOnly();
      await DriveMode.openMaps();
    } else {
      await DriveMode.start(queue, 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final speedLock = st.pref('speed_lock', true);
    final kmh = st.intPref('speed_kmh', 8);
    final camId = st.strPref('cam_id', '');
    final maps = st.strPref('maps_pkg', 'com.google.android.apps.maps');

    Widget card(List<Widget> children) => Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(18), border: Border.all(color: p.border)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: children),
        );
    Widget head(IconData i, String s, Color c) => Padding(
          padding: const EdgeInsets.only(bottom: 4),
          child: Row(children: [Icon(i, color: c, size: 22), const SizedBox(width: 10), Text(s, style: t.titleMedium)]),
        );
    Widget sw(String title, String sub, bool v, ValueChanged<bool> on) => SwitchListTile(
        contentPadding: EdgeInsets.zero, title: Text(title), subtitle: Text(sub), value: v, onChanged: on);
    Widget perm(String title, String sub, bool ok, VoidCallback fix) => ListTile(
          contentPadding: EdgeInsets.zero,
          leading: Icon(ok ? Icons.check_circle_rounded : Icons.error_outline_rounded, color: ok ? p.live : p.gold),
          title: Text(title),
          subtitle: Text(sub),
          trailing: ok ? null : TextButton(onPressed: fix, child: const Text('السماح')),
        );

    return Scaffold(
      appBar: AppBar(title: const Text('وضع القيادة')),
      body: ListView(padding: const EdgeInsets.fromLTRB(16, 8, 16, 32), children: [
        // ———— البطاقة الرئيسية ————
        Container(
          margin: const EdgeInsets.only(bottom: 14),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22),
            gradient: const LinearGradient(colors: [BColors.tealDeep, Color(0xFF0A1B3A)], begin: Alignment.topRight, end: Alignment.bottomLeft),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(children: [
              const Icon(Icons.directions_car_filled_rounded, color: BColors.gold, size: 34),
              const SizedBox(width: 12),
              Expanded(child: Text('البشرى في السيارة', style: t.titleLarge!.copyWith(color: Colors.white))),
            ]),
            const SizedBox(height: 8),
            Text('القناة في نافذة عائمة فوق الخرائط، والكاميرا الخلفية كمرآة في زاوية الشاشة. '
                'من المشغل اضغط زر السيارة 🚗 لتحويل ما تشاهده إلى وضع القيادة.',
                style: t.bodyMedium!.copyWith(color: Colors.white70)),
            const SizedBox(height: 14),
            Wrap(spacing: 10, runSpacing: 10, children: [
              FilledButton.icon(
                style: FilledButton.styleFrom(backgroundColor: BColors.gold, foregroundColor: BColors.midnight950),
                onPressed: _startNow,
                icon: const Icon(Icons.play_arrow_rounded),
                label: const Text('ابدأ الآن'),
              ),
              if (st.running)
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white54)),
                  onPressed: () async { await DriveMode.stop(); await Future<void>.delayed(const Duration(milliseconds: 300)); _load(); },
                  icon: const Icon(Icons.stop_rounded),
                  label: const Text('إنهاء'),
                ),
            ]),
          ]),
        ),

        card([
          head(Icons.verified_user_outlined, 'الأذونات', p.accent),
          perm('الظهور فوق التطبيقات', 'للنوافذ العائمة فوق الخرائط', st.overlay, DriveMode.requestOverlay),
          perm('الكاميرا', 'لمرآة الكاميرا الخلفية', st.camera, _askPermissions),
          perm('الموقع', 'لمعرفة السرعة وقفل الصورة أثناء الحركة', st.location, _askPermissions),
        ]),

        card([
          head(Icons.shield_moon_outlined, 'الأمان أثناء القيادة', p.gold),
          sw('إخفاء الصورة أثناء الحركة', 'السلامة أولًا: الصوت فقط حين تتحرك السيارة', speedLock, (v) => _set('speed_lock', v)),
          if (speedLock) ...[
            sw('إيقاف الفيديو تمامًا', 'بدل الإبقاء على الصوت', st.pref('pause', false), (v) => _set('pause', v)),
            Row(children: [
              Expanded(child: Text('يبدأ القفل عند $kmh كم/س', style: t.bodyLarge)),
              IconButton.filledTonal(onPressed: kmh > 3 ? () => _set('speed_kmh', kmh - 1) : null, icon: const Icon(Icons.remove_rounded)),
              const SizedBox(width: 6),
              IconButton.filledTonal(onPressed: kmh < 40 ? () => _set('speed_kmh', kmh + 1) : null, icon: const Icon(Icons.add_rounded)),
            ]),
          ],
        ]),

        card([
          head(Icons.videocam_outlined, 'مرآة الكاميرا الخلفية', p.accent),
          sw('إظهار الكاميرا مع وضع القيادة', 'نافذة صغيرة أعلى الشاشة', st.pref('camera_on', true), (v) => _set('camera_on', v)),
          sw('عكس الصورة كالمرآة', 'اليمين يمين كما في المرآة الحقيقية', st.pref('cam_mirror', true), (v) => _set('cam_mirror', v)),
          const SizedBox(height: 6),
          if (st.cameras.isEmpty)
            Text('لم تُعثر على كاميرا متاحة للتطبيقات على هذا الجهاز.', style: t.bodySmall)
          else ...[
            Text('الكاميرا', style: t.titleSmall),
            const SizedBox(height: 8),
            Wrap(spacing: 8, runSpacing: 8, children: [
              ChoiceChip(label: const Text('تلقائي'), selected: camId.isEmpty, onSelected: (_) => _set('cam_id', '')),
              for (final c in st.cameras)
                ChoiceChip(
                  label: Text('كاميرا ${c.id} · ${switch (c.facing) { 'back' => 'خلفية', 'front' => 'أمامية', _ => 'خارجية' }}'),
                  selected: camId == c.id,
                  onSelected: (_) => _set('cam_id', c.id),
                ),
            ]),
            const SizedBox(height: 10),
            OutlinedButton.icon(
              onPressed: () async {
                final r = await DriveMode.cameraOnly();
                if (r == 'overlay') await DriveMode.requestOverlay();
              },
              icon: const Icon(Icons.flip_camera_android_rounded),
              label: const Text('تجربة الكاميرا'),
            ),
          ],
        ]),

        card([
          head(Icons.map_outlined, 'الخرائط', p.gold),
          sw('فتح الخرائط تلقائيًا', 'تعمل تحت النوافذ العائمة', st.pref('maps_on', true), (v) => _set('maps_on', v)),
          const SizedBox(height: 6),
          SegmentedButton<String>(
            showSelectedIcon: false,
            segments: [
              ButtonSegment(value: 'com.google.android.apps.maps', label: Text(st.googleMaps ? 'خرائط Google' : 'خرائط Google (غير مثبت)')),
              ButtonSegment(value: 'com.waze', label: Text(st.waze ? 'Waze' : 'Waze (غير مثبت)')),
            ],
            selected: {maps},
            onSelectionChanged: (v) => _set('maps_pkg', v.first),
          ),
        ]),

        Text('اسحب النافذة من شريطها، وغيّر حجمها من الزاوية ◢، واضغط على العنوان لتصغيرها مع استمرار الصوت. '
            'زر ↗ يرجعك للبشرى بملء الشاشة على القناة نفسها.', style: t.bodySmall),
      ]),
    );
  }
}

/// يحوّل ما يُشاهد الآن إلى وضع القيادة (يُستدعى من المشغل).
Future<bool> startDriveFromPlayer(BuildContext context, Playable item, List<Playable>? queue, Duration position) async {
  final q = (queue == null || queue.isEmpty) ? [item] : queue;
  var idx = q.indexWhere((x) => x.key == item.key);
  final list = idx < 0 ? [item, ...q] : q;
  if (idx < 0) idx = 0;
  final st = await DriveMode.status();
  if (!st.overlay || !st.location || !st.camera) {
    if (!context.mounted) return false;
    final go = await showDialog<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: const Text('وضع القيادة'),
        content: const Text('يحتاج وضع القيادة إذن «الظهور فوق التطبيقات»، والكاميرا للمرآة الخلفية، والموقع لقفل الصورة أثناء الحركة.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('لاحقًا')),
          FilledButton(onPressed: () => Navigator.pop(c, true), child: const Text('الإعدادات')),
        ],
      ),
    );
    if (go == true && context.mounted) {
      unawaited(Navigator.of(context).push(MaterialPageRoute(builder: (_) => const DriveSettingsScreen())));
    }
    if (!st.overlay) return false;
  }
  final r = await DriveMode.start(list, idx, position: position);
  if (r != 'ok' && context.mounted) toast(context, 'تعذّر تشغيل وضع القيادة', icon: Icons.error_outline_rounded);
  return r == 'ok';
}
