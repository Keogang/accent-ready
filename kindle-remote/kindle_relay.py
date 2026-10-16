#!/usr/bin/env python3
"""Kindle Relay: turn Kindle Cloud Reader pages from your iPhone on any network.

Use this version when the iPhone can't reach the Mac directly, as on school or
work Wi-Fi. The iPhone and the Mac never talk to each other. Instead, the iPhone
posts "next" or "prev" to a private channel on the free ntfy.sh service, and this
program on the Mac listens to that channel and presses the arrow key.

Uses only the Python standard library plus the `curl` and `osascript` commands
that come with macOS. (curl uses the Mac's own certificates, which matters on
networks that inspect web traffic.)
"""

import os
import secrets
import subprocess
import sys
import time
from pathlib import Path

SERVER = os.environ.get("KINDLE_RELAY_SERVER", "https://ntfy.sh")
KEY_CODES = {"next": 124, "prev": 123}  # Right arrow, Left arrow


def load_channel():
    """A hard-to-guess channel name kept between runs so the iPhone setup keeps working."""
    path = Path(__file__).with_name(".channel")
    if path.exists():
        return path.read_text().strip()
    channel = "kindle-" + secrets.token_hex(8)
    path.write_text(channel)
    return channel


def press(direction):
    script = f'tell application "System Events" to key code {KEY_CODES[direction]}'
    result = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    if result.returncode != 0:
        print("Key press failed:", result.stderr.strip(), file=sys.stderr)
        print("Give Terminal permission: System Settings > Privacy & Security > Accessibility.",
              file=sys.stderr)


def listen(url):
    """Stream messages from the channel, one per line, and reconnect if the stream drops."""
    while True:
        proc = subprocess.Popen(["curl", "-sSN", "--fail", f"{url}/raw"],
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        print("Connected. Waiting for page turns...")
        for line in proc.stdout:
            word = line.strip().lower()
            if word in KEY_CODES:
                press(word)
                print("Next page" if word == "next" else "Previous page")
        err = proc.stderr.read().strip()
        proc.wait()
        print(f"Connection dropped{': ' + err if err else ''}. Reconnecting in 3 seconds...")
        time.sleep(3)


def main():
    url = f"{SERVER}/{load_channel()}"
    print("\nKindle Relay is running.\n")
    print("Your private page-turn address (use it in the iPhone Shortcuts):\n")
    print(f"    {url}\n")
    print("Keep the Kindle Cloud Reader window in front on this Mac.")
    print("Press Control-C here to stop.\n")
    try:
        listen(url)
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
