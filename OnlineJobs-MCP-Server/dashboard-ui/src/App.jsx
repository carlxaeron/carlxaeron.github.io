import { useEffect, useState } from "react";
import ApplicationsTab from "./components/ApplicationsTab";
import DetailDrawer from "./components/DetailDrawer";
import SearchTab from "./components/SearchTab";
import { api } from "./api";

const TABS = [
  { id: "applications", label: "Applications" },
  { id: "search", label: "Search & Apply" },
];

const DEFAULT_STATUSES = [
  "draft",
  "submitted",
  "interviewing",
  "rejected",
  "offer",
  "withdrawn",
];

export default function App() {
  const [tab, setTab] = useState("applications");
  const [selectedId, setSelectedId] = useState(null);
  const [statuses, setStatuses] = useState(DEFAULT_STATUSES);
  const [dateFilters, setDateFilters] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    api.meta().then((data) => {
      if (data.statuses?.length) setStatuses(data.statuses);
      if (data.date_filters?.length) setDateFilters(data.date_filters);
    }).catch(() => {});
  }, []);

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">Job Applications</h1>
          <p className="app-subtitle">Local tracker for OnlineJobs.ph applications</p>
        </div>
        <nav className="tabs">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab-btn ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === "applications" && (
        <ApplicationsTab
          key={refreshKey}
          statuses={statuses}
          onSelect={setSelectedId}
        />
      )}

      {tab === "search" && (
        <SearchTab dateFilters={dateFilters} onCreated={bumpRefresh} />
      )}

      <DetailDrawer
        applicationId={selectedId}
        statuses={statuses}
        onClose={() => setSelectedId(null)}
        onSaved={bumpRefresh}
      />
    </div>
  );
}
