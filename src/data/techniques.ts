import type { Technique } from './types'

/**
 * Sound-specific elicitation techniques and general practice strategies.
 * Written for parents; an SLP should confirm which ones fit each child.
 */

export const SOUND_TECHNIQUES: Record<string, Technique[]> = {
  p: [
    {
      name: { es: 'Labios juntos y “pop”', en: 'Lips together and “pop”' },
      summary: { es: 'Colocación fonética con espejo.', en: 'Phonetic placement with a mirror.' },
      steps: {
        es: ['Siéntense frente a un espejo.', 'Junten los labios y aguanten el aire un segundo.', 'Abran los labios rápido, como una burbuja que revienta: “p”.', 'Pongan la mano frente a la boca para sentir un soplito pequeño.'],
        en: ['Sit in front of a mirror together.', 'Press the lips together and hold the air for a second.', 'Open the lips quickly, like a popping bubble: “p”.', 'Hold a hand in front of the mouth to feel a tiny puff of air.'],
      },
      example: { es: '“p… p… pa, pa, papá”', en: '“p… p… pa, pa, papá”' },
    },
    {
      name: { es: 'Desde la /m/', en: 'Shaping from /m/' },
      summary: { es: 'Usa un sonido que el niño ya dice.', en: 'Build from a sound the child already says.' },
      steps: {
        es: ['Digan “mmm” con los labios cerrados.', 'Apaguen el zumbido sin abrir los labios.', 'Abran los labios de golpe: “mmm-pa”.', 'Poco a poco quiten la “mmm”.'],
        en: ['Say “mmm” with the lips closed.', 'Stop the hum without opening the lips.', 'Pop the lips open: “mmm-pa”.', 'Gradually drop the “mmm”.'],
      },
    },
    {
      name: { es: 'Motor apagado (p vs. b)', en: 'Voice off (p vs. b)' },
      summary: { es: 'Para el niño que dice “b” en vez de “p”.', en: 'For a child who says “b” instead of “p”.' },
      steps: {
        es: ['Pongan la mano en la garganta.', 'Con “b” la garganta vibra (motor prendido).', 'Con “p” la garganta no vibra (motor apagado).', 'Susurren “pa-pa-pa” para practicar sin voz.'],
        en: ['Place a hand on the throat.', 'With “b” the throat buzzes (motor on).', 'With “p” it stays quiet (motor off).', 'Whisper “pa-pa-pa” to practice without voice.'],
      },
    },
  ],
  b: [
    {
      name: { es: 'Motor prendido', en: 'Turn the motor on' },
      summary: { es: 'Labios como para la /p/, pero con voz.', en: 'Lips like /p/, but with voice.' },
      steps: {
        es: ['Junten los labios.', 'Pongan la mano en la garganta para sentir el zumbido.', 'Abran los labios con voz: “ba”.', 'Comparen: “pa” (sin vibrar) y “ba” (vibra).'],
        en: ['Press the lips together.', 'Place a hand on the throat to feel the buzz.', 'Open the lips with voice: “ba”.', 'Compare: “pa” (no buzz) and “ba” (buzz).'],
      },
    },
    {
      name: { es: 'Desde la /m/ tapando la nariz', en: 'From /m/ with the nose pinched' },
      summary: { es: 'La /m/ y la /b/ se hacen en el mismo lugar.', en: '/m/ and /b/ use the same place.' },
      steps: {
        es: ['Digan “ma”.', 'Tapen la nariz con suavidad y vuelvan a decir “ma”.', 'Saldrá algo parecido a “ba”.', 'Repitan y luego intenten sin tapar la nariz.'],
        en: ['Say “ma”.', 'Gently pinch the nose and say “ma” again.', 'It comes out close to “ba”.', 'Repeat, then try without pinching.'],
      },
    },
    {
      name: { es: 'Nota sobre la b suave', en: 'Note on the soft b' },
      summary: { es: 'Entre vocales la b es más suave; eso es normal.', en: 'Between vowels the b is softer; that is normal.' },
      steps: {
        es: ['En palabras como “uva” o “lobo”, los labios casi se tocan sin cerrarse del todo.', 'No corrijan esa b suave: es la pronunciación normal del español.', 'Enfóquense en que el niño use los labios y no otro sonido (como “d” o “g”).'],
        en: ['In words like “uva” or “lobo”, the lips nearly touch without fully closing.', 'Do not correct this soft b; it is normal Spanish pronunciation.', 'Focus on the child using the lips, not another sound (like “d” or “g”).'],
      },
    },
  ],
  m: [
    {
      name: { es: 'El sonido de “¡mmm, rico!”', en: 'The “mmm, yummy” sound' },
      summary: { es: 'Labios cerrados y zumbido por la nariz.', en: 'Closed lips and a hum through the nose.' },
      steps: {
        es: ['Junten los labios.', 'Hagan “mmm” como cuando algo está rico.', 'Toquen la nariz o los labios para sentir cosquillas.', 'Abran a una vocal: “mmm-a”, “mmm-o”.'],
        en: ['Press the lips together.', 'Say “mmm” like something tastes good.', 'Touch the nose or lips to feel the tickle.', 'Open into a vowel: “mmm-a”, “mmm-o”.'],
      },
    },
    {
      name: { es: 'Espejo y labios', en: 'Mirror and lips' },
      summary: { es: 'Señal visual para cerrar los labios.', en: 'A visual cue for closing the lips.' },
      steps: {
        es: ['Frente al espejo, muestren cómo los labios “se esconden”.', 'Toquen suavemente los labios del niño como recordatorio.', 'Alarguen la m al inicio: “mmmamá”.'],
        en: ['In the mirror, show how the lips “hide”.', 'Lightly touch the child’s lips as a reminder.', 'Stretch the m at the start: “mmmamá”.'],
      },
    },
  ],
  t: [
    {
      name: { es: 'La lengua toca los dientes', en: 'Tongue touches the teeth' },
      summary: { es: 'En español la t se hace con la punta en los dientes de arriba.', en: 'In Spanish the t is made with the tongue tip on the top teeth.' },
      steps: {
        es: ['Abran un poco la boca frente al espejo.', 'Pongan la punta de la lengua detrás de los dientes de arriba.', 'Suelten la lengua rápido, sin voz: “t”.', 'Hagan el reloj: “tic, tac, tic, tac”.'],
        en: ['Open the mouth slightly in front of the mirror.', 'Put the tongue tip behind the top front teeth.', 'Release it quickly, no voice: “t”.', 'Play clock: “tic, tac, tic, tac”.'],
      },
    },
    {
      name: { es: 'Desde la /n/', en: 'From /n/' },
      summary: { es: 'La /n/ y la /t/ usan el mismo punto.', en: '/n/ and /t/ share the same spot.' },
      steps: {
        es: ['Digan “nnn” con la lengua arriba.', 'Detengan el sonido sin mover la lengua.', 'Suelten con un golpecito: “nnn-ta”.'],
        en: ['Say “nnn” with the tongue up.', 'Stop the sound without moving the tongue.', 'Release with a tap: “nnn-ta”.'],
      },
    },
    {
      name: { es: 'Si dice “k” en vez de “t”', en: 'If the child says “k” for “t”' },
      summary: { es: 'Lleva la lengua hacia adelante.', en: 'Bring the tongue forward.' },
      steps: {
        es: ['Toquen con un palito o el dedo el lugar detrás de los dientes de arriba.', 'Pidan que la lengua “toque el timbre” ahí.', 'Practiquen “ta-ta-ta” despacio.'],
        en: ['Touch the spot behind the top teeth with a swab or finger.', 'Ask the tongue to “ring the doorbell” there.', 'Practice “ta-ta-ta” slowly.'],
      },
    },
  ],
  d: [
    {
      name: { es: 'Como la t, con voz', en: 'Like t, with voice' },
      summary: { es: 'Punta de la lengua en los dientes y garganta vibrando.', en: 'Tongue tip on the teeth and throat buzzing.' },
      steps: {
        es: ['Pongan la lengua detrás de los dientes de arriba.', 'Mano en la garganta: prendan el motor.', 'Suelten la lengua con voz: “da”.', 'Comparen “ta” (sin voz) con “da” (con voz).'],
        en: ['Place the tongue behind the top front teeth.', 'Hand on the throat: turn the motor on.', 'Release with voice: “da”.', 'Compare “ta” (no voice) with “da” (voice).'],
      },
    },
    {
      name: { es: 'Nota sobre la d suave', en: 'Note on the soft d' },
      summary: { es: 'Entre vocales la d es más suave; eso es normal.', en: 'Between vowels the d is softer; that is normal.' },
      steps: {
        es: ['En “dedo”, “nido” o “helado”, la d de en medio se hace con la lengua suave entre los dientes.', 'No es un error; es la pronunciación normal.', 'Al final de palabra (“pared”) la d puede sonar muy suave o casi perderse según el dialecto.'],
        en: ['In “dedo”, “nido”, or “helado”, the middle d is made with a relaxed tongue between the teeth.', 'That is not an error; it is normal pronunciation.', 'At the end of a word (“pared”) the d may sound very soft or almost disappear, depending on dialect.'],
      },
    },
  ],
  k: [
    {
      name: { es: 'Lengua abajo, atrás arriba', en: 'Tip down, back up' },
      summary: { es: 'La parte de atrás de la lengua sube.', en: 'The back of the tongue lifts.' },
      steps: {
        es: ['Con una cuchara o un palito, sostengan suavemente la punta de la lengua detrás de los dientes de abajo.', 'Pidan al niño que diga “ta”.', 'Como la punta no puede subir, saldrá “ka”.', 'Practiquen y luego quiten la cuchara.'],
        en: ['With a spoon or swab, gently hold the tongue tip behind the bottom teeth.', 'Ask the child to say “ta”.', 'Because the tip cannot lift, it comes out “ka”.', 'Practice, then remove the spoon.'],
      },
    },
    {
      name: { es: 'El sonido de la tos', en: 'The cough sound' },
      summary: { es: 'Una tos suavecita muestra dónde se hace la k.', en: 'A soft cough shows where the k is made.' },
      steps: {
        es: ['Hagan una tos chiquita juntos.', 'Señalen la garganta: “aquí atrás sale la k”.', 'Agreguen vocal: “k… a”, “k… o”.', 'Empiecen con “o” y “u”, que ayudan a llevar la lengua atrás.'],
        en: ['Do a tiny cough together.', 'Point to the throat: “the k comes from back here”.', 'Add a vowel: “k… a”, “k… o”.', 'Start with “o” and “u”, which help move the tongue back.'],
      },
    },
    {
      name: { es: 'Acostados boca arriba', en: 'Lying on the back' },
      summary: { es: 'La gravedad ayuda a que la lengua vaya atrás.', en: 'Gravity helps the tongue move back.' },
      steps: {
        es: ['Acuesten al niño boca arriba.', 'Pidan “ka-ka-ka” o “co-co-co”.', 'Cuando salga bien, practiquen sentados.'],
        en: ['Have the child lie on their back.', 'Ask for “ka-ka-ka” or “co-co-co”.', 'Once it works, practice sitting up.'],
      },
    },
  ],
  g: [
    {
      name: { es: 'Como la k, con voz', en: 'Like k, with voice' },
      summary: { es: 'Atrás de la lengua arriba y garganta vibrando.', en: 'Back of the tongue up and throat buzzing.' },
      steps: {
        es: ['Primero logren la “k” (ver técnicas de k).', 'Mano en la garganta: prendan el motor.', 'Digan “ga”, “go”, “gu”.'],
        en: ['First get the “k” (see k techniques).', 'Hand on the throat: turn the motor on.', 'Say “ga”, “go”, “gu”.'],
      },
    },
    {
      name: { es: 'Hacer gárgaras', en: 'Gargling' },
      summary: { es: 'Las gárgaras usan la parte de atrás de la boca.', en: 'Gargling uses the back of the mouth.' },
      steps: {
        es: ['Hagan gárgaras con un poco de agua (o finjan hacerlas).', 'Señalen: “la g sale de ahí atrás”.', 'Digan “ggg-a” saliendo de la gárgara.'],
        en: ['Gargle a little water (or pretend to).', 'Point out: “the g comes from back there”.', 'Say “ggg-a” coming out of the gargle.'],
      },
    },
    {
      name: { es: 'Punta de la lengua abajo', en: 'Tongue tip down' },
      summary: { es: 'Igual que para la k, sostén la punta abajo.', en: 'As with k, hold the tip down.' },
      steps: {
        es: ['Sostengan la punta detrás de los dientes de abajo con una cuchara.', 'Pidan “da”: saldrá “ga”.', 'Quiten la cuchara poco a poco.'],
        en: ['Hold the tip behind the bottom teeth with a spoon.', 'Ask for “da”: it comes out “ga”.', 'Remove the spoon little by little.'],
      },
    },
  ],
  f: [
    {
      name: { es: 'Dientes en el labio', en: 'Teeth on the lip' },
      summary: { es: 'Los dientes de arriba tocan el labio de abajo.', en: 'Top teeth rest on the bottom lip.' },
      steps: {
        es: ['Frente al espejo, muerdan suavecito el labio de abajo con los dientes de arriba.', 'Soplen despacio: “fff”, como un gato enojado.', 'Pongan la mano enfrente para sentir el aire.', 'Agreguen vocal: “fff-a”, “fff-o”.'],
        en: ['In the mirror, gently rest the top teeth on the bottom lip.', 'Blow softly: “fff”, like an angry cat.', 'Hold a hand in front to feel the air.', 'Add a vowel: “fff-a”, “fff-o”.'],
      },
    },
    {
      name: { es: 'Soplar una vela o pluma', en: 'Blow a candle or feather' },
      summary: { es: 'Muestra que la f lleva aire continuo.', en: 'Shows that f has a steady airflow.' },
      steps: {
        es: ['Pongan una pluma, papelito o vela (con supervisión) frente a la boca.', 'Con los dientes en el labio, soplen para moverla.', 'Si dice “p”, recuerden: “la f no explota, sopla”.'],
        en: ['Hold a feather, scrap of paper, or candle (supervised) in front of the mouth.', 'With teeth on lip, blow to move it.', 'If the child says “p”, remind them: “f doesn’t pop, it blows”.'],
      },
    },
  ],
  s: [
    {
      name: { es: 'La serpiente', en: 'The snake' },
      summary: { es: 'Dientes juntos, sonrisa y aire largo.', en: 'Teeth together, smile, and long air.' },
      steps: {
        es: ['Sonrían y junten los dientes.', 'La lengua se queda escondida detrás de los dientes.', 'Soplen un hilito de aire: “sss”, como serpiente o llanta que pierde aire.', 'Deslicen el dedo por el brazo mientras dura la “sss”.'],
        en: ['Smile and bring the teeth together.', 'Keep the tongue hidden behind the teeth.', 'Blow a thin stream of air: “sss”, like a snake or a leaking tire.', 'Slide a finger down the arm while the “sss” lasts.'],
      },
    },
    {
      name: { es: 'Desde la /t/', en: 'From /t/' },
      summary: { es: 'La “t” rápida se convierte en “s”.', en: 'A quick “t” turns into “s”.' },
      steps: {
        es: ['Digan “t-t-t” rápido con los dientes juntos.', 'Alarguen la salida del aire: “tsss”.', 'Poco a poco quiten la “t”: “sss”.'],
        en: ['Say “t-t-t” quickly with the teeth together.', 'Stretch the release of air: “tsss”.', 'Gradually drop the “t”: “sss”.'],
      },
    },
    {
      name: { es: 'Si saca la lengua (ceceo)', en: 'If the tongue sticks out (lisp)' },
      summary: { es: 'Mantén la lengua adentro.', en: 'Keep the tongue inside.' },
      steps: {
        es: ['Con espejo, muestren que la lengua “vive detrás de la cerca” (los dientes).', 'Usen una pajilla en el centro de la lengua para sentir que el aire sale por en medio.', 'Practiquen con “i”: “si, si, si”, que ayuda a sonreír.'],
        en: ['With a mirror, show that the tongue “lives behind the fence” (the teeth).', 'Place a straw along the middle of the tongue to feel air go down the center.', 'Practice with “i”: “si, si, si”, which helps the smile.'],
      },
    },
  ],
  x: [
    {
      name: { es: 'Risa “ja, ja, ja”', en: 'Laughing “ja, ja, ja”' },
      summary: { es: 'La j suena al reír en español.', en: 'The Spanish j sounds like laughing.' },
      steps: {
        es: ['Rían juntos: “ja, ja, ja”.', 'Señalen la garganta: “el aire raspa aquí atrás”.', 'Alarguen: “jjj-a”.'],
        en: ['Laugh together: “ja, ja, ja”.', 'Point to the throat: “the air scratches back here”.', 'Stretch it: “jjj-a”.'],
      },
    },
    {
      name: { es: 'Desde la /k/', en: 'From /k/' },
      summary: { es: 'Deja salir el aire de la k.', en: 'Let the air leak out of the k.' },
      steps: {
        es: ['Pongan la lengua como para la “k”.', 'En vez de soltarla de golpe, dejen que el aire salga raspando: “kkhhh”.', 'Quiten la k: “jjj”.'],
        en: ['Set the tongue as for “k”.', 'Instead of popping, let the air leak with a scrape: “kkhhh”.', 'Drop the k: “jjj”.'],
      },
    },
    {
      name: { es: 'Empañar el espejo', en: 'Fog the mirror' },
      summary: { es: 'Aire caliente y continuo.', en: 'Warm, steady air.' },
      steps: {
        es: ['Echen aire caliente a un espejo para empañarlo.', 'Hagan ese aire más fuerte desde atrás de la boca.', 'Nota: en el Caribe y Centroamérica la j suena más suave, como una “h” de inglés. Ambas formas son correctas.'],
        en: ['Breathe warm air onto a mirror to fog it.', 'Make that air stronger from the back of the mouth.', 'Note: in the Caribbean and Central America the j sounds softer, like an English “h”. Both are correct.'],
      },
    },
  ],
  ch: [
    {
      name: { es: 'El tren: “chu-chu”', en: 'The train: “choo-choo”' },
      summary: { es: 'Un juego para el sonido.', en: 'A play-based cue.' },
      steps: {
        es: ['Jueguen al tren moviendo los brazos.', 'Digan “chu-chu” con los labios hacia adelante, como para un beso.', 'Pasen a “cha”, “che”, “chi”.'],
        en: ['Play train, moving the arms.', 'Say “chu-chu” with the lips pushed forward, like for a kiss.', 'Move on to “cha”, “che”, “chi”.'],
      },
    },
    {
      name: { es: 'De “t” a “sh”', en: 'From “t” to “sh”' },
      summary: { es: 'La ch es una t que termina en “sh”.', en: 'The ch is a t that ends in “sh”.' },
      steps: {
        es: ['Digan “t” y luego “sh” (como para pedir silencio), despacio: “t… sh”.', 'Junten las dos cada vez más rápido: “tsh”.', 'Agreguen vocal: “cha”.'],
        en: ['Say “t” and then “sh” (like shushing), slowly: “t… sh”.', 'Blend them faster and faster: “tsh”.', 'Add a vowel: “cha”.'],
      },
    },
  ],
  l: [
    {
      name: { es: 'Lengua arriba y cantar', en: 'Tongue up and sing' },
      summary: { es: 'La punta sube y el aire sale por los lados.', en: 'The tip lifts and the air flows around the sides.' },
      steps: {
        es: ['Pongan la punta de la lengua detrás de los dientes de arriba.', 'Canten con voz: “lll”.', 'Bajen la lengua para la vocal: “la, la, la”.', 'Canten una canción solo con “la”.'],
        en: ['Put the tongue tip behind the top front teeth.', 'Sing with voice: “lll”.', 'Drop the tongue for the vowel: “la, la, la”.', 'Sing a song using only “la”.'],
      },
    },
    {
      name: { es: 'Un punto dulce', en: 'A sweet spot' },
      summary: { es: 'Señal táctil para subir la punta.', en: 'A touch cue for lifting the tip.' },
      steps: {
        es: ['Pongan un poquito de crema de cacahuate o miel justo detrás de los dientes de arriba (revisen alergias).', 'Pidan que la punta de la lengua “lo limpie”.', 'Mientras está ahí, digan “lll-a”.'],
        en: ['Put a dab of peanut butter or honey just behind the top teeth (check allergies).', 'Ask the tongue tip to “clean it off”.', 'While it’s there, say “lll-a”.'],
      },
    },
    {
      name: { es: 'Mandíbula quieta', en: 'Steady jaw' },
      summary: { es: 'Para que la lengua trabaje sola.', en: 'So the tongue works on its own.' },
      steps: {
        es: ['Pidan al niño que muerda suavemente un palito o el mango de una cuchara de lado.', 'Con la mandíbula quieta, suban y bajen la lengua: “la-la-la”.'],
        en: ['Have the child gently bite a stick or the side of a spoon handle.', 'With the jaw still, lift and lower the tongue: “la-la-la”.'],
      },
    },
  ],
  n: [
    {
      name: { es: 'Zumbido por la nariz', en: 'Hum through the nose' },
      summary: { es: 'Lengua arriba y sonido por la nariz.', en: 'Tongue up and sound through the nose.' },
      steps: {
        es: ['Pongan la punta de la lengua detrás de los dientes de arriba.', 'Hagan “nnn” y toquen la nariz para sentir la vibración.', 'Si tapan la nariz, el sonido se detiene: así sabemos que sale por ahí.', 'Agreguen vocal: “nnn-a”.'],
        en: ['Put the tongue tip behind the top front teeth.', 'Say “nnn” and touch the nose to feel the vibration.', 'Pinching the nose stops the sound, which shows it comes out there.', 'Add a vowel: “nnn-a”.'],
      },
    },
  ],
  ny: [
    {
      name: { es: 'De “ni-a” a “ña”', en: 'From “ni-a” to “ña”' },
      summary: { es: 'Juntar n + i rápido.', en: 'Blend n + i quickly.' },
      steps: {
        es: ['Digan despacio “ni… a”.', 'Repítanlo cada vez más rápido: “nia, nia”.', 'Al final suena “ña”.', 'Sigan con “ño”, “ñu”: “niño”, “uña”.'],
        en: ['Say slowly “ni… a”.', 'Repeat faster and faster: “nia, nia”.', 'It ends up as “ña”.', 'Continue with “ño”, “ñu”: “niño”, “uña”.'],
      },
    },
    {
      name: { es: 'El centro de la lengua arriba', en: 'Middle of the tongue up' },
      summary: { es: 'La punta abajo y el centro toca el paladar.', en: 'Tip down, middle touches the roof.' },
      steps: {
        es: ['La punta de la lengua se queda detrás de los dientes de abajo.', 'El centro de la lengua sube y aplasta el paladar.', 'Con el sonido por la nariz, abran a “a”: “ña”.'],
        en: ['Keep the tongue tip behind the bottom teeth.', 'Lift the middle of the tongue to press the roof of the mouth.', 'With sound through the nose, open to “a”: “ña”.'],
      },
    },
  ],
  y: [
    {
      name: { es: 'De “i” a “ya”', en: 'From “i” to “ya”' },
      summary: { es: 'Desliza de la vocal i a otra vocal.', en: 'Glide from the vowel i to another vowel.' },
      steps: {
        es: ['Digan “iii” con una sonrisa.', 'Deslicen rápido a “a”: “i-a”, “ia”.', 'Hagan el contacto un poco más fuerte: “ya”.', 'Sigan con “yo”, “yu”, “lla”, “llo”.'],
        en: ['Say “iii” with a smile.', 'Glide quickly to “a”: “i-a”, “ia”.', 'Make the contact a bit firmer: “ya”.', 'Continue with “yo”, “yu”, “lla”, “llo”.'],
      },
    },
    {
      name: { es: 'Nota sobre dialectos', en: 'Note on dialects' },
      summary: { es: 'La y/ll suena distinto según el país.', en: 'The y/ll sounds different by region.' },
      steps: {
        es: ['En la mayoría de los países, “y” y “ll” suenan igual.', 'En Argentina y Uruguay suenan como “sh” o “zh”: también es correcto.', 'Practiquen la forma que usa su familia.'],
        en: ['In most countries “y” and “ll” sound the same.', 'In Argentina and Uruguay they sound like “sh” or “zh”, which is also correct.', 'Practice the form your family uses.'],
      },
    },
  ],
  r: [
    {
      name: { es: 'Desde la /d/ rápida', en: 'From a fast /d/' },
      summary: { es: 'La r suave es un golpecito como una d muy rápida.', en: 'The soft r is a tap like a very fast d.' },
      steps: {
        es: ['Digan “eda” despacio.', 'Repítanlo más y más rápido: “eda-eda-eda”.', 'La d rápida se vuelve r: “era”.', 'Prueben con “pada” → “para”, “toda” → “tora”.'],
        en: ['Say “eda” slowly.', 'Repeat faster and faster: “eda-eda-eda”.', 'The fast d turns into r: “era”.', 'Try “pada” → “para”, “toda” → “tora”.'],
      },
      example: { es: '“oda, oda, ora… oro”', en: '“oda, oda, ora… oro”' },
    },
    {
      name: { es: 'Un solo toque', en: 'One quick tap' },
      summary: { es: 'La punta toca una vez detrás de los dientes.', en: 'The tip taps once behind the teeth.' },
      steps: {
        es: ['Muestren el bordito detrás de los dientes de arriba.', 'La punta de la lengua le da un toque rápido, como un tambor.', 'Practiquen “ara, ere, iri, oro, uru”.'],
        en: ['Show the ridge behind the top teeth.', 'The tongue tip gives it one quick tap, like a drum.', 'Practice “ara, ere, iri, oro, uru”.'],
      },
    },
    {
      name: { es: 'Desde la /l/', en: 'From /l/' },
      summary: { es: 'La l y la r usan el mismo lugar.', en: 'l and r use the same spot.' },
      steps: {
        es: ['Digan “la-la-la”.', 'Háganlo tan rápido que la lengua solo rebote.', 'Saldrá “ra” suave: “pala” → “para”.'],
        en: ['Say “la-la-la”.', 'Do it so fast that the tongue just bounces.', 'A soft “ra” comes out: “pala” → “para”.'],
      },
    },
  ],
  rr: [
    {
      name: { es: 'El motor', en: 'The motor' },
      summary: { es: 'La lengua relajada vibra con mucho aire.', en: 'A relaxed tongue vibrates with lots of air.' },
      steps: {
        es: ['Pongan la punta de la lengua floja detrás de los dientes de arriba.', 'Soplen fuerte para que vibre: “rrrr”, como un motor o un carro.', 'Primero soplen sin voz, luego agreguen voz.', 'Jueguen con carritos haciendo el sonido.'],
        en: ['Rest a relaxed tongue tip behind the top front teeth.', 'Blow hard so it vibrates: “rrrr”, like a motor or a car.', 'First blow without voice, then add voice.', 'Play with toy cars while making the sound.'],
      },
    },
    {
      name: { es: 'Desde “tr” y “dr”', en: 'From “tr” and “dr”' },
      summary: { es: 'La t y la d ponen la lengua en su lugar.', en: 't and d put the tongue in place.' },
      steps: {
        es: ['Digan “tdr-tdr-tdr” muy rápido.', 'Alarguen la vibración: “tdrrrr”.', 'Prueben “drrrr-a”, y luego quiten la d: “rrra”.', 'Otra opción: “ta-da-da-da” muy rápido.'],
        en: ['Say “tdr-tdr-tdr” very fast.', 'Stretch the vibration: “tdrrrr”.', 'Try “drrrr-a”, then drop the d: “rrra”.', 'Another option: “ta-da-da-da” very fast.'],
      },
    },
    {
      name: { es: 'Paciencia: es un sonido tardío', en: 'Patience: it develops late' },
      summary: { es: 'Muchos niños dominan la rr entre los 5 y 7 años.', en: 'Many children master rr between ages 5 and 7.' },
      steps: {
        es: ['Mantengan las sesiones cortas y divertidas.', 'Celebren los intentos aunque no sean perfectos.', 'Pregunten a su patólogo del habla si es momento de trabajar este sonido.'],
        en: ['Keep sessions short and fun.', 'Celebrate attempts even when they are not perfect.', 'Ask your speech-language pathologist whether it is time to work on this sound.'],
      },
    },
  ],
  lblends: [
    {
      name: { es: 'Separar y juntar', en: 'Split and blend' },
      summary: { es: 'Practica cada parte y acércalas.', en: 'Practice each part, then bring them together.' },
      steps: {
        es: ['Digan las dos partes con una vocal en medio: “pe-la-to”.', 'Hagan la vocal cada vez más corta: “p(e)la-to”.', 'Junten: “plato”.'],
        en: ['Say the parts with a vowel in between: “pe-la-to”.', 'Make the vowel shorter each time: “p(e)la-to”.', 'Blend: “plato”.'],
      },
      example: { es: '“fe-lor” → “f-lor” → “flor”', en: '“fe-lor” → “f-lor” → “flor”' },
    },
    {
      name: { es: 'Encadenamiento hacia atrás', en: 'Backward chaining' },
      summary: { es: 'Empieza con la parte fácil del final.', en: 'Start with the easy end part.' },
      steps: {
        es: ['Digan solo “lo-bo”.', 'Agreguen la primera consonante sin pausa: “g-lo-bo”.', 'Repitan hasta que salga “globo” de una vez.'],
        en: ['Say only “lo-bo”.', 'Add the first consonant with no pause: “g-lo-bo”.', 'Repeat until “globo” comes out in one go.'],
      },
    },
  ],
  rblends: [
    {
      name: { es: 'Separar y juntar', en: 'Split and blend' },
      summary: { es: 'Mete una vocal y luego quítala.', en: 'Insert a vowel, then remove it.' },
      steps: {
        es: ['Digan “te-ren”.', 'Acorten la vocal: “t(e)ren”.', 'Junten: “tren”.'],
        en: ['Say “te-ren”.', 'Shorten the vowel: “t(e)ren”.', 'Blend: “tren”.'],
      },
      example: { es: '“fe-re-sa” → “fresa”', en: '“fe-re-sa” → “fresa”' },
    },
    {
      name: { es: 'Truco de la d rápida', en: 'Fast d trick' },
      summary: { es: 'La r de los grupos es una r suave.', en: 'The r in blends is the soft r.' },
      steps: {
        es: ['Digan “t-da” rápido: sale “tra”.', 'Prueben “b-da” → “bra”, “p-da” → “pra”.', 'Usen las técnicas de la r suave si hace falta.'],
        en: ['Say “t-da” fast: it comes out “tra”.', 'Try “b-da” → “bra”, “p-da” → “pra”.', 'Use the soft r techniques if needed.'],
      },
    },
  ],
}

export const GENERAL_STRATEGIES: Technique[] = [
  {
    name: { es: 'Modelar y escuchar mucho', en: 'Model and listen a lot' },
    summary: { es: 'El niño necesita oír el sonido bien hecho muchas veces.', en: 'The child needs to hear the sound correctly many times.' },
    steps: {
      es: ['Digan la palabra despacio y claro antes de pedirla.', 'Exageren un poco el sonido: “ssssol”.', 'Lean cuentos o canten canciones con el sonido (bombardeo auditivo).', 'Pidan que el niño solo escuche antes de intentarlo.'],
      en: ['Say the word slowly and clearly before asking for it.', 'Slightly exaggerate the sound: “ssssol”.', 'Read stories or sing songs full of the sound (auditory bombardment).', 'Let the child just listen before trying.'],
    },
  },
  {
    name: { es: 'Encadenamiento hacia atrás', en: 'Backward chaining' },
    summary: { es: 'Arma la palabra desde el final hacia el principio.', en: 'Build the word from the end back to the start.' },
    steps: {
      es: ['Empiecen con la última sílaba: “-ta”.', 'Agreguen la sílaba anterior: “-lo-ta”.', 'Sigan hasta la palabra completa: “pe-lo-ta”.', 'Así el niño termina siempre con la parte que ya domina.'],
      en: ['Start with the last syllable: “-ta”.', 'Add the syllable before it: “-lo-ta”.', 'Continue to the full word: “pe-lo-ta”.', 'This way the child always finishes with the part they already know.'],
    },
    example: { es: '“ta” → “lota” → “pelota”', en: '“ta” → “lota” → “pelota”' },
  },
  {
    name: { es: 'Encadenamiento hacia adelante', en: 'Forward chaining' },
    summary: { es: 'Arma la palabra desde el principio.', en: 'Build the word from the start.' },
    steps: {
      es: ['Empiecen con la primera sílaba: “ma-”.', 'Agreguen la siguiente: “ma-ri-”.', 'Sigan hasta completar: “ma-ri-po-sa”.'],
      en: ['Start with the first syllable: “ma-”.', 'Add the next one: “ma-ri-”.', 'Continue to the end: “ma-ri-po-sa”.'],
    },
  },
  {
    name: { es: 'Aplaudir las sílabas', en: 'Clap the syllables' },
    summary: { es: 'El español tiene ritmo de sílabas; aplaudir ayuda en palabras largas.', en: 'Spanish has a syllable rhythm; clapping helps with long words.' },
    steps: {
      es: ['Aplaudan una vez por cada sílaba: “hi-po-pó-ta-mo”.', 'Digan cada sílaba con su aplauso.', 'Luego díganla completa, más rápido.'],
      en: ['Clap once per syllable: “hi-po-pó-ta-mo”.', 'Say each syllable with its clap.', 'Then say the whole word faster.'],
    },
  },
  {
    name: { es: 'Señales visuales y táctiles', en: 'Visual and touch cues' },
    summary: { es: 'Ver y sentir el sonido ayuda a producirlo.', en: 'Seeing and feeling the sound helps produce it.' },
    steps: {
      es: ['Usen un espejo para que el niño vea sus labios y lengua.', 'Mano en la garganta para sentir la voz; mano frente a la boca para sentir el aire.', 'Inventen una seña con la mano para cada sonido (por ejemplo, deslizar el dedo para la “s”).'],
      en: ['Use a mirror so the child sees their lips and tongue.', 'Hand on the throat to feel voice; hand in front of the mouth to feel air.', 'Invent a hand sign for each sound (for example, sliding a finger for “s”).'],
    },
  },
  {
    name: { es: 'Moldeamiento', en: 'Shaping' },
    summary: { es: 'Parte de un sonido que el niño ya dice y cámbialo poco a poco.', en: 'Start from a sound the child can say and change it step by step.' },
    steps: {
      es: ['Elijan un sonido cercano que el niño ya hace (por ejemplo, “t” para llegar a “s”).', 'Cambien una cosa a la vez: la posición de la lengua, el aire o la voz.', 'Premien cada intento que se acerque más.'],
      en: ['Pick a nearby sound the child already makes (for example, “t” to reach “s”).', 'Change one thing at a time: tongue position, airflow, or voice.', 'Praise each attempt that gets closer.'],
    },
  },
  {
    name: { es: 'De más ayuda a menos ayuda', en: 'From more help to less help' },
    summary: { es: 'Da solo la ayuda necesaria y retírala poco a poco.', en: 'Give only the help needed and fade it over time.' },
    steps: {
      es: ['Primero pidan la palabra sin ayuda.', 'Si no sale, modelen: “Dilo como yo: sol”.', 'Si aún no sale, agreguen una señal (espejo, seña, tocar).', 'Si hace falta, dividan en sílabas o usen encadenamiento.', 'Cuando salga bien varias veces, quiten las ayudas.'],
      en: ['First ask for the word with no help.', 'If it doesn’t come, model it: “Say it like me: sol”.', 'If still not, add a cue (mirror, sign, touch).', 'If needed, break it into syllables or use chaining.', 'Once it’s correct several times, remove the supports.'],
    },
  },
  {
    name: { es: 'Pares mínimos', en: 'Minimal pairs' },
    summary: { es: 'Muestra que cambiar el sonido cambia el significado.', en: 'Show that changing the sound changes the meaning.' },
    steps: {
      es: ['Usen dos palabras que solo cambian en un sonido: “taza / casa”, “pera / perra”.', 'Pidan al niño que señale la imagen correcta cuando ustedes digan una.', 'Luego el niño dice la palabra y ustedes señalan lo que oyeron.'],
      en: ['Use two words that differ by one sound: “taza / casa”, “pera / perra”.', 'Ask the child to point to the right picture when you say one.', 'Then the child says a word and you point to what you heard.'],
    },
  },
  {
    name: { es: 'Práctica corta, frecuente y positiva', en: 'Short, frequent, positive practice' },
    summary: { es: 'Poco tiempo cada día funciona mejor que mucho una vez.', en: 'A little every day beats a lot once in a while.' },
    steps: {
      es: ['Practiquen 5 a 10 minutos al día.', 'Busquen muchas repeticiones: 20 o más intentos por sesión.', 'Elogien de forma específica: “¡Qué bien pusiste la lengua arriba!”.', 'Si se frustra, regresen a un nivel más fácil (de oración a frase, o de frase a palabra).'],
      en: ['Practice 5 to 10 minutes a day.', 'Aim for many repetitions: 20 or more tries per session.', 'Praise specifically: “Great job lifting your tongue!”.', 'If the child gets frustrated, go back a level (sentence to phrase, or phrase to word).'],
    },
  },
]
