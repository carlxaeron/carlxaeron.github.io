import { useCallback, useEffect, useState } from "react";
import { fetchAdminContacts, fetchAdminQuotations, parsePaginatedList } from "../adminApi";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function DataTable({ columns, rows, emptyLabel }) {
  if (!rows?.length) {
    return <p className="v3-admin-empty">{emptyLabel}</p>;
  }

  return (
    <div className="v3-admin-table-wrap">
      <table className="v3-admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? `${idx}-${row.email ?? row.name}`}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key] ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InboxTab() {
  const [section, setSection] = useState("contacts");
  const [contacts, setContacts] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [contactsPage, setContactsPage] = useState(1);
  const [quotationsPage, setQuotationsPage] = useState(1);
  const [contactsMeta, setContactsMeta] = useState(null);
  const [quotationsMeta, setQuotationsMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = useCallback(async (page) => {
    const payload = await fetchAdminContacts(page);
    const { rows, meta } = parsePaginatedList(payload);
    setContacts(rows);
    setContactsMeta(meta);
  }, []);

  const loadQuotations = useCallback(async (page) => {
    const payload = await fetchAdminQuotations(page);
    const { rows, meta } = parsePaginatedList(payload);
    setQuotations(rows);
    setQuotationsMeta(meta);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadContacts(contactsPage), loadQuotations(quotationsPage)]);
    } catch (err) {
      setError(err.message || "Could not load inbox.");
    } finally {
      setLoading(false);
    }
  }, [contactsPage, quotationsPage, loadContacts, loadQuotations]);

  useEffect(() => {
    load();
  }, [load]);

  const contactColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "message",
      label: "Message",
      render: (row) => (
        <span className="v3-admin-cell-clamp" title={row.message}>
          {row.message}
        </span>
      ),
    },
    { key: "created_at", label: "Received", render: (row) => formatDate(row.created_at) },
  ];

  const quotationColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "project_type", label: "Project" },
    {
      key: "budget",
      label: "Budget",
      render: (row) => row.budget || row.budget_range || "—",
    },
    { key: "created_at", label: "Received", render: (row) => formatDate(row.created_at) },
  ];

  return (
    <div className="v3-admin-panel">
      <div className="v3-admin-panel__head">
        <h2 className="v3-admin-panel__title">Inbox</h2>
        <div className="v3-admin-segmented" role="tablist" aria-label="Inbox sections">
          <button
            type="button"
            role="tab"
            aria-selected={section === "contacts"}
            className={`v3-admin-segmented__btn${section === "contacts" ? " is-active" : ""}`}
            onClick={() => setSection("contacts")}
          >
            Contact ({contactsMeta?.total ?? contacts.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={section === "quotations"}
            className={`v3-admin-segmented__btn${section === "quotations" ? " is-active" : ""}`}
            onClick={() => setSection("quotations")}
          >
            Quotations ({quotationsMeta?.total ?? quotations.length})
          </button>
        </div>
      </div>

      {error && <p className="v3-admin-alert" role="alert">{error}</p>}
      {loading && <p className="v3-admin-loading">Loading inbox…</p>}

      {!loading && section === "contacts" && (
        <>
          <DataTable columns={contactColumns} rows={contacts} emptyLabel="No contact messages yet." />
          {contactsMeta && contactsMeta.lastPage > 1 && (
            <div className="v3-admin-pagination">
              <button
                type="button"
                className="v3-admin-btn v3-admin-btn--ghost"
                disabled={contactsPage <= 1}
                onClick={() => setContactsPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {contactsPage} of {contactsMeta.lastPage}
              </span>
              <button
                type="button"
                className="v3-admin-btn v3-admin-btn--ghost"
                disabled={contactsPage >= contactsMeta.lastPage}
                onClick={() => setContactsPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!loading && section === "quotations" && (
        <>
          <DataTable
            columns={quotationColumns}
            rows={quotations}
            emptyLabel="No quotation requests yet."
          />
          {quotationsMeta && quotationsMeta.lastPage > 1 && (
            <div className="v3-admin-pagination">
              <button
                type="button"
                className="v3-admin-btn v3-admin-btn--ghost"
                disabled={quotationsPage <= 1}
                onClick={() => setQuotationsPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {quotationsPage} of {quotationsMeta.lastPage}
              </span>
              <button
                type="button"
                className="v3-admin-btn v3-admin-btn--ghost"
                disabled={quotationsPage >= quotationsMeta.lastPage}
                onClick={() => setQuotationsPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InboxTab;
