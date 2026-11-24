import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import type { Lang, Level, PracticeItem } from '../data/types'
import { SOUND_BY_ID } from '../data/sounds'
import { highlight } from '../highlight'
import { canSpeak, speak } from '../speech'
import { t } from '../i18n'

interface Props {
  lang: Lang
  items: PracticeItem[]
  startIndex: number
  onBack: () => void
  onNewList: () => void
  onOpenTechniques: (soundId: string) => void
}

const LEVELS: Level[] = ['word', 'phrase', 'sentence']
const SWIPE_DISTANCE = 70
const SWIPE_VELOCITY = 400

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0, rotate: dir > 0 ? 4 : -4 }),
  center: { x: 0, opacity: 1, rotate: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0, rotate: dir > 0 ? -4 : 4 }),
}

function textFor(item: PracticeItem, level: Level) {
  return level === 'word' ? item.word : level === 'phrase' ? item.phrase : item.sentence
}

export function PracticeDeck({ lang, items, startIndex, onBack, onNewList, onOpenTechniques }: Props) {
  const s = t(lang)
  const [index, setIndex] = useState(Math.min(startIndex, items.length - 1))
  const [direction, setDirection] = useState(1)
  const [level, setLevel] = useState<Level>('word')
  const [tally, setTally] = useState<Record<string, number>>({})
  const [finished, setFinished] = useState(false)
  // A drag that ends without a swipe should not also count as a tap.
  const dragged = useRef(false)

  const item = items[index]
  const sound = SOUND_BY_ID[item.soundId]
  const total = Object.values(tally).reduce((a, b) => a + b, 0)
  const text = textFor(item, level)

  function go(delta: number) {
    const next = index + delta
    if (next < 0) return
    if (next >= items.length) {
      setFinished(true)
      return
    }
    setDirection(delta)
    setIndex(next)
    setLevel('word')
  }

  function cycleLevel() {
    setLevel((l) => LEVELS[(LEVELS.indexOf(l) + 1) % LEVELS.length])
  }

  function onTap() {
    if (dragged.current) return
    cycleLevel()
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    // Keep the flag until after framer's tap handler for this pointer has run.
    setTimeout(() => (dragged.current = false), 0)
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1)
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1)
  }

  // Arrow keys and space for desktop testing.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (finished) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        cycleLevel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (finished) {
    return (
      <div className="screen">
        <header className="topbar">
          <button className="icon-btn" onClick={onBack} aria-label={s.back}>
            ←
          </button>
          <span />
        </header>
        <main className="done">
          <div className="done-pic" aria-hidden="true">
            🎉
          </div>
          <h2>{s.done}</h2>
          <p className="done-total">{s.sessionTotal(total)}</p>
          <div className="done-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setFinished(false)
                setDirection(-1)
                setIndex(0)
                setLevel('word')
              }}
            >
              ↻ {s.again}
            </button>
            <button className="btn-primary" onClick={onNewList}>
              {s.newList}
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="screen practice">
      <header className="topbar">
        <button className="icon-btn" onClick={onBack} aria-label={s.back}>
          ←
        </button>
        <div className="progress" aria-live="polite">
          <span>
            {index + 1} {s.of} {items.length}
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${((index + 1) / items.length) * 100}%` }} />
          </div>
        </div>
        <button className="btn-ghost small" onClick={() => onOpenTechniques(item.soundId)}>
          💡 {s.techniques}
        </button>
      </header>

      <div className="level-pills" role="tablist">
        {LEVELS.map((l) => (
          <button key={l} role="tab" aria-selected={level === l} className={level === l ? 'on' : ''} onClick={() => setLevel(l)}>
            {s.levels[l]}
          </button>
        ))}
      </div>

      <main className="deck">
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={item.key}
            className="card"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragStart={() => (dragged.current = true)}
            onDragEnd={onDragEnd}
            onTap={onTap}
            role="button"
            tabIndex={0}
            aria-label={`${text}. ${s.hint}`}
          >
            <span className="card-sound">
              {sound.label}
              <span className="card-level">{s.levels[level]}</span>
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={level}
                className={`card-content level-${level}`}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <div className="card-pic" aria-hidden="true">
                  {item.pic[level]}
                </div>
                <p className="card-text">{highlight(text, sound.pattern)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="level-dots" aria-hidden="true">
              {LEVELS.map((l) => (
                <span key={l} className={l === level ? 'on' : ''} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <p className="hint">{s.hint}</p>

      <footer className="deck-controls">
        <button className="round-btn" onClick={() => go(-1)} disabled={index === 0} aria-label={s.prev}>
          ‹
        </button>
        {canSpeak && (
          <button className="round-btn" onClick={() => speak(text)} aria-label={s.listen} title={s.listen}>
            🔊
          </button>
        )}
        <button
          className="round-btn good"
          onClick={() => setTally((m) => ({ ...m, [item.key]: (m[item.key] ?? 0) + 1 }))}
          aria-label={s.correct}
          title={s.correct}
        >
          ✓
          {(tally[item.key] ?? 0) > 0 && (
            <motion.span key={tally[item.key]} className="badge" initial={{ scale: 1.6 }} animate={{ scale: 1 }}>
              {tally[item.key]}
            </motion.span>
          )}
        </button>
        <button className="round-btn" onClick={() => go(1)} aria-label={s.next}>
          ›
        </button>
      </footer>
      <p className="session-total">{s.sessionTotal(total)}</p>
    </div>
  )
}
