QUIET PAGES — hides words you choose in Kindle Cloud Reader
=============================================================

INSTALL (Comet or Chrome)
1. Unzip quiet-pages.zip. You get a folder named "quiet-pages".
2. In the address bar, go to:  chrome://extensions
   (In Comet, comet://extensions also works.)
3. Turn on "Developer mode" (switch in the top-right corner).
4. Click "Load unpacked" and choose the "quiet-pages" folder.
5. Click the puzzle-piece icon in the toolbar and pin Quiet Pages.

USE
- Open a book at read.amazon.com. If the book was already open, reload the page once.
- Hidden words show as black bars. The number on the toolbar icon is how many
  words are hidden on the current page.
- Click the icon to choose what to hide, how to hide it, and to add your own words.

CHECK THAT IT WORKS
Click the icon while a book page is open. Under "This page", the box should show
words from your book, with blocked words shown as ■■■■. If it's empty or gibberish,
tell Claude.

KNOWN LIMITS
- If a word is split across styling (for example half in italics), it may be missed.
- Your book is never changed. Turn the extension off and every word comes back.
- Do not leave "Developer mode" extensions from unknown sources installed; this one
  only runs on read.amazon.* pages and sends nothing anywhere.

RUNNING THE TESTS (for developers)
  node tests/filter.test.cjs .
  CHROMIUM_PATH=/path/to/chromium node tests/e2e.test.cjs . /tmp
The second test loads the extension in Chromium against a fake read.amazon.com page.
