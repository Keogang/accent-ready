function isMarkerText(node: Node, root: HTMLElement): boolean {
  let el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement)
  while (el && el !== root) {
    if (el.classList.contains('verse-marker')) return true
    el = el.parentElement
  }
  return false
}

function resolveToTextBoundary(node: Node, offset: number): { textNode: Text; textOffset: number } | null {
  if (node.nodeType === Node.TEXT_NODE) return { textNode: node as Text, textOffset: offset }
  const children = Array.from(node.childNodes)
  if (children.length === 0) return null
  const atEnd = offset >= children.length
  const target = children[Math.min(offset, children.length - 1)]
  let textNode: Text | null = null
  if (target.nodeType === Node.TEXT_NODE) textNode = target as Text
  else if (target.firstChild?.nodeType === Node.TEXT_NODE) textNode = target.firstChild as Text
  if (!textNode) return null
  return { textNode, textOffset: atEnd ? textNode.length : 0 }
}

/** Maps a DOM selection boundary to an offset into the verse's plain text
 * (the same coordinate space as Annotation.start/end), skipping footnote
 * marker digits so offsets line up with parseVerseText's plainText. */
export function domPositionToPlainOffset(root: HTMLElement, node: Node, offset: number): number | null {
  const boundary = resolveToTextBoundary(node, offset)
  if (!boundary) return null

  let total = 0
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let current: Node | null
  while ((current = walker.nextNode())) {
    const isMarker = isMarkerText(current, root)
    if (current === boundary.textNode) {
      return isMarker ? total : total + boundary.textOffset
    }
    if (!isMarker) total += current.textContent?.length ?? 0
  }
  return null
}

export function getSelectionWithinElement(root: HTMLElement, plainText: string): { start: number; end: number; quote: string } | null {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!root.contains(range.commonAncestorContainer)) return null

  const a = domPositionToPlainOffset(root, range.startContainer, range.startOffset)
  const b = domPositionToPlainOffset(root, range.endContainer, range.endOffset)
  if (a === null || b === null || a === b) return null

  let start = Math.min(a, b)
  let end = Math.max(a, b)
  while (start < end && /\s/.test(plainText[start])) start++
  while (end > start && /\s/.test(plainText[end - 1])) end--
  if (start >= end) return null

  return { start, end, quote: plainText.slice(start, end) }
}
