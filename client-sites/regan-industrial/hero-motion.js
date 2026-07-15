/**
 * Hero entrance animations via Motion (Framer Motion family).
 * Vanilla ESM — no React/build step. Scope: [data-hero] first section only.
 * Docs: https://motion.dev/docs/quick-start
 */
import { animate, stagger, hover } from "https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm";

const hero = document.querySelector("[data-hero]");
if (hero) {
  const items = hero.querySelectorAll("[data-hero-animate]");
  const bg = hero.querySelector("[data-hero-bg]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    items.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    if (bg) {
      bg.style.opacity = "1";
      bg.style.transform = "none";
    }
  } else {
    if (bg) {
      animate(
        bg,
        { opacity: [0.55, 1], scale: [1.08, 1] },
        { duration: 1.15, easing: [0.22, 1, 0.36, 1] }
      );
    }

    if (items.length) {
      animate(
        items,
        { opacity: [0, 1], y: [28, 0] },
        {
          delay: stagger(0.11, { startDelay: 0.15 }),
          duration: 0.7,
          easing: [0.22, 1, 0.36, 1],
        }
      );
    }

    hero.querySelectorAll("[data-hero-cta]").forEach((cta) => {
      hover(cta, (element) => {
        animate(element, { scale: 1.04 }, { duration: 0.2, easing: "ease-out" });
        return () => animate(element, { scale: 1 }, { duration: 0.2, easing: "ease-out" });
      });
    });
  }
}
