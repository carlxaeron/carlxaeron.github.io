/** Supported quote currencies — amounts are stored per currency (no live FX). */
export const QUOTE_CURRENCIES = [
  { code: "PHP", label: "PHP", symbol: "₱" },
  { code: "USD", label: "USD", symbol: "$" },
];

export const DEFAULT_QUOTE_CURRENCY = "PHP";

/** Budget range labels keyed by ISO currency code. */
export const BUDGET_RANGES_BY_CURRENCY = {
  PHP: [
    "< ₱50k",
    "₱50k–₱150k",
    "₱150k–₱500k",
    "₱500k+",
    "Discuss",
  ],
  USD: [
    "< $1k",
    "$1k–$3k",
    "$3k–$10k",
    "$10k+",
    "Discuss",
  ],
};

const CURRENCY_CODES = new Set(QUOTE_CURRENCIES.map((c) => c.code));

export function normalizeQuoteCurrency(code) {
  const upper = String(code || "").trim().toUpperCase();
  return CURRENCY_CODES.has(upper) ? upper : DEFAULT_QUOTE_CURRENCY;
}

export function getBudgetRangesForCurrency(code) {
  const normalized = normalizeQuoteCurrency(code);
  return BUDGET_RANGES_BY_CURRENCY[normalized] || BUDGET_RANGES_BY_CURRENCY[DEFAULT_QUOTE_CURRENCY];
}

export function getQuoteCurrencyMeta(code) {
  const normalized = normalizeQuoteCurrency(code);
  return QUOTE_CURRENCIES.find((c) => c.code === normalized) || QUOTE_CURRENCIES[0];
}
