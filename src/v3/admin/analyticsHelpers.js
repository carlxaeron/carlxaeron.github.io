/** Pure helpers for Admin → Analytics tab. */

export const ANALYTICS_RANGE_OPTIONS = [
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

export const VISIT_EVENT_FILTERS = [
  { value: "", label: "All events" },
  { value: "pageview", label: "Page view" },
  { value: "section_view", label: "Section" },
  { value: "preview_view", label: "Preview" },
];

export const VISIT_DEVICE_FILTERS = [
  { value: "", label: "All devices" },
  { value: "Desktop", label: "Desktop" },
  { value: "Mobile", label: "Mobile" },
  { value: "Tablet", label: "Tablet" },
];

export const ADMIN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "inbox", label: "Inbox" },
  { id: "outreach", label: "Outreach" },
  { id: "clients", label: "Clients" },
  { id: "cms", label: "CMS" },
  { id: "settings", label: "Settings" },
];

/**
 * @param {number} days
 * @returns {number}
 */
export function normalizeAnalyticsDays(days) {
  const n = Number(days);
  if ([7, 14, 30, 90].includes(n)) return n;
  return 30;
}

/**
 * @param {unknown} iso
 * @returns {string|null}
 */
export function formatAnalyticsUpdatedAt(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return null;
  }
}

/**
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDayLabel(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return "";
  return isoDate.length >= 10 ? isoDate.slice(5) : isoDate;
}

/**
 * @param {Array<{ date?: string, total?: number, previewViews?: number }>} rows
 * @param {"total"|"previewViews"} valueKey
 */
export function mapVisitsByDayRows(rows, valueKey = "total") {
  return (rows || []).map((row) => ({
    label: formatDayLabel(row.date),
    count: Number(row[valueKey] || 0),
    key: row.date || formatDayLabel(row.date),
  }));
}

/**
 * @param {Array<{ label?: string, count?: number }>} rows
 */
export function mapTopCountRows(rows) {
  return (rows || []).map((row, index) => ({
    label: row.label || "—",
    count: Number(row.count || 0),
    key: row.label || `row-${index}`,
  }));
}

/**
 * @param {Array<{ slug?: string, views?: number, likes?: number, dislikes?: number, agrees?: number }>} stats
 * @param {"views"|"likes"|"dislikes"|"agrees"} metric
 * @param {number} limit
 */
export function mapPreviewMetricRows(stats, metric = "views", limit = 10) {
  return (stats || [])
    .filter((row) => Number(row[metric] || 0) > 0)
    .slice(0, limit)
    .map((row) => ({
      label: row.slug || "—",
      count: Number(row[metric] || 0),
      key: `${metric}-${row.slug}`,
    }));
}

/**
 * @param {{ byStatus?: Record<string, number>, total?: number, autoFollowUp?: number, withInitialSent?: number, totalFollowUpsSent?: number }|null} funnel
 */
export function mapOutreachFunnelRows(funnel) {
  if (!funnel || typeof funnel !== "object") return [];
  const byStatus = funnel.byStatus || {};
  const statusRows = Object.entries(byStatus)
    .map(([label, count]) => ({
      label,
      count: Number(count || 0),
      key: `status-${label}`,
    }))
    .sort((a, b) => b.count - a.count);

  return [
    { label: "Total jobs", count: Number(funnel.total || 0), key: "total" },
    { label: "Initial sent", count: Number(funnel.withInitialSent || 0), key: "initial" },
    { label: "Auto follow-up on", count: Number(funnel.autoFollowUp || 0), key: "auto" },
    { label: "Follow-ups sent", count: Number(funnel.totalFollowUpsSent || 0), key: "followups" },
    ...statusRows,
  ].filter((row) => row.count > 0 || ["total", "initial", "auto", "followups"].includes(row.key));
}

/**
 * @param {string} sentiment
 * @returns {string}
 */
export function feedbackSentimentLabel(sentiment) {
  const s = String(sentiment || "").toLowerCase();
  if (s === "agree") return "Ready";
  if (s === "like") return "Like";
  if (s === "dislike") return "Dislike";
  return sentiment || "—";
}

/**
 * @param {string} eventType
 * @returns {string}
 */
export function visitEventLabel(eventType) {
  const t = String(eventType || "").toLowerCase();
  if (t === "pageview") return "Page";
  if (t === "section_view") return "Section";
  if (t === "preview_view") return "Preview";
  return eventType || "—";
}

/**
 * Section or preview slug for the visit target column.
 * @param {{ section?: string|null, previewSlug?: string|null, eventType?: string }} row
 */
export function visitTargetLabel(row) {
  if (!row || typeof row !== "object") return "—";
  if (row.previewSlug) return row.previewSlug;
  if (row.section) return row.section;
  return "—";
}

/**
 * @param {{ browser?: string, os?: string }} row
 */
export function visitClientLabel(row) {
  if (!row || typeof row !== "object") return "—";
  const browser = row.browser && row.browser !== "Unknown" ? row.browser : null;
  const os = row.os && row.os !== "Unknown" ? row.os : null;
  if (browser && os) return `${browser} · ${os}`;
  return browser || os || "—";
}
