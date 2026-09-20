import type { Book } from './types'

// Small illustrative sample so the reader works out of the box.
// Replace this by importing your own JSON library from the home screen
// (see src/data/README.md for the schema).
export const sampleLibrary: Book[] = [
  {
    id: 'sample-book',
    title: 'Sample Book',
    chapters: [
      {
        number: 1,
        verses: [
          {
            number: 1,
            text: 'This is the first verse of the sample chapter, shown one at a time so you can focus on it.{{1}}',
            footnotes: [
              { marker: '1', text: 'Swipe up to move to the next verse, swipe down to go back.' },
            ],
          },
          {
            number: 2,
            text: 'A verse can carry more than one footnote marker{{1}}, each tied to a note at the bottom{{2}}.',
            footnotes: [
              { marker: '1', text: 'Footnote markers appear as small superscript numbers.' },
              { marker: '2', text: 'Tap a marker to jump to its note, or just read them below the verse.' },
            ],
          },
          {
            number: 3,
            text: 'Verses with no footnotes render without the notes panel, keeping the page clean.',
          },
        ],
      },
      {
        number: 2,
        verses: [
          {
            number: 1,
            text: 'Reaching the end of a chapter carries you straight into the next one, so reading never stops.',
          },
          {
            number: 2,
            text: 'Use the home button in the top corner any time to pick a different chapter.',
          },
        ],
      },
    ],
  },
]
