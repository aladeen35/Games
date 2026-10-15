import 'dart:async';
import 'dart:convert';
import 'package:archive/archive.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

enum NetErrorKind { auth, notFound, unreachable, timeout, blocked, badFormat, server }

/// خطأ شبكة مصاغ للمستخدم بلغة بسيطة، مع التفصيل التقني لشاشة المعلومات المتقدمة.
class NetError implements Exception {
  final NetErrorKind kind;
  final String technical;
  NetError(this.kind, this.technical);

  String get message => switch (kind) {
        NetErrorKind.auth => 'انتهت صلاحية الرابط أو بيانات الدخول',
        NetErrorKind.notFound => 'لم يُعثر على القائمة في هذا الرابط',
        NetErrorKind.unreachable => 'لا يمكن الوصول للمصدر',
        NetErrorKind.timeout => 'المصدر لا يستجيب، حاول بعد قليل',
        NetErrorKind.blocked => kIsWeb
            ? 'المتصفح منع الاتصال بهذا المصدر (CORS). جرّب تطبيق الجوال أو فعّل وسيط الويب من الإعدادات'
            : 'المصدر رفض الاتصال',
        NetErrorKind.badFormat => 'الملف لا يبدو قائمة تشغيل صالحة',
        NetErrorKind.server => 'المصدر غير متاح مؤقتًا',
      };

  @override
  String toString() => '$message ($technical)';
}

class Net {
  /// وسيط اختياري للويب فقط، مثل: https://my-proxy.example/?url=
  static String corsProxy = '';
  static const ua = 'Bushra/1.0 (IPTV Player)';

  static Uri wrap(String url) {
    if (kIsWeb && corsProxy.isNotEmpty && !url.startsWith('blob:') && !url.startsWith('data:')) {
      return Uri.parse('$corsProxy${Uri.encodeComponent(url)}');
    }
    return Uri.parse(url);
  }

  static Future<Uint8List> bytes(String url, {Duration timeout = const Duration(seconds: 40), Map<String, String>? headers}) async {
    final Uri uri;
    try {
      uri = wrap(url.trim());
    } catch (_) {
      throw NetError(NetErrorKind.badFormat, 'invalid url');
    }
    http.Response r;
    try {
      r = await http.get(uri, headers: {if (!kIsWeb) 'User-Agent': ua, ...?headers}).timeout(timeout);
    } on TimeoutException {
      throw NetError(NetErrorKind.timeout, 'timeout after ${timeout.inSeconds}s');
    } catch (e) {
      // على الويب يظهر منع CORS كخطأ عام بلا تفاصيل
      throw NetError(kIsWeb ? NetErrorKind.blocked : NetErrorKind.unreachable, '$e');
    }
    if (r.statusCode == 401 || r.statusCode == 403) throw NetError(NetErrorKind.auth, 'HTTP ${r.statusCode}');
    if (r.statusCode == 404) throw NetError(NetErrorKind.notFound, 'HTTP 404');
    if (r.statusCode >= 400) throw NetError(NetErrorKind.server, 'HTTP ${r.statusCode}');
    var b = r.bodyBytes;
    if (b.length > 2 && b[0] == 0x1f && b[1] == 0x8b) b = Uint8List.fromList(const GZipDecoder().decodeBytes(b));
    return b;
  }

  static Future<String> text(String url, {Duration timeout = const Duration(seconds: 40)}) async =>
      decodeText(await bytes(url, timeout: timeout));

  static String decodeText(Uint8List b) {
    if (b.length > 2 && b[0] == 0x1f && b[1] == 0x8b) b = Uint8List.fromList(const GZipDecoder().decodeBytes(b));
    try {
      return utf8.decode(b);
    } catch (_) {
      return latin1.decode(b);
    }
  }

  static Future<dynamic> json(String url) async {
    final t = await text(url, timeout: const Duration(seconds: 30));
    try {
      return jsonDecode(t);
    } catch (_) {
      throw NetError(NetErrorKind.badFormat, 'invalid json');
    }
  }

  /// يعرض نطاق المصدر فقط دون اسم المستخدم أو كلمة المرور أو المعاملات.
  static String safeHost(String url) {
    final u = Uri.tryParse(url.trim());
    if (u == null || u.host.isEmpty) return 'ملف محلي';
    return u.host + (u.hasPort && u.port != 80 && u.port != 443 ? ':${u.port}' : '');
  }
}
