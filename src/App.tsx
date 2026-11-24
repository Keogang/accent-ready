import { useEffect, useMemo, useState } from 'react'
import type { Lang, PracticeItem } from './data/types'
import { SOUNDS } from './data/sounds'
import { t } from './i18n'
import { load, save } from './storage'
import { SetupScreen, type Filters } from './components/SetupScreen'
import { WordList } from './components/WordList'
import { PracticeDeck } from './components/PracticeDeck'
import { TechniquesSheet } from './components/TechniquesSheet'
import './App.css'

type Screen = 'setup' | 'list' | 'practice'

const DEFAULT_FILTERS: Filters = { soundIds: [], syllables: [1, 2], position: 'all' }

/** Builds the practice list from the parent's choices, in sound order, without duplicate words. */
function buildItems(filters: Filters): PracticeItem[] {
  const seen = new Set<string>()
  const items: PracticeItem[] = []
  for (const sound of SOUNDS) {
    if (!filters.soundIds.includes(sound.id)) continue
    for (const w of sound.words) {
      const sylKey = Math.min(w.syllables, 4)
      if (!filters.syllables.includes(sylKey)) continue
      if (filters.position !== 'all' && w.position !== filters.position) continue
      if (seen.has(w.word)) continue
      seen.add(w.word)
      items.push({ ...w, soundId: sound.id, key: `${sound.id}:${w.word}` })
    }
  }
  return items
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('hc.lang', 'es'))
  const [filters, setFilters] = useState<Filters>(() => ({ ...DEFAULT_FILTERS, ...load<Partial<Filters>>('hc.filters', {}) }))
  const [screen, setScreen] = useState<Screen>('setup')
  const [startIndex, setStartIndex] = useState(0)
  const [techniquesFor, setTechniquesFor] = useState<string[] | null>(null)

  useEffect(() => save('hc.lang', lang), [lang])
  useEffect(() => save('hc.filters', filters), [filters])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const items = useMemo(() => buildItems(filters), [filters])
  const s = t(lang)

  function openPractice(index: number) {
    setStartIndex(index)
    setScreen('practice')
  }

  return (
    <div className="app">
      {screen === 'setup' && (
        <SetupScreen
          lang={lang}
          filters={filters}
          matchCount={items.length}
          onChange={setFilters}
          onToggleLang={() => setLang(lang === 'es' ? 'en' : 'es')}
          onSubmit={() => setScreen('list')}
          onOpenTechniques={() => setTechniquesFor(filters.soundIds)}
        />
      )}
      {screen === 'list' && (
        <WordList
          lang={lang}
          items={items}
          onBack={() => setScreen('setup')}
          onPick={openPractice}
          onOpenTechniques={() => setTechniquesFor(filters.soundIds)}
        />
      )}
      {screen === 'practice' && items.length > 0 && (
        <PracticeDeck
          lang={lang}
          items={items}
          startIndex={startIndex}
          onBack={() => setScreen('list')}
          onNewList={() => setScreen('setup')}
          onOpenTechniques={(soundId) => setTechniquesFor([soundId, ...filters.soundIds.filter((id) => id !== soundId)])}
        />
      )}
      {techniquesFor && (
        <TechniquesSheet lang={lang} soundIds={techniquesFor} onClose={() => setTechniquesFor(null)} title={s.techniquesTitle} />
      )}
    </div>
  )
}
