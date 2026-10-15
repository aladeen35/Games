import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../player/player_screen.dart';
import '../widgets/common.dart';

/// ملفاتي: فيديوهات الجوال/الحاسوب، وتشغيل رابط مباشر.
class LocalScreen extends StatelessWidget {
  const LocalScreen({super.key});

  Future<void> _pick(BuildContext context) async {
    final v = await plat.pickVideos();
    if (v.isEmpty) return;
    AppStore.I.addLocal(v);
    if (context.mounted) {
      if (v.length == 1) {
        openPlayer(context, v.first.toPlayable());
      } else {
        toast(context, 'أُضيف ${v.length} فيديو');
      }
    }
  }

  Future<void> _url(BuildContext context) async {
    final c = TextEditingController();
    final u = await showDialog<String>(context: context, builder: (ctx) => AlertDialog(
      title: const Text('تشغيل رابط مباشر'),
      content: TextField(controller: c, autofocus: true, textDirection: TextDirection.ltr, keyboardType: TextInputType.url,
          decoration: const InputDecoration(hintText: 'https://…/video.m3u8 أو mp4'), onSubmitted: (v) => Navigator.pop(ctx, v)),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('إلغاء')),
        FilledButton(onPressed: () => Navigator.pop(ctx, c.text), child: const Text('شاهد الآن')),
      ],
    ));
    if (u == null || u.trim().isEmpty || !context.mounted) return;
    final url = u.trim();
    final live = url.contains('.m3u8') || url.contains('/live/');
    openPlayer(context, Playable(key: 'url:$url', title: Uri.tryParse(url)?.pathSegments.lastOrNull ?? 'رابط مباشر',
        subtitle: Uri.tryParse(url)?.host, url: url, isLive: live));
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    final hp = context.isTv ? MediaQuery.sizeOf(context).width * .04 : (context.isWide ? 24.0 : 16.0);
    return SafeArea(
      bottom: false,
      child: ListView(padding: EdgeInsets.fromLTRB(hp, 14, hp, 32), children: [
        Text('ملفاتي', style: t.headlineSmall),
        const SizedBox(height: 4),
        Text('شغّل فيديوهات جوالك وملفاتك مباشرة — MP4 و MKV و MOV وغيرها، دون رفعها لأي مكان.', style: t.bodySmall),
        const SizedBox(height: 16),
        Row(children: [
          Expanded(child: _Action(icon: Icons.video_library_rounded, title: 'فيديو من الجهاز',
              body: kIsWeb ? 'من حاسوبك أو جوالك' : 'من المعرض أو الملفات', onTap: () => _pick(context), primary: true)),
          const SizedBox(width: 12),
          Expanded(child: _Action(icon: Icons.link_rounded, title: 'رابط مباشر', body: 'HLS أو MP4', onTap: () => _url(context))),
        ]),
        if (kIsWeb) ...[
          const SizedBox(height: 10),
          Text('على المتصفح تبقى الملفات متاحة حتى تغلق الصفحة فقط.', style: t.bodySmall),
        ],
        const SizedBox(height: 20),
        if (s.localVideos.isEmpty)
          EmptyState(icon: Icons.smartphone_rounded, title: 'لا توجد ملفات بعد',
              body: 'اختر فيديو من جهازك ليظهر هنا، مع حفظ موضع التوقف لتكمل لاحقًا.')
        else
          for (final v in s.localVideos) Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Builder(builder: (context) {
              final h = s.historyOf('local:${v.uri}');
              return BTap(
                color: p.container,
                onTap: () => openPlayer(context, v.toPlayable(),
                    queue: [for (final x in s.localVideos) x.toPlayable()]),
                padding: const EdgeInsets.all(12),
                child: Row(children: [
                  Container(
                    width: 64, height: 44,
                    decoration: BoxDecoration(color: p.highlight, borderRadius: BorderRadius.circular(10)),
                    child: Icon(Icons.play_circle_fill_rounded, color: p.accent),
                  ),
                  const SizedBox(width: 12),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(v.name, maxLines: 1, overflow: TextOverflow.ellipsis, style: t.titleSmall),
                    Text([
                      if (v.size != null) fmtSize(v.size),
                      if (h != null && h.resumable) 'توقفت عند ${fmtDur(Duration(milliseconds: h.positionMs))}',
                      if (h != null && h.progress >= .95) 'شوهد',
                    ].join(' · '), style: t.bodySmall),
                    if (h != null && h.durationMs > 0) ...[
                      const SizedBox(height: 6),
                      Directionality(textDirection: TextDirection.ltr,
                          child: LinearProgressIndicator(value: h.progress, minHeight: 3)),
                    ],
                  ])),
                  IconButton(onPressed: () => s.removeLocal(v), tooltip: 'إزالة من القائمة', icon: const Icon(Icons.close_rounded)),
                ]),
              );
            }),
          ),
      ]),
    );
  }
}

class _Action extends StatelessWidget {
  final IconData icon;
  final String title, body;
  final VoidCallback onTap;
  final bool primary;
  const _Action({required this.icon, required this.title, required this.body, required this.onTap, this.primary = false});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return BTap(
      onTap: onTap,
      color: primary ? p.accent.withValues(alpha: .14) : p.container,
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Icon(icon, color: primary ? p.accent : p.text2, size: 28),
        const SizedBox(height: 10),
        Text(title, style: t.titleSmall),
        Text(body, style: t.bodySmall),
      ]),
    );
  }
}
