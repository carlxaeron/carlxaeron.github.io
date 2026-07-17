import { isStandalonePwa } from "./isStandalonePwa";

describe("isStandalonePwa", () => {
  const originalMatchMedia = window.matchMedia;
  const originalStandalone = window.navigator.standalone;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      writable: true,
      value: originalStandalone,
    });
  });

  test("returns true when display-mode is standalone", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === "(display-mode: standalone)",
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: false,
    });

    expect(isStandalonePwa()).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith("(display-mode: standalone)");
  });

  test("returns true for iOS navigator.standalone when matchMedia does not match", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: true,
    });

    expect(isStandalonePwa()).toBe(true);
  });

  test("returns false in a normal browser tab", () => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: false,
    });

    expect(isStandalonePwa()).toBe(false);
  });

  test("returns false when matchMedia is unavailable and standalone is unset", () => {
    window.matchMedia = undefined;
    Object.defineProperty(window.navigator, "standalone", {
      configurable: true,
      value: undefined,
    });

    expect(isStandalonePwa()).toBe(false);
  });
});
