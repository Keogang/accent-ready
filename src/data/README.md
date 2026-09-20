# Importing your own text

The app ships with a tiny sample library so the reader works out of the box.
To read the real book, use the "Import library" button on the home screen to
load a JSON file shaped like this:

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
  between visits on the same device/browser.
