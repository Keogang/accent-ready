import type { Lang, PracticeItem } from '../data/types'
import { SOUND_BY_ID } from '../data/sounds'
import { highlight } from '../highlight'
import { t } from '../i18n'

interface Props {
  lang: Lang
  items: PracticeItem[]
  onBack: () => void
  onPick: (index: number) => void
  onOpenTechniques: () => void
}

export function WordList({ lang, items, onBack, onPick, onOpenTechniques }: Props) {
  const s = t(lang)
  return (
    <div className="screen">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={s.back}>
          ←
        </button>
        <h1 className="screen-title">
          {s.wordsTitle} <span className="muted">({items.length})</span>
        </h1>
        <button className="btn-ghost small" onClick={onOpenTechniques}>
          💡 {s.techniques}
        </button>
      </header>

      <main className="word-grid">
        {items.map((item, i) => {
          const sound = SOUND_BY_ID[item.soundId]
          return (
            <button key={item.key} className="word-tile" onClick={() => onPick(i)}>
              <span className="tile-pic" aria-hidden="true">
                {item.pic.word}
              </span>
              <span className="tile-word">{highlight(item.word, sound.pattern)}</span>
              <span className="tile-meta">
                {sound.label} · {s.sylShort(item.syllables)}
              </span>
            </button>
          )
        })}
      </main>

      <footer className="bottom-bar">
        <button className="btn-primary" onClick={() => onPick(0)}>
          ▶ {s.practice}
        </button>
      </footer>
    </div>
  )
}
