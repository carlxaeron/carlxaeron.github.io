import { useCallback, useEffect, useState } from "react";
import {
  buildPortfolioVariantUrl,
  getPortfolioVariant,
  getToggledPortfolioVariant,
  PORTFOLIO_VARIANTS,
} from "./portfolioVariant";

function readVariantFromLocation() {
  if (typeof window === "undefined") return PORTFOLIO_VARIANTS.RESULTS;
  return getPortfolioVariant(window.location.search);
}

/**
 * Keeps portfolio variant in sync with `?resume` / `?cv` URL params.
 */
export function usePortfolioVariantFromUrl() {
  const [variant, setVariant] = useState(readVariantFromLocation);

  useEffect(() => {
    const syncFromUrl = () => setVariant(readVariantFromLocation());
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const setVariantUrl = useCallback((nextVariant) => {
    if (typeof window === "undefined") return;
    const nextUrl = buildPortfolioVariantUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: "#home",
      variant: nextVariant,
    });
    window.history.replaceState(null, "", nextUrl);
    setVariant(nextVariant);
  }, []);

  const toggleVariant = useCallback(() => {
    if (typeof window === "undefined") return;
    const nextVariant = getToggledPortfolioVariant(window.location.search);
    setVariantUrl(nextVariant);
  }, [setVariantUrl]);

  return { variant, setVariant: setVariantUrl, toggleVariant };
}
