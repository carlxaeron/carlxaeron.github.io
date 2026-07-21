import { useCallback, useEffect, useState } from "react";
import { fetchAdminAnalytics, fetchAdminAnalyticsVisits } from "../adminApi";
import AdminBarChart from "../AdminBarChart";
import {
  ANALYTICS_RANGE_OPTIONS,
  VISIT_DEVICE_FILTERS,
  VISIT_EVENT_FILTERS,
  feedbackSentimentLabel,
  formatAnalyticsUpdatedAt,
  mapOutreachFunnelRows,
  mapPreviewMetricRows,
  mapTopCountRows,
  mapVisitsByDayRows,
  normalizeAnalyticsDays,
  visitClientLabel,
  visitEventLabel,
  visitTargetLabel,
} from "../analyticsHelpers";

function StatCard({ label, value, hint }) {
  return (
    <article className="v3-admin-stat">
      <p className="v3-admin-stat__value">{value}</p>
      <p className="v3-admin-stat__label">{label}</p>
      {hint && <p className="v3-admin-stat__hint">{hint}</p>}
    </article>
  );
}

function formatWhen(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function AnalyticsTab() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [visits, setVisits] = useState([]);
  const [visitsMeta, setVisitsMeta] = useState(null);
  const [visitsPrivacy, setVisitsPrivacy] = useState("");
  const [visitsError, setVisitsError] = useState("");
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [visitPage, setVisitPage] = useState(1);
  const [eventType, setEventType] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("");

  const load = useCallback(async (rangeDays = days) => {
    setError("");
    try {
      const next = await fetchAdminAnalytics(normalizeAnalyticsDays(rangeDays));
      setData(next);
    } catch (err) {
      setError(err.message || "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, [days]);

  const loadVisits = useCallback(async () => {
    setVisitsError("");
    setVisitsLoading(true);
    try {
      const next = await fetchAdminAnalyticsVisits({
        days: normalizeAnalyticsDays(days),
        page: visitPage,
        perPage: 25,
        eventType: eventType || undefined,
        device: deviceFilter || undefined,
      });
      setVisits(next?.items || []);
      setVisitsMeta(next?.pagination || null);
      setVisitsPrivacy(next?.privacyNote || "");
    } catch (err) {
      setVisitsError(err.message || "Could not load recent visits.");
      setVisits([]);
      setVisitsMeta(null);
    } finally {
      setVisitsLoading(false);
    }
  }, [days, visitPage, eventType, deviceFilter]);

  useEffect(() => {
    setLoading(true);
    load(days);
    const interval = window.setInterval(() => load(days), 60000);
    return () => window.clearInterval(interval);
  }, [days, load]);

  useEffect(() => {
    loadVisits();
  }, [loadVisits]);

  const updatedAt = formatAnalyticsUpdatedAt(data?.generatedAt);
  const visitsTotal = mapVisitsByDayRows(data?.visitsByDay, "total");
  const visitsPreview = mapVisitsByDayRows(data?.visitsByDay, "previewViews");
  const sections = mapTopCountRows(data?.topSections);
  const devices = mapTopCountRows(data?.devices);
  const referrers = mapTopCountRows(data?.topReferrers);
  const previewViews = mapPreviewMetricRows(data?.previewStats, "views", 12);
  const previewLikes = mapPreviewMetricRows(data?.previewStats, "likes", 8);
  const previewAgrees = mapPreviewMetricRows(data?.previewStats, "agrees", 8);
  const funnelRows = mapOutreachFunnelRows(data?.outreachFunnel);
  const recentFeedback = data?.recentFeedback || [];

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <div>
          <h2 className="v3-admin-panel__title">Detailed analytics</h2>
          {updatedAt && (
            <p className="v3-admin-panel__meta">
              Updated {updatedAt} · refreshes every 60s
            </p>
          )}
        </div>
        <div className="v3-admin-range" role="group" aria-label="Date range">
          {ANALYTICS_RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              type="button"
              className={`v3-admin-range__btn${days === opt.days ? " is-active" : ""}`}
              onClick={() => {
                setDays(opt.days);
                setVisitPage(1);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="v3-admin-alert" role="alert">
          {error}
          <button type="button" className="v3-admin-link v3-admin-link--inline" onClick={() => load(days)}>
            Retry
          </button>
        </p>
      )}

      <div className="v3-admin-stat-grid">
        <StatCard
          label="Events"
          value={data?.totalEvents ?? (loading ? "…" : "0")}
          hint={`Last ${days} days`}
        />
        <StatCard
          label="Unique visitors"
          value={data?.uniqueVisitors ?? (loading ? "…" : "0")}
          hint="In selected range"
        />
        <StatCard
          label="Preview views"
          value={data?.previewViews ?? (loading ? "…" : "0")}
          hint={`Range · all-time ${data?.totalPreviewViews ?? "—"}`}
        />
        <StatCard
          label="Section views"
          value={data?.sectionViews ?? (loading ? "…" : "0")}
        />
        <StatCard
          label="Page views"
          value={data?.pageViews ?? (loading ? "…" : "0")}
        />
        <StatCard
          label="Likes"
          value={data?.totalLikes ?? (loading ? "…" : "0")}
          hint={`In range: ${data?.likesInRange ?? 0}`}
        />
        <StatCard
          label="Dislikes"
          value={data?.totalDislikes ?? (loading ? "…" : "0")}
          hint={`In range: ${data?.dislikesInRange ?? 0}`}
        />
        <StatCard
          label="Ready to proceed"
          value={data?.totalAgrees ?? (loading ? "…" : "0")}
          hint={`In range: ${data?.agreesInRange ?? 0}`}
        />
      </div>

      <div className="v3-admin-chart-grid">
        <AdminBarChart title={`All visits — last ${days} days`} rows={visitsTotal} />
        <AdminBarChart title={`Preview views — last ${days} days`} rows={visitsPreview} />
        <AdminBarChart title="Top sections" rows={sections} />
        <AdminBarChart title="Devices" rows={devices} />
        <AdminBarChart title="Top referrers" rows={referrers} />
        <AdminBarChart title="Outreach funnel" rows={funnelRows} />
      </div>

      <h3 className="v3-admin-section-title">Preview performance</h3>
      <div className="v3-admin-chart-grid">
        <AdminBarChart title={`Views by slug (${days}d)`} rows={previewViews} />
        <AdminBarChart title="Likes by slug (all-time)" rows={previewLikes} />
        <AdminBarChart title="Ready by slug (all-time)" rows={previewAgrees} />
      </div>

      <div className="v3-admin-table-wrap v3-admin-table-wrap--spaced">
        <table className="v3-admin-table">
          <caption className="v3-admin-table__caption">
            Preview stats (views in range · feedback all-time)
          </caption>
          <thead>
            <tr>
              <th scope="col">Slug</th>
              <th scope="col">Views</th>
              <th scope="col">Likes</th>
              <th scope="col">Dislikes</th>
              <th scope="col">Ready</th>
            </tr>
          </thead>
          <tbody>
            {(data?.previewStats || []).length === 0 ? (
              <tr>
                <td colSpan={5} className="v3-admin-empty">
                  {loading ? "Loading…" : "No preview activity yet."}
                </td>
              </tr>
            ) : (
              (data.previewStats || []).map((row) => (
                <tr key={row.slug}>
                  <td>{row.slug}</td>
                  <td>{row.views ?? 0}</td>
                  <td>{row.likes ?? 0}</td>
                  <td>{row.dislikes ?? 0}</td>
                  <td>{row.agrees ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="v3-admin-section-head">
        <h3 className="v3-admin-section-title">Recent visits</h3>
        <div className="v3-admin-toolbar v3-admin-toolbar--filters">
          <label className="v3-admin-field v3-admin-field--inline">
            <span className="v3-admin-field__label">Event</span>
            <select
              className="v3-admin-field__input"
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                setVisitPage(1);
              }}
            >
              {VISIT_EVENT_FILTERS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="v3-admin-field v3-admin-field--inline">
            <span className="v3-admin-field__label">Device</span>
            <select
              className="v3-admin-field__input"
              value={deviceFilter}
              onChange={(e) => {
                setDeviceFilter(e.target.value);
                setVisitPage(1);
              }}
            >
              {VISIT_DEVICE_FILTERS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {visitsPrivacy && (
        <p className="v3-admin-panel__meta v3-admin-panel__meta--tight">{visitsPrivacy}</p>
      )}
      {visitsError && (
        <p className="v3-admin-alert" role="alert">
          {visitsError}
          <button type="button" className="v3-admin-link v3-admin-link--inline" onClick={loadVisits}>
            Retry
          </button>
        </p>
      )}
      <div className="v3-admin-table-wrap">
        <table className="v3-admin-table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Visitor</th>
              <th scope="col">Event</th>
              <th scope="col">Target</th>
              <th scope="col">Device</th>
              <th scope="col">Browser / OS</th>
              <th scope="col">Referrer</th>
              <th scope="col">IP</th>
              <th scope="col">IP hash</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={9} className="v3-admin-empty">
                  {visitsLoading ? "Loading…" : "No visits in this range."}
                </td>
              </tr>
            ) : (
              visits.map((row, idx) => (
                <tr key={`${row.visitorId}-${row.createdAt}-${idx}`}>
                  <td>{formatWhen(row.createdAt)}</td>
                  <td>
                    <code className="v3-admin-code">{row.visitorId || "—"}</code>
                  </td>
                  <td>{visitEventLabel(row.eventType)}</td>
                  <td>{visitTargetLabel(row)}</td>
                  <td>{row.device || "—"}</td>
                  <td>{visitClientLabel(row)}</td>
                  <td className="v3-admin-cell-clamp">{row.referrer || "Direct"}</td>
                  <td>
                    <code className="v3-admin-code" title="Client IP from request (X-Forwarded-For aware)">
                      {row.ipAddress || "—"}
                    </code>
                  </td>
                  <td>
                    <code className="v3-admin-code" title="Salted truncated hash (exclusion matching)">
                      {row.ipHash || "—"}
                    </code>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {visitsMeta && visitsMeta.lastPage > 1 && (
        <div className="v3-admin-pagination">
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--ghost"
            disabled={visitPage <= 1 || visitsLoading}
            onClick={() => setVisitPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>
            Page {visitPage} of {visitsMeta.lastPage}
            {typeof visitsMeta.total === "number" ? ` · ${visitsMeta.total} visits` : ""}
          </span>
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--ghost"
            disabled={visitPage >= visitsMeta.lastPage || visitsLoading}
            onClick={() => setVisitPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      <h3 className="v3-admin-section-title">Recent preview feedback</h3>
      <div className="v3-admin-table-wrap">
        <table className="v3-admin-table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Slug</th>
              <th scope="col">Sentiment</th>
              <th scope="col">Comment</th>
            </tr>
          </thead>
          <tbody>
            {recentFeedback.length === 0 ? (
              <tr>
                <td colSpan={4} className="v3-admin-empty">
                  {loading ? "Loading…" : "No feedback in this range."}
                </td>
              </tr>
            ) : (
              recentFeedback.map((row, idx) => (
                <tr key={`${row.slug}-${row.createdAt}-${idx}`}>
                  <td>{formatWhen(row.createdAt)}</td>
                  <td>{row.slug}</td>
                  <td>
                    <span className={`v3-admin-pill v3-admin-pill--${row.sentiment || "unknown"}`}>
                      {feedbackSentimentLabel(row.sentiment)}
                    </span>
                  </td>
                  <td>{row.comment || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AnalyticsTab;
