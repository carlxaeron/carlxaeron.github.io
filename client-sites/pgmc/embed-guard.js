(function () {
  var ALLOWED_PARENTS = [
    "carlmanuel.com",
    "www.carlmanuel.com",
    "carlxaeron.github.io",
    "localhost",
  ];

  function isInIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  function hasAllowedReferrer() {
    var ref = document.referrer || "";
    return ALLOWED_PARENTS.some(function (host) {
      return ref.indexOf(host) !== -1;
    });
  }

  if (!isInIframe() || !hasAllowedReferrer()) {
    document.documentElement.innerHTML =
      '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Preview only</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif;background:#00473e;color:#fff;padding:24px;text-align:center}p{max-width:28rem;line-height:1.6;margin:0}</style></head><body><p>This demo is only available through the portfolio preview. Visit <strong>carlmanuel.com</strong> to view client samples.</p></body></html>';
    throw new Error("Direct access blocked");
  }
})();
