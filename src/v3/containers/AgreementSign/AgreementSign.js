import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import "../../styles/sass/v3-app.scss";
import SignaturePad from "./SignaturePad";
import {
  extractAgreementBodyHtml,
  fetchPublicAgreement,
  submitPublicAgreementSign,
  typedNameToSignatureDataUrl,
} from "./agreementApi";

function todayInputValue() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDisplayDate(value) {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return String(value);
  }
}

/**
 * Public client sign page — carlmanuel.com/?sign={token}
 */
export default function AgreementSign({ token }) {
  const padRef = useRef(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error
  const [errorKind, setErrorKind] = useState(null); // not_found | expired | revoked | network | other
  const [errorMessage, setErrorMessage] = useState("");
  const [agreement, setAgreement] = useState(null);
  const [signatoryName, setSignatoryName] = useState("");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [signedAt, setSignedAt] = useState(todayInputValue());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [justSigned, setJustSigned] = useState(false);

  const loadAgreement = useCallback(async () => {
    if (!token) {
      setLoadState("error");
      setErrorKind("not_found");
      setErrorMessage("Missing agreement token.");
      return;
    }

    setLoadState("loading");
    setErrorKind(null);
    setErrorMessage("");
    setJustSigned(false);

    try {
      const result = await fetchPublicAgreement(token);
      if (!result.ok) {
        setLoadState("error");
        if (result.status === 404) setErrorKind("not_found");
        else if (result.status === 410) {
          const status = result.data?.status;
          setErrorKind(status === "revoked" ? "revoked" : "expired");
        } else setErrorKind("other");
        setErrorMessage(result.message || "Unable to load this agreement.");
        setAgreement(result.data?.filledHtml ? result.data : null);
        return;
      }

      setAgreement(result.data);
      setSignatoryName(result.data.clientSignatoryName || result.data.clientName || "");
      setSignatoryTitle(result.data.clientSignatoryTitle || "");
      if (result.data.clientSignedAt) {
        try {
          const d = new Date(result.data.clientSignedAt);
          if (!Number.isNaN(d.getTime())) {
            setSignedAt(d.toISOString().slice(0, 10));
          }
        } catch {
          // keep default
        }
      }
      setLoadState("ready");
    } catch {
      setLoadState("error");
      setErrorKind("network");
      setErrorMessage("Network error while loading the agreement. Please try again.");
    }
  }, [token]);

  useEffect(() => {
    loadAgreement();
  }, [loadAgreement]);

  const bodyHtml = useMemo(
    () => extractAgreementBodyHtml(agreement?.filledHtml || ""),
    [agreement?.filledHtml]
  );

  const isSigned = agreement?.status === "signed" || Boolean(agreement?.clientSignatureData);
  const signable = Boolean(agreement?.signable) && !isSigned;
  const showAcceptance = loadState === "ready" && signable && !justSigned;
  const showSignedBlock =
    loadState === "ready" && (isSigned || justSigned) && agreement?.clientSignatureData;

  const handleClearPad = () => {
    padRef.current?.clear();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const name = signatoryName.trim();
    if (!name) {
      setSubmitError("Please enter your printed name.");
      return;
    }

    let signatureData = padRef.current?.getDataUrl() || "";
    if (!signatureData) {
      signatureData = typedNameToSignatureDataUrl(name);
    }
    if (!signatureData) {
      setSubmitError("Please draw your signature or enter your printed name.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitPublicAgreementSign(token, {
        signatoryName: name,
        signatoryTitle: signatoryTitle.trim(),
        signedAt: signedAt || todayInputValue(),
        signatureData,
      });

      if (!result.ok) {
        if (result.status === 409) {
          setSubmitError("This agreement was already signed.");
          await loadAgreement();
        } else if (result.status === 410) {
          setSubmitError(result.message || "This agreement link is no longer valid.");
          setLoadState("error");
          setErrorKind(result.data?.status === "revoked" ? "revoked" : "expired");
          setErrorMessage(result.message);
        } else {
          setSubmitError(result.message || "Could not submit signature.");
        }
        return;
      }

      setAgreement(result.data);
      setJustSigned(true);
    } catch {
      setSubmitError("Network error while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const title = agreement?.businessName
    ? `Sign agreement — ${agreement.businessName}`
    : "Sign service agreement";

  return (
    <div className="agreement-sign" data-testid="agreement-sign">
      <Helmet>
        <title>{title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="agreement-sign__chrome agreement-sign__header">
        <div className="agreement-sign__brand">
          <span className="agreement-sign__brand-name">Carl Manuel</span>
          <span className="agreement-sign__brand-sep">·</span>
          <span className="agreement-sign__brand-sub">Service agreement</span>
        </div>
        {showSignedBlock && (
          <button type="button" className="agreement-sign__btn agreement-sign__btn--ghost" onClick={handlePrint}>
            Print / Save as PDF
          </button>
        )}
      </header>

      {loadState === "loading" && (
        <div className="agreement-sign__status" data-testid="agreement-sign-loading" role="status">
          Loading agreement…
        </div>
      )}

      {loadState === "error" && (
        <div
          className="agreement-sign__status agreement-sign__status--error"
          data-testid="agreement-sign-error"
          role="alert"
        >
          <h1>
            {errorKind === "expired" && "This link has expired"}
            {errorKind === "revoked" && "This link has been revoked"}
            {errorKind === "not_found" && "Agreement not found"}
            {(errorKind === "network" || errorKind === "other" || !errorKind) && "Unable to open agreement"}
          </h1>
          <p>{errorMessage}</p>
          {errorKind === "network" && (
            <button type="button" className="agreement-sign__btn" onClick={loadAgreement}>
              Try again
            </button>
          )}
        </div>
      )}

      {loadState === "ready" && agreement && (
        <>
          {(justSigned || isSigned) && (
            <div
              className="agreement-sign__banner agreement-sign__chrome"
              data-testid="agreement-sign-success"
              role="status"
            >
              {justSigned
                ? "Thank you — your signed agreement has been submitted."
                : "This agreement has already been signed."}
            </div>
          )}

          <article
            className="agreement-sign__document"
            data-testid="agreement-sign-document"
            aria-label="Service agreement"
          >
            <div
              className="agreement-sign__body"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {showSignedBlock && (
              <section className="agreement-sign__acceptance agreement-sign__acceptance--signed" aria-label="Client signature">
                <h2>Client acceptance</h2>
                <dl className="agreement-sign__meta">
                  <div>
                    <dt>Printed name</dt>
                    <dd>{agreement.clientSignatoryName}</dd>
                  </div>
                  {agreement.clientSignatoryTitle && (
                    <div>
                      <dt>Title</dt>
                      <dd>{agreement.clientSignatoryTitle}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDisplayDate(agreement.clientSignedAt)}</dd>
                  </div>
                </dl>
                <div className="agreement-sign__signature-preview">
                  <p className="agreement-sign__signature-label">Signature</p>
                  <img
                    src={agreement.clientSignatureData}
                    alt={`Signature of ${agreement.clientSignatoryName || "client"}`}
                    className="agreement-sign__signature-img"
                  />
                </div>
              </section>
            )}
          </article>

          {showAcceptance && (
            <form
              className="agreement-sign__acceptance agreement-sign__chrome"
              data-testid="agreement-sign-form"
              onSubmit={handleSubmit}
            >
              <h2>Client acceptance</h2>
              <p className="agreement-sign__hint">
                Review the agreement above, then sign below. Drawing is preferred; if you leave the pad blank,
                your printed name will be used as a typed signature.
              </p>

              <label className="agreement-sign__field">
                <span>Printed name</span>
                <input
                  type="text"
                  name="signatoryName"
                  autoComplete="name"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  required
                  disabled={submitting}
                />
              </label>

              <label className="agreement-sign__field">
                <span>Title (optional)</span>
                <input
                  type="text"
                  name="signatoryTitle"
                  autoComplete="organization-title"
                  value={signatoryTitle}
                  onChange={(e) => setSignatoryTitle(e.target.value)}
                  disabled={submitting}
                />
              </label>

              <label className="agreement-sign__field">
                <span>Date</span>
                <input
                  type="date"
                  name="signedAt"
                  value={signedAt}
                  onChange={(e) => setSignedAt(e.target.value)}
                  required
                  disabled={submitting}
                />
              </label>

              <div className="agreement-sign__field">
                <div className="agreement-sign__pad-header">
                  <span>Signature</span>
                  <button
                    type="button"
                    className="agreement-sign__btn agreement-sign__btn--text"
                    onClick={handleClearPad}
                    disabled={submitting}
                  >
                    Clear
                  </button>
                </div>
                <SignaturePad ref={padRef} disabled={submitting} />
              </div>

              {submitError && (
                <p className="agreement-sign__submit-error" role="alert" data-testid="agreement-sign-submit-error">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="agreement-sign__btn agreement-sign__btn--primary"
                disabled={submitting}
                data-testid="agreement-sign-submit"
              >
                {submitting ? "Submitting…" : "Submit signed agreement"}
              </button>
            </form>
          )}

          {showSignedBlock && (
            <div className="agreement-sign__chrome agreement-sign__footer-actions">
              <button type="button" className="agreement-sign__btn agreement-sign__btn--primary" onClick={handlePrint}>
                Print / Save as PDF
              </button>
            </div>
          )}

          {agreement.expiresAt && signable && (
            <p className="agreement-sign__expiry agreement-sign__chrome">
              Link expires {formatDisplayDate(agreement.expiresAt)}.
            </p>
          )}
        </>
      )}
    </div>
  );
}
