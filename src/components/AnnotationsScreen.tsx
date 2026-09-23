import { useMemo, useState } from 'react'
import type { Annotation } from '../data/annotationTypes'
import { getAllTags } from '../data/annotations'
import type { VerseLocation } from '../data/types'

interface AnnotationsScreenProps {
  annotations: Annotation[]
  onBack: () => void
  onJumpTo: (loc: VerseLocation) => void
  onDeleteAnnotation: (id: string) => void
}

export function AnnotationsScreen({ annotations, onBack, onJumpTo, onDeleteAnnotation }: AnnotationsScreenProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const allTags = useMemo(() => getAllTags(annotations), [annotations])

  const sorted = useMemo(
    () => [...annotations].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [annotations],
  )
  const filtered = activeTag ? sorted.filter((a) => a.tags.includes(activeTag)) : sorted

  return (
    <div className="home">
      <header className="reader-topbar reader-topbar--inline">
        <button className="icon-button" onClick={onBack} aria-label="Back">
          ←
        </button>
        <div className="reader-heading">
          <div className="reader-title">Highlights &amp; Notes</div>
          <div className="reader-subtitle">{annotations.length} saved</div>
        </div>
        <div className="icon-button icon-button--spacer" aria-hidden="true" />
      </header>

      {allTags.length > 0 && (
        <div className="tag-filter">
          <button className={`tag-pill tag-pill--filter${activeTag === null ? ' tag-pill--active' : ''}`} onClick={() => setActiveTag(null)}>
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag-pill tag-pill--filter${activeTag === t ? ' tag-pill--active' : ''}`}
              onClick={() => setActiveTag(activeTag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="sample-note" style={{ marginTop: '2rem' }}>
          {annotations.length === 0
            ? 'Select text in a verse and tap "+ Highlight" to save your first highlight, note, or tag.'
            : 'No highlights match this tag.'}
        </p>
      ) : (
        <div className="saved-list">
          {filtered.map((a) => (
            <div key={a.id} className="saved-item">
              <button
                className="saved-item-main"
                onClick={() => onJumpTo({ bookId: a.bookId, chapterNumber: a.chapterNumber, verseNumber: a.verseNumber })}
              >
                <div className="saved-item-reference">
                  {a.bookTitle} {a.chapterNumber}:{a.verseNumber}
                </div>
                <div className="saved-item-quote">&ldquo;{a.quote}&rdquo;</div>
                {a.note && <div className="saved-item-note">{a.note}</div>}
                {a.tags.length > 0 && (
                  <div className="annotation-tags">
                    {a.tags.map((t) => (
                      <span key={t} className="tag-pill">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
              <button className="saved-item-delete" onClick={() => onDeleteAnnotation(a.id)} aria-label="Delete">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
