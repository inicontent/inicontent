"""Synthetic containment harness; use an isolated localhost origin only."""
import argparse
import functools
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

REGION_COOKIE = "inicontent_region_sid"


class Handler(SimpleHTTPRequestHandler):
    def api_response(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def region_session_response(self):
        """Set the regional session cookie the way the API does.

        The cookie is set host-only (no `Domain`), so it is attached to
        requests to this origin alone. Its value is origin-specific, so a
        harness that reads a value it never set has proved it read another
        region's cookie — which must be impossible.
        """
        host = self.headers.get("Host", "").split(":")[0]
        value = f"{host}--{os.urandom(8).hex()}"
        self.send_response(204)
        self.send_header(
            "Set-Cookie",
            # Host-only: no Domain attribute. SameSite=Lax blocks a cross-site
            # subrequest from sending it; Secure is omitted because the harness
            # is http. Path=/ so every request on this origin carries it.
            f"{REGION_COOKIE}={value}; Path=/; SameSite=Lax",
        )
        self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api"):
            self.api_response()
        elif self.path.startswith("/__region/session"):
            self.region_session_response()
        else:
            super().do_GET()

    def do_POST(self):
        self.rfile.read(int(self.headers.get("Content-Length", "0")))
        self.api_response()


parser = argparse.ArgumentParser()
parser.add_argument("--directory", required=True)
parser.add_argument("--port", type=int, default=4319)
# The regional harness runs two *real* hostnames: cookies are host-scoped and
# ignore ports, so `127.0.0.1` and `127.0.0.2` give the two regions separate
# cookie jars the way two Amplify hostnames would.
parser.add_argument("--host", default="127.0.0.1")
args = parser.parse_args()
ThreadingHTTPServer((args.host, args.port), functools.partial(Handler, directory=args.directory)).serve_forever()
