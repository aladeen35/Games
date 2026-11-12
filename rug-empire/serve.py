"""خادم تطوير محلي بسيط للعبة (بدون تخزين مؤقت، وأنواع MIME صحيحة لوحدات ES).
التشغيل:  py serve.py  ثم افتح http://localhost:5173
"""
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "www")


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".woff2": "font/woff2",
        ".webmanifest": "application/manifest+json",
    }

    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("0.0.0.0", PORT), Handler) as srv:
        print(f"Rug Empire: http://localhost:{PORT}")
        srv.serve_forever()
