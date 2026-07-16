import { useEffect, useMemo } from "react";
import Portfolio from "../v3/containers/Portfolio/Portfolio";
import PreviewShowcase, { PreviewShowcaseError } from "../v3/containers/PreviewShowcase/PreviewShowcase";
import { getPreviewQueryFromSearch, resolvePreviewUrl } from "../v3/config/previewWhitelist";
import VisitTracker from "../components/VisitTracker";
import { applyOwnerExcludeFromUrl } from "../utils/visitTracker";
import AdminLogin from "../v3/admin/AdminLogin";
import AdminDashboard from "../v3/admin/AdminDashboard";
import { getAdminToken } from "../v3/admin/adminAuth";
import { useAppMode } from "../v3/admin/useAppMode";
import "./../styles/App.css";

function Index() {
  const appMode = useAppMode();

  useEffect(() => {
    applyOwnerExcludeFromUrl();
  }, []);

  useEffect(() => {
    if (appMode === "admin" && !getAdminToken()) {
      window.location.hash = "login";
    }
  }, [appMode]);

  useEffect(() => {
    if (appMode !== "login" && appMode !== "admin") {
      return undefined;
    }
    document.documentElement.classList.add("v3-admin-active");
    document.body.classList.add("v3-admin-active");
    return () => {
      document.documentElement.classList.remove("v3-admin-active");
      document.body.classList.remove("v3-admin-active");
    };
  }, [appMode]);

  const previewQuery = useMemo(
    () => getPreviewQueryFromSearch(typeof window !== "undefined" ? window.location.search : ""),
    []
  );

  const previewRaw = previewQuery?.trim() || null;
  const previewResolved = previewRaw ? resolvePreviewUrl(previewRaw) : null;

  useEffect(() => {
    if (!previewResolved?.slug || previewRaw === previewResolved.slug) return undefined;
    const next = new URL(window.location.href);
    next.searchParams.set("preview", previewResolved.slug);
    window.history.replaceState(null, "", next.pathname + next.search + next.hash);
    return undefined;
  }, [previewRaw, previewResolved]);

  if (appMode === "login") {
    return (
      <div className="App">
        <AdminLogin />
      </div>
    );
  }

  if (appMode === "admin" && getAdminToken()) {
    return (
      <div className="App">
        <AdminDashboard />
      </div>
    );
  }

  if (previewRaw && !previewResolved) {
    return (
      <div className="App">
        <PreviewShowcaseError previewKey={previewRaw} />
      </div>
    );
  }

  if (previewResolved) {
    return (
      <div className="App">
        <VisitTracker eventType="preview_view" previewSlug={previewResolved.slug} />
        <PreviewShowcase
          previewUrl={previewResolved.url}
          label={previewResolved.site?.label}
          previewSlug={previewResolved.slug}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <Portfolio />
    </div>
  );
}

export default Index;
