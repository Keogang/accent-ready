// Usage: node tests/safari-background.test.cjs
// Safari can't run on Linux, so this checks the Safari build's background page
// in Chromium: it copies extension/, swaps in an empty service worker (Chrome
// can't use a background page), opens background.html in a tab so it receives
// messages, and checks a fake Kindle image page gets its blocked words covered.
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }
const fs = require('fs'), path = require('path'), os = require('os');
const src = path.resolve(__dirname, '../extension');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'qp-safari-'));
fs.cpSync(src, dir, { recursive: true });
const m = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
m.background = { service_worker: 'stub.js' };
delete m.browser_specific_settings;
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(m));
fs.writeFileSync(path.join(dir, 'stub.js'), '// test stub\n');

const PAGE = `<!doctype html><html><body style="margin:0">
<div class="kg-view" style="position:relative;width:500px"><img id="page" style="width:500px;display:block"></div>
<script>
const c = document.createElement('canvas'); c.width = 1000; c.height = 300;
const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 1000, 300);
x.fillStyle = '#111'; x.font = '34px Georgia, serif'; x.fillText('What the hell is this shit, Dick?', 50, 100);
x.fillText('Assess the cocktail, said the cocky bastard.', 50, 180);
c.toBlob(b => { document.getElementById('page').src = URL.createObjectURL(b); });
</script></body></html>`;

(async () => {
  const ctx = await chromium.launchPersistentContext('', {
    headless: true, executablePath: process.env.CHROMIUM_PATH || undefined,
    args: ['--headless=new', `--disable-extensions-except=${dir}`, `--load-extension=${dir}`],
  });
  await ctx.route('https://read.amazon.com/**', r => r.fulfill({ contentType: 'text/html', body: PAGE }));
  let [sw] = ctx.serviceWorkers(); if (!sw) sw = await ctx.waitForEvent('serviceworker');
  const bg = await ctx.newPage();
  bg.on('pageerror', e => console.log('  [background error]', e.message));
  await bg.goto(`chrome-extension://${sw.url().split('/')[2]}/background.html`);
  const page = await ctx.newPage();
  await page.goto('https://read.amazon.com/?asin=TEST');
  let fail = 0; const check = (n, ok, x) => { console.log(ok ? 'PASS' : 'FAIL', n, x !== undefined ? JSON.stringify(x) : ''); if (!ok) fail++; };
  await page.waitForFunction(() => document.querySelector('.qp-overlay') && !document.getElementById('page').classList.contains('qp-checking'), null, { timeout: 60000 });
  const n = await page.evaluate(() => document.querySelectorAll('.qp-overlay .qp-box').length);
  check('Safari background page reads the page and words get covered', n === 4, { boxes: n });
  const stats = await bg.evaluate(() => new Promise(r => setTimeout(() => r(Object.values(tabs).map(t => Object.values(t)[0])), 800)));
  check('Safari background page collects stats', stats.length === 1 && /■/.test(stats[0].ocrSample) && !/hell|shit|bastard/i.test(stats[0].ocrSample), stats[0]);
  await page.screenshot({ path: path.join(os.tmpdir(), 'qp-safari.png') });
  await ctx.close();
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(fail ? fail + ' FAILED' : 'ALL PASS'); process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
