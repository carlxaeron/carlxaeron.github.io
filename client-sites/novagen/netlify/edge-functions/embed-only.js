const ALLOWED_PARENTS = [
  "carlmanuel.com",
  "www.carlmanuel.com",
  "carlxaeron.github.io",
  "localhost",
];

const BLOCKED_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview only</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
      font-family: Inter, system-ui, sans-serif; background: #00473e; color: #fff; padding: 24px; text-align: center; }
    p { max-width: 28rem; line-height: 1.6; margin: 0; }
  </style>
</head>
<body>
  <p>This demo is only available through the portfolio preview. Visit <strong>carlmanuel.com</strong> to view client samples.</p>
</body>
</html>`;

function hasAllowedReferrer(request) {
  const referer = request.headers.get("referer") || "";
  return ALLOWED_PARENTS.some((host) => referer.includes(host));
}

function isProtectedPage(pathname) {
  if (pathname === "/" || pathname === "/index.html") return true;
  if (pathname.endsWith(".html")) return true;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return true;
  return false;
}

export default async (request, context) => {
  const fetchDest = request.headers.get("sec-fetch-dest");
  const url = new URL(request.url);

  if (!isProtectedPage(url.pathname)) {
    return context.next();
  }

  if (fetchDest === "iframe") {
    return context.next();
  }

  if (fetchDest === "document" || !fetchDest) {
    if (!hasAllowedReferrer(request)) {
      return new Response(BLOCKED_HTML, {
        status: 403,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  return context.next();
};
