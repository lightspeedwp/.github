/* global window, document, IntersectionObserver, CustomEvent, localStorage, navigator */
/* header.js — burger, drawer, dropdowns, scroll-shrink */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Scroll shrink ────────────────────────────── */
  const nav = document.querySelector(".nav");
  if (nav && "IntersectionObserver" in window) {
    const sentinel = document.createElement("div");
    sentinel.style.cssText =
      "position:absolute;top:0;height:1px;width:1px;pointer-events:none";
    document.body.prepend(sentinel);
    const observer = new IntersectionObserver(
      ([e]) => nav.classList.toggle("nav-shrunk", !e.isIntersecting),
      { rootMargin: "-60px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
  }

  /* ── Dropdowns ───────────────────────────────── */
  document.querySelectorAll(".nav-dropdown-trigger").forEach((trigger) => {
    const parent = trigger.closest(".nav-dropdown-wrap");
    const dropdown = parent?.querySelector(".nav-dropdown");
    if (!parent || !dropdown) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll(".nav-dropdown-wrap.open").forEach((d) => {
        d.classList.remove("open");
        d.querySelector(".nav-dropdown-trigger")?.setAttribute(
          "aria-expanded",
          "false",
        );
      });

      if (!isOpen) {
        parent.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      } else {
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        parent.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });

    parent.addEventListener("focusout", (e) => {
      if (!parent.contains(e.relatedTarget)) {
        parent.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".nav-dropdown-wrap.open").forEach((d) => {
      d.classList.remove("open");
      d.querySelector(".nav-dropdown-trigger")?.setAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  /* ── Burger + Drawer ────────────────────────── */
  const burger = document.getElementById("burger-btn");
  const drawer = document.getElementById("nav-drawer");
  const drawerClose = document.getElementById("drawer-close");
  const drawerScrim = document.getElementById("drawer-scrim");

  function openDrawer() {
    document.body.classList.add("drawer-open");
    burger?.setAttribute("aria-expanded", "true");
    burger?.setAttribute("aria-label", "Close menu");
    drawer?.setAttribute("aria-hidden", "false");
    drawer?.removeAttribute("inert");
    Array.from(document.body.children).forEach((child) => {
      if (child.id !== "nav-drawer" && child.id !== "drawer-scrim") {
        child.setAttribute("inert", "");
      }
    });
    drawerClose?.focus();
  }
  function closeDrawer() {
    document.body.classList.remove("drawer-open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Open menu");
    drawer?.setAttribute("aria-hidden", "true");
    drawer?.setAttribute("inert", "");
    Array.from(document.body.children).forEach((child) => {
      if (child.id !== "nav-drawer" && child.id !== "drawer-scrim") {
        child.removeAttribute("inert");
      }
    });
    burger?.focus();
  }

  burger?.addEventListener("click", openDrawer);
  drawerClose?.addEventListener("click", closeDrawer);
  drawerScrim?.addEventListener("click", closeDrawer);

  window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
    if (e.matches && document.body.classList.contains("drawer-open"))
      closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("drawer-open")) {
      closeDrawer();
    }
  });

  /* ── Branch toggle ──────────────────────────── */
  const BRANCH_KEY = "ag-branch";
  const branchBtns = document.querySelectorAll(".branch-btn");

  const savedBranch = (() => {
    try {
      return localStorage.getItem(BRANCH_KEY) || "main";
    } catch (_e) {
      return "main";
    }
  })();

  branchBtns.forEach((btn) => {
    const b = btn.dataset.branch;
    btn.setAttribute("aria-pressed", b === savedBranch ? "true" : "false");
    btn.addEventListener("click", () => {
      try {
        localStorage.setItem(BRANCH_KEY, b);
      } catch (_e) {
        // Ignore storage failures in private/locked contexts.
      }
      branchBtns.forEach((x) =>
        x.setAttribute(
          "aria-pressed",
          x.dataset.branch === b ? "true" : "false",
        ),
      );
      document.dispatchEvent(
        new CustomEvent("ag:branch-changed", { detail: { branch: b } }),
      );
    });
  });

  /* ── Search palette wiring ──────────────────── */
  document
    .getElementById("search-btn-mobile")
    ?.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("ag:open-search"));
    });
  document.querySelector(".search-trigger")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("ag:open-search"));
  });

  /* ── ⌘K / Ctrl+K ───────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent("ag:open-search"));
    }
  });

  /* ── Keyboard hint (Mac vs PC) ──────────────── */
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);
  document.querySelectorAll(".search-kbd-hint").forEach((el) => {
    el.textContent = isMac ? "⌘K" : "Ctrl K";
  });
});
