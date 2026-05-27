import { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/sass/v3-app.scss";
import { ThemeProvider, useStore } from "./theme-provider";
import NavDots from "../../components/NavDots";
import HamburgerMenu from "../../components/HamburgerMenu";
import useSwipeHandler from "../../components/SwipeHandler";
import { Button, Modal } from "react-bootstrap";
import ChatAgent from "../../../components/ChatAgent";

import V3Home from "./Home";
import V3About from "./About";
import V3Skills from "./Skills";
import V3Experience from "./Experience";
import V3Projects from "./Projects";
import V3Contact from "./Contact";

// Module-level constant: stable identity across renders, no remount resets
const SECTIONS_CONFIG = [
  { id: "home",       component: V3Home,       title: "Home" },
  { id: "about",      component: V3About,      title: "About" },
  { id: "skills",     component: V3Skills,     title: "Skills" },
  { id: "experience", component: V3Experience, title: "Experience" },
  { id: "projects",   component: V3Projects,   title: "Projects" },
  { id: "contact",    component: V3Contact,    title: "Contact" },
];

function V3PortfolioScroll() {
  const { value, setValue } = useStore();
  const [currentSection, setCurrentSection] = useState(0);
  const isTransitioningRef = useRef(false);

  // Navigate to section by index
  const navigateToSection = useCallback((index) => {
    if (index < 0 || index >= SECTIONS_CONFIG.length) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrentSection(index);
    window.location.hash = `#${SECTIONS_CONFIG[index].id}`;
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 850);
  }, []);

  // Expose navigate function so sections can trigger navigation
  useEffect(() => {
    window.__v3Navigate = navigateToSection;
    return () => { delete window.__v3Navigate; };
  }, [navigateToSection]);

  // Mouse wheel navigation
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) navigateToSection(currentSection + 1);
      else navigateToSection(currentSection - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [currentSection, navigateToSection]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") navigateToSection(currentSection + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   navigateToSection(currentSection - 1);
      if (e.key === "Home") navigateToSection(0);
      if (e.key === "End")  navigateToSection(SECTIONS_CONFIG.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSection, navigateToSection]);

  // Hash change (browser back/forward)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const idx = SECTIONS_CONFIG.findIndex((s) => s.id === hash);
      if (idx !== -1 && idx !== currentSection) {
        isTransitioningRef.current = true;
        setCurrentSection(idx);
        setTimeout(() => { isTransitioningRef.current = false; }, 850);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [currentSection]);

  // Initial hash resolution on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const idx = SECTIONS_CONFIG.findIndex((s) => s.id === hash);
    if (idx !== -1) setCurrentSection(idx);
  }, []);

  // Touch swipe on the outer container
  const swipeRef = useSwipeHandler({
    onSwipeUp:   () => navigateToSection(currentSection + 1),
    onSwipeDown: () => navigateToSection(currentSection - 1),
  });

  const closeModal = () =>
    setValue((prev) => ({ ...prev, modal: { show: false, title: "", body: null } }));

  return (
    <>
      {/* Fixed header / brand */}
      <header className="v3-header">
        <a className="v3-brand" href="#home">
          Carl<span>.</span>Manuel
        </a>
        {/* Desktop nav links — hidden on mobile (hamburger takes over) */}
        {!value.isMobile && (
          <nav aria-label="Main navigation">
            <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", margin: 0, padding: 0 }}>
              {SECTIONS_CONFIG.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => navigateToSection(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: currentSection === i ? "#00A862" : "rgba(255,255,255,0.7)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: currentSection === i ? 600 : 400,
                      cursor: "pointer",
                      padding: "4px 0",
                      transition: "color 0.2s ease",
                      minHeight: "44px",
                    }}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Mobile hamburger menu */}
      <HamburgerMenu
        sections={SECTIONS_CONFIG}
        currentSection={currentSection}
        onNavigate={navigateToSection}
      />

      {/* Main slide deck */}
      <main
        className="v3-portfolio-root"
        ref={swipeRef}
        aria-live="polite"
      >
        {SECTIONS_CONFIG.map((section, index) => {
          const SectionComponent = section.component;
          const offset = index - currentSection;
          return (
            <div
              key={section.id}
              aria-hidden={currentSection !== index}
              id={`v3-section-${section.id}`}
              className="v3-section-slide"
              style={{
                transform: `translateY(${offset * 100}vh)`,
                pointerEvents: currentSection !== index ? "none" : undefined,
              }}
            >
              <SectionComponent
                isActive={currentSection === index}
                onNavigate={navigateToSection}
                sectionIndex={index}
                totalSections={SECTIONS_CONFIG.length}
              />
            </div>
          );
        })}
      </main>

      {/* Section navigation dots */}
      <NavDots
        sections={SECTIONS_CONFIG}
        currentSection={currentSection}
        onNavigate={navigateToSection}
      />

      {/* Arrow buttons (desktop only) */}
      <button
        type="button"
        className="v3-arrow v3-arrow--up"
        onClick={() => navigateToSection(currentSection - 1)}
        disabled={currentSection === 0}
        aria-label="Previous section"
      >
        ↑
      </button>
      <button
        type="button"
        className="v3-arrow v3-arrow--down"
        onClick={() => navigateToSection(currentSection + 1)}
        disabled={currentSection === SECTIONS_CONFIG.length - 1}
        aria-label="Next section"
      >
        ↓
      </button>

      {/* Global modal */}
      <Modal show={value.modal?.show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{value.modal?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{value.modal?.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* AI Chat assistant */}
      <ChatAgent />
    </>
  );
}

function V3Portfolio() {
  return (
    <ThemeProvider>
      <V3PortfolioScroll />
    </ThemeProvider>
  );
}

export default V3Portfolio;
