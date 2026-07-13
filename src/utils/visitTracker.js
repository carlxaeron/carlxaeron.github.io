import { mapping } from "../mapping";

const VISITOR_KEY = "cm_visitor_id";
const SESSION_KEY = "cm_session_id";
const lastSent = new Map();

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateId(storageKey, useSession) {
  const store = useSession ? sessionStorage : localStorage;
  let id = store.getItem(storageKey);
  if (!id) {
    id = createId();
    store.setItem(storageKey, id);
  }
  return id;
}

export function getVisitClientMeta() {
  if (typeof window === "undefined") {
    return {
      path: "",
      referrer: "",
      userAgent: "",
      language: "",
      screen: { width: 0, height: 0 },
      viewport: { width: 0, height: 0 },
    };
  }

  return {
    path: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    referrer: document.referrer || "",
    userAgent: navigator.userAgent || "",
    language: navigator.language || "",
    screen: {
      width: window.screen?.width || 0,
      height: window.screen?.height || 0,
    },
    viewport: {
      width: window.innerWidth || 0,
      height: window.innerHeight || 0,
    },
  };
}

function shouldSkipDuplicate(key) {
  const now = Date.now();
  const last = lastSent.get(key) || 0;
  if (now - last < 5000) return true;
  lastSent.set(key, now);
  return false;
}

export function trackVisit({ eventType, section = null, previewSlug = null } = {}) {
  if (process.env.NODE_ENV === "development") return;

  const endpoint = mapping.trackVisit;
  if (!endpoint || typeof window === "undefined") return;

  const dedupeKey = `${eventType}:${section || ""}:${previewSlug || ""}`;
  if (shouldSkipDuplicate(dedupeKey)) return;

  const payload = {
    visitorId: getOrCreateId(VISITOR_KEY, false),
    sessionId: getOrCreateId(SESSION_KEY, true),
    eventType: eventType || "pageview",
    section,
    previewSlug,
    ...getVisitClientMeta(),
  };

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
