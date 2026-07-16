import {
  BUDGET_RANGES_BY_CURRENCY,
  DEFAULT_QUOTE_CURRENCY,
  getBudgetRangesForCurrency,
  getQuoteCurrencyMeta,
  normalizeQuoteCurrency,
} from "./quoteConfig";

describe("quoteConfig", () => {
  test("defaults to PHP", () => {
    expect(DEFAULT_QUOTE_CURRENCY).toBe("PHP");
    expect(normalizeQuoteCurrency("")).toBe("PHP");
    expect(normalizeQuoteCurrency("invalid")).toBe("PHP");
  });

  test("normalizes supported currency codes", () => {
    expect(normalizeQuoteCurrency("usd")).toBe("USD");
    expect(normalizeQuoteCurrency("PHP")).toBe("PHP");
  });

  test("returns per-currency budget ranges", () => {
    expect(getBudgetRangesForCurrency("PHP")[0]).toBe("< ₱50k");
    expect(getBudgetRangesForCurrency("USD")[0]).toBe("< $1k");
    expect(BUDGET_RANGES_BY_CURRENCY.PHP).toHaveLength(5);
    expect(BUDGET_RANGES_BY_CURRENCY.USD).toHaveLength(5);
  });

  test("exposes currency metadata", () => {
    expect(getQuoteCurrencyMeta("USD").symbol).toBe("$");
    expect(getQuoteCurrencyMeta("PHP").symbol).toBe("₱");
  });
});
