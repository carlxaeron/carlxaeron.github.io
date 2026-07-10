/**
 * Whitelist for ?preview= portfolio showcase iframes.
 * Only *.netlify.app hosts or explicit PREVIEW_SITES entries are allowed.
 */

export const PREVIEW_SITES = [
  {
    id: "quotation",
    host: "quotation.netlify.app",
    label: "Sample Business Quotation Site",
    netlifySite: "quotation",
  },
];

const NETLIFY_HOST_PATTERN = /^[a-z0-9][a-z0-9-]*\.netlify\.app$/i;

function normalizeHostname(raw) {
  if (!raw || typeof raw !== "string") return null;

  let value = raw.trim();
  if (!value) return null;

  try {
    if (value.includes("://")) {
      value = new URL(value).hostname;
    } else if (value.includes("/")) {
      value = new URL(`https://${value}`).hostname;
    }
  } catch {
    return null;
  }

  value = value.toLowerCase().replace(/\.$/, "");
  if (!value || value.includes("/") || value.includes(" ")) return null;

  return value;
}

function isNetlifyAppHost(host) {
  return NETLIFY_HOST_PATTERN.test(host);
}

function findPreviewSite(host) {
  return PREVIEW_SITES.find((site) => site.host.toLowerCase() === host) ?? null;
}

export function isPreviewHostAllowed(host) {
  const normalized = normalizeHostname(host);
  if (!normalized) return false;
  return isNetlifyAppHost(normalized) || Boolean(findPreviewSite(normalized));
}

/**
 * @param {string} rawQueryValue - value of ?preview=
 * @returns {{ url: string, host: string, site: object | null } | null}
 */
export function resolvePreviewUrl(rawQueryValue) {
  const host = normalizeHostname(rawQueryValue);
  if (!host || !isPreviewHostAllowed(host)) {
    return null;
  }

  return {
    url: `https://${host}`,
    host,
    site: findPreviewSite(host),
  };
}

export function getPreviewQueryFromSearch(search = "") {
  if (typeof window !== "undefined" && !search) {
    return new URLSearchParams(window.location.search).get("preview");
  }
  return new URLSearchParams(search).get("preview");
}
