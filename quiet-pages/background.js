// Collects counts from every frame of each tab, shows the number of hidden
// words on the toolbar icon, answers the popup, and passes page images to the
// hidden reader page (offscreen.html) for word recognition.

var tabs = {};

function combine(tabId) {
  var frames = tabs[tabId] || {};
  var total = { hidden: 0, words: 0, pages: 0, sample: "", ocrSample: "", error: "" };
  Object.keys(frames).forEach(function (id) {
    var f = frames[id];
    total.hidden += f.hidden;
    total.words += f.words;
    total.pages += f.pages || 0;
    // Show the sample from the frame with the most text: that's the book page.
    if (f.sample.length > total.sample.length) total.sample = f.sample;
    if ((f.ocrSample || "").length > total.ocrSample.length) total.ocrSample = f.ocrSample;
    if (f.error) total.error = f.error;
  });
  return total;
}

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

async function recognize(image) {
  await ensureOffscreen();
  return chrome.runtime.sendMessage({ target: "qp-offscreen", image: image });
}

chrome.runtime.onMessage.addListener(function (msg, sender, reply) {
  if (msg.type === "qp-stats" && sender.tab) {
    var tabId = sender.tab.id;
    tabs[tabId] = tabs[tabId] || {};
    tabs[tabId][sender.frameId] = {
      hidden: msg.hidden, words: msg.words, pages: msg.pages, sample: msg.sample || "",
      ocrSample: msg.ocrSample || "", error: msg.error || ""
    };
    var hidden = combine(tabId).hidden;
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#333" });
    chrome.action.setBadgeText({ tabId: tabId, text: hidden ? String(hidden) : "" });
  } else if (msg.type === "qp-get-stats") {
    reply(combine(msg.tabId));
  } else if (msg.type === "qp-ocr") {
    recognize(msg.image).then(
      function (res) { reply(res || { ok: false, error: "No answer from the word reader" }); },
      function (err) { reply({ ok: false, error: String((err && err.message) || err) }); }
    );
    return true;
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) { delete tabs[tabId]; });
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === "loading") delete tabs[tabId];
});
