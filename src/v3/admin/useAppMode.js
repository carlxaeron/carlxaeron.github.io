import { useEffect, useState } from "react";

/**
 * @param {string} [search]
 * @returns {string | null}
 */
export function getSignTokenFromSearch(search = "") {
  if (typeof window !== "undefined" && !search) {
    return new URLSearchParams(window.location.search).get("sign");
  }
  const token = new URLSearchParams(search).get("sign");
  return token && String(token).trim() ? String(token).trim() : null;
}

/**
 * @returns {'portfolio' | 'login' | 'admin' | 'sign'}
 */
export function getAppMode() {
  if (typeof window === "undefined") return "portfolio";

  const path = (window.location.pathname || "/").replace(/\/$/, "") || "/";
  const hash = (window.location.hash || "").replace(/^#/, "").toLowerCase().split("?")[0];

  if (path === "/login" || hash === "login") return "login";
  if (path === "/admin" || hash === "admin") return "admin";
  if (getSignTokenFromSearch(window.location.search)) return "sign";
  return "portfolio";
}

export function useAppMode() {
  const [mode, setMode] = useState(() => getAppMode());

  useEffect(() => {
    const sync = () => setMode(getAppMode());
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  return mode;
}

export function navigateToAdmin() {
  if (window.location.pathname === "/login") {
    window.location.href = "/admin";
    return;
  }
  window.location.hash = "admin";
}

export function navigateToLogin() {
  if (window.location.pathname === "/admin") {
    window.location.href = "/login";
    return;
  }
  window.location.hash = "login";
}
