// main.js — small enhancements for the Landing Kit

// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Theme handling: auto-detect + toggle
const body = document.body;
const toggle = document.querySelector(".theme-toggle");
const icon = document.querySelector(".theme-toggle-icon");

const THEME_KEY = "landing-kit-theme";

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  if (!icon || !toggle) return;

  if (theme === "light") {
    icon.textContent = "☀︎";
    toggle.setAttribute("aria-pressed", "true");
  } else {
    icon.textContent = "☾";
    toggle.setAttribute("aria-pressed", "false");
  }
}

// Initial theme: from localStorage or system preference
(function initTheme() {
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
    return;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(prefersDark ? "dark" : "light");
})();

// Toggle
if (toggle) {
  toggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    applyTheme(next);
    window.localStorage.setItem(THEME_KEY, next);
  });
}

// Reveal on scroll (respects reduced motion)
const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealNodes = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((el) => {
    el.style.animationPlayState = "paused";
    revealObserver.observe(el);
  });
}