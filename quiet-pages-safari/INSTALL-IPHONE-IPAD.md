# Quiet Pages on iPhone and iPad

The same Quiet Pages extension runs in Safari on iPhone and iPad. Apple only allows
this through **Xcode** on a **Mac**, so the Mac builds a small app, puts it on your
iPhone or iPad over a cable, and the extension comes with it.

## What you need

- A Mac with **Xcode** (free, Mac App Store).
- An iPhone or iPad on iOS / iPadOS 16.4 or later, and a cable to connect it to the Mac.
- An Apple ID (your normal one works).

> **With a free Apple ID, the app stops working after 7 days.** To renew it, connect
> your iPhone or iPad and press Cmd + R in Xcode again (step 5). A paid Apple Developer
> membership ($99 a year) makes it last a year.

## Install (one time, about 15 minutes)

1. **Unzip** `quiet-pages-safari.zip` on your Mac and move the `quiet-pages-safari`
   folder to your **Documents** folder.

2. **Create the app.** Open **Terminal** (Cmd + Space, type `Terminal`, press Return),
   paste this, and replace `yourname` with any word, such as your last name:

   ```
   xcrun safari-web-extension-converter ~/Documents/quiet-pages-safari/extension --app-name "Quiet Pages Mobile" --ios-only --copy-resources --bundle-identifier com.yourname.quietpages
   ```

   Press Return, and press Return again to accept any questions. Xcode opens.

3. **Sign it with your Apple ID.** In Xcode, click **Quiet Pages Mobile** at the top of
   the left sidebar. Under **Targets** there are two entries. For **each one**, open
   **Signing & Capabilities** and set **Team** to your Apple ID ("Add an Account…" if
   it isn't listed). If Xcode says the bundle identifier isn't available, change
   `yourname` to something more unusual.

4. **Connect your iPhone or iPad** with the cable, unlock it, and tap **Trust** if asked.
   Then turn on Developer Mode on the device: **Settings → Privacy & Security →
   Developer Mode → On**. It restarts. (If Developer Mode isn't listed, do step 5 once;
   it appears after Xcode first sees the device.)

5. **Put the app on the device.** At the top of the Xcode window, click the device menu
   and pick your iPhone or iPad. Press **Cmd + R**.
   If the device says **Untrusted Developer**: **Settings → General → VPN & Device
   Management →** your Apple ID **→ Trust**, then press Cmd + R again.

6. **Turn on the extension** on the device:
   **Settings → Apps → Safari → Extensions → Quiet Pages Mobile** → turn it on, and set
   **read.amazon.com** (or **All Websites**) to **Allow**.
   (On iOS 17 and earlier: **Settings → Safari → Extensions**.)

7. **Read.** In Safari, go to **read.amazon.com**, sign in, and open a book.
   To change settings, tap the **puzzle piece** (or **AA**) in the address bar, then
   **Quiet Pages Mobile**.

## If something goes wrong

- **Amazon shows "Get the Kindle app" instead of the book:** tap **AA** in the address
  bar → **Request Desktop Website**.
- **Pages stay on "Quiet Pages is checking this page…" for a long time:** iPhones read
  pages more slowly than computers, and the first page after a pause is slowest while
  the reader starts. If it never finishes, open the extension's settings and tell
  Claude what the red "Problem" line says.
- **The extension disappeared after a week:** the free 7-day signing ran out. Repeat step 5.

The Kindle *app* can't be filtered: Apple doesn't let extensions into other apps. Quiet
Pages works only when you read in Safari.
