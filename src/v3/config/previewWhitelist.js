/**
 * Whitelist for ?preview= portfolio showcase iframes.
 * Public URLs use short slugs: ?preview=jk-construction
 * Legacy full hostnames (?preview=*.netlify.app) still resolve for backward compatibility.
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
  {
    id: "machinemate",
    host: "machinemate-engineering.netlify.app",
    label: "Machinemate Mainteneering Services",
    netlifySite: "machinemate-engineering",
  },
  {
    id: "jazz1-aircon",
    host: "jazz1-aircon-services.netlify.app",
    label: "Jazz1 Airconditioning Services",
    netlifySite: "jazz1-aircon-services",
  },
  {
    id: "clover-industrial-fan",
    host: "clover-industrial-fan.netlify.app",
    label: "Clover Industrial Fan and Blower Inc.",
    netlifySite: "clover-industrial-fan",
  },
  {
    id: "g3k-cad",
    host: "g3k-cad-plotting.netlify.app",
    label: "G3k Cad Plotting & Blueprinting Services",
    netlifySite: "g3k-cad-plotting",
  },
  {
    id: "kubling-tago-resort",
    host: "kubling-tago-resort.netlify.app",
    label: "Kubling Tago Resort",
    netlifySite: "kubling-tago-resort",
  },
  {
    id: "regan-industrial",
    host: "regan-industrial.netlify.app",
    label: "Regan Industrial Sales Inc.",
    netlifySite: "regan-industrial",
  },
  {
    id: "intellismart",
    host: "intellismartinc.netlify.app",
    label: "IntelliSmart Technology Inc.",
    netlifySite: "intellismartinc",
  },
  {
    id: "sv-more-group",
    host: "sv-more-group.netlify.app",
    label: "SV More Group of Companies",
    netlifySite: "sv-more-group",
  },
  {
    id: "trumed-pharma",
    host: "trumed-pharma.netlify.app",
    label: "Trumed Pharmaceuticals",
    netlifySite: "trumed-pharma",
  },
  {
    id: "dn-group",
    host: "dn-group.netlify.app",
    label: "DN Group of Companies",
    netlifySite: "dn-group",
  },
  {
    id: "alibaton-construction",
    host: "alibaton-construction.netlify.app",
    label: "Alibaton Construction Inc.",
    netlifySite: "alibaton-construction",
  },
  {
    id: "fastpoint-ph",
    host: "fastpoint-ph.netlify.app",
    label: "Fastpoint PH",
    netlifySite: "fastpoint-ph",
  },
  {
    id: "archipelago-builders",
    host: "archipelago-builders.netlify.app",
    label: "Archipelago Builders Corporation",
    netlifySite: "archipelago-builders",
  },
  {
    id: "hvill-hospital",
    host: "hvill-hospital.netlify.app",
    label: "H Vill Hospital",
    netlifySite: "hvill-hospital",
  },
  {
    id: "san-mateo-medical-center",
    host: "san-mateo-medical-center.netlify.app",
    label: "San Mateo Medical Center",
    netlifySite: "san-mateo-medical-center",
  },
  {
    id: "villa-clara-pool",
    host: "villa-clara-pool.netlify.app",
    label: "Villa Clara Pool & Venue",
    netlifySite: "villa-clara-pool",
  },
  {
    id: "costa-abril",
    host: "costa-abril.netlify.app",
    label: "Costa Abril Resort",
    netlifySite: "costa-abril",
  },
  {
    id: "air-alex-resort",
    host: "air-alex-resort.netlify.app",
    label: "Airalex Private Lodge & Resort",
    netlifySite: "air-alex-resort",
  },
  {
    id: "casa-de-gloria",
    host: "casa-de-gloria.netlify.app",
    label: "Casa De Gloria Private Resort",
    netlifySite: "casa-de-gloria",
  },
  {
    id: "casa-angelina",
    host: "casa-angelina.netlify.app",
    label: "Casa Angelina Resort",
    netlifySite: "casa-angelina",
  },
  {
    id: "bernardino-general-hospital",
    host: "bernardino-general-hospital.netlify.app",
    label: "Bernardino General Hospital",
    netlifySite: "bernardino-general-hospital",
  },
  {
    id: "pgmc",
    host: "pacific-global-medical-center.netlify.app",
    label: "Pacific Global Medical Center",
    netlifySite: "pacific-global-medical-center",
  },
  {
    id: "novagen",
    host: "novagen-hospital.netlify.app",
    label: "NovaGen — Novaliches General Hospital and Medical Center",
    netlifySite: "novagen-hospital",
  },
  {
    id: "fairview-general-hospital",
    host: "fairview-general-hospital.netlify.app",
    label: "Fairview General Hospital Inc.",
    netlifySite: "fairview-general-hospital",
  },
  {
    id: "mphs-fairview",
    host: "mphs-fairview.netlify.app",
    label: "MPHS Mother of Perpetual Help Inc. Fairview",
    netlifySite: "mphs-fairview",
  },
  {
    id: "amora-body-wellness-spa",
    host: "amora-body-wellness-spa.netlify.app",
    label: "Amora Body Wellness Spa",
    netlifySite: "amora-body-wellness-spa",
  },
  {
    id: "taguig-city-general-hospital",
    host: "taguig-city-general-hospital.netlify.app",
    label: "Taguig City General Hospital",
    netlifySite: "taguig-city-general-hospital",
  },
  {
    id: "the-lakehouse-taguig",
    host: "the-lakehouse-taguig.netlify.app",
    label: "The Lakehouse Taguig",
    netlifySite: "the-lakehouse-taguig",
  },
  {
    id: "journey-woodblock-ph",
    host: "journey-woodblock-ph.netlify.app",
    label: "Journey Woodblock Modular Cabinets",
    netlifySite: "journey-woodblock-ph",
  },
  {
    id: "cardinal-santos",
    host: "cardinal-santos.netlify.app",
    label: "Cardinal Santos Medical Center",
    netlifySite: "cardinal-santos",
  },
  {
    id: "st-lukes",
    host: "st-lukes.netlify.app",
    label: "St. Luke's Medical Center",
    netlifySite: "st-lukes",
  },
  {
    id: "grand-hyatt-manila",
    host: "grand-hyatt-manila.netlify.app",
    label: "Grand Hyatt Manila",
    netlifySite: "grand-hyatt-manila",
  },
  {
    id: "lucky-drive-inn",
    host: "lucky-drive-inn.netlify.app",
    label: "Lucky Drive Inn Hotel",
    netlifySite: "lucky-drive-inn",
  },
  {
    id: "merlitas-private-resort",
    host: "merlitas-private-resort.netlify.app",
    label: "Merlita's Private Resort",
    netlifySite: "merlitas-private-resort",
  },
  {
    id: "cj-resort",
    host: "cj-gomez-private-resort.netlify.app",
    label: "CJ Gomez Private Resort",
    netlifySite: "cj-gomez-private-resort",
  },
];

const NETLIFY_HOST_PATTERN = /^[a-z0-9][a-z0-9-]*\.netlify\.app$/i;
const PREVIEW_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/i;

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

function findPreviewSiteByHost(host) {
  return PREVIEW_SITES.find((site) => site.host.toLowerCase() === host) ?? null;
}

function findPreviewSiteByKey(key) {
  if (!key || typeof key !== "string") return null;
  const normalized = key.trim().toLowerCase();
  if (!normalized) return null;

  return (
    PREVIEW_SITES.find(
      (site) =>
        site.id.toLowerCase() === normalized ||
        site.netlifySite.toLowerCase() === normalized ||
        site.host.toLowerCase() === normalized
    ) ?? null
  );
}

export function buildPreviewPortfolioUrl(slugOrSite) {
  const site = findPreviewSiteByKey(slugOrSite);
  const slug = site?.id ?? String(slugOrSite || "").trim().toLowerCase();
  if (!slug) return null;
  return `https://carlmanuel.com/?preview=${slug}`;
}

export function isPreviewHostAllowed(raw) {
  return Boolean(resolvePreviewUrl(raw));
}

/**
 * @param {string} rawQueryValue - value of ?preview= (slug or legacy hostname)
 * @returns {{ url: string, host: string, slug: string, site: object | null } | null}
 */
export function resolvePreviewUrl(rawQueryValue) {
  const raw = rawQueryValue?.trim();
  if (!raw) return null;

  const asHost = normalizeHostname(raw);
  if (asHost && isPreviewHostAllowedInternal(asHost)) {
    const site = findPreviewSiteByHost(asHost);
    return {
      url: `https://${asHost}`,
      host: asHost,
      slug: site?.id ?? asHost.replace(/\.netlify\.app$/i, ""),
      site,
    };
  }

  if (PREVIEW_SLUG_PATTERN.test(raw)) {
    const site = findPreviewSiteByKey(raw);
    if (site) {
      return {
        url: `https://${site.host}`,
        host: site.host,
        slug: site.id,
        site,
      };
    }
  }

  return null;
}

function isPreviewHostAllowedInternal(host) {
  return isNetlifyAppHost(host) || Boolean(findPreviewSiteByHost(host));
}

export function getPreviewQueryFromSearch(search = "") {
  if (typeof window !== "undefined" && !search) {
    return new URLSearchParams(window.location.search).get("preview");
  }
  return new URLSearchParams(search).get("preview");
}
