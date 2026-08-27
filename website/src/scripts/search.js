/* search.js — Search palette controller */

import { rankSearchItems } from "./search-utils.js";

const root = document.getElementById("search-palette");
const input = document.getElementById("sp-input");
const results = document.getElementById("sp-results");
const closeBtn = document.getElementById("sp-close");
const scrim = document.getElementById("sp-scrim");

if (!root || !input || !results || !closeBtn) {
  console.warn("SearchPalette: required DOM elements not found");
  throw new Error("SearchPalette: required DOM elements not found");
}

const ITEMS = JSON.parse(root.dataset.items || "[]");
const POPULAR_COUNT = 7;

let sel = -1;
let triggerEl = null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlight(text, q) {
  if (!q.trim()) return escapeHtml(text);
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "gi"));
  return parts
    .map((p, i) =>
      i % 2 === 1 ? `<mark>${escapeHtml(p)}</mark>` : escapeHtml(p),
    )
    .join("");
}

function runSearch(q) {
  const query = q.trim();
  if (!query) return ITEMS.slice(0, POPULAR_COUNT);
  return rankSearchItems(ITEMS, query).slice(0, 12);
}

function render(q) {
  const matches = runSearch(q);
  const query = q.trim().toLowerCase();
  const group = !q.trim() ? "Popular" : "Results";
  sel = matches.length > 0 ? 0 : -1;

  if (matches.length === 0) {
    results.innerHTML = `<li class="sp-empty">No results for &ldquo;<strong>${escapeHtml(q)}</strong>&rdquo;</li>`;
    return;
  }

  results.innerHTML =
    `<li class="sp-group-label" aria-hidden="true">${escapeHtml(group)}</li>` +
    matches
      .map(
        (item, i) =>
          `<li class="sp-item" role="option" aria-selected="false"` +
          ` data-href="${escapeHtml(item.href)}" data-index="${i}">` +
          `<span class="sp-item-name">${highlight(item.name, query)}</span>` +
          `<span class="sp-item-cat">${escapeHtml(item.catLabel)}</span>` +
          `</li>`,
      )
      .join("");

  if (sel >= 0) {
    setSel(sel);
  }
}

function getItems() {
  return Array.from(results.querySelectorAll(".sp-item"));
}

function setSel(idx) {
  const items = getItems();
  if (!items.length) return;
  sel = Math.max(0, Math.min(idx, items.length - 1));
  items.forEach((el, i) => {
    el.classList.toggle("sel", i === sel);
    el.setAttribute("aria-selected", i === sel ? "true" : "false");
  });
  items[sel]?.scrollIntoView({ block: "nearest" });
}

function open() {
  triggerEl = document.activeElement;
  root.removeAttribute("hidden");
  document.body.classList.add("search-open");
  render(input.value);
  requestAnimationFrame(() => {
    input.focus();
    input.select();
  });
  Array.from(document.body.children).forEach((child) => {
    if (child !== root) child.setAttribute("inert", "");
  });
}

function close() {
  root.setAttribute("hidden", "");
  document.body.classList.remove("search-open");
  Array.from(document.body.children).forEach((child) => {
    child.removeAttribute("inert");
  });
  const el = triggerEl;
  triggerEl = null;
  if (el && typeof el.focus === "function") el.focus();
}

/* ── Triggers ──────────────────────────────────────── */

document.addEventListener("ag:open-search", open);

scrim?.addEventListener("click", close);
closeBtn.addEventListener("click", close);

input.addEventListener("input", () => render(input.value));

results.addEventListener("click", (e) => {
  const item = e.target.closest(".sp-item");
  if (!item) return;
  const href = item.dataset.href;
  if (href) {
    close();
    window.location.href = href;
  }
});

/* ── Keyboard ──────────────────────────────────────── */

document.addEventListener("keydown", (e) => {
  if (root.hasAttribute("hidden")) return;

  if (e.key === "Escape") {
    close();
    return;
  }

  const items = getItems();
  const n = items.length;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setSel(sel < 0 ? 0 : Math.min(sel + 1, n - 1));
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setSel(Math.max(sel - 1, 0));
    return;
  }

  if (e.key === "Enter" && sel >= 0 && sel < n) {
    e.preventDefault();
    const href = items[sel]?.dataset.href;
    if (href) {
      close();
      window.location.href = href;
    }
    return;
  }

  if (e.key === "Tab") {
    const focusable = [input, closeBtn, ...items];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
