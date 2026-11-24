import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Lang, Technique } from '../data/types'
import { SOUND_BY_ID } from '../data/sounds'
import { GENERAL_STRATEGIES, SOUND_TECHNIQUES } from '../data/techniques'
import { t } from '../i18n'

interface Props {
  lang: Lang
  /** Sounds to show techniques for; the first one is selected initially. */
  soundIds: string[]
  title: string
  onClose: () => void
}

type Tab = 'sound' | 'strategies'

function TechniqueCard({ tech, lang, defaultOpen }: { tech: Technique; lang: Lang; defaultOpen: boolean }) {
  const s = t(lang)
  return (
    <details className="tech" open={defaultOpen}>
      <summary>
        <span className="tech-name">{tech.name[lang]}</span>
        <span className="tech-summary">{tech.summary[lang]}</span>
      </summary>
      <div className="tech-body">
        <p className="tech-label">{s.howTo}</p>
        <ol>
          {tech.steps[lang].map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {tech.example && (
          <p className="tech-example">
            <strong>{s.tryIt}:</strong> {tech.example[lang]}
          </p>
        )}
      </div>
    </details>
  )
}

export function TechniquesSheet({ lang, soundIds, title, onClose }: Props) {
  const s = t(lang)
  const [tab, setTab] = useState<Tab>(soundIds.length ? 'sound' : 'strategies')
  const [soundId, setSoundId] = useState(soundIds[0])
  const techniques = soundId ? SOUND_TECHNIQUES[soundId] ?? [] : []

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <motion.div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={s.close}>
            ✕
          </button>
        </header>

        <div className="segmented" role="tablist">
          <button role="tab" aria-selected={tab === 'sound'} className={tab === 'sound' ? 'on' : ''} onClick={() => setTab('sound')}>
            {s.thisSound}
          </button>
          <button
            role="tab"
            aria-selected={tab === 'strategies'}
            className={tab === 'strategies' ? 'on' : ''}
            onClick={() => setTab('strategies')}
          >
            {s.strategies}
          </button>
        </div>

        <div className="sheet-body">
          {tab === 'sound' && (
            <>
              {soundIds.length > 1 && (
                <div className="chip-row scroll">
                  {soundIds.map((id) => (
                    <button key={id} className={`chip${id === soundId ? ' on' : ''}`} onClick={() => setSoundId(id)}>
                      {SOUND_BY_ID[id].label}
                    </button>
                  ))}
                </div>
              )}
              {soundId ? (
                <>
                  <p className="spellings">
                    {s.spellings}: <strong>{SOUND_BY_ID[soundId].spellings}</strong>
                  </p>
                  {techniques.map((tech, i) => (
                    <TechniqueCard key={`${soundId}-${i}`} tech={tech} lang={lang} defaultOpen={i === 0} />
                  ))}
                </>
              ) : (
                <p className="notice">{s.noTechniquesYet}</p>
              )}
            </>
          )}
          {tab === 'strategies' &&
            GENERAL_STRATEGIES.map((tech, i) => <TechniqueCard key={i} tech={tech} lang={lang} defaultOpen={false} />)}
          <p className="fine-print">{s.slpNote}</p>
        </div>
      </motion.div>
    </div>
  )
}
