const API_BASE = "";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    const message = Array.isArray(detail)
      ? detail.map((d) => d.msg || String(d)).join("; ")
      : detail || res.statusText || "Request failed";
    throw new Error(message);
  }
  if (res.status === 204) return null;
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) return res.json();
  return res;
}

export const api = {
  meta: () => request("/api/meta"),
  listApplications: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    const query = qs.toString();
    return request(`/api/applications${query ? `?${query}` : ""}`);
  },
  getApplication: (id) => request(`/api/applications/${encodeURIComponent(id)}`),
  patchApplication: (id, body) =>
    request(`/api/applications/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  getSubmission: (id) =>
    request(`/api/applications/${encodeURIComponent(id)}/submission`),
  createApplication: (body) =>
    request("/api/applications", { method: "POST", body: JSON.stringify(body) }),
  uploadCv: (id) =>
    request(`/api/applications/${encodeURIComponent(id)}/upload-cv`, {
      method: "POST",
    }),
  search: (body) =>
    request("/api/search", { method: "POST", body: JSON.stringify(body) }),
  cvDownloadUrl: (id) =>
    `/api/applications/${encodeURIComponent(id)}/cv`,
};

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}
