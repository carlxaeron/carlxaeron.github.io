import { EXPERIENCES, COMPANIES, SKILLS } from "../../external-config";

export const RESULTS_HERO = {
  eyebrow: "Senior engineer · 12 years in production",
  nameLine1: "Carl Louis",
  nameLine2: "Manuel",
  nameAccent: "Manuel",
  subheadline:
    "I build web apps for banks, media, and product teams. Lately: banking modules at Metrobank, a full agent-app rewrite at GoAutoDial (jQuery/PHP to React/Laravel), and three sites I built from scratch at ABS-CBN. Based in the Philippines, open to remote work overseas.",
  ctaPrimary: "See the work",
  ctaSecondary: "Contact",
};

export const RESULTS_ABOUT = {
  heading: "A bit about me",
  paragraphs: [
    "I'm Carl Louis Manuel. Most of my career has been web development under normal pressure — compliance at a bank, daily use by call-center agents, campaign traffic at a TV network.",
    "At Metrobank I worked on customer banking modules in React. At GoAutoDial I led the rewrite of their agent tool and a WHMCS provisioning script. At ABS-CBN I built three properties from zero. On the side I run Tahanan, a small community app that's actually live.",
    "I'm looking for remote roles with teams outside the Philippines. If you want to know whether I can own a feature and ship it, the projects here are a better read than a list of frameworks.",
  ],
  skillTags: [
    "Banking apps",
    "React / Laravel",
    "Legacy rewrites",
    "OpenAI in products",
    "Remote",
    "Full-stack",
  ],
  stats: [
    { value: "12+", label: "Years experience" },
    { value: "3", label: "ABS-CBN sites built" },
    { value: "1", label: "GoAutoDial rewrite led" },
    { value: "50+", label: "Projects" },
  ],
};

export const RESULTS_SECTION_LABELS = {
  home: { title: "Home" },
  about: { title: "About", accent: "Me" },
  skills: { title: "Skills", subtitle: "What I use day to day" },
  experience: { title: "Experience", subtitle: "Recent roles" },
  projects: { title: "Work", subtitle: "A few things worth opening" },
  contact: {
    title: "Contact",
    subtitle: "Remote roles and contract work welcome. Tell me what you need.",
  },
};

function stripConfirmPlaceholders(html) {
  return String(html || "")
    .replace(/\[CONFIRM:[^\]]+\]/g, "")
    .replace(/<b>Impact:<\/b>/gi, "")
    .trim();
}

/** Shorter, plain-language role summaries for results mode. */
export const RESULTS_EXPERIENCES = EXPERIENCES.map((exp) => {
  const plainByCompany = {
    "Metropolitan Bank & Trust (Metrobank).": `At Metrobank I built and maintained customer-facing banking modules in React and Redux. Most days: UI from specs, API hooks (Postman, Mockoon when backend was late), tests with Jest and Cypress, releases through GitLab CI. Regular coordination with QA and business analysts.`,
    "GoAutoDial, Inc.": `GoAutoDial's agent app ran on jQuery and PHP. I rewrote it in React and Laravel — same product, new codebase. Bug reports went down after launch and the UI finally worked on mobile. I also built a WHMCS module that automated cloud provisioning they used to do manually.`,
    "UCC, Cornerstone and MNX": `Banking web modules in Laravel and Vue, plus Dragonpay payment integrations. Built a Flutter app on Firebase with real-time sync. Mix of API work, payment gateways, and mobile.`,
    "Ecoshift Corp.": `Maintained WooCommerce stores and two custom plugins. Led a move from Shopify to a custom platform. Fixed layout issues, email templates, and SEO on product pages.`,
    "ABS-CBN Corp.": `Built three websites from scratch for ABS-CBN — HTML, CSS, JS, Gulp/Webpack builds, responsive across browsers. High traffic, tight deadlines, no room for "we'll fix it later."`,
  };

  return {
    ...exp,
    jobDescription:
      plainByCompany[exp.companyName] || stripConfirmPlaceholders(exp.jobDescription),
  };
});

/** Short lines on project cards — factual, not taglines. */
export const RESULTS_COMPANIES = COMPANIES.map((company) => ({
  ...company,
  projects: (company.projects || []).map((project) => {
    const resultLines = {
      tahanan: "Community app I built and run",
      "ojp-workflow": "Job search automation I use myself",
      mb1: "Metrobank banking module",
      agent: "Agent app — jQuery/PHP to React/Laravel",
      sc: "Star Cinema — built from scratch",
      kty: "Kapamilya Thank You campaign site",
      push: "Push site redesign",
      eco: "Shopify to WooCommerce migration",
    };
    const resultLine = resultLines[project.id];
    return resultLine ? { ...project, resultLine } : project;
  }),
}));

export const RESULTS_SETTINGS = {
  contactSubtitle:
    "Remote roles and contract work welcome. Drop a note with what you need and I'll get back to you.",
  sections: {
    home: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    blog: false,
    insights: false,
    contact: true,
    quote: false,
  },
};

export const RESULTS_PORTFOLIO_CONTENT = {
  hero: RESULTS_HERO,
  about: RESULTS_ABOUT,
  experiences: RESULTS_EXPERIENCES,
  companies: RESULTS_COMPANIES,
  skills: SKILLS,
  sectionLabels: RESULTS_SECTION_LABELS,
  settings: RESULTS_SETTINGS,
};

export const RESULTS_SEO = {
  title: "Carl Louis Manuel — Senior Full-Stack Engineer (Remote)",
  description:
    "12+ years building web apps for Metrobank, ABS-CBN, GoAutoDial, and others. React, Laravel, Firebase, OpenAI. Based in the Philippines, available for remote work.",
};

export const RESUME_SEO = {
  title:
    "Carl Louis Manuel — Building AI-Powered Applications | Full-Stack Engineer & SaaS Builder",
  description:
    "Building AI-powered enterprise applications and SaaS products. 12+ years across banks, media companies & enterprises — ReactJS, Laravel, OpenAI API, Flutter, Firebase. Senior Full-Stack Engineer based in the Philippines.",
};
