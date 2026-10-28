// Small helpers so the same code runs in Chrome/Comet and Safari.

// Safari may not offer synced storage; fall back to this computer's storage.
// (Chrome's hidden reader page has no storage at all, hence the first check.)
var QP_AREA = chrome.storage && chrome.storage.sync ? "sync" : "local";
var QP_STORE = chrome.storage ? chrome.storage[QP_AREA] : null;

// iPhones and iPads give extensions far less memory than a computer, so the
// word reader does less at once there. (iPads report themselves as Macs, but
// with a touch screen.)
var QP_MOBILE = /iPhone|iPad|iPod|Android/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);

// Callback style works in every browser; promise style does not.
function qpSend(msg) {
  return new Promise(function (resolve, reject) {
    chrome.runtime.sendMessage(msg, function (res) {
      var err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else resolve(res);
    });
  });
}
