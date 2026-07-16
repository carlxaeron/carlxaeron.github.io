#!/usr/bin/env node
/**
 * Injects static portfolio HTML into build/index.html #root for crawler SEO.
 * Run after `react-scripts build`, before copying to docs/.
 */

const fs = require("fs");
const path = require("path");
const { buildPrerenderHtml } = require("../src/v3/seo/portfolioSeo");

const targetArg = process.argv[2] || "build/index.html";
const indexPath = path.resolve(process.cwd(), targetArg);

if (!fs.existsSync(indexPath)) {
  console.error(`inject-seo-prerender: file not found: ${indexPath}`);
  process.exit(1);
}

const prerenderHtml = buildPrerenderHtml();
let html = fs.readFileSync(indexPath, "utf8");

const rootPattern = /<div id="root">\s*<\/div>/;
const rootWithContentPattern = /<div id="root">[\s\S]*?<\/div>\s*(?=<script|<\/body)/;

if (rootPattern.test(html)) {
  html = html.replace(rootPattern, `<div id="root">\n  ${prerenderHtml}\n</div>`);
} else if (rootWithContentPattern.test(html)) {
  html = html.replace(
    rootWithContentPattern,
    `<div id="root">\n  ${prerenderHtml}\n</div>\n`
  );
} else {
  console.error("inject-seo-prerender: could not find #root div in index.html");
  process.exit(1);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log(`inject-seo-prerender: injected static HTML into ${targetArg}`);
