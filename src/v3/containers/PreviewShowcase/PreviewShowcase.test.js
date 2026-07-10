import { render, screen } from "@testing-library/react";
import PreviewShowcase, { PreviewShowcaseError } from "./PreviewShowcase";
import {
  isPreviewHostAllowed,
  resolvePreviewUrl,
} from "../../config/previewWhitelist";

describe("previewWhitelist", () => {
  test("allows quotation.netlify.app", () => {
    expect(isPreviewHostAllowed("quotation.netlify.app")).toBe(true);
    const resolved = resolvePreviewUrl("quotation.netlify.app");
    expect(resolved?.url).toBe("https://quotation.netlify.app");
    expect(resolved?.host).toBe("quotation.netlify.app");
  });

  test("allows netlify.app subdomains", () => {
    expect(isPreviewHostAllowed("demo-client.netlify.app")).toBe(true);
  });

  test("rejects evil.com", () => {
    expect(isPreviewHostAllowed("evil.com")).toBe(false);
    expect(resolvePreviewUrl("evil.com")).toBeNull();
  });

  test("strips protocol from preview value", () => {
    const resolved = resolvePreviewUrl("https://quotation.netlify.app/path");
    expect(resolved?.host).toBe("quotation.netlify.app");
  });
});

describe("PreviewShowcase", () => {
  test("renders desktop and mobile preview frames", () => {
    render(
      <PreviewShowcase
        previewUrl="https://quotation.netlify.app"
        host="quotation.netlify.app"
        label="Sample Business Quotation Site"
      />
    );

    expect(screen.getByTestId("preview-showcase")).toBeInTheDocument();
    expect(screen.getByText("Sample Business Quotation Site")).toBeInTheDocument();
    expect(screen.getByLabelText(/Desktop preview/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile preview/i)).toBeInTheDocument();
    expect(screen.getAllByTitle(/preview of Sample Business/i)).toHaveLength(2);
  });
});

describe("PreviewShowcaseError", () => {
  test("shows error when host not allowed", () => {
    render(<PreviewShowcaseError host="evil.com" />);
    expect(screen.getByTestId("preview-showcase-error")).toBeInTheDocument();
    expect(screen.getByText(/Preview not available/i)).toBeInTheDocument();
    expect(screen.getByText(/evil.com/i)).toBeInTheDocument();
  });
});
