/**
 * Portfolio blog / news posts — sideline client sites and product updates.
 */

export const BLOG_CATEGORIES = ["All", "News", "Client Sites"];

export const BLOG_POSTS = [
  {
    id: "client-quotation-sideline",
    title: "Launching a local business website sideline",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "I started building sample websites for Rodriguez-area businesses — complete with portfolio previews, outreach drafts, and embed-only Netlify demos.",
    body: `I'm expanding beyond enterprise delivery with a focused sideline: **starter websites for local businesses** in Rodriguez, Rizal and nearby areas.

The workflow is deliberate. I research a business on Google Maps and Facebook, scaffold a one-page demo from our client-site template, deploy it to Netlify with embed-only security, register it in the portfolio preview whitelist, and draft email, SMS, and Messenger quotations for owner review.

Each demo loads inside **carlmanuel.com/?preview=** — desktop and mobile mockups — so prospects see exactly what they'd get before committing.

**What's included in the Starter package (₱15,000):**
- One-page responsive site (services, about, contact, maps & social links)
- Mobile-first layout with interactive nav, FAQ, and service filters
- Basic SEO and hosting setup on Netlify
- 5–7 business days after content approval

This sideline sits alongside my full-stack and AI integration work — same engineering standards, smaller scope, faster turnaround for neighborhood shops and services that need a professional web presence.`,
    tags: ["sideline", "client-sites", "netlify", "quotations"],
  },
  {
    id: "portfolio-preview-showcase",
    title: "Portfolio preview showcase for client demos",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "New ?preview= mode on carlmanuel.com — desktop monitor and mobile phone mockups for whitelisted Netlify client demos, no direct public URLs.",
    body: `Client quotation sites are **embed-only by design**. Direct Netlify URLs return 403; the site only renders inside portfolio preview iframes.

I shipped a **PreviewShowcase** mode on the portfolio: visit \`carlmanuel.com/?preview={hostname}\` to see a desktop monitor and mobile phone mockup side by side, with a Back to portfolio link.

Security layers on every client folder:
- Netlify edge function blocks direct document loads
- Client-side embed guard as a fallback
- CSP \`frame-ancestors\` limiting embeds to portfolio domains

This lets me share polished demos with business owners without exposing a browsable public URL before they pay.`,
    tags: ["portfolio", "preview", "security"],
  },
  {
    id: "client-site-tailwind-stack",
    title: "Client sites upgraded to Tailwind CDN + site.js",
    category: "News",
    date: "2026-07-10",
    excerpt:
      "Migrated the client-site template to Tailwind CDN with interactive site.js — mobile nav, scroll reveal, FAQ accordions, and service filters.",
    body: `The client quotation template now uses **Tailwind CDN** instead of large custom stylesheets — zero-config deploys on Netlify, faster iteration, consistent responsive utilities.

Each site includes **site.js** for shared interactivity:
- Mobile hamburger navigation
- Sticky header shadow on scroll
- Scroll-reveal animations
- FAQ accordions
- Optional service category filters

Supplemental \`styles.css\` handles only hero backgrounds and effects Tailwind can't express cleanly. No CRA or webpack build in client folders — static HTML, deploy, done.

All four live client demos were migrated to this stack.`,
    tags: ["tailwind", "client-sites", "template"],
  },
  {
    id: "rg-decals-printing",
    title: "Sample site: RG Decals and Printing Shop",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Vehicle decals, signs, banners, and custom printing — demo site for a Rodriguez print shop with their circular RG logo and red brand palette.",
    body: `**RG Decals and Printing Shop** serves Rodriguez and nearby areas from Metro Manila Hills — vehicle decals, signs, banners, and custom printing.

I built a sample one-page site using their Facebook tagline *"Your Ideas we Print into Reality"* and their circular **rg** logo. The demo includes service filters (Vehicle / Signs / Print), FAQ for common print questions, and contact details from their public Facebook page.

**Location:** Metro Manila Hills, Rodriguez, Rizal
**Preview:** carlmanuel.com/?preview=rg-decals-printing.netlify.app

Outreach drafts (email, SMS, Messenger) are ready for owner review — Starter Business Website at ₱15,000.`,
    tags: ["rg-decals", "printing", "rodriguez"],
    previewUrl: "https://carlmanuel.com/?preview=rg-decals-printing.netlify.app",
    industry: "Printing / signs & decals",
  },
  {
    id: "suyat-notary-public",
    title: "Sample site: Suyat Notary Public",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Notary public and legal document services in San Jose, Rodriguez — burgundy and gold branding for Suyat Law Office.",
    body: `**Suyat Notary Public** (Suyat Law Office) offers notarization, affidavits, deeds, and legal document services from their office on Kanlaon Street in Barangay San Jose.

The demo highlights their services, office location with Google Maps link, and Facebook contact — styled with a professional burgundy and gold palette suited to legal work.

**Location:** 2nd Floor, JRS Building, Kanlaon Street, Amityville, San Jose, Rodriguez, Rizal
**Preview:** carlmanuel.com/?preview=suyat-notary-public.netlify.app

Starter package quoted at ₱15,000 with outreach drafts prepared.`,
    tags: ["suyat", "notary", "legal", "rodriguez"],
    previewUrl: "https://carlmanuel.com/?preview=suyat-notary-public.netlify.app",
    industry: "Notary / legal documents",
  },
  {
    id: "ohana-business-solutions",
    title: "Sample site: Ohana Business Solutions Inc",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Business consultancy demo for Ohana — \"Your family in doing business\" — Eastwood Greenview, Rodriguez.",
    body: `**Ohana Business Solutions Inc** provides business consultancy and corporate services from their Rizal branch at Eastwood Greenview.

The sample site reflects their family-oriented brand (*"Your family in doing business"*) with services, about, and contact sections — mobile-friendly and ready to share on Facebook with prospects.

**Location:** Block 1 Lot 5 Phase 4 Eastwood Greenview, San Isidro, Rodriguez, Rizal 1860
**Preview:** carlmanuel.com/?preview=ohana-business-solutions.netlify.app

Starter Business Website — ₱15,000, 5–7 business days after content approval.`,
    tags: ["ohana", "consultancy", "rodriguez"],
    previewUrl: "https://carlmanuel.com/?preview=ohana-business-solutions.netlify.app",
    industry: "Business consultancy",
  },
  {
    id: "extra-rice-trading",
    title: "Sample site: Extra Rice 8 Trading, OPC",
    category: "Client Sites",
    date: "2026-07-10",
    excerpt:
      "Rice wholesale and retail — two Rodriguez locations, product-focused demo for Extra Rice 8 Trading.",
    body: `**Extra Rice 8 Trading, OPC** is a rice wholesale and retail business with locations in San Rafael and San Jose, Rodriguez.

The demo emphasizes products, dual branch locations, and easy contact — built for owners who sell on Facebook and want a link customers can browse before ordering.

**Locations:**
- 2820 MH Del Pilar, Barangay San Rafael, Rodriguez, Rizal 1860
- E. Rodriguez Highway, Barangay San Jose, Rodriguez, Rizal

**Preview:** carlmanuel.com/?preview=extra-rice-trading.netlify.app

Starter package at ₱15,000 with email, SMS, and Messenger quotation drafts.`,
    tags: ["extra-rice", "wholesale", "retail", "rodriguez"],
    previewUrl: "https://carlmanuel.com/?preview=extra-rice-trading.netlify.app",
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
