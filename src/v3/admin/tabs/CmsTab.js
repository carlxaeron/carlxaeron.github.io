import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CMS_SECTION_IDS,
  CMS_SECTION_LABELS,
} from "../../config/portfolioContentSections";
import { PORTFOLIO_CONTENT_DEFAULTS } from "../../config/portfolioContentDefaults";
import { fetchAdminContent, saveAdminContent } from "../adminApi";

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

function CmsTab() {
  const [section, setSection] = useState(CMS_SECTION_IDS[0]);
  const [editorValue, setEditorValue] = useState("");
  const [source, setSource] = useState("static");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const defaults = useMemo(
    () => PORTFOLIO_CONTENT_DEFAULTS[section] ?? null,
    [section]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = await fetchAdminContent(section);
      const content = data?.content ?? defaults;
      setEditorValue(prettyJson(content));
      setSource(data?.source || (data?.content ? "cms" : "static"));
      setUpdatedAt(data?.updatedAt || null);
    } catch (err) {
      setError(err.message || "Could not load section.");
      setEditorValue(prettyJson(defaults));
      setSource("static");
    } finally {
      setLoading(false);
    }
  }, [section, defaults]);

  useEffect(() => {
    load();
  }, [load]);

  const handleResetDefaults = () => {
    setEditorValue(prettyJson(defaults));
    setNotice("Loaded static defaults into the editor. Save to publish.");
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const parsed = JSON.parse(editorValue);
      const data = await saveAdminContent(section, parsed);
      setSource(data?.source || "cms");
      setUpdatedAt(data?.updatedAt || null);
      setNotice(`Saved ${CMS_SECTION_LABELS[section] || section}.`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON — fix syntax before saving.");
      } else {
        setError(err.message || "Save failed.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <h2 className="v3-admin-panel__title">Portfolio CMS</h2>
        <p className="v3-admin-panel__meta">
          Edit live content with static fallback to bundled config when a section is empty.
        </p>
      </div>

      <div className="v3-admin-cms-toolbar">
        <label className="v3-admin-field">
          <span className="v3-admin-field__label">Section</span>
          <select
            className="v3-admin-field__input"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            {CMS_SECTION_IDS.map((id) => (
              <option key={id} value={id}>
                {CMS_SECTION_LABELS[id] || id}
              </option>
            ))}
          </select>
        </label>

        <div className="v3-admin-cms-toolbar__actions">
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--ghost"
            onClick={handleResetDefaults}
            disabled={loading || saving}
          >
            Load defaults
          </button>
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--ghost"
            onClick={load}
            disabled={loading || saving}
          >
            Reload
          </button>
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--primary"
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <p className="v3-admin-muted">
        Source: <strong>{source}</strong>
        {updatedAt ? ` · updated ${new Date(updatedAt).toLocaleString()}` : ""}
      </p>

      {error && (
        <p className="v3-admin-alert" role="alert">
          {error}
        </p>
      )}
      {notice && <p className="v3-admin-notice">{notice}</p>}

      {loading ? (
        <p className="v3-admin-loading">Loading section…</p>
      ) : (
        <label className="v3-admin-field v3-admin-cms-editor">
          <span className="v3-admin-field__label">JSON payload</span>
          <textarea
            className="v3-admin-field__input v3-admin-cms-editor__area"
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
            rows={24}
            spellCheck={false}
          />
        </label>
      )}
    </div>
  );
}

export default CmsTab;
