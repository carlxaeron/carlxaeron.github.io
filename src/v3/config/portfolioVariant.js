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
