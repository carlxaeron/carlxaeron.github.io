import {
  applyOwnerExcludeFromUrl,
  enableAnalyticsExclude,
  getVisitClientMeta,
  isAnalyticsExcluded,
} from "./visitTracker";

describe("visitTracker", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/");
  });

  test("getVisitClientMeta returns browser metadata shape", () => {
    const meta = getVisitClientMeta();
    expect(meta).toMatchObject({
      path: expect.any(String),
      referrer: expect.any(String),
      userAgent: expect.any(String),
      language: expect.any(String),
      screen: { width: expect.any(Number), height: expect.any(Number) },
      viewport: { width: expect.any(Number), height: expect.any(Number) },
    });
  });

  test("?no_track=1 enables permanent owner exclude", () => {
    window.history.replaceState(null, "", "/?preview=jazz1-aircon&no_track=1");
    applyOwnerExcludeFromUrl();
    expect(isAnalyticsExcluded()).toBe(true);
    expect(window.location.search).toBe("?preview=jazz1-aircon");
  });

  test("enableAnalyticsExclude sets localStorage flag", () => {
    enableAnalyticsExclude();
    expect(localStorage.getItem("cm_analytics_exclude")).toBe("1");
    expect(isAnalyticsExcluded()).toBe(true);
  });
});
