import {
  PREVIEW_SITES,
  buildPreviewPortfolioUrl,
  getPreviewQueryFromSearch,
  getPreviewSettingsDefaults,
  getPreviewSettingsSchema,
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
    const resolved = resolvePreviewUrl("machinemate-engineering");

    expect(resolved?.slug).toBe("machinemate");
    expect(resolved?.url).toBe("https://machinemate-engineering.netlify.app");
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
    expect(getPreviewQueryFromSearch("?preview=machinemate&foo=bar")).toBe("machinemate");
    expect(getPreviewQueryFromSearch("")).toBeNull();
  });
});

describe("getPreviewSettingsSchema", () => {
  test("returns XKR previewSettings.fields", () => {
    const fields = getPreviewSettingsSchema("xkr-construction");

    expect(fields).toEqual([
      {
        key: "heroEyebrow",
        type: "text",
        default: "Rodriguez, Rizal · Construction company",
        maxLength: 80,
        label: "Hero eyebrow",
      },
      {
        key: "heroHeadline",
        type: "text",
        default: "XKR Construction",
        maxLength: 120,
        label: "Hero headline",
      },
      {
        key: "heroSubhead",
        type: "textarea",
        default:
          "We work with government and private agencies on both horizontal and vertical projects — from site development to building works across Rizal and nearby project sites.",
        maxLength: 400,
        label: "Hero subhead",
      },
      {
        key: "heroImageDesktop",
        type: "image",
        default: null,
        accept: "image/jpeg,image/png,image/webp",
        maxBytes: 2097152,
        label: "Hero image (desktop)",
      },
      {
        key: "heroImageMobile",
        type: "image",
        default: null,
        accept: "image/jpeg,image/png,image/webp",
        maxBytes: 2097152,
        label: "Hero image (mobile)",
      },
      {
        key: "galleryCount",
        type: "number",
        min: 2,
        max: 4,
        default: 4,
        label: "Gallery photos shown",
      },
      {
        key: "showWhyUs",
        type: "boolean",
        default: true,
        label: "Show Why agencies work with us",
      },
    ]);
    expect(fields.some((field) => field.key === "heroImage")).toBe(false);
  });

  test("accepts site object", () => {
    const site = PREVIEW_SITES.find((entry) => entry.id === "xkr-construction");
    expect(getPreviewSettingsSchema(site)).toHaveLength(7);
  });

  test("returns empty array when site has no previewSettings", () => {
    expect(getPreviewSettingsSchema(null)).toEqual([]);
    expect(getPreviewSettingsSchema("unknown-slug")).toEqual([]);
  });

  test("machinemate ships CMS v1 previewSettings after catalog retrofit", () => {
    const fields = getPreviewSettingsSchema("machinemate");
    expect(fields.map((f) => f.key)).toEqual(
      expect.arrayContaining([
        "heroEyebrow",
        "heroHeadline",
        "heroSubhead",
        "heroImageDesktop",
        "heroImageMobile",
        "galleryCount",
        "showWhyUs",
      ])
    );
  });

  test("every whitelist site ships previewSettings.fields", () => {
    const missing = PREVIEW_SITES.filter(
      (site) => !Array.isArray(site.previewSettings?.fields) || site.previewSettings.fields.length === 0
    ).map((site) => site.id);
    expect(missing).toEqual([]);
  });

  test.each([
    "bernardino-general-hospital",
    "cj-resort",
    "fairview-general-hospital",
    "frances-teresa-garden",
    "hvill-hospital",
    "joyce-kim-resort",
    "lucky-drive-inn",
    "novagen",
    "palms-and-terraces",
    "pgmc",
  ])("%s ships text + dual hero + gallery/about previewSettings", (slug) => {
    const fields = getPreviewSettingsSchema(slug);
    const keys = fields.map((field) => field.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        "heroEyebrow",
        "heroHeadline",
        "heroSubhead",
        "heroImageDesktop",
        "heroImageMobile",
        "galleryCount",
        "showWhyUs",
      ])
    );
    expect(fields.find((field) => field.key === "heroImageDesktop")?.default).toBeNull();
    expect(fields.find((field) => field.key === "heroHeadline")?.default).toBeTruthy();
  });
});

describe("getPreviewSettingsDefaults", () => {
  test("maps field defaults by key", () => {
    expect(getPreviewSettingsDefaults(getPreviewSettingsSchema("xkr-construction"))).toEqual({
      heroEyebrow: "Rodriguez, Rizal · Construction company",
      heroHeadline: "XKR Construction",
      heroSubhead:
        "We work with government and private agencies on both horizontal and vertical projects — from site development to building works across Rizal and nearby project sites.",
      heroImageDesktop: null,
      heroImageMobile: null,
      galleryCount: 4,
      showWhyUs: true,
    });
  });

  test("returns empty object for empty schema", () => {
    expect(getPreviewSettingsDefaults([])).toEqual({});
    expect(getPreviewSettingsDefaults(null)).toEqual({});
  });
});
