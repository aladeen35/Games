import 'package:flutter/material.dart';
import '../core/brand.dart';
import '../core/theme.dart';
import '../data/models.dart';
import '../data/store.dart';
import '../platform/platform.dart' as plat;
import '../widgets/avatar.dart';
import '../widgets/common.dart';
import 'settings.dart';
import 'shell.dart';

/// شاشة «من يشاهد الآن؟» بأسلوب نتفليكس: صور كبيرة بحواف دائرية، وإضافة ملف وإدارته.
class ProfilesScreen extends StatefulWidget {
  /// تُعرض عند فتح التطبيق (لا زر رجوع).
  final bool root;
  final VoidCallback? onChosen;
  const ProfilesScreen({super.key, this.root = false, this.onChosen});
  @override
  State<ProfilesScreen> createState() => _ProfilesScreenState();
}

class _ProfilesScreenState extends State<ProfilesScreen> {
  bool manage = false;

  Future<void> _choose(Profile p) async {
    final s = AppStore.I;
    if (manage) return _edit(p);
    // الخروج من ملف الأطفال إلى ملف عادي يحتاج الرمز الأبوي
    if (s.isKids && !p.kids && s.profile.id != p.id && s.settings.parentalPin != null) {
      if (!await askPin(context, title: 'الرمز الأبوي للخروج من ملف الأطفال')) return;
    }
    if (p.pin != null && mounted) {
      if (!await askCode(context, title: 'رمز ملف ${p.name}', expected: p.pin!)) return;
    }
    s.selectProfile(p);
    if (!mounted) return;
    if (widget.root) {
      widget.onChosen?.call();
    } else {
      Navigator.of(context).pop();
    }
  }

  Future<void> _edit(Profile? p) async {
    await Navigator.of(context).push(MaterialPageRoute(builder: (_) => ProfileEditor(profile: p)));
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final tv = context.isTv, wide = context.isWide;
    final size = tv ? 150.0 : (wide ? 128.0 : 104.0);
    return Scaffold(
      backgroundColor: p.bgDeep,
      appBar: widget.root ? null : AppBar(backgroundColor: Colors.transparent),
      body: Stack(children: [
        Positioned.fill(child: DecoratedBox(decoration: BoxDecoration(gradient: RadialGradient(
          center: const Alignment(0, -.6), radius: 1.1,
          colors: [Color.alphaBlend(p.accent.withValues(alpha: .10), p.bgDeep), p.bgDeep],
        )))),
        SafeArea(child: Center(child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            if (widget.root) ...[const BushraLogo(size: 36), SizedBox(height: tv ? 40 : 28)],
            Text(manage ? 'إدارة الملفات' : 'من يشاهد الآن؟', style: t.displaySmall!.copyWith(fontSize: tv ? 40 : (wide ? 34 : 26))),
            SizedBox(height: tv ? 40 : 28),
            ConstrainedBox(
              constraints: BoxConstraints(maxWidth: tv ? 1100 : 760),
              child: FocusTraversalGroup(child: Wrap(
                alignment: WrapAlignment.center,
                spacing: tv ? 34 : 22,
                runSpacing: tv ? 30 : 22,
                children: [
                  for (final (i, pr) in s.profiles.indexed)
                    _ProfileTile(
                      profile: pr, size: size, manage: manage,
                      current: !widget.root && pr.id == s.profile.id,
                      autofocus: i == 0 || pr.id == s.profile.id,
                      onTap: () => _choose(pr),
                    ),
                  if (s.profiles.length < 8)
                    _AddTile(size: size, onTap: () => _edit(null)),
                ],
              )),
            ),
            SizedBox(height: tv ? 46 : 34),
            OutlinedButton.icon(
              onPressed: () => setState(() => manage = !manage),
              icon: Icon(manage ? Icons.check_rounded : Icons.edit_outlined),
              label: Text(manage ? 'تم' : 'إدارة الملفات'),
            ),
          ]),
        ))),
      ]),
    );
  }
}

class _ProfileTile extends StatefulWidget {
  final Profile profile;
  final double size;
  final bool manage, current, autofocus;
  final VoidCallback onTap;
  const _ProfileTile({required this.profile, required this.size, required this.manage, required this.current,
      required this.onTap, this.autofocus = false});
  @override
  State<_ProfileTile> createState() => _ProfileTileState();
}

class _ProfileTileState extends State<_ProfileTile> {
  bool hot = false;
  @override
  Widget build(BuildContext context) {
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final pr = widget.profile;
    final on = hot || widget.current;
    return Semantics(
      button: true,
      label: pr.name,
      child: InkWell(
        autofocus: widget.autofocus,
        onTap: widget.onTap,
        onHover: (v) => setState(() => hot = v),
        onFocusChange: (v) => setState(() => hot = v),
        borderRadius: BorderRadius.circular(widget.size * .18),
        splashColor: Colors.transparent,
        hoverColor: Colors.transparent,
        focusColor: Colors.transparent,
        child: SizedBox(
          width: widget.size + 12,
          child: Column(children: [
            AnimatedScale(
              scale: hot && !AppStore.I.settings.reduceMotion ? 1.08 : 1,
              duration: BMotion.fast,
              child: AnimatedContainer(
                duration: BMotion.fast,
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(widget.size * .19),
                  border: Border.all(color: on ? Colors.white : Colors.transparent, width: 3),
                  boxShadow: hot ? [BoxShadow(color: p.accent.withValues(alpha: .35), blurRadius: 26)] : null,
                ),
                child: Stack(children: [
                  ProfileAvatar(profile: pr, size: widget.size),
                  if (widget.manage)
                    Positioned.fill(child: DecoratedBox(
                      decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(widget.size * .16)),
                      child: const Center(child: Icon(Icons.edit_rounded, color: Colors.white, size: 38)),
                    )),
                  if (pr.kids)
                    PositionedDirectional(bottom: 6, start: 6, child: _Badge(text: 'أطفال', color: p.gold)),
                ]),
              ),
            ),
            const SizedBox(height: 10),
            Row(mainAxisAlignment: MainAxisAlignment.center, children: [
              Flexible(child: Text(pr.name, maxLines: 1, overflow: TextOverflow.ellipsis,
                  style: t.titleMedium!.copyWith(color: on ? p.text : p.text2))),
              if (pr.pin != null) ...[const SizedBox(width: 4), Icon(Icons.lock_rounded, size: 15, color: p.text3)],
            ]),
          ]),
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color color;
  const _Badge({required this.text, required this.color});
  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
        decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(6)),
        child: Text(text, style: const TextStyle(fontFamily: kFont, fontSize: 11, fontWeight: FontWeight.w700, color: BColors.midnight950)),
      );
}

class _AddTile extends StatefulWidget {
  final double size;
  final VoidCallback onTap;
  const _AddTile({required this.size, required this.onTap});
  @override
  State<_AddTile> createState() => _AddTileState();
}

class _AddTileState extends State<_AddTile> {
  bool hot = false;
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    final t = Theme.of(context).textTheme;
    return InkWell(
      onTap: widget.onTap,
      onHover: (v) => setState(() => hot = v),
      onFocusChange: (v) => setState(() => hot = v),
      borderRadius: BorderRadius.circular(widget.size * .18),
      splashColor: Colors.transparent,
      hoverColor: Colors.transparent,
      focusColor: Colors.transparent,
      child: SizedBox(
        width: widget.size + 12,
        child: Column(children: [
          AnimatedContainer(
            duration: BMotion.fast,
            width: widget.size + 6, height: widget.size + 6,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(widget.size * .19),
              color: hot ? p.highlight : p.container,
              border: Border.all(color: hot ? Colors.white : p.border, width: hot ? 3 : 1.5),
            ),
            child: Icon(Icons.add_rounded, size: widget.size * .42, color: hot ? p.text : p.text2),
          ),
          const SizedBox(height: 10),
          Text('إضافة ملف', style: t.titleMedium!.copyWith(color: hot ? p.text : p.text2)),
        ]),
      ),
    );
  }
}

/// إنشاء ملف أو تعديله: الاسم، الصورة (مضمّنة أو من الجهاز)، ملف أطفال، ورمز اختياري.
class ProfileEditor extends StatefulWidget {
  final Profile? profile;
  const ProfileEditor({super.key, this.profile});
  @override
  State<ProfileEditor> createState() => _ProfileEditorState();
}

class _ProfileEditorState extends State<ProfileEditor> {
  late final name = TextEditingController(text: widget.profile?.name ?? '');
  late int avatar = widget.profile?.avatar ?? (AppStore.I.profiles.length % AvatarArt.all.length);
  late String? image = widget.profile?.image;
  late bool kids = widget.profile?.kids ?? false;
  late bool kidsOnly = widget.profile?.kidsOnly ?? false;
  late String? pin = widget.profile?.pin;
  bool picking = false;

  @override
  void dispose() {
    name.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    setState(() => picking = true);
    try {
      final bytes = await plat.pickImageBytes();
      if (bytes == null) return;
      final b64 = await squareAvatar(bytes);
      if (b64 == null) {
        if (mounted) toast(context, 'تعذر قراءة الصورة', icon: Icons.error_outline_rounded);
        return;
      }
      setState(() { image = b64; avatar = -1; });
    } finally {
      if (mounted) setState(() => picking = false);
    }
  }

  Future<void> _save() async {
    final s = AppStore.I;
    final n = name.text.trim().isEmpty ? (kids ? 'الأطفال' : 'ملف ${s.profiles.length + 1}') : name.text.trim();
    final img = avatar < 0 ? image : null;
    final wasKids = widget.profile?.kids ?? false;
    if (widget.profile == null) {
      final p = s.addProfile(n, avatar: avatar, image: img, kids: kids);
      p.kidsOnly = kidsOnly;
      p.pin = pin;
      s.saveProfile(p);
    } else {
      final p = widget.profile!
        ..name = n
        ..avatar = avatar
        ..image = img
        ..kids = kids
        ..kidsOnly = kidsOnly
        ..pin = pin;
      s.saveProfile(p);
    }
    // ملف أطفال جديد بلا رمز أبوي: نقترح ضبطه ليُطلب عند الخروج منه
    if (kids && !wasKids && s.settings.parentalPin == null && mounted) {
      final code = await askNewCode(context, title: 'رمز أبوي للخروج من ملف الأطفال',
          hint: 'يُطلب هذا الرمز عند التبديل من ملف الأطفال إلى ملف آخر، ولفتح المجموعات المقفلة.');
      if (code != null) {
        s.settings.parentalPin = code;
        s.saveSettings();
      }
    }
    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    final t = Theme.of(context).textTheme;
    final p = context.bc;
    final editing = widget.profile != null;
    final grid = context.isWide ? 72.0 : 62.0;
    return Scaffold(
      appBar: AppBar(title: Text(editing ? 'تعديل الملف' : 'ملف جديد')),
      body: SafeArea(child: Center(child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 640),
        child: ListView(padding: const EdgeInsets.all(20), children: [
          Center(child: Stack(children: [
            ProfileAvatar(avatar: avatar, image: image, size: 132),
            if (picking) const Positioned.fill(child: Center(child: CircularProgressIndicator())),
          ])),
          const SizedBox(height: 20),
          TextField(
            controller: name,
            autofocus: !editing,
            maxLength: 20,
            decoration: const InputDecoration(labelText: 'الاسم', prefixIcon: Icon(Icons.badge_outlined), counterText: ''),
          ),
          const SizedBox(height: 18),
          Text('اختر صورة', style: t.titleSmall),
          const SizedBox(height: 10),
          Wrap(spacing: 10, runSpacing: 10, children: [
            _PickBox(
              size: grid, selected: avatar < 0,
              onTap: _pickImage,
              child: avatar < 0 && image != null
                  ? ProfileAvatar(avatar: -1, image: image, size: grid)
                  : Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                      Icon(Icons.add_photo_alternate_outlined, color: p.accent, size: grid * .38),
                      Text('من جهازك', style: t.labelSmall!.copyWith(color: p.text2)),
                    ]),
            ),
            for (var i = 0; i < AvatarArt.all.length; i++)
              _PickBox(size: grid, selected: avatar == i, onTap: () => setState(() => avatar = i),
                  child: ProfileAvatar(avatar: i, size: grid)),
          ]),
          const SizedBox(height: 18),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            secondary: Icon(Icons.child_care_rounded, color: p.gold),
            title: const Text('ملف أطفال'),
            subtitle: const Text('يُخفي محتوى البالغين والمجموعات المقفلة، والخروج منه بالرمز الأبوي'),
            value: kids,
            onChanged: (v) => setState(() => kids = v),
          ),
          if (kids)
            SwitchListTile(
              contentPadding: const EdgeInsetsDirectional.only(start: 40),
              title: const Text('مجموعات الأطفال فقط'),
              subtitle: const Text('يُظهر الكرتون وقنوات الأطفال والعائلة فقط'),
              value: kidsOnly,
              onChanged: (v) => setState(() => kidsOnly = v),
            ),
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            secondary: const Icon(Icons.lock_outline_rounded),
            title: const Text('قفل الملف برمز'),
            subtitle: Text(pin == null ? 'يُطلب الرمز عند اختيار هذا الملف' : 'مفعّل'),
            value: pin != null,
            onChanged: (v) async {
              if (!v) return setState(() => pin = null);
              final c = await askNewCode(context, title: 'رمز الملف');
              if (c != null) setState(() => pin = c);
            },
          ),
          const SizedBox(height: 20),
          FilledButton.icon(onPressed: _save, icon: const Icon(Icons.check_rounded), label: const Text('حفظ')),
          if (editing && s.profiles.length > 1) ...[
            const SizedBox(height: 10),
            TextButton.icon(
              style: TextButton.styleFrom(foregroundColor: p.danger),
              onPressed: () async {
                final ok = await showDialog<bool>(context: context, builder: (c) => AlertDialog(
                  title: const Text('حذف الملف؟'),
                  content: Text('ستُحذف مفضلة «${widget.profile!.name}» وسجل مشاهدته من هذا الجهاز.'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('إلغاء')),
                    FilledButton(onPressed: () => Navigator.pop(c, true), child: const Text('حذف')),
                  ],
                ));
                if (ok == true) {
                  s.deleteProfile(widget.profile!);
                  if (context.mounted) Navigator.of(context).pop();
                }
              },
              icon: const Icon(Icons.delete_outline_rounded),
              label: const Text('حذف الملف'),
            ),
          ],
        ]),
      ))),
    );
  }
}

class _PickBox extends StatelessWidget {
  final double size;
  final bool selected;
  final VoidCallback onTap;
  final Widget child;
  const _PickBox({required this.size, required this.selected, required this.onTap, required this.child});
  @override
  Widget build(BuildContext context) {
    final p = context.bc;
    return BTap(
      radius: size * .2,
      onTap: onTap,
      child: Container(
        width: size + 6, height: size + 6,
        padding: const EdgeInsets.all(2),
        decoration: BoxDecoration(
          color: p.container,
          borderRadius: BorderRadius.circular(size * .2),
          border: Border.all(color: selected ? p.accent : Colors.transparent, width: 2.5),
        ),
        child: Center(child: child),
      ),
    );
  }
}

/// زر صورة الملف في رأس الشاشات: يفتح قائمة التبديل السريع بين الملفات.
class ProfileButton extends StatelessWidget {
  final double size;
  const ProfileButton({super.key, this.size = 38});
  @override
  Widget build(BuildContext context) {
    final s = AppStore.I;
    return Tooltip(
      message: 'الملف: ${s.profile.name}',
      child: BTap(
        radius: size * .2,
        onTap: () => showProfileMenu(context),
        child: ProfileAvatar(profile: s.profile, size: size),
      ),
    );
  }
}

Future<void> showProfileMenu(BuildContext context) => showModalBottomSheet(
      context: context,
      builder: (ctx) {
        final s = AppStore.I;
        final t = Theme.of(ctx).textTheme;
        return SafeArea(child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
          child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Row(children: [
              ProfileAvatar(profile: s.profile, size: 52),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(s.profile.name, style: t.titleLarge),
                Text(s.profile.kids ? 'ملف أطفال' : 'الملف الحالي', style: t.bodySmall),
              ])),
            ]),
            const SizedBox(height: 16),
            if (s.profiles.length > 1) ...[
              Text('تبديل الملف', style: t.titleSmall),
              const SizedBox(height: 10),
              SizedBox(height: 92, child: ListView(scrollDirection: Axis.horizontal, children: [
                for (final pr in s.profiles.where((x) => x.id != s.profile.id))
                  Padding(
                    padding: const EdgeInsetsDirectional.only(end: 14),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () async {
                        Navigator.pop(ctx);
                        await switchProfile(context, pr);
                      },
                      child: Column(children: [
                        ProfileAvatar(profile: pr, size: 60),
                        const SizedBox(height: 6),
                        Text(pr.name, style: t.labelMedium),
                      ]),
                    ),
                  ),
              ])),
              const SizedBox(height: 8),
            ],
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.settings_outlined),
              title: const Text('الإعدادات'),
              onTap: () {
                Navigator.pop(ctx);
                context.isWide ? Shell.go('settings') : Navigator.of(context).push(MaterialPageRoute(builder: (_) => const SettingsScreen()));
              },
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const Icon(Icons.manage_accounts_outlined),
              title: const Text('إدارة الملفات'),
              onTap: () {
                Navigator.pop(ctx);
                Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ProfilesScreen()));
              },
            ),
          ]),
        ));
      },
    );

/// تبديل الملف مع التحقق من الرموز.
Future<void> switchProfile(BuildContext context, Profile p) async {
  final s = AppStore.I;
  if (s.isKids && !p.kids && s.settings.parentalPin != null) {
    if (!await askPin(context, title: 'الرمز الأبوي للخروج من ملف الأطفال')) return;
  }
  if (p.pin != null && context.mounted) {
    if (!await askCode(context, title: 'رمز ملف ${p.name}', expected: p.pin!)) return;
  }
  s.selectProfile(p);
  if (context.mounted) toast(context, 'مرحبًا ${p.name}', icon: Icons.waving_hand_rounded);
}
