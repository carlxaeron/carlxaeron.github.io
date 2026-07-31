import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import PreviewFeedback from "../../../components/PreviewFeedback";
import { mapping } from "../../../mapping";
import { getVisitorContext } from "../../../utils/visitTracker";
import {
  getPreviewSettingsDefaults,
  getPreviewSettingsSchema,
} from "../../config/previewWhitelist";
import useModalBodyLock from "../../hooks/useModalBodyLock";
import "../../styles/sass/v3-app.scss";

const MSG_APPLY = "cm:preview-settings:apply";
const SETTINGS_TOOLTIP =
  "Hey — you can tweak this preview. Change photos, hero, and sections.";

function previewOriginFromUrl(previewUrl) {
  try {
    return new URL(previewUrl).origin;
  } catch {
    return null;
  }
}

const IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups";
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const MOBILE_CHROME_QUERY = "(max-width: 991px)";

function readStoredViewMode(slug) {
  if (typeof window === "undefined" || !slug) return "mobile";
  try {
    const stored = sessionStorage.getItem(`previewViewMode:${slug}`);
    if (stored === "desktop" || stored === "mobile") return stored;
  } catch {
    // sessionStorage may be unavailable in private mode
  }
  return "mobile";
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    setMatches(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

export function buildAdminPreviewUrl(siteUrl) {
  const base = (siteUrl || "").replace(/\/+$/, "");
  return `${base}/admin/`;
}

function useViewportScale(containerRef, viewport, initialScale) {
  const [scale, setScale] = useState(initialScale);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return undefined;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      setScale(Math.min(width / viewport.width, height / viewport.height));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, viewport.width, viewport.height]);

  return scale;
}

function ViewportIframe({
  viewport,
  scale,
  previewUrl,
  title,
  className,
  loading,
  onError,
  iframeRef,
  onLoad,
}) {
  return (
    <div
      className="v3-preview-iframe-scaler"
      style={{
        width: Math.round(viewport.width * scale),
        height: Math.round(viewport.height * scale),
      }}
    >
      <div
        className="v3-preview-iframe-scaler__inner"
        style={{
          width: viewport.width,
          height: viewport.height,
          transform: `scale(${scale})`,
        }}
      >
        <iframe
          ref={iframeRef}
          title={title}
          src={previewUrl}
          className={className}
          sandbox={IFRAME_SANDBOX}
          scrolling="yes"
          width={viewport.width}
          height={viewport.height}
          loading={loading}
          onError={onError}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}

function ScrollHint({ children, className = "", aside = null }) {
  return (
    <div className={`v3-preview-scroll-hint-row ${aside ? "v3-preview-scroll-hint-row--with-aside" : ""}`.trim()}>
      <p className={`v3-preview-scroll-hint ${className}`.trim()} role="note">
        <span className="v3-preview-scroll-hint__icon" aria-hidden="true">
          ↕
        </span>
        {children}
      </p>
      {aside}
    </div>
  );
}

function PreviewDevice({
  variant,
  label,
  hint,
  hintAside = null,
  previewUrl,
  displayLabel,
  screenRef,
  iframeRef,
  onIframeLoad,
  viewport,
  scale,
  iframeClass,
  loading,
  onError,
  blocked,
}) {
  const isDesktop = variant === "desktop";

  return (
    <section
      className={`v3-preview-device v3-preview-device--${variant}`}
      aria-label={`${label} preview`}
    >
      <h2 className="v3-preview-device__label">{label}</h2>
      <ScrollHint className={`v3-preview-scroll-hint--${variant}`} aside={hintAside}>
        {hint}
      </ScrollHint>
      {isDesktop ? (
        <div className="v3-preview-monitor">
          <div className="v3-preview-monitor__bezel">
            <div
              className="v3-preview-monitor__screen"
              ref={screenRef}
              title={hint}
            >
              <ViewportIframe
                viewport={viewport}
                scale={scale}
                previewUrl={previewUrl}
                title={`${label} preview of ${displayLabel}`}
                className={iframeClass}
                loading={loading}
                onError={onError}
                iframeRef={iframeRef}
                onLoad={onIframeLoad}
              />
            </div>
          </div>
          <div className="v3-preview-monitor__stand" aria-hidden="true" />
        </div>
      ) : (
        <div className="v3-preview-phone">
          <div className="v3-preview-phone__notch" aria-hidden="true" />
          <div className="v3-preview-phone__screen" ref={screenRef} title={hint}>
            <ViewportIframe
              viewport={viewport}
              scale={scale}
              previewUrl={previewUrl}
              title={`${label} preview of ${displayLabel}`}
              className={iframeClass}
              loading={loading}
              onError={onError}
              iframeRef={iframeRef}
              onLoad={onIframeLoad}
            />
          </div>
        </div>
      )}
      {blocked ? (
        <p className="v3-preview-embed-notice">
          This site may block embedding in the preview frame.
        </p>
      ) : null}
    </section>
  );
}

function PreviewViewModeToggle({ viewMode, onChange }) {
  return (
    <div
      className="v3-preview-view-mode"
      data-testid="preview-view-mode"
      role="group"
      aria-label="Preview device view"
    >
      <button
        type="button"
        className={`v3-preview-view-mode__btn${
          viewMode === "mobile" ? " v3-preview-view-mode__btn--active" : ""
        }`}
        aria-pressed={viewMode === "mobile"}
        onClick={() => onChange("mobile")}
      >
        Mobile
      </button>
      <button
        type="button"
        className={`v3-preview-view-mode__btn${
          viewMode === "desktop" ? " v3-preview-view-mode__btn--active" : ""
        }`}
        aria-pressed={viewMode === "desktop"}
        onClick={() => onChange("desktop")}
      >
        Desktop
      </button>
    </div>
  );
}

const DEFAULT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const DEFAULT_IMAGE_MAX_BYTES = 2 * 1024 * 1024;

function PreviewSettingsImageField({ field, value, onChange, previewSlug, onError }) {
  const [uploading, setUploading] = useState(false);
  const id = `preview-setting-${field.key}`;
  const label = field.label || field.key;
  const accept = field.accept || DEFAULT_IMAGE_ACCEPT;
  const maxBytes = field.maxBytes || DEFAULT_IMAGE_MAX_BYTES;
  const hasCustomImage = typeof value === "string" && value.length > 0;

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > maxBytes) {
      onError?.("Image must be 2MB or smaller.");
      return;
    }

    const endpoint = mapping.previewSettingsUpload;
    if (!endpoint) {
      onError?.("Upload not configured.");
      return;
    }

    setUploading(true);
    onError?.(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (previewSlug) formData.append("previewSlug", previewSlug);
      formData.append("slot", field.key);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const json = await response.json().catch(() => ({}));
      const url = json?.data?.url || json?.url;
      if (!response.ok || !url) {
        throw new Error(json.message || "Upload failed");
      }
      onChange(field.key, url);
    } catch {
      onError?.("Could not upload image. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="v3-preview-settings__field v3-preview-settings__field--image">
      <span className="v3-preview-settings__label" id={`${id}-label`}>
        {label}
      </span>
      {hasCustomImage ? (
        <div className="v3-preview-settings__thumb-row">
          <img
            src={value}
            alt=""
            className="v3-preview-settings__thumb"
            data-testid={`preview-setting-thumb-${field.key}`}
          />
          <button
            type="button"
            className="v3-btn v3-btn--ghost v3-preview-settings__clear"
            onClick={() => onChange(field.key, field.default ?? null)}
            data-testid={`preview-setting-clear-${field.key}`}
          >
            Clear
          </button>
        </div>
      ) : (
        <p className="v3-preview-settings__image-hint">Using site default</p>
      )}
      <input
        id={id}
        className="v3-preview-settings__file"
        type="file"
        accept={accept}
        disabled={uploading}
        aria-labelledby={`${id}-label`}
        data-testid={`preview-setting-image-${field.key}`}
        onChange={handleFileChange}
      />
      {uploading ? (
        <p className="v3-preview-settings__upload-status" role="status">
          Uploading…
        </p>
      ) : null}
    </div>
  );
}

function PreviewSettingsField({ field, value, onChange, previewSlug, onError }) {
  const id = `preview-setting-${field.key}`;
  const label = field.label || field.key;

  if (field.type === "boolean") {
    return (
      <label className="v3-preview-settings__field v3-preview-settings__field--boolean" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.key, event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    const options = Array.isArray(field.options) ? field.options : [];
    return (
      <label className="v3-preview-settings__field" htmlFor={id}>
        <span className="v3-preview-settings__label">{label}</span>
        <select
          id={id}
          className="v3-preview-settings__control"
          value={value ?? ""}
          onChange={(event) => onChange(field.key, event.target.value)}
        >
          {options.map((option) => (
            <option key={String(option)} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "text" || field.type === "textarea") {
    const Control = field.type === "textarea" ? "textarea" : "input";
    return (
      <label className="v3-preview-settings__field" htmlFor={id}>
        <span className="v3-preview-settings__label">{label}</span>
        <Control
          id={id}
          className={`v3-preview-settings__control${
            field.type === "textarea" ? " v3-preview-settings__control--textarea" : ""
          }`}
          type={field.type === "text" ? "text" : undefined}
          rows={field.type === "textarea" ? 3 : undefined}
          maxLength={field.maxLength}
          value={value ?? ""}
          onChange={(event) => onChange(field.key, event.target.value)}
        />
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <PreviewSettingsImageField
        field={field}
        value={value}
        onChange={onChange}
        previewSlug={previewSlug}
        onError={onError}
      />
    );
  }

  // number (default)
  return (
    <label className="v3-preview-settings__field" htmlFor={id}>
      <span className="v3-preview-settings__label">{label}</span>
      <input
        id={id}
        className="v3-preview-settings__control"
        type="number"
        min={field.min}
        max={field.max}
        value={value ?? ""}
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === "") {
            onChange(field.key, field.default ?? "");
            return;
          }
          const next = Number(raw);
          onChange(field.key, Number.isFinite(next) ? next : field.default);
        }}
      />
    </label>
  );
}

function PreviewSettingsLauncher({ fields, open, onOpen }) {
  if (!fields.length) return null;

  const button = (
    <button
      type="button"
      className="v3-preview-settings-fab"
      onClick={onOpen}
      aria-expanded={open}
      aria-controls="v3-preview-settings-panel"
      data-testid="preview-settings-open"
    >
      <span className="v3-preview-settings-fab__icon" aria-hidden="true">
        ⚙
      </span>
      <span className="v3-preview-settings-fab__label">Customize</span>
    </button>
  );

  return (
    <div className="v3-preview-settings-launcher" data-testid="preview-settings-launcher">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="preview-settings-tooltip" data-testid="preview-settings-tooltip">
            {SETTINGS_TOOLTIP}
          </Tooltip>
        }
      >
        {button}
      </OverlayTrigger>
    </div>
  );
}

function PreviewSettingsPanel({
  show,
  fields,
  settings,
  onChange,
  onSave,
  saveStatus,
  saveError,
  onError,
  previewSlug,
  onClose,
}) {
  useModalBodyLock(show);

  if (!fields.length) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="md"
      animation={false}
      className="v3-modal-layer"
      backdropClassName="v3-modal-backdrop"
      dialogClassName="v3-preview-settings-modal"
      contentClassName="v3-preview-settings-modal__content"
    >
      <Modal.Header className="v3-preview-settings-modal__header">
        <Modal.Title id="v3-preview-settings-panel">Try these settings</Modal.Title>
        <button
          type="button"
          className="btn-close v3-modal-dismiss"
          aria-label="Close settings"
          onClick={onClose}
          data-testid="preview-settings-close"
        />
      </Modal.Header>
      <Modal.Body className="v3-preview-settings-modal__body" data-testid="preview-settings-panel">
        <p className="v3-preview-settings__hint">
          Changes update the site frames live. Save sends your choices to Carl.
        </p>
        <div className="v3-preview-settings__fields">
          {fields.map((field) => (
            <PreviewSettingsField
              key={field.key}
              field={field}
              value={settings[field.key]}
              onChange={onChange}
              previewSlug={previewSlug}
              onError={onError}
            />
          ))}
        </div>
        {saveError ? (
          <p className="v3-preview-settings__error" role="alert">
            {saveError}
          </p>
        ) : null}
      </Modal.Body>
      <Modal.Footer className="v3-preview-settings-modal__footer">
        <button
          type="button"
          className="v3-btn v3-btn--ghost"
          onClick={onClose}
        >
          Close
        </button>
        <button
          type="button"
          className="v3-btn v3-btn--primary v3-preview-settings__save"
          onClick={onSave}
          disabled={saveStatus === "saving" || saveStatus === "sent"}
          data-testid="preview-settings-save"
        >
          {saveStatus === "saving"
            ? "Sending…"
            : saveStatus === "sent"
              ? "Sent to Carl"
              : "Save"}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

function PreviewShowcase({ previewUrl, label, previewSlug }) {
  const isMobileChrome = useMediaQuery(MOBILE_CHROME_QUERY);
  const [viewMode, setViewMode] = useState(() => readStoredViewMode(previewSlug));
  const [siteDesktopBlocked, setSiteDesktopBlocked] = useState(false);
  const [siteMobileBlocked, setSiteMobileBlocked] = useState(false);
  const [adminDesktopBlocked, setAdminDesktopBlocked] = useState(false);
  const [adminMobileBlocked, setAdminMobileBlocked] = useState(false);

  const settingsFields = useMemo(
    () => getPreviewSettingsSchema(previewSlug),
    [previewSlug]
  );
  const [settings, setSettings] = useState(() =>
    getPreviewSettingsDefaults(getPreviewSettingsSchema(previewSlug))
  );
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveError, setSaveError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const siteDesktopScreenRef = useRef(null);
  const siteMobileScreenRef = useRef(null);
  const adminDesktopRef = useRef(null);
  const adminMobileRef = useRef(null);
  const siteDesktopIframeRef = useRef(null);
  const siteMobileIframeRef = useRef(null);

  const siteDesktopScale = useViewportScale(siteDesktopScreenRef, DESKTOP_VIEWPORT, 0.25);
  const siteMobileScale = useViewportScale(siteMobileScreenRef, MOBILE_VIEWPORT, 0.65);
  const adminDesktopScale = useViewportScale(adminDesktopRef, DESKTOP_VIEWPORT, 0.25);
  const adminMobileScale = useViewportScale(adminMobileRef, MOBILE_VIEWPORT, 0.65);

  const adminPreviewUrl = useMemo(() => buildAdminPreviewUrl(previewUrl), [previewUrl]);
  const displayLabel = label || "Client site preview";
  const previewOrigin = useMemo(() => previewOriginFromUrl(previewUrl), [previewUrl]);

  useEffect(() => {
    document.documentElement.classList.add("v3-preview-active");
    document.body.classList.add("v3-preview-active");
    return () => {
      document.documentElement.classList.remove("v3-preview-active");
      document.body.classList.remove("v3-preview-active");
    };
  }, []);

  // Re-seed defaults when slug changes (never GET /previewSettings).
  useEffect(() => {
    setSettings(getPreviewSettingsDefaults(getPreviewSettingsSchema(previewSlug)));
    setSaveStatus("idle");
    setSaveError(null);
  }, [previewSlug]);

  const applySettingsToSiteIframes = useCallback(
    (nextSettings) => {
      if (!previewSlug || !previewOrigin || !settingsFields.length) return;
      const payload = {
        type: MSG_APPLY,
        slug: previewSlug,
        settings: nextSettings,
      };
      [siteDesktopIframeRef, siteMobileIframeRef].forEach((ref) => {
        const win = ref.current?.contentWindow;
        if (win && typeof win.postMessage === "function") {
          win.postMessage(payload, previewOrigin);
        }
      });
    },
    [previewOrigin, previewSlug, settingsFields.length]
  );

  useEffect(() => {
    applySettingsToSiteIframes(settings);
  }, [settings, applySettingsToSiteIframes]);

  const handleSiteIframeLoad = useCallback(() => {
    applySettingsToSiteIframes(settingsRef.current);
  }, [applySettingsToSiteIframes]);

  const handleSettingChange = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
    setSaveError(null);
  }, []);

  const handleSettingsError = useCallback((message) => {
    setSaveError(message);
    if (message) setSaveStatus("idle");
  }, []);

  const handleSaveSettings = useCallback(async () => {
    const endpoint = mapping.previewSettings;
    if (!endpoint || !previewSlug) return;

    setSaveStatus("saving");
    setSaveError(null);

    try {
      const { visitorId, sessionId } = getVisitorContext();
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previewSlug,
          settings,
          visitorId,
          sessionId,
        }),
      });
      if (!response.ok) {
        throw new Error("Save failed");
      }
      setSaveStatus("sent");
    } catch {
      setSaveStatus("idle");
      setSaveError("Could not send. Try again.");
    }
  }, [previewSlug, settings]);

  const handleBack = useCallback(() => {
    const next = new URL(window.location.href);
    next.searchParams.delete("preview");
    window.location.href = next.pathname + (next.search || "") + next.hash;
  }, []);

  const handleViewModeChange = useCallback(
    (mode) => {
      setViewMode(mode);
      if (!previewSlug) return;
      try {
        sessionStorage.setItem(`previewViewMode:${previewSlug}`, mode);
      } catch {
        // ignore storage failures
      }
    },
    [previewSlug]
  );

  const showDesktopPanels = !isMobileChrome || viewMode === "desktop";
  const showMobilePanels = !isMobileChrome || viewMode === "mobile";
  const settingsLauncher = (
    <PreviewSettingsLauncher
      fields={settingsFields}
      open={settingsOpen}
      onOpen={() => setSettingsOpen(true)}
    />
  );

  const pageClassName = [
    "v3-preview-page",
    isMobileChrome && "v3-preview-page--mobile-chrome",
    isMobileChrome && `v3-preview-page--mode-${viewMode}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={pageClassName} data-testid="preview-showcase">
      <header className="v3-preview-header">
        <div className="v3-preview-header__inner">
          <div className="v3-preview-actions">
            <button type="button" className="v3-btn v3-btn--ghost" onClick={handleBack}>
              Back to portfolio
            </button>
          </div>
          <div className="v3-preview-header__copy">
            <p className="v3-preview-eyebrow">Business system + website sample</p>
            <h1 className="v3-preview-title">{displayLabel}</h1>
            {isMobileChrome ? (
              <PreviewViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
            ) : null}
          </div>
        </div>
      </header>

      <main className="v3-preview-main">
        <p className="v3-preview-scroll-hint v3-preview-scroll-hint--intro" role="note">
          <span className="v3-preview-scroll-hint__icon" aria-hidden="true">
            ↕
          </span>
          {isMobileChrome
            ? "Browse the admin system demo and marketing site. Switch to Desktop for monitors."
            : "Browse the admin system demo first, then the marketing site on desktop and mobile."}
        </p>

        <div className="v3-preview-devices v3-preview-devices--quad">
          <div className="v3-preview-devices__row v3-preview-devices__row--admin">
            {showDesktopPanels ? (
              <PreviewDevice
                variant="desktop"
                label="Admin — Desktop"
                hint="Browse the admin system demo — packages, bookings, and more."
                previewUrl={adminPreviewUrl}
                displayLabel={displayLabel}
                screenRef={adminDesktopRef}
                viewport={DESKTOP_VIEWPORT}
                scale={adminDesktopScale}
                iframeClass="v3-preview-iframe v3-preview-iframe--desktop v3-preview-iframe--admin"
                onError={() => setAdminDesktopBlocked(true)}
                blocked={adminDesktopBlocked}
              />
            ) : null}
            {showMobilePanels ? (
              <PreviewDevice
                variant="mobile"
                label="Admin — Mobile"
                hint="Browse the admin demo — try the bottom nav."
                previewUrl={adminPreviewUrl}
                displayLabel={displayLabel}
                screenRef={adminMobileRef}
                viewport={MOBILE_VIEWPORT}
                scale={adminMobileScale}
                iframeClass="v3-preview-iframe v3-preview-iframe--mobile v3-preview-iframe--admin"
                loading="lazy"
                onError={() => setAdminMobileBlocked(true)}
                blocked={adminMobileBlocked}
              />
            ) : null}
          </div>

          <div className="v3-preview-devices__row v3-preview-devices__row--site">
            {showDesktopPanels ? (
              <PreviewDevice
                variant="desktop"
                label="Site — Desktop"
                hint="Scroll inside the monitor to explore the marketing site."
                hintAside={settingsLauncher}
                previewUrl={previewUrl}
                displayLabel={displayLabel}
                screenRef={siteDesktopScreenRef}
                iframeRef={siteDesktopIframeRef}
                onIframeLoad={handleSiteIframeLoad}
                viewport={DESKTOP_VIEWPORT}
                scale={siteDesktopScale}
                iframeClass="v3-preview-iframe v3-preview-iframe--desktop"
                loading="lazy"
                onError={() => setSiteDesktopBlocked(true)}
                blocked={siteDesktopBlocked}
              />
            ) : null}
            {showMobilePanels ? (
              <PreviewDevice
                variant="mobile"
                label="Site — Mobile"
                hint="Scroll inside the phone to explore the marketing site."
                hintAside={showDesktopPanels ? null : settingsLauncher}
                previewUrl={previewUrl}
                displayLabel={displayLabel}
                screenRef={siteMobileScreenRef}
                iframeRef={siteMobileIframeRef}
                onIframeLoad={handleSiteIframeLoad}
                viewport={MOBILE_VIEWPORT}
                scale={siteMobileScale}
                iframeClass="v3-preview-iframe v3-preview-iframe--mobile"
                loading="lazy"
                onError={() => setSiteMobileBlocked(true)}
                blocked={siteMobileBlocked}
              />
            ) : null}
          </div>
        </div>
      </main>

      {previewSlug ? (
        <div className="v3-preview-feedback-dock" data-testid="preview-feedback-dock">
          <PreviewFeedback previewSlug={previewSlug} previewLabel={displayLabel} />
        </div>
      ) : null}

      <PreviewSettingsPanel
        show={settingsOpen}
        fields={settingsFields}
        settings={settings}
        onChange={handleSettingChange}
        onSave={handleSaveSettings}
        saveStatus={saveStatus}
        saveError={saveError}
        onError={handleSettingsError}
        previewSlug={previewSlug}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export function PreviewShowcaseError({ previewKey }) {
  useEffect(() => {
    document.documentElement.classList.add("v3-preview-active");
    document.body.classList.add("v3-preview-active");
    return () => {
      document.documentElement.classList.remove("v3-preview-active");
      document.body.classList.remove("v3-preview-active");
    };
  }, []);

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="v3-preview-page v3-preview-page--error" data-testid="preview-showcase-error">
      <div className="v3-preview-error">
        <h1 className="v3-preview-title">Preview not available</h1>
        <p className="v3-preview-error__text">
          {previewKey
            ? `"${previewKey}" is not on the allowed preview list.`
            : "Missing or invalid preview parameter. Use ?preview=client-slug (for example ?preview=machinemate)."}
        </p>
        <button type="button" className="v3-btn v3-btn--primary" onClick={handleBack}>
          Back to portfolio
        </button>
      </div>
    </div>
  );
}

export default PreviewShowcase;
