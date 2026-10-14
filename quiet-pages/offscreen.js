// Hidden extension page that reads the words in a page image (OCR) with
// Tesseract.js. Everything runs on this computer; the engine and the English
// language data ship inside the extension, so nothing is downloaded or sent.

var WORKERS = 2; // two pages can be read at once (the current one and the next)
var schedulerPromise = null;

function getScheduler() {
  if (!schedulerPromise) {
    schedulerPromise = (async function () {
      var scheduler = Tesseract.createScheduler();
      for (var i = 0; i < WORKERS; i++) {
        var worker = await Tesseract.createWorker("eng", 1, {
          workerPath: chrome.runtime.getURL("vendor/worker.min.js"),
          corePath: chrome.runtime.getURL("vendor/core"),
          langPath: chrome.runtime.getURL("vendor/lang"),
          workerBlobURL: false,
          gzip: true,
          cacheMethod: "none"
        });
        scheduler.addWorker(worker);
      }
      return scheduler;
    })();
    schedulerPromise.catch(function () { schedulerPromise = null; });
  }
  return schedulerPromise;
}

// Returns lines of words, each word with its box in image pixels.
async function read(image) {
  var scheduler = await getScheduler();
  var result = await scheduler.addJob("recognize", image);
  return (result.data.lines || []).map(function (line) {
    return line.words.map(function (w) {
      return { text: w.text, box: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1] };
    });
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, reply) {
  if (!msg || msg.target !== "qp-offscreen") return;
  read(msg.image).then(
    function (lines) { reply({ ok: true, lines: lines }); },
    function (err) { reply({ ok: false, error: String((err && err.message) || err) }); }
  );
  return true; // reply comes later
});

// Start the engine right away so the first page is quicker.
getScheduler();
