/** @typedef {'results' | 'resume'} PortfolioVariant */

export const PORTFOLIO_VARIANTS = {
  RESULTS: /** @type {const} */ ("results"),
  RESUME: /** @type {const} */ ("resume"),
};

const RESUME_TRUTHY = new Set(["1", "true", "yes"]);

/**
 * @param {string | null | undefined} value
 * @returns {boolean}
 */
function isTruthyResumeValue(value) {
  if (value == null) return true;
  const trimmed = String(value).trim().toLowerCase();
  return trimmed === "" || RESUME_TRUTHY.has(trimmed);
}

/**
 * Resolve portfolio mode from URL search string.
 * Default `/` → results; `?resume`, `?resume=1`, `?cv` → resume deck.
 *
 * @param {string} search - e.g. `?resume=1` or `resume=1`
 * @returns {PortfolioVariant}
 */
export function getPortfolioVariant(search = "") {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);

  if (params.has("cv") && isTruthyResumeValue(params.get("cv"))) {
    return PORTFOLIO_VARIANTS.RESUME;
  }

  if (params.has("resume") && isTruthyResumeValue(params.get("resume"))) {
    return PORTFOLIO_VARIANTS.RESUME;
  }

  return PORTFOLIO_VARIANTS.RESULTS;
}

/**
 * @param {string} search
 * @param {PortfolioVariant} variant
 * @returns {string} search string including leading `?` when non-empty
 */
export function applyPortfolioVariantToSearch(search = "", variant) {
  const raw = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  params.delete("cv");
  params.delete("resume");
  if (variant === PORTFOLIO_VARIANTS.RESUME) {
    params.set("resume", "1");
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * @param {{ pathname?: string, search?: string, hash?: string, variant: PortfolioVariant }} options
 * @returns {string}
 */
export function buildPortfolioVariantUrl({
  pathname = "/",
  search = "",
  hash = "#home",
  variant,
}) {
  const nextSearch = applyPortfolioVariantToSearch(search, variant);
  const nextHash = hash || "#home";
  return `${pathname}${nextSearch}${nextHash}`;
}

/**
 * @param {string} search
 * @returns {PortfolioVariant}
 */
export function getToggledPortfolioVariant(search = "") {
  const current = getPortfolioVariant(search);
  return current === PORTFOLIO_VARIANTS.RESUME
    ? PORTFOLIO_VARIANTS.RESULTS
    : PORTFOLIO_VARIANTS.RESUME;
}
