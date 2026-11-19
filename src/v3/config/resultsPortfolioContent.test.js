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

  test("includes Premium DesignScape from the Tabulate CRM work", () => {
    const role = RESULTS_PORTFOLIO_CONTENT.experiences.find((exp) =>
      /Premium DesignScape/i.test(exp.companyName)
    );
    expect(role).toBeTruthy();
    expect(role.companyLogo).toBe("/static/images/companies/premium-designscape.png");
    expect(role.dateRange).toMatch(/Feb 2025 - Nov 2025/);
    expect(role.jobDescription).toMatch(/price matrix/i);
    expect(role.jobDescription).toMatch(/TabulateSaaS/);
    const projectIds = RESULTS_PORTFOLIO_CONTENT.companies
      .flatMap((company) => company.projects || [])
      .map((project) => project.id);
    expect(projectIds).toEqual(expect.arrayContaining(["tabulate-saas", "pd-crm", "tabulate-api"]));
  });

  test("includes I-Tul as recent experience with logo", () => {
    const first = RESULTS_PORTFOLIO_CONTENT.experiences[0];
    expect(first.companyName).toMatch(/I-Tul/i);
    expect(first.companyLogo).toBe("/static/images/companies/i-tul.svg");
    expect(first.dateRange).toMatch(/Mar 2025 - Sep 2026/i);
    expect(first.jobDescription).toMatch(/Laravel|BigCommerce|camp/i);
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
