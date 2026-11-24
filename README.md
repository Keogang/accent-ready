# Habla Conmigo

A mobile-first web app for parents who practice Spanish speech sounds
(articulation) at home with their child.

## How it works

1. **Choose sounds.** Pick one or more Spanish sounds: p, b/v, m, t, d, k, g,
   f, s, j, ch, l, n, ñ, y/ll, r (tap), rr (trill), l-blends, and r-blends.
2. **Choose syllable length.** 1, 2, 3, or 4+ syllables. Each chip shows how
   many words match. You can also filter by where the sound appears in the
   word (initial, medial, final).
3. **Review the word list**, then tap a word (or **Practicar**) to start.
4. **Practice.** Each card shows a picture above the text, with the target
   sound highlighted.
   - **Tap the card** to move from word → phrase → sentence (tap again to
     return to the word).
   - **Swipe left** for the next word, **swipe right** for the previous one
     (the ‹ › buttons and arrow keys also work).
   - **🔊** plays a model with the device's Spanish voice.
   - **✓** counts correct productions for the session.
5. **💡 Técnicas** opens elicitation techniques for the current sound
   (step-by-step placement cues, shaping from other sounds, dialect notes)
   and general strategies: modeling, backward and forward chaining, syllable
   clapping, visual/tactile cues, shaping, a cueing hierarchy, minimal pairs,
   and practice tips.

The whole interface switches between Spanish and English. Choices are saved
in the browser.

## Running it

```bash
npm install
npm run dev        # local dev server
npm run build      # static build in dist/
npm run check:data # verify syllable counts and target sounds in the word lists
```

## Editing the content

- Word lists: `src/data/sounds.ts`. Each entry holds the word, its syllable
  count, the sound's position, and a picture (emoji) plus phrase and
  sentence for each level. Run `npm run check:data` after edits.
- Techniques and strategies: `src/data/techniques.ts` (Spanish and English).

Pictures use emoji, so the app works offline and needs no image assets.
