import { useCallback, useEffect, useState } from "react";
import { fetchAdminOutreach, pauseAdminOutreach, parsePaginatedList } from "../adminApi";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "paused") return "v3-admin-pill v3-admin-pill--muted";
  if (s === "completed") return "v3-admin-pill v3-admin-pill--gold";
  return "v3-admin-pill v3-admin-pill--active";
}

function OutreachTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pausingSlug, setPausingSlug] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const payload = await fetchAdminOutreach();
      const { rows: list } = parsePaginatedList(payload);
      setRows(list);
    } catch (err) {
      setError(err.message || "Could not load outreach jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handlePause = async (row) => {
    const slug = row.slug;
    if (!slug || pausingSlug) return;

    const confirmed = window.confirm(
      `Pause outreach for ${row.business_name || slug}? Follow-ups will stop.`
    );
    if (!confirmed) return;

    setPausingSlug(slug);
    setNotice("");
    try {
      await pauseAdminOutreach({ slug, contactEmail: row.contact_email });
      setNotice(`Outreach paused for ${slug}.`);
      await load();
    } catch (err) {
      setError(err.message || "Could not pause outreach.");
    } finally {
      setPausingSlug(null);
    }
  };

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <h2 className="v3-admin-panel__title">Outreach jobs</h2>
        <button type="button" className="v3-admin-btn v3-admin-btn--ghost" onClick={load}>
          Refresh
        </button>
      </div>

      {notice && <p className="v3-admin-notice">{notice}</p>}
      {error && <p className="v3-admin-alert" role="alert">{error}</p>}
      {loading && <p className="v3-admin-loading">Loading outreach…</p>}

      {!loading && !rows.length && (
        <p className="v3-admin-empty">No outreach jobs scheduled yet.</p>
      )}

      {!loading && rows.length > 0 && (
        <div className="v3-admin-table-wrap">
          <table className="v3-admin-table">
            <thead>
              <tr>
                <th scope="col">Business</th>
                <th scope="col">Slug</th>
                <th scope="col">Contact</th>
                <th scope="col">Status</th>
                <th scope="col">Follow-ups</th>
                <th scope="col">Next</th>
                <th scope="col" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isPaused =
                  String(row.status || "").toLowerCase() === "paused" || row.auto_followup === 0;
                return (
                  <tr key={row.id ?? `${row.slug}-${row.contact_email}`}>
                    <td>{row.business_name || "—"}</td>
                    <td>
                      <code className="v3-admin-code">{row.slug}</code>
                    </td>
                    <td>
                      <div>{row.contact_name || "—"}</div>
                      <div className="v3-admin-muted">{row.contact_email}</div>
                    </td>
                    <td>
                      <span className={statusClass(row.status)}>
                        {row.status || (isPaused ? "paused" : "active")}
                      </span>
                    </td>
                    <td>
                      {row.follow_up_count ?? 0} / {row.max_followups ?? 4}
                    </td>
                    <td>{formatDate(row.next_follow_up_at)}</td>
                    <td>
                      {!isPaused && (
                        <button
                          type="button"
                          className="v3-admin-btn v3-admin-btn--ghost v3-admin-btn--sm"
                          disabled={pausingSlug === row.slug}
                          onClick={() => handlePause(row)}
                        >
                          {pausingSlug === row.slug ? "Pausing…" : "Pause"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OutreachTab;
