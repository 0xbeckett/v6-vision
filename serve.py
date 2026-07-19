#!/usr/bin/env python3
"""Durable static server for v6.0xbeckett.me.

Serves the built site on 127.0.0.1 so the cloudflared tunnel can reach it.
Runs under systemd --user so it outlives any one session.

  V6_ROOT  directory to serve  (default: ./dist next to this file)
  V6_PORT  port to bind        (default: 8762)
"""
import http.server
import os
import socketserver

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get("V6_ROOT") or os.path.join(HERE, "dist")
PORT = int(os.environ.get("V6_PORT", "8762"))

os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # hashed asset filenames make the html the only thing worth revalidating
        if self.path.startswith("/assets/"):
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        else:
            self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    def log_message(self, *args):
        pass


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


with Server(("127.0.0.1", PORT), Handler) as httpd:
    httpd.serve_forever()
