import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";

describe("inject-seo-prerender script", () => {
  test("injects main content into empty #root", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-prerender-"));
    const indexPath = path.join(tmpDir, "index.html");
    fs.writeFileSync(
      indexPath,
      `<!doctype html><html><head></head><body><div id="root"></div><script src="/static/js/main.js"></script></body></html>`,
      "utf8"
    );

    const repoRoot = path.resolve(__dirname, "../../..");
    execSync(`node scripts/inject-seo-prerender.cjs "${indexPath}"`, {
      cwd: repoRoot,
      stdio: "pipe",
    });

    const result = fs.readFileSync(indexPath, "utf8");
    expect(result).toContain('id="seo-prerender-boot"');
    expect(result).toContain("#seo-prerender");
    expect(result).toContain('id="app-boot-shell"');
    expect(result).toContain('<main id="seo-prerender"');
    expect(result).toContain("<h1>Carl Louis Manuel</h1>");
    expect(result).toContain('id="skills"');
    expect(result).toMatch(/<div id="root">\s*<main id="seo-prerender"/);
  });

  test("does not duplicate boot styles when already present", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-prerender-dup-"));
    const indexPath = path.join(tmpDir, "index.html");
    fs.writeFileSync(
      indexPath,
      `<!doctype html><html><head><style id="seo-prerender-boot">#seo-prerender{}</style></head><body><div id="app-boot-shell"></div><div id="root"></div></body></html>`,
      "utf8"
    );

    const repoRoot = path.resolve(__dirname, "../../..");
    execSync(`node scripts/inject-seo-prerender.cjs "${indexPath}"`, {
      cwd: repoRoot,
      stdio: "pipe",
    });

    const result = fs.readFileSync(indexPath, "utf8");
    expect(result.match(/id="seo-prerender-boot"/g)).toHaveLength(1);
    expect(result.match(/id="app-boot-shell"/g)).toHaveLength(1);
    expect(result).toContain('<main id="seo-prerender"');
  });
});
