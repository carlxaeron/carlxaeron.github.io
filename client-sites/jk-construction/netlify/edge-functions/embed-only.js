/**
 * Embed-only + one-time unlock (strict).
 *
 * Allows: portfolio iframe embeds (Sec-Fetch-Dest: iframe or allowlisted Referer).
 * One-shot: ?access=TOKEN → POST api.carlmanuel.com/previewAccess/redeem with
 *   X-Preview-Access-Secret from Netlify env PREVIEW_ACCESS_SECRET.
 * On ok: serve page + Set-Cookie cm_unlock=1 (Max-Age=30). Edge IGNORES this cookie
 * on later requests — refresh / reused link / other HTML pages → lock screen.
 *
 * Netlify: set PREVIEW_ACCESS_SECRET (Functions scope) to match API .env; redeploy
 * after changing the secret or copying this file from _template.
 */

const ALLOWED_PARENTS = [
  "carlmanuel.com",
  "www.carlmanuel.com",
  "carlxaeron.github.io",
  "localhost",
];

const API_BASE = "https://api.carlmanuel.com";
const UNLOCK_COOKIE = "cm_unlock=1; Max-Age=30; Path=/; SameSite=Lax";

function hasAllowedReferrer(request) {
  const referer = request.headers.get("referer") || "";
  return ALLOWED_PARENTS.some((host) => referer.includes(host));
}

function isProtectedPage(pathname) {
  if (pathname === "/" || pathname === "/index.html") return true;
  if (pathname.endsWith(".html")) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  return false;
}

function scopeFromPath(pathname) {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  return "site";
}

function slugFromHost(host) {
  const h = String(host || "")
    .toLowerCase()
    .split(":")[0];
  if (h.endsWith(".netlify.app")) {
    return h.slice(0, -".netlify.app".length);
  }
  return "";
}

function lockHtml({ host, slug, token }) {
  const notifyUrl = `${API_BASE}/previewAccess/requestUnlock`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview locked</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: Inter, system-ui, sans-serif; background: #00473e; color: #fff; padding: 24px; text-align: center; }
    .wrap { max-width: 28rem; }
    h1 { font-size: 1.35rem; font-weight: 600; margin: 0 0 12px; }
    p { line-height: 1.6; margin: 0 0 16px; color: #D4E9E2; }
    button { appearance: none; border: 0; cursor: pointer; font: inherit; font-weight: 600;
      background: #00A862; color: #fff; padding: 12px 20px; border-radius: 8px; }
    button:disabled { opacity: 0.65; cursor: default; }
    .status { margin-top: 14px; min-height: 1.4em; font-size: 0.95rem; color: #CBA258; }
    a { color: #00A862; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>This one-time preview link is closed</h1>
    <p>Each magic link opens the demo once. Refresh, reuse, or opening another page locks it again.</p>
    <p>Need another look? Notify Carl — he can send a fresh link.</p>
    <button type="button" id="notify-btn">Notify Carl</button>
    <p class="status" id="notify-status" role="status" aria-live="polite"></p>
    <p>Or view samples via <a href="https://carlmanuel.com">carlmanuel.com</a>.</p>
  </div>
  <script>
(function () {
  var btn = document.getElementById("notify-btn");
  var statusEl = document.getElementById("notify-status");
  if (!btn) return;
  btn.addEventListener("click", function () {
    btn.disabled = true;
    statusEl.textContent = "Sending…";
    var body = {
      host: ${JSON.stringify(String(host || ""))},
      slug: ${JSON.stringify(String(slug || ""))},
      token: ${JSON.stringify(String(token || ""))},
      message: "Prospect requested another one-time unlock from the lock page."
    };
    fetch(${JSON.stringify(notifyUrl)}, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) throw new Error("request failed");
      return res.json().catch(function () { return {}; });
    }).then(function (data) {
      if (data && data.ok === false) throw new Error("denied");
      statusEl.textContent = "Sent — Carl will follow up with a new link.";
    }).catch(function () {
      statusEl.textContent = "Could not send. Email info@carlmanuel.com or try again.";
      btn.disabled = false;
    });
  });
})();
  </script>
</body>
</html>`;
}

function lockResponse(url, token) {
  const host = url.host;
  const html = lockHtml({
    host,
    slug: slugFromHost(host),
    token,
  });
  return new Response(html, {
    status: 403,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function redeemAccess(url, token) {
  let secret;
  try {
    secret = Netlify.env.get("PREVIEW_ACCESS_SECRET");
  } catch (_) {
    secret = undefined;
  }
  if (!secret) return false;

  const host = url.host;
  const path = url.pathname;
  const scope = scopeFromPath(path);

  try {
    const res = await fetch(`${API_BASE}/previewAccess/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Preview-Access-Secret": secret,
      },
      body: JSON.stringify({ token, host, scope, path }),
    });
    if (!res.ok) return false;
    const data = await res.json().catch(() => ({}));
    if (data && typeof data.ok === "boolean") return data.ok === true;
    return true;
  } catch (_) {
    return false;
  }
}

async function withUnlockCookie(response) {
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", UNLOCK_COOKIE);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async (request, context) => {
  const fetchDest = request.headers.get("sec-fetch-dest");
  const url = new URL(request.url);

  if (!isProtectedPage(url.pathname)) {
    return context.next();
  }

  if (fetchDest === "iframe") {
    return context.next();
  }

  if (fetchDest === "document" || !fetchDest) {
    // Portfolio embed path (unchanged) — do not consume access tokens here.
    if (hasAllowedReferrer(request)) {
      return context.next();
    }

    // Strict: ignore cm_unlock cookie. Only an unused ?access= redeem unlocks.
    const accessToken = (url.searchParams.get("access") || "").trim();
    if (accessToken) {
      const ok = await redeemAccess(url, accessToken);
      if (ok) {
        const response = await context.next();
        return withUnlockCookie(response);
      }
      return lockResponse(url, accessToken);
    }

    return lockResponse(url, null);
  }

  return context.next();
};

