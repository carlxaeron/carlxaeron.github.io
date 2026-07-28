/**
 * Shared paths and attachment builders for client outreach screenshots.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const CLIENT_SITES = path.join(REPO_ROOT, "client-sites");

export const OUTREACH_ASSET_FILES = {
  website: "outreach-website.jpg",
  admin: "outreach-admin.jpg",
};

export const ATTACHMENT_FILENAMES = {
  website: "website-preview.jpg",
  admin: "admin-preview.jpg",
};

/** @param {string} slug */
export function getClientDir(slug) {
  return path.join(CLIENT_SITES, slug);
}

/** @param {string} slug */
export function readClientJson(slug) {
  const file = path.join(getClientDir(slug), "client.json");
  if (!fs.existsSync(file)) {
    throw new Error(`Missing client.json for slug "${slug}" (${file})`);
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/** @param {string} slug */
export function getAssetPaths(slug) {
  const assetsDir = path.join(getClientDir(slug), "assets");
  return {
    assetsDir,
    website: path.join(assetsDir, OUTREACH_ASSET_FILES.website),
    admin: path.join(assetsDir, OUTREACH_ASSET_FILES.admin),
  };
}

/** @param {{ website: string, admin: string }} paths */
export function assetsExist(paths) {
  return fs.existsSync(paths.website) && fs.existsSync(paths.admin);
}

/**
 * @param {string} filePath
 * @returns {{ filename: string, contentBase64: string }}
 */
export function attachmentFromFile(filePath, emailFilename) {
  const content = fs.readFileSync(filePath);
  if (content.length === 0) {
    throw new Error(`Empty attachment file: ${filePath}`);
  }
  const maxBytes = 5 * 1024 * 1024;
  if (content.length > maxBytes) {
    throw new Error(`Attachment exceeds 5MB: ${filePath}`);
  }
  return {
    filename: emailFilename,
    contentBase64: content.toString("base64"),
  };
}

/**
 * Build outreachSchedule attachments[] from stored assets.
 *
 * @param {string} slug
 * @param {{ mode?: 'base64' | 'url', previewHost?: string }} [opts]
 * @returns {Array<{ filename: string, contentBase64?: string, url?: string }>}
 */
export function buildAttachmentsFromAssets(slug, opts = {}) {
  const client = readClientJson(slug);
  const paths = getAssetPaths(slug);
  if (!assetsExist(paths)) {
    throw new Error(
      `Missing outreach screenshots for "${slug}". Run: node scripts/capture-client-screenshots.mjs --slug ${slug}`,
    );
  }

  const mode = opts.mode ?? "base64";
  const previewHost = opts.previewHost ?? client.previewHost;

  if (mode === "url") {
    if (!previewHost) {
      throw new Error(`previewHost required for url attachments (${slug})`);
    }
    const base = `https://${previewHost}/assets`;
    return [
      {
        filename: ATTACHMENT_FILENAMES.website,
        url: `${base}/${OUTREACH_ASSET_FILES.website}`,
      },
      {
        filename: ATTACHMENT_FILENAMES.admin,
        url: `${base}/${OUTREACH_ASSET_FILES.admin}`,
      },
    ];
  }

  return [
    attachmentFromFile(paths.website, ATTACHMENT_FILENAMES.website),
    attachmentFromFile(paths.admin, ATTACHMENT_FILENAMES.admin),
  ];
}
