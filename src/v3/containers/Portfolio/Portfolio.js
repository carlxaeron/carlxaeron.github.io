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
import V3Blog from "./Blog";
import V3Insights from "./Insights";
import V3Contact from "./Contact";
import V3Quote from "./Quote";
import ProjectDetailModal from "../../components/ProjectDetailModal";
import BlogPostModal from "../../components/BlogPostModal";
import {
  PortfolioContentProvider,
  usePortfolioContent,
} from "../../config/PortfolioContentContext";

// Module-level constant: stable identity across renders, no remount resets
const SECTIONS_CONFIG = [
  { id: "home",       component: V3Home,       title: "Home" },
  { id: "about",      component: V3About,      title: "About" },
  { id: "skills",     component: V3Skills,     title: "Skills" },
  { id: "experience", component: V3Experience, title: "Experience" },
  { id: "projects",   component: V3Projects,   title: "Projects" },
  { id: "blog",       component: V3Blog,       title: "News & Blog" },
  { id: "insights",   component: V3Insights,   title: "Insights" },
  { id: "contact",    component: V3Contact,    title: "Contact" },
  { id: "quote",      component: V3Quote,      title: "Get a Quote" },
];

function V3PortfolioScroll() {
  const { getProjectDetails } = usePortfolioContent();
  const { value, setValue } = useStore();
  const [currentSection, setCurrentSection] = useState(0);
  const isTransitioningRef = useRef(false);
  const wheelThrottleRef = useRef(0);
  const WHEEL_THROTTLE_MS = 160;
  const [projectModal, setProjectModal] = useState({
    show: false,
    company: null,
    project: null,
    details: null,
  });
  const [blogModal, setBlogModal] = useState({
    show: false,
    post: null,
  });
  const isAnyModalOpen = useCallback(
    () => document.body.classList.contains("v3-modal-open"),
    []
  );

  const getActiveSlide = useCallback(() => {
    const activeSectionId = SECTIONS_CONFIG[currentSection]?.id;
    if (!activeSectionId) return null;
    return document.getElementById(`v3-section-${activeSectionId}`);
  }, [currentSection]);

  const canScrollableMove = useCallback((scrollableEl, deltaY) => {
    if (!scrollableEl) return false;
    const maxScrollTop = scrollableEl.scrollHeight - scrollableEl.clientHeight;
    if (maxScrollTop <= 0) return false;
    const currentTop = scrollableEl.scrollTop;
    if (deltaY > 0) return currentTop < maxScrollTop - 1;
    if (deltaY < 0) return currentTop > 1;
    return false;
  }, []);

  const findScrollableWithOverflow = useCallback((root) => {
    if (!root) return null;
    const scrollables = root.querySelectorAll(".v3-scrollable");
    for (const el of scrollables) {
      if (el.scrollHeight - el.clientHeight > 0) return el;
    }
    return scrollables[0] ?? null;
  }, []);

  const resolveScrollableTarget = useCallback((target, activeSlide) => {
    if (!target || !activeSlide || !(target instanceof Node)) return null;
    const elementTarget = target instanceof Element ? target : target.parentElement;
    if (!elementTarget) return null;

    const targetScrollable = elementTarget.closest(".v3-scrollable");
    if (
      targetScrollable &&
      activeSlide.contains(targetScrollable) &&
      targetScrollable.scrollHeight - targetScrollable.clientHeight > 0
    ) {
      return targetScrollable;
    }

    return findScrollableWithOverflow(activeSlide);
  }, [findScrollableWithOverflow]);

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

  const trySectionNavigate = useCallback(
    (deltaY, target, { throttleRef, throttleMs, preventDefault } = {}) => {
      if (!deltaY) return false;
      if (isTransitioningRef.current) return false;
      if (isAnyModalOpen()) return false;

      const now = Date.now();
      if (throttleRef && throttleMs && now - throttleRef.current < throttleMs) {
        return false;
      }

      const activeSlide = getActiveSlide();
      const scrollableEl = resolveScrollableTarget(target, activeSlide);
      if (canScrollableMove(scrollableEl, deltaY)) return false;

      if (preventDefault) preventDefault();
      if (throttleRef) throttleRef.current = now;

      if (deltaY > 0) navigateToSection(currentSection + 1);
      else navigateToSection(currentSection - 1);
      return true;
    },
    [
      canScrollableMove,
      currentSection,
      getActiveSlide,
      navigateToSection,
      resolveScrollableTarget,
      isAnyModalOpen,
    ]
  );

  // Expose navigate function so sections can trigger navigation
  useEffect(() => {
    window.__v3Navigate = navigateToSection;
    return () => { delete window.__v3Navigate; };
  }, [navigateToSection]);

  // Mouse wheel navigation
  useEffect(() => {
    const onWheel = (e) => {
      if (!e.deltaY) return;
      if (isAnyModalOpen()) return;
      trySectionNavigate(e.deltaY, e.target, {
        throttleRef: wheelThrottleRef,
        throttleMs: WHEEL_THROTTLE_MS,
        preventDefault: () => e.preventDefault(),
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [trySectionNavigate, isAnyModalOpen]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (isAnyModalOpen()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") navigateToSection(currentSection + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   navigateToSection(currentSection - 1);
      if (e.key === "Home") navigateToSection(0);
      if (e.key === "End")  navigateToSection(SECTIONS_CONFIG.length - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSection, navigateToSection, isAnyModalOpen]);

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

  // Keep a stable viewport unit for fixed-slide transforms.
  useEffect(() => {
    const setViewportUnit = () => {
      document.documentElement.style.setProperty("--v3-vh", `${window.innerHeight * 0.01}px`);
    };
    setViewportUnit();
    window.addEventListener("resize", setViewportUnit);
    return () => window.removeEventListener("resize", setViewportUnit);
  }, []);

  // Touch swipe on the outer container
  const swipeRef = useSwipeHandler({
    shouldAllowSwipe: ({ direction, deltaY, event }) => {
      if (isTransitioningRef.current) return false;
      if (isAnyModalOpen()) return false;
      const activeSlide = getActiveSlide();
      const scrollableEl = resolveScrollableTarget(event.target, activeSlide);
      const signedDelta = direction === "up" ? deltaY : -deltaY;
      return !canScrollableMove(scrollableEl, signedDelta);
    },
    onSwipe: ({ direction, event }) => {
      const signedDelta = direction === "up" ? 1 : -1;
      trySectionNavigate(signedDelta, event.target);
    },
  });

  const closeModal = () =>
    setValue((prev) => ({ ...prev, modal: { show: false, title: "", body: null } }));

  const openProjectModal = useCallback((company, project) => {
    setProjectModal({
      show: true,
      company,
      project,
      details: getProjectDetails(project?.id),
    });
  }, [getProjectDetails]);

  const closeProjectModal = useCallback(() => {
    setProjectModal((prev) => ({ ...prev, show: false }));
  }, []);

  const openBlogPost = useCallback((post) => {
    setBlogModal({ show: true, post });
  }, []);

  const closeBlogPost = useCallback(() => {
    setBlogModal((prev) => ({ ...prev, show: false }));
  }, []);

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
        data-testid="portfolio-root"
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
                transform: `translateY(calc(var(--v3-vh, 1vh) * ${offset * 100}))`,
                pointerEvents: currentSection !== index ? "none" : undefined,
              }}
            >
              <SectionComponent
                isActive={currentSection === index}
                onNavigate={navigateToSection}
                sectionIndex={index}
                totalSections={SECTIONS_CONFIG.length}
                onOpenProject={section.id === "projects" ? openProjectModal : undefined}
                onOpenBlogPost={section.id === "blog" ? openBlogPost : undefined}
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

      {/* Section arrow buttons */}
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

      <ProjectDetailModal
        show={projectModal.show}
        onHide={closeProjectModal}
        company={projectModal.company}
        project={projectModal.project}
        details={projectModal.details}
      />

      <BlogPostModal
        show={blogModal.show}
        onHide={closeBlogPost}
        post={blogModal.post}
      />

      {/* AI Chat assistant */}
      <ChatAgent />
    </>
  );
}

function V3Portfolio() {
  return (
    <ThemeProvider>
      <PortfolioContentProvider>
        <V3PortfolioScroll />
      </PortfolioContentProvider>
    </ThemeProvider>
  );
}

export default V3Portfolio;
