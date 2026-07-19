#!/usr/bin/env node
/**
 * Batch wire /admin/ + client.json system block for client sites.
 * Usage: node scripts/batch-admin-rollout.mjs [--dry-run]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLIENT_SITES = path.join(ROOT, "client-sites");
const ADMIN_KIT = path.join(CLIENT_SITES, "_systems/admin");
const EMBED_ONLY_SRC = path.join(
  CLIENT_SITES,
  "_template/netlify/edge-functions/embed-only.js"
);

const SKIP = new Set(["_template", "_systems", "villa-clara-pool", "costa-abril"]);

const VERTICAL_MAP = {
  quotation: "leads",
  "extra-rice": "leads",
  ohana: "leads",
  suyat: "leads",
  "rg-decals": "leads",
  "sonyoba-marketing": "leads",
  "regan-industrial": "leads",
  intellismart: "leads",
  "sv-more-group": "leads",
  "trumed-pharma": "leads",
  "dn-group": "leads",
  "fastpoint-ph": "leads",
  "mphs-fairview": "leads",
  "journey-woodblock-ph": "leads",
  "kubling-tago-resort": "booking",
  "air-alex-resort": "booking",
  "casa-de-gloria": "booking",
  "casa-angelina": "booking",
  "the-lakehouse-taguig": "booking",
  "hvill-hospital": "appointments",
  "san-mateo-medical-center": "appointments",
  "bernardino-general-hospital": "appointments",
  pgmc: "appointments",
  novagen: "appointments",
  "fairview-general-hospital": "appointments",
  "taguig-city-general-hospital": "appointments",
  "amora-body-wellness-spa": "appointments",
  "jk-construction": "service",
  machinemate: "service",
  "jazz1-aircon": "service",
  "clover-industrial-fan": "service",
  "alibaton-construction": "service",
  "archipelago-builders": "service",
  "g3k-cad": "service",
};

const DEFAULT_BRAND = {
  booking: { primary: "#0e7490", primaryDark: "#063a4b", accent: "#22d3ee" },
  appointments: { primary: "#0369a1", primaryDark: "#0c4a6e", accent: "#38bdf8" },
  service: { primary: "#c2410c", primaryDark: "#7c2d12", accent: "#fb923c" },
  leads: { primary: "#047857", primaryDark: "#064e3b", accent: "#34d399" },
};

const SYSTEM_META = {
  booking: {
    label: "Venue booking admin",
    navPages: ["Dashboard", "Bookings", "Calendar", "Guests", "Settings"],
  },
  appointments: {
    label: "Appointments admin",
    navPages: ["Dashboard", "Appointments", "Schedule", "Patients", "Settings"],
  },
  service: {
    label: "Service dispatch admin",
    navPages: ["Dashboard", "Jobs", "Dispatch", "Customers", "Settings"],
  },
  leads: {
    label: "Lead & quote inbox",
    navPages: ["Dashboard", "Leads", "Follow-ups", "Contacts", "Settings"],
  },
};

const SPA_SLUGS = new Set(["amora-body-wellness-spa"]);

function extractBrandFromHtml(html) {
  const brand = {};
  const block = html.match(/brand:\s*\{([^}]+)\}/s);
  if (!block) return null;
  const pairs = block[1].matchAll(/(\w+):\s*"([#][0-9a-fA-F]{3,8})"/g);
  for (const [, key, hex] of pairs) brand[key] = hex;
  return Object.keys(brand).length ? brand : null;
}

function pickBrandColors(siteBrand, vertical) {
  const fallback = DEFAULT_BRAND[vertical];
  if (!siteBrand) return fallback;
  const primary =
    siteBrand.accent || siteBrand.primary || siteBrand.mid || siteBrand.navy || fallback.primary;
  const primaryDark =
    siteBrand.dark || siteBrand.ink || siteBrand.navy || siteBrand.mid || fallback.primaryDark;
  const accent =
    siteBrand.gold || siteBrand.light || siteBrand.soft || siteBrand.accent || fallback.accent;
  return { primary, primaryDark, accent };
}

function findLogo(slugDir) {
  const assets = path.join(slugDir, "assets");
  if (!fs.existsSync(assets)) return null;
  for (const name of ["logo.jpg", "logo.png", "logo.webp"]) {
    if (fs.existsSync(path.join(assets, name))) return `/assets/${name}`;
  }
  return null;
}

function initials(name) {
  const parts = name.replace(/[&]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) || "OW").toUpperCase();
}

function writeBrandConfig(slugDir, slug, vertical, businessName) {
  const htmlPath = path.join(slugDir, "index.html");
  const html = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, "utf8") : "";
  const siteBrand = extractBrandFromHtml(html);
  const brand = pickBrandColors(siteBrand, vertical);
  const logo = findLogo(slugDir);
  const content = `window.ADMIN_CONFIG = window.ADMIN_CONFIG || {
  vertical: "${vertical}",
  businessName: ${JSON.stringify(businessName)},
  ownerRole: "Owner",
  userInitials: ${JSON.stringify(initials(businessName))},
  logo: ${logo ? JSON.stringify(logo) : "null"},
  brand: {
    primary: ${JSON.stringify(brand.primary)},
    primaryDark: ${JSON.stringify(brand.primaryDark)},
    accent: ${JSON.stringify(brand.accent)},
  },
};
`;
  fs.writeFileSync(path.join(slugDir, "admin/brand-config.js"), content);
}

function systemBlock(slug, vertical) {
  const meta = { ...SYSTEM_META[vertical] };
  if (SPA_SLUGS.has(slug)) {
    meta.label = "Spa appointment admin";
    meta.navPages = ["Dashboard", "Appointments", "Calendar", "Clients", "Settings"];
  } else if (vertical === "appointments" && slug.includes("hospital")) {
    meta.label = "Hospital appointments admin";
  } else if (vertical === "service" && slug.includes("construction")) {
    meta.label = "Job schedule admin";
  } else if (vertical === "leads" && slug === "mphs-fairview") {
    meta.label = "School inquiry admin";
  }
  return {
    type: vertical,
    adminPath: "/admin/",
    label: meta.label,
    navPages: meta.navPages,
  };
}

function copyAdminKit(slugDir) {
  const adminDir = path.join(slugDir, "admin");
  if (fs.existsSync(adminDir)) fs.rmSync(adminDir, { recursive: true, force: true });
  execSync(`cp -R "${ADMIN_KIT}" "${adminDir}"`);
}

function copyEmbedOnly(slugDir) {
  const dest = path.join(slugDir, "netlify/edge-functions/embed-only.js");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(EMBED_ONLY_SRC, dest);
}

function updateClientJson(slugDir, slug, vertical) {
  const jsonPath = path.join(slugDir, "client.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  data.system = systemBlock(slug, vertical);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + "\n");
}

function listSlugs() {
  return fs
    .readdirSync(CLIENT_SITES, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP.has(d.name))
    .map((d) => d.name)
    .sort();
}

const dryRun = process.argv.includes("--dry-run");
const results = [];

for (const slug of listSlugs()) {
  const vertical = VERTICAL_MAP[slug];
  if (!vertical) {
    results.push({ slug, vertical: "?", status: "skipped", reason: "no vertical map" });
    continue;
  }
  const slugDir = path.join(CLIENT_SITES, slug);
  const clientPath = path.join(slugDir, "client.json");
  if (!fs.existsSync(clientPath)) {
    results.push({ slug, vertical, status: "skipped", reason: "no client.json" });
    continue;
  }
  const businessName = JSON.parse(fs.readFileSync(clientPath, "utf8")).businessName || slug;
  if (dryRun) {
    results.push({ slug, vertical, status: "dry-run", businessName });
    continue;
  }
  copyAdminKit(slugDir);
  writeBrandConfig(slugDir, slug, vertical, businessName);
  copyEmbedOnly(slugDir);
  updateClientJson(slugDir, slug, vertical);
  results.push({ slug, vertical, status: "upgraded", businessName });
}

console.log(JSON.stringify(results, null, 2));
console.error(`\nTotal: ${results.length} · upgraded: ${results.filter((r) => r.status === "upgraded").length}`);
