import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'pairing_io.dart';
import 'remote_bus.dart';

/// الجوال ريموت: صفحة على الشبكة المحلية فيها أسهم وتشغيل وقنوات وصوت وبحث بلوحة مفاتيح الجوال.
/// الرمز دائم (يُحفظ في الإعدادات) فيكفي مسح QR مرة واحدة، ويمكن تغييره لإلغاء الأجهزة القديمة.
class RemoteServer {
  static final RemoteServer I = RemoteServer._();
  RemoteServer._();
  static bool get supported => true;

  HttpServer? _srv;
  String? url;
  String _token = '';
  bool get running => _srv != null;

  Future<String?> start(String token, {int port = 8643, String? host}) async {
    if (_srv != null && token == _token) return url;
    await stop();
    _token = token;
    final ip = host ?? await PairServer.localIp();
    if (ip == null) return null;
    try {
      _srv = await HttpServer.bind(InternetAddress.anyIPv4, port);
    } catch (_) {
      _srv = await HttpServer.bind(InternetAddress.anyIPv4, 0);
    }
    url = 'http://$ip:${_srv!.port}/?k=$token';
    _srv!.listen((r) => _handle(r).catchError((_) {}));
    return url;
  }

  Future<void> stop() async {
    await _srv?.close(force: true);
    _srv = null;
    url = null;
  }

  Future<void> _handle(HttpRequest req) async {
    final res = req.response;
    res.headers.set('Cache-Control', 'no-store');
    if (req.uri.queryParameters['k'] != _token) {
      res.statusCode = HttpStatus.forbidden;
      res.headers.contentType = ContentType.html;
      res.write(_page(false));
      return res.close();
    }
    if (req.method == 'POST' && req.uri.path == '/cmd') {
      try {
        final j = Map<String, dynamic>.from(jsonDecode(await utf8.decoder.bind(req).join()));
        final a = '${j['a'] ?? ''}';
        if (a.isNotEmpty) RemoteBus.send((a: a, v: j['v'] == null ? null : '${j['v']}'));
      } catch (_) {}
      res.headers.contentType = ContentType.json;
      res.write('{"ok":true}');
      return res.close();
    }
    if (req.uri.path == '/state') {
      res.headers.contentType = ContentType.json;
      res.write(jsonEncode(RemoteBus.state?.call() ?? const {'idle': true}));
      return res.close();
    }
    res.headers.contentType = ContentType.html;
    res.write(_page(true));
    return res.close();
  }

  static String _page(bool ok) => '''<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="theme-color" content="#06101a"><meta name="apple-mobile-web-app-capable" content="yes">
<title>ريموت البشرى</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;background:radial-gradient(circle at 50% -20%,#0e3a44,#06101a 55%,#040a12);color:#f5f7fa;min-height:100vh;display:flex;justify-content:center;padding:16px}
.c{width:100%;max-width:400px;display:flex;flex-direction:column;gap:14px}
.logo{font-weight:800;font-size:18px;color:#2ee6d6;text-align:center}
.now{background:#0d1e2c;border:1px solid #2ee6d633;border-radius:16px;padding:12px 14px;min-height:64px}
.now b{display:block;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.now small{color:#b4c4d4}
.bar{height:4px;background:#ffffff22;border-radius:2px;margin-top:8px;overflow:hidden;direction:ltr}.bar i{display:block;height:100%;width:0;background:#2ee6d6}
button{border:0;border-radius:14px;background:#10212f;color:#fff;font-size:15px;font-weight:600;padding:14px 0;border:1px solid #ffffff14;font-family:inherit}
button:active{background:#2ee6d644;transform:scale(.96)}
.pad{position:relative;width:250px;height:250px;margin:4px auto;border-radius:50%;background:#0d1e2c;border:1px solid #2ee6d655}
.pad button{position:absolute;width:76px;height:76px;border-radius:50%;background:transparent;border:0;font-size:28px;padding:0}
.u{top:4px;left:87px}.d{bottom:4px;left:87px}.l{left:4px;top:87px}.r{right:4px;top:87px}
.pad .ok{width:100px;height:100px;top:75px;left:75px;background:linear-gradient(#ffe08a,#f7c04f,#d9982c);color:#080b12;font-size:20px;font-weight:800}
.row{display:grid;gap:10px}.r3{grid-template-columns:repeat(3,1fr)}.r4{grid-template-columns:repeat(4,1fr)}
.play{background:linear-gradient(#2bd9c9,#0e9c98);color:#04121a;font-size:22px}
.col{display:grid;grid-template-rows:1fr 1fr;gap:10px}.lbl{font-size:12px;color:#7d93a8;text-align:center;margin-top:-6px}
.nums{display:none;grid-template-columns:repeat(3,1fr);gap:10px}.nums.on{display:grid}
.s{display:flex;gap:8px}.s input{flex:1;padding:14px;border-radius:14px;border:1px solid #ffffff1f;background:#0d1e2c;color:#fff;font-size:16px;font-family:inherit;user-select:text}
.s button{padding:14px 18px;background:#f7c04f;color:#080b12}
</style></head><body><div class="c">
<div class="logo">ريموت البشرى</div>
${ok ? '''
<div class="now" id="now"><b id="t">—</b><small id="st">افتح قناة على التلفاز</small><div class="bar"><i id="p"></i></div></div>
<div class="pad"><button class="u" onclick="s('up')">▲</button><button class="d" onclick="s('down')">▼</button>
<button class="r" onclick="s('right')">▶</button><button class="l" onclick="s('left')">◀</button><button class="ok" onclick="s('ok')">OK</button></div>
<div class="row r3"><button onclick="s('back')">↩ رجوع</button><button onclick="s('home')">⌂ الرئيسية</button><button onclick="s('menu')">☰ المزيد</button></div>
<div class="row r3"><button onclick="s('rew')">⏪ ‎-10</button><button class="play" id="pp" onclick="s('toggle')">⏯</button><button onclick="s('fwd')">‎+10 ⏩</button></div>
<div class="row r4">
<div class="col"><button onclick="s('chup')">قناة ▲</button><button onclick="s('chdown')">قناة ▼</button></div>
<div class="col"><button onclick="s('volup')">🔊 +</button><button onclick="s('voldown')">🔉 −</button></div>
<div class="col"><button onclick="s('mute')">🔇</button><button onclick="document.getElementById('n').classList.toggle('on')">123</button></div>
<div class="col"><button onclick="s('live')">مباشر</button><button onclick="s('guide')">الدليل</button></div></div>
<div class="nums" id="n">${[for (var i = 1; i <= 9; i++) '<button onclick="s(\'num\',\'$i\')">$i</button>', '<span></span>', '<button onclick="s(\'num\',\'0\')">0</button>'].join()}</div>
<div class="s"><input id="q" placeholder="اكتب للبحث على التلفاز" enterkeyhint="search" onkeydown="if(event.key=='Enter')go()"><button onclick="go()">بحث</button></div>
<script>
function s(a,v){try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}fetch('/cmd'+location.search,{method:'POST',body:JSON.stringify({a:a,v:v})}).catch(function(){})}
function go(){var q=document.getElementById('q');if(q.value.trim()){s('search',q.value.trim());q.value='';q.blur()}}
function fmt(x){x=Math.floor(x);var m=Math.floor(x/60),h=Math.floor(m/60);m=m%60;var ss=('0'+(x%60)).slice(-2);return (h?h+':'+('0'+m).slice(-2):m)+':'+ss}
function poll(){fetch('/state'+location.search).then(function(r){return r.json()}).then(function(j){
var t=document.getElementById('t'),st=document.getElementById('st'),p=document.getElementById('p');
if(j.idle){t.textContent='لا شيء يُعرض الآن';st.textContent='اختر قناة أو فيلمًا بالأسهم ثم OK';p.style.width='0'}
else{t.textContent=j.title;st.textContent=(j.live?'● مباشر':(j.dur?fmt(j.pos)+' / '+fmt(j.dur):''))+(j.sub?' · '+j.sub:'');p.style.width=(j.dur?Math.min(100,100*j.pos/j.dur):(j.prog||0)*100)+'%'}
document.getElementById('pp').textContent=j.playing?'⏸':'▶'}).catch(function(){document.getElementById('st').textContent='انقطع الاتصال بالتلفاز'})}
poll();setInterval(poll,2000);
</script>''' : '<p style="text-align:center;line-height:1.7">انتهت صلاحية هذا الرابط. افتح «الجوال ريموت» من إعدادات البشرى على التلفاز وامسح الرمز الجديد.</p>'}
</div></body></html>''';
}
