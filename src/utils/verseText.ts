const MARKER_PATTERN = /\{\{(.+?)\}\}/g

export interface MarkerInsertion {
  plainIndex: number
  marker: string
}

export interface ParsedVerseText {
  plainText: string
  markers: MarkerInsertion[]
}

/** Strips {{marker}} footnote tokens out of the raw verse text, recording
 * where each one falls in the resulting plain text so it can be re-inserted
 * when rendering. Highlight offsets are always measured against plainText. */
export function parseVerseText(text: string): ParsedVerseText {
  let plainText = ''
  const markers: MarkerInsertion[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  MARKER_PATTERN.lastIndex = 0

  while ((match = MARKER_PATTERN.exec(text)) !== null) {
    plainText += text.slice(lastIndex, match.index)
    markers.push({ plainIndex: plainText.length, marker: match[1] })
    lastIndex = MARKER_PATTERN.lastIndex
  }
  plainText += text.slice(lastIndex)

  return { plainText, markers }
}
