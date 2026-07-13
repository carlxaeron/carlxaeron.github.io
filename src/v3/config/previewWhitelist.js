/**
 * Whitelist for ?preview= portfolio showcase iframes.
 * Only *.netlify.app hosts or explicit PREVIEW_SITES entries are allowed.
 */

export const PREVIEW_SITES = [
  {
    id: "quotation",
    host: "bamboo-grove-cafe.netlify.app",
    label: "Bamboo Grove Café — Sample Quotation Site",
    netlifySite: "bamboo-grove-cafe",
  },
  {
    id: "extra-rice",
    host: "extra-rice-trading.netlify.app",
    label: "Extra Rice 8 Trading, OPC",
    netlifySite: "extra-rice-trading",
  },
  {
    id: "ohana",
    host: "ohana-business-solutions.netlify.app",
    label: "Ohana Business Solutions Inc",
    netlifySite: "ohana-business-solutions",
  },
  {
    id: "suyat",
    host: "suyat-notary-public.netlify.app",
    label: "Suyat Notary Public",
    netlifySite: "suyat-notary-public",
  },
  {
    id: "rg-decals",
    host: "rg-decals-printing.netlify.app",
    label: "RG Decals and Printing Shop",
    netlifySite: "rg-decals-printing",
  },
  {
    id: "sonyoba-marketing",
    host: "sonyoba-marketing.netlify.app",
    label: "Sonyoba Marketing",
    netlifySite: "sonyoba-marketing",
  },
  {
    id: "jk-construction",
    host: "jk-construction-services.netlify.app",
    label: "JK Construction Services",
    netlifySite: "jk-construction-services",
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
