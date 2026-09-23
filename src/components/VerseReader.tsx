import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type WheelEvent } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import type { Book, VerseLocation } from '../data/types'
import type { Annotation, AnnotationDraft } from '../data/annotationTypes'
import { getAnnotationsForVerse, parseTags } from '../data/annotations'
import { findBook, findChapter, getNextLocation, getPreviousLocation, getChapterProgress } from '../data/navigation'
import { VerseText } from './VerseText'
import { parseVerseText } from '../utils/verseText'
import { getSelectionWithinElement } from '../utils/selection'

interface VerseReaderProps {
  library: Book[]
  location: VerseLocation
  onLocationChange: (loc: VerseLocation) => void
  onGoHome: () => void
  onOpenHighlights: () => void
  annotations: Annotation[]
  onCreateHighlight: (draft: AnnotationDraft) => Annotation
  onUpdateAnnotation: (id: string, changes: Partial<Pick<Annotation, 'note' | 'tags'>>) => void
  onDeleteAnnotation: (id: string) => void
}

const SWIPE_DISTANCE_THRESHOLD = 60
const SWIPE_VELOCITY_THRESHOLD = 400

interface PendingSelection {
  start: number
  end: number
  quote: string
  rect: DOMRect
}

export function VerseReader({
  library,
  location,
  onLocationChange,
  onGoHome,
  onOpenHighlights,
  annotations,
  onCreateHighlight,
  onUpdateAnnotation,
  onDeleteAnnotation,
}: VerseReaderProps) {
  const [direction, setDirection] = useState<1 | -1>(1)
  const [activeFootnote, setActiveFootnote] = useState<string | null>(null)
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [tagsDraft, setTagsDraft] = useState('')
  const verseTextRef = useRef<HTMLParagraphElement>(null)

  const book = findBook(library, location.bookId)
  const chapter = book ? findChapter(book, location.chapterNumber) : undefined
  const verse = chapter?.verses.find((v) => v.number === location.verseNumber)
  const progress = getChapterProgress(library, location)

  const nextLocation = useMemo(() => getNextLocation(library, location), [library, location])
  const previousLocation = useMemo(() => getPreviousLocation(library, location), [library, location])

  const verseAnnotations = useMemo(
    () => getAnnotationsForVerse(annotations, location.bookId, location.chapterNumber, location.verseNumber),
    [annotations, location.bookId, location.chapterNumber, location.verseNumber],
  )
  const editingAnnotation = verseAnnotations.find((a) => a.id === editingId) ?? null

  useEffect(() => {
    setPendingSelection(null)
    setEditingId(null)
  }, [location.bookId, location.chapterNumber, location.verseNumber])

  useEffect(() => {
    if (editingAnnotation) {
      setNoteDraft(editingAnnotation.note)
      setTagsDraft(editingAnnotation.tags.map((t) => `#${t}`).join(' '))
    }
  }, [editingAnnotation?.id])

  useEffect(() => {
    function handleSelectionChange() {
      const root = verseTextRef.current
      if (!root || !verse) {
        setPendingSelection(null)
        return
      }
      const plainText = parseVerseText(verse.text).plainText
      const sel = getSelectionWithinElement(root, plainText)
      if (!sel) {
        setPendingSelection(null)
        return
      }
      const range = window.getSelection()?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()
      if (!rect || (rect.width === 0 && rect.height === 0)) {
        setPendingSelection(null)
        return
      }
      setPendingSelection({ ...sel, rect })
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [verse])

  if (!book || !chapter || !verse) {
    return (
      <div className="reader reader--empty">
        <p>That verse could not be found.</p>
        <button className="pill-button" onClick={onGoHome}>
          Back to chapters
        </button>
      </div>
    )
  }

  function goNext() {
    if (!nextLocation) return
    setDirection(1)
    setActiveFootnote(null)
    onLocationChange(nextLocation)
  }

  function goPrevious() {
    if (!previousLocation) return
    setDirection(-1)
    setActiveFootnote(null)
    onLocationChange(previousLocation)
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const root = verseTextRef.current
    const sel = window.getSelection()
    if (sel && !sel.isCollapsed && root?.contains(sel.anchorNode)) return

    const { offset, velocity } = info
    if (offset.y < -SWIPE_DISTANCE_THRESHOLD || velocity.y < -SWIPE_VELOCITY_THRESHOLD) {
      goNext()
    } else if (offset.y > SWIPE_DISTANCE_THRESHOLD || velocity.y > SWIPE_VELOCITY_THRESHOLD) {
      goPrevious()
    }
  }

  function handleWheel(e: WheelEvent) {
    if (Math.abs(e.deltaY) < 24) return
    if (e.deltaY > 0) goNext()
    else goPrevious()
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault()
      goNext()
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      goPrevious()
    }
  }

  function handleCreateHighlight() {
    if (!pendingSelection || !book || !verse) return
    const created = onCreateHighlight({
      bookId: book.id,
      bookTitle: book.title,
      chapterNumber: chapter!.number,
      verseNumber: verse.number,
      quote: pendingSelection.quote,
      start: pendingSelection.start,
      end: pendingSelection.end,
    })
    window.getSelection()?.removeAllRanges()
    setPendingSelection(null)
    setEditingId(created.id)
  }

  function handleSaveAnnotation() {
    if (!editingId) return
    onUpdateAnnotation(editingId, { note: noteDraft.trim(), tags: parseTags(tagsDraft) })
    setEditingId(null)
  }

  function handleDeleteAnnotation() {
    if (!editingId) return
    onDeleteAnnotation(editingId)
    setEditingId(null)
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="reader" onWheel={handleWheel} tabIndex={0} onKeyDown={handleKeyDown}>
      <header className="reader-topbar">
        <button className="icon-button" onClick={onGoHome} aria-label="Back to chapters">
          ⌂
        </button>
        <div className="reader-heading">
          <div className="reader-title">{book.title}</div>
          <div className="reader-subtitle">
            Chapter {chapter.number}
            {progress ? ` · Verse ${progress.index} of ${progress.total}` : ''}
          </div>
        </div>
        <button className="icon-button" onClick={onOpenHighlights} aria-label="My highlights and notes">
          ✎
        </button>
      </header>

      <div className="reader-stage">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={`${location.bookId}-${location.chapterNumber}-${location.verseNumber}`}
            className="verse-card"
            custom={direction}
            initial={{ y: direction === 1 ? 80 : -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction === 1 ? -80 : 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.5}
            onDragEnd={handleDragEnd}
          >
            <div className="verse-number">{verse.number}</div>
            <p className="verse-text" ref={verseTextRef}>
              <VerseText
                text={verse.text}
                footnotes={verse.footnotes}
                highlights={verseAnnotations}
                activeHighlightId={editingId}
                onMarkerTap={setActiveFootnote}
                onHighlightTap={(id) => setEditingId(editingId === id ? null : id)}
              />
            </p>
          </motion.div>
        </AnimatePresence>

        {pendingSelection && (
          <button
            className="highlight-toolbar"
            style={{ left: pendingSelection.rect.left + pendingSelection.rect.width / 2, top: pendingSelection.rect.top }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCreateHighlight}
          >
            + Highlight
          </button>
        )}
      </div>

      <div className="reader-footer">
        {verse.footnotes && verse.footnotes.length > 0 && (
          <div className="footnotes">
            {verse.footnotes.map((f) => (
              <button
                key={f.marker}
                className={`footnote${activeFootnote === f.marker ? ' footnote--active' : ''}`}
                onClick={() => setActiveFootnote(activeFootnote === f.marker ? null : f.marker)}
              >
                <sup>{f.marker}</sup> {f.text}
              </button>
            ))}
          </div>
        )}

        {verseAnnotations.length > 0 && (
          <div className="annotations">
            {verseAnnotations.map((a) => (
              <button
                key={a.id}
                className={`annotation-item${editingId === a.id ? ' annotation-item--active' : ''}`}
                onClick={() => setEditingId(editingId === a.id ? null : a.id)}
              >
                <span className="annotation-quote">&ldquo;{a.quote}&rdquo;</span>
                {a.note && <span className="annotation-note">{a.note}</span>}
                {a.tags.length > 0 && (
                  <span className="annotation-tags">
                    {a.tags.map((t) => (
                      <span key={t} className="tag-pill">
                        #{t}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {editingAnnotation && (
          <div className="annotation-editor">
            <div className="annotation-editor-quote">&ldquo;{editingAnnotation.quote}&rdquo;</div>
            <textarea
              className="annotation-note-input"
              placeholder="Add a note (optional)"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={2}
            />
            <input
              className="annotation-tags-input"
              placeholder="#tags (optional)"
              value={tagsDraft}
              onChange={(e) => setTagsDraft(e.target.value)}
            />
            <div className="annotation-editor-actions">
              <button className="pill-button pill-button--danger" onClick={handleDeleteAnnotation}>
                Delete
              </button>
              <button className="pill-button" onClick={handleSaveAnnotation}>
                Save
              </button>
            </div>
          </div>
        )}

        <div className="swipe-hint">{nextLocation ? '↑ swipe up for next verse' : 'end of the library'}</div>
      </div>
    </div>
  )
}
