import { render, screen } from "@testing-library/react";
import V3About from "./About";
import { PortfolioContentProvider } from "../../config/PortfolioContentContext";
import { PORTFOLIO_VARIANTS } from "../../config/portfolioVariant";

function renderAbout(variant = PORTFOLIO_VARIANTS.RESULTS) {
  return render(
    <PortfolioContentProvider variant={variant}>
      <V3About isActive={true} />
    </PortfolioContentProvider>
  );
}

describe("V3About", () => {
  test("uses inner scroll wrapper without overflow hidden on scroll node", () => {
    renderAbout();

    const section = document.getElementById("about");
    const scrollable = screen.getByTestId("about-scrollable");

    expect(section).toHaveClass("v3-section-body");
    expect(section).not.toHaveClass("v3-scrollable");
    expect(section.style.overflow).toBe("hidden");

    expect(scrollable).toHaveClass("v3-inner", "v3-scrollable", "v3-section-scroll");
    expect(scrollable.style.overflow).not.toBe("hidden");
  });

  test("renders profile avatar and results bio by default", () => {
    renderAbout(PORTFOLIO_VARIANTS.RESULTS);

    const avatar = screen.getByAltText("Carl Louis Manuel");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "/static/images/profile3.jpg");
    expect(screen.getByText(/A bit about me/i)).toBeInTheDocument();
    expect(screen.getByText(/Years experience/i)).toBeInTheDocument();
  });

  test("renders resume bio when variant is resume", () => {
    renderAbout(PORTFOLIO_VARIANTS.RESUME);
    expect(screen.getByText(/I'm Carl Louis Manuel/i)).toBeInTheDocument();
    expect(screen.getByText(/Years Experience/i)).toBeInTheDocument();
  });
});
