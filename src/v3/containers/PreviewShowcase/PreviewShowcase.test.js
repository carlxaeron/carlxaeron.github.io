import { render, screen } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError } from "./PreviewShowcase";

describe("PreviewShowcase", () => {
  test("renders desktop and mobile preview frames without hostname", () => {
    render(
      <PreviewShowcase
        previewUrl="https://bamboo-grove-cafe.netlify.app"
        label="Sample Business Quotation Site"
      />
    );

    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByText("Sample Business Quotation Site")).toBeInTheDocument();
    expect(screen.queryByText(/\.netlify\.app/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile preview/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/preview of Sample Business/i)).toHaveLength(2);
    expect(screen.getByText(/Scroll inside each preview to explore/i)).toBeInTheDocument();
    expect(screen.getByText(/Scroll inside the phone to explore/i)).toBeInTheDocument();
    expect(screen.queryByText(/Open live site/i)).not.toBeInTheDocument();
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
