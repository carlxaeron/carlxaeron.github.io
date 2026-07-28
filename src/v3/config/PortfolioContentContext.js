import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CMS_SECTION_IDS, SETTINGS_SECTION_ID } from "./portfolioContentSections";
import {
  PORTFOLIO_CONTENT_DEFAULTS,
  SETTINGS_DEFAULTS,
} from "./portfolioContentDefaults";
import { fetchContentSection } from "./portfolioContentLoader";
import { getProjectDetails as getStaticProjectDetails } from "../data/projectDetails";
import { PORTFOLIO_VARIANTS } from "./portfolioVariant";
import { RESULTS_PORTFOLIO_CONTENT } from "./resultsPortfolioContent";

const PortfolioContentContext = createContext(null);

function mergeSettings(partial, baseSettings = SETTINGS_DEFAULTS) {
  const base = baseSettings;
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

function getDefaultsForVariant(variant) {
  if (variant === PORTFOLIO_VARIANTS.RESUME) {
    return PORTFOLIO_CONTENT_DEFAULTS;
  }
  return {
    ...PORTFOLIO_CONTENT_DEFAULTS,
    ...RESULTS_PORTFOLIO_CONTENT,
    settings: mergeSettings(RESULTS_PORTFOLIO_CONTENT.settings, SETTINGS_DEFAULTS),
  };
}

export function PortfolioContentProvider({ children, variant = PORTFOLIO_VARIANTS.RESULTS }) {
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

  const contentDefaults = useMemo(() => getDefaultsForVariant(variant), [variant]);

  const getSection = useCallback(
    (sectionId) => {
      if (overrides[sectionId] != null) return overrides[sectionId];
      return contentDefaults[sectionId] ?? null;
    },
    [overrides, contentDefaults]
  );

  const settings = useMemo(
    () => mergeSettings(overrides[SETTINGS_SECTION_ID], contentDefaults.settings),
    [overrides, contentDefaults.settings]
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
      variant,
      overrides,
      settings,
      getSection,
      getProjectDetails,
    }),
    [ready, variant, overrides, settings, getSection, getProjectDetails]
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
    const defaults = getDefaultsForVariant(PORTFOLIO_VARIANTS.RESULTS);
    return {
      ready: true,
      variant: PORTFOLIO_VARIANTS.RESULTS,
      overrides: {},
      settings: mergeSettings(null, defaults.settings),
      getSection: (sectionId) => defaults[sectionId] ?? null,
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
