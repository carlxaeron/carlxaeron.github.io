import { useCallback, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";
import { PREVIEW_SITES } from "../../config/previewWhitelist";
import { mapping } from "../../../mapping";

const REFRESH_MS = 30000;

/** Public-facing label: keep first/last 2 chars, obscure the middle (e.g. g3k-cad → g3****ad). */
export function maskClientSlug(slug) {
  const s = String(slug || "").trim();
  if (s.length <= 4) return "*".repeat(Math.max(s.length, 4));
  return `${s.slice(0, 2)}****${s.slice(-2)}`;
}

function StatCard({ label, value, hint }) {
  return (
    <article className="v3-insights-stat">
      <p className="v3-insights-stat__value">{value}</p>
      <p className="v3-insights-stat__label">{label}</p>
      {hint && <p className="v3-insights-stat__hint">{hint}</p>}
    </article>
  );
}

function BarChart({ title, rows, valueKey = "count", labelKey = "label" }) {
  const hasData = rows?.some((row) => (row[valueKey] || 0) > 0);

  if (!rows?.length || !hasData) {
    return (
      <div className="v3-insights-chart">
        <h3 className="v3-insights-chart__title">{title}</h3>
        <p className="v3-insights-chart__empty">No preview data yet — open a client preview link to generate stats.</p>
      </div>
    );
  }

  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);

  return (
    <div className="v3-insights-chart">
      <h3 className="v3-insights-chart__title">{title}</h3>
      <div className="v3-insights-chart__rows">
        {rows.map((row) => (
          <div className="v3-insights-chart__row" key={row.key || row[labelKey]}>
            <span className="v3-insights-chart__label">{row[labelKey]}</span>
            <div className="v3-insights-chart__track" aria-hidden="true">
              <div
                className="v3-insights-chart__fill"
                style={{ width: `${((row[valueKey] || 0) / max) * 100}%` }}
              />
            </div>
            <span className="v3-insights-chart__value">{row[valueKey] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatUpdatedAt(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return null;
  }
}

function V3Insights({ isActive }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 },
    delay: 50,
    config: { tension: 220, friction: 28 },
  });

  const loadSummary = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError("");

    try {
      const res = await fetch(mapping.analyticsSummary, { cache: "no-store" });
      const json = await res.json();
      if (json.status === 200 && json.data) {
        setSummary(json.data);
      } else {
        setError("Could not load preview stats right now.");
      }
    } catch {
      setError("Could not load preview stats right now.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isActive) return undefined;

    loadSummary(true);
    const interval = window.setInterval(() => loadSummary(false), REFRESH_MS);

    return () => window.clearInterval(interval);
  }, [isActive, loadSummary]);

  const clientSites = PREVIEW_SITES.length;
  const visitsByDay = (summary?.visitsByDay || []).map((row) => ({
    label: row.date.slice(5),
    count: row.count,
  }));

  const likesBySite = (summary?.previewStats || [])
    .filter((row) => row.likes > 0 || row.dislikes > 0)
    .slice(0, 6)
    .map((row) => ({
      label: maskClientSlug(row.slug),
      count: row.likes,
      key: row.slug,
    }));

  const previewViews = (summary?.previewStats || [])
    .filter((row) => row.views > 0)
    .slice(0, 6)
    .map((row) => ({
      label: maskClientSlug(row.slug),
      count: row.views,
      key: row.slug,
    }));

  const updatedAt = formatUpdatedAt(summary?.generatedAt);

  return (
    <section
      id="insights"
      className="v3-section-body"
      style={{ background: "#00473e", height: "100vh", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll">
        <animated.div style={headerSpring}>
          <SectionTitle subtitle="Preview-only metrics from client demos — refreshes every 30 seconds" accent="Stats">
            Portfolio Insights
          </SectionTitle>
        </animated.div>

        <div className="v3-insights-grid">
          <StatCard label="Client demo sites" value={clientSites} hint="Netlify quotation samples" />
          <StatCard
            label="Preview views"
            value={summary?.totalPreviewViews ?? (loading ? "…" : "0")}
            hint="All-time ?preview= opens"
          />
          <StatCard
            label="Preview visitors (7 days)"
            value={summary?.uniquePreviewVisitorsWeek ?? (loading ? "…" : "0")}
          />
          <StatCard label="Likes" value={summary?.totalLikes ?? (loading ? "…" : "0")} />
          <StatCard label="Dislikes" value={summary?.totalDislikes ?? (loading ? "…" : "0")} />
        </div>

        {updatedAt && (
          <p className="v3-insights-meta">
            <span className="v3-insights-meta__badge">Live</span>
            Last updated {updatedAt} · auto-refresh every 30s
          </p>
        )}

        {error && <p className="v3-insights-empty" role="alert">{error}</p>}

        <div className="v3-insights-charts">
          <BarChart title="Preview views — last 7 days" rows={visitsByDay} />
          <BarChart title="Preview views by client slug" rows={previewViews} />
          <BarChart title="Likes by client slug" rows={likesBySite} />
        </div>
      </div>
    </section>
  );
}

export default V3Insights;
