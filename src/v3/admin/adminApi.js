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
