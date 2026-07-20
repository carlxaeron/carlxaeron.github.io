import {
  ADMIN_TABS,
  feedbackSentimentLabel,
  formatDayLabel,
  mapOutreachFunnelRows,
  mapPreviewMetricRows,
  mapTopCountRows,
  mapVisitsByDayRows,
  normalizeAnalyticsDays,
  visitClientLabel,
  visitEventLabel,
  visitTargetLabel,
} from "./analyticsHelpers";

describe("analyticsHelpers", () => {
  test("ADMIN_TABS includes Analytics after Overview", () => {
    expect(ADMIN_TABS.map((t) => t.id)).toEqual([
      "overview",
      "analytics",
      "inbox",
      "outreach",
      "clients",
      "cms",
      "settings",
    ]);
  });

  test("normalizeAnalyticsDays allows 7/14/30/90 only", () => {
    expect(normalizeAnalyticsDays(7)).toBe(7);
    expect(normalizeAnalyticsDays(14)).toBe(14);
    expect(normalizeAnalyticsDays(30)).toBe(30);
    expect(normalizeAnalyticsDays(90)).toBe(90);
    expect(normalizeAnalyticsDays(999)).toBe(30);
    expect(normalizeAnalyticsDays("nope")).toBe(30);
  });

  test("formatDayLabel trims year", () => {
    expect(formatDayLabel("2026-07-20")).toBe("07-20");
    expect(formatDayLabel("")).toBe("");
  });

  test("mapVisitsByDayRows maps total and previewViews", () => {
    const rows = [
      { date: "2026-07-19", total: 4, previewViews: 2 },
      { date: "2026-07-20", total: 1, previewViews: 0 },
    ];
    expect(mapVisitsByDayRows(rows, "total")).toEqual([
      { label: "07-19", count: 4, key: "2026-07-19" },
      { label: "07-20", count: 1, key: "2026-07-20" },
    ]);
    expect(mapVisitsByDayRows(rows, "previewViews")[0].count).toBe(2);
  });

  test("mapTopCountRows and mapPreviewMetricRows", () => {
    expect(mapTopCountRows([{ label: "home", count: 3 }])).toEqual([
      { label: "home", count: 3, key: "home" },
    ]);
    expect(
      mapPreviewMetricRows(
        [
          { slug: "a", views: 5, likes: 0, agrees: 1 },
          { slug: "b", views: 0, likes: 2, agrees: 0 },
        ],
        "likes",
        5
      )
    ).toEqual([{ label: "b", count: 2, key: "likes-b" }]);
  });

  test("mapOutreachFunnelRows builds status + summary rows", () => {
    const rows = mapOutreachFunnelRows({
      total: 3,
      byStatus: { active: 2, paused: 1 },
      autoFollowUp: 2,
      withInitialSent: 3,
      totalFollowUpsSent: 4,
    });
    expect(rows.find((r) => r.key === "total")?.count).toBe(3);
    expect(rows.find((r) => r.key === "status-active")?.count).toBe(2);
    expect(rows.find((r) => r.key === "followups")?.count).toBe(4);
  });

  test("feedbackSentimentLabel", () => {
    expect(feedbackSentimentLabel("agree")).toBe("Ready");
    expect(feedbackSentimentLabel("like")).toBe("Like");
    expect(feedbackSentimentLabel("dislike")).toBe("Dislike");
  });

  test("visitEventLabel and visitTargetLabel", () => {
    expect(visitEventLabel("preview_view")).toBe("Preview");
    expect(visitEventLabel("section_view")).toBe("Section");
    expect(visitEventLabel("pageview")).toBe("Page");
    expect(visitTargetLabel({ previewSlug: "jk-construction", section: "home" })).toBe(
      "jk-construction"
    );
    expect(visitTargetLabel({ section: "projects" })).toBe("projects");
    expect(visitTargetLabel({})).toBe("—");
  });

  test("visitClientLabel joins browser and OS", () => {
    expect(visitClientLabel({ browser: "Chrome", os: "Windows" })).toBe("Chrome · Windows");
    expect(visitClientLabel({ browser: "Safari", os: "Unknown" })).toBe("Safari");
    expect(visitClientLabel({ browser: "Unknown", os: "Unknown" })).toBe("—");
  });
});
