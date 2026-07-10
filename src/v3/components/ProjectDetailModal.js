import { useState } from "react";
import V3DetailModal from "./V3DetailModal";

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

  const handleExited = () => {
    setHeroSrc(null);
  };

  if (!project?.id) return null;

  const defaultHero = fullImagePath(project);
  const activeHero = heroSrc || defaultHero;
  const projectTitle = project.title || String(project.id);
  const gallery = details?.gallery || [];
  const overviewParagraphs = descriptionParagraphs(details?.description);

  const footer = details?.websiteUrl ? (
    <a
      href={details.websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="v3-btn v3-btn--primary"
    >
      View Live Site
    </a>
  ) : null;

  return (
    <V3DetailModal
      show={show}
      onHide={onHide}
      onExited={handleExited}
      title={`${company?.title} — ${projectTitle}`}
      footer={footer}
    >
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
    </V3DetailModal>
  );
}

export default ProjectDetailModal;
export { fullImagePath };
