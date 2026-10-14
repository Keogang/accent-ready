// The word reader (OCR), shared by Chrome and Safari. Uses Tesseract.js; the
// engine and the English language data ship inside the extension, so nothing
// is downloaded or sent anywhere.

var QP_WORKERS = 2; // two pages can be read at once (the current one and the next)
var qpSchedulerPromise = null;

function qpScheduler() {
  if (!qpSchedulerPromise) {
    qpSchedulerPromise = (async function () {
      var scheduler = Tesseract.createScheduler();
      for (var i = 0; i < QP_WORKERS; i++) {
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
    qpSchedulerPromise.catch(function () { qpSchedulerPromise = null; });
  }
  return qpSchedulerPromise;
}

// Returns { ok, lines } where each line is a list of words with their boxes
// in image pixels, or { ok: false, error }.
async function qpRead(image) {
  try {
    var scheduler = await qpScheduler();
    var result = await scheduler.addJob("recognize", image);
    var lines = (result.data.lines || []).map(function (line) {
      return line.words.map(function (w) {
        return { text: w.text, box: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1] };
      });
    });
    return { ok: true, lines: lines };
  } catch (err) {
    return { ok: false, error: String((err && err.message) || err) };
  }
}
