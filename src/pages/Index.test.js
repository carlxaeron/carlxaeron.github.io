import { render, screen } from "@testing-library/react";
import Index from "./Index";
import { ADMIN_TOKEN_KEY } from "../v3/admin/adminAuth";

jest.mock("../components/ChatAgent", () => () => null);
jest.mock("../v3/containers/Portfolio/Portfolio", () => () => (
  <div data-testid="portfolio-mock">Portfolio</div>
));
jest.mock("../v3/admin/AdminLogin", () => () => (
  <div data-testid="admin-login-mock">Admin Login</div>
));
jest.mock("../v3/admin/AdminDashboard", () => () => (
  <div data-testid="admin-dashboard-mock">Admin Dashboard</div>
));

const originalLocation = window.location;
const originalReplaceState = window.history.replaceState;

function mockLocation({ search = "", pathname = "/", hash = "" }) {
  delete window.location;
  window.location = {
    ...originalLocation,
    search,
    pathname,
    hash,
    href: `http://localhost${pathname}${search}${hash}`,
  };
}

function mockSearch(search) {
  mockLocation({ search, pathname: "/", hash: "" });
}

describe("Index preview routing", () => {
  beforeEach(() => {
    window.history.replaceState = jest.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history.replaceState = originalReplaceState;
  });

  test("renders portfolio when no preview query", () => {
    mockSearch("");
    render(<Index />);
    expect(screen.getByTestId("portfolio-mock")).toBeInTheDocument();
  });

  test("renders preview showcase for whitelisted legacy hostname", () => {
    mockSearch("?preview=bamboo-grove-cafe.netlify.app");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.queryByTestId("portfolio-mock")).not.toBeInTheDocument();
  });

  test("renders preview showcase for short slug", () => {
    mockSearch("?preview=jk-construction");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByText(/JK Construction Services/i)).toBeInTheDocument();
    expect(screen.queryByText(/\.netlify\.app/i)).not.toBeInTheDocument();
  });

  test("normalizes legacy hostname to slug in the URL bar", () => {
    mockSearch("?preview=bamboo-grove-cafe.netlify.app");
    window.location.href = "http://localhost/?preview=bamboo-grove-cafe.netlify.app";
    render(<Index />);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      expect.stringContaining("preview=quotation")
    );
  });

  test("does not replaceState when preview already uses slug", () => {
    mockSearch("?preview=jk-construction");
    window.location.href = "http://localhost/?preview=jk-construction";
    render(<Index />);

    expect(window.history.replaceState).not.toHaveBeenCalled();
  });

  test("renders error for disallowed preview key", () => {
    mockSearch("?preview=evil.com");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
  });

  test("renders error for unknown slug", () => {
    mockSearch("?preview=evil-slug");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
    expect(screen.getByText(/evil-slug/i)).toBeInTheDocument();
  });
});

describe("Index admin routing", () => {
  beforeEach(() => {
    window.history.replaceState = jest.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history.replaceState = originalReplaceState;
  });

  test("renders login for #login hash", () => {
    mockLocation({ hash: "#login" });
    render(<Index />);
    expect(screen.getByTestId("admin-login-mock")).toBeInTheDocument();
    expect(screen.queryByTestId("portfolio-mock")).not.toBeInTheDocument();
  });

  test("renders dashboard for #admin when token present", () => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, "test-token");
    mockLocation({ hash: "#admin" });
    render(<Index />);
    expect(screen.getByTestId("admin-dashboard-mock")).toBeInTheDocument();
  });

  test("does not render dashboard for #admin without token", () => {
    mockLocation({ hash: "#admin" });
    render(<Index />);
    expect(screen.queryByTestId("admin-dashboard-mock")).not.toBeInTheDocument();
  });
});
