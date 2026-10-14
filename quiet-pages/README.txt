QUIET PAGES — hides words you choose in Kindle Cloud Reader
=============================================================

INSTALL (Comet or Chrome)
1. Unzip quiet-pages.zip. You get a folder named "quiet-pages".
2. In the address bar, go to:  chrome://extensions
   (In Comet, comet://extensions also works.)
3. Turn on "Developer mode" (switch in the top-right corner).
4. Click "Load unpacked" and choose the "quiet-pages" folder.
5. Click the puzzle-piece icon in the toolbar and pin Quiet Pages.

UPDATING FROM AN EARLIER VERSION
Replace the old quiet-pages folder with the new one (same place, same name), then
go to chrome://extensions and click the circular reload arrow on the Quiet Pages card.

HOW IT WORKS
Kindle Cloud Reader shows each book page as a picture. Quiet Pages keeps each new
page hidden for a moment ("Quiet Pages is checking this page…") while it reads the
words in the picture, then shows the page with black bars over blocked words.
The reading happens on your computer; nothing is sent anywhere.
- The first page after opening a book takes a few seconds while the reader starts.
- Later pages take about a second, or appear at once if Kindle loaded them early.

USE
- Open a book at read.amazon.com. If the book was already open, reload the page once.
- Hidden words show as black bars. The number on the toolbar icon is how many
  words are hidden on the current page.
- Click the icon to choose what to hide, how to hide it, and to add your own words.

CHECK THAT IT WORKS
Click the icon while a book page is open. Under "This page", the box should show
the words of the page you're on, with blocked words shown as ■■■■, and a count of
pages checked. If it shows a red "Problem" line, or no pages checked, tell Claude.

KNOWN LIMITS
- Word reading is very accurate on normal book text but not perfect. Unusual fonts,
  very small text, or words split across two lines with a hyphen may be missed.
- The text inside pictures in the book (maps, illustrations) is read too, but less
  reliably.
- Your book is never changed. Turn the extension off and every word comes back.
- Do not leave "Developer mode" extensions from unknown sources installed; this one
  only runs on read.amazon.* pages and sends nothing anywhere.

RUNNING THE TESTS (for developers)
  node tests/filter.test.cjs .
  CHROMIUM_PATH=/path/to/chromium node tests/e2e.test.cjs . /tmp
  CHROMIUM_PATH=/path/to/chromium node tests/e2e-images.test.cjs . /tmp
The browser tests load the extension in Chromium against fake read.amazon.com pages:
one with real text, one that shows pages as images like Kindle does.

The word reader is Tesseract.js 5.1.1 (Apache 2.0 license, see vendor/), with the
English "best_int" language data from @tesseract.js-data/eng.
