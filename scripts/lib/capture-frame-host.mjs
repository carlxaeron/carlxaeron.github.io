/**
 * Local HTTP host that embeds client Netlify pages in iframes.
 * Referrer localhost:3000 + Sec-Fetch-Dest iframe satisfies embed-only edge + embed-guard.js.
 * Netlify CSP frame-ancestors must include http://localhost:3000 (see _template/netlify.toml).
 */
import http from "http";

const CAPTURE_HOST = "localhost";
const CAPTURE_PORT = 3000;

/**
 * @param {{ siteUrl: string, adminUrl: string, viewport: { width: number, height: number } }} opts
 * @returns {Promise<{ origin: string, close: () => Promise<void> }>}
 */
export function createCaptureServer(opts) {
  const { siteUrl, adminUrl, viewport } = opts;
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Outreach screenshot capture</title>
  <style>
    body { margin: 0; padding: 8px; background: #1a1a1a; }
    iframe { border: 0; display: block; margin-bottom: 12px; background: #fff; }
  </style>
</head>
<body>
  <iframe id="capture-site" width="${viewport.width}" height="${viewport.height}" src="${siteUrl}"></iframe>
  <iframe id="capture-admin" width="${viewport.width}" height="${viewport.height}" src="${adminUrl}"></iframe>
</body>
</html>`;

  const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url?.startsWith("/?")) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(html);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
  });

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(CAPTURE_PORT, CAPTURE_HOST, () => {
      resolve({
        origin: `http://${CAPTURE_HOST}:${CAPTURE_PORT}`,
        close: () =>
          new Promise((res, rej) => {
            server.close((err) => (err ? rej(err) : res()));
          }),
      });
    });
  });
}
