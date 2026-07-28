import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioVariantSwitch from "./PortfolioVariantSwitch";
import { PORTFOLIO_VARIANTS } from "../config/portfolioVariant";

describe("PortfolioVariantSwitch", () => {
  test("shows Resume / CV label in results mode", () => {
    render(
      <PortfolioVariantSwitch variant={PORTFOLIO_VARIANTS.RESULTS} onToggle={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: /resume or cv view/i })).toBeInTheDocument();
    expect(screen.getByText("Resume / CV")).toBeInTheDocument();
  });

  test("shows Portfolio label in resume mode", () => {
    render(
      <PortfolioVariantSwitch variant={PORTFOLIO_VARIANTS.RESUME} onToggle={jest.fn()} />
    );
    expect(screen.getByRole("button", { name: /portfolio view/i })).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  test("calls onToggle when clicked", () => {
    const onToggle = jest.fn();
    render(
      <PortfolioVariantSwitch variant={PORTFOLIO_VARIANTS.RESULTS} onToggle={onToggle} />
    );
    fireEvent.click(screen.getByTestId("portfolio-variant-switch"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
