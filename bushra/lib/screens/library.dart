import 'package:flutter/material.dart';
import '../core/theme.dart';
import 'lists.dart';
import 'local.dart';

/// «قوائمي»: مصادر القنوات وملفات الجهاز في مكان واحد، بتبويبين.
class LibraryScreen extends StatelessWidget {
  final int initialTab;
  const LibraryScreen({super.key, this.initialTab = 0});

  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return DefaultTabController(
      length: 2,
      initialIndex: initialTab,
      child: SafeArea(
        bottom: false,
        child: Column(children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: context.isWide ? 24 : 12),
            child: TabBar(
              dividerColor: p.border,
              indicatorColor: p.accent,
              indicatorWeight: 3,
              labelColor: p.text,
              unselectedLabelColor: p.text3,
              labelStyle: t.titleSmall,
              unselectedLabelStyle: t.titleSmall,
              tabs: const [
                Tab(icon: Icon(Icons.playlist_play_rounded), text: 'القوائم والمصادر', iconMargin: EdgeInsets.only(bottom: 2)),
                Tab(icon: Icon(Icons.smartphone_rounded), text: 'ملفاتي', iconMargin: EdgeInsets.only(bottom: 2)),
              ],
            ),
          ),
          const Expanded(child: TabBarView(children: [ListsScreen(), LocalScreen()])),
        ]),
      ),
    );
  }
}
