import { render, screen, fireEvent } from "@testing-library/react";
import NavLoginLink from "./NavLoginLink";
import { navigateToLogin } from "../admin/useAppMode";
import { isStandalonePwa } from "../utils/isStandalonePwa";

jest.mock("../admin/useAppMode", () => ({
  navigateToLogin: jest.fn(),
}));

jest.mock("../utils/isStandalonePwa", () => ({
  isStandalonePwa: jest.fn(),
}));

describe("NavLoginLink", () => {
  beforeEach(() => {
    navigateToLogin.mockClear();
    isStandalonePwa.mockReset();
  });

  test("renders nothing in a normal browser tab", () => {
    isStandalonePwa.mockReturnValue(false);

    const { container } = render(<NavLoginLink />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
  });

  test("renders Login link with #login href when installed as PWA", () => {
    isStandalonePwa.mockReturnValue(true);

    render(<NavLoginLink />);
    const link = screen.getByRole("link", { name: "Login" });
    expect(link).toHaveAttribute("href", "#login");
    expect(link).toHaveClass("v3-nav-login");
  });

  test("calls navigateToLogin and optional onNavigate on click in PWA mode", () => {
    isStandalonePwa.mockReturnValue(true);
    const onNavigate = jest.fn();
    render(<NavLoginLink onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole("link", { name: "Login" }));

    expect(navigateToLogin).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  test("applies extra className when provided in PWA mode", () => {
    isStandalonePwa.mockReturnValue(true);

    render(<NavLoginLink className="v3-nav-login--overlay" />);
    expect(screen.getByRole("link", { name: "Login" })).toHaveClass(
      "v3-nav-login",
      "v3-nav-login--overlay"
    );
  });
});
