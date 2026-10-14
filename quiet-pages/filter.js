// Turns the settings into one regular expression and finds matches in text.
// Shared by the content script and by the tests (which load it in Node).

var QP_DEFAULTS = {
  enabled: true,
  tiers: { mild: true, moderate: true, strong: true, religious: false },
  style: "bar", // "bar" | "blur" | "replace"
  peek: false, // click a hidden word to show it
  customBlock: [],
  customAllow: []
};

var QP = (function () {
  var PLURAL = "(?:s|es)?";
  var VERB = "(?:s|es|ed|d|er|ers|ing|in['’]|y)?";
  var LETTER = "[\\p{L}\\p{N}]";

  function escape(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // `allEndings` adds -ed/-ing/-er/-y (with a doubled last letter, as in
  // "frakking"); otherwise only plurals match, so "pricked" or "cocky" stay.
  function entryPattern(entry, allEndings) {
    var e = String(entry).trim().toLowerCase();
    var anywhere = e.charAt(0) === "*";
    if (anywhere) e = e.slice(1);
    if (e.slice(-1) === "+") { allEndings = true; e = e.slice(0, -1).trim(); }
    if (!e) return null;
    // Treat straight and curly apostrophes alike, and any run of spaces as a gap.
    var body = escape(e).replace(/['’]/g, "['’]").replace(/\s+/g, "\\s+");
    if (anywhere) return "[\\p{L}'’]*" + body + "[\\p{L}'’]*";
    if (!allEndings) return body + PLURAL;
    var last = /\p{L}$/u.test(e) ? escape(e.slice(-1)) + "?" : "";
    return body + "(?:" + last + VERB + ")";
  }

  function cleanList(list) {
    return (list || []).map(function (w) { return String(w).trim().toLowerCase(); }).filter(Boolean);
  }

  function buildMatcher(settings, tiers, defaultAllow) {
    var s = Object.assign({}, QP_DEFAULTS, settings || {});
    var parts = [];
    Object.keys(tiers).forEach(function (key) {
      var on = s.tiers && key in s.tiers ? s.tiers[key] : tiers[key].on;
      if (on) parts = parts.concat(tiers[key].words.map(function (w) { return entryPattern(w, false); }));
    });
    // Your own words get every ending, since you chose them on purpose.
    parts = parts.concat(cleanList(s.customBlock).map(function (w) { return entryPattern(w, true); }));
    parts = parts.filter(Boolean);
    if (!parts.length) return null;
    // Longest patterns first so "motherf..." wins over shorter overlaps.
    parts.sort(function (a, b) { return b.length - a.length; });
    var regex = new RegExp("(?<!" + LETTER + ")(?:" + parts.join("|") + ")(?!" + LETTER + ")", "giu");
    var allow = new Set(cleanList(defaultAllow).concat(cleanList(s.customAllow)));
    return { regex: regex, allow: allow };
  }

  // Returns [{index, length, text}] for every blocked word in `text`.
  function findMatches(text, matcher) {
    var out = [];
    if (!matcher || !text) return out;
    matcher.regex.lastIndex = 0;
    var m;
    while ((m = matcher.regex.exec(text))) {
      if (!m[0]) { matcher.regex.lastIndex++; continue; }
      if (!matcher.allow.has(m[0].toLowerCase().replace(/’/g, "'"))) {
        out.push({ index: m.index, length: m[0].length, text: m[0] });
      }
    }
    return out;
  }

  return { buildMatcher: buildMatcher, findMatches: findMatches };
})();

if (typeof module !== "undefined") module.exports = { QP: QP, QP_DEFAULTS: QP_DEFAULTS };
