import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import SectionTitle from "../../components/SectionTitle";
import { PREVIEW_SITES } from "../../config/previewWhitelist";
import { mapping } from "../../../mapping";

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
  if (!rows?.length) {
    return (
      <div className="v3-insights-chart">
        <h3 className="v3-insights-chart__title">{title}</h3>
        <p className="v3-insights-chart__empty">No data yet — stats appear as visitors browse previews.</p>
      </div>
    );
  }

  const max = Math.max(...rows.map((row) => row[valueKey] || 0), 1);

  return (
    <div className="v3-insights-chart">
      <h3 className="v3-insights-chart__title">{title}</h3>
      <div className="v3-insights-chart__rows">
        {rows.map((row) => (
          <div className="v3-insights-chart__row" key={row[labelKey]}>
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

  useEffect(() => {
    if (!isActive || summary || loading) return undefined;

    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(mapping.analyticsSummary)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.status === 200) {
          setSummary(json.data || null);
        } else {
          setError("Could not load live stats right now.");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load live stats right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isActive, summary, loading]);

  const clientSites = PREVIEW_SITES.length;
  const visitsByDay = (summary?.visitsByDay || []).map((row) => ({
    label: row.date.slice(5),
    count: row.count,
  }));

  const likesBySite = (summary?.previewStats || [])
    .filter((row) => row.likes > 0 || row.dislikes > 0)
    .slice(0, 6)
    .map((row) => ({
      label: row.slug,
      count: row.likes,
    }));

  const previewViews = (summary?.previewStats || [])
    .slice(0, 6)
    .map((row) => ({
      label: row.slug,
      count: row.views,
    }));

  return (
    <section
      id="insights"
      className="v3-section-body v3-insights-section"
      style={{ background: "#D4E9E2", height: "100vh", overflow: "hidden" }}
    >
      <div className="v3-inner v3-scrollable v3-section-scroll">
        <animated.div style={headerSpring}>
          <SectionTitle subtitle="Live sideline demo metrics — client sites, visitors, and preview feedback" accent="Stats">
            Portfolio Insights
          </SectionTitle>
        </animated.div>

        <div className="v3-insights-grid">
          <StatCard label="Client demo sites" value={clientSites} hint="Netlify quotation samples" />
          <StatCard label="Total visits" value={summary?.totalVisits ?? (loading ? "…" : "0")} />
          <StatCard label="Visitors (7 days)" value={summary?.uniqueVisitorsWeek ?? (loading ? "…" : "0")} />
          <StatCard label="Preview likes" value={summary?.totalLikes ?? (loading ? "…" : "0")} />
          <StatCard label="Preview dislikes" value={summary?.totalDislikes ?? (loading ? "…" : "0")} />
        </div>

        {error && <p className="v3-insights-error" role="alert">{error}</p>}

        <div className="v3-insights-charts">
          <BarChart title="Visits — last 7 days" rows={visitsByDay} />
          <BarChart title="Preview views by client slug" rows={previewViews} />
          <BarChart title="Likes by client slug" rows={likesBySite} />
        </div>
      </div>
    </section>
  );
}

export default V3Insights;
