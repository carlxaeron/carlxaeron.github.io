import { useEffect, useState, useRef } from "react";
import "./../styles/css/app.css"
import PortfolioAbout from "./Portfolio/About";
import PortfolioContact from "./Portfolio/Contact";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioHeaderTop from "./Portfolio/HeaderTop";
import PortfolioHome from "./Portfolio/Home";
import PortfolioProject from "./Portfolio/Project";
import ThemeProvider, { useStore } from "./Portfolio/theme-provider";
import { Button, Modal } from "react-bootstrap";
import ChatAgent from "../components/ChatAgent";

function Portfolio() {
    const { value, setValue } = useStore();
    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [useSlider, setUseSlider] = useState(false); // Toggle for slider/original
    const sectionsRef = useRef(null);
    
    const sections = [
        { id: 'home', component: PortfolioHome, title: 'Home' },
        { id: 'about', component: PortfolioAbout, title: 'About' },
        { id: 'experience', component: PortfolioExperience, title: 'Experience' },
        { id: 'projects', component: PortfolioProject, title: 'Projects' },
        { id: 'contact', component: PortfolioContact, title: 'Contact' }
    ];

    // Handle keyboard navigation
    useEffect(() => {
        if (!useSlider) return; // Only handle keyboard navigation for slider
        
        const handleKeyPress = (e) => {
            if (isTransitioning) return;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                navigateToSection(currentSection + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
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
    }, [currentSection, isTransitioning, useSlider]);

    // Handle wheel navigation
    useEffect(() => {
        if (!useSlider) return; // Only handle wheel navigation for slider
        
        let wheelTimeout;
        
        const handleWheel = (e) => {
            if (isTransitioning) return;
            
            e.preventDefault();
            clearTimeout(wheelTimeout);
            
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    navigateToSection(currentSection + 1);
                } else {
                    navigateToSection(currentSection - 1);
                }
            }, 50);
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            window.removeEventListener('wheel', handleWheel);
            clearTimeout(wheelTimeout);
        };
    }, [currentSection, isTransitioning, useSlider]);

    const navigateToSection = (index) => {
        if (index < 0 || index >= sections.length || isTransitioning) return;
        
        setIsTransitioning(true);
        setCurrentSection(index);
        
        // Update URL hash
        const sectionId = sections[index].id;
        window.location.hash = `#${sectionId}`;
        
        setTimeout(() => setIsTransitioning(false), 800);
    };

    // Handle hash changes
    useEffect(() => {
        if (!useSlider) return; // Only handle hash changes for slider
        
        const hash = window.location.hash.slice(1);
        const sectionIndex = sections.findIndex(section => section.id === hash);
        if (sectionIndex !== -1) {
            setCurrentSection(sectionIndex);
        }
    }, [useSlider]);

    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        setValue({ isMobile, width: window.innerWidth });
    }

    useEffect(() => {
        handleResize(); // Call the function initially

        window.addEventListener("resize", handleResize); // Add event listener for resize

        setInterval(() => {
            const currentTime = new Date().getTime();
            const doneStorage = sessionStorage.getItem('done');
            const doneTimer = doneStorage && parseInt(sessionStorage.getItem('done'));
            if (doneTimer && doneTimer < currentTime) {
                setValue({ done: false });
                sessionStorage.removeItem('done');
            }
        }, 1000); // Set interval to check for the current time

        return () => {
            window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
        };
    }, []);

    const closeModal = () => {
        setValue({ modal: { ...value.modal, show: false } });
    }

    const toggleSlider = () => {
        setUseSlider(!useSlider);
        if (!useSlider) {
            // Reset to first section when enabling slider
            setCurrentSection(0);
        }
    };

    return (
        <>
        <ThemeProvider>
            <PortfolioHeaderTop onToggleSlider={toggleSlider} useSlider={useSlider}/>
            
            {/* ORIGINAL WORKING DESIGN */}
            {!useSlider && (
                <main>
                    <PortfolioHome/>
                    <PortfolioAbout id='top'/>
                    <PortfolioProject id='top' />
                    <PortfolioExperience id='top' />
                    <PortfolioContact id='top' />
                </main>
            )}
            
            {/* SLIDER DESIGN */}
            {useSlider && (
                <main className="portfolio-container" style={{ 
                    height: '100vh', 
                    overflow: 'hidden',
                    position: 'relative'
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
                        gap: '10px'
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
                                        overflow: 'hidden'
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
                </main>
            )}
            
            <Modal backdrop='static' centered className="z-[999999]" show={value.modal.show} onHide={closeModal} 
                size={value.modal.config?.size}
                fullscreen={value.modal.config?.fullscreen}>
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
        </ThemeProvider>
        </>
    )
}

export default Portfolio;