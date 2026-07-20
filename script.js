// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Theme toggle (persisted in localStorage)
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;
const STORAGE_KEY = "portfolio-theme";

function applyTheme(theme) {
  if (theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
}

const savedTheme = localStorage.getItem(STORAGE_KEY);
if (savedTheme) applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

// General / iOS Developer mode toggle (persisted in localStorage)
const modeButtons = document.querySelectorAll(".mode-btn");
const MODE_KEY = "portfolio-mode";

function applyMode(mode) {
  document.body.dataset.mode = mode;

  modeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  document.querySelectorAll("[data-text-general]").forEach((el) => {
    el.textContent = mode === "ios" ? el.dataset.textIos : el.dataset.textGeneral;
  });

  document.querySelectorAll("[data-href-general]").forEach((el) => {
    el.href = mode === "ios" ? el.dataset.hrefIos : el.dataset.hrefGeneral;
    if (el.dataset.labelGeneral) {
      el.textContent = mode === "ios" ? el.dataset.labelIos : el.dataset.labelGeneral;
    }
  });
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    localStorage.setItem(MODE_KEY, mode);
    applyMode(mode);
  });
});

applyMode(localStorage.getItem(MODE_KEY) || "general");
