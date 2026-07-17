import { render, fireEvent, act, screen } from "@testing-library/react";
import V3Portfolio from "./Portfolio";

jest.mock("../../../components/ChatAgent", () => () => null);
jest.mock("../../components/HamburgerMenu", () => () => null);
jest.mock("../../components/NavDots", () => () => null);

jest.mock("../../admin/useAppMode", () => ({
  navigateToLogin: jest.fn(),
}));

jest.mock("../../utils/isStandalonePwa", () => ({
  isStandalonePwa: jest.fn(() => false),
}));


jest.mock("./theme-provider", () => {
  const React = require("react");
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    useStore: () => ({
      value: { isMobile: false, modal: { show: false, title: "", body: null } },
      setValue: jest.fn(),
    }),
  };
});

jest.mock("./Home", () => () => (
  <section>
    <div data-testid="home-scrollable" className="v3-scrollable">
      Home content
    </div>
  </section>
));
jest.mock("./About", () => () => <section>About content</section>);
jest.mock("./Skills", () => () => <section>Skills content</section>);
jest.mock("./Experience", () => () => <section>Experience content</section>);
jest.mock("./Projects", () => () => <section>Projects content</section>);
jest.mock("./Blog", () => () => <section>Blog content</section>);
jest.mock("./Contact", () => () => <section>Contact content</section>);
jest.mock("./Quote", () => () => <section>Quote content</section>);

describe("V3Portfolio wheel navigation", () => {
  beforeEach(() => {
    window.location.hash = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("does not navigate section while active scrollable can still scroll", () => {
    const { getByTestId } = render(<V3Portfolio />);
    const scrollable = getByTestId("home-scrollable");

    Object.defineProperty(scrollable, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scrollable, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(scrollable, "scrollTop", { configurable: true, writable: true, value: 100 });

    fireEvent.wheel(scrollable, { deltaY: 120 });
    expect(window.location.hash).toBe("");
  });

  test("navigates to next section when active scrollable is at bottom", () => {
    const { getByTestId } = render(<V3Portfolio />);
    const scrollable = getByTestId("home-scrollable");

    Object.defineProperty(scrollable, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scrollable, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(scrollable, "scrollTop", { configurable: true, writable: true, value: 700 });

    fireEvent.wheel(scrollable, { deltaY: 120 });
    expect(window.location.hash).toBe("#about");
  });
});

function fireSwipeOnElement(element, { startY, endY }) {
  act(() => {
    element.dispatchEvent(
      new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [{ clientY: startY }],
      })
    );
  });
  act(() => {
    element.dispatchEvent(
      new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        changedTouches: [{ clientY: endY }],
      })
    );
  });
}

describe("V3Portfolio touch navigation", () => {
  beforeEach(() => {
    window.location.hash = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("does not navigate section when active scrollable can still scroll", () => {
    const { getByTestId } = render(<V3Portfolio />);
    const scrollable = getByTestId("home-scrollable");

    Object.defineProperty(scrollable, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scrollable, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(scrollable, "scrollTop", { configurable: true, writable: true, value: 100 });

    fireSwipeOnElement(scrollable, { startY: 200, endY: 100 });
    expect(window.location.hash).toBe("");
  });

  test("navigates to next section when active scrollable is at bottom", () => {
    const { getByTestId } = render(<V3Portfolio />);
    const scrollable = getByTestId("home-scrollable");

    Object.defineProperty(scrollable, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(scrollable, "clientHeight", { configurable: true, value: 300 });
    Object.defineProperty(scrollable, "scrollTop", { configurable: true, writable: true, value: 700 });

    fireSwipeOnElement(scrollable, { startY: 200, endY: 100 });
    expect(window.location.hash).toBe("#about");
  });
});

describe("V3Portfolio section id navigation", () => {
  beforeEach(() => {
    window.location.hash = "";
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    delete window.__v3Navigate;
  });

  test("navigateToSection accepts section ids for hero CTAs", () => {
    render(<V3Portfolio />);

    act(() => {
      window.__v3Navigate("projects");
    });
    expect(window.location.hash).toBe("#projects");

    act(() => {
      jest.advanceTimersByTime(900);
    });

    act(() => {
      window.__v3Navigate("contact");
    });
    expect(window.location.hash).toBe("#contact");
  });
});

describe("V3Portfolio admin login link", () => {
  const { isStandalonePwa } = require("../../utils/isStandalonePwa");

  beforeEach(() => {
    isStandalonePwa.mockReturnValue(false);
  });

  test("hides Login link when not standalone PWA", () => {
    render(<V3Portfolio />);
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  test("renders Login link in desktop header nav when standalone PWA", () => {
    isStandalonePwa.mockReturnValue(true);
    render(<V3Portfolio />);
    const link = screen.getByRole("link", { name: "Login" });
    expect(link).toHaveAttribute("href", "#login");
    expect(link).toHaveClass("v3-nav-login--desktop");
  });
});
