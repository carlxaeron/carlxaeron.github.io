import { useState } from "react";
import { Modal } from "react-bootstrap";
import useModalBodyLock from "../hooks/useModalBodyLock";

function fullImagePath(project) {
  const imgType = project?.imgType || "jpg";
  return `/static/images/sites/${project.id}.${imgType}`;
}

function descriptionParagraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function ProjectDetailModal({ show, onHide, company, project, details }) {
  const [heroSrc, setHeroSrc] = useState(null);
  useModalBodyLock(show);

  const handleExited = () => {
    setHeroSrc(null);
  };

  if (!project?.id) return null;

  const defaultHero = fullImagePath(project);
  const activeHero = heroSrc || defaultHero;
  const projectTitle = project.title || String(project.id);
  const gallery = details?.gallery || [];
  const overviewParagraphs = descriptionParagraphs(details?.description);

  return (
    <Modal
      show={show}
      onHide={onHide}
      onExited={handleExited}
      centered
      size="xl"
      fullscreen="md-down"
      className="v3-modal-layer"
      backdropClassName="v3-modal-backdrop"
      dialogClassName="v3-project-modal"
      contentClassName="v3-project-modal__content"
    >
      <Modal.Header className="v3-project-modal__header">
        <Modal.Title>
          {company?.title} — {projectTitle}
        </Modal.Title>
        <button
          type="button"
          className="btn-close v3-modal-dismiss"
          aria-label="Close"
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body className="v3-project-modal__body">
        <div className="v3-project-modal__layout">
          <div className="v3-project-modal__hero">
            <a
              href={activeHero}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-project-modal__hero-link"
              aria-label={`Open full-size image for ${projectTitle}`}
            >
              <img
                src={activeHero}
                alt={projectTitle}
                className="v3-project-modal__hero-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </a>
          </div>
          <div className="v3-project-modal__details v3-project-modal__details--scroll">
            {overviewParagraphs.length > 0 && (
              <section className="v3-project-modal__section">
                <h3 className="v3-project-modal__label">Overview</h3>
                <div className="v3-project-modal__description-stack">
                  {overviewParagraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="v3-project-modal__description">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}
            {details?.impact && (
              <section className="v3-project-modal__section">
                <h3 className="v3-project-modal__label">Impact</h3>
                <p className="v3-project-modal__description v3-project-modal__description--impact">
                  {details.impact}
                </p>
              </section>
            )}
            {gallery.length > 0 && (
              <section className="v3-project-modal__section">
                <h3 className="v3-project-modal__label">Additional Screens</h3>
                <div className="v3-project-modal__gallery-row">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      type="button"
                      className={`v3-project-modal__gallery-thumb${
                        activeHero === src ? " v3-project-modal__gallery-thumb--active" : ""
                      }`}
                      onClick={() => setHeroSrc(src)}
                      aria-label="View additional screenshot"
                    >
                      <img src={src.replace("/sites/", "/sites/resized-images/")} alt="" />
                    </button>
                  ))}
                </div>
              </section>
            )}
            {details?.tags?.length > 0 && (
              <section className="v3-project-modal__section">
                <h3 className="v3-project-modal__label">Technologies</h3>
                <ul className="v3-project-modal__tags">
                  {details.tags.map((tag) => (
                    <li key={tag} className="v3-project-modal__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!overviewParagraphs.length && !details?.tags?.length && (
              <p className="v3-project-modal__description v3-project-modal__description--muted">
                Work delivered for {company?.title}. Full case study available on request.
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="v3-project-modal__footer">
        {details?.websiteUrl && (
          <a
            href={details.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="v3-btn v3-btn--primary"
          >
            View Live Site
          </a>
        )}
        <button type="button" className="v3-btn v3-btn--ghost v3-project-modal__close" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProjectDetailModal;
export { fullImagePath };
