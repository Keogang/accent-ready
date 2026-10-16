#!/usr/bin/env python3
"""Kindle Remote: turn Kindle Cloud Reader pages on your Mac from your iPhone.

Run this on the Mac, open the printed link on the iPhone (same Wi-Fi), and tap.
Each tap sends a Right/Left arrow key to whatever window is in front on the Mac,
so keep the Kindle Cloud Reader tab (read.amazon.com) in front.

Uses only the Python standard library and the macOS `osascript` command.
"""

import secrets
import socket
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

PORT = 8765


def load_token():
    """A secret kept between runs so the iPhone Home Screen link keeps working.

    It stops other people on the same Wi-Fi from turning your pages.
    """
    path = Path(__file__).with_name(".token")
    if path.exists():
        return path.read_text().strip()
    token = secrets.token_urlsafe(6)
    path.write_text(token)
    return token


TOKEN = load_token()

# macOS virtual key codes
KEY_CODES = {"next": 124, "prev": 123}  # Right arrow, Left arrow

PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Page Turner">
<title>Page Turner</title>
<style>
  :root { --bg:#f6f1e7; --fg:#2b2620; --btn:#e9e0cf; --press:#d6c7aa; --ok:#3c7d4a; --err:#b23a2e; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#141210; --fg:#ece6da; --btn:#24201b; --press:#3a332a; --ok:#6fbf7f; --err:#ff7b6b; }
  }
  * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; -webkit-user-select:none; user-select:none; }
  html, body { margin:0; height:100%; background:var(--bg); color:var(--fg);
    font:16px -apple-system, system-ui, sans-serif; overscroll-behavior:none; touch-action:manipulation; }
  body { display:flex; flex-direction:column; padding:env(safe-area-inset-top) 16px env(safe-area-inset-bottom); }
  header { display:flex; justify-content:space-between; align-items:center; padding:14px 4px; }
  header h1 { font-size:17px; margin:0; font-weight:600; }
  #status { font-size:13px; opacity:.8; }
  #status.ok { color:var(--ok); } #status.err { color:var(--err); }
  main { flex:1; display:grid; grid-template-rows:1fr 3fr; gap:14px; padding-bottom:16px; }
  button { border:0; border-radius:22px; background:var(--btn); color:var(--fg);
    font:600 22px -apple-system, system-ui, sans-serif; width:100%; height:100%; cursor:pointer; }
  button:active, button.pressed { background:var(--press); }
  #next { font-size:30px; }
</style>
</head>
<body>
<header><h1>Page Turner</h1><span id="status">Ready</span></header>
<main>
  <button id="prev" aria-label="Previous page">&#8592; Back</button>
  <button id="next" aria-label="Next page">Next &#8594;</button>
</main>
<script>
const token = new URLSearchParams(location.search).get("t") || "";
const status = document.getElementById("status");
function show(text, cls) { status.textContent = text; status.className = cls || ""; }

async function turn(dir) {
  try {
    const r = await fetch("/turn?dir=" + dir + "&t=" + encodeURIComponent(token), { method: "POST" });
    if (r.ok) show(dir === "next" ? "Next page" : "Previous page", "ok");
    else if (r.status === 403) show("Wrong link - rescan from Mac", "err");
    else show("Mac could not press the key", "err");
  } catch (e) { show("Can't reach Mac", "err"); }
}

for (const id of ["prev", "next"]) {
  const b = document.getElementById(id);
  b.addEventListener("pointerdown", e => { e.preventDefault(); b.classList.add("pressed"); turn(id); });
  for (const ev of ["pointerup", "pointercancel", "pointerleave"]) b.addEventListener(ev, () => b.classList.remove("pressed"));
}

// Swipe anywhere: left swipe = next, right swipe = back (like a book).
let x0 = null;
document.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
document.addEventListener("touchend", e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0; x0 = null;
  if (Math.abs(dx) > 60) turn(dx < 0 ? "next" : "prev");
});

// Keep the iPhone screen awake while reading, where Safari allows it.
async function stayAwake() { try { await navigator.wakeLock?.request("screen"); } catch (e) {} }
stayAwake();
document.addEventListener("visibilitychange", () => { if (!document.hidden) stayAwake(); });
</script>
</body>
</html>
"""


def press(direction):
    script = f'tell application "System Events" to key code {KEY_CODES[direction]}'
    result = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    if result.returncode != 0:
        print("Key press failed:", result.stderr.strip(), file=sys.stderr)
        print("Give Terminal permission: System Settings > Privacy & Security > Accessibility.",
              file=sys.stderr)
        return False
    return True


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, body=b"", content_type="text/plain; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if urlparse(self.path).path == "/":
            self._send(200, PAGE.encode(), "text/html; charset=utf-8")
        else:
            self._send(404, b"Not found")

    def do_POST(self):
        url = urlparse(self.path)
        query = parse_qs(url.query)
        if url.path != "/turn":
            return self._send(404, b"Not found")
        if query.get("t", [""])[0] != TOKEN:
            return self._send(403, b"Bad token")
        direction = query.get("dir", [""])[0]
        if direction not in KEY_CODES:
            return self._send(400, b"Bad direction")
        self._send(200 if press(direction) else 500)

    def log_message(self, *args):
        pass  # keep the Terminal window quiet


def local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))  # no packet is sent; this just picks the Wi-Fi address
        return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"
    finally:
        s.close()


def bonjour_name():
    try:
        name = subprocess.run(["scutil", "--get", "LocalHostName"],
                              capture_output=True, text=True).stdout.strip()
        return f"{name}.local" if name else None
    except FileNotFoundError:
        return None


def main():
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    ip, host = local_ip(), bonjour_name()
    print("\nKindle Remote is running.\n")
    print("On your iPhone (same Wi-Fi), open this link in Safari:\n")
    print(f"    http://{ip}:{PORT}/?t={TOKEN}")
    if host:
        print(f"    http://{host}:{PORT}/?t={TOKEN}   (alternative)")
    print("\nThen keep the Kindle Cloud Reader window in front on this Mac.")
    print("Press Control-C here to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
