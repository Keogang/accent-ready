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
- **Select text** in a verse to highlight it — a "+ Highlight" button
  appears; tap it, then optionally add a note and `#tags` in the panel
  that opens below the verse.
- **Pencil icon** (top-right in the reader), or "Highlights & notes" on the
  home screen: opens every saved highlight/note, filterable by tag. Tap an
  entry to jump straight to that verse.

## Reading progress

Your position is saved automatically as you read (in the browser's local
storage) and offered as "Continue reading" on the home screen — no explicit
save step needed.
