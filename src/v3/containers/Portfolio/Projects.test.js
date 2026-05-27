import { render, screen, waitFor } from "@testing-library/react";
import V3Projects from "./Projects";

describe("V3Projects", () => {
  test("loads project images with direct src when section is active", async () => {
    render(<V3Projects isActive={true} />);

    await waitFor(() => {
      const img = screen.getByAltText("AppKey");
      expect(img).toHaveAttribute("src", "/static/images/sites/resized-images/mb1.png");
      expect(img.getAttribute("data-src")).toBeNull();
    });
  });

  test("does not render projects without a valid id", () => {
    render(<V3Projects isActive={true} />);
    expect(screen.queryByAltText("Project")).not.toBeInTheDocument();
  });
});
