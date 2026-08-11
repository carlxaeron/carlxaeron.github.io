#!/usr/bin/env node
/**
 * Daily prospect discovery via Google Places API (New).
 *
 * Usage:
 *   node scripts/discover-prospects.mjs
 *   node scripts/discover-prospects.mjs --limit 5 --probe
 *   node scripts/discover-prospects.mjs --dry-run
 *
 * Env (repo root .env): GOOGLE_PLACE_API_KEY or GOOGLE_PLACES_API_KEY
 *
 * Writes: prospects/queue.json + prospects/digest-YYYY-MM-DD.md
 * Does NOT build sites or send email — review digest, then build / ask to send.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {
  SEARCH_AREAS,
  TARGET_TYPES,
  loadPlacesApiKey,
  loadExistingClientIndex,
  pickTypesForDay,
  probeWebsite,
  rankProspects,
  searchNearby,
  fetchLegacyPlaceDetails,
  yyyymmdd,
} from "./lib/places-discover.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
dotenv.config({ path: path.join(ROOT, ".env") });

function parseArgs(argv) {
  const out = {
    limit: 5,
    minLimit: 3,
    probe: true,
    dryRun: false,
    typesPerArea: 4,
    help: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--limit" && argv[i + 1]) out.limit = Number(argv[++i]);
    else if (arg === "--min" && argv[i + 1]) out.minLimit = Number(argv[++i]);
    else if (arg === "--types-per-area" && argv[i + 1]) out.typesPerArea = Number(argv[++i]);
    else if (arg === "--no-probe") out.probe = false;
    else if (arg === "--probe") out.probe = true;
    else if (arg === "--dry-run") out.dryRun = true;
    else if (arg === "--help" || arg === "-h") out.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!Number.isFinite(out.limit) || out.limit < 1) throw new Error("--limit must be >= 1");
  return out;
}

function printHelp() {
  console.log(`Usage: node scripts/discover-prospects.mjs [options]

Options:
  --limit N           Max prospects in digest (default 5)
  --min N             Soft minimum target (default 3; informational)
  --types-per-area N  Place types sampled per area (default 4)
  --probe             Probe websites for viewport/HTTPS (default)
  --no-probe          Skip website probes (faster, weaker scores)
  --dry-run           Print only; do not write prospects/

Env:
  GOOGLE_PLACE_API_KEY (or GOOGLE_PLACES_API_KEY)
`);
}

function todayStamp(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function formatDigest(prospects, meta) {
  const lines = [
    `# Prospect digest — ${meta.date}`,
    "",
    `Areas: ${meta.areas.join(", ")}`,
    `Types sampled: ${meta.types.join(", ")}`,
    `Candidates ranked: ${meta.rankedTotal} · digest size: ${prospects.length}`,
    "",
    "Build next with client-site-netlify skill (ask before any outreach send).",
    "",
  ];
  prospects.forEach((p, i) => {
    lines.push(`## ${i + 1}. ${p.name}`);
    lines.push("");
    lines.push(`- **Suggested slug:** \`${p.slug}\``);
    lines.push(`- **Score:** ${p.score} — ${p.reason}`);
    lines.push(`- **Address:** ${p.address || "—"}`);
    lines.push(`- **Phone:** ${p.phone || "—"}`);
    lines.push(`- **Website:** ${p.website || "_none_"}`);
    lines.push(`- **Maps:** ${p.googleMapsUri || "—"}`);
    lines.push(`- **Types:** ${(p.types || []).slice(0, 6).join(", ")}`);
    lines.push(`- **Place ID:** \`${p.placeId}\``);
    lines.push("");
  });
  if (!prospects.length) {
    lines.push("_No prospects passed filters today. Re-run tomorrow or widen types._");
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const apiKey = loadPlacesApiKey();
  if (!apiKey) {
    console.error("Missing GOOGLE_PLACE_API_KEY (or GOOGLE_PLACES_API_KEY) in .env");
    process.exit(1);
  }

  const clientSitesDir = path.join(ROOT, "client-sites");
  const existingIndex = loadExistingClientIndex(clientSitesDir, fs);
  const daySeed = yyyymmdd();
  const types = pickTypesForDay(TARGET_TYPES, args.typesPerArea, daySeed);

  console.log(`Areas: ${SEARCH_AREAS.map((a) => a.label).join(" · ")}`);
  console.log(`Types today: ${types.join(", ")}`);
  console.log(`Existing clients indexed: ${existingIndex.bySlug.size} slugs`);

  const collected = [];
  for (const area of SEARCH_AREAS) {
    for (const includedType of types) {
      try {
        const places = await searchNearby({
          apiKey,
          area,
          includedType,
          maxResultCount: 12,
        });
        console.log(`  ${area.id}/${includedType}: ${places.length} places`);
        for (const p of places) {
          collected.push({ ...p, _area: area.id });
        }
      } catch (err) {
        console.warn(`  WARN ${area.id}/${includedType}: ${err.message}`);
      }
      // gentle pacing
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  // Legacy Nearby omits website/phone — enrich a capped set with Place Details.
  const uniqueById = new Map();
  for (const p of collected) {
    const id = p.id || p.name;
    if (id && !uniqueById.has(id)) uniqueById.set(id, p);
  }
  const toEnrich = [...uniqueById.values()].slice(0, 36);
  console.log(`Enriching ${toEnrich.length} places with Place Details…`);
  const enriched = [];
  for (const p of toEnrich) {
    const placeId = String(p.id || "").replace(/^places\//, "");
    if (!placeId || p.websiteUri) {
      enriched.push(p);
      continue;
    }
    try {
      const details = await fetchLegacyPlaceDetails({ apiKey, placeId });
      enriched.push(details ? { ...p, ...details, id: details.id || p.id } : p);
    } catch {
      enriched.push(p);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  const probesByWebsite = {};
  if (args.probe) {
    const websites = [
      ...new Set(
        enriched
          .map((p) => p.websiteUri)
          .filter(Boolean)
          .map((u) => String(u).trim())
      ),
    ].slice(0, 40);
    console.log(`Probing ${websites.length} websites…`);
    for (const url of websites) {
      probesByWebsite[url] = await probeWebsite(url);
      await new Promise((r) => setTimeout(r, 150));
    }
  }

  const ranked = rankProspects(enriched, { existingIndex, probesByWebsite });
  const picks = ranked.slice(0, args.limit);
  const date = todayStamp();
  const meta = {
    date,
    areas: SEARCH_AREAS.map((a) => a.label),
    types,
    rankedTotal: ranked.length,
    minTarget: args.minLimit,
    generatedAt: new Date().toISOString(),
  };

  const queue = {
    ...meta,
    prospects: picks,
  };

  console.log(`\nRanked ${ranked.length} → digest ${picks.length} (target ${args.minLimit}–${args.limit})`);
  picks.forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.score}] ${p.name} — ${p.reason}`);
  });

  if (args.dryRun) {
    console.log("\n--dry-run: not writing files");
    return;
  }

  const outDir = path.join(ROOT, "prospects");
  fs.mkdirSync(outDir, { recursive: true });
  const queuePath = path.join(outDir, "queue.json");
  const digestPath = path.join(outDir, `digest-${date}.md`);
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
  fs.writeFileSync(digestPath, formatDigest(picks, meta));
  console.log(`\nWrote ${path.relative(ROOT, queuePath)}`);
  console.log(`Wrote ${path.relative(ROOT, digestPath)}`);
  console.log("Next: build demos for these slugs (client-site-netlify), then ask before send.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
