import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/sass/v3-app.scss";

const IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups";
const DESKTOP_VIEWPORT = { width: 1280, height: 800 };

function PreviewShowcase({ previewUrl, host, label }) {
  const [desktopBlocked, setDesktopBlocked] = useState(false);
  const [mobileBlocked, setMobileBlocked] = useState(false);
  const [desktopScale, setDesktopScale] = useState(0.25);
  const bezelRef = useRef(null);

  const displayLabel = label || host;

  useEffect(() => {
    document.documentElement.classList.add("v3-preview-active");
    document.body.classList.add("v3-preview-active");
    return () => {
      document.documentElement.classList.remove("v3-preview-active");
      document.body.classList.remove("v3-preview-active");
    };
  }, []);

  useEffect(() => {
    const bezel = bezelRef.current;
    if (!bezel || typeof ResizeObserver === "undefined") return undefined;

    const updateScale = () => {
      const { width, height } = bezel.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const scale = Math.min(
        width / DESKTOP_VIEWPORT.width,
        height / DESKTOP_VIEWPORT.height
      );
      setDesktopScale(scale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(bezel);
    return () => observer.disconnect();
  }, []);

  const handleBack = useCallback(() => {
    const next = new URL(window.location.href);
    next.searchParams.delete("preview");
    window.location.href = next.pathname + (next.search || "") + next.hash;
  }, []);

  const embedNotice = (blocked) =>
    blocked ? (
      <p className="v3-preview-embed-notice">
        This site may block embedding in the preview frame.
      </p>
    ) : null;

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
            <p className="v3-preview-eyebrow">Client site preview</p>
            <h1 className="v3-preview-title">{displayLabel}</h1>
            <p className="v3-preview-host">{host}</p>
          </div>
        </div>
      </header>

      <main className="v3-preview-main">
        <div className="v3-preview-devices">
          <section className="v3-preview-device v3-preview-device--desktop" aria-label="Desktop preview">
            <h2 className="v3-preview-device__label">Desktop</h2>
            <div className="v3-preview-monitor">
              <div className="v3-preview-monitor__bezel" ref={bezelRef}>
                <div
                  className="v3-preview-iframe-scaler"
                  style={{
                    width: Math.round(DESKTOP_VIEWPORT.width * desktopScale),
                    height: Math.round(DESKTOP_VIEWPORT.height * desktopScale),
                  }}
                >
                  <div
                    className="v3-preview-iframe-scaler__inner"
                    style={{
                      width: DESKTOP_VIEWPORT.width,
                      height: DESKTOP_VIEWPORT.height,
                      transform: `scale(${desktopScale})`,
                    }}
                  >
                    <iframe
                      title={`Desktop preview of ${displayLabel}`}
                      src={previewUrl}
                      className="v3-preview-iframe v3-preview-iframe--desktop"
                      sandbox={IFRAME_SANDBOX}
                      scrolling="yes"
                      width={DESKTOP_VIEWPORT.width}
                      height={DESKTOP_VIEWPORT.height}
                      onError={() => setDesktopBlocked(true)}
                    />
                  </div>
                </div>
              </div>
              <div className="v3-preview-monitor__stand" aria-hidden="true" />
            </div>
            {embedNotice(desktopBlocked)}
          </section>

          <section className="v3-preview-device v3-preview-device--mobile" aria-label="Mobile preview">
            <h2 className="v3-preview-device__label">Mobile</h2>
            <div className="v3-preview-phone">
              <div className="v3-preview-phone__notch" aria-hidden="true" />
              <iframe
                title={`Mobile preview of ${displayLabel}`}
                src={previewUrl}
                className="v3-preview-iframe v3-preview-iframe--mobile"
                sandbox={IFRAME_SANDBOX}
                scrolling="yes"
                loading="lazy"
                onError={() => setMobileBlocked(true)}
              />
            </div>
            {embedNotice(mobileBlocked)}
          </section>
        </div>
      </main>
    </div>
  );
}

export function PreviewShowcaseError({ host }) {
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
          {host
            ? `"${host}" is not on the allowed preview list. Only approved Netlify client sites can be embedded.`
            : "Missing or invalid preview parameter. Use ?preview=your-site.netlify.app"}
        </p>
        <button type="button" className="v3-btn v3-btn--primary" onClick={handleBack}>
          Back to portfolio
        </button>
      </div>
    </div>
  );
}

export default PreviewShowcase;
