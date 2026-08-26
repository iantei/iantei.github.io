// Every lookup is guarded: the three pages don't all carry the same elements,
// and one missing node used to throw and kill everything below it.

(function () {
  "use strict";

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------------- Theme (persisted) ---------------- */

  var root = document.documentElement;
  var THEME_KEY = "portfolio-theme";

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* private mode */ }
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
  }

  var savedTheme = read(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      store(THEME_KEY, next);
    });
  }

  /* ---------------- General / iOS focus (persisted) ---------------- */

  var MODE_KEY = "portfolio-mode";
  var modeButtons = document.querySelectorAll(".mode-btn");

  function applyMode(mode) {
    document.body.dataset.mode = mode;

    Array.prototype.forEach.call(modeButtons, function (btn) {
      var on = btn.dataset.mode === mode;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-pressed", String(on));
    });

    // Swap prose that differs between the two framings.
    document.querySelectorAll("[data-text-general]").forEach(function (el) {
      var next = mode === "ios" ? el.dataset.textIos : el.dataset.textGeneral;
      if (next) el.innerHTML = next;
    });

    // Swap the résumé the download link points at, and its label.
    document.querySelectorAll("[data-href-general]").forEach(function (el) {
      var href = mode === "ios" ? el.dataset.hrefIos : el.dataset.hrefGeneral;
      if (href) el.href = href;
      if (el.dataset.labelGeneral) {
        el.textContent = mode === "ios" ? el.dataset.labelIos : el.dataset.labelGeneral;
      }
    });
  }

  if (modeButtons.length) {
    Array.prototype.forEach.call(modeButtons, function (btn) {
      btn.addEventListener("click", function () {
        store(MODE_KEY, btn.dataset.mode);
        applyMode(btn.dataset.mode);
      });
    });
  }

  applyMode(read(MODE_KEY) || "general");
})();
