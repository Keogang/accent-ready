// Runs inside Kindle Cloud Reader (every frame). Kindle shows most books as
// one image per page, so this script:
//   - hides each page image until its words have been read (OCR, done on this
//     computer by offscreen.js), then covers blocked words with boxes; and
//   - for any real text on the page, wraps blocked words in a hiding <span>.
// Nothing leaves this computer, and the book itself is never changed.

(function () {
  if (window.__quietPagesLoaded) return;
  window.__quietPagesLoaded = true;

  var HIT = "qp-hit";
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1 };

  var OBSERVE = { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["src"] };
  var settings = Object.assign({}, QP_DEFAULTS);
  var matcher = null;
  var observers = [];
  var reportTimer = null;

  // ---------- hiding and un-hiding ----------

  function placeholder(word) {
    return "[" + "—".repeat(Math.min(3, Math.max(1, Math.round(word.length / 3)))) + "]";
  }

  function makeHit(doc, word) {
    var span = doc.createElement("span");
    span.className = HIT + " qp-" + settings.style;
    span.setAttribute("data-qp-orig", word);
    span.textContent = settings.style === "replace" ? placeholder(word) : word;
    if (settings.peek) {
      span.title = "Click to show this word";
      // Listen on the word itself: readers that rebuild their frames wipe
      // listeners on the document.
      span.addEventListener("click", peek, true);
    }
    return span;
  }

  // Click to peek. Stops the click so it doesn't also turn the page.
  function peek(e) {
    var span = e.currentTarget;
    e.stopPropagation();
    e.preventDefault();
    var shown = span.classList.toggle("qp-revealed");
    var word = span.getAttribute("data-qp-orig");
    span.textContent = shown || settings.style !== "replace" ? word : placeholder(word);
  }

  function shouldSkip(node) {
    for (var el = node.parentNode; el && el.nodeType === 1; el = el.parentNode) {
      if (SKIP_TAGS[el.tagName] || el.isContentEditable) return true;
      if (el.classList && el.classList.contains(HIT)) return true;
    }
    return false;
  }

  function processTextNode(node) {
    var text = node.nodeValue;
    // A page turn can add and remove the same text in one batch; skip what's gone.
    if (!node.parentNode || !text || text.length < 2 || shouldSkip(node)) return;
    var hits = QP.findMatches(text, matcher);
    if (!hits.length) return;
    var doc = node.ownerDocument;
    var frag = doc.createDocumentFragment();
    var pos = 0;
    hits.forEach(function (h) {
      if (h.index > pos) frag.appendChild(doc.createTextNode(text.slice(pos, h.index)));
      frag.appendChild(makeHit(doc, h.text));
      pos = h.index + h.length;
    });
    if (pos < text.length) frag.appendChild(doc.createTextNode(text.slice(pos)));
    node.parentNode.replaceChild(frag, node);
  }

  function processTree(root) {
    if (!matcher || !root) return;
    if (root.nodeType === 3) { processTextNode(root); return; }
    var doc = root.ownerDocument || root;
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(processTextNode);
    // Look inside open shadow roots too.
    if (root.querySelectorAll) {
      root.querySelectorAll("*").forEach(function (el) {
        if (el.shadowRoot) { watch(el.shadowRoot); processTree(el.shadowRoot); }
      });
    }
  }

  function unhideAll(root) {
    root.querySelectorAll("." + HIT).forEach(function (span) {
      var parent = span.parentNode;
      parent.replaceChild(span.ownerDocument.createTextNode(span.getAttribute("data-qp-orig")), span);
      parent.normalize();
    });
  }

  // ---------- watching for page turns ----------

  // MutationObserver callbacks run before the browser paints, so a new page
  // gets filtered before you can see it.
  function onMutations(records, observer) {
    if (!matcher) return;
    observer.disconnect();
    try {
      records.forEach(function (r) {
        if (r.type === "characterData") processTextNode(r.target);
        if (r.type === "attributes") checkImage(r.target);
        r.addedNodes.forEach(function (n) {
          if ((n.nodeType === 1 || n.nodeType === 3) && n.isConnected) {
            processTree(n);
            if (n.nodeType === 1) findImages(n);
          }
        });
      });
    } catch (e) {
      console.warn("Quiet Pages:", e);
    } finally {
      // Always start watching again, even after an error, or later pages go unfiltered.
      observer.takeRecords();
      observer.observe(observer.__qpRoot, OBSERVE);
    }
    scheduleReport();
  }

  function watch(root) {
    if (root.__qpWatched) return;
    root.__qpWatched = true;
    var obs = new MutationObserver(onMutations);
    obs.__qpRoot = root;
    obs.observe(root, OBSERVE);
    observers.push(obs);
  }


  // ---------- page images ----------

  var MIN_PAGE_WIDTH = 200; // smaller images are icons, not book pages
  var pages = new Map(); // img -> { src, overlay }
  var results = new Map(); // image src -> finished reading, so a revisited page shows instantly
  var pending = new Map(); // image src -> reading in progress
  var lastError = "";

  function findImages(root) {
    if (root.tagName === "IMG") checkImage(root);
    if (root.querySelectorAll) root.querySelectorAll("img").forEach(checkImage);
  }

  function looksLikePage(img) {
    return img.tagName === "IMG" && /^blob:/.test(img.src || "");
  }

  // Called synchronously from the MutationObserver, before the browser paints,
  // so a new page is hidden before it can be seen.
  function checkImage(img) {
    if (!looksLikePage(img)) return;
    if (img.complete && img.naturalWidth && img.naturalWidth < MIN_PAGE_WIDTH) return;
    var state = pages.get(img);
    if (state && state.src === img.src) return;
    state = state || {};
    state.src = img.src;
    pages.set(img, state);
    if (!matcher) return;
    var done = results.get(img.src);
    if (done) { render(img, done); return; }
    hidePage(img, true);
    readPage(img).then(function (result) {
      if (img.src !== result.src) return; // the reader moved on to another page
      render(img, result);
    }, function (err) {
      lastError = String((err && err.message) || err);
      console.warn("Quiet Pages could not read this page:", err);
      if (img.src === state.src) hidePage(img, false);
      scheduleReport();
    });
  }

  function hidePage(img, hide) {
    img.classList.toggle("qp-checking", hide);
    var overlay = overlayFor(img);
    overlay.classList.toggle("qp-checking-note", hide);
    if (hide) overlay.textContent = "Quiet Pages is checking this page…";
  }

  function readPage(img) {
    var src = img.src;
    if (pending.has(src)) return pending.get(src);
    var job = (async function () {
      try { await img.decode(); } catch (e) { /* drawn below anyway */ }
      var w = img.naturalWidth, h = img.naturalHeight;
      if (w < MIN_PAGE_WIDTH) return { src: src, lines: [], small: true };
      // Small text reads more accurately when enlarged.
      var scale = w < 1400 ? 2 : 1;
      var canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var corner = ctx.getImageData(2, 2, 1, 1).data;
      var res = await qpSend({ type: "qp-ocr", image: canvas.toDataURL("image/png") });
      if (!res || !res.ok) throw new Error((res && res.error) || "The word reader did not answer");
      // Store word boxes as fractions of the page so they fit any display size.
      var lines = res.lines.map(function (words) {
        return words.map(function (wd) {
          var b = wd.box;
          return { text: wd.text, x: b[0] / canvas.width, y: b[1] / canvas.height,
                   w: (b[2] - b[0]) / canvas.width, h: (b[3] - b[1]) / canvas.height };
        });
      });
      return { src: src, lines: lines, background: "rgb(" + corner[0] + "," + corner[1] + "," + corner[2] + ")" };
    })();
    pending.set(src, job);
    job.then(function (result) {
      results.set(src, result);
      if (results.size > 60) results.delete(results.keys().next().value);
    }).finally(function () { pending.delete(src); });
    return job;
  }

  // Finds blocked words line by line, so phrases like "oh my god" work too.
  // Returns one box per blocked word or phrase, in page fractions.
  function boxesFor(result) {
    var boxes = [];
    result.lines.forEach(function (words) {
      var text = "", starts = [];
      words.forEach(function (wd, i) {
        if (i) text += " ";
        starts.push(text.length);
        text += wd.text;
      });
      QP.findMatches(text, matcher).forEach(function (m) {
        var end = m.index + m.length, box = null;
        words.forEach(function (wd, i) {
          var s = starts[i], e = s + wd.text.length;
          if (e <= m.index || s >= end) return;
          var x2 = wd.x + wd.w, y2 = wd.y + wd.h;
          if (!box) box = { x: wd.x, y: wd.y, x2: x2, y2: y2 };
          else {
            box.x = Math.min(box.x, wd.x); box.y = Math.min(box.y, wd.y);
            box.x2 = Math.max(box.x2, x2); box.y2 = Math.max(box.y2, y2);
          }
        });
        if (box) boxes.push({ box: box, text: m.text });
      });
    });
    return boxes;
  }

  function overlayFor(img) {
    var state = pages.get(img) || {};
    pages.set(img, state);
    var overlay = state.overlay;
    if (!overlay || !overlay.isConnected || overlay.previousSibling !== img) {
      if (overlay) overlay.remove();
      overlay = img.ownerDocument.createElement("div");
      overlay.className = "qp-overlay";
      img.parentNode.insertBefore(overlay, img.nextSibling);
      state.overlay = overlay;
      if (window.ResizeObserver) {
        state.resize = state.resize || new ResizeObserver(function () { place(img, state.overlay); });
        state.resize.observe(img);
      }
    }
    place(img, overlay);
    return overlay;
  }

  // Lay the overlay exactly on top of the image.
  function place(img, overlay) {
    if (!overlay) return;
    overlay.style.left = img.offsetLeft + "px";
    overlay.style.top = img.offsetTop + "px";
    overlay.style.width = img.offsetWidth + "px";
    overlay.style.height = img.offsetHeight + "px";
  }

  function render(img, result) {
    var state = pages.get(img);
    if (result.small) {
      img.classList.remove("qp-checking");
      if (state.overlay) state.overlay.remove();
      return;
    }
    var overlay = overlayFor(img);
    overlay.textContent = "";
    overlay.classList.remove("qp-checking-note");
    state.result = result;
    state.hits = 0;
    var pad = 0.002;
    boxesFor(result).forEach(function (hit) {
      var b = hit.box;
      var el = img.ownerDocument.createElement("div");
      el.className = "qp-box qp-" + settings.style;
      el.style.left = (b.x - pad) * 100 + "%";
      el.style.top = (b.y - pad) * 100 + "%";
      el.style.width = (b.x2 - b.x + 2 * pad) * 100 + "%";
      el.style.height = (b.y2 - b.y + 2 * pad) * 100 + "%";
      if (settings.style === "replace") {
        el.style.background = result.background;
        el.textContent = placeholder(hit.text);
      }
      if (settings.peek) {
        el.classList.add("qp-peekable");
        el.title = "Click to show this word";
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          el.classList.toggle("qp-revealed");
        }, true);
      }
      overlay.appendChild(el);
      state.hits++;
    });
    img.classList.remove("qp-checking");
    scheduleReport();
  }

  function clearImages() {
    pages.forEach(function (state, img) {
      img.classList.remove("qp-checking");
      if (state.overlay) state.overlay.remove();
      if (state.resize) state.resize.disconnect();
    });
    pages = new Map();
  }

  function isOnScreen(el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.right > 0 && r.bottom > 0 &&
      r.left < innerWidth && r.top < innerHeight;
  }

  // ---------- settings ----------

  function apply() {
    var root = document.documentElement;
    if (!root) return;
    observers.forEach(function (o) { o.disconnect(); o.__qpRoot.__qpWatched = false; });
    observers = [];
    unhideAll(root);
    clearImages();
    matcher = settings.enabled ? QP.buildMatcher(settings, QP_TIERS, QP_DEFAULT_ALLOW) : null;
    if (matcher) {
      processTree(root);
      findImages(root);
      watch(document);
    }
    scheduleReport();
  }

  QP_STORE.get(QP_DEFAULTS, function (stored) {
    settings = Object.assign({}, QP_DEFAULTS, stored);
    apply();
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== QP_AREA) return;
    Object.keys(changes).forEach(function (k) { settings[k] = changes[k].newValue; });
    apply();
  });

  // ---------- stats for the popup and the toolbar badge ----------

  // The popup preview must not show the words it is hiding.
  function mask(text) {
    var out = text;
    QP.findMatches(text, matcher).reverse().forEach(function (h) {
      out = out.slice(0, h.index) + "■".repeat(h.length) + out.slice(h.index + h.length);
    });
    return out;
  }

  function report() {
    var body = document.body;
    var text = body ? (body.innerText || "").replace(/\s+/g, " ").trim() : "";
    // Count only what is on screen: Kindle keeps nearby pages loaded.
    var hidden = 0, scanned = 0, ocrText = "";
    document.querySelectorAll("." + HIT).forEach(function (span) {
      if (isOnScreen(span)) hidden++;
    });
    pages.forEach(function (state, img) {
      if (!state.result) return;
      scanned++;
      if (!img.isConnected || !isOnScreen(img)) return;
      hidden += state.hits;
      var pageText = state.result.lines.map(function (ws) {
        return ws.map(function (w) { return w.text; }).join(" ");
      }).join(" ");
      if (pageText.length > ocrText.length) ocrText = pageText;
    });
    try {
      chrome.runtime.sendMessage({
        type: "qp-stats",
        hidden: hidden,
        words: text ? text.split(" ").length : 0,
        pages: scanned,
        sample: mask(text.slice(0, 220)),
        ocrSample: mask(ocrText.slice(0, 220)),
        error: lastError
      });
    } catch (e) { /* extension was reloaded; ignore */ }
  }

  function scheduleReport() {
    clearTimeout(reportTimer);
    reportTimer = setTimeout(report, 400);
  }

  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg && msg.type === "qp-report") report();
  });
})();
