import type { VerseLocation } from './types'

const STORAGE_KEY = 'verse-reader:progress'

export function loadProgress(): VerseLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.bookId === 'string' && typeof parsed.chapterNumber === 'number' && typeof parsed.verseNumber === 'number') {
      return parsed as VerseLocation
    }
    return null
  } catch {
    return null
  }
}

export function saveProgress(location: VerseLocation): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
}
