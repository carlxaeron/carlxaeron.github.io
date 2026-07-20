import { useCallback, useEffect, useState } from "react";
import { adminLogout } from "./adminAuth";
import { navigateToLogin } from "./useAppMode";
import { ADMIN_TABS } from "./analyticsHelpers";
import OverviewTab from "./tabs/OverviewTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import InboxTab from "./tabs/InboxTab";
import OutreachTab from "./tabs/OutreachTab";
import ClientsTab from "./tabs/ClientsTab";
import CmsTab from "./tabs/CmsTab";
import SettingsTab from "./tabs/SettingsTab";
import "../styles/sass/v3-app.scss";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    await adminLogout();
    navigateToLogin();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "analytics":
        return <AnalyticsTab />;
      case "inbox":
        return <InboxTab />;
      case "outreach":
        return <OutreachTab />;
      case "clients":
        return <ClientsTab />;
      case "cms":
        return <CmsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="v3-admin-root v3-admin-dashboard">
      <aside
        className={`v3-admin-sidebar${sidebarOpen ? " is-open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="v3-admin-sidebar__head">
          <span className="v3-admin-sidebar__badge">Admin</span>
          <p className="v3-admin-sidebar__title">Ops Hub</p>
        </div>

        <nav className="v3-admin-nav">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`v3-admin-nav__item${activeTab === tab.id ? " is-active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="v3-admin-sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="v3-admin-main">
        <header className="v3-admin-topbar">
          <button
            type="button"
            className="v3-admin-topbar__menu"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <h1 className="v3-admin-topbar__title">
            {ADMIN_TABS.find((t) => t.id === activeTab)?.label || "Overview"}
          </h1>
          <button type="button" className="v3-admin-btn v3-admin-btn--ghost" onClick={handleLogout}>
            Log out
          </button>
        </header>

        <main className="v3-admin-content">{renderTab()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
