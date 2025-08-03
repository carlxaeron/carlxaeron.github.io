import { useEffect, useState, useRef } from "react";
import { useStore } from "./theme-provider";
import PortfolioHome from "./Portfolio/Home";
import PortfolioAbout from "./Portfolio/About";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioProject from "./Portfolio/Project";
import PortfolioContact from "./Portfolio/Contact";
import HeaderTop from "./Portfolio/HeaderTop";

function Portfolio() {
  const { value, setValue } = useStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionsRef = useRef(null);
  
  const sections = [
    { id: 'home', component: PortfolioHome, title: 'Home' },
    { id: 'about', component: PortfolioAbout, title: 'About' },
    { id: 'experience', component: PortfolioExperience, title: 'Experience' },
    { id: 'projects', component: PortfolioProject, title: 'Projects' },
    { id: 'contact', component: PortfolioContact, title: 'Contact' }
  ];

  // Debug: Log current section
  console.log('Current section:', currentSection, sections[currentSection]?.title);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        console.log('Arrow down pressed');
        navigateToSection(currentSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        console.log('Arrow up pressed');
        navigateToSection(currentSection - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSection(sections.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, isTransitioning]);

  // Handle wheel navigation
  useEffect(() => {
    let wheelTimeout;
    
    const handleWheel = (e) => {
      if (isTransitioning) return;
      
      e.preventDefault();
      clearTimeout(wheelTimeout);
      
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          console.log('Wheel down');
          navigateToSection(currentSection + 1);
        } else {
          console.log('Wheel up');
          navigateToSection(currentSection - 1);
        }
      }, 50);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [currentSection, isTransitioning]);

  const navigateToSection = (index) => {
    if (index < 0 || index >= sections.length || isTransitioning) {
      console.log('Navigation blocked:', { index, isTransitioning });
      return;
    }
    
    console.log('Navigating to section:', index, sections[index]?.title);
    setIsTransitioning(true);
    setCurrentSection(index);
    
    // Update URL hash
    const sectionId = sections[index].id;
    window.location.hash = `#${sectionId}`;
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  // Handle hash changes
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const sectionIndex = sections.findIndex(section => section.id === hash);
    if (sectionIndex !== -1) {
      setCurrentSection(sectionIndex);
    }
  }, []);

  const handleResize = () => {
    setValue({
      ...value,
      isMobile: window.innerWidth < 768,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="portfolio-container" style={{ 
      height: '100vh', 
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f5f5f5' // Debug background
    }}>
      {/* Navigation Dots */}
      <div className="section-navigation" style={{
        position: 'fixed',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: '10px',
        borderRadius: '20px'
      }}>
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => navigateToSection(index)}
            className={`nav-dot ${currentSection === index ? 'active' : ''}`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: currentSection === index ? '#ef4444' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: currentSection === index ? 'scale(1.2)' : 'scale(1)'
            }}
            title={section.title}
          />
        ))}
      </div>

      {/* Section Container */}
      <div 
        ref={sectionsRef}
        className="sections-container"
        style={{
          height: '100vh',
          transform: `translateY(-${currentSection * 100}vh)`,
          transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
          position: 'relative'
        }}
      >
        {sections.map((section, index) => {
          const SectionComponent = section.component;
          return (
            <div
              key={section.id}
              className={`section ${currentSection === index ? 'active' : ''}`}
              style={{
                height: '100vh',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0f0f0' // Debug alternating colors
              }}
            >
              <SectionComponent id={section.id} />
            </div>
          );
        })}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() => navigateToSection(currentSection - 1)}
        disabled={currentSection === 0 || isTransitioning}
        className="nav-arrow nav-arrow-up"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          opacity: currentSection === 0 ? 0.3 : 1,
          transition: 'all 0.3s ease',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
      >
        ↑
      </button>

      <button
        onClick={() => navigateToSection(currentSection + 1)}
        disabled={currentSection === sections.length - 1 || isTransitioning}
        className="nav-arrow nav-arrow-down"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(239, 68, 68, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          cursor: 'pointer',
          zIndex: 1000,
          opacity: currentSection === sections.length - 1 ? 0.3 : 1,
          transition: 'all 0.3s ease',
          fontSize: '20px',
          fontWeight: 'bold'
        }}
      >
        ↓
      </button>

      {/* Debug Info */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 2000
      }}>
        Section: {currentSection + 1}/{sections.length} - {sections[currentSection]?.title}
        <br />
        Transitioning: {isTransitioning ? 'Yes' : 'No'}
      </div>
    </div>
  );
}

export default Portfolio; 