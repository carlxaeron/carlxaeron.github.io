import { useEffect, useState } from "react";

/**
 * @returns {'portfolio' | 'login' | 'admin'}
 */
export function getAppMode() {
  if (typeof window === "undefined") return "portfolio";

  const path = (window.location.pathname || "/").replace(/\/$/, "") || "/";
  const hash = (window.location.hash || "").replace(/^#/, "").toLowerCase().split("?")[0];

  if (path === "/login" || hash === "login") return "login";
  if (path === "/admin" || hash === "admin") return "admin";
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
