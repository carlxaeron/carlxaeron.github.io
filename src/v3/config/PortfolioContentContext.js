import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CMS_SECTION_IDS, SETTINGS_SECTION_ID } from "./portfolioContentSections";
import {
  PORTFOLIO_CONTENT_DEFAULTS,
  SETTINGS_DEFAULTS,
} from "./portfolioContentDefaults";
import { fetchContentSection } from "./portfolioContentLoader";
import { getProjectDetails as getStaticProjectDetails } from "../data/projectDetails";

const PortfolioContentContext = createContext(null);

function mergeSettings(partial) {
  const base = SETTINGS_DEFAULTS;
  if (!partial || typeof partial !== "object") return { ...base, sections: { ...base.sections } };
  return {
    ...base,
    ...partial,
    sections: {
      ...base.sections,
      ...(partial.sections && typeof partial.sections === "object" ? partial.sections : {}),
    },
  };
}

export function PortfolioContentProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const sectionIds = [...CMS_SECTION_IDS, SETTINGS_SECTION_ID];
      const results = await Promise.all(
        sectionIds.map(async (section) => {
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

  const settings = useMemo(
    () => mergeSettings(overrides[SETTINGS_SECTION_ID]),
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
      settings,
      getSection,
      getProjectDetails,
    }),
    [ready, overrides, settings, getSection, getProjectDetails]
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
      settings: mergeSettings(null),
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

export function usePortfolioSettings() {
  const { settings } = usePortfolioContent();
  return settings;
}
