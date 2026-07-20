import { getAppMode, getSignTokenFromSearch } from "./useAppMode";

const originalLocation = window.location;

function mockLocation({ pathname = "/", hash = "", search = "", href }) {
  delete window.location;
  window.location = {
    ...originalLocation,
    pathname,
    hash,
    search,
    href: href ?? `http://localhost${pathname}${search}${hash}`,
  };
}

describe("getSignTokenFromSearch", () => {
  test("reads sign token from query string", () => {
    expect(getSignTokenFromSearch("?sign=tok123&foo=1")).toBe("tok123");
    expect(getSignTokenFromSearch("")).toBeNull();
    expect(getSignTokenFromSearch("?preview=x")).toBeNull();
  });
});

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

  test("returns sign for ?sign= token", () => {
    mockLocation({ pathname: "/", search: "?sign=abc123" });
    expect(getAppMode()).toBe("sign");
  });

  test("login hash wins over sign query", () => {
    mockLocation({ pathname: "/", hash: "#login", search: "?sign=abc123" });
    expect(getAppMode()).toBe("login");
  });
});
