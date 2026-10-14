// Shared background logic: collects counts from every frame of each tab, shows
// the number of hidden words on the toolbar icon, answers the popup, and passes
// page images to the word reader. Each browser supplies qpRecognize(image).

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

function setBadge(tabId, hidden) {
  try {
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#333" });
    chrome.action.setBadgeText({ tabId: tabId, text: hidden ? String(hidden) : "" });
  } catch (e) { /* not every browser supports badge colors */ }
}

chrome.runtime.onMessage.addListener(function (msg, sender, reply) {
  if (!msg) return;
  if (msg.type === "qp-stats" && sender.tab) {
    var tabId = sender.tab.id;
    tabs[tabId] = tabs[tabId] || {};
    tabs[tabId][sender.frameId] = {
      hidden: msg.hidden, words: msg.words, pages: msg.pages, sample: msg.sample || "",
      ocrSample: msg.ocrSample || "", error: msg.error || ""
    };
    setBadge(tabId, combine(tabId).hidden);
  } else if (msg.type === "qp-get-stats") {
    reply(combine(msg.tabId));
  } else if (msg.type === "qp-ocr") {
    qpRecognize(msg.image).then(
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
