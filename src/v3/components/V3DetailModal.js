import { Modal } from "react-bootstrap";
import useModalBodyLock from "../hooks/useModalBodyLock";

function V3DetailModal({
  show,
  onHide,
  onExited,
  title,
  size = "xl",
  footer,
  children,
}) {
  useModalBodyLock(show);

  return (
    <Modal
      show={show}
      onHide={onHide}
      onExited={onExited}
      centered
      size={size}
      fullscreen="md-down"
      className="v3-modal-layer"
      backdropClassName="v3-modal-backdrop"
      dialogClassName="v3-project-modal"
      contentClassName="v3-project-modal__content"
    >
      <Modal.Header className="v3-project-modal__header">
        <Modal.Title>{title}</Modal.Title>
        <button
          type="button"
          className="btn-close v3-modal-dismiss"
          aria-label="Close"
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body className="v3-project-modal__body">{children}</Modal.Body>
      <Modal.Footer className="v3-project-modal__footer">
        {footer}
        <button
          type="button"
          className="v3-btn v3-btn--ghost v3-project-modal__close"
          onClick={onHide}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default V3DetailModal;
