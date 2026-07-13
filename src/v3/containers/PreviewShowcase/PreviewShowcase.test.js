import { render, screen } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError } from "./PreviewShowcase";
import {
  buildPreviewPortfolioUrl,
  isPreviewHostAllowed,
  resolvePreviewUrl,
} from "../../config/previewWhitelist";

describe("previewWhitelist", () => {
  test("allows bamboo-grove-cafe.netlify.app (legacy hostname)", () => {
    expect(isPreviewHostAllowed("bamboo-grove-cafe.netlify.app")).toBe(true);
    const resolved = resolvePreviewUrl("bamboo-grove-cafe.netlify.app");
    expect(resolved?.url).toBe("https://bamboo-grove-cafe.netlify.app");
    expect(resolved?.host).toBe("bamboo-grove-cafe.netlify.app");
    expect(resolved?.slug).toBe("quotation");
  });

  test("allows short preview slug", () => {
    expect(isPreviewHostAllowed("jk-construction")).toBe(true);
    const resolved = resolvePreviewUrl("jk-construction");
    expect(resolved?.url).toBe("https://jk-construction-services.netlify.app");
    expect(resolved?.slug).toBe("jk-construction");
    expect(resolved?.site?.label).toMatch(/JK Construction/i);
  });

  test("allows netlify.app subdomains", () => {
    expect(isPreviewHostAllowed("demo-client.netlify.app")).toBe(true);
  });

  test("rejects evil.com", () => {
    expect(isPreviewHostAllowed("evil.com")).toBe(false);
    expect(resolvePreviewUrl("evil.com")).toBeNull();
  });

  test("strips protocol from preview value", () => {
    const resolved = resolvePreviewUrl("https://bamboo-grove-cafe.netlify.app/path");
    expect(resolved?.host).toBe("bamboo-grove-cafe.netlify.app");
    expect(resolved?.slug).toBe("quotation");
  });

  test("buildPreviewPortfolioUrl uses slug", () => {
    expect(buildPreviewPortfolioUrl("jk-construction")).toBe(
      "https://carlmanuel.com/?preview=jk-construction"
    );
  });
});

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
});

describe("PreviewShowcaseError", () => {
  test("shows error when preview key not allowed", () => {
    render(<PreviewShowcaseError previewKey="evil.com" />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
    expect(screen.getByText(/Preview not available/i)).toBeInTheDocument();
    expect(screen.getByText(/evil.com/i)).toBeInTheDocument();
    expect(screen.queryByText(/netlify/i)).not.toBeInTheDocument();
  });
});
