import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function fullImagePath(project) {
  const imgType = project?.imgType || "jpg";
  return `/static/images/sites/${project.id}.${imgType}`;
}

function ProjectDetailModal({ show, onHide, company, project, details }) {
  const [heroSrc, setHeroSrc] = useState(null);

  if (!project?.id) return null;

  const defaultHero = fullImagePath(project);
  const activeHero = heroSrc || defaultHero;
  const projectTitle = project.title || String(project.id);
  const gallery = details?.gallery || [];

  const handleExited = () => {
    setHeroSrc(null);
  };

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
      <Modal.Header closeButton className="v3-project-modal__header">
        <Modal.Title>
          {company?.title} — {projectTitle}
        </Modal.Title>
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
          <div className="v3-project-modal__details">
            {details?.description && (
              <>
                <h3 className="v3-project-modal__label">Description</h3>
                <p className="v3-project-modal__description">{details.description}</p>
              </>
            )}
            {gallery.length > 0 && (
              <div className="v3-project-modal__gallery">
                <h3 className="v3-project-modal__label">Gallery</h3>
                <div className="v3-project-modal__gallery-row">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      type="button"
                      className={`v3-project-modal__gallery-thumb${
                        activeHero === src ? " v3-project-modal__gallery-thumb--active" : ""
                      }`}
                      onClick={() => setHeroSrc(src)}
                      aria-label="View screenshot"
                    >
                      <img src={src.replace("/sites/", "/sites/resized-images/")} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {details?.tags?.length > 0 && (
              <>
                <h3 className="v3-project-modal__label">Tags</h3>
                <ul className="v3-project-modal__tags">
                  {details.tags.map((tag) => (
                    <li key={tag} className="v3-project-modal__tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {!details?.description && !details?.tags?.length && (
              <p className="v3-project-modal__description v3-project-modal__description--muted">
                Project for {company?.title}.
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
            Visit Site ↗
          </a>
        )}
        <Button type="button" variant="secondary" className="v3-project-modal__close" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProjectDetailModal;
export { fullImagePath };
