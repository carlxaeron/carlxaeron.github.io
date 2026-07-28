import { PORTFOLIO_VARIANTS } from "../config/portfolioVariant";

/**
 * Floating control to switch between results portfolio and resume/CV deck.
 */
export default function PortfolioVariantSwitch({ variant, onToggle }) {
  const isResume = variant === PORTFOLIO_VARIANTS.RESUME;

  return (
    <button
      type="button"
      className="v3-variant-fab"
      onClick={onToggle}
      aria-label={isResume ? "Switch to portfolio view" : "Switch to resume or CV view"}
      aria-pressed={isResume}
      data-testid="portfolio-variant-switch"
    >
      <span className="v3-variant-fab__icon" aria-hidden="true">
        {isResume ? "◉" : "▤"}
      </span>
      <span className="v3-variant-fab__label">{isResume ? "Portfolio" : "Resume / CV"}</span>
    </button>
  );
}
