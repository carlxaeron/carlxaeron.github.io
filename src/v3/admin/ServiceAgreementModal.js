import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createAdminAgreement,
  fetchAdminAgreements,
  isOpenAgreementStatus,
  pickOpenAgreement,
  resendAdminAgreement,
  revokeAdminAgreement,
} from "./adminApi";
import {
  buildAgreementFormValues,
  buildAgreementSendPayload,
  downloadBlobFile,
  downloadTextFile,
  extractAgreementArticleHtml,
  fetchClientCatalog,
  fetchServiceAgreementTemplate,
  generateServiceAgreementDownloads,
  isValidClientEmail,
  recalcAmountFields,
} from "./serviceAgreement";

const FORM_FIELDS = [
  { key: "businessName", label: "Business name", required: true },
  { key: "clientLegalName", label: "Client legal / signatory name" },
  { key: "clientAddress", label: "Client address" },
  { key: "clientEmail", label: "Client email", type: "email" },
  { key: "clientPhone", label: "Client phone", type: "tel" },
  { key: "clientTin", label: "Client TIN (optional)" },
  { key: "packageName", label: "Package name" },
  { key: "quotedAmount", label: "Quoted amount (PHP)" },
  { key: "depositAmount", label: "Deposit (50%)", readOnlyDerived: true },
  { key: "balanceAmount", label: "Balance (50%)", readOnlyDerived: true },
  { key: "timeline", label: "Timeline" },
  { key: "previewUrl", label: "Preview URL" },
  { key: "industry", label: "Industry" },
  { key: "systemType", label: "System type" },
  { key: "systemLabel", label: "Admin system label" },
  { key: "systemNavPages", label: "Admin nav pages" },
  { key: "adminPath", label: "Admin path" },
  { key: "clientContactName", label: "Primary contact name" },
  { key: "clientSignatoryName", label: "Signatory printed name" },
  { key: "clientSignatoryTitle", label: "Signatory title" },
  { key: "agreementDate", label: "Agreement date (display)" },
  { key: "providerAddress", label: "Provider address" },
  { key: "bankName", label: "Bank name" },
  { key: "accountName", label: "Account name" },
  { key: "accountNumber", label: "Account number" },
  { key: "ewalletDetails", label: "GCash / e-wallet" },
];

const FORMAT_LABELS = {
  md: "Markdown (.md)",
  html: "HTML (.html)",
  docx: "Word (.docx)",
  all: "Markdown + HTML + Word",
};

function formatAgreementTimestamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ServiceAgreementModal({ client, onClose }) {
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [agreement, setAgreement] = useState(null);
  const [copyNotice, setCopyNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const catalog = await fetchClientCatalog();
        if (cancelled) return;
        const catalogEntry = catalog[client.id] || null;
        setValues(
          buildAgreementFormValues({
            site: client,
            outreach: client.outreach,
            catalogEntry,
          })
        );
      } catch (err) {
        if (!cancelled) {
          setValues(
            buildAgreementFormValues({
              site: client,
              outreach: client.outreach,
            })
          );
          setError(err.message || "Could not load client catalog; using outreach defaults.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [client]);

  useEffect(() => {
    let cancelled = false;

    async function loadOpenAgreement() {
      try {
        const payload = await fetchAdminAgreements({
          slug: client.id,
          perPage: 10,
        });
        if (cancelled) return;
        setAgreement(pickOpenAgreement(payload));
      } catch {
        // Non-blocking — modal still works for download / first send.
      }
    }

    loadOpenAgreement();
    return () => {
      cancelled = true;
    };
  }, [client.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const slugLabel = useMemo(() => client.id, [client.id]);
  const busy = generating || sending || resending || revoking;
  const canResendOrRevoke = agreement && isOpenAgreementStatus(agreement.status);

  const handleChange = useCallback((key, nextValue) => {
    setValues((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: nextValue };
      if (key === "quotedAmount") {
        return recalcAmountFields(next, nextValue);
      }
      return next;
    });
    setNotice("");
    setCopyNotice("");
  }, []);

  const handleGenerate = async (format) => {
    if (!values || busy) return;
    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const template = await fetchServiceAgreementTemplate();
      const {
        markdown,
        html,
        docxBlob,
        mdFilename,
        htmlFilename,
        docxFilename,
      } = await generateServiceAgreementDownloads(values, template);

      const wantMd = format === "md" || format === "all";
      const wantHtml = format === "html" || format === "all";
      const wantDocx = format === "docx" || format === "all";

      if (wantMd) {
        downloadTextFile(mdFilename, markdown, "text/markdown;charset=utf-8");
      }
      if (wantHtml) {
        downloadTextFile(htmlFilename, html, "text/html;charset=utf-8");
      }
      if (wantDocx) {
        downloadBlobFile(docxFilename, docxBlob);
      }

      const names = [
        wantMd ? mdFilename : null,
        wantHtml ? htmlFilename : null,
        wantDocx ? docxFilename : null,
      ].filter(Boolean);

      setNotice(`Downloaded ${FORMAT_LABELS[format] || format}: ${names.join(", ")}`);
    } catch (err) {
      setError(err.message || "Could not generate agreement.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSendForSignature = async () => {
    if (!values || busy) return;

    if (!String(values.businessName || "").trim()) {
      setError("Business name is required before sending.");
      return;
    }
    if (!isValidClientEmail(values.clientEmail)) {
      setError("Enter a valid client email before sending for signature.");
      return;
    }

    setSending(true);
    setError("");
    setNotice("");
    setCopyNotice("");
    try {
      const template = await fetchServiceAgreementTemplate();
      const { html } = await generateServiceAgreementDownloads(values, template);
      const filledHtml = extractAgreementArticleHtml(html);
      const payload = buildAgreementSendPayload(values, filledHtml);
      const result = await createAdminAgreement(payload);
      setAgreement(result);
      setNotice(
        `Agreement sent to ${result.clientEmail || payload.clientEmail} (${result.status || "sent"}).`
      );
    } catch (err) {
      setError(err.message || "Could not send agreement for signature.");
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (!agreement?.id || busy) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      const result = await resendAdminAgreement(agreement.id);
      setAgreement(result);
      setNotice(`Agreement resent to ${result.clientEmail || agreement.clientEmail}.`);
    } catch (err) {
      setError(err.message || "Could not resend agreement.");
    } finally {
      setResending(false);
    }
  };

  const handleRevoke = async () => {
    if (!agreement?.id || busy) return;
    const confirmed = window.confirm(
      "Revoke this signature link? The client will no longer be able to sign."
    );
    if (!confirmed) return;

    setRevoking(true);
    setError("");
    setNotice("");
    try {
      const result = await revokeAdminAgreement(agreement.id);
      setAgreement(result);
      setNotice("Signature link revoked.");
    } catch (err) {
      setError(err.message || "Could not revoke agreement.");
    } finally {
      setRevoking(false);
    }
  };

  const handleCopySignUrl = async () => {
    if (!agreement?.signUrl) return;
    try {
      await navigator.clipboard.writeText(agreement.signUrl);
      setCopyNotice("Copied");
    } catch {
      setCopyNotice("Select and copy manually");
    }
  };

  return (
    <div className="v3-admin-modal" role="presentation" onClick={onClose}>
      <div
        className="v3-admin-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="v3-admin-modal__head">
          <div>
            <p className="v3-admin-modal__eyebrow">Service agreement</p>
            <h2 id="agreement-modal-title" className="v3-admin-modal__title">
              {client.label}
            </h2>
            <p className="v3-admin-modal__meta">
              Slug <code className="v3-admin-code">{slugLabel}</code> · Prefilled from catalog + outreach
            </p>
          </div>
          <button
            type="button"
            className="v3-admin-btn v3-admin-btn--ghost v3-admin-btn--sm"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </header>

        {error && (
          <p className="v3-admin-alert" role="alert">
            {error}
          </p>
        )}
        {notice && <p className="v3-admin-notice">{notice}</p>}

        {loading && <p className="v3-admin-loading">Loading agreement fields…</p>}

        {!loading && values && (
          <>
            <form
              className="v3-admin-agreement-form"
              onSubmit={(event) => {
                event.preventDefault();
                handleGenerate("docx");
              }}
            >
              <div className="v3-admin-agreement-form__grid">
                {FORM_FIELDS.map((field) => (
                  <label key={field.key} className="v3-admin-field">
                    <span className="v3-admin-field__label">{field.label}</span>
                    <input
                      className="v3-admin-field__input"
                      type={field.type || "text"}
                      value={values[field.key] ?? ""}
                      readOnly={Boolean(field.readOnlyDerived)}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      required={Boolean(field.required)}
                    />
                  </label>
                ))}
              </div>

              <div className="v3-admin-modal__actions v3-admin-modal__actions--wrap">
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--ghost"
                  disabled={busy}
                  onClick={() => handleGenerate("md")}
                >
                  Download .md
                </button>
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--ghost"
                  disabled={busy}
                  onClick={() => handleGenerate("html")}
                >
                  Download .html
                </button>
                <button type="submit" className="v3-admin-btn" disabled={busy}>
                  {generating ? "Generating…" : "Download .docx"}
                </button>
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--ghost"
                  disabled={busy}
                  onClick={() => handleGenerate("all")}
                >
                  Download all
                </button>
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--primary"
                  disabled={busy}
                  onClick={handleSendForSignature}
                >
                  {sending ? "Sending…" : "Send for signature"}
                </button>
              </div>
            </form>

            {agreement && (
              <section className="v3-admin-agreement-status" aria-live="polite">
                <div className="v3-admin-agreement-status__row">
                  <span className="v3-admin-agreement-status__label">Status</span>
                  <span className="v3-admin-agreement-status__value">
                    <code className="v3-admin-code">{agreement.status || "—"}</code>
                  </span>
                </div>
                {agreement.signUrl && (
                  <div className="v3-admin-agreement-status__row v3-admin-agreement-status__row--url">
                    <span className="v3-admin-agreement-status__label">Sign URL</span>
                    <div className="v3-admin-agreement-status__url">
                      <input
                        className="v3-admin-field__input"
                        type="text"
                        readOnly
                        value={agreement.signUrl}
                        aria-label="Signature link"
                        onFocus={(event) => event.target.select()}
                      />
                      <button
                        type="button"
                        className="v3-admin-btn v3-admin-btn--ghost v3-admin-btn--sm"
                        onClick={handleCopySignUrl}
                      >
                        {copyNotice || "Copy"}
                      </button>
                    </div>
                  </div>
                )}
                <div className="v3-admin-agreement-status__meta">
                  <span>Sent {formatAgreementTimestamp(agreement.sentAt)}</span>
                  <span>Expires {formatAgreementTimestamp(agreement.expiresAt)}</span>
                </div>
                {canResendOrRevoke && (
                  <div className="v3-admin-modal__actions v3-admin-modal__actions--wrap">
                    <button
                      type="button"
                      className="v3-admin-btn v3-admin-btn--ghost"
                      disabled={busy}
                      onClick={handleResend}
                    >
                      {resending ? "Resending…" : "Resend"}
                    </button>
                    <button
                      type="button"
                      className="v3-admin-btn v3-admin-btn--ghost v3-admin-btn--danger"
                      disabled={busy}
                      onClick={handleRevoke}
                    >
                      {revoking ? "Revoking…" : "Revoke"}
                    </button>
                  </div>
                )}
              </section>
            )}

            <p className="v3-admin-modal__hint">
              Files save as{" "}
              <code className="v3-admin-code">{slugLabel}-service-agreement-YYYY-MM-DD</code>
              {" "}(.md / .html / .docx). Word opens <strong>.docx</strong> directly; HTML can print to PDF.
              {" "}Send for signature emails the client a <code className="v3-admin-code">?sign=</code> link
              (valid client email required).
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceAgreementModal;
