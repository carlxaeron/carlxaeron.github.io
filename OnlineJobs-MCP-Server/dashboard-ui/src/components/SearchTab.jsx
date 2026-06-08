import { useState } from "react";
import { api } from "../api";

const DATE_FILTERS = ["LAST_24_HOURS", "LAST_3_DAYS"];

const emptyManual = {
  job_title: "",
  company: "",
  job_url: "",
  salary: "",
  tailored_tagline: "",
  extra_notes: "",
};

export default function SearchTab({ dateFilters, onCreated }) {
  const [keywords, setKeywords] = useState("react, laravel");
  const [dateFilter, setDateFilter] = useState("LAST_3_DAYS");
  const [remoteWork, setRemoteWork] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [manual, setManual] = useState(emptyManual);
  const [creatingManual, setCreatingManual] = useState(false);

  const filters = dateFilters?.length ? dateFilters : DATE_FILTERS;

  const runSearch = async () => {
    const terms = keywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    if (!terms.length) {
      setError("Enter at least one keyword.");
      return;
    }
    setSearching(true);
    setError("");
    setMessage("");
    setResults([]);
    try {
      const data = await api.search({
        keywords: terms,
        date_filter: dateFilter,
        remote_work: remoteWork,
        maximum_items: 50,
        max_listing_pages: 5,
      });
      setResults(data.jobs || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const applyToJob = async (job) => {
    const key = job.job_id || job.url;
    setApplyingId(key);
    setError("");
    setMessage("");
    try {
      const data = await api.createApplication({
        job_title: job.title,
        job_url: job.url,
        company: job.company === "—" ? "" : job.company || "",
        job_id: job.job_id ? String(job.job_id) : "",
        salary: job.salary === "—" ? "" : job.salary || "",
        location: job.location === "Philippines" ? "" : job.location || "",
        posted_at: job.posted_at === "—" ? "" : job.posted_at || "",
      });
      setMessage(`Application created: ${data.application?.job_title}`);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setApplyingId(null);
    }
  };

  const createManual = async (e) => {
    e.preventDefault();
    if (!manual.job_title.trim() || !manual.job_url.trim()) {
      setError("Job title and URL are required.");
      return;
    }
    setCreatingManual(true);
    setError("");
    setMessage("");
    try {
      const data = await api.createApplication(manual);
      setMessage(`Application created: ${data.application?.job_title}`);
      setManual(emptyManual);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingManual(false);
    }
  };

  return (
    <div className="panel">
      <div className="alert alert-info">
        Apify searches can take 2–5 minutes. Keep this tab open while waiting.
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Keywords (comma-separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <select
          className="select"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          {filters.map((f) => (
            <option key={f} value={f}>
              {f.replace(/_/g, " ").toLowerCase()}
            </option>
          ))}
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={remoteWork}
            onChange={(e) => setRemoteWork(e.target.checked)}
          />
          Remote only
        </label>
        <button
          type="button"
          className="btn btn-primary"
          onClick={runSearch}
          disabled={searching}
        >
          {searching ? "Searching…" : "Search OnlineJobs.ph"}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {searching && (
        <p>Running Apify actor — this may take a few minutes…</p>
      )}

      {!searching && results.length > 0 && (
        <>
          <p style={{ marginBottom: 12, color: "var(--green-mid)" }}>
            {total} job(s) found
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Salary</th>
                  <th>Posted</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {results.map((job) => {
                  const key = job.job_id || job.url;
                  return (
                    <tr key={key}>
                      <td>{job.title}</td>
                      <td>{job.company}</td>
                      <td>{job.salary}</td>
                      <td>{job.posted_at}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={applyingId === key}
                          onClick={() => applyToJob(job)}
                        >
                          {applyingId === key ? "Applying…" : "Apply"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid var(--green-light)" }} />

      <h3 style={{ margin: "0 0 12px", color: "var(--green-dark)" }}>Manual apply</h3>
      <form onSubmit={createManual}>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Job title *"
            value={manual.job_title}
            onChange={(e) => setManual({ ...manual, job_title: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Company"
            value={manual.company}
            onChange={(e) => setManual({ ...manual, company: e.target.value })}
          />
          <input
            className="input"
            placeholder="Job URL *"
            value={manual.job_url}
            onChange={(e) => setManual({ ...manual, job_url: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Salary"
            value={manual.salary}
            onChange={(e) => setManual({ ...manual, salary: e.target.value })}
          />
          <input
            className="input"
            placeholder="Custom CV tagline (optional)"
            value={manual.tailored_tagline}
            onChange={(e) => setManual({ ...manual, tailored_tagline: e.target.value })}
          />
        </div>
        <div className="field-block">
          <textarea
            className="textarea"
            placeholder="Extra notes for cover message (optional)"
            value={manual.extra_notes}
            onChange={(e) => setManual({ ...manual, extra_notes: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={creatingManual}>
          {creatingManual ? "Creating…" : "Create application package"}
        </button>
      </form>
    </div>
  );
}
