import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildAgreementFormValues,
  downloadTextFile,
  fetchClientCatalog,
  fetchServiceAgreementTemplate,
  generateServiceAgreementDownloads,
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

function ServiceAgreementModal({ client, onClose }) {
  const [values, setValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const slugLabel = useMemo(() => client.id, [client.id]);

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
  }, []);

  const handleGenerate = async (format) => {
    if (!values || generating) return;
    setGenerating(true);
    setError("");
    setNotice("");
    try {
      const template = await fetchServiceAgreementTemplate();
      const { markdown, html, mdFilename, htmlFilename } =
        await generateServiceAgreementDownloads(values, template);

      if (format === "md" || format === "both") {
        downloadTextFile(mdFilename, markdown, "text/markdown;charset=utf-8");
      }
      if (format === "html" || format === "both") {
        downloadTextFile(htmlFilename, html, "text/html;charset=utf-8");
      }

      const formats =
        format === "both" ? "Markdown + HTML" : format === "html" ? "HTML" : "Markdown";
      setNotice(`Downloaded ${formats}: ${mdFilename}${format === "both" ? ` and ${htmlFilename}` : ""}`);
    } catch (err) {
      setError(err.message || "Could not generate agreement.");
    } finally {
      setGenerating(false);
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
                handleGenerate("both");
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

              <div className="v3-admin-modal__actions">
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--ghost"
                  disabled={generating}
                  onClick={() => handleGenerate("md")}
                >
                  {generating ? "Generating…" : "Download .md"}
                </button>
                <button
                  type="button"
                  className="v3-admin-btn v3-admin-btn--ghost"
                  disabled={generating}
                  onClick={() => handleGenerate("html")}
                >
                  Download .html
                </button>
                <button type="submit" className="v3-admin-btn" disabled={generating}>
                  Download both
                </button>
              </div>
            </form>

            <p className="v3-admin-modal__hint">
              Files save as <code className="v3-admin-code">{slugLabel}-service-agreement-YYYY-MM-DD</code>.
              Open HTML in a browser and print to PDF, or paste Markdown into Word.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceAgreementModal;
