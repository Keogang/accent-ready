// Plays a model of the text with the browser's built-in Spanish voice, when one exists.
const PREFERRED = ['es-mx', 'es-us', 'es-419', 'es-es', 'es']

function spanishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  for (const p of PREFERRED) {
    const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(p))
    if (v) return v
  }
  return undefined
}

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string) {
  if (!canSpeak) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  const voice = spanishVoice()
  if (voice) u.voice = voice
  u.lang = voice?.lang ?? 'es-MX'
  u.rate = 0.8
  synth.speak(u)
}
