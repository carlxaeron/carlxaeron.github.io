import {
  PREVIEW_SITES,
  buildPreviewPortfolioUrl,
  getPreviewQueryFromSearch,
  isPreviewHostAllowed,
  resolvePreviewUrl,
} from "./previewWhitelist";

describe("previewWhitelist — slug resolution", () => {
  test.each(PREVIEW_SITES)("slug %s resolves to registered host", (site) => {
    const resolved = resolvePreviewUrl(site.id);

    expect(resolved).not.toBeNull();
    expect(resolved.url).toBe(`https://${site.host}`);
    expect(resolved.host).toBe(site.host);
    expect(resolved.slug).toBe(site.id);
    expect(resolved.site).toEqual(site);
    expect(isPreviewHostAllowed(site.id)).toBe(true);
  });

  test.each(PREVIEW_SITES)("buildPreviewPortfolioUrl for %s", (site) => {
    expect(buildPreviewPortfolioUrl(site.id)).toBe(
      `https://carlmanuel.com/?preview=${site.id}`
    );
  });

  test.each(PREVIEW_SITES)("legacy hostname %s resolves with canonical slug", (site) => {
    const resolved = resolvePreviewUrl(site.host);

    expect(resolved?.url).toBe(`https://${site.host}`);
    expect(resolved?.slug).toBe(site.id);
    expect(resolved?.site).toEqual(site);
  });

  test("resolves netlifySite alias to site slug", () => {
    const resolved = resolvePreviewUrl("jk-construction-services");

    expect(resolved?.slug).toBe("jk-construction");
    expect(resolved?.url).toBe("https://jk-construction-services.netlify.app");
  });

  test("strips protocol and path from legacy preview value", () => {
    const resolved = resolvePreviewUrl("https://sonyoba-marketing.netlify.app/path");

    expect(resolved?.host).toBe("sonyoba-marketing.netlify.app");
    expect(resolved?.slug).toBe("sonyoba-marketing");
  });
});

describe("previewWhitelist — rejections", () => {
  test("rejects unknown slug", () => {
    expect(resolvePreviewUrl("evil-slug")).toBeNull();
    expect(isPreviewHostAllowed("evil-slug")).toBe(false);
  });

  test("rejects non-netlify domain", () => {
    expect(resolvePreviewUrl("evil.com")).toBeNull();
    expect(isPreviewHostAllowed("evil.com")).toBe(false);
  });

  test("rejects empty and whitespace values", () => {
    expect(resolvePreviewUrl("")).toBeNull();
    expect(resolvePreviewUrl("   ")).toBeNull();
  });

  test("allows unlisted netlify.app subdomain for dev flexibility", () => {
    expect(isPreviewHostAllowed("demo-client.netlify.app")).toBe(true);
    const resolved = resolvePreviewUrl("demo-client.netlify.app");
    expect(resolved?.slug).toBe("demo-client");
    expect(resolved?.site).toBeNull();
  });
});

describe("buildPreviewPortfolioUrl", () => {
  test("returns null for empty input", () => {
    expect(buildPreviewPortfolioUrl("")).toBeNull();
    expect(buildPreviewPortfolioUrl(null)).toBeNull();
  });

  test("falls back to lowercased key when site is unknown", () => {
    expect(buildPreviewPortfolioUrl("Custom-Slug")).toBe(
      "https://carlmanuel.com/?preview=custom-slug"
    );
  });
});

describe("getPreviewQueryFromSearch", () => {
  test("reads preview param from search string", () => {
    expect(getPreviewQueryFromSearch("?preview=jk-construction&foo=bar")).toBe("jk-construction");
    expect(getPreviewQueryFromSearch("")).toBeNull();
  });
});
