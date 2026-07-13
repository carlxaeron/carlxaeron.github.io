import { useEffect, useMemo } from "react";
import Portfolio from "../v3/containers/Portfolio/Portfolio";
import PreviewShowcase, { PreviewShowcaseError } from "../v3/containers/PreviewShowcase/PreviewShowcase";
import { getPreviewQueryFromSearch, resolvePreviewUrl } from "../v3/config/previewWhitelist";
import "./../styles/App.css";

function Index() {
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
        <PreviewShowcase
          previewUrl={previewResolved.url}
          label={previewResolved.site?.label}
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
