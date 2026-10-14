// Small helpers so the same code runs in Chrome/Comet and Safari.

// Safari may not offer synced storage; fall back to this computer's storage.
var QP_AREA = chrome.storage.sync ? "sync" : "local";
var QP_STORE = chrome.storage[QP_AREA];

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
