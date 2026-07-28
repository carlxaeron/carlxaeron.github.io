/**
 * Headless capture strategies for embed-only client sites (Playwright / Chromium).
 */
import { chromium } from "playwright";
import { createCaptureServer } from "./capture-frame-host.mjs";

export const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
export const SETTLE_MS = 2500;
export const LOAD_TIMEOUT_MS = 90000;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortBusyError(err) {
  if (!err || typeof err !== "object") return false;
  if ("code" in err && err.code === "EADDRINUSE") return true;
  return /EADDRINUSE|address already in use/i.test(String(err.message || err));
}

async function assertFrameLoaded(frame, label) {
  if (!frame) {
    throw new Error(`Missing ${label} frame`);
  }
  await frame.waitForLoadState("networkidle", { timeout: LOAD_TIMEOUT_MS });
  const title = await frame.title();
  const snippet = (await frame.locator("body").innerText()).slice(0, 120);
  if (
    /preview locked|preview only/i.test(title) ||
    snippet.includes("This demo is only available through the portfolio preview")
  ) {
    throw new Error(`${label} blocked by embed guard (${title})`);
  }
}

async function captureViaLocalHost(page, server, previewHost, paths) {
  await page.setViewportSize({
    width: DESKTOP_VIEWPORT.width + 32,
    height: DESKTOP_VIEWPORT.height * 2 + 48,
  });
  await page.goto(`${server.origin}/`, { waitUntil: "networkidle", timeout: LOAD_TIMEOUT_MS });
  await page.waitForSelector("#capture-site", { timeout: LOAD_TIMEOUT_MS });
  await page.waitForSelector("#capture-admin", { timeout: LOAD_TIMEOUT_MS });
  await sleep(SETTLE_MS);

  const siteFrame = page
    .frames()
    .find((f) => f.url().includes(previewHost) && !f.url().includes("/admin"));
  const adminFrame = page.frames().find((f) => f.url().includes(previewHost) && f.url().includes("/admin"));

  await assertFrameLoaded(siteFrame, "Website");
  await assertFrameLoaded(adminFrame, "Admin");

  await page.locator("#capture-site").screenshot({ path: paths.website, type: "jpeg", quality: 88 });
  await page.locator("#capture-admin").screenshot({ path: paths.admin, type: "jpeg", quality: 88 });
  return "local";
}

async function captureViaPortfolioPreview(page, slug, previewHost, paths) {
  await page.setViewportSize({ width: 1440, height: 2400 });
  await page.goto(`https://carlmanuel.com/?preview=${encodeURIComponent(slug)}`, {
    waitUntil: "networkidle",
    timeout: LOAD_TIMEOUT_MS,
  });
  await page.waitForSelector('[data-testid="preview-showcase"]', { timeout: LOAD_TIMEOUT_MS });
  await sleep(SETTLE_MS + 1000);

  const siteFrame = page
    .frames()
    .find((f) => f.url().includes(previewHost) && !f.url().includes("/admin"));
  const adminFrame = page.frames().find((f) => f.url().includes(previewHost) && f.url().includes("/admin"));

  await assertFrameLoaded(siteFrame, "Website");
  await assertFrameLoaded(adminFrame, "Admin");

  await siteFrame.locator("html").screenshot({ path: paths.website, type: "jpeg", quality: 88 });
  await adminFrame.locator("html").screenshot({ path: paths.admin, type: "jpeg", quality: 88 });
  return "portfolio";
}

/**
 * @param {{ slug: string, previewHost: string, paths: { website: string, admin: string }, siteUrl: string, adminUrl: string }} opts
 */
export async function runCapture(opts) {
  const browser = await chromium.launch({ headless: true });
  let mode;

  try {
    const page = await browser.newPage();

    try {
      const server = await createCaptureServer({
        siteUrl: opts.siteUrl,
        adminUrl: opts.adminUrl,
        viewport: DESKTOP_VIEWPORT,
      });
      try {
        mode = await captureViaLocalHost(page, server, opts.previewHost, opts.paths);
      } finally {
        await server.close();
      }
    } catch (err) {
      if (!isPortBusyError(err)) {
        throw err;
      }
      console.warn("Port 3000 busy — falling back to carlmanuel.com portfolio preview capture.");
      mode = await captureViaPortfolioPreview(page, opts.slug, opts.previewHost, opts.paths);
    }
  } finally {
    await browser.close();
  }

  return mode;
}
