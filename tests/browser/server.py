"""Synthetic containment harness; use an isolated localhost origin only."""
import argparse
import functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class Handler(SimpleHTTPRequestHandler):
    def api_response(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def do_GET(self):
        if self.path.startswith("/api"):
            self.api_response()
        else:
            super().do_GET()

    def do_POST(self):
        self.rfile.read(int(self.headers.get("Content-Length", "0")))
        self.api_response()

parser = argparse.ArgumentParser()
parser.add_argument("--directory", required=True)
parser.add_argument("--port", type=int, default=4319)
args = parser.parse_args()
ThreadingHTTPServer(("127.0.0.1", args.port), functools.partial(Handler, directory=args.directory)).serve_forever()
