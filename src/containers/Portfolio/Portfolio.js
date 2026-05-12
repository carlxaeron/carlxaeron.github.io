import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/sass/app.scss";
import ThemeProvider, { useStore } from "./theme-provider";
import PortfolioHeaderTop from "./HeaderTop";
import PortfolioHome from "./Home";
import PortfolioAbout from "./About";
import PortfolioProject from "./Project";
import PortfolioExperience from "./Experience";
import PortfolioContact from "./Contact";
import { Button, Modal } from "react-bootstrap";
import ChatAgent from "../../components/ChatAgent";

const SECTIONS_CONFIG = [
  { id: "home", component: PortfolioHome, title: "Home" },
  { id: "about", component: PortfolioAbout, title: "About" },
  { id: "portfolio", component: PortfolioProject, title: "Projects" },
  { id: "experience", component: PortfolioExperience, title: "Experience" },
  { id: "contact", component: PortfolioContact, title: "Contact" },
];

function PortfolioScroll() {
  const { value, setValue } = useStore();
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef(null);
  const isTransitioningRef = useRef(false);

  const navigateToSection = useCallback((index) => {
    if (index < 0 || index >= SECTIONS_CONFIG.length) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentSection(index);
    window.location.hash = `#${SECTIONS_CONFIG[index].id}`;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setValue({ isMobile, width: window.innerWidth });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const doneStorage = sessionStorage.getItem("done");
      const doneTimer = doneStorage && parseInt(sessionStorage.getItem("done"), 10);
      if (doneTimer && doneTimer < currentTime) {
        setValue({ done: false });
        sessionStorage.removeItem("done");
      }
    }, 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(intervalId);
    };
  }, [setValue]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isTransitioningRef.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        navigateToSection(currentSection + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateToSection(currentSection - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        navigateToSection(0);
      } else if (e.key === "End") {
        e.preventDefault();
        navigateToSection(SECTIONS_CONFIG.length - 1);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSection, navigateToSection]);

  useEffect(() => {
    let wheelTimeout;
    const handleWheel = (e) => {
      if (isTransitioningRef.current) return;
      e.preventDefault();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) navigateToSection(currentSection + 1);
        else navigateToSection(currentSection - 1);
      }, 50);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [currentSection, navigateToSection]);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      const sectionIndex = SECTIONS_CONFIG.findIndex((s) => s.id === hash);
      if (sectionIndex !== -1) setCurrentSection(sectionIndex);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const closeModal = () => {
    setValue({ modal: { ...value.modal, show: false } });
  };

  const sections = SECTIONS_CONFIG;

  return (
    <>
      <PortfolioHeaderTop />
      <div
        className="portfolio-container"
        style={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="section-navigation"
          style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            padding: "10px",
            borderRadius: "20px",
          }}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              onClick={() => navigateToSection(index)}
              className={`nav-dot ${currentSection === index ? "active" : ""}`}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                border: "none",
                background:
                  currentSection === index ? "#1e40af" : "rgba(255, 255, 255, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                transform: currentSection === index ? "scale(1.2)" : "scale(1)",
              }}
              title={section.title}
              aria-label={`Go to ${section.title}`}
            />
          ))}
        </div>

        <div
          ref={sectionsRef}
          className="sections-container"
          style={{
            height: "100vh",
            transform: `translateY(-${currentSection * 100}vh)`,
            transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
            position: "relative",
          }}
        >
          {sections.map((section, index) => {
            const SectionComponent = section.component;
            return (
              <div
                key={section.id}
                className={`section ${currentSection === index ? "active" : ""}`}
                style={{
                  height: "100vh",
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  pointerEvents: currentSection === index ? "auto" : "none",
                }}
                aria-hidden={currentSection !== index}
              >
                <SectionComponent id="top" />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigateToSection(currentSection - 1)}
          disabled={currentSection === 0}
          className="nav-arrow nav-arrow-up"
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30, 64, 175, 0.8)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "white",
            cursor: currentSection === 0 ? "not-allowed" : "pointer",
            zIndex: 1000,
            opacity: currentSection === 0 ? 0.3 : 1,
            transition: "all 0.3s ease",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          aria-label="Previous section"
        >
          ↑
        </button>

        <button
          type="button"
          onClick={() => navigateToSection(currentSection + 1)}
          disabled={currentSection === sections.length - 1}
          className="nav-arrow nav-arrow-down"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(30, 64, 175, 0.8)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            color: "white",
            cursor: currentSection === sections.length - 1 ? "not-allowed" : "pointer",
            zIndex: 1000,
            opacity: currentSection === sections.length - 1 ? 0.3 : 1,
            transition: "all 0.3s ease",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          aria-label="Next section"
        >
          ↓
        </button>
      </div>

      <Modal
        backdrop="static"
        centered
        className="z-[999999]"
        show={value.modal.show}
        onHide={closeModal}
        size={value.modal.config?.size}
        fullscreen={value.modal.config?.fullscreen}
      >
        <Modal.Header closeButton>
          <Modal.Title>{value.modal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{value.modal.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="text-white" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ChatAgent />
    </>
  );
}

function Portfolio() {
  return (
    <ThemeProvider>
      <PortfolioScroll />
    </ThemeProvider>
  );
}

export default Portfolio;
