export interface Annotation {
  id: string
  bookId: string
  bookTitle: string
  chapterNumber: number
  verseNumber: number
  quote: string
  start: number
  end: number
  note: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type AnnotationDraft = Pick<Annotation, 'bookId' | 'bookTitle' | 'chapterNumber' | 'verseNumber' | 'quote' | 'start' | 'end'>
