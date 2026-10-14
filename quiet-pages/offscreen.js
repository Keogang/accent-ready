// Chrome only: the hidden page that hosts the word reader (see ocr-engine.js).
chrome.runtime.onMessage.addListener(function (msg, sender, reply) {
  if (!msg || msg.target !== "qp-offscreen") return;
  qpRead(msg.image).then(reply);
  return true; // reply comes later
});

// Start the engine right away so the first page is quicker.
qpScheduler();
