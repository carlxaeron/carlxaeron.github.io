import { mapping } from "../mapping";

const VISITOR_KEY = "cm_visitor_id";
const SESSION_KEY = "cm_session_id";
const EXCLUDE_KEY = "cm_analytics_exclude";
const lastSent = new Map();

/** Permanent owner opt-out — set via ?no_track=1 once per browser. */
export function isAnalyticsExcluded() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(EXCLUDE_KEY) === "1";
}

export function enableAnalyticsExclude() {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXCLUDE_KEY, "1");
}

/** Visit carlmanuel.com/?no_track=1 once to stop preview analytics on this browser. */
export function applyOwnerExcludeFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  if (params.get("no_track") !== "1") return;

  enableAnalyticsExclude();
  params.delete("no_track");
  const qs = params.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", next);
}

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

export function getVisitorContext() {
  if (typeof window === "undefined") {
    return { visitorId: "", sessionId: "" };
  }
  return {
    visitorId: getOrCreateId(VISITOR_KEY, false),
    sessionId: getOrCreateId(SESSION_KEY, true),
  };
}

export function feedbackStorageKey(previewSlug) {
  return `cm_feedback_${previewSlug}`;
}

export function hasSubmittedFeedback(previewSlug) {
  if (typeof window === "undefined" || !previewSlug) return false;
  return localStorage.getItem(feedbackStorageKey(previewSlug)) === "1";
}

export function markFeedbackSubmitted(previewSlug) {
  if (typeof window === "undefined" || !previewSlug) return;
  localStorage.setItem(feedbackStorageKey(previewSlug), "1");
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
  if (isAnalyticsExcluded()) return;

  const endpoint = mapping.trackVisit;
  if (!endpoint || typeof window === "undefined") return;

  const dedupeKey = `${eventType}:${section || ""}:${previewSlug || ""}`;
  if (shouldSkipDuplicate(dedupeKey)) return;

  const payload = {
    ...getVisitorContext(),
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
