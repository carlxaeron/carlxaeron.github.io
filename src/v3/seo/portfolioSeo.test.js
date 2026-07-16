import { HERO_DEFAULTS, ABOUT_DEFAULTS } from "../config/portfolioContentDefaults";
import {
  PORTFOLIO_SEO,
  buildBootShellHtml,
  buildPrerenderBootStyles,
  buildPrerenderHtml,
  escapeHtml,
  shouldNoIndex,
  topSkillNames,
} from "./portfolioSeo";

describe("portfolioSeo", () => {
  test("escapeHtml encodes special characters", () => {
    expect(escapeHtml(`Tom & Jerry "quote" <tag>`)).toBe(
      "Tom &amp; Jerry &quot;quote&quot; &lt;tag&gt;"
    );
  });

  test("buildPrerenderHtml includes hero, sections, and contact links", () => {
    const html = buildPrerenderHtml();
    expect(html).toContain(`<h1>${HERO_DEFAULTS.nameLine1} ${HERO_DEFAULTS.nameLine2}</h1>`);
    expect(html).toContain(escapeHtml(HERO_DEFAULTS.subheadline));
    expect(html).toContain(ABOUT_DEFAULTS.heading);
    expect(html).toContain('id="skills"');
    expect(html).toContain('id="experience"');
    expect(html).toContain('id="projects"');
    expect(html).toContain('href="mailto:info@carlmanuel.com"');
    expect(html).toContain('href="https://carlmanuel.com/#contact"');
    expect(html).toContain("<main id=\"seo-prerender\"");
  });

  test("buildPrerenderBootStyles hides seo-prerender and brands the boot shell", () => {
    const styles = buildPrerenderBootStyles();
    expect(styles).toContain('id="seo-prerender-boot"');
    expect(styles).toContain("#seo-prerender");
    expect(styles).toContain("clip: rect(0, 0, 0, 0)");
    expect(styles).toContain("#00473e");
    expect(styles).toContain("#1E3932");
    expect(styles).toContain("html.v3-app-ready #app-boot-shell");
  });

  test("buildBootShellHtml renders branded wordmark placeholder", () => {
    const shell = buildBootShellHtml();
    expect(shell).toContain('id="app-boot-shell"');
    expect(shell).toContain('aria-hidden="true"');
    expect(shell).toContain("Carl");
    expect(shell).toContain('class="boot-accent"');
    expect(shell).toContain("Manuel");
  });

  test("topSkillNames returns non-parent skills", () => {
    const names = topSkillNames(5);
    expect(names.length).toBeGreaterThan(0);
    expect(names).not.toContain(undefined);
  });

  test("shouldNoIndex is false for main portfolio", () => {
    expect(shouldNoIndex({ appMode: "portfolio", previewQuery: null })).toBe(false);
    expect(shouldNoIndex({ appMode: "portfolio", previewQuery: "" })).toBe(false);
  });

  test("shouldNoIndex is true for preview, login, and admin", () => {
    expect(shouldNoIndex({ appMode: "portfolio", previewQuery: "jk-construction" })).toBe(true);
    expect(shouldNoIndex({ appMode: "login" })).toBe(true);
    expect(shouldNoIndex({ appMode: "admin" })).toBe(true);
  });

  test("PORTFOLIO_SEO has canonical site URL", () => {
    expect(PORTFOLIO_SEO.siteUrl).toBe("https://carlmanuel.com");
  });
});
