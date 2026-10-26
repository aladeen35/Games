import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../data/store.dart';
import '../widgets/common.dart';
import '../widgets/reminder_ui.dart';

/// التنبيهات الذكية: تكتب فرقك أو برامجك المفضلة مرة واحدة، فيبحث التطبيق في الدليل
/// كلما تجدد ويضبط التذكيرات تلقائيًا.
class SmartAlertsScreen extends StatefulWidget {
  const SmartAlertsScreen({super.key});
  @override
  State<SmartAlertsScreen> createState() => _SmartAlertsScreenState();
}

class _SmartAlertsScreenState extends State<SmartAlertsScreen> {
  final _ctl = TextEditingController();
  static const _suggest = ['الهلال', 'النصر', 'الاتحاد', 'الأهلي', 'ريال مدريد', 'برشلونة', 'ليفربول', 'مانشستر', 'الدوري', 'كأس', 'نشرة الأخبار', 'وثائقي'];

  @override
  void dispose() {
    _ctl.dispose();
    super.dispose();
  }

  void _add(String w) {
    final v = w.trim();
    if (v.length < 2) return;
    final s = AppStore.I;
    if (s.alertWords.contains(v)) return;
    s.setAlertWords([...s.alertWords, v]);
    _ctl.clear();
  }

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return Scaffold(
      appBar: AppBar(title: const Text('التنبيهات الذكية')),
      body: ListenableBuilder(
        listenable: AppStore.I,
        builder: (context, _) {
          final s = AppStore.I;
          final matches = s.alertMatches();
          final autoCount = s.reminders.where((r) => r.auto && r.start.isAfter(DateTime.now())).length;
          return Center(child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 760),
            child: ListView(padding: const EdgeInsets.all(16), children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: p.gold.withValues(alpha: .10), borderRadius: BorderRadius.circular(BRadius.card)),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Icon(Icons.bolt_rounded, color: p.gold),
                  const SizedBox(width: 10),
                  Expanded(child: Text(
                    'اكتب أسماء فرقك أو برامجك المفضلة. يبحث البشرى في دليل البرامج كلما تجدد، ويضبط تذكيرًا قبل كل مباراة أو حلقة مطابقة — دون أن تبحث بنفسك.',
                    style: t.bodyMedium)),
                ]),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _ctl,
                textInputAction: TextInputAction.done,
                onSubmitted: _add,
                decoration: InputDecoration(
                  labelText: 'فريق أو برنامج',
                  hintText: 'مثل: الهلال، ريال مدريد، نشرة الأخبار',
                  prefixIcon: const Icon(Icons.add_alert_outlined),
                  suffixIcon: IconButton(onPressed: () => _add(_ctl.text), icon: const Icon(Icons.add_rounded), tooltip: 'إضافة'),
                ),
              ),
              const SizedBox(height: 12),
              if (s.alertWords.isNotEmpty)
                Wrap(spacing: 8, runSpacing: 8, children: [
                  for (final w in s.alertWords)
                    InputChip(
                      label: Text(w),
                      avatar: Icon(Icons.notifications_active_rounded, size: 16, color: p.gold),
                      onDeleted: () => s.setAlertWords([...s.alertWords]..remove(w)),
                      deleteButtonTooltipMessage: 'إزالة',
                    ),
                ]),
              const SizedBox(height: 14),
              Text('اقتراحات', style: t.titleSmall),
              const SizedBox(height: 8),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (final w in _suggest.where((w) => !s.alertWords.contains(w)))
                  ActionChip(label: Text(w), avatar: const Icon(Icons.add_rounded, size: 16), onPressed: () => _add(w)),
              ]),
              const SizedBox(height: 22),
              Row(children: [
                Expanded(child: Text('القادم المطابق', style: t.titleLarge)),
                if (autoCount > 0) StatusPill(text: '$autoCount تذكير تلقائي', icon: Icons.bolt_rounded, color: p.gold, dense: true),
              ]),
              const SizedBox(height: 4),
              Text(s.hasEpg ? 'من دليل البرامج للساعات القادمة' : 'يحتاج قائمة فيها دليل برامج (EPG).', style: t.bodySmall),
              const SizedBox(height: 10),
              if (s.alertWords.isEmpty)
                const _Hint(text: 'أضف كلمة لتظهر البرامج المطابقة هنا.')
              else if (matches.isEmpty)
                const _Hint(text: 'لا برامج مطابقة في الدليل حاليًا. سنبحث تلقائيًا كلما تجدد الدليل.')
              else
                for (final (c, pr, word) in matches)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(color: p.container, borderRadius: BorderRadius.circular(BRadius.card)),
                      child: Row(children: [
                        ChannelLogo(url: c.logo, name: c.name, size: 44),
                        const SizedBox(width: 12),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(pr.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: t.titleSmall),
                          Text('${c.name} · ${_day(pr.start)} ${hhmm(pr.start)} · «$word»', style: t.bodySmall),
                        ])),
                        if (pr.isNow(DateTime.now()))
                          const LiveBadge(small: true)
                        else
                          ReminderButton(channel: c, program: pr, expanded: false),
                      ]),
                    ),
                  ),
            ]),
          ));
        },
      ),
    );
  }

  String _day(DateTime d) {
    final n = DateTime.now();
    final a = DateTime(d.year, d.month, d.day), b = DateTime(n.year, n.month, n.day);
    final diff = a.difference(b).inDays;
    return diff == 0 ? 'اليوم' : diff == 1 ? 'غدًا' : '${d.day}/${d.month}';
  }
}

class _Hint extends StatelessWidget {
  final String text;
  const _Hint({required this.text});
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: context.bc.container, borderRadius: BorderRadius.circular(BRadius.card)),
        child: Text(text, style: Theme.of(context).textTheme.bodyMedium),
      );
}
