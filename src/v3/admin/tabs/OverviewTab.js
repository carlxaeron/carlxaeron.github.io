import { useCallback, useEffect, useState } from "react";
import { PREVIEW_SITES } from "../../config/previewWhitelist";
import { fetchAdminSummary } from "../adminApi";
import AdminBarChart from "../AdminBarChart";

function StatCard({ label, value, hint }) {
  return (
    <article className="v3-admin-stat">
      <p className="v3-admin-stat__value">{value}</p>
      <p className="v3-admin-stat__label">{label}</p>
      {hint && <p className="v3-admin-stat__hint">{hint}</p>}
    </article>
  );
}

function formatUpdatedAt(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return null;
  }
}

function OverviewTab() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    try {
      const data = await fetchAdminSummary();
      setSummary(data);
    } catch (err) {
      setError(err.message || "Could not load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 30000);
    return () => window.clearInterval(interval);
  }, [load]);

  const visitsByDay = (summary?.visitsByDay || []).map((row) => ({
    label: row.date?.slice(5) || row.date,
    count: row.count,
  }));

  const previewViews = (summary?.previewStats || [])
    .filter((row) => row.views > 0)
    .slice(0, 8)
    .map((row) => ({
      label: row.slug,
      count: row.views,
      key: row.slug,
    }));

  const likesBySite = (summary?.previewStats || [])
    .filter((row) => row.likes > 0)
    .slice(0, 8)
    .map((row) => ({
      label: row.slug,
      count: row.likes,
      key: row.slug,
    }));

  const updatedAt = formatUpdatedAt(summary?.generatedAt);

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <h2 className="v3-admin-panel__title">Analytics overview</h2>
        {updatedAt && (
          <p className="v3-admin-panel__meta">
            Updated {updatedAt} · refreshes every 30s
          </p>
        )}
      </div>

      {error && (
        <p className="v3-admin-alert" role="alert">
          {error}
          {error.includes("401") || error.toLowerCase().includes("session") ? null : (
            <button type="button" className="v3-admin-link v3-admin-link--inline" onClick={load}>
              Retry
            </button>
          )}
        </p>
      )}

      <div className="v3-admin-stat-grid">
        <StatCard label="Client demo sites" value={PREVIEW_SITES.length} hint="Whitelisted previews" />
        <StatCard
          label="Preview views"
          value={summary?.totalPreviewViews ?? (loading ? "…" : "0")}
          hint="All-time ?preview= opens"
        />
        <StatCard
          label="Preview visitors (7d)"
          value={summary?.uniquePreviewVisitorsWeek ?? (loading ? "…" : "0")}
        />
        <StatCard label="Likes" value={summary?.totalLikes ?? (loading ? "…" : "0")} />
        <StatCard label="Dislikes" value={summary?.totalDislikes ?? (loading ? "…" : "0")} />
        <StatCard
          label="Ready to proceed"
          value={summary?.totalAgrees ?? (loading ? "…" : "0")}
          hint="Preview agree"
        />
      </div>

      <div className="v3-admin-chart-grid">
        <AdminBarChart title="Preview views — last 7 days" rows={visitsByDay} />
        <AdminBarChart title="Views by client slug" rows={previewViews} />
        <AdminBarChart title="Likes by client slug" rows={likesBySite} />
      </div>
    </div>
  );
}

export default OverviewTab;
