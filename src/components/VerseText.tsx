import type { ReactNode } from 'react'
import type { Footnote } from '../data/types'

interface VerseTextProps {
  text: string
  footnotes?: Footnote[]
  onMarkerTap?: (marker: string) => void
}

const MARKER_PATTERN = /\{\{(.+?)\}\}/g

export function VerseText({ text, footnotes, onMarkerTap }: VerseTextProps) {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  MARKER_PATTERN.lastIndex = 0

  while ((match = MARKER_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const marker = match[1]
    const hasNote = footnotes?.some((f) => f.marker === marker)
    parts.push(
      <sup
        key={`${marker}-${match.index}`}
        className={hasNote ? 'verse-marker' : 'verse-marker verse-marker--empty'}
        onClick={hasNote && onMarkerTap ? () => onMarkerTap(marker) : undefined}
      >
        {marker}
      </sup>,
    )
    lastIndex = MARKER_PATTERN.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}
