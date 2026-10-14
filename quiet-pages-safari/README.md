# Quiet Pages for Safari

The Safari version of Quiet Pages: it hides words you choose while you read in
Kindle Cloud Reader (read.amazon.com). It works the same way as the Chrome/Comet
version: each page image stays hidden for a moment while the extension reads its
words on your Mac, then appears with black bars over blocked words. Nothing is sent
anywhere, and your books are never changed.

## What you need

- A Mac with Safari 16.4 or later (macOS Ventura or later).
- **Xcode**, Apple's free developer app, from the Mac App Store (it's large; allow
  time to download). Apple only lets Safari extensions be installed through it.

## Install (one time, about 10 minutes)

1. **Unzip** `quiet-pages-safari.zip`. Move the `quiet-pages-safari` folder to your
   Documents folder.
2. **Open Terminal** (press Cmd + Space, type `Terminal`, press Return) and paste:

   ```
   xcrun safari-web-extension-converter ~/Documents/quiet-pages-safari/extension --app-name "Quiet Pages" --macos-only --copy-resources
   ```

   Press Return. If it asks questions, press Return to accept each default.
   Xcode opens with a new "Quiet Pages" project.
3. **Sign it with your Apple ID.** In Xcode, click "Quiet Pages" at the top of the
   left sidebar, open the **Signing & Capabilities** tab, and under **Team** choose
   your Apple ID (or "Add an Account…" to sign in). If you'd rather not sign in,
   choose **Sign to Run Locally**.
4. **Run it:** press **Cmd + R**. A small "Quiet Pages" window opens; you can close it.
5. **Allow the extension in Safari:**
   - Safari → **Settings** → **Advanced** → turn on **Show features for web developers**
     (older Safari: "Show Develop menu in menu bar").
   - Safari → **Settings** → **Developer** tab → turn on **Allow unsigned extensions**
     (older Safari: **Develop** menu → **Allow Unsigned Extensions**). Enter your Mac
     password if asked.
   - Safari → **Settings** → **Extensions** → check **Quiet Pages**.
6. **Open a book** at read.amazon.com. When Safari asks whether Quiet Pages may use
   the site, choose **Always Allow on This Website**.

> If you chose "Sign to Run Locally", Safari turns **Allow unsigned extensions** off
> each time it quits. Turn it back on (step 5) after restarting Safari.

## Use

Same as the Chrome version: click the Quiet Pages button in Safari's toolbar to choose
what to hide, how to hide it, and to add your own words. The **This page** box shows
the words read from the page you're on, with blocked ones as ■■■■.

The first page after opening a book (or after Safari has been idle for a while) takes
a few seconds while the word reader starts.

## For developers

- The shared code lives in `../quiet-pages` (the Chrome version). `src/` holds only the
  Safari-specific files: the manifest and a background page that runs the word reader
  directly, since Safari has no offscreen documents.
- `./build.sh` rebuilds `extension/` from both. Run it after changing either, and commit
  the result.
- `node tests/safari-background.test.cjs` checks the Safari background page in Chromium
  (set `CHROMIUM_PATH` if needed). It can't test Safari itself; that needs a Mac.
