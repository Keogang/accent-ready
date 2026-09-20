import { useEffect, useState } from 'react'
import type { Book, VerseLocation } from './data/types'
import { loadImportedLibrary, fetchBundledLibrary, saveLibrary, clearImportedLibrary } from './data/storage'
import { sampleLibrary } from './data/sampleLibrary'
import { HomeScreen } from './components/HomeScreen'
import { VerseReader } from './components/VerseReader'
import './App.css'

type LibrarySource = 'imported' | 'bundled' | 'sample'

export default function App() {
  const [library, setLibrary] = useState<Book[] | null>(null)
  const [source, setSource] = useState<LibrarySource>('bundled')
  const [location, setLocation] = useState<VerseLocation | null>(null)

  useEffect(() => {
    const imported = loadImportedLibrary()
    if (imported) {
      setLibrary(imported)
      setSource('imported')
      return
    }
    fetchBundledLibrary()
      .then((bundled) => {
        setLibrary(bundled)
        setSource('bundled')
      })
      .catch(() => {
        setLibrary(sampleLibrary)
        setSource('sample')
      })
  }, [])

  function handleImportLibrary(newLibrary: Book[]) {
    saveLibrary(newLibrary)
    setLibrary(newLibrary)
    setSource('imported')
    setLocation(null)
  }

  function handleResetToBundled() {
    clearImportedLibrary()
    setLibrary(null)
    setLocation(null)
    fetchBundledLibrary()
      .then((bundled) => {
        setLibrary(bundled)
        setSource('bundled')
      })
      .catch(() => {
        setLibrary(sampleLibrary)
        setSource('sample')
      })
  }

  if (!library) {
    return (
      <div className="loading-screen">
        <p>Loading…</p>
      </div>
    )
  }

  if (!location) {
    const note =
      source === 'sample'
        ? 'Could not load the full text, showing a small placeholder sample instead.'
        : source === 'imported'
          ? null
          : 'Full Book of Mormon text (public domain edition, no footnotes/chapter summaries). Import your own JSON to use a different edition.'
    return (
      <HomeScreen
        library={library}
        onSelectChapter={setLocation}
        onImportLibrary={handleImportLibrary}
        onResetToDefault={handleResetToBundled}
        note={note}
        canReset={source === 'imported'}
      />
    )
  }

  return (
    <VerseReader
      library={library}
      location={location}
      onLocationChange={setLocation}
      onGoHome={() => setLocation(null)}
    />
  )
}
