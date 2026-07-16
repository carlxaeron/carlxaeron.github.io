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
      `<!doctype html><html><body><div id="root"></div><script src="/static/js/main.js"></script></body></html>`,
      "utf8"
    );

    const repoRoot = path.resolve(__dirname, "../../..");
    execSync(`node scripts/inject-seo-prerender.cjs "${indexPath}"`, {
      cwd: repoRoot,
      stdio: "pipe",
    });

    const result = fs.readFileSync(indexPath, "utf8");
    expect(result).toContain('<main id="seo-prerender"');
    expect(result).toContain("<h1>Carl Louis Manuel</h1>");
    expect(result).toContain('id="skills"');
    expect(result).toMatch(/<div id="root">\s*<main id="seo-prerender"/);
  });
});
