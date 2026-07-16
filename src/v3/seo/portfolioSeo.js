/**
 * SEO helpers and static prerender HTML for the main portfolio landing page.
 * Used at build time (scripts/inject-seo-prerender.cjs) and runtime (SeoHead).
 */

const { SKILLS, EXPERIENCES, COMPANIES } = require("../../external-config");

const SITE_URL = "https://carlmanuel.com";

const V3_GREEN_DARK = "#00473e";
const V3_GREEN_MID = "#1E3932";
const V3_GREEN_ACCENT = "#00A862";
const V3_GREEN_LIGHT = "#D4E9E2";

const PORTFOLIO_SEO = {
  siteUrl: SITE_URL,
  title:
    "Carl Louis Manuel — Building AI-Powered Applications | Full-Stack Engineer & SaaS Builder",
  description:
    "Building AI-powered enterprise applications and SaaS products. 12+ years across banks, media companies & enterprises — ReactJS, Laravel, OpenAI API, Flutter, Firebase. Senior Full-Stack Engineer based in the Philippines.",
  hero: {
    eyebrow: "Building AI-Powered Enterprise Applications",
    nameLine1: "Carl Louis",
    nameLine2: "Manuel",
    subheadline:
      "12+ years architecting production-grade systems for banks, media companies & enterprises — with AI built in. ReactJS · Laravel · OpenAI API · Firebase · Flutter",
  },
  about: {
    heading: "I'm Carl Louis Manuel",
    intro:
      "I build AI-powered applications and automation workflows that enterprises actually ship. With 12+ years across banking, media, and technology — I've led full-stack delivery at Metrobank, ABS-CBN, and GoAutoDial.",
  },
  contact: {
    email: "info@carlmanuel.com",
    github: "https://github.com/carlxaeron",
    linkedin: "https://linkedin.com/in/carlxaeron",
  },
  sections: [
    { id: "home", title: "Home" },
    { id: "about", title: "About" },
    { id: "skills", title: "Skills" },
    { id: "experience", title: "Experience" },
    { id: "projects", title: "Projects" },
    { id: "contact", title: "Contact" },
    { id: "quote", title: "Get a Quote" },
  ],
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function topSkillNames(limit = 12) {
  return SKILLS.filter((skill) => !skill.parent)
    .slice(0, limit)
    .map((skill) => skill.name);
}

function topExperienceEntries(limit = 5) {
  return EXPERIENCES.slice(0, limit).map((entry) => ({
    company: entry.companyName || entry.company || "",
    role: entry.jobTitle || entry.position || "",
  }));
}

function topProjectNames(limit = 6) {
  const names = [];
  for (const group of COMPANIES) {
    if (group.title) names.push(group.title);
    for (const project of group.projects || []) {
      if (project.title) names.push(project.title);
      if (names.length >= limit) break;
    }
    if (names.length >= limit) break;
  }
  return names.slice(0, limit);
}

/**
 * @param {{ appMode?: string, previewQuery?: string | null }} options
 * @returns {boolean}
 */
function shouldNoIndex({ appMode = "portfolio", previewQuery = null } = {}) {
  if (appMode === "login" || appMode === "admin") return true;
  if (previewQuery && String(previewQuery).trim()) return true;
  return false;
}

/**
 * Inline boot styles — must live in index.html (not the CSS bundle) so slow networks
 * hide #seo-prerender before React/CSS hydrate.
 */
function buildPrerenderBootStyles() {
  return `<style id="seo-prerender-boot">
html, body {
  margin: 0;
  background: ${V3_GREEN_DARK};
  overflow: hidden;
}
#seo-prerender {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
#app-boot-shell {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(165deg, ${V3_GREEN_DARK} 0%, ${V3_GREEN_MID} 55%, ${V3_GREEN_DARK} 100%);
  color: ${V3_GREEN_LIGHT};
  font-family: "Playfair Display", Georgia, "Times New Roman", serif;
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-weight: 400;
  letter-spacing: 0.03em;
  pointer-events: none;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}
#app-boot-shell .boot-accent {
  color: ${V3_GREEN_ACCENT};
}
html.v3-app-ready #app-boot-shell {
  opacity: 0;
  visibility: hidden;
}
@media (prefers-reduced-motion: reduce) {
  #app-boot-shell { transition: none; }
}
</style>`;
}

function buildBootShellHtml() {
  return `<div id="app-boot-shell" aria-hidden="true">Carl <span class="boot-accent">Manuel</span></div>`;
}

function buildPrerenderHtml() {
  const { hero, about, contact, sections } = PORTFOLIO_SEO;
  const skillItems = topSkillNames()
    .map((name) => `<li>${escapeHtml(name)}</li>`)
    .join("\n        ");
  const experienceItems = topExperienceEntries()
    .map(
      (entry) =>
        `<li><strong>${escapeHtml(entry.company)}</strong>${entry.role ? ` — ${escapeHtml(entry.role)}` : ""}</li>`
    )
    .join("\n        ");
  const projectItems = topProjectNames()
    .map((name) => `<li>${escapeHtml(name)}</li>`)
    .join("\n        ");
  const navLinks = sections
    .map(
      (section) =>
        `<a href="${SITE_URL}/#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a>`
    )
    .join("\n      ");

  return `<main id="seo-prerender" aria-label="Carl Louis Manuel — portfolio">
    <header id="home">
      <p>${escapeHtml(hero.eyebrow)}</p>
      <h1>${escapeHtml(hero.nameLine1)} ${escapeHtml(hero.nameLine2)}</h1>
      <p>${escapeHtml(hero.subheadline)}</p>
    </header>
    <section id="about">
      <h2>${escapeHtml(about.heading)}</h2>
      <p>${escapeHtml(about.intro)}</p>
    </section>
    <section id="skills">
      <h2>Skills</h2>
      <ul>
        ${skillItems}
      </ul>
    </section>
    <section id="experience">
      <h2>Experience</h2>
      <ul>
        ${experienceItems}
      </ul>
    </section>
    <section id="projects">
      <h2>Projects</h2>
      <ul>
        ${projectItems}
      </ul>
    </section>
    <section id="contact">
      <h2>Contact</h2>
      <p>Email: <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>
      <p>GitHub: <a href="${escapeHtml(contact.github)}">${escapeHtml(contact.github)}</a></p>
      <p>LinkedIn: <a href="${escapeHtml(contact.linkedin)}">${escapeHtml(contact.linkedin)}</a></p>
    </section>
    <section id="quote">
      <h2>Get a Quote</h2>
      <p>Request a project quote for enterprise web development, AI integration, or SaaS builds.</p>
    </section>
    <nav aria-label="Portfolio sections">
      ${navLinks}
    </nav>
  </main>`;
}

module.exports = {
  PORTFOLIO_SEO,
  SITE_URL,
  V3_GREEN_DARK,
  V3_GREEN_MID,
  escapeHtml,
  topSkillNames,
  topExperienceEntries,
  topProjectNames,
  shouldNoIndex,
  buildPrerenderBootStyles,
  buildBootShellHtml,
  buildPrerenderHtml,
};
