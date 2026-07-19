import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PreviewFeedback from "../../../components/PreviewFeedback";
import "../../styles/sass/v3-app.scss";

const IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups";
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

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
          title={title}
          src={previewUrl}
          className={className}
          sandbox={IFRAME_SANDBOX}
          scrolling="yes"
          width={viewport.width}
          height={viewport.height}
          loading={loading}
          onError={onError}
        />
      </div>
    </div>
  );
}

function ScrollHint({ children, className = "" }) {
  return (
    <p className={`v3-preview-scroll-hint ${className}`.trim()} role="note">
      <span className="v3-preview-scroll-hint__icon" aria-hidden="true">
        ↕
      </span>
      {children}
    </p>
  );
}

function PreviewDevice({
  variant,
  label,
  hint,
  previewUrl,
  displayLabel,
  screenRef,
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
      <ScrollHint className={`v3-preview-scroll-hint--${variant}`}>{hint}</ScrollHint>
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

function PreviewShowcase({ previewUrl, label, previewSlug }) {
  const [siteDesktopBlocked, setSiteDesktopBlocked] = useState(false);
  const [siteMobileBlocked, setSiteMobileBlocked] = useState(false);
  const [adminDesktopBlocked, setAdminDesktopBlocked] = useState(false);
  const [adminMobileBlocked, setAdminMobileBlocked] = useState(false);

  const siteDesktopRef = useRef(null);
  const siteMobileRef = useRef(null);
  const adminDesktopRef = useRef(null);
  const adminMobileRef = useRef(null);

  const siteDesktopScale = useViewportScale(siteDesktopRef, DESKTOP_VIEWPORT, 0.25);
  const siteMobileScale = useViewportScale(siteMobileRef, MOBILE_VIEWPORT, 0.65);
  const adminDesktopScale = useViewportScale(adminDesktopRef, DESKTOP_VIEWPORT, 0.25);
  const adminMobileScale = useViewportScale(adminMobileRef, MOBILE_VIEWPORT, 0.65);

  const adminPreviewUrl = useMemo(() => buildAdminPreviewUrl(previewUrl), [previewUrl]);
  const displayLabel = label || "Client site preview";

  useEffect(() => {
    document.documentElement.classList.add("v3-preview-active");
    document.body.classList.add("v3-preview-active");
    return () => {
      document.documentElement.classList.remove("v3-preview-active");
      document.body.classList.remove("v3-preview-active");
    };
  }, []);

  const handleBack = useCallback(() => {
    const next = new URL(window.location.href);
    next.searchParams.delete("preview");
    window.location.href = next.pathname + (next.search || "") + next.hash;
  }, []);

  return (
    <div className="v3-preview-page" data-testid="preview-showcase">
      <header className="v3-preview-header">
        <div className="v3-preview-header__inner">
          <div className="v3-preview-actions">
            <button type="button" className="v3-btn v3-btn--ghost" onClick={handleBack}>
              Back to portfolio
            </button>
          </div>
          <div className="v3-preview-header__copy">
            <p className="v3-preview-eyebrow">Website + admin system preview</p>
            <h1 className="v3-preview-title">{displayLabel}</h1>
          </div>
        </div>
      </header>

      <main className="v3-preview-main">
        <p className="v3-preview-scroll-hint v3-preview-scroll-hint--intro" role="note">
          <span className="v3-preview-scroll-hint__icon" aria-hidden="true">
            ↕
          </span>
          Scroll inside each frame to explore the sample site and admin. Click admin nav to browse
          pages.
        </p>

        <div className="v3-preview-devices v3-preview-devices--quad">
          <div className="v3-preview-devices__row v3-preview-devices__row--site">
            <PreviewDevice
              variant="desktop"
              label="Site — Desktop"
              hint="Scroll inside the monitor to explore the marketing site."
              previewUrl={previewUrl}
              displayLabel={displayLabel}
              screenRef={siteDesktopRef}
              viewport={DESKTOP_VIEWPORT}
              scale={siteDesktopScale}
              iframeClass="v3-preview-iframe v3-preview-iframe--desktop"
              onError={() => setSiteDesktopBlocked(true)}
              blocked={siteDesktopBlocked}
            />
            <PreviewDevice
              variant="mobile"
              label="Site — Mobile"
              hint="Scroll inside the phone to explore the marketing site."
              previewUrl={previewUrl}
              displayLabel={displayLabel}
              screenRef={siteMobileRef}
              viewport={MOBILE_VIEWPORT}
              scale={siteMobileScale}
              iframeClass="v3-preview-iframe v3-preview-iframe--mobile"
              loading="lazy"
              onError={() => setSiteMobileBlocked(true)}
              blocked={siteMobileBlocked}
            />
          </div>

          <div className="v3-preview-devices__row v3-preview-devices__row--admin">
            <PreviewDevice
              variant="desktop"
              label="Admin — Desktop"
              hint="Browse the admin — click sidebar links to explore pages."
              previewUrl={adminPreviewUrl}
              displayLabel={displayLabel}
              screenRef={adminDesktopRef}
              viewport={DESKTOP_VIEWPORT}
              scale={adminDesktopScale}
              iframeClass="v3-preview-iframe v3-preview-iframe--desktop v3-preview-iframe--admin"
              loading="lazy"
              onError={() => setAdminDesktopBlocked(true)}
              blocked={adminDesktopBlocked}
            />
            <PreviewDevice
              variant="mobile"
              label="Admin — Mobile"
              hint="Try the mobile admin — bottom nav and drawer menu work here."
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
          </div>
        </div>

        {previewSlug && (
          <PreviewFeedback previewSlug={previewSlug} previewLabel={displayLabel} />
        )}
      </main>
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
            : "Missing or invalid preview parameter. Use ?preview=client-slug (for example ?preview=jk-construction)."}
        </p>
        <button type="button" className="v3-btn v3-btn--primary" onClick={handleBack}>
          Back to portfolio
        </button>
      </div>
    </div>
  );
}

export default PreviewShowcase;
