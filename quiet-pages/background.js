// Collects counts from every frame of each tab, shows the number of hidden
// words on the toolbar icon, and answers the popup.

var tabs = {};

function combine(tabId) {
  var frames = tabs[tabId] || {};
  var total = { hidden: 0, words: 0, sample: "" };
  Object.keys(frames).forEach(function (id) {
    var f = frames[id];
    total.hidden += f.hidden;
    total.words += f.words;
    // Show the sample from the frame with the most text: that's the book page.
    if (f.sample.length > total.sample.length) total.sample = f.sample;
  });
  return total;
}

chrome.runtime.onMessage.addListener(function (msg, sender, reply) {
  if (msg.type === "qp-stats" && sender.tab) {
    var tabId = sender.tab.id;
    tabs[tabId] = tabs[tabId] || {};
    tabs[tabId][sender.frameId] = { hidden: msg.hidden, words: msg.words, sample: msg.sample || "" };
    var hidden = combine(tabId).hidden;
    chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#333" });
    chrome.action.setBadgeText({ tabId: tabId, text: hidden ? String(hidden) : "" });
  } else if (msg.type === "qp-get-stats") {
    reply(combine(msg.tabId));
  }
});

chrome.tabs.onRemoved.addListener(function (tabId) { delete tabs[tabId]; });
chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === "loading") delete tabs[tabId];
});
