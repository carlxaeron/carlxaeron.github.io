import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CMS_SECTION_IDS } from "./portfolioContentSections";
import { PORTFOLIO_CONTENT_DEFAULTS } from "./portfolioContentDefaults";
import { fetchContentSection } from "./portfolioContentLoader";
import { getProjectDetails as getStaticProjectDetails } from "../data/projectDetails";

const PortfolioContentContext = createContext(null);

export function PortfolioContentProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const results = await Promise.all(
        CMS_SECTION_IDS.map(async (section) => {
          const content = await fetchContentSection(section);
          return [section, content];
        })
      );

      if (cancelled) return;

      const next = {};
      results.forEach(([section, content]) => {
        if (content != null) next[section] = content;
      });

      setOverrides(next);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const getSection = useCallback(
    (sectionId) => {
      if (overrides[sectionId] != null) return overrides[sectionId];
      return PORTFOLIO_CONTENT_DEFAULTS[sectionId] ?? null;
    },
    [overrides]
  );

  const getProjectDetails = useCallback(
    (projectId) => {
      const cmsDetails = overrides.projectDetails;
      if (cmsDetails && projectId && cmsDetails[projectId]) {
        return cmsDetails[projectId];
      }
      return getStaticProjectDetails(projectId);
    },
    [overrides.projectDetails]
  );

  const value = useMemo(
    () => ({
      ready,
      overrides,
      getSection,
      getProjectDetails,
    }),
    [ready, overrides, getSection, getProjectDetails]
  );

  return (
    <PortfolioContentContext.Provider value={value}>
      {children}
    </PortfolioContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const ctx = useContext(PortfolioContentContext);
  if (!ctx) {
    return {
      ready: true,
      overrides: {},
      getSection: (sectionId) => PORTFOLIO_CONTENT_DEFAULTS[sectionId] ?? null,
      getProjectDetails: getStaticProjectDetails,
    };
  }
  return ctx;
}

export function usePortfolioSection(sectionId) {
  const { getSection } = usePortfolioContent();
  return getSection(sectionId);
}
