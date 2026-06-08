import { useEffect, useState } from "react";
import { api, copyText } from "../api";

function formatDate(value) {
  if (!value) return "—";
  return String(value).slice(0, 10);
}

export default function DetailDrawer({ applicationId, statuses, onClose, onSaved }) {
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true);
    setError("");
    api
      .getApplication(applicationId)
      .then((data) => {
        setRecord(data);
        setStatus(data.status || "draft");
        setNotes(data.notes || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [applicationId]);

  if (!applicationId) return null;

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await api.patchApplication(applicationId, { status, notes });
      setRecord(updated);
      setMessage("Saved.");
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const copySubmission = async () => {
    try {
      const { text } = await api.getSubmission(applicationId);
      await copyText(text);
      setMessage("Submission copied to clipboard.");
    } catch (err) {
      setError(err.message);
    }
  };

  const copyShareLink = async () => {
    if (!record?.cv_share_url) return;
    await copyText(record.cv_share_url);
    setMessage("CV share link copied.");
  };

  const uploadCv = async () => {
    setSaving(true);
    setError("");
    try {
      await api.uploadCv(applicationId);
      const refreshed = await api.getApplication(applicationId);
      setRecord(refreshed);
      setMessage("CV uploaded to cloud.");
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer">
        <div className="drawer-header">
          <div>
            <h2 className="drawer-title">{record?.job_title || "Application"}</h2>
            <p className="drawer-meta">
              {record?.company || "Unknown company"} · Created {formatDate(record?.created_at)}
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="drawer-body">
          {loading && <p>Loading…</p>}
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {!loading && record && (
            <>
              <div className="action-row">
                {record.job_url && (
                  <a
                    className="btn btn-secondary"
                    href={record.job_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open job URL
                  </a>
                )}
                <button type="button" className="btn btn-secondary" onClick={copySubmission}>
                  Copy submission
                </button>
                {record.cv_share_url && (
                  <button type="button" className="btn btn-secondary" onClick={copyShareLink}>
                    Copy CV link
                  </button>
                )}
                <a className="btn btn-secondary" href={api.cvDownloadUrl(applicationId)}>
                  Download CV
                </a>
                <button type="button" className="btn btn-ghost" onClick={uploadCv} disabled={saving}>
                  Re-upload CV
                </button>
              </div>

              <div className="field-block">
                <label className="field-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  className="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-block">
                <label className="field-label" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Follow-ups, interview dates, recruiter name…"
                />
              </div>

              <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>

              <div className="field-block" style={{ marginTop: 20 }}>
                <span className="field-label">Details</span>
                <p className="mono">ID: {record.id}</p>
                <p>Salary: {record.salary || "—"}</p>
                <p>Tagline: {record.tailored_tagline || "—"}</p>
                <p>Location: {record.location || "—"}</p>
                <p>Posted: {record.posted_at || "—"}</p>
                <p>Submitted: {formatDate(record.submitted_at)}</p>
                {record.cv_share_url && (
                  <p className="mono">CV: {record.cv_share_url}</p>
                )}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
