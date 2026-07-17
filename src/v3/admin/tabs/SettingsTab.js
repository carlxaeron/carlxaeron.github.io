import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO_SECTION_TOGGLE_IDS } from "../../config/portfolioContentSections";
import { SETTINGS_DEFAULTS } from "../../config/portfolioContentDefaults";
import { fetchAdminContent, saveAdminContent, sendPushTest } from "../adminApi";
import {
  disableAdminPush,
  enableAdminPush,
  getPushStatusLabel,
  refreshPushSubscriptionState,
} from "../pushNotifications";

const SECTION_LABELS = {
  home: "Home",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "News & Blog",
  insights: "Insights",
  contact: "Contact",
  quote: "Get a Quote",
};

function mergeForm(partial) {
  return {
    ...SETTINGS_DEFAULTS,
    ...partial,
    sections: {
      ...SETTINGS_DEFAULTS.sections,
      ...(partial?.sections || {}),
    },
  };
}

function SettingsTab() {
  const [form, setForm] = useState(() => mergeForm(null));
  const [source, setSource] = useState("static");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushState, setPushState] = useState({
    supported: false,
    permission: "default",
    subscribed: false,
  });
  const [pushLoading, setPushLoading] = useState(true);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushError, setPushError] = useState("");
  const [pushNotice, setPushNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = await fetchAdminContent("settings");
      setForm(mergeForm(data?.content));
      setSource(data?.source || (data?.content ? "cms" : "static"));
      setUpdatedAt(data?.updatedAt || null);
    } catch (err) {
      setError(err.message || "Could not load settings.");
      setForm(mergeForm(null));
      setSource("static");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refreshPushState = useCallback(async () => {
    setPushLoading(true);
    try {
      const state = await refreshPushSubscriptionState();
      setPushState(state);
    } finally {
      setPushLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPushState();
  }, [refreshPushState]);

  const handleEnablePush = async () => {
    setPushBusy(true);
    setPushError("");
    setPushNotice("");
    try {
      await enableAdminPush();
      await refreshPushState();
      setPushNotice("Notifications enabled on this device.");
    } catch (err) {
      setPushError(err.message || "Could not enable notifications.");
      await refreshPushState();
    } finally {
      setPushBusy(false);
    }
  };

  const handleDisablePush = async () => {
    setPushBusy(true);
    setPushError("");
    setPushNotice("");
    try {
      await disableAdminPush();
      await refreshPushState();
      setPushNotice("Notifications disabled on this device.");
    } catch (err) {
      setPushError(err.message || "Could not disable notifications.");
    } finally {
      setPushBusy(false);
    }
  };

  const handlePushTest = async () => {
    setPushBusy(true);
    setPushError("");
    setPushNotice("");
    try {
      await sendPushTest();
      setPushNotice("Test notification sent. Check this device shortly.");
    } catch (err) {
      setPushError(err.message || "Test notification failed.");
    } finally {
      setPushBusy(false);
    }
  };

  const pushStatusLabel = getPushStatusLabel(pushState);
  const pushStatusClass =
    !pushState.supported || pushState.permission === "denied"
      ? "v3-admin-pill--muted"
      : pushState.subscribed
        ? "v3-admin-pill--active"
        : "v3-admin-pill--gold";
  const canEnablePush =
    pushState.supported && pushState.permission !== "denied" && !pushState.subscribed;
  const canDisablePush = pushState.supported && pushState.subscribed;
  const canTestPush = pushState.supported && pushState.subscribed && pushState.permission === "granted";

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setSectionEnabled = (id, enabled) => {
    setForm((prev) => ({
      ...prev,
      sections: { ...prev.sections, [id]: enabled },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...form,
        brandName: String(form.brandName || "").trim() || SETTINGS_DEFAULTS.brandName,
        sections: { ...SETTINGS_DEFAULTS.sections, ...form.sections },
      };
      const data = await saveAdminContent("settings", payload);
      setForm(mergeForm(data?.content));
      setSource(data?.source || "cms");
      setUpdatedAt(data?.updatedAt || null);
      setNotice("Settings saved. Refresh the portfolio to see changes.");
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(mergeForm(null));
    setNotice("Loaded defaults into the form. Save to publish.");
    setError("");
  };

  if (loading) {
    return <p className="v3-admin-loading">Loading settings…</p>;
  }

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <div>
          <h2 className="v3-admin-panel__title">Site settings</h2>
          <p className="v3-admin-panel__meta">
            Source: {source}
            {updatedAt ? ` · Updated ${new Date(updatedAt).toLocaleString()}` : ""}
          </p>
        </div>
        <div className="v3-admin-toolbar">
          <button type="button" className="v3-admin-btn v3-admin-btn--ghost" onClick={handleReset}>
            Reset defaults
          </button>
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>

      {error && (
        <div className="v3-admin-alert" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="v3-admin-notice" role="status">
          {notice}
        </div>
      )}

      <div className="v3-admin-settings-grid">
        <section className="v3-admin-card">
          <h3 className="v3-admin-card__title">Brand &amp; banner</h3>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Brand name (header)</span>
            <input
              className="v3-admin-field__input"
              value={form.brandName}
              onChange={(e) => setField("brandName", e.target.value)}
            />
          </label>
          <label className="v3-admin-field v3-admin-field--check">
            <input
              type="checkbox"
              checked={!!form.announcementEnabled}
              onChange={(e) => setField("announcementEnabled", e.target.checked)}
            />
            <span>Show announcement banner</span>
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Announcement text</span>
            <input
              className="v3-admin-field__input"
              value={form.announcement}
              onChange={(e) => setField("announcement", e.target.value)}
              placeholder="Short message across the top of the portfolio"
            />
          </label>
          <label className="v3-admin-field v3-admin-field--check">
            <input
              type="checkbox"
              checked={!!form.showChatAgent}
              onChange={(e) => setField("showChatAgent", e.target.checked)}
            />
            <span>Show AI chat assistant</span>
          </label>
        </section>

        <section className="v3-admin-card">
          <h3 className="v3-admin-card__title">Contact links</h3>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Contact section subtitle</span>
            <textarea
              className="v3-admin-field__input v3-admin-field__textarea"
              rows={2}
              value={form.contactSubtitle}
              onChange={(e) => setField("contactSubtitle", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Email</span>
            <input
              className="v3-admin-field__input"
              value={form.contactEmail}
              onChange={(e) => setField("contactEmail", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">Email label</span>
            <input
              className="v3-admin-field__input"
              value={form.contactEmailLabel}
              onChange={(e) => setField("contactEmailLabel", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">GitHub URL</span>
            <input
              className="v3-admin-field__input"
              value={form.githubUrl}
              onChange={(e) => setField("githubUrl", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">GitHub label</span>
            <input
              className="v3-admin-field__input"
              value={form.githubLabel}
              onChange={(e) => setField("githubLabel", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">LinkedIn URL</span>
            <input
              className="v3-admin-field__input"
              value={form.linkedinUrl}
              onChange={(e) => setField("linkedinUrl", e.target.value)}
            />
          </label>
          <label className="v3-admin-field">
            <span className="v3-admin-field__label">LinkedIn label</span>
            <input
              className="v3-admin-field__input"
              value={form.linkedinLabel}
              onChange={(e) => setField("linkedinLabel", e.target.value)}
            />
          </label>
        </section>

        <section className="v3-admin-card v3-admin-card--wide v3-admin-push-card">
          <div className="v3-admin-push-card__head">
            <h3 className="v3-admin-card__title">Push notifications</h3>
            {!pushLoading && (
              <span className={`v3-admin-pill ${pushStatusClass}`}>{pushStatusLabel}</span>
            )}
          </div>
          <p className="v3-admin-muted">
            Get alerts on this device when someone submits Contact or Get a Quote. Registration
            happens here in Admin only — not for public portfolio visitors.
          </p>
          {pushLoading ? (
            <p className="v3-admin-loading">Checking notification status…</p>
          ) : (
            <>
              {pushError && (
                <div className="v3-admin-alert v3-admin-push-card__alert" role="alert">
                  {pushError}
                </div>
              )}
              {pushNotice && (
                <div className="v3-admin-notice v3-admin-push-card__alert" role="status">
                  {pushNotice}
                </div>
              )}
              <div className="v3-admin-push-card__actions">
                {canEnablePush && (
                  <button
                    type="button"
                    className="v3-admin-btn v3-admin-btn--primary"
                    onClick={handleEnablePush}
                    disabled={pushBusy}
                  >
                    {pushBusy ? "Working…" : "Enable notifications"}
                  </button>
                )}
                {canDisablePush && (
                  <button
                    type="button"
                    className="v3-admin-btn v3-admin-btn--ghost"
                    onClick={handleDisablePush}
                    disabled={pushBusy}
                  >
                    {pushBusy ? "Working…" : "Disable"}
                  </button>
                )}
                {canTestPush && (
                  <button
                    type="button"
                    className="v3-admin-btn v3-admin-btn--ghost"
                    onClick={handlePushTest}
                    disabled={pushBusy}
                  >
                    {pushBusy ? "Sending…" : "Send test notification"}
                  </button>
                )}
              </div>
              {pushState.permission === "denied" && (
                <p className="v3-admin-push-card__hint">
                  Notifications are blocked in browser settings. Allow notifications for this site,
                  then reload Admin.
                </p>
              )}
              <p className="v3-admin-push-card__hint">
                <strong>iPhone:</strong> Share → Add to Home Screen, open the installed app, sign
                in to Admin → Settings, then enable notifications (iOS 16.4+).
              </p>
            </>
          )}
        </section>

        <section className="v3-admin-card v3-admin-card--wide">
          <h3 className="v3-admin-card__title">Visible sections</h3>
          <p className="v3-admin-muted">
            Toggle which slides appear on carlmanuel.com. Home should stay on so visitors have a landing slide.
          </p>
          <div className="v3-admin-check-grid">
            {PORTFOLIO_SECTION_TOGGLE_IDS.map((id) => (
              <label key={id} className="v3-admin-field v3-admin-field--check">
                <input
                  type="checkbox"
                  checked={form.sections?.[id] !== false}
                  onChange={(e) => setSectionEnabled(id, e.target.checked)}
                  disabled={id === "home"}
                />
                <span>{SECTION_LABELS[id] || id}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsTab;
