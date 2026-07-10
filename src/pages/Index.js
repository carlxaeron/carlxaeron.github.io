import { useMemo } from "react";
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

  if (previewRaw && !previewResolved) {
    return (
      <div className="App">
        <PreviewShowcaseError host={previewRaw} />
      </div>
    );
  }

  if (previewResolved) {
    return (
      <div className="App">
        <PreviewShowcase
          previewUrl={previewResolved.url}
          host={previewResolved.host}
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
