/**
 * Google Places API (New) — prospect discovery helpers for local-business demos.
 * Env: GOOGLE_PLACE_API_KEY or GOOGLE_PLACES_API_KEY
 */

export const SEARCH_AREAS = [
  {
    id: "rodriguez",
    label: "Rodriguez, Rizal",
    center: { latitude: 14.7324, longitude: 121.1413 },
    radiusMeters: 12000,
  },
  {
    id: "manila",
    label: "Manila / Metro core",
    center: { latitude: 14.5995, longitude: 120.9842 },
    radiusMeters: 10000,
  },
];

/** Types we want for starter website demos (Places Table A). */
export const TARGET_TYPES = [
  "restaurant",
  "cafe",
  "bakery",
  "meal_takeaway",
  "lodging",
  "spa",
  "beauty_salon",
  "hair_salon",
  "dentist",
  "doctor",
  "hospital",
  "pharmacy",
  "car_repair",
  "car_wash",
  "store",
  "clothing_store",
  "furniture_store",
  "hardware_store",
  "electronics_store",
  "florist",
  "gym",
  "real_estate_agency",
  "travel_agency",
  "accounting",
  "lawyer",
  "veterinary_care",
  "laundry",
  "moving_company",
  "plumber",
  "electrician",
  "roofing_contractor",
  "general_contractor",
  "painter",
];

/** Government / public agencies — skip always. */
export const GOVERNMENT_TYPES = new Set([
  "local_government_office",
  "city_hall",
  "courthouse",
  "embassy",
  "fire_station",
  "police",
  "post_office",
  "school",
  "primary_school",
  "secondary_school",
  "university",
  "library",
  "museum",
  "cemetery",
  "place_of_worship",
  "church",
  "hindu_temple",
  "mosque",
  "synagogue",
]);

const GOV_NAME_RE =
  /\b(barangay|city hall|municipal|municipality|lgu|dswd|bir|pag-?ibig|sss|philhealth|dpwh|deped|dotr|doj|pnp|afp|government|gov\.?\s?ph|public school|national high)\b/i;

export function loadPlacesApiKey(env = process.env) {
  const key = String(env.GOOGLE_PLACE_API_KEY || env.GOOGLE_PLACES_API_KEY || "").trim();
  return key || null;
}

export function slugifyBusinessName(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function isGovernmentPlace(place) {
  const types = Array.isArray(place?.types) ? place.types : [];
  if (types.some((t) => GOVERNMENT_TYPES.has(t))) return true;
  const name = place?.displayName?.text || place?.name || "";
  return GOV_NAME_RE.test(name);
}

export function normalizeWebsite(uri) {
  if (!uri || typeof uri !== "string") return null;
  const trimmed = uri.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.href;
  } catch {
    return null;
  }
}

/**
 * Heuristic score 0–100. Higher = better demo prospect (weak/missing web presence).
 * @param {{ websiteUri?: string|null, types?: string[], rating?: number, userRatingCount?: number }} place
 * @param {{ hasHttps?: boolean, hasViewport?: boolean, loadMs?: number|null, unreachable?: boolean }|null} siteProbe
 */
export function scoreProspect(place, siteProbe = null) {
  let score = 40;
  const website = normalizeWebsite(place.websiteUri);

  if (!website) {
    score += 35; // no website → strong prospect
  } else if (siteProbe?.unreachable) {
    score += 30;
  } else {
    if (siteProbe && siteProbe.hasHttps === false) score += 15;
    if (siteProbe && siteProbe.hasViewport === false) score += 18;
    if (siteProbe?.loadMs != null && siteProbe.loadMs > 4000) score += 8;
    if (!siteProbe) score += 5; // unknown quality, slight bump
  }

  const ratings = Number(place.userRatingCount || 0);
  if (ratings >= 20 && ratings < 500) score += 8;
  if (ratings >= 500) score += 3;

  const rating = Number(place.rating || 0);
  if (rating >= 3.5) score += 4;

  if (isGovernmentPlace(place)) score = 0;

  return Math.max(0, Math.min(100, score));
}

export function loadExistingClientIndex(clientSitesDir, { readFileSync, readdirSync, existsSync }) {
  const bySlug = new Set();
  const byName = new Set();
  const byHost = new Set();
  if (!existsSync(clientSitesDir)) {
    return { bySlug, byName, byHost };
  }
  for (const entry of readdirSync(clientSitesDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    bySlug.add(entry.name);
    const jsonPath = `${clientSitesDir}/${entry.name}/client.json`;
    if (!existsSync(jsonPath)) continue;
    try {
      const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
      if (raw.businessName) byName.add(String(raw.businessName).toLowerCase().trim());
      if (raw.slug) bySlug.add(String(raw.slug));
      if (raw.previewHost) byHost.add(String(raw.previewHost).toLowerCase());
      const website = normalizeWebsite(raw.sources?.website || raw.website);
      if (website) {
        try {
          byHost.add(new URL(website).hostname.replace(/^www\./, ""));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore bad json */
    }
  }
  return { bySlug, byName, byHost };
}

export function isAlreadyClient(place, index) {
  const name = String(place.displayName?.text || "").toLowerCase().trim();
  const slug = slugifyBusinessName(place.displayName?.text || "");
  if (slug && index.bySlug.has(slug)) return true;
  if (name && index.byName.has(name)) return true;
  const website = normalizeWebsite(place.websiteUri);
  if (website) {
    try {
      const host = new URL(website).hostname.replace(/^www\./, "").toLowerCase();
      if (index.byHost.has(host)) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

export function fieldMaskForSearch() {
  return [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.types",
    "places.websiteUri",
    "places.nationalPhoneNumber",
    "places.internationalPhoneNumber",
    "places.rating",
    "places.userRatingCount",
    "places.googleMapsUri",
    "places.businessStatus",
  ].join(",");
}

/** Map legacy Nearby Search JSON into the Places (New)-shaped object our ranker expects. */
export function normalizeLegacyPlace(raw) {
  if (!raw || typeof raw !== "object") return null;
  return {
    id: raw.place_id || raw.id,
    displayName: { text: raw.name || "" },
    formattedAddress: raw.vicinity || raw.formatted_address || "",
    types: Array.isArray(raw.types) ? raw.types : [],
    websiteUri: raw.website || null,
    nationalPhoneNumber: raw.formatted_phone_number || raw.international_phone_number || "",
    internationalPhoneNumber: raw.international_phone_number || "",
    rating: raw.rating ?? null,
    userRatingCount: raw.user_ratings_total ?? 0,
    googleMapsUri: raw.place_id
      ? `https://www.google.com/maps/place/?q=place_id:${raw.place_id}`
      : raw.url || "",
    businessStatus: raw.business_status || "OPERATIONAL",
  };
}

/**
 * Legacy Places Nearby Search (works when only "Places API" is enabled on the key).
 * Note: legacy nearby often omits website/phone — Place Details fills those when needed.
 */
export async function searchNearbyLegacy(opts) {
  const {
    apiKey,
    area,
    includedType,
    maxResultCount = 10,
    fetchImpl = fetch,
  } = opts;

  const params = new URLSearchParams({
    location: `${area.center.latitude},${area.center.longitude}`,
    radius: String(Math.min(area.radiusMeters, 50000)),
    type: includedType,
    key: apiKey,
  });
  const res = await fetchImpl(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`,
    { method: "GET" }
  );
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Places legacy nearby HTTP ${res.status}`);
  }
  if (body.status && body.status !== "OK" && body.status !== "ZERO_RESULTS") {
    throw new Error(
      `Places legacy nearby failed (${includedType} @ ${area.id}): ${body.status}${
        body.error_message ? ` — ${body.error_message}` : ""
      }`
    );
  }
  const results = Array.isArray(body.results) ? body.results : [];
  return results.slice(0, maxResultCount).map(normalizeLegacyPlace).filter(Boolean);
}

/** Place Details (Legacy) — website + phone for a place_id. */
export async function fetchLegacyPlaceDetails(opts) {
  const { apiKey, placeId, fetchImpl = fetch } = opts;
  if (!placeId) return null;
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,url,type,types,business_status,rating,user_ratings_total",
    key: apiKey,
  });
  const res = await fetchImpl(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
    { method: "GET" }
  );
  const body = await res.json().catch(() => ({}));
  if (body.status !== "OK" || !body.result) return null;
  return normalizeLegacyPlace(body.result);
}

/**
 * @param {{ apiKey: string, area: typeof SEARCH_AREAS[0], includedType: string, maxResultCount?: number, fetchImpl?: typeof fetch, preferLegacy?: boolean }} opts
 */
export async function searchNearby(opts) {
  const {
    apiKey,
    area,
    includedType,
    maxResultCount = 10,
    fetchImpl = fetch,
    preferLegacy = false,
  } = opts;

  if (!preferLegacy) {
    try {
      const res = await fetchImpl("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": fieldMaskForSearch(),
        },
        body: JSON.stringify({
          includedTypes: [includedType],
          maxResultCount,
          languageCode: "en",
          regionCode: "PH",
          rankPreference: "POPULARITY",
          locationRestriction: {
            circle: {
              center: area.center,
              radius: area.radiusMeters,
            },
          },
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        return Array.isArray(body.places) ? body.places : [];
      }
      const msg = body?.error?.message || res.statusText || `HTTP ${res.status}`;
      // Fall back when New API is disabled / key-blocked but Legacy works.
      if (res.status === 403 || /blocked|permission|PERMISSION/i.test(msg)) {
        return searchNearbyLegacy({ apiKey, area, includedType, maxResultCount, fetchImpl });
      }
      throw new Error(`Places searchNearby failed (${includedType} @ ${area.id}): ${msg}`);
    } catch (err) {
      if (/legacy nearby failed/i.test(String(err.message))) throw err;
      // network or unexpected — try legacy once
      return searchNearbyLegacy({ apiKey, area, includedType, maxResultCount, fetchImpl });
    }
  }

  return searchNearbyLegacy({ apiKey, area, includedType, maxResultCount, fetchImpl });
}

/**
 * Lightweight HTML probe for “not beautiful / outdated” heuristics.
 * @param {string} url
 * @param {{ fetchImpl?: typeof fetch, timeoutMs?: number }} [opts]
 */
export async function probeWebsite(url, opts = {}) {
  const fetchImpl = opts.fetchImpl || fetch;
  const timeoutMs = opts.timeoutMs ?? 8000;
  const website = normalizeWebsite(url);
  if (!website) {
    return { unreachable: true, hasHttps: false, hasViewport: false, loadMs: null };
  }
  const started = Date.now();
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetchImpl(website, {
      method: "GET",
      redirect: "follow",
      signal: ctrl?.signal,
      headers: { "User-Agent": "carlmanuel-prospect-probe/1.0" },
    });
    const loadMs = Date.now() - started;
    const html = (await res.text()).slice(0, 80000);
    const hasViewport = /name=["']viewport["']/i.test(html);
    const hasHttps = website.startsWith("https://");
    return {
      unreachable: !res.ok && res.status >= 400,
      status: res.status,
      hasHttps,
      hasViewport,
      loadMs,
    };
  } catch {
    return {
      unreachable: true,
      hasHttps: website.startsWith("https://"),
      hasViewport: false,
      loadMs: Date.now() - started,
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Pick a rotating subset of types so daily runs cover variety.
 * @param {string[]} types
 * @param {number} count
 * @param {number} daySeed e.g. YYYYMMDD number
 */
export function pickTypesForDay(types, count, daySeed) {
  const list = [...types];
  const start = Math.abs(daySeed) % list.length;
  const out = [];
  for (let i = 0; i < count && i < list.length; i += 1) {
    out.push(list[(start + i) % list.length]);
  }
  return out;
}

export function yyyymmdd(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return Number(`${y}${m}${day}`);
}

/**
 * Merge + filter + score places into ranked prospects.
 */
export function rankProspects(places, { existingIndex, probesByWebsite = {} }) {
  const seen = new Set();
  const ranked = [];

  for (const place of places) {
    const id = place.id || place.name;
    if (!id || seen.has(id)) continue;
    seen.add(id);

    if (place.businessStatus && place.businessStatus !== "OPERATIONAL") continue;
    if (isGovernmentPlace(place)) continue;
    if (isAlreadyClient(place, existingIndex)) continue;

    const website = normalizeWebsite(place.websiteUri);
    const probe = website ? probesByWebsite[website] || null : null;
    const score = scoreProspect({ ...place, websiteUri: website }, probe);
    if (score < 45) continue;

    ranked.push({
      placeId: id,
      name: place.displayName?.text || "Unknown",
      slug: slugifyBusinessName(place.displayName?.text || "unknown"),
      address: place.formattedAddress || "",
      phone: place.nationalPhoneNumber || place.internationalPhoneNumber || "",
      website,
      types: place.types || [],
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? 0,
      googleMapsUri: place.googleMapsUri || "",
      score,
      probe: probe || (website ? null : { note: "no_website" }),
      reason: !website
        ? "No website on Google"
        : probe?.unreachable
          ? "Website unreachable"
          : probe?.hasViewport === false
            ? "No mobile viewport"
            : probe?.hasHttps === false
              ? "No HTTPS"
              : "Has website — worth a better demo",
    });
  }

  ranked.sort((a, b) => b.score - a.score || b.userRatingCount - a.userRatingCount);
  return ranked;
}
