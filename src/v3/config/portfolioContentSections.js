/** CMS section ids — must match Laravel PortfolioContentService::SECTIONS */
export const CMS_SECTION_IDS = [
  "hero",
  "about",
  "header",
  "skills",
  "experiences",
  "companies",
  "projectDetails",
];

/** Loaded with CMS content; edited via Admin Settings tab (not raw CMS JSON). */
export const SETTINGS_SECTION_ID = "settings";

export const CMS_SECTION_LABELS = {
  hero: "Hero (Home)",
  about: "About",
  header: "SEO / Header meta",
  skills: "Skills",
  experiences: "Experience",
  companies: "Projects / Companies",
  projectDetails: "Project detail copy",
  settings: "Site settings",
};

export const PORTFOLIO_SECTION_TOGGLE_IDS = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "blog",
  "insights",
  "contact",
  "quote",
];
