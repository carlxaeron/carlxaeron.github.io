import { fireEvent, render, screen } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError, buildAdminPreviewUrl } from "./PreviewShowcase";

const MOBILE_CHROME_QUERY = "(max-width: 991px)";

function mockMatchMedia(matchesByQuery) {
  const originalMatchMedia = window.matchMedia;

  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: Boolean(matchesByQuery[query]),
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

describe("buildAdminPreviewUrl", () => {
  test("appends /admin/ to site base URL", () => {
    expect(buildAdminPreviewUrl("https://villa-clara-pool.netlify.app")).toBe(
      "https://villa-clara-pool.netlify.app/admin/"
    );
    expect(buildAdminPreviewUrl("https://example.netlify.app/")).toBe(
      "https://example.netlify.app/admin/"
    );
  });
});

describe("PreviewShowcase", () => {
  test("renders four preview frames (site + admin, desktop + mobile) on wide screens", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: false });

    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
        previewSlug="quotation"
      />
    );

    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback-dock")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByText("Sample Business Quotation Site")).toBeInTheDocument();
    expect(screen.queryByText(/\.netlify\.app/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Business system \+ website sample/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Mobile preview/i)).toBeInTheDocument();
    const deviceLabels = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(deviceLabels.indexOf("Admin — Desktop")).toBeLessThan(deviceLabels.indexOf("Site — Desktop"));
    expect(screen.getAllByTitle(/preview of Sample Business/i)).toHaveLength(4);
    expect(screen.getByText(/Start with the admin frames/i)).toBeInTheDocument();
    expect(screen.getByText(/click nav to browse pages/i)).toBeInTheDocument();
    expect(screen.queryByTestId("preview-view-mode")).not.toBeInTheDocument();
    expect(screen.queryByText(/Open live site/i)).not.toBeInTheDocument();

    restoreMatchMedia();
  });

  test("defaults to admin + site mobile frames on phone-width preview", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });

    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
        previewSlug="quotation"
      />
    );

    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mobile-chrome");
    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mode-mobile");
    expect(screen.getByTestId("preview-view-mode")).toBeInTheDocument();
    expect(screen.getByText(/Swipe\/browse the phones/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Mobile preview/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admin — Desktop preview/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Site — Desktop preview/i)).not.toBeInTheDocument();
    const deviceLabels = screen.getAllByRole("heading", { level: 2 }).map((el) => el.textContent);
    expect(deviceLabels.indexOf("Admin — Mobile")).toBeLessThan(deviceLabels.indexOf("Site — Mobile"));

    restoreMatchMedia();
  });

  test("switches to desktop monitor frames when Desktop view is selected", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });
    sessionStorage.removeItem("previewViewMode:quotation");

    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
        previewSlug="quotation"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Desktop" }));

    expect(screen.getByTestId("preview-showcase")).toHaveClass("v3-preview-page--mode-desktop");
    expect(screen.getByLabelText(/Admin — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Desktop preview/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Admin — Mobile preview/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Site — Mobile preview/i)).not.toBeInTheDocument();
    expect(sessionStorage.getItem("previewViewMode:quotation")).toBe("desktop");

    restoreMatchMedia();
  });

  test("renders sticky feedback dock on mobile preview", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: true });

    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
        previewSlug="quotation"
      />
    );

    expect(screen.getByTestId("preview-feedback-dock")).toBeInTheDocument();
    expect(screen.getByText(/What do you think of this sample site/i)).toBeInTheDocument();

    restoreMatchMedia();
  });

  test("admin iframes point to /admin/ path", () => {
    const restoreMatchMedia = mockMatchMedia({ [MOBILE_CHROME_QUERY]: false });

    render(
      <PreviewShowcase
        previewUrl="https://villa-clara-pool.netlify.app"
        label="Villa Clara"
        previewSlug="villa-clara-pool"
      />
    );

    const adminFrames = screen
      .getAllByTitle(/Admin — (Desktop|Mobile) preview/i)
      .map((el) => el.getAttribute("src"));
    expect(adminFrames).toEqual([
      "https://villa-clara-pool.netlify.app/admin/",
      "https://villa-clara-pool.netlify.app/admin/",
    ]);

    restoreMatchMedia();
  });

  test("uses default title when label is omitted", () => {
    render(<PreviewShowcase previewUrl="https://example.netlify.app" />);
    expect(screen.getByRole("heading", { name: "Client site preview" })).toBeInTheDocument();
  });
});

describe("PreviewShowcaseError", () => {
  test("shows error when preview key not allowed", () => {
    render(<PreviewShowcaseError previewKey="evil.com" />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
    expect(screen.getByText(/Preview not available/i)).toBeInTheDocument();
    expect(screen.getByText(/evil.com/i)).toBeInTheDocument();
    expect(screen.queryByText(/netlify/i)).not.toBeInTheDocument();
  });

  test("shows slug-friendly hint when preview key is missing", () => {
    render(<PreviewShowcaseError previewKey={null} />);
    expect(screen.getByText(/Use \?preview=client-slug/i)).toBeInTheDocument();
    expect(screen.getByText(/jk-construction/i)).toBeInTheDocument();
    expect(screen.queryByText(/netlify/i)).not.toBeInTheDocument();
  });
});
