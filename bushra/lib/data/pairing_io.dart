import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:math';

typedef PairHandler = Future<({bool ok, String message})> Function(Map<String, String> form);

/// خادم صغير على شبكة البيت: التلفاز يعرض رمز QR، والجوال يفتح صفحة يلصق فيها الرابط أو بيانات
/// الحساب فتصل للتلفاز مباشرة. لا خادم خارجي، ولا تطبيق على الجوال، والرمز يتغير كل مرة.
class PairServer {
  static bool get supported => true;
  HttpServer? _srv;
  final String token = _rand(8);
  String? url;

  static String _rand(int n) {
    const a = 'abcdefghjkmnpqrstuvwxyz23456789';
    final r = Random.secure();
    return String.fromCharCodes([for (var i = 0; i < n; i++) a.codeUnitAt(r.nextInt(a.length))]);
  }

  /// عنوان الجهاز على الشبكة المحلية (Wi‑Fi أو سلك).
  static Future<String?> localIp() async {
    try {
      final ifs = await NetworkInterface.list(type: InternetAddressType.IPv4, includeLoopback: false);
      String? best;
      for (final i in ifs) {
        for (final a in i.addresses) {
          final ip = a.address;
          final private = ip.startsWith('192.168.') || ip.startsWith('10.') || RegExp(r'^172\.(1[6-9]|2\d|3[01])\.').hasMatch(ip);
          if (!private) continue;
          final n = i.name.toLowerCase();
          if (n.startsWith('wlan') || n.startsWith('eth') || n.startsWith('en') || n.startsWith('wl')) return ip;
          best ??= ip;
        }
      }
      return best;
    } catch (_) {
      return null;
    }
  }

  /// يعيد رابط الصفحة، أو null إن لم يوجد اتصال بشبكة محلية.
  Future<String?> start(PairHandler onSubmit, {int port = 8642, String? host}) async {
    final ip = host ?? await localIp();
    if (ip == null) return null;
    try {
      _srv = await HttpServer.bind(InternetAddress.anyIPv4, port);
    } catch (_) {
      _srv = await HttpServer.bind(InternetAddress.anyIPv4, 0);
    }
    url = 'http://$ip:${_srv!.port}/?k=$token';
    _srv!.listen((req) => _handle(req, onSubmit).catchError((_) {}));
    return url;
  }

  Future<void> stop() async {
    await _srv?.close(force: true);
    _srv = null;
  }

  Future<void> _handle(HttpRequest req, PairHandler onSubmit) async {
    final res = req.response;
    res.headers.set('Cache-Control', 'no-store');
    if (req.uri.queryParameters['k'] != token) {
      res.statusCode = HttpStatus.forbidden;
      res.headers.contentType = ContentType.html;
      res.write(_page(null));
      return res.close();
    }
    if (req.method == 'POST' && req.uri.path == '/add') {
      Map<String, String> form;
      try {
        final body = await utf8.decoder.bind(req).join();
        form = Map<String, dynamic>.from(jsonDecode(body)).map((k, v) => MapEntry(k, '$v'.trim()));
      } catch (_) {
        form = {};
      }
      var out = (ok: false, message: 'بيانات غير مكتملة');
      final xt = form['type'] == 'xtream';
      if ((xt && (form['server'] ?? '').isNotEmpty && (form['user'] ?? '').isNotEmpty) || (!xt && (form['url'] ?? '').isNotEmpty)) {
        out = await onSubmit(form);
      }
      res.headers.contentType = ContentType.json;
      res.write(jsonEncode({'ok': out.ok, 'message': out.message}));
      return res.close();
    }
    res.headers.contentType = ContentType.html;
    res.write(_page(token));
    return res.close();
  }

  static String _page(String? token) => '''<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>البشرى — أرسل قائمة للتلفاز</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;background:radial-gradient(circle at 50% -10%,#0e3a44,#06101a 55%,#040a12);color:#f5f7fa;min-height:100vh;display:flex;justify-content:center;padding:24px 16px}
.c{width:100%;max-width:440px}h1{font-size:24px;margin:8px 0 4px}p{color:#b4c4d4;line-height:1.6;margin:0 0 18px}
.logo{font-weight:800;font-size:20px;color:#2ee6d6;letter-spacing:.5px}.tabs{display:flex;gap:8px;margin-bottom:14px}
.tab{flex:1;padding:12px;border-radius:12px;border:1px solid #2ee6d655;background:#0d1e2c;color:#b4c4d4;font-size:15px;font-weight:600}
.tab.on{background:#2ee6d622;color:#fff;border-color:#2ee6d6}label{display:block;font-size:13px;color:#b4c4d4;margin:12px 0 6px}
input{width:100%;padding:14px;border-radius:12px;border:1px solid #ffffff1f;background:#0d1e2c;color:#fff;font-size:16px}
input:focus{outline:2px solid #2ee6d6;border-color:transparent}.ltr{direction:ltr;text-align:left}
button.go{width:100%;margin-top:20px;padding:15px;border:0;border-radius:12px;font-size:17px;font-weight:700;color:#080b12;background:linear-gradient(#ffe08a,#f7c04f,#d9982c);box-shadow:0 6px 22px #f7c04f44}
button.go:disabled{opacity:.6}.msg{margin-top:16px;padding:14px;border-radius:12px;display:none;line-height:1.6}
.ok{display:block;background:#58d68d22;border:1px solid #58d68d88}.err{display:block;background:#ff5f6d22;border:1px solid #ff5f6d88}
.note{font-size:12.5px;color:#7d93a8;margin-top:18px;line-height:1.7}
</style></head><body><div class="c">
<div class="logo">البشرى</div>
${token == null ? '<h1>انتهت صلاحية الرمز</h1><p>امسح رمز QR الظاهر على شاشة التلفاز من جديد.</p>' : '''
<h1>أرسل قائمة للتلفاز</h1><p>الصق رابط القائمة أو بيانات حسابك، وستظهر القنوات على التلفاز فورًا.</p>
<div class="tabs"><button class="tab on" id="t1" onclick="mode('m3u')">رابط قائمة</button><button class="tab" id="t2" onclick="mode('xtream')">حساب مزود</button></div>
<form id="f" onsubmit="send(event)">
<div id="m3u"><label>رابط القائمة (M3U)</label><input class="ltr" name="url" type="url" inputmode="url" placeholder="https://…/playlist.m3u" autocomplete="off"></div>
<div id="xt" style="display:none"><label>عنوان الخادم</label><input class="ltr" name="server" inputmode="url" placeholder="http://server.com:8080" autocomplete="off">
<label>اسم المستخدم</label><input class="ltr" name="user" autocomplete="off" autocapitalize="off"><label>كلمة المرور</label><input class="ltr" name="pass" type="password"></div>
<label>اسم القائمة (اختياري)</label><input name="name" autocomplete="off">
<button class="go" id="b">أرسل إلى التلفاز</button></form><div class="msg" id="m"></div>
<div class="note">تنتقل البيانات مباشرة من جوالك إلى التلفاز داخل شبكة بيتك، ولا تمر بأي خادم خارجي.</div>
<script>
let t='m3u';function mode(m){t=m;document.getElementById('m3u').style.display=m=='m3u'?'':'none';document.getElementById('xt').style.display=m=='xtream'?'':'none';
document.getElementById('t1').className='tab'+(m=='m3u'?' on':'');document.getElementById('t2').className='tab'+(m=='xtream'?' on':'')}
async function send(e){e.preventDefault();const f=new FormData(document.getElementById('f'));const d={type:t};f.forEach((v,k)=>d[k]=v);
const b=document.getElementById('b'),m=document.getElementById('m');b.disabled=true;b.textContent='جارٍ الاختبار على التلفاز…';m.className='msg';
try{const r=await fetch('/add'+location.search,{method:'POST',body:JSON.stringify(d)});const j=await r.json();m.textContent=(j.ok?'✓ ':'✗ ')+j.message;m.className='msg '+(j.ok?'ok':'err');
if(j.ok)document.getElementById('f').reset();}catch(x){m.textContent='✗ انقطع الاتصال بالتلفاز. تأكد أن الجوال والتلفاز على شبكة Wi‑Fi نفسها.';m.className='msg err'}
b.disabled=false;b.textContent='أرسل إلى التلفاز'}
</script>'''}
</div></body></html>''';
}
