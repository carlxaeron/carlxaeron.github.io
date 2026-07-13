import { render, screen } from "@testing-library/react";
import Index from "./Index";

jest.mock("../components/ChatAgent", () => () => null);
jest.mock("../v3/containers/Portfolio/Portfolio", () => () => (
  <div data-testid="portfolio-mock">Portfolio</div>
));

const originalLocation = window.location;
const originalReplaceState = window.history.replaceState;

function mockSearch(search) {
  delete window.location;
  window.location = {
    ...originalLocation,
    search,
    href: `http://localhost/${search.replace(/^\?/, "")}${search ? "" : ""}`.replace(
      /\/$/,
      search ? `/?${search.replace(/^\?/, "")}` : "/"
    ),
  };
  if (!search) {
    window.location.href = "http://localhost/";
  } else {
    window.location.href = `http://localhost${search.startsWith("?") ? search : `?${search}`}`;
  }
}

describe("Index preview routing", () => {
  beforeEach(() => {
    window.history.replaceState = jest.fn();
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
