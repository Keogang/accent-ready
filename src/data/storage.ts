import type { Book } from './types'
import { sampleLibrary } from './sampleLibrary'

const STORAGE_KEY = 'verse-reader:library'

export function loadLibrary(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return sampleLibrary
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Book[]
    return sampleLibrary
  } catch {
    return sampleLibrary
  }
}

export function saveLibrary(library: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
}

export function isUsingSampleLibrary(library: Book[]): boolean {
  return library === sampleLibrary
}

export function clearLibrary(): void {
  localStorage.removeItem(STORAGE_KEY)
}
