// Chrome/Comet background worker. Workers that run WebAssembly can't live in
// a service worker, so the word reader runs in a hidden page (offscreen.html).
importScripts("hub.js");

// One shared promise, so a second page asking while the hidden page is still
// starting waits for it instead of messaging a page that can't answer yet.
var ready = null;
function ensureOffscreen() {
  if (!ready) {
    ready = (async function () {
      if (await chrome.offscreen.hasDocument()) return;
      await chrome.offscreen.createDocument({
        url: "offscreen.html",
        reasons: ["WORKERS"],
        justification: "Reads the words in Kindle page images on this computer so chosen words can be covered."
      });
    })();
    ready.catch(function () { ready = null; });
  }
  return ready;
}

async function qpRecognize(image) {
  for (var attempt = 0; ; attempt++) {
    await ensureOffscreen();
    try {
      return await chrome.runtime.sendMessage({ target: "qp-offscreen", image: image });
    } catch (err) {
      // The hidden page can still be loading its scripts; give it a moment.
      if (attempt >= 4 || !/Receiving end does not exist/.test(String(err))) throw err;
      await new Promise(function (r) { setTimeout(r, 300 * (attempt + 1)); });
    }
  }
}
