import { useState } from 'react'
import type { Book, VerseLocation } from './data/types'
import { loadLibrary, saveLibrary, clearLibrary, isUsingSampleLibrary } from './data/storage'
import { HomeScreen } from './components/HomeScreen'
import { VerseReader } from './components/VerseReader'
import './App.css'

export default function App() {
  const [library, setLibrary] = useState<Book[]>(() => loadLibrary())
  const [location, setLocation] = useState<VerseLocation | null>(null)

  function handleImportLibrary(newLibrary: Book[]) {
    saveLibrary(newLibrary)
    setLibrary(newLibrary)
    setLocation(null)
  }

  function handleResetToSample() {
    clearLibrary()
    setLibrary(loadLibrary())
    setLocation(null)
  }

  if (!location) {
    return (
      <HomeScreen
        library={library}
        onSelectChapter={setLocation}
        onImportLibrary={handleImportLibrary}
        onResetToSample={handleResetToSample}
        usingSample={isUsingSampleLibrary(library)}
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
