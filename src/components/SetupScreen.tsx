import type { Lang, Position } from '../data/types'
import { SOUNDS, SYLLABLE_OPTIONS } from '../data/sounds'
import { t } from '../i18n'

export interface Filters {
  soundIds: string[]
  /** 1, 2, 3, or 4 (meaning 4 or more). */
  syllables: number[]
  position: 'all' | Position
}

interface Props {
  lang: Lang
  filters: Filters
  matchCount: number
  onChange: (f: Filters) => void
  onToggleLang: () => void
  onSubmit: () => void
  onOpenTechniques: () => void
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function SetupScreen({ lang, filters, matchCount, onChange, onToggleLang, onSubmit, onOpenTechniques }: Props) {
  const s = t(lang)
  const selected = SOUNDS.filter((x) => filters.soundIds.includes(x.id))
  const pool = selected.flatMap((x) => x.words)
  const countFor = (n: number) => pool.filter((w) => Math.min(w.syllables, 4) === n).length
  const positions: Array<{ id: Filters['position']; label: string }> = [
    { id: 'all', label: s.posAll },
    { id: 'i', label: s.posI },
    { id: 'm', label: s.posM },
    { id: 'f', label: s.posF },
  ]

  return (
    <div className="screen setup">
      <header className="topbar">
        <div>
          <h1 className="brand">
            <span aria-hidden="true">🗣️</span> {s.appName}
          </h1>
          <p className="tagline">{s.tagline}</p>
        </div>
        <button className="btn-ghost small" onClick={onToggleLang}>
          {s.langToggle}
        </button>
      </header>

      <main className="setup-body">
        <section>
          <h2 className="section-title">{s.step1}</h2>
          <div className="sound-grid">
            {SOUNDS.map((sound) => {
              const on = filters.soundIds.includes(sound.id)
              return (
                <button
                  key={sound.id}
                  className={`sound-chip${on ? ' on' : ''}${sound.label.length > 6 ? ' wide' : ''}`}
                  aria-pressed={on}
                  onClick={() => onChange({ ...filters, soundIds: toggle(filters.soundIds, sound.id) })}
                >
                  <span className="sound-label">{sound.label}</span>
                  <span className="sound-example">{sound.example}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="section-title">{s.step2}</h2>
          <div className="chip-row">
            {SYLLABLE_OPTIONS.map((n) => {
              const on = filters.syllables.includes(n)
              const count = countFor(n)
              return (
                <button
                  key={n}
                  className={`chip${on ? ' on' : ''}`}
                  aria-pressed={on}
                  onClick={() => onChange({ ...filters, syllables: toggle(filters.syllables, n) })}
                >
                  {s.syllable(n)}
                  {selected.length > 0 && <span className="chip-count">{count}</span>}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="section-title">{s.step3}</h2>
          <div className="segmented" role="radiogroup">
            {positions.map((p) => (
              <button
                key={p.id}
                role="radio"
                aria-checked={filters.position === p.id}
                className={filters.position === p.id ? 'on' : ''}
                onClick={() => onChange({ ...filters, position: p.id })}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {selected.length > 0 && matchCount === 0 && <p className="notice">{s.noWords}</p>}
        <p className="fine-print">{s.slpNote}</p>
      </main>

      <footer className="bottom-bar">
        <button className="btn-secondary" onClick={onOpenTechniques} disabled={selected.length === 0}>
          <span aria-hidden="true">💡</span> {s.techniques}
        </button>
        <button className="btn-primary" onClick={onSubmit} disabled={matchCount === 0}>
          {selected.length === 0 ? s.pickSound : s.showWords(matchCount)}
        </button>
      </footer>
    </div>
  )
}
