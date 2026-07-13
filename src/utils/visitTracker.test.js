import { getVisitClientMeta } from "./visitTracker";

describe("visitTracker", () => {
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
});
