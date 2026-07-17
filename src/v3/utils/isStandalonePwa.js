/**
 * True when the site is running as an installed PWA (home screen / standalone).
 * Covers Chromium `display-mode: standalone` and iOS Safari `navigator.standalone`.
 */
export function isStandalonePwa() {
  if (typeof window === "undefined") return false;

  try {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(display-mode: standalone)").matches
    ) {
      return true;
    }
  } catch {
    // matchMedia may throw in some environments
  }

  return window.navigator?.standalone === true;
}
