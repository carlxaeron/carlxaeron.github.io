import { RESULTS_PORTFOLIO_CONTENT } from "./resultsPortfolioContent";
import { PORTFOLIO_VARIANTS } from "./portfolioVariant";
import { SETTINGS_DEFAULTS } from "./portfolioContentDefaults";

describe("resultsPortfolioContent", () => {
  test("hides blog, insights, and quote in results settings", () => {
    expect(RESULTS_PORTFOLIO_CONTENT.settings.sections.blog).toBe(false);
    expect(RESULTS_PORTFOLIO_CONTENT.settings.sections.insights).toBe(false);
    expect(RESULTS_PORTFOLIO_CONTENT.settings.sections.quote).toBe(false);
    expect(RESULTS_PORTFOLIO_CONTENT.settings.sections.contact).toBe(true);
  });

  test("results hero focuses on plain language not slogans", () => {
    expect(RESULTS_PORTFOLIO_CONTENT.hero.ctaPrimary).toMatch(/See the work/i);
    expect(RESULTS_PORTFOLIO_CONTENT.hero.subheadline).toMatch(/Metrobank/i);
    expect(RESULTS_PORTFOLIO_CONTENT.hero.subheadline).not.toMatch(/Proof over pitch/i);
  });

  test("resume defaults keep all sections enabled", () => {
    expect(SETTINGS_DEFAULTS.sections.blog).toBe(true);
    expect(SETTINGS_DEFAULTS.sections.quote).toBe(true);
  });
});

describe("portfolio variants", () => {
  test("variant constants are stable", () => {
    expect(PORTFOLIO_VARIANTS.RESULTS).toBe("results");
    expect(PORTFOLIO_VARIANTS.RESUME).toBe("resume");
  });
});
