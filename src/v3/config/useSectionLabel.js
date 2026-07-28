import { usePortfolioSection } from "./PortfolioContentContext";

/**
 * Section title/subtitle overrides for results vs resume mode.
 * @param {string} sectionId
 * @param {{ title?: string, subtitle?: string, accent?: string }} fallback
 */
export function useSectionLabel(sectionId, fallback = {}) {
  const labels = usePortfolioSection("sectionLabels") || {};
  return labels[sectionId] || fallback;
}
