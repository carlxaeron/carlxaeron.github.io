// Builds public/data/client-catalog.json from client-sites client.json files.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITES_DIR = path.join(ROOT, "client-sites");
const OUT_FILE = path.join(ROOT, "public", "data", "client-catalog.json");

function readClientJson(dirName) {
  if (dirName.startsWith("_")) return null;
  const filePath = path.join(SITES_DIR, dirName, "client.json");
  if (!fs.existsSync(filePath)) return null;

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return {
      slug: raw.slug || dirName,
      businessName: raw.businessName || "",
      industry: raw.industry || "",
      contact: {
        name: raw.contact?.name || "",
        email: raw.contact?.email || "",
        phone: raw.contact?.phone || "",
      },
      quotation: {
        packageName: raw.quotation?.packageName || "",
        packageScope: raw.quotation?.packageScope || "",
        quotedAmount: raw.quotation?.quotedAmount || "",
        paymentTerms: raw.quotation?.paymentTerms || "",
        timeline: raw.quotation?.timeline || "",
        previewUrl: raw.quotation?.previewUrl || "",
      },
      system: {
        type: raw.system?.type || "",
        adminPath: raw.system?.adminPath || "/admin/",
        label: raw.system?.label || "",
        navPages: Array.isArray(raw.system?.navPages) ? raw.system.navPages : [],
      },
      sources: {
        address: raw.sources?.address || "",
      },
    };
  } catch (err) {
    console.warn(`Skipping ${dirName}/client.json: ${err.message}`);
    return null;
  }
}

function main() {
  const dirs = fs.readdirSync(SITES_DIR, { withFileTypes: true });
  const clients = dirs
    .filter((d) => d.isDirectory())
    .map((d) => readClientJson(d.name))
    .filter(Boolean)
    .sort((a, b) => a.slug.localeCompare(b.slug));

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), clients }, null, 2)}\n`
  );

  console.log(`Wrote ${clients.length} clients to ${OUT_FILE}`);
}

main();
