export interface Footnote {
  marker: string
  text: string
}

export interface Verse {
  number: number
  text: string
  footnotes?: Footnote[]
}

export interface Chapter {
  number: number
  verses: Verse[]
}

export interface Book {
  id: string
  title: string
  chapters: Chapter[]
}

export interface VerseLocation {
  bookId: string
  chapterNumber: number
  verseNumber: number
}
