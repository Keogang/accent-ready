# Kindle Remote

Turn Kindle Cloud Reader pages on your MacBook from your iPhone.

## How it works
A small program on the Mac serves a page-turner page to your iPhone over your Wi-Fi.
When you tap **Next** or **Back** on the iPhone, the Mac presses the Right or Left arrow key.
Kindle Cloud Reader (read.amazon.com) turns the page.

## One-time setup (Mac)
1. Copy this `kindle-remote` folder to your Mac (for example, into Documents).
2. Open **Terminal** (press Command-Space, type `Terminal`, and press Return).
3. Type `python3 ` (with a space after it). Drag **kindle_remote.py** from Finder into the Terminal window, then press Return.
   - If macOS asks you to install "command line developer tools," click **Install**. That provides Python. When it finishes, repeat this step.
   - This route avoids the macOS "cannot be opened" block. To use the double-click file instead, go to **System Settings > Privacy & Security**, scroll down, and click **Open Anyway** next to "Start Kindle Remote.command."
4. Grant key-press permission. The first time you tap a button, macOS asks Terminal for permission to control your computer. Allow it, or turn on **Terminal** under
   **System Settings > Privacy & Security > Accessibility**.

## One-time setup (iPhone)
1. Connect the iPhone to the same Wi-Fi as the Mac.
2. In Safari, open the link that the Terminal window shows (for example, `http://192.168.1.20:8765/?t=abc123`).
3. Tap **Share > Add to Home Screen**. Now **Page Turner** works like an app.

## Reading
1. On the Mac, start Kindle Remote (step 3 above) and open your book at read.amazon.com.
2. Click once on the book page so the browser window is in front.
3. On the iPhone, tap **Next** (the large button) or **Back**, or swipe left or right.

## On school or work Wi-Fi: use Kindle Relay instead
School and work networks often stop the iPhone from reaching the Mac, so the page never loads.
Kindle Relay avoids that. The iPhone sends each page turn to a private channel on the free
ntfy.sh service, and the Mac listens to that channel. Both devices only need internet access,
and they can even be on different networks.

### Mac
1. In Terminal, type `python3 ` (with a space), drag **kindle_relay.py** into the window, and press Return.
2. Terminal shows your private address, for example `https://ntfy.sh/kindle-1a2b3c4d5e6f7a8b`.
   It stays the same every time you start Kindle Relay. Keep it private.

### iPhone (one time): make two Shortcuts
1. Open the **Shortcuts** app and tap **+**.
2. Tap **Add Action**, search for **Get Contents of URL**, and tap it.
3. Tap the URL and type your address followed by `/publish?message=next`, for example:
   `https://ntfy.sh/kindle-1a2b3c4d5e6f7a8b/publish?message=next`
4. Tap the name at the top, rename the shortcut **Next Page**, and tap **Done**.
5. Repeat steps 1–4 with `/publish?message=prev`, and name it **Previous Page**.
6. To put a shortcut on the Home Screen, press and hold it, tap **Share**, and tap **Add to Home Screen**.

**Tip: turn pages without looking.** Go to **Settings > Accessibility > Touch > Back Tap**,
choose **Double Tap**, and pick **Next Page**. Now a double tap on the back of the iPhone turns the page.
On an iPhone with an Action button, you can also set it to run **Next Page** in **Settings > Action Button**.

### Test it
Tap **Next Page** on the iPhone. Terminal on the Mac shows "Next page," and the book turns
if the Kindle window is in front.
If Terminal keeps saying "Connection dropped," the district network may block ntfy.sh.
In that case, use your iPhone's Personal Hotspot for the Mac, or ask your IT staff.

## Troubleshooting
- **"Can't reach Mac"**: Check that both devices use the same Wi-Fi and that the Terminal window is still open. If the Mac's address changed, open the new link from Terminal. You can also try the `.local` link it prints, which usually stays the same.
- **"Mac could not press the key"**: Turn on Terminal under Accessibility (see above), then quit and restart Kindle Remote.
- **The page doesn't turn but there's no error**: The key went to another window. Click on the Kindle book page on the Mac.
- **The Mac goes to sleep**: Keep the lid open and set a longer sleep time under System Settings > Lock Screen.

To stop the remote, press Control-C in Terminal or close the window.
