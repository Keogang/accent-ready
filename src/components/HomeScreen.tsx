import { useRef, useState, type ChangeEvent } from 'react'
import type { Book, VerseLocation } from '../data/types'
import { findBook } from '../data/navigation'

interface HomeScreenProps {
  library: Book[]
  onSelectChapter: (loc: VerseLocation) => void
  onImportLibrary: (library: Book[]) => void
  onResetToDefault: () => void
  note: string | null
  canReset: boolean
  continueLocation: VerseLocation | null
  onOpenHighlights: () => void
  annotationCount: number
}

export function HomeScreen({
  library,
  onSelectChapter,
  onImportLibrary,
  onResetToDefault,
  note,
  canReset,
  continueLocation,
  onOpenHighlights,
  annotationCount,
}: HomeScreenProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(library[0]?.id ?? null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Expected a non-empty array of books.')
      }
      setImportError(null)
      onImportLibrary(parsed as Book[])
      setExpandedBookId(parsed[0]?.id ?? null)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Could not read that file.')
    }
  }

  const continueBook = continueLocation ? findBook(library, continueLocation.bookId) : undefined

  return (
    <div className="home">
      <header className="home-header">
        <h1>Verse Reader</h1>
        <p>Pick a chapter to start reading, one verse at a time.</p>
      </header>

      {continueLocation && continueBook && (
        <button className="continue-card" onClick={() => onSelectChapter(continueLocation)}>
          <span className="continue-card-label">Continue reading</span>
          <span className="continue-card-reference">
            {continueBook.title} {continueLocation.chapterNumber}:{continueLocation.verseNumber}
          </span>
        </button>
      )}

      <div className="home-actions">
        <button className="pill-button" onClick={() => fileInputRef.current?.click()}>
          Import library (JSON)
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
        <button className="pill-button pill-button--ghost" onClick={onOpenHighlights}>
          Highlights &amp; notes{annotationCount > 0 ? ` (${annotationCount})` : ''}
        </button>
        {canReset && (
          <button className="pill-button pill-button--ghost" onClick={onResetToDefault}>
            Reset to default
          </button>
        )}
      </div>
      {importError && <p className="import-error">{importError}</p>}
      {note && <p className="sample-note">{note}</p>}

      <div className="book-list">
        {library.map((book) => {
          const isExpanded = expandedBookId === book.id
          return (
            <div key={book.id} className="book-group">
              <button
                className="book-header"
                onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                aria-expanded={isExpanded}
              >
                <span>{book.title}</span>
                <span className="book-header-chevron">{isExpanded ? '−' : '+'}</span>
              </button>
              {isExpanded && (
                <div className="chapter-grid">
                  {book.chapters.map((chapter) => (
                    <button
                      key={chapter.number}
                      className="chapter-tile"
                      onClick={() =>
                        onSelectChapter({
                          bookId: book.id,
                          chapterNumber: chapter.number,
                          verseNumber: chapter.verses[0].number,
                        })
                      }
                    >
                      {chapter.number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
