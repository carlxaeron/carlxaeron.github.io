import { mapping } from "../../mapping";

export const ADMIN_TOKEN_KEY = "admin.sanctum.token";

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminToken(token) {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // sessionStorage unavailable (SSR/tests)
  }
}

export function clearAdminToken() {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // ignore
  }
}

/** Accept common Laravel Sanctum / SPA token response shapes. */
export function extractTokenFromResponse(json) {
  if (!json || typeof json !== "object") return null;
  if (typeof json.token === "string" && json.token) return json.token;
  if (typeof json.access_token === "string" && json.access_token) return json.access_token;
  if (json.data && typeof json.data === "object") {
    if (typeof json.data.token === "string" && json.data.token) return json.data.token;
    if (typeof json.data.access_token === "string" && json.data.access_token) {
      return json.data.access_token;
    }
  }
  return null;
}

export async function adminLogin(email, password) {
  const res = await fetch(mapping.adminLogin, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 429) {
      throw new Error("Too many sign-in attempts. Wait a few minutes and try again.");
    }
    const message =
      json.message ||
      json.error ||
      (json.errors && Object.values(json.errors).flat?.()[0]) ||
      "Invalid email or password.";
    throw new Error(message);
  }

  const token = extractTokenFromResponse(json);
  if (!token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  setAdminToken(token);
  return token;
}

export async function adminLogout() {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch(mapping.adminLogout, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // clear local session even if revoke fails
    }
  }
  clearAdminToken();
}
