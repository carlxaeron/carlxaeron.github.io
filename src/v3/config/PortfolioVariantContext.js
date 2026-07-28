import { createContext, useContext, useMemo } from "react";
import { PORTFOLIO_VARIANTS } from "./portfolioVariant";

const PortfolioVariantContext = createContext(PORTFOLIO_VARIANTS.RESULTS);

/**
 * @param {{ children: import('react').ReactNode, variant?: import('./portfolioVariant').PortfolioVariant }} props
 */
export function PortfolioVariantProvider({ children, variant = PORTFOLIO_VARIANTS.RESULTS }) {
  const value = useMemo(() => variant, [variant]);
  return (
    <PortfolioVariantContext.Provider value={value}>
      {children}
    </PortfolioVariantContext.Provider>
  );
}

/** @returns {import('./portfolioVariant').PortfolioVariant} */
export function usePortfolioVariant() {
  return useContext(PortfolioVariantContext);
}

export function isResultsVariant(variant) {
  return variant === PORTFOLIO_VARIANTS.RESULTS;
}
