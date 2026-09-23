import { useEffect, useState } from 'react'
import type { Book, VerseLocation } from './data/types'
import { loadImportedLibrary, fetchBundledLibrary, saveLibrary, clearImportedLibrary } from './data/storage'
import { sampleLibrary } from './data/sampleLibrary'
import { loadAnnotations, createAnnotation, updateAnnotation, deleteAnnotation } from './data/annotations'
import type { Annotation, AnnotationDraft } from './data/annotationTypes'
import { loadProgress, saveProgress } from './data/progress'
import { HomeScreen } from './components/HomeScreen'
import { VerseReader } from './components/VerseReader'
import { AnnotationsScreen } from './components/AnnotationsScreen'
import './App.css'

type LibrarySource = 'imported' | 'bundled' | 'sample'

export default function App() {
  const [library, setLibrary] = useState<Book[] | null>(null)
  const [source, setSource] = useState<LibrarySource>('bundled')
  const [location, setLocation] = useState<VerseLocation | null>(null)
  const [continueLocation, setContinueLocation] = useState<VerseLocation | null>(() => loadProgress())
  const [highlightsOpen, setHighlightsOpen] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>(() => loadAnnotations())

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

  useEffect(() => {
    if (!location) return
    saveProgress(location)
    setContinueLocation(location)
  }, [location])

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

  function handleCreateHighlight(draft: AnnotationDraft): Annotation {
    const { annotations: next, created } = createAnnotation(annotations, draft)
    setAnnotations(next)
    return created
  }

  function handleUpdateAnnotation(id: string, changes: Partial<Pick<Annotation, 'note' | 'tags'>>) {
    setAnnotations(updateAnnotation(annotations, id, changes))
  }

  function handleDeleteAnnotation(id: string) {
    setAnnotations(deleteAnnotation(annotations, id))
  }

  if (!library) {
    return (
      <div className="loading-screen">
        <p>Loading…</p>
      </div>
    )
  }

  if (highlightsOpen) {
    return (
      <AnnotationsScreen
        annotations={annotations}
        onBack={() => setHighlightsOpen(false)}
        onJumpTo={(loc) => {
          setLocation(loc)
          setHighlightsOpen(false)
        }}
        onDeleteAnnotation={handleDeleteAnnotation}
      />
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
        continueLocation={continueLocation}
        onOpenHighlights={() => setHighlightsOpen(true)}
        annotationCount={annotations.length}
      />
    )
  }

  return (
    <VerseReader
      library={library}
      location={location}
      onLocationChange={setLocation}
      onGoHome={() => setLocation(null)}
      onOpenHighlights={() => setHighlightsOpen(true)}
      annotations={annotations}
      onCreateHighlight={handleCreateHighlight}
      onUpdateAnnotation={handleUpdateAnnotation}
      onDeleteAnnotation={handleDeleteAnnotation}
    />
  )
}
