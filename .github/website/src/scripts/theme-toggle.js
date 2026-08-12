/* theme-toggle.js
   Handles all .theme-toggle-btn buttons on the page.
   Moon = currently light mode (click to go dark)
   Sun  = currently dark mode  (click to go light)
*/

const SVG_MOON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
  stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>
</svg>`;

const SVG_SUN = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none"
  stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
</svg>`;

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function updateAllIcons() {
  const isDark = getTheme() === "dark";
  document.querySelectorAll(".theme-toggle-btn").forEach((btn) => {
    btn.innerHTML = isDark ? SVG_SUN : SVG_MOON;
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      isDark ? "Switch to light theme" : "Switch to dark theme",
    );
  });
}

function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.colorScheme = next;
  try {
    localStorage.setItem("ag-theme", next);
  } catch (e) {}
  updateAllIcons();
  document.dispatchEvent(new CustomEvent("theme-changed"));
}

function initThemeToggle() {
  updateAllIcons();
  document
    .querySelectorAll(".theme-toggle-btn")
    .forEach((btn) => btn.addEventListener("click", toggleTheme));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
  initThemeToggle();
}
