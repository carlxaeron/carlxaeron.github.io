import { getAppMode } from "./useAppMode";

const originalLocation = window.location;

function mockLocation({ pathname = "/", hash = "", href }) {
  delete window.location;
  window.location = {
    ...originalLocation,
    pathname,
    hash,
    href: href ?? `http://localhost${pathname}${hash}`,
  };
}

describe("getAppMode", () => {
  afterEach(() => {
    window.location = originalLocation;
  });

  test("returns portfolio by default", () => {
    mockLocation({ pathname: "/", hash: "" });
    expect(getAppMode()).toBe("portfolio");
  });

  test("returns login for #login hash", () => {
    mockLocation({ pathname: "/", hash: "#login" });
    expect(getAppMode()).toBe("login");
  });

  test("returns login for /login path", () => {
    mockLocation({ pathname: "/login", hash: "" });
    expect(getAppMode()).toBe("login");
  });

  test("returns admin for #admin hash", () => {
    mockLocation({ pathname: "/", hash: "#admin" });
    expect(getAppMode()).toBe("admin");
  });

  test("returns admin for /admin path", () => {
    mockLocation({ pathname: "/admin", hash: "" });
    expect(getAppMode()).toBe("admin");
  });
});
