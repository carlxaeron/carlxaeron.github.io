import { render, screen } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError, buildAdminPreviewUrl } from "./PreviewShowcase";

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
  test("renders four preview frames (site + admin, desktop + mobile)", () => {
    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
        previewSlug="quotation"
      />
    );

    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByTestId("preview-feedback")).toBeInTheDocument();
    expect(screen.getByText("Sample Business Quotation Site")).toBeInTheDocument();
    expect(screen.queryByText(/\.netlify\.app/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Website \+ admin system preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Site — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Admin — Mobile preview/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/preview of Sample Business/i)).toHaveLength(4);
    expect(screen.getByText(/Scroll inside each frame to explore the sample site and admin/i)).toBeInTheDocument();
    expect(screen.getByText(/click admin nav to browse pages/i)).toBeInTheDocument();
    expect(screen.queryByText(/Open live site/i)).not.toBeInTheDocument();
  });

  test("admin iframes point to /admin/ path", () => {
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
