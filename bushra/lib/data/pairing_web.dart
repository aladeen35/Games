typedef PairHandler = Future<({bool ok, String message})> Function(Map<String, String> form);

/// المتصفح لا يستطيع فتح خادم محلي؛ الإضافة من الجوال متاحة في التطبيق فقط.
class PairServer {
  static bool get supported => false;
  String? url;
  Future<String?> start(PairHandler onSubmit, {int port = 8642}) async => null;
  Future<void> stop() async {}
}
