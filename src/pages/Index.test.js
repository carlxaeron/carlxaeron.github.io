import { render, screen } from "@testing-library/react";
import Index from "./Index";
import { ADMIN_TOKEN_KEY } from "../v3/admin/adminAuth";

jest.mock("../components/ChatAgent", () => () => null);
jest.mock("react-helmet", () => ({
  Helmet: ({ children }) => <>{children}</>,
}));
jest.mock("../v3/containers/Portfolio/Portfolio", () => () => (
  <div data-testid="portfolio-mock">Portfolio</div>
));
jest.mock("../v3/admin/AdminLogin", () => () => (
  <div data-testid="admin-login-mock">Admin Login</div>
));
jest.mock("../v3/admin/AdminDashboard", () => () => (
  <div data-testid="admin-dashboard-mock">Admin Dashboard</div>
));
jest.mock("../v3/containers/AgreementSign/AgreementSign", () => ({ token }) => (
  <div data-testid="agreement-sign-mock">Agreement Sign {token}</div>
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

  test("does not add noindex robots meta in portfolio mode", () => {
    mockSearch("");
    render(<Index />);
    expect(document.querySelector('meta[name="robots"][content="noindex, nofollow"]')).toBeNull();
  });

  test("adds noindex robots meta for preview mode", () => {
    mockSearch("?preview=jk-construction");
    render(<Index />);
    expect(document.querySelector('meta[name="robots"][content="noindex, nofollow"]')).toBeTruthy();
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
    expect(document.querySelector('meta[name="robots"][content="noindex, nofollow"]')).toBeTruthy();
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

describe("Index admin scroll shell", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("v3-admin-active");
    document.body.classList.remove("v3-admin-active");
    window.history.replaceState = jest.fn();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history.replaceState = originalReplaceState;
    document.documentElement.classList.remove("v3-admin-active");
    document.body.classList.remove("v3-admin-active");
  });

  test("adds v3-admin-active on html and body for #login", () => {
    mockLocation({ hash: "#login" });
    render(<Index />);
    expect(document.documentElement.classList.contains("v3-admin-active")).toBe(true);
    expect(document.body.classList.contains("v3-admin-active")).toBe(true);
  });

  test("adds v3-admin-active on html and body for #admin with token", () => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, "test-token");
    mockLocation({ hash: "#admin" });
    render(<Index />);
    expect(document.documentElement.classList.contains("v3-admin-active")).toBe(true);
    expect(document.body.classList.contains("v3-admin-active")).toBe(true);
  });

  test("does not add v3-admin-active in portfolio mode", () => {
    mockSearch("");
    render(<Index />);
    expect(document.documentElement.classList.contains("v3-admin-active")).toBe(false);
    expect(document.body.classList.contains("v3-admin-active")).toBe(false);
  });

  test("removes v3-admin-active on unmount", () => {
    mockLocation({ hash: "#login" });
    const { unmount } = render(<Index />);
    expect(document.body.classList.contains("v3-admin-active")).toBe(true);
    unmount();
    expect(document.documentElement.classList.contains("v3-admin-active")).toBe(false);
    expect(document.body.classList.contains("v3-admin-active")).toBe(false);
  });
});

describe("Index sign routing", () => {
  beforeEach(() => {
    window.history.replaceState = jest.fn();
    sessionStorage.clear();
    document.documentElement.classList.remove("v3-sign-active");
    document.body.classList.remove("v3-sign-active");
  });

  afterEach(() => {
    window.location = originalLocation;
    window.history.replaceState = originalReplaceState;
    document.documentElement.classList.remove("v3-sign-active");
    document.body.classList.remove("v3-sign-active");
  });

  test("renders AgreementSign for ?sign= token", () => {
    mockSearch("?sign=tok-abc");
    render(<Index />);
    expect(screen.getByTestId("agreement-sign-mock")).toBeInTheDocument();
    expect(screen.getByText(/tok-abc/)).toBeInTheDocument();
    expect(screen.queryByTestId("portfolio-mock")).not.toBeInTheDocument();
    expect(document.querySelector('meta[name="robots"][content="noindex, nofollow"]')).toBeTruthy();
  });

  test("adds v3-sign-active on html and body", () => {
    mockSearch("?sign=tok-abc");
    render(<Index />);
    expect(document.documentElement.classList.contains("v3-sign-active")).toBe(true);
    expect(document.body.classList.contains("v3-sign-active")).toBe(true);
  });

  test("removes v3-sign-active on unmount", () => {
    mockSearch("?sign=tok-abc");
    const { unmount } = render(<Index />);
    expect(document.body.classList.contains("v3-sign-active")).toBe(true);
    unmount();
    expect(document.documentElement.classList.contains("v3-sign-active")).toBe(false);
    expect(document.body.classList.contains("v3-sign-active")).toBe(false);
  });
});
