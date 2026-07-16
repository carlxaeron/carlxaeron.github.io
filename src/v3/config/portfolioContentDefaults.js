import {
  SKILLS,
  EXPERIENCES,
  COMPANIES,
  HEADERCONFIG,
} from "../../external-config";
import { PROJECT_DETAILS } from "../data/projectDetails";

export const HERO_DEFAULTS = {
  eyebrow: "Building AI-Powered Enterprise Applications",
  nameLine1: "Carl Louis",
  nameLine2: "Manuel",
  nameAccent: "Manuel",
  subheadline:
    "12+ years architecting production-grade systems for banks, media companies & enterprises — with AI built in. ReactJS · Laravel · OpenAI API · Firebase · Flutter",
  ctaPrimary: "View My Work",
  ctaSecondary: "Get In Touch",
};

export const ABOUT_DEFAULTS = {
  heading: "I'm Carl Louis Manuel",
  paragraphs: [
    "I build AI-powered applications and automation workflows that enterprises actually ship. With 12+ years across banking, media, and technology — I've led full-stack delivery at Metrobank, ABS-CBN, and GoAutoDial, integrating AI features and MCP-powered tooling that solve real business problems.",
    "My stack spans pixel-perfect ReactJS frontends, secure PHP/Laravel backends, Firebase real-time systems, and OpenAI API integrations in live client-facing products. At Metrobank I helped deliver secure banking interfaces across multiple modules. At GoAutoDial I led a full legacy-to-modern migration — jQuery/PHP rewritten into a React/Laravel platform — that cut bug reports and improved agent productivity. At ABS-CBN I built 3 complete web properties from scratch serving millions of visitors.",
    "Beyond client work, I ship independently — including Tahanan, a community SaaS live in the Philippines. Whether you need enterprise-grade engineering or AI woven into your product, I bring the depth and discipline to do it right.",
  ],
  skillTags: [
    "AI Automation",
    "MCP",
    "Prompt Engineering",
    "OpenAI API",
    "AI Integration",
    "LLM Apps",
    "SaaS",
    "ReactJS",
    "Laravel",
    "Flutter",
    "Firebase",
    "Vue",
    "PHP",
    "Node.js",
  ],
  stats: [
    { value: "12+", label: "Years Experience" },
    { value: "10+", label: "Companies" },
    { value: "50+", label: "Projects" },
    { value: "2", label: "Side Projects Shipped" },
  ],
};

/** Site-wide settings consumed by the portfolio shell (sections, contact, chat, banner). */
export const SETTINGS_DEFAULTS = {
  brandName: "Carl.Manuel",
  brandAccent: "Manuel",
  announcementEnabled: false,
  announcement: "",
  showChatAgent: true,
  contactSubtitle:
    "Looking to build an enterprise-grade platform or integrate AI into your product? Let's talk.",
  contactEmail: "info@carlmanuel.com",
  contactEmailLabel: "info@carlmanuel.com",
  githubUrl: "https://github.com/carlxaeron",
  githubLabel: "github.com/carlxaeron",
  linkedinUrl: "https://linkedin.com/in/carlxaeron",
  linkedinLabel: "linkedin.com/in/carlxaeron",
  sections: {
    home: true,
    about: true,
    skills: true,
    experience: true,
    projects: true,
    blog: true,
    insights: true,
    contact: true,
    quote: true,
  },
};

export const PORTFOLIO_CONTENT_DEFAULTS = {
  hero: HERO_DEFAULTS,
  about: ABOUT_DEFAULTS,
  header: HEADERCONFIG,
  skills: SKILLS,
  experiences: EXPERIENCES,
  companies: COMPANIES,
  projectDetails: PROJECT_DETAILS,
  settings: SETTINGS_DEFAULTS,
};
