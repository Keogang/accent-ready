// Runs inside Kindle Cloud Reader (every frame). Finds blocked words in the
// page text and wraps each one in a <span> that hides it. Nothing leaves the
// page, and the book itself is never changed.

(function () {
  if (window.__quietPagesLoaded) return;
  window.__quietPagesLoaded = true;

  var HIT = "qp-hit";
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1 };

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
        r.addedNodes.forEach(function (n) {
          if ((n.nodeType === 1 || n.nodeType === 3) && n.isConnected) processTree(n);
        });
      });
    } catch (e) {
      console.warn("Quiet Pages:", e);
    } finally {
      // Always start watching again, even after an error, or later pages go unfiltered.
      observer.takeRecords();
      observer.observe(observer.__qpRoot, { childList: true, subtree: true, characterData: true });
    }
    scheduleReport();
  }

  function watch(root) {
    if (root.__qpWatched) return;
    root.__qpWatched = true;
    var obs = new MutationObserver(onMutations);
    obs.__qpRoot = root;
    obs.observe(root, { childList: true, subtree: true, characterData: true });
    observers.push(obs);
  }

  // ---------- settings ----------

  function apply() {
    var root = document.documentElement;
    if (!root) return;
    observers.forEach(function (o) { o.disconnect(); o.__qpRoot.__qpWatched = false; });
    observers = [];
    unhideAll(root);
    matcher = settings.enabled ? QP.buildMatcher(settings, QP_TIERS, QP_DEFAULT_ALLOW) : null;
    if (matcher) {
      processTree(root);
      watch(document);
    }
    scheduleReport();
  }

  chrome.storage.sync.get(QP_DEFAULTS, function (stored) {
    settings = Object.assign({}, QP_DEFAULTS, stored);
    apply();
  });

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area !== "sync") return;
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
    try {
      chrome.runtime.sendMessage({
        type: "qp-stats",
        hidden: document.querySelectorAll("." + HIT).length,
        words: text ? text.split(" ").length : 0,
        sample: mask(text.slice(0, 220))
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
