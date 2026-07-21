import { render, screen } from "@testing-library/react";
import V3About from "./About";

describe("V3About", () => {
  test("uses inner scroll wrapper without overflow hidden on scroll node", () => {
    render(<V3About isActive={true} />);

    const section = document.getElementById("about");
    const scrollable = screen.getByTestId("about-scrollable");

    expect(section).toHaveClass("v3-section-body");
    expect(section).not.toHaveClass("v3-scrollable");
    expect(section.style.overflow).toBe("hidden");

    expect(scrollable).toHaveClass("v3-inner", "v3-scrollable", "v3-section-scroll");
    expect(scrollable.style.overflow).not.toBe("hidden");
  });

  test("renders profile avatar and bio", () => {
    render(<V3About isActive={true} />);

    const avatar = screen.getByAltText("Carl Louis Manuel");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "/static/images/profile3.jpg");
    expect(screen.getByText(/I'm Carl Louis Manuel/i)).toBeInTheDocument();
    expect(screen.getByText(/Years Experience/i)).toBeInTheDocument();
  });
});
