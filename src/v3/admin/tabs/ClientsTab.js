import { useCallback, useEffect, useMemo, useState } from "react";
import { PREVIEW_SITES, buildPreviewPortfolioUrl } from "../../config/previewWhitelist";
import { fetchAdminOutreach, parsePaginatedList } from "../adminApi";

function statusClass(status) {
  const s = String(status || "none").toLowerCase();
  if (s === "paused") return "v3-admin-pill v3-admin-pill--muted";
  if (s === "sent" || s === "active") return "v3-admin-pill v3-admin-pill--active";
  if (s === "completed") return "v3-admin-pill v3-admin-pill--gold";
  return "v3-admin-pill v3-admin-pill--muted";
}

function ClientsTab() {
  const [outreachRows, setOutreachRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const payload = await fetchAdminOutreach();
      const { rows } = parsePaginatedList(payload);
      setOutreachRows(rows);
    } catch (err) {
      setError(err.message || "Could not load outreach data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clients = useMemo(() => {
    const bySlug = {};
    outreachRows.forEach((row) => {
      if (row.slug) bySlug[row.slug] = row;
    });

    return PREVIEW_SITES.map((site) => ({
      ...site,
      previewUrl: buildPreviewPortfolioUrl(site.id),
      netlifyUrl: `https://${site.host}`,
      outreach: bySlug[site.id] || null,
    }));
  }, [outreachRows]);

  const withOutreach = clients.filter((c) => c.outreach).length;

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <h2 className="v3-admin-panel__title">Client catalog</h2>
        <p className="v3-admin-panel__meta">
          {PREVIEW_SITES.length} preview sites · {withOutreach} with outreach records
        </p>
      </div>

      {error && <p className="v3-admin-alert" role="alert">{error}</p>}
      {loading && <p className="v3-admin-loading">Loading clients…</p>}

      {!loading && (
        <div className="v3-admin-client-grid">
          {clients.map((client) => (
            <article key={client.id} className="v3-admin-client-card">
              <header className="v3-admin-client-card__head">
                <h3 className="v3-admin-client-card__title">{client.label}</h3>
                <span className={statusClass(client.outreach?.status || "none")}>
                  {client.outreach?.status || "no outreach"}
                </span>
              </header>

              <dl className="v3-admin-client-card__meta">
                <div>
                  <dt>Slug</dt>
                  <dd>
                    <code className="v3-admin-code">{client.id}</code>
                  </dd>
                </div>
                {client.outreach?.contact_email && (
                  <div>
                    <dt>Contact</dt>
                    <dd>{client.outreach.contact_email}</dd>
                  </div>
                )}
                {client.outreach?.quoted_amount && (
                  <div>
                    <dt>Quoted</dt>
                    <dd>{client.outreach.quoted_amount}</dd>
                  </div>
                )}
              </dl>

              <div className="v3-admin-client-card__links">
                <a
                  className="v3-admin-link"
                  href={client.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Portfolio preview
                </a>
                <a
                  className="v3-admin-link v3-admin-muted"
                  href={client.netlifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Netlify host
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientsTab;
