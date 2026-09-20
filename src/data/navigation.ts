import type { Book, VerseLocation, Verse, Chapter } from './types'

export function findBook(library: Book[], bookId: string): Book | undefined {
  return library.find((b) => b.id === bookId)
}

export function findChapter(book: Book, chapterNumber: number): Chapter | undefined {
  return book.chapters.find((c) => c.number === chapterNumber)
}

export function findVerse(chapter: Chapter, verseNumber: number): Verse | undefined {
  return chapter.verses.find((v) => v.number === verseNumber)
}

export function getVerseAt(library: Book[], loc: VerseLocation): Verse | undefined {
  const book = findBook(library, loc.bookId)
  if (!book) return undefined
  const chapter = findChapter(book, loc.chapterNumber)
  if (!chapter) return undefined
  return findVerse(chapter, loc.verseNumber)
}

export function getNextLocation(library: Book[], loc: VerseLocation): VerseLocation | undefined {
  const bookIndex = library.findIndex((b) => b.id === loc.bookId)
  if (bookIndex === -1) return undefined
  const book = library[bookIndex]
  const chapterIndex = book.chapters.findIndex((c) => c.number === loc.chapterNumber)
  if (chapterIndex === -1) return undefined
  const chapter = book.chapters[chapterIndex]
  const verseIndex = chapter.verses.findIndex((v) => v.number === loc.verseNumber)
  if (verseIndex === -1) return undefined

  if (verseIndex + 1 < chapter.verses.length) {
    return { bookId: book.id, chapterNumber: chapter.number, verseNumber: chapter.verses[verseIndex + 1].number }
  }
  if (chapterIndex + 1 < book.chapters.length) {
    const nextChapter = book.chapters[chapterIndex + 1]
    return { bookId: book.id, chapterNumber: nextChapter.number, verseNumber: nextChapter.verses[0].number }
  }
  if (bookIndex + 1 < library.length) {
    const nextBook = library[bookIndex + 1]
    const nextChapter = nextBook.chapters[0]
    return { bookId: nextBook.id, chapterNumber: nextChapter.number, verseNumber: nextChapter.verses[0].number }
  }
  return undefined
}

export function getPreviousLocation(library: Book[], loc: VerseLocation): VerseLocation | undefined {
  const bookIndex = library.findIndex((b) => b.id === loc.bookId)
  if (bookIndex === -1) return undefined
  const book = library[bookIndex]
  const chapterIndex = book.chapters.findIndex((c) => c.number === loc.chapterNumber)
  if (chapterIndex === -1) return undefined
  const chapter = book.chapters[chapterIndex]
  const verseIndex = chapter.verses.findIndex((v) => v.number === loc.verseNumber)
  if (verseIndex === -1) return undefined

  if (verseIndex - 1 >= 0) {
    return { bookId: book.id, chapterNumber: chapter.number, verseNumber: chapter.verses[verseIndex - 1].number }
  }
  if (chapterIndex - 1 >= 0) {
    const prevChapter = book.chapters[chapterIndex - 1]
    const lastVerse = prevChapter.verses[prevChapter.verses.length - 1]
    return { bookId: book.id, chapterNumber: prevChapter.number, verseNumber: lastVerse.number }
  }
  if (bookIndex - 1 >= 0) {
    const prevBook = library[bookIndex - 1]
    const prevChapter = prevBook.chapters[prevBook.chapters.length - 1]
    const lastVerse = prevChapter.verses[prevChapter.verses.length - 1]
    return { bookId: prevBook.id, chapterNumber: prevChapter.number, verseNumber: lastVerse.number }
  }
  return undefined
}

export function getChapterProgress(library: Book[], loc: VerseLocation): { index: number; total: number } | undefined {
  const book = findBook(library, loc.bookId)
  if (!book) return undefined
  const chapter = findChapter(book, loc.chapterNumber)
  if (!chapter) return undefined
  const index = chapter.verses.findIndex((v) => v.number === loc.verseNumber)
  if (index === -1) return undefined
  return { index: index + 1, total: chapter.verses.length }
}
