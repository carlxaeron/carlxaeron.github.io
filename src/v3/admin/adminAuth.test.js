import {
  ADMIN_TOKEN_KEY,
  clearAdminToken,
  extractTokenFromResponse,
  getAdminToken,
  setAdminToken,
} from "./adminAuth";

describe("adminAuth", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("stores and reads token from sessionStorage", () => {
    expect(getAdminToken()).toBe("");
    setAdminToken("abc123");
    expect(getAdminToken()).toBe("abc123");
    expect(sessionStorage.getItem(ADMIN_TOKEN_KEY)).toBe("abc123");
  });

  test("clearAdminToken removes stored token", () => {
    setAdminToken("xyz");
    clearAdminToken();
    expect(getAdminToken()).toBe("");
  });

  test("extractTokenFromResponse handles common shapes", () => {
    expect(extractTokenFromResponse({ token: "plain" })).toBe("plain");
    expect(extractTokenFromResponse({ access_token: "access" })).toBe("access");
    expect(extractTokenFromResponse({ data: { token: "nested" } })).toBe("nested");
    expect(extractTokenFromResponse({ data: { access_token: "nested-access" } })).toBe(
      "nested-access"
    );
    expect(extractTokenFromResponse({ status: 200 })).toBeNull();
    expect(extractTokenFromResponse(null)).toBeNull();
  });
});
