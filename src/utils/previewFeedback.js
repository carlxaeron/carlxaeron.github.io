import { mapping } from "../mapping";
import {
  getVisitorContext,
  hasSubmittedFeedback,
  markFeedbackSubmitted,
} from "./visitTracker";

export async function submitPreviewFeedback({ previewSlug, previewLabel, sentiment, comment }) {
  if (process.env.NODE_ENV === "development") {
    markFeedbackSubmitted(previewSlug);
    return { status: 200, message: "Feedback recorded (dev)" };
  }

  const endpoint = mapping.previewFeedback;
  if (!endpoint) {
    throw new Error("Feedback endpoint not configured");
  }

  const payload = {
    ...getVisitorContext(),
    previewSlug,
    previewLabel,
    sentiment,
    comment: comment || "",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.status !== 200) {
    throw new Error(json.message || "Failed to submit feedback");
  }

  markFeedbackSubmitted(previewSlug);
  return json;
}

export { hasSubmittedFeedback, markFeedbackSubmitted };
