import { render, fireEvent, act } from "@testing-library/react";
import V3Portfolio from "./Portfolio";

jest.mock("../../../components/ChatAgent", () => () => null);
jest.mock("../../components/HamburgerMenu", () => () => null);
jest.mock("../../components/NavDots", () => () => null);

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
jest.mock("./Contact", () => () => <section>Contact content</section>);

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
