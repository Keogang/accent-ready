export type Lang = 'es' | 'en'

export type Position = 'i' | 'm' | 'f'

/** One practice item: a target word plus the same word inside a phrase and a sentence. */
export interface WordItem {
  word: string
  syllables: number
  /** Where the target sound appears in the word: i = initial, m = medial, f = final. */
  position: Position
  /** Picture for each level. Emoji keep the app offline and asset-free. */
  pic: { word: string; phrase: string; sentence: string }
  phrase: string
  sentence: string
}

export interface Sound {
  id: string
  /** Short label shown on the chip, e.g. "p" or "rr". */
  label: string
  /** Spellings that make this sound, e.g. "c, qu, k". */
  spellings: string
  /** Matches the letters that spell the sound, used to highlight it in text. */
  pattern: RegExp
  example: string
  words: WordItem[]
}

export interface PracticeItem extends WordItem {
  soundId: string
  key: string
}

export type Level = 'word' | 'phrase' | 'sentence'

export interface Bilingual {
  es: string
  en: string
}

export interface Technique {
  name: Bilingual
  summary: Bilingual
  steps: { es: string[]; en: string[] }
  example?: Bilingual
}
