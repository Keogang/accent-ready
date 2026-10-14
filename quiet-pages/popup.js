var $ = function (id) { return document.getElementById(id); };
var settings;

function save(patch) {
  Object.assign(settings, patch);
  chrome.storage.sync.set(patch);
  render();
}

function lines(text) {
  return text.split(/[\n,]+/).map(function (s) { return s.trim(); }).filter(Boolean);
}

function render() {
  $("enabled").checked = settings.enabled;
  $("state").textContent = settings.enabled ? "On" : "Off";
  $("settings").classList.toggle("disabled", !settings.enabled);
  document.querySelectorAll("input[name=style]").forEach(function (r) { r.checked = r.value === settings.style; });
  $("peek").checked = settings.peek;
}

function buildTiers() {
  var box = $("tiers");
  Object.keys(QP_TIERS).forEach(function (key) {
    var label = document.createElement("label");
    var box2 = document.createElement("input");
    box2.type = "checkbox";
    box2.checked = key in settings.tiers ? settings.tiers[key] : QP_TIERS[key].on;
    box2.addEventListener("change", function () {
      var tiers = Object.assign({}, settings.tiers);
      tiers[key] = box2.checked;
      save({ tiers: tiers });
    });
    label.appendChild(box2);
    label.appendChild(document.createTextNode(QP_TIERS[key].label));
    box.appendChild(label);
  });
}

function loadStats() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (found) {
    var tab = found[0];
    if (!tab) return;
    // Ask every frame to report fresh numbers, then read the combined result.
    chrome.tabs.sendMessage(tab.id, { type: "qp-report" }, function () { void chrome.runtime.lastError; });
    setTimeout(function () {
      chrome.runtime.sendMessage({ type: "qp-get-stats", tabId: tab.id }, function (s) {
        if (!s || (!s.words && !s.hidden)) return;
        $("hidden").textContent = s.hidden;
        $("sample").textContent = s.sample || "(no readable text found)";
      });
    }, 250);
  });
}

chrome.storage.sync.get(QP_DEFAULTS, function (stored) {
  settings = Object.assign({}, QP_DEFAULTS, stored);
  $("customBlock").value = settings.customBlock.join("\n");
  $("customAllow").value = settings.customAllow.join("\n");
  buildTiers();
  render();
  loadStats();

  $("enabled").addEventListener("change", function () { save({ enabled: $("enabled").checked }); });
  $("peek").addEventListener("change", function () { save({ peek: $("peek").checked }); });
  document.querySelectorAll("input[name=style]").forEach(function (r) {
    r.addEventListener("change", function () { save({ style: r.value }); });
  });
  $("customBlock").addEventListener("change", function () { save({ customBlock: lines($("customBlock").value) }); });
  $("customAllow").addEventListener("change", function () { save({ customAllow: lines($("customAllow").value) }); });
});
