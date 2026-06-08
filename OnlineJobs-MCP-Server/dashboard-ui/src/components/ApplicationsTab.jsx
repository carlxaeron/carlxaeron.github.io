import { useCallback, useEffect, useState } from "react";
import { api } from "../api";

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

function formatDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 10);
}

export default function ApplicationsTab({ statuses, onSelect }) {
  const [apps, setApps] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listApplications({
        status: statusFilter || undefined,
        q: query || undefined,
      });
      setApps(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, query]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="panel">
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search title, company, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p>Loading applications…</p>}

      {!loading && apps.length === 0 && (
        <div className="empty">No applications yet. Search jobs or create one manually.</div>
      )}

      {!loading && apps.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Company</th>
                <th>Salary</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr
                  key={app.id}
                  className="row-clickable"
                  onClick={() => onSelect(app.id)}
                >
                  <td>
                    <StatusBadge status={app.status || "draft"} />
                  </td>
                  <td>{app.job_title}</td>
                  <td>{app.company || "—"}</td>
                  <td>{app.salary || "—"}</td>
                  <td>{formatDate(app.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
