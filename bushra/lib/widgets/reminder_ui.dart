import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/reminders.dart';
import '../data/store.dart';
import 'common.dart';

/// زر التذكير لبرنامج قادم: يضبط التذكير بعد تنبيه صغير، أو يلغيه.
class ReminderButton extends StatelessWidget {
  final Channel channel;
  final EpgProgram program;
  final bool expanded;
  const ReminderButton({super.key, required this.channel, required this.program, this.expanded = true});

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: AppStore.I,
      builder: (context, _) {
        final r = AppStore.I.reminderFor(channel.id, program.start);
        final on = r != null;
        final icon = Icon(on ? Icons.notifications_active_rounded : Icons.notifications_none_rounded, color: on ? context.bc.gold : null);
        void tap() => on ? _cancel(context, r) : setReminder(context, channel, program);
        if (!expanded) {
          return IconButton(onPressed: tap, icon: icon, tooltip: on ? 'إلغاء التذكير' : 'تذكير');
        }
        return OutlinedButton.icon(onPressed: tap, icon: icon, label: Text(on ? 'إلغاء التذكير' : 'تذكير'));
      },
    );
  }

  Future<void> _cancel(BuildContext context, Reminder r) async {
    await AppStore.I.removeReminder(r);
    if (context.mounted) toast(context, 'أُلغي التذكير', icon: Icons.notifications_off_outlined);
  }
}

/// حوار ضبط التذكير مع تنبيه صغير بأن رابط البث قد لا يعمل وقت البرنامج.
Future<void> setReminder(BuildContext context, Channel c, EpgProgram pr) async {
  final p = context.bc;
  final t = Theme.of(context).textTheme;
  final ok = await showDialog<bool>(
    context: context,
    builder: (ctx) => AlertDialog(
      icon: Icon(Icons.notifications_active_outlined, color: p.gold, size: 32),
      title: const Text('ضبط تذكير'),
      content: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text(pr.title, style: t.titleMedium, textAlign: TextAlign.center),
        Text('${c.name} · ${pr.start.day}/${pr.start.month} الساعة ${hhmm(pr.start)}', style: t.bodyMedium, textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text('سنذكّرك قبل البدء بـ${Reminders.lead.inMinutes} دقائق.', style: t.bodyMedium, textAlign: TextAlign.center),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(color: p.gold.withValues(alpha: .10), borderRadius: BorderRadius.circular(10)),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Icon(Icons.info_outline_rounded, size: 16, color: p.gold),
            const SizedBox(width: 6),
            Expanded(child: Text(
              'تنبيه: رابط البث يتبع مصدره، وقد لا يعمل وقت عرض البرنامج.',
              style: t.bodySmall!.copyWith(color: p.text2),
            )),
          ]),
        ),
      ]),
      actions: [
        TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('إلغاء')),
        FilledButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('ضبط التذكير')),
      ],
    ),
  );
  if (ok != true) return;
  final system = await AppStore.I.addReminder(c, pr);
  if (!context.mounted) return;
  toast(context,
      system ? 'سنذكّرك قبل «${pr.title}»' : 'ضُبط التذكير داخل التطبيق فقط — اسمح بالإشعارات ليصلك والتطبيق مغلق',
      icon: Icons.notifications_active_rounded);
}

/// قائمة التذكيرات المضبوطة.
Future<void> showReminders(BuildContext context) => showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => ListenableBuilder(
        listenable: AppStore.I,
        builder: (ctx, _) {
          final t = Theme.of(ctx).textTheme;
          final l = AppStore.I.reminders;
          return SafeArea(child: Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text('تذكيراتي', style: t.titleLarge),
              const SizedBox(height: 8),
              if (l.isEmpty)
                Padding(padding: const EdgeInsets.symmetric(vertical: 24),
                    child: Text('لا توجد تذكيرات. اضغط «تذكير» على أي برنامج قادم في الدليل.', style: t.bodyMedium, textAlign: TextAlign.center))
              else
                Flexible(child: ListView(shrinkWrap: true, children: [
                  for (final r in l)
                    ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: ChannelLogo(url: r.logo, name: r.channelName, size: 40),
                      title: Text(r.title),
                      subtitle: Text('${r.channelName} · ${r.start.day}/${r.start.month} ${hhmm(r.start)}${r.auto ? ' · تنبيه ذكي' : ''}'),
                      trailing: IconButton(tooltip: 'إلغاء', icon: const Icon(Icons.close_rounded),
                          onPressed: () => AppStore.I.removeReminder(r)),
                    ),
                ])),
            ]),
          ));
        },
      ),
    );
