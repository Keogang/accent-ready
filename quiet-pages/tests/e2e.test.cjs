// Usage: node tests/e2e.test.cjs <extension folder> <screenshot folder>
// Needs Playwright (npm i -g playwright). Set CHROMIUM_PATH to use a specific Chromium.
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }
const ext = require('path').resolve(process.argv[2]), shots = process.argv[3];
const PAGE = `<!doctype html><html><body style="font:20px Georgia;padding:30px;max-width:640px">
<div id="ui">Library · Aa · Go to</div>
<iframe id="f" style="width:620px;height:260px;border:1px solid #ccc"></iframe>
<script>
const f = document.getElementById('f');
f.contentDocument.open();
f.contentDocument.write('<body style="font:20px Georgia"><p id="p">"Damn it," he said. "What the hell is this shit? Hello, shell, assess the cocktail."</p></body>');
f.contentDocument.close();
window.flash = [];
window.turnPage = () => {
  const d = f.contentDocument;
  const p = d.createElement('p');
  p.textContent = 'Page two: that motherfucker crapped out. The cocky bastard pricked his finger.';
  d.body.replaceChildren(p);
  // Runs before the next paint: if a bad word is still raw here, the reader would see it.
  requestAnimationFrame(() => {
    const raw = [...d.body.childNodes].concat([...p.childNodes]).filter(n => n.nodeType === 3).map(n => n.nodeValue).join(' ');
    window.flash.push(/motherfucker|bastard|crapped/.test(raw));
  });
};
</script></body></html>`;
(async () => {
  const ctx = await chromium.launchPersistentContext('', {
    headless: true, executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--headless=new', `--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
  });
  await ctx.route('https://read.amazon.com/**', r => r.fulfill({ contentType: 'text/html', body: PAGE }));
  let [sw] = ctx.serviceWorkers(); if (!sw) sw = await ctx.waitForEvent('serviceworker');
  const id = sw.url().split('/')[2];
  const page = await ctx.newPage();
  await page.goto('https://read.amazon.com/?asin=TEST');
  await page.waitForTimeout(800);
  const frame = page.frames()[1];
  const hits = async () => frame.evaluate(() => [...document.querySelectorAll('.qp-hit')].map(s => s.className.split(' ')[1] + ':' + s.textContent));
  let fail = 0; const check = (name, ok, extra) => { console.log(ok ? 'PASS' : 'FAIL', name, extra !== undefined ? JSON.stringify(extra) : ''); if (!ok) fail++; };
  let h = await hits();
  check('page 1 hides damn/hell/shit only', JSON.stringify(h) === JSON.stringify(['qp-bar:Damn','qp-bar:hell','qp-bar:shit']), h);
  await page.screenshot({ path: shots + '/page1-bar.png', clip: { x: 0, y: 0, width: 720, height: 340 } });
  await page.evaluate(() => turnPage());
  await page.waitForTimeout(300);
  h = await hits();
  check('page 2 hides new words', JSON.stringify(h) === JSON.stringify(['qp-bar:motherfucker','qp-bar:crapped','qp-bar:bastard']), h);
  check('no flash before paint', JSON.stringify(await page.evaluate(() => window.flash)) === '[false]', await page.evaluate(() => window.flash));
  // Popup: diagnostic + changing style.
  const pop = await ctx.newPage();
  await page.bringToFront();
  await pop.goto(`chrome-extension://${id}/popup.html`);
  await pop.waitForTimeout(500);
  await pop.check('input[value=replace]');
  await pop.fill('#customBlock', 'cocky'); await pop.locator('#customBlock').blur();
  await page.waitForTimeout(400);
  h = await hits();
  check('style change + custom word applied live', JSON.stringify(h) === JSON.stringify(['qp-replace:[———]','qp-replace:[——]','qp-replace:[——]','qp-replace:[——]']), h);
  await page.screenshot({ path: shots + '/page2-replace.png', clip: { x: 0, y: 0, width: 720, height: 340 } });
  // Turn filtering off restores the original text exactly.
  await pop.uncheck('#enabled'); await page.waitForTimeout(400);
  const txt = await frame.evaluate(() => document.body.innerText.trim());
  check('turning off restores text', txt === 'Page two: that motherfucker crapped out. The cocky bastard pricked his finger.', txt);
  await pop.check('#enabled'); await pop.check('input[value=bar]'); await pop.check('#peek'); await page.waitForTimeout(400);
  await frame.click('.qp-hit >> nth=0');
  check('peek reveals word', await frame.evaluate(() => document.querySelector('.qp-hit').classList.contains('qp-revealed')));
  // Popup stats, as the user would see them (stats keyed on the reader tab; query via SW).
  const tabId = await sw.evaluate(() => Number(Object.keys(tabs).find(t => combine(t).hidden > 0)));
  await frame.evaluate(() => {}); await page.waitForTimeout(600);
  const stats = await sw.evaluate(t => new Promise(r => chrome.tabs.sendMessage(t, {type:'qp-report'}, () => setTimeout(() => r(combine(t)), 300))), tabId);
  check('stats count hidden words + sample text', stats.hidden === 4 && /^Page two: that ■+ ■+ out\. The ■+ ■+ pricked/.test(stats.sample), stats);
  await pop.setViewportSize({ width: 320, height: 620 });
  await pop.screenshot({ path: shots + '/popup.png', fullPage: true });
  await ctx.close();
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
