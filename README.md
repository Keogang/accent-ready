# Verse Reader

A mobile-first reader for going through a book verse by verse. Only one verse
is on screen at a time, so you can focus on it; swipe up to move to the next
verse, swipe down to go back. Footnotes for the current verse sit in a panel
at the bottom, and a home button in the top corner takes you back to the
book/chapter picker.

## Running it

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (or resize your browser to a phone
width) to try the swipe gestures. `npm run build` produces a static
`dist/` folder you can host anywhere or wrap into a PWA/app shell.

## Book text

The app ships with the full Book of Mormon text by default (public domain
edition from [bcbooks/scriptures-json](https://github.com/bcbooks/scriptures-json),
footnotes/chapter summaries excluded — see `src/data/README.md`). Use the
"Import library (JSON)" button on the home screen to load a different
edition instead; imported text is saved to the browser's local storage, and
"Reset to default" brings back the bundled text.

## Controls

- **Swipe up / down** on the verse: next / previous verse (continues across
  chapter and book boundaries).
- **Mouse wheel** or **arrow keys** work the same way on desktop, for testing.
- **Home icon** (top-left in the reader): back to the chapter picker.
- **Tap a footnote marker** in the verse, or a note at the bottom, to
  highlight the matching note.
