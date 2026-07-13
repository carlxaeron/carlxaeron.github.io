import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { hasSubmittedFeedback, submitPreviewFeedback } from "../utils/previewFeedback";

export default function PreviewFeedback({ previewSlug, previewLabel }) {
  const [submitted, setSubmitted] = useState(() => hasSubmittedFeedback(previewSlug));
  const [showDislikeModal, setShowDislikeModal] = useState(false);
  const [comment, setComment] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!previewSlug || submitted) {
    return submitted ? (
      <div className="v3-preview-feedback v3-preview-feedback--done" data-testid="preview-feedback-thanks">
        <p>Thanks for your feedback on this sample site.</p>
      </div>
    ) : null;
  }

  const handleLike = async () => {
    setError("");
    setLoading(true);
    try {
      await submitPreviewFeedback({
        previewSlug,
        previewLabel,
        sentiment: "like",
        comment: "",
      });
      setSentiment("like");
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Could not submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDislikeSubmit = async (event) => {
    event.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) {
      setError("Please add a comment explaining what you dislike before submitting.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await submitPreviewFeedback({
        previewSlug,
        previewLabel,
        sentiment: "dislike",
        comment: trimmed,
      });
      setSentiment("dislike");
      setSubmitted(true);
      setShowDislikeModal(false);
    } catch (err) {
      setError(err.message || "Could not submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="v3-preview-feedback" aria-label="Preview feedback" data-testid="preview-feedback">
        <div className="v3-preview-feedback__inner">
          <p className="v3-preview-feedback__prompt">What do you think of this sample site?</p>
          <div className="v3-preview-feedback__actions">
            <button
              type="button"
              className="v3-preview-feedback__btn v3-preview-feedback__btn--like"
              onClick={handleLike}
              disabled={loading}
            >
              Like
            </button>
            <button
              type="button"
              className="v3-preview-feedback__btn v3-preview-feedback__btn--dislike"
              onClick={() => {
                setError("");
                setShowDislikeModal(true);
              }}
              disabled={loading}
            >
              Dislike
            </button>
          </div>
          {error && !showDislikeModal && (
            <p className="v3-preview-feedback__error" role="alert">{error}</p>
          )}
        </div>
      </section>

      <Modal
        show={showDislikeModal}
        onHide={() => !loading && setShowDislikeModal(false)}
        centered
        className="v3-preview-feedback-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tell us what to improve</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleDislikeSubmit}>
          <Modal.Body>
            <p className="v3-preview-feedback__modal-copy">
              A comment is required before submitting a dislike — what would you change on this demo?
            </p>
            <Form.Group controlId="preview-dislike-comment">
              <Form.Label className="visually-hidden">Dislike comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Layout feels crowded on mobile, photos need updating…"
                required
              />
            </Form.Group>
            {error && <p className="v3-preview-feedback__error" role="alert">{error}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDislikeModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" disabled={loading || !comment.trim()}>
              Submit dislike
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {submitted && sentiment && (
        <span className="visually-hidden" data-testid="preview-feedback-sentiment">{sentiment}</span>
      )}
    </>
  );
}
