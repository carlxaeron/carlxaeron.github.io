#!/usr/bin/env node
/**
 * Capture website + admin outreach screenshots via headless Chrome (Playwright).
 *
 * Bypasses embed-only Netlify guards by loading pages inside iframes:
 * - Primary: http://localhost:3000 (matches Netlify CSP frame-ancestors)
 * - Fallback: https://carlmanuel.com/?preview={slug} when port 3000 is busy
 *
 * Usage:
 *   node scripts/capture-client-screenshots.mjs --slug bccc-corp
 *   node scripts/capture-client-screenshots.mjs --slug bccc-corp --refresh
 *   node scripts/capture-client-screenshots.mjs --slug bccc-corp --print-attachments
 */
import fs from "fs";
import { runCapture } from "./lib/capture-screenshots.mjs";
import {
  assetsExist,
  buildAttachmentsFromAssets,
  getAssetPaths,
  readClientJson,
} from "./lib/outreach-screenshots.mjs";

function parseArgs(argv) {
  const out = { slug: "", refresh: false, printAttachments: false, attachmentMode: "base64" };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--slug" && argv[i + 1]) {
      out.slug = argv[++i];
    } else if (arg === "--refresh") {
      out.refresh = true;
    } else if (arg === "--print-attachments") {
      out.printAttachments = true;
    } else if (arg === "--attachment-mode" && argv[i + 1]) {
      out.attachmentMode = argv[++i];
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!out.slug) {
    printHelp();
    process.exit(1);
  }
  return out;
}

function printHelp() {
  console.log(`Usage: node scripts/capture-client-screenshots.mjs --slug <slug> [options]

Options:
  --slug <slug>           Client folder under client-sites/ (required)
  --refresh               Re-capture even when assets already exist
  --print-attachments     Print outreachSchedule attachments JSON to stdout
  --attachment-mode url   With --print-attachments, use Netlify asset URLs (default: base64)

Saves:
  client-sites/{slug}/assets/outreach-website.jpg
  client-sites/{slug}/assets/outreach-admin.jpg
`);
}

async function captureScreenshots(slug, refresh) {
  const client = readClientJson(slug);
  const previewHost = client.previewHost;
  if (!previewHost) {
    throw new Error(`client.json for "${slug}" is missing previewHost`);
  }

  const paths = getAssetPaths(slug);
  fs.mkdirSync(paths.assetsDir, { recursive: true });

  if (!refresh && assetsExist(paths)) {
    console.log(`Screenshots already exist for "${slug}" (use --refresh to re-capture):`);
    console.log(`  ${paths.website}`);
    console.log(`  ${paths.admin}`);
    return paths;
  }

  const siteUrl = `https://${previewHost}/`;
  const adminUrl = `https://${previewHost.replace(/\/+$/, "")}/admin/`;

  const mode = await runCapture({
    slug,
    previewHost,
    paths,
    siteUrl,
    adminUrl,
  });

  console.log(`Capture mode: ${mode}`);
  console.log(`Saved website screenshot: ${paths.website}`);
  console.log(`Saved admin screenshot:   ${paths.admin}`);
  return paths;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.refresh && args.printAttachments && assetsExist(getAssetPaths(args.slug))) {
    const attachments = buildAttachmentsFromAssets(args.slug, { mode: args.attachmentMode });
    console.log(JSON.stringify(attachments, null, 2));
    return;
  }

  await captureScreenshots(args.slug, args.refresh);

  if (args.printAttachments) {
    const attachments = buildAttachmentsFromAssets(args.slug, { mode: args.attachmentMode });
    console.log(JSON.stringify(attachments, null, 2));
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
