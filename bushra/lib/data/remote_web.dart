/// المتصفح لا يستطيع فتح خادم محلي؛ الريموت من الجوال متاح في تطبيق الجوال والتلفاز.
class RemoteServer {
  static final RemoteServer I = RemoteServer._();
  RemoteServer._();
  static bool get supported => false;
  String? url;
  bool get running => false;
  Future<String?> start(String token, {int port = 8643}) async => null;
  Future<void> stop() async {}
}
