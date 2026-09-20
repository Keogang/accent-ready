# Book text

The app ships with the full Book of Mormon text by default, bundled at
`public/data/book-of-mormon.json` and fetched at startup. It comes from the
[bcbooks/scriptures-json](https://github.com/bcbooks/scriptures-json) project
(public domain; see that repo's README for provenance), with footnotes and
chapter summaries left out since those carry a separate copyright claim —
only the verse text itself is included.

If the bundled file can't be loaded (e.g. offline on first visit before it's
cached), the app falls back to a small illustrative placeholder so the UI
still works.

## Importing a different edition

Use the "Import library (JSON)" button on the home screen to load a
different edition or translation, shaped like this:

```json
[
  {
    "id": "book-of-mormon",
    "title": "Book of Mormon",
    "chapters": [
      {
        "number": 1,
        "verses": [
          {
            "number": 1,
            "text": "Verse text goes here, with optional markers like {{1}} inline.",
            "footnotes": [
              { "marker": "1", "text": "Footnote text shown at the bottom of the verse." }
            ]
          }
        ]
      }
    ]
  }
]
```

- `text` renders `{{marker}}` tokens as small superscript numbers.
- `footnotes` is optional; verses without notes just render without a notes panel.
- The imported library is saved to the browser's local storage, so it persists
  between visits on the same device/browser. Use "Reset to default" on the
  home screen to go back to the bundled text.
