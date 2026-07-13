const crypto = require("crypto");

function parseExclusionList(envValue) {
  if (!envValue) return new Set();
  return new Set(
    String(envValue)
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  );
}

let cachedExclusions = null;

function getAnalyticsExclusions() {
  if (!cachedExclusions) {
    cachedExclusions = {
      ipHashes: parseExclusionList(process.env.ANALYTICS_EXCLUDE_IP_HASHES),
      visitorIds: parseExclusionList(process.env.ANALYTICS_EXCLUDE_VISITOR_IDS),
    };
  }
  return cachedExclusions;
}

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(`${ip}:carlxaeron-portfolio`).digest("hex").slice(0, 16);
}

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip || "";
}

function isExcludedAnalyticsRequest(request, { visitorId } = {}) {
  const { ipHashes, visitorIds } = getAnalyticsExclusions();
  const ipHash = hashIp(getClientIp(request));
  if (ipHash && ipHashes.has(ipHash.toLowerCase())) return true;
  if (visitorId && visitorIds.has(String(visitorId).trim().toLowerCase())) return true;
  return false;
}

function isExcludedVisitRecord(data = {}) {
  const { ipHashes, visitorIds } = getAnalyticsExclusions();
  if (data.ipHash && ipHashes.has(String(data.ipHash).toLowerCase())) return true;
  if (data.visitorId && visitorIds.has(String(data.visitorId).trim().toLowerCase())) return true;
  return false;
}

module.exports = {
  getAnalyticsExclusions,
  hashIp,
  getClientIp,
  isExcludedAnalyticsRequest,
  isExcludedVisitRecord,
};
