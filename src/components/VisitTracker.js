import { useEffect } from "react";
import { trackVisit } from "../utils/visitTracker";

/**
 * Fires anonymous visit events on client preview pages only (via trackVisit Cloud Function).
 */
export default function VisitTracker({ eventType = "pageview", section = null, previewSlug = null }) {
  useEffect(() => {
    trackVisit({ eventType, section, previewSlug });
  }, [eventType, section, previewSlug]);

  return null;
}
