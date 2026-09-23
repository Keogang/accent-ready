import type { Annotation, AnnotationDraft } from './annotationTypes'

const STORAGE_KEY = 'verse-reader:annotations'

export function loadAnnotations(): Annotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Annotation[]) : []
  } catch {
    return []
  }
}

function saveAnnotations(annotations: Annotation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations))
}

export function createAnnotation(all: Annotation[], draft: AnnotationDraft): { annotations: Annotation[]; created: Annotation } {
  const now = new Date().toISOString()
  const created: Annotation = {
    ...draft,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    note: '',
    tags: [],
    createdAt: now,
    updatedAt: now,
  }
  const annotations = [...all, created]
  saveAnnotations(annotations)
  return { annotations, created }
}

export function updateAnnotation(all: Annotation[], id: string, changes: Partial<Pick<Annotation, 'note' | 'tags'>>): Annotation[] {
  const annotations = all.map((a) => (a.id === id ? { ...a, ...changes, updatedAt: new Date().toISOString() } : a))
  saveAnnotations(annotations)
  return annotations
}

export function deleteAnnotation(all: Annotation[], id: string): Annotation[] {
  const annotations = all.filter((a) => a.id !== id)
  saveAnnotations(annotations)
  return annotations
}

export function getAnnotationsForVerse(all: Annotation[], bookId: string, chapterNumber: number, verseNumber: number): Annotation[] {
  return all
    .filter((a) => a.bookId === bookId && a.chapterNumber === chapterNumber && a.verseNumber === verseNumber)
    .sort((a, b) => a.start - b.start)
}

const HASHTAG_PATTERN = /#([a-z0-9_-]+)/gi

/** Parses free-form "#faith #hope-x" style input into a de-duplicated,
 * lowercased tag list. A bare word without '#' is accepted too, for
 * convenience when the field only holds a single tag. */
export function parseTags(input: string): string[] {
  const found: string[] = []
  let match: RegExpExecArray | null
  HASHTAG_PATTERN.lastIndex = 0
  while ((match = HASHTAG_PATTERN.exec(input)) !== null) {
    found.push(match[1].toLowerCase())
  }
  if (found.length === 0) {
    const bare = input.trim().replace(/^#/, '')
    if (bare) found.push(bare.toLowerCase())
  }
  return Array.from(new Set(found))
}

export function getAllTags(all: Annotation[]): string[] {
  const set = new Set<string>()
  for (const a of all) for (const t of a.tags) set.add(t)
  return Array.from(set).sort()
}
