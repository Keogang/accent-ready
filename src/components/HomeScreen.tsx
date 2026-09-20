import { useRef, useState, type ChangeEvent } from 'react'
import type { Book, VerseLocation } from '../data/types'

interface HomeScreenProps {
  library: Book[]
  onSelectChapter: (loc: VerseLocation) => void
  onImportLibrary: (library: Book[]) => void
  onResetToSample: () => void
  usingSample: boolean
}

export function HomeScreen({ library, onSelectChapter, onImportLibrary, onResetToSample, usingSample }: HomeScreenProps) {
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

  return (
    <div className="home">
      <header className="home-header">
        <h1>Verse Reader</h1>
        <p>Pick a chapter to start reading, one verse at a time.</p>
      </header>

      <div className="home-actions">
        <button className="pill-button" onClick={() => fileInputRef.current?.click()}>
          Import library (JSON)
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleFileChange} />
        {!usingSample && (
          <button className="pill-button pill-button--ghost" onClick={onResetToSample}>
            Reset to sample
          </button>
        )}
      </div>
      {importError && <p className="import-error">{importError}</p>}
      {usingSample && (
        <p className="sample-note">
          Showing sample text. Import your own JSON library to read the full book — see src/data/README.md.
        </p>
      )}

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
