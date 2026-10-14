// Safari background page. Safari unloads it when idle, so the word reader
// restarts (a few seconds) the first time a page is read after a pause.
function qpRecognize(image) {
  return qpRead(image);
}
