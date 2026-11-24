import type { ReactNode } from 'react'

/** Wraps every match of the sound's pattern in a <mark> so parents can see the target sound. */
export function highlight(text: string, pattern: RegExp): ReactNode[] {
  const re = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g')
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    out.push(<mark key={i}>{m[0]}</mark>)
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}
