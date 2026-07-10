import { render, screen } from "@testing-library/react";
import Index from "./Index";

jest.mock("../components/ChatAgent", () => () => null);
jest.mock("../v3/containers/Portfolio/Portfolio", () => () => (
  <div data-testid="portfolio-mock">Portfolio</div>
));

const originalLocation = window.location;

function mockSearch(search) {
  delete window.location;
  window.location = { ...originalLocation, search, href: `http://localhost/${search}` };
}

describe("Index preview routing", () => {
  afterEach(() => {
    window.location = originalLocation;
  });

  test("renders portfolio when no preview query", () => {
    mockSearch("");
    render(<Index />);
    expect(screen.getByTestId("portfolio-mock")).toBeInTheDocument();
  });

  test("renders preview showcase for whitelisted host", () => {
    mockSearch("?preview=quotation.netlify.app");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.queryByTestId("portfolio-mock")).not.toBeInTheDocument();
  });

  test("renders error for disallowed host", () => {
    mockSearch("?preview=evil.com");
    render(<Index />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
  });
});
