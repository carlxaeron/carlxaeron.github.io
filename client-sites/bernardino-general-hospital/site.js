/**
 * Shared interactive behaviors for client quotation sites.
 * Mobile nav, scroll reveal, accordions, tabs, sticky header.
 */
(function () {
  "use strict";

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const panel = document.querySelector("[data-mobile-nav]");
    if (!toggle || !panel) return;

    const close = () => {
      panel.classList.add("hidden");
      panel.classList.remove("flex");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("hidden", !open);
      panel.classList.toggle("flex", open);
      document.body.classList.toggle("overflow-hidden", open);
    });

    panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initHeaderScroll() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", id);
      });
    });
  }

  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
      observer.observe(el);
    });
  }

  function initAccordion() {
    document.querySelectorAll("[data-accordion]").forEach((root) => {
      root.querySelectorAll("[data-accordion-trigger]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = btn.closest("[data-accordion-item]");
          const panel = item?.querySelector("[data-accordion-panel]");
          if (!item || !panel) return;

          const isOpen = btn.getAttribute("aria-expanded") === "true";
          root.querySelectorAll("[data-accordion-item]").forEach((sibling) => {
            const t = sibling.querySelector("[data-accordion-trigger]");
            const p = sibling.querySelector("[data-accordion-panel]");
            if (!t || !p) return;
            t.setAttribute("aria-expanded", "false");
            p.classList.add("hidden");
            p.classList.remove("block");
          });

          if (!isOpen) {
            btn.setAttribute("aria-expanded", "true");
            panel.classList.remove("hidden");
            panel.classList.add("block");
          }
        });
      });
    });
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((root) => {
      const buttons = root.querySelectorAll("[data-tab]");
      const panels = root.querySelectorAll("[data-tab-panel]");
      if (!buttons.length || !panels.length) return;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.getAttribute("data-tab");
          buttons.forEach((b) => {
            const active = b.getAttribute("data-tab") === target;
            b.setAttribute("aria-selected", active ? "true" : "false");
            b.classList.toggle("tab-active", active);
            b.classList.toggle("tab-inactive", !active);
          });
          panels.forEach((panel) => {
            const show = panel.getAttribute("data-tab-panel") === target;
            panel.classList.toggle("hidden", !show);
            panel.classList.toggle("block", show);
          });
        });
      });
    });
  }

  function initFilter() {
    document.querySelectorAll("[data-filter]").forEach((root) => {
      const buttons = root.querySelectorAll("[data-filter-btn]");
      const items = document.querySelectorAll("[data-filter-item]");
      if (!buttons.length || !items.length) return;

      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const value = btn.getAttribute("data-filter-btn");
          buttons.forEach((b) => {
            const active = b === btn;
            b.setAttribute("aria-pressed", active ? "true" : "false");
            b.classList.toggle("filter-active", active);
            b.classList.toggle("filter-inactive", !active);
          });
          items.forEach((item) => {
            const cats = (item.getAttribute("data-categories") || "").split(",");
            const show = value === "all" || cats.includes(value);
            item.classList.toggle("hidden", !show);
            item.classList.toggle("block", show);
            if (show) item.classList.add("is-visible");
          });
        });
      });
    });
  }

  function init() {
    initYear();
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initReveal();
    initAccordion();
    initTabs();
    initFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
