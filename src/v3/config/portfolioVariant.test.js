import { getPortfolioVariant, PORTFOLIO_VARIANTS, applyPortfolioVariantToSearch } from "./portfolioVariant";

describe("getPortfolioVariant", () => {
  test("defaults to results for empty or unrelated query", () => {
    expect(getPortfolioVariant("")).toBe(PORTFOLIO_VARIANTS.RESULTS);
    expect(getPortfolioVariant("?preview=foo")).toBe(PORTFOLIO_VARIANTS.RESULTS);
    expect(getPortfolioVariant("?foo=bar")).toBe(PORTFOLIO_VARIANTS.RESULTS);
  });

  test("returns resume for resume param variants", () => {
    expect(getPortfolioVariant("?resume=1")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("?resume")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("?resume=true")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("?resume=yes")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("resume=1")).toBe(PORTFOLIO_VARIANTS.RESUME);
  });

  test("returns resume for cv param variants", () => {
    expect(getPortfolioVariant("?cv")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("?cv=1")).toBe(PORTFOLIO_VARIANTS.RESUME);
    expect(getPortfolioVariant("?cv=true")).toBe(PORTFOLIO_VARIANTS.RESUME);
  });

  test("does not treat falsy resume/cv values as resume mode", () => {
    expect(getPortfolioVariant("?resume=0")).toBe(PORTFOLIO_VARIANTS.RESULTS);
    expect(getPortfolioVariant("?resume=false")).toBe(PORTFOLIO_VARIANTS.RESULTS);
    expect(getPortfolioVariant("?cv=0")).toBe(PORTFOLIO_VARIANTS.RESULTS);
  });

  test("applyPortfolioVariantToSearch sets or clears resume param", () => {
    expect(applyPortfolioVariantToSearch("", PORTFOLIO_VARIANTS.RESUME)).toBe("?resume=1");
    expect(applyPortfolioVariantToSearch("?resume=1", PORTFOLIO_VARIANTS.RESULTS)).toBe("");
    expect(applyPortfolioVariantToSearch("?cv", PORTFOLIO_VARIANTS.RESULTS)).toBe("");
    expect(applyPortfolioVariantToSearch("?foo=bar", PORTFOLIO_VARIANTS.RESUME)).toBe("?foo=bar&resume=1");
  });
});
