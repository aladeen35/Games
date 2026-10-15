import 'package:flutter/material.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../player/player_screen.dart';
import '../widgets/common.dart';
import 'series.dart';
import 'epg_screen.dart';

/// بحث واحد في: الأسماء والأصلية، المجموعات، البرامج، القوائم، والملفات — بلا تشكيل ومع تسامح الأخطاء.
class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});
  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  String q = '';

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final r = s.search(q);
    final empty = q.isNotEmpty && r.channels.isEmpty && r.programs.isEmpty && r.lists.isEmpty && r.local.isEmpty;
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsetsDirectional.only(end: 16),
          child: TextField(
            autofocus: true,
            textInputAction: TextInputAction.search,
            style: t.bodyLarge,
            decoration: const InputDecoration(hintText: 'قناة، برنامج، مجموعة، أو ملف', prefixIcon: Icon(Icons.search_rounded)),
            onChanged: (v) => setState(() => q = v),
          ),
        ),
      ),
      body: q.trim().isEmpty
          ? ListView(padding: const EdgeInsets.all(16), children: [
              Text('عمليات بحث مقترحة', style: t.titleSmall),
              const SizedBox(height: 10),
              Wrap(spacing: 8, runSpacing: 8, children: [
                for (final w in ['أخبار', 'رياضة', 'أطفال', 'أفلام', 'وثائقي', 'قرآن'])
                  ActionChip(label: Text(w), onPressed: () => setState(() => q = w)),
              ]),
            ])
          : empty
              ? const EmptyState(icon: Icons.search_off_rounded, title: 'لا نتائج', body: 'جرّب كلمة أقصر أو اسمًا بالإنجليزية.')
              : ListView(padding: const EdgeInsets.fromLTRB(16, 0, 16, 24), children: [
                  if (r.channels.isNotEmpty) ...[
                    SectionHeader('قنوات', subtitle: '${r.channels.length} نتيجة'),
                    for (final c in r.channels.take(40))
                      Padding(padding: const EdgeInsets.only(bottom: 8), child: ChannelCard(channel: c,
                          onTap: () => openChannel(context, c, r.channels))),
                  ],
                  if (r.programs.isNotEmpty) ...[
                    const SectionHeader('برامج'),
                    for (final (c, p) in r.programs)
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: ChannelLogo(url: c.logo, name: c.name, size: 40),
                        title: Text(p.title),
                        subtitle: Text('${c.name} · ${hhmm(p.start)}'),
                        onTap: () => showProgramSheet(context, c, p, [c]),
                      ),
                  ],
                  if (r.lists.isNotEmpty) ...[
                    const SectionHeader('قوائم'),
                    for (final l in r.lists)
                      ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.playlist_play_rounded),
                          title: Text(l.name), subtitle: Text('${l.total} عنصر')),
                  ],
                  if (r.local.isNotEmpty) ...[
                    const SectionHeader('ملفاتي'),
                    for (final v in r.local)
                      ListTile(contentPadding: EdgeInsets.zero, leading: const Icon(Icons.smartphone_rounded),
                          title: Text(v.name), onTap: () => openPlayer(context, v.toPlayable())),
                  ],
                ]),
    );
  }
}
