// Usage: node tests/e2e-images.test.cjs <extension folder> <screenshot folder>
// Loads the extension in Chromium against a fake read.amazon.com page that,
// like the real Kindle Cloud Reader, shows each book page as a blob: image.
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }
const ext = require('path').resolve(process.argv[2]), shots = process.argv[3];

const PAGE = `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#eee;font:14px sans-serif">
<div class="book-title">TEST BOOK</div>
<div id="kr-renderer"><div class="kg-view" style="position:relative;width:500px;margin:10px auto">
  <img id="page" style="width:500px;display:block">
  <img id="next" style="width:500px;position:absolute;left:-9999px">
  <div class="kg-a11y-abs"></div>
</div></div>
<script>
// Draws a page of text into an image, like Kindle does, and remembers where
// each word landed so the test can check the boxes.
window.makePage = (lines) => new Promise(resolve => {
  const c = document.createElement('canvas'); c.width = 1000; c.height = 700;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#111'; ctx.font = '34px Georgia, serif'; ctx.textBaseline = 'top';
  const words = [];
  lines.forEach((line, i) => {
    const y = 50 + i * 60; let x = 50;
    line.split(' ').forEach(w => {
      ctx.fillText(w, x, y);
      const wd = ctx.measureText(w).width;
      words.push({ w, x: x / c.width, y: y / c.height, x2: (x + wd) / c.width, y2: (y + 34) / c.height });
      x += wd + ctx.measureText(' ').width;
    });
  });
  c.toBlob(b => resolve({ url: URL.createObjectURL(b), words }), 'image/png');
});
window.flash = [];
window.show = (img, url) => {
  img.src = url;
  // Before the next paint, the page must be hidden or already covered.
  requestAnimationFrame(() => window.flash.push(!img.classList.contains('qp-checking') && !img.nextElementSibling?.classList.contains('qp-overlay')));
};
</script></body></html>`;

(async () => {
  const ctx = await chromium.launchPersistentContext('', {
    headless: true, executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--headless=new', `--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
  });
  await ctx.route('https://read.amazon.com/**', r => r.fulfill({ contentType: 'text/html', body: PAGE }));
  let [sw] = ctx.serviceWorkers(); if (!sw) sw = await ctx.waitForEvent('serviceworker');
  const page = await ctx.newPage();
  page.on('console', m => { if (/Quiet Pages/.test(m.text())) console.log('  [page]', m.text()); });
  await page.goto('https://read.amazon.com/?asin=TEST');
  await page.waitForTimeout(500);
  let fail = 0; const check = (name, ok, extra) => { console.log(ok ? 'PASS' : 'FAIL', name, extra !== undefined ? JSON.stringify(extra) : ''); if (!ok) fail++; };

  const p1 = await page.evaluate(() => makePage([
    '"Damn it," he said. "What the hell is this shit?"',
    'Hello there, shell collector. Assess the cocktail.',
    'The motherfucker crapped out, the cocky bastard.',
    'She pricked her finger on the rose bush.',
  ]));
  const p2 = await page.evaluate(() => makePage(['Page two is clean, apart from one bitch.', 'Nothing else to see here.']));
  // Kindle loads the next page ahead of time; ours sits off screen.
  await page.evaluate(([a, b]) => { show(document.getElementById('page'), a); document.getElementById('next').src = b; }, [p1.url, p2.url]);
  const t0 = Date.now();
  await page.waitForFunction(() => document.querySelector('#page + .qp-overlay .qp-box') && !document.getElementById('page').classList.contains('qp-checking'), null, { timeout: 60000 });
  const firstMs = Date.now() - t0;
  check('page hidden before first paint', JSON.stringify(await page.evaluate(() => flash)) === '[false]', await page.evaluate(() => flash));
  console.log(`  first page read in ${firstMs} ms (includes engine start-up)`);

  // Compare boxes to where the blocked words were drawn.
  const boxes = await page.evaluate(() => {
    const o = document.querySelector('#page + .qp-overlay');
    return [...o.querySelectorAll('.qp-box')].map(b => ({ x: parseFloat(b.style.left) / 100, y: parseFloat(b.style.top) / 100, x2: (parseFloat(b.style.left) + parseFloat(b.style.width)) / 100, y2: (parseFloat(b.style.top) + parseFloat(b.style.height)) / 100 }));
  });
  const blocked = ['Damn', 'hell', 'shit?"', 'motherfucker', 'crapped', 'bastard.'];
  const covered = w => boxes.some(b => b.x <= w.x + 0.01 && b.x2 >= w.x2 - 0.01 && b.y <= w.y + 0.02 && b.y2 >= w.y2 - 0.02);
  const targets = p1.words.filter(w => blocked.some(b => w.w.replace(/^"/, '').startsWith(b.replace(/[?".]+$/, ''))) && !/^Hello/.test(w.w));
  const missed = targets.filter(w => !covered(w)).map(w => w.w);
  check('every blocked word is covered', missed.length === 0 && targets.length === 6, { targets: targets.map(t => t.w), missed });
  const innocent = p1.words.filter(w => /^(Hello|shell|Assess|cocktail|cocky|pricked|said|What)/.test(w.w));
  const wrong = innocent.filter(w => boxes.some(b => b.x < w.x2 - 0.005 && b.x2 > w.x + 0.005 && b.y < w.y2 - 0.01 && b.y2 > w.y + 0.01)).map(w => w.w);
  check('ordinary words stay visible', wrong.length === 0 && boxes.length === 6, { boxes: boxes.length, wrong });
  await page.screenshot({ path: shots + '/image-page1.png', clip: { x: 0, y: 0, width: 700, height: 400 } });

  // Turn the page to the preloaded one: it should be ready almost at once.
  await page.waitForTimeout(4000); // give the pre-read of the next page time to finish
  await page.evaluate(([b]) => show(document.getElementById('page'), b), [p2.url]);
  await page.waitForFunction(() => !document.getElementById('page').classList.contains('qp-checking') && document.querySelectorAll('#page + .qp-overlay .qp-box').length === 1, null, { timeout: 30000 });
  check('next page covered, no flash', JSON.stringify(await page.evaluate(() => flash)) === '[false,false]', await page.evaluate(() => flash));

  // Popup diagnostics read through the background worker.
  const tabId = await sw.evaluate(() => Number(Object.keys(tabs).find(t => combine(t).pages > 0)));
  const stats = await sw.evaluate(t => new Promise(r => chrome.tabs.sendMessage(t, { type: 'qp-report' }, () => setTimeout(() => r(combine(t)), 400))), tabId);
  check('popup shows hidden count and masked page words', stats.hidden === 1 && /Page two is clean/.test(stats.ocrSample) && !/bitch/i.test(stats.ocrSample), stats);

  // Switching style re-draws from the saved reading, without reading again.
  const pop = await ctx.newPage();
  await pop.goto(`chrome-extension://${sw.url().split('/')[2]}/popup.html`);
  await pop.check('input[value=replace]');
  await page.waitForTimeout(500);
  const style = await page.evaluate(() => document.querySelector('#page + .qp-overlay .qp-box')?.className);
  check('style change applies to page images', /qp-replace/.test(style || ''), style);
  await pop.uncheck('#enabled'); await page.waitForTimeout(400);
  check('turning off removes all boxes', await page.evaluate(() => !document.querySelector('.qp-overlay') && !document.querySelector('.qp-checking')));
  await pop.check('#enabled'); await pop.check('input[value=bar]'); await page.waitForTimeout(800);
  check('turning back on restores boxes', await page.evaluate(() => document.querySelectorAll('#page + .qp-overlay .qp-box').length) === 1);
  await ctx.close();
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
