// Chrome/Comet background worker. Workers that run WebAssembly can't live in
// a service worker, so the word reader runs in a hidden page (offscreen.html).
importScripts("hub.js");

var creating = null;
async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  if (!creating) {
    creating = chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["WORKERS"],
      justification: "Reads the words in Kindle page images on this computer so chosen words can be covered."
    }).finally(function () { creating = null; });
  }
  await creating;
}

async function qpRecognize(image) {
  await ensureOffscreen();
  return chrome.runtime.sendMessage({ target: "qp-offscreen", image: image });
}
