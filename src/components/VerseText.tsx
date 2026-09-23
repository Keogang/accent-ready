import type { ReactNode } from 'react'
import type { Annotation } from '../data/annotationTypes'
import type { Footnote } from '../data/types'
import { parseVerseText } from '../utils/verseText'

interface VerseTextProps {
  text: string
  footnotes?: Footnote[]
  highlights?: Annotation[]
  activeHighlightId?: string | null
  onMarkerTap?: (marker: string) => void
  onHighlightTap?: (id: string) => void
}

function clamp(n: number, max: number) {
  return Math.max(0, Math.min(max, n))
}

export function VerseText({ text, footnotes, highlights = [], activeHighlightId, onMarkerTap, onHighlightTap }: VerseTextProps) {
  const { plainText, markers } = parseVerseText(text)

  const points = new Set<number>([0, plainText.length])
  for (const h of highlights) {
    points.add(clamp(h.start, plainText.length))
    points.add(clamp(h.end, plainText.length))
  }
  for (const m of markers) {
    points.add(clamp(m.plainIndex, plainText.length))
  }
  const boundaries = Array.from(points).sort((a, b) => a - b)

  const nodes: ReactNode[] = []
  const emitMarkersAt = (index: number, key: string) => {
    markers
      .filter((m) => m.plainIndex === index)
      .forEach((m, i) => {
        const hasNote = footnotes?.some((f) => f.marker === m.marker)
        nodes.push(
          <sup
            key={`${key}-marker-${i}`}
            className={hasNote ? 'verse-marker' : 'verse-marker verse-marker--empty'}
            onClick={hasNote && onMarkerTap ? () => onMarkerTap(m.marker) : undefined}
          >
            {m.marker}
          </sup>,
        )
      })
  }

  for (let i = 0; i < boundaries.length - 1; i++) {
    const segStart = boundaries[i]
    const segEnd = boundaries[i + 1]
    emitMarkersAt(segStart, `b${i}`)
    if (segEnd > segStart) {
      const segText = plainText.slice(segStart, segEnd)
      const highlight = highlights.find((h) => h.start <= segStart && segEnd <= h.end)
      if (highlight) {
        const classNames = ['highlight-mark']
        if (highlight.note) classNames.push('highlight-mark--noted')
        if (highlight.id === activeHighlightId) classNames.push('highlight-mark--active')
        nodes.push(
          <mark
            key={`seg-${i}`}
            className={classNames.join(' ')}
            onClick={onHighlightTap ? () => onHighlightTap(highlight.id) : undefined}
          >
            {segText}
          </mark>,
        )
      } else {
        nodes.push(<span key={`seg-${i}`}>{segText}</span>)
      }
    }
  }
  emitMarkersAt(plainText.length, 'end')

  return <>{nodes}</>
}
