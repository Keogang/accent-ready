# Kindle Remote

Turn Kindle Cloud Reader pages on your MacBook from your iPhone.

## How it works
A small program on the Mac serves a page-turner page to your iPhone over your Wi-Fi.
When you tap **Next** or **Back** on the iPhone, the Mac presses the Right or Left arrow key.
Kindle Cloud Reader (read.amazon.com) turns the page.

## One-time setup (Mac)
1. Copy this `kindle-remote` folder to your Mac (for example, into Documents).
2. Double-click **Start Kindle Remote.command**.
   - If macOS blocks it, right-click it and choose **Open**, then click **Open** again.
   - If macOS asks you to install "command line developer tools," click **Install**. That provides Python. Then double-click again.
3. Grant key-press permission. The first time you tap a button, macOS asks Terminal for permission to control your computer. Allow it, or turn on **Terminal** under
   **System Settings > Privacy & Security > Accessibility**.

## One-time setup (iPhone)
1. Connect the iPhone to the same Wi-Fi as the Mac.
2. In Safari, open the link that the Terminal window shows (for example, `http://192.168.1.20:8765/?t=abc123`).
3. Tap **Share > Add to Home Screen**. Now **Page Turner** works like an app.

## Reading
1. On the Mac, start Kindle Remote and open your book at read.amazon.com.
2. Click once on the book page so the browser window is in front.
3. On the iPhone, tap **Next** (the large button) or **Back**, or swipe left or right.

## Troubleshooting
- **"Can't reach Mac"**: Check that both devices use the same Wi-Fi and that the Terminal window is still open. If the Mac's address changed, open the new link from Terminal. You can also try the `.local` link it prints, which usually stays the same.
- **"Mac could not press the key"**: Turn on Terminal under Accessibility (see above), then quit and restart Kindle Remote.
- **The page doesn't turn but there's no error**: The key went to another window. Click on the Kindle book page on the Mac.
- **The Mac goes to sleep**: Keep the lid open and set a longer sleep time under System Settings > Lock Screen.

To stop the remote, press Control-C in Terminal or close the window.
