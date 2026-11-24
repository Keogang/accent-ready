// Sanity checks for the word lists: syllable counts and target-sound presence.
// Run with: npm run check:data
import { SOUNDS } from '../src/data/sounds'

const STRONG = new Set([...'aeoáéóíú'])
const VOWEL = new Set([...'aeiouáéíóúü'])

function countSyllables(word: string): number {
  let s = word.toLowerCase().replace(/qu/g, 'q').replace(/gu(?=[eiéí])/g, 'g')
  s = s.replace(/y$/, 'i') // final y is a vowel glide (rey, hoy)
  let count = 0
  let prev = ''
  for (const ch of s) {
    if (!VOWEL.has(ch)) { prev = ''; continue }
    if (!prev) count++
    else if (STRONG.has(prev) && STRONG.has(ch)) count++ // hiatus
    prev = ch
  }
  return count
}

let problems = 0
for (const sound of SOUNDS) {
  for (const item of sound.words) {
    const n = countSyllables(item.word)
    if (n !== item.syllables) { problems++; console.log(`[syllables] ${sound.id}: ${item.word} listed ${item.syllables}, counted ${n}`) }
    for (const text of [item.word, item.phrase, item.sentence]) {
      sound.pattern.lastIndex = 0
      if (!sound.pattern.test(text)) { problems++; console.log(`[sound] ${sound.id}: no match in "${text}"`) }
    }
  }
  const bySyl = [1, 2, 3, 4].map((k) => sound.words.filter((x) => (k === 4 ? x.syllables >= 4 : x.syllables === k)).length)
  console.log(`${sound.label.padEnd(26)} total ${String(sound.words.length).padStart(2)}  by syllables 1/2/3/4+: ${bySyl.join('/')}`)
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll checks passed')
process.exit(problems ? 1 : 0)
