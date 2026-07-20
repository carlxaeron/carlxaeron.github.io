import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { hasSubmittedFeedback, submitPreviewFeedback } from "../utils/previewFeedback";
import { isAnalyticsExcluded } from "../utils/visitTracker";

export default function PreviewFeedback({ previewSlug, previewLabel }) {
  const [submitted, setSubmitted] = useState(() => hasSubmittedFeedback(previewSlug));
  const [showDislikeModal, setShowDislikeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmSource, setConfirmSource] = useState(null);
  const [comment, setComment] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!previewSlug || isAnalyticsExcluded() || submitted) {
    return submitted ? (
      <div className="v3-preview-feedback v3-preview-feedback--done" data-testid="preview-feedback-thanks">
        <p>Thanks for your feedback on this sample site.</p>
        {sentiment && (
          <span className="visually-hidden" data-testid="preview-feedback-sentiment">{sentiment}</span>
        )}
      </div>
    ) : null;
  }

  const openConfirm = (source) => {
    setError("");
    setConfirmSource(source);
    setShowConfirmModal(true);
  };

  const closeConfirm = () => {
    if (loading) return;
    setShowConfirmModal(false);
    setConfirmSource(null);
  };

  const submitSentiment = async (nextSentiment, nextComment = "") => {
    setError("");
    setLoading(true);
    try {
      await submitPreviewFeedback({
        previewSlug,
        previewLabel,
        sentiment: nextSentiment,
        comment: nextComment,
      });
      setSentiment(nextSentiment);
      setSubmitted(true);
      setShowConfirmModal(false);
      setShowDislikeModal(false);
      setConfirmSource(null);
    } catch (err) {
      setError(err.message || "Could not submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmYes = async () => {
    await submitSentiment("agree", "");
  };

  const handleConfirmNotYet = async () => {
    if (confirmSource === "like") {
      await submitSentiment("like", "");
      return;
    }
    closeConfirm();
  };

  const handleDislikeSubmit = async (event) => {
    event.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) {
      setError("Please add a comment explaining what you dislike before submitting.");
      return;
    }
    await submitSentiment("dislike", trimmed);
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
              onClick={() => openConfirm("like")}
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
            <button
              type="button"
              className="v3-preview-feedback__btn v3-preview-feedback__btn--ready"
              onClick={() => openConfirm("agree")}
              disabled={loading}
            >
              Ready to proceed
            </button>
          </div>
          {error && !showDislikeModal && !showConfirmModal && (
            <p className="v3-preview-feedback__error" role="alert">{error}</p>
          )}
        </div>
      </section>

      <Modal
        show={showConfirmModal}
        onHide={closeConfirm}
        centered
        className="v3-preview-feedback-modal"
      >
        <Modal.Header closeButton={!loading}>
          <Modal.Title>Ready to move forward?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="v3-preview-feedback__modal-copy">
            Are you ready to move forward with this project? This sample covers the website only —
            hosting and extras are separate if you need them later.
          </p>
          {error && <p className="v3-preview-feedback__error" role="alert">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmNotYet} disabled={loading}>
            Not yet
          </Button>
          <Button variant="success" onClick={handleConfirmYes} disabled={loading}>
            Yes, I&apos;m interested
          </Button>
        </Modal.Footer>
      </Modal>

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
    </>
  );
}
