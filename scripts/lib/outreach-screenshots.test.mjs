import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import {
  ATTACHMENT_FILENAMES,
  OUTREACH_ASSET_FILES,
  attachmentFromFile,
  getAssetPaths,
} from "./outreach-screenshots.mjs";

test("getAssetPaths uses outreach asset filenames under assets/", () => {
  const paths = getAssetPaths("demo-slug");
  assert.match(paths.website, /assets[/\\]outreach-website\.jpg$/);
  assert.match(paths.admin, /assets[/\\]outreach-admin\.jpg$/);
});

test("attachmentFromFile returns base64 payload", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "outreach-attach-"));
  const file = path.join(dir, "sample.jpg");
  fs.writeFileSync(file, Buffer.from("fake-jpeg-bytes"));
  const item = attachmentFromFile(file, ATTACHMENT_FILENAMES.website);
  assert.equal(item.filename, "website-preview.jpg");
  assert.equal(item.contentBase64, Buffer.from("fake-jpeg-bytes").toString("base64"));
});

test("OUTREACH_ASSET_FILES match email attachment naming convention", () => {
  assert.equal(OUTREACH_ASSET_FILES.website, "outreach-website.jpg");
  assert.equal(OUTREACH_ASSET_FILES.admin, "outreach-admin.jpg");
  assert.equal(ATTACHMENT_FILENAMES.website, "website-preview.jpg");
  assert.equal(ATTACHMENT_FILENAMES.admin, "admin-preview.jpg");
});
