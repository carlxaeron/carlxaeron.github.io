#!/usr/bin/env node
/** Deploy upgraded client sites to Netlify prod. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLIENT_SITES = path.join(ROOT, "client-sites");
const SKIP = new Set(["_template", "_systems", "villa-clara-pool", "costa-abril"]);

const sitesJson = execSync("npx netlify sites:list --json", {
  cwd: ROOT,
  encoding: "utf8",
  stdio: ["pipe", "pipe", "pipe"],
});
const netlifySites = JSON.parse(sitesJson);
const byHost = new Map();
for (const s of netlifySites) {
  const host = new URL(s.ssl_url || s.url).hostname;
  byHost.set(host, s.id);
}

const slugs = fs
  .readdirSync(CLIENT_SITES, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !SKIP.has(d.name))
  .map((d) => d.name);

const results = [];
for (const slug of slugs) {
  const dir = path.join(CLIENT_SITES, slug);
  const client = JSON.parse(fs.readFileSync(path.join(dir, "client.json"), "utf8"));
  const host = client.previewHost;
  const siteId = byHost.get(host);
  if (!siteId) {
    results.push({ slug, host, status: "skip", reason: "no site id" });
    continue;
  }
  try {
    execSync(`npx netlify deploy --prod --no-build --dir . --site "${siteId}"`, {
      cwd: dir,
      stdio: "inherit",
    });
    results.push({ slug, host, siteId, status: "deployed" });
  } catch (e) {
    results.push({ slug, host, siteId, status: "failed", error: String(e.message || e) });
  }
}

console.log("\n=== Deploy summary ===");
console.log(JSON.stringify(results, null, 2));
const ok = results.filter((r) => r.status === "deployed").length;
console.error(`Deployed: ${ok}/${results.length}`);
