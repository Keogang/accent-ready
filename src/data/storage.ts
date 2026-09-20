import type { Book } from './types'

const STORAGE_KEY = 'verse-reader:library'
const BUNDLED_LIBRARY_URL = `${import.meta.env.BASE_URL}data/book-of-mormon.json`

export function loadImportedLibrary(): Book[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as Book[]
    return null
  } catch {
    return null
  }
}

export async function fetchBundledLibrary(): Promise<Book[]> {
  const response = await fetch(BUNDLED_LIBRARY_URL)
  if (!response.ok) throw new Error(`Failed to load bundled library: ${response.status}`)
  const parsed = await response.json()
  if (!Array.isArray(parsed) || parsed.length === 0) throw new Error('Bundled library was empty.')
  return parsed as Book[]
}

export function saveLibrary(library: Book[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library))
}

export function clearImportedLibrary(): void {
  localStorage.removeItem(STORAGE_KEY)
}
