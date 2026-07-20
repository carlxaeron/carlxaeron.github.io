import { mapping } from "../../mapping";
import { clearAdminToken, getAdminToken } from "./adminAuth";

export class AdminAuthError extends Error {
  constructor(message = "Session expired. Please sign in again.") {
    super(message);
    this.name = "AdminAuthError";
  }
}

export function parseApiData(json) {
  if (json?.status === 200 && json.data !== undefined) return json.data;
  if (json?.data !== undefined) return json.data;
  return json;
}

export function parsePaginatedList(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  const envelope = raw.status === 200 && raw.data !== undefined ? raw.data : raw;

  if (Array.isArray(envelope)) return { rows: envelope, meta: null };
  if (Array.isArray(envelope?.data)) {
    return {
      rows: envelope.data,
      meta: {
        currentPage: envelope.current_page ?? envelope.currentPage ?? 1,
        lastPage: envelope.last_page ?? envelope.lastPage ?? 1,
        total: envelope.total ?? envelope.data.length,
      },
    };
  }
  if (Array.isArray(envelope?.items)) {
    return { rows: envelope.items, meta: envelope.meta ?? null };
  }
  return { rows: [], meta: null };
}

export async function adminFetch(url, options = {}) {
  const token = getAdminToken();
  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearAdminToken();
    throw new AdminAuthError();
  }

  if (!res.ok) {
    const message =
      json.message ||
      json.error ||
      (json.errors && Object.values(json.errors).flat?.()[0]) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return parseApiData(json);
}

export function fetchAdminSummary() {
  return adminFetch(mapping.adminSummary, { cache: "no-store" });
}

/**
 * @param {number} [days=30]
 */
export function fetchAdminAnalytics(days = 30) {
  const range = [7, 14, 30, 90].includes(Number(days)) ? Number(days) : 30;
  return adminFetch(`${mapping.adminAnalytics}?days=${range}`, { cache: "no-store" });
}

/**
 * @param {{ days?: number, page?: number, perPage?: number, eventType?: string, device?: string }} [opts]
 */
export function fetchAdminAnalyticsVisits(opts = {}) {
  const days = [7, 14, 30, 90].includes(Number(opts.days)) ? Number(opts.days) : 30;
  const page = Math.max(1, Number(opts.page) || 1);
  const perPage = Math.min(50, Math.max(1, Number(opts.perPage) || 25));
  const params = new URLSearchParams({
    days: String(days),
    page: String(page),
    perPage: String(perPage),
  });
  if (opts.eventType) params.set("eventType", opts.eventType);
  if (opts.device) params.set("device", opts.device);
  return adminFetch(`${mapping.adminAnalyticsVisits}?${params}`, { cache: "no-store" });
}

export function fetchAdminContacts(page = 1) {
  return adminFetch(`${mapping.adminContacts}?page=${page}`, { cache: "no-store" });
}

export function fetchAdminQuotations(page = 1) {
  return adminFetch(`${mapping.adminQuotations}?page=${page}`, { cache: "no-store" });
}

export function fetchAdminOutreach() {
  return adminFetch(mapping.adminOutreach, { cache: "no-store" });
}

export function pauseAdminOutreach({ slug, contactEmail }) {
  const body = { slug };
  if (contactEmail) body.contactEmail = contactEmail;

  return adminFetch(mapping.adminOutreachPause, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchAdminContent(section) {
  return adminFetch(`${mapping.adminContent}/${encodeURIComponent(section)}`, {
    cache: "no-store",
  });
}

export function saveAdminContent(section, content) {
  return adminFetch(`${mapping.adminContent}/${encodeURIComponent(section)}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export function fetchPushVapidPublicKey() {
  return adminFetch(mapping.adminPushVapidPublicKey, { cache: "no-store" });
}

export function savePushSubscription({ endpoint, keys, userAgent }) {
  const body = { endpoint, keys };
  if (userAgent) body.userAgent = userAgent;

  return adminFetch(mapping.adminPushSubscribe, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function removePushSubscription(endpoint) {
  return adminFetch(mapping.adminPushSubscribe, {
    method: "DELETE",
    body: JSON.stringify({ endpoint }),
  });
}

export function sendPushTest() {
  return adminFetch(mapping.adminPushTest, {
    method: "POST",
  });
}

/**
 * @param {{ slug?: string, status?: string, perPage?: number }} [params]
 */
export function fetchAdminAgreements(params = {}) {
  const query = new URLSearchParams();
  if (params.slug) query.set("slug", params.slug);
  if (params.status) query.set("status", params.status);
  if (params.perPage) query.set("perPage", String(params.perPage));
  const qs = query.toString();
  return adminFetch(`${mapping.adminAgreements}${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
}

export function fetchAdminAgreement(id) {
  return adminFetch(`${mapping.adminAgreements}/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
}

/**
 * @param {{
 *   slug: string,
 *   businessName: string,
 *   clientEmail: string,
 *   clientName?: string,
 *   formJson?: Record<string, unknown>,
 *   filledHtml: string,
 * }} payload
 */
export function createAdminAgreement(payload) {
  return adminFetch(mapping.adminAgreements, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resendAdminAgreement(id) {
  return adminFetch(`${mapping.adminAgreements}/${encodeURIComponent(id)}/resend`, {
    method: "POST",
  });
}

export function revokeAdminAgreement(id) {
  return adminFetch(`${mapping.adminAgreements}/${encodeURIComponent(id)}/revoke`, {
    method: "POST",
  });
}

/** Open = can still resend / revoke (not signed / revoked / expired). */
export function isOpenAgreementStatus(status) {
  return ["draft", "sent", "viewed"].includes(String(status || "").toLowerCase());
}

/**
 * Pick the newest open agreement from a list/index payload.
 * @param {unknown} payload
 */
export function pickOpenAgreement(payload) {
  const { rows } = parsePaginatedList(payload);
  return rows.find((row) => isOpenAgreementStatus(row?.status)) || null;
}
