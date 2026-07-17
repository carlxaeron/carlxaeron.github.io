import { render, screen, fireEvent } from "@testing-library/react";
import HamburgerMenu from "./HamburgerMenu";
import { navigateToLogin } from "../admin/useAppMode";
import { isStandalonePwa } from "../utils/isStandalonePwa";

jest.mock("../containers/Portfolio/theme-provider", () => ({
  useStore: (selector) =>
    selector({ value: { isMobile: true } }),
}));

jest.mock("../admin/useAppMode", () => ({
  navigateToLogin: jest.fn(),
}));

jest.mock("../utils/isStandalonePwa", () => ({
  isStandalonePwa: jest.fn(),
}));

const sections = [
  { id: "home", title: "Home" },
  { id: "about", title: "About" },
];

describe("HamburgerMenu", () => {
  beforeEach(() => {
    navigateToLogin.mockClear();
    isStandalonePwa.mockReturnValue(true);
  });

  test("hides Login link when not standalone PWA", () => {
    isStandalonePwa.mockReturnValue(false);
    render(
      <HamburgerMenu sections={sections} currentSection={0} onNavigate={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Open navigation menu/i }));

    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  test("renders Login link in mobile overlay when standalone PWA", () => {
    render(
      <HamburgerMenu sections={sections} currentSection={0} onNavigate={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Open navigation menu/i }));

    const link = screen.getByRole("link", { name: "Login" });
    expect(link).toHaveAttribute("href", "#login");
    expect(link).toHaveClass("v3-nav-login--overlay");
  });

  test("navigates to login and closes overlay on Login click", () => {
    render(
      <HamburgerMenu sections={sections} currentSection={0} onNavigate={jest.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /Open navigation menu/i }));
    fireEvent.click(screen.getByRole("link", { name: "Login" }));

    expect(navigateToLogin).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Open navigation menu/i })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
