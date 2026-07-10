/**
 * Portfolio blog / news posts — sideline client sites and product updates.
 * Public copy only — no pricing, contact details, or preview URLs.
 */

export const BLOG_CATEGORIES = ["All", "News", "Client Sites"];

export const BLOG_POSTS = [
  {
    id: "client-quotation-sideline",
    title: "Launching a local business website sideline",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "Sample one-page sites for Rodriguez-area businesses — mobile-first demos built from a reusable template and portfolio preview tooling.",
    body: `I'm expanding beyond enterprise delivery with a focused sideline: **starter websites for local businesses** in Rodriguez, Rizal and nearby areas.

Each project starts from a reusable template — services, about, contact, and maps/social links — customized to the business type and brand. Sites are static, fast, and mobile-first.

Demos can be shown through the portfolio preview UI so owners see desktop and mobile layouts before any go-live decision.

**Typical scope:**
- One-page responsive site
- Interactive nav, FAQ, and service sections where relevant
- Basic SEO and hosting setup

This sideline sits alongside my full-stack and AI integration work — same engineering standards, smaller scope, faster turnaround for neighborhood shops and services that need a professional web presence.`,
    tags: ["sideline", "client-sites", "template"],
  },
  {
    id: "portfolio-preview-showcase",
    title: "Portfolio preview showcase for client demos",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "New preview mode on carlmanuel.com — desktop and mobile mockups for whitelisted client demos, without public direct browsing.",
    body: `Client sample sites are **embed-only by design**. They are meant to be viewed inside the portfolio preview, not as standalone public pages.

I added a **PreviewShowcase** mode: a desktop monitor and mobile phone mockup side by side, with a Back to portfolio link.

Security layers on every client folder:
- Netlify edge function blocks direct document loads
- Client-side embed guard as a fallback
- CSP \`frame-ancestors\` limiting embeds to portfolio domains

This keeps demos polished and controlled while I iterate with business owners.`,
    tags: ["portfolio", "preview", "security"],
  },
  {
    id: "client-site-tailwind-stack",
    title: "Client sites upgraded to Tailwind CDN + site.js",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "Migrated the client-site template to Tailwind CDN with interactive site.js — mobile nav, scroll reveal, FAQ accordions, and service filters.",
    body: `The client-site template now uses **Tailwind CDN** instead of large custom stylesheets — zero-config deploys, faster iteration, consistent responsive utilities.

Each site includes **site.js** for shared interactivity:
- Mobile hamburger navigation
- Sticky header shadow on scroll
- Scroll-reveal animations
- FAQ accordions
- Optional service category filters

Supplemental \`styles.css\` handles only hero backgrounds and effects Tailwind can't express cleanly. No CRA or webpack build in client folders — static HTML, deploy, done.

Recent client demos were migrated to this stack.`,
    tags: ["tailwind", "client-sites", "template"],
  },
  {
    id: "rg-decals-printing",
    title: "Sample site: RG Decals and Printing Shop",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Vehicle decals, signs, banners, and custom printing — demo for a Rodriguez print shop with logo-led branding.",
    body: `**RG Decals and Printing Shop** serves Rodriguez and nearby areas with vehicle decals, signs, banners, and custom printing.

The sample one-page site uses their public tagline and logo, with service filters (Vehicle / Signs / Print), FAQ for common print questions, and a contact section.

**Area:** Rodriguez, Rizal (Metro Manila Hills)
**Focus:** Printing, signage, and vehicle graphics`,
    tags: ["printing", "signage", "rodriguez"],
    industry: "Printing / signs & decals",
  },
  {
    id: "suyat-notary-public",
    title: "Sample site: Suyat Notary Public",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Notary public and legal document services in Rodriguez — professional burgundy and gold branding.",
    body: `**Suyat Notary Public** offers notarization, affidavits, deeds, and legal document services in the Rodriguez area.

The demo highlights core services, location context, and how to reach the office — styled with a professional palette suited to legal work.

**Area:** San Jose, Rodriguez, Rizal
**Focus:** Notary public and document preparation`,
    tags: ["notary", "legal", "rodriguez"],
    industry: "Notary / legal documents",
  },
  {
    id: "ohana-business-solutions",
    title: "Sample site: Ohana Business Solutions Inc",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Business consultancy demo — family-oriented brand, services, and contact for a Rodriguez-area firm.",
    body: `**Ohana Business Solutions Inc** provides business consultancy and corporate services in Rizal.

The sample site reflects a family-oriented brand with services, about, and contact sections — mobile-friendly and easy to share with prospects.

**Area:** Rodriguez, Rizal
**Focus:** Business consultancy and corporate services`,
    tags: ["consultancy", "rodriguez"],
    industry: "Business consultancy",
  },
  {
    id: "extra-rice-trading",
    title: "Sample site: Extra Rice 8 Trading, OPC",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Rice wholesale and retail — product-focused demo with multiple branch locations in Rodriguez.",
    body: `**Extra Rice 8 Trading, OPC** is a rice wholesale and retail business serving Rodriguez with more than one branch.

The demo emphasizes products, branch locations at a high level, and contact — built for customers who discover the business on social media and want a quick overview online.

**Area:** Rodriguez, Rizal (San Rafael and San Jose)
**Focus:** Rice wholesale and retail`,
    tags: ["wholesale", "retail", "rodriguez"],
    industry: "Rice wholesale & retail",
  },
];

export function getBlogPost(id) {
  return BLOG_POSTS.find((post) => post.id === id) ?? null;
}

export function formatBlogDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
