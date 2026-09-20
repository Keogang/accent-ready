import { useMemo, useState, type KeyboardEvent, type WheelEvent } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import type { Book, VerseLocation } from '../data/types'
import { findBook, findChapter, getNextLocation, getPreviousLocation, getChapterProgress } from '../data/navigation'
import { VerseText } from './VerseText'

interface VerseReaderProps {
  library: Book[]
  location: VerseLocation
  onLocationChange: (loc: VerseLocation) => void
  onGoHome: () => void
}

const SWIPE_DISTANCE_THRESHOLD = 60
const SWIPE_VELOCITY_THRESHOLD = 400

export function VerseReader({ library, location, onLocationChange, onGoHome }: VerseReaderProps) {
  const [direction, setDirection] = useState<1 | -1>(1)
  const [activeFootnote, setActiveFootnote] = useState<string | null>(null)

  const book = findBook(library, location.bookId)
  const chapter = book ? findChapter(book, location.chapterNumber) : undefined
  const verse = chapter?.verses.find((v) => v.number === location.verseNumber)
  const progress = getChapterProgress(library, location)

  const nextLocation = useMemo(() => getNextLocation(library, location), [library, location])
  const previousLocation = useMemo(() => getPreviousLocation(library, location), [library, location])

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
        <div className="icon-button icon-button--spacer" aria-hidden="true" />
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
            <p className="verse-text">
              <VerseText text={verse.text} footnotes={verse.footnotes} onMarkerTap={setActiveFootnote} />
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="reader-footer">
        {verse.footnotes && verse.footnotes.length > 0 ? (
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
        ) : (
          <div className="footnotes footnotes--empty">No footnotes for this verse.</div>
        )}
        <div className="swipe-hint">{nextLocation ? '↑ swipe up for next verse' : 'end of the library'}</div>
      </div>
    </div>
  )
}
