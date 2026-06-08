import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { COMPANIES } from "../../../external-config";
import { logEvent, analytics } from "../../../config";
import SectionTitle from "../../components/SectionTitle";
import ProjectDetailModal from "../../components/ProjectDetailModal";
import { getProjectDetails } from "../../data/projectDetails";

function ProjectThumb({ company, project, img, index, isActive, onOpen, animationKey }) {
  const [show, setShow] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setShow(false);
    setImageReady(false);
    setImageFailed(false);
    if (!isActive) return undefined;
    const parts = String(index).split("_").map(Number);
    const k = (parts[0] || 0) * 3 + (parts[1] || 0);
    const t = setTimeout(() => setShow(true), 60 + k * 20);
    return () => clearTimeout(t);
  }, [isActive, index, animationKey]);

  useEffect(() => {
    if (isActive && show && !imageFailed) setImageReady(true);
  }, [isActive, show, imageFailed]);

  const spring = useSpring({
    from: { opacity: 0, scale: 0.96 },
    to: { opacity: show ? 1 : 0, scale: show ? 1 : 0.96 },
    config: { tension: 260, friction: 26 },
  });

  const projectTitle = project.title || (project.id ? String(project.id) : "Project");

  return (
    <animated.div
      style={{
        ...spring,
        backgroundImage: imageReady && !imageFailed ? `url(${img})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`v3-project-thumb${imageFailed ? " v3-project-thumb--fallback" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${projectTitle}`}
      onClick={() => onOpen(company, project)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(company, project)}
    >
      {imageReady && !imageFailed && (
        <img
          src={img}
          alt={projectTitle}
          loading="eager"
          decoding="async"
          onError={() => {
            setImageFailed(true);
            setImageReady(false);
          }}
        />
      )}
      <div className="v3-project-thumb__overlay">
        <span className="v3-project-thumb__label">
          <strong>{company.title}</strong><br />
          {projectTitle}
        </span>
      </div>
    </animated.div>
  );
}

function buildProjectList(companies) {
  const list = [];
  companies.forEach((company, ci) => {
    company.projects?.forEach((project, pi) => {
      if (!project?.id) return;
      const imgType = project.imgType || "jpg";
      const img = `/static/images/sites/resized-images/${project.id}.${imgType}`;
      list.push({ company, project, img, index: `${ci}_${pi}` });
    });
  });
  return list;
}

function V3Projects({ isActive, onOpenProject }) {
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState({ show: false, company: null, project: null, details: null });

  const allProjects = buildProjectList(COMPANIES);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 },
    delay: 50,
    config: { tension: 220, friction: 28 },
  });

  const filteredProjects = filter === "all"
    ? allProjects
    : allProjects.filter((p) => p.company.title === filter);

  const handleOpen = (company, project) => {
    logEvent({ anal: analytics, event: "view_project", option: { project_id: project.id } });
    if (typeof onOpenProject === "function") {
      onOpenProject(company, project);
      return;
    }
    setModal({
      show: true,
      company,
      project,
      details: getProjectDetails(project.id),
    });
  };

  const handleClose = () => setModal((m) => ({ ...m, show: false }));

  return (
    <section
      id="projects"
      className="v3-section-body"
      style={{ background: "#00473e", height: "100vh", overflow: "hidden" }}
    >
      <div
        className="v3-inner v3-scrollable v3-section-scroll"
      >
        <animated.div style={headerSpring}>
          <SectionTitle subtitle="A selection of recent work">Projects</SectionTitle>
        </animated.div>

        <div className="v3-filter-btns">
          <button
            type="button"
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {COMPANIES.map((company) => (
            <button
              key={company.title}
              type="button"
              className={filter === company.title ? "active" : ""}
              onClick={() => setFilter(company.title)}
            >
              {company.title}
            </button>
          ))}
        </div>

        <div className="v3-projects-grid">
          {filteredProjects.length === 0 && (
            <p className="v3-projects-empty">No projects in this category yet.</p>
          )}
          {filteredProjects.map(({ company, project, img, index }) => (
            <ProjectThumb
              key={`${filter}-${company.title}-${project.id || index}`}
              company={company}
              project={project}
              img={img}
              index={index}
              isActive={isActive}
              animationKey={filter}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      {!onOpenProject && (
        <ProjectDetailModal
          show={modal.show}
          onHide={handleClose}
          company={modal.company}
          project={modal.project}
          details={modal.details}
        />
      )}
    </section>
  );
}

export default V3Projects;
