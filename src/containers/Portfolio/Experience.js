import { useSpring, animated } from "@react-spring/web";
import Img from "../../components/Img";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./theme-provider";
import { EXPERIENCES } from "../../config";
import { Overlay, Tooltip } from "react-bootstrap";

function PortfolioExperience(props) {
  const [show, setShow] = useState(true); // Force show to true
  const [visibleExperiences, setVisibleExperiences] = useState(new Set());
  const { value } = useStore();
  
  // Use direct import if config import is not working
  const experiencesData = EXPERIENCES;
  
  const springs = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: show ? 1 : 0, y: show ? 0 : 50 },
    delay: 100,
    config: { tension: 200, friction: 30 }
  })

  // Optimize experience animations with intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const expId = entry.target.getAttribute('data-exp-id');
            if (expId) {
              setVisibleExperiences(prev => new Set([...prev, expId]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const expElements = document.querySelectorAll('[data-exp-id]');
    expElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const ExperiencesLi = ({ v, k }) => {
    const [show, setShow] = useState(true); // Force show to true
    const [hideExtra, setHideExtra2] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const expId = `exp-${k}`;
    const isVisible = true; // Force visible
    
    const setHideExtra = (v, conf = {}) => {
      if (!value.isMobile || conf.force) {
        setHideExtra2(v);
      }
    }
    const [h, setH] = useState('0px');
    
    const springs = useSpring({
      from: { opacity: 0, transform: 'scale(0.8) translateY(30px)' },
      to: { 
        opacity: show && isVisible ? 1 : 0, 
        transform: show && isVisible ? 'scale(1) translateY(0px)' : 'scale(0.8) translateY(30px)' 
      },
      delay: k * 150, // Staggered animation
      config: { tension: 300, friction: 25 }
    })
    
    const hideSprings = useSpring({
      from: { maxHeight: '87px' },
      to: { maxHeight: hideExtra ? '87px' : h },
      config: { tension: 200, friction: 30 }
    });

    const hoverSprings = useSpring({
      from: { scale: 1, y: 0 },
      to: { 
        scale: isHovered ? 1.02 : 1, 
        y: isHovered ? -5 : 0
      },
      config: { tension: 300, friction: 20 }
    });

    const logoSprings = useSpring({
      from: { opacity: 0, transform: 'scale(0.5) rotate(-10deg)' },
      to: { 
        opacity: show && isVisible ? 1 : 0, 
        transform: show && isVisible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-10deg)' 
      },
      delay: k * 150 + 200, // Logo animates after main content
      config: { tension: 250, friction: 20 }
    });

    const expRef = useRef(null);
    const expRefBtn = useRef(null);

    useEffect(() => {
      if (expRef.current) {
        if (expRef.current.clientHeight > 90) {
          setHideExtra(true, { force: true });
          const newH = `${expRef.current.clientHeight}px`;
          setH(newH);
          expRef.current.className = `${expRef.current.className} overflow-hidden`;
        }
      }
    }, [])

    return (
      <animated.li 
        id={`experiences-${props.id}-${k}`} 
        style={{...springs, ...hoverSprings}}  
        className="row experience-item"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-exp-id={expId}
      >
        <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
          <animated.div 
            className={`clm-com-logo-cont ${!v.companyLogo && 'bg-black'} experience-logo`} 
            style={logoSprings}
          >
            <Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src={v.companyLogo} />
          </animated.div>
        </div>
        <div className="col-sm-9 col-md-10">
          <div className="clm-com-title">
            <h4 className="experience-company-name">{v.companyName}</h4>
            <span>
              <h5 className="experience-date">{v.dateRange}</h5>
            </span>
          </div>
          <div className="clm-com-job-title">
            <h4 className="experience-job-title">{v.jobTitle} {v.skills && (
              <div className="text-sm text-red-500 font-sans experience-skills">
                <b>SKILLS: </b> 
                { v.skills.map((v2, k2) => (
                  <span key={k2} className="skill-tag">{v2} {(k2 + 1 !== v.skills.length ) && ', '}</span>
                )) }
              </div>
            )}</h4>
          </div>
          <animated.div 
            style={hideExtra === null ? {} : {...hideSprings}}
            ref={expRef} 
            className='clm-com-detail experience-description'
          >
            <div dangerouslySetInnerHTML={{ __html: v.jobDescription }}></div>
          </animated.div>
          { props.id === 'top' && (
            <Overlay target={expRefBtn.current} show={showTooltip} placement="bottom" rootClose={true} rootCloseEvent='click'>
              {(props) => (
                <Tooltip className="z-[999999]" onClick={() => setShowTooltip(false)} id="overlay-example" {...props}>
                  <span dangerouslySetInnerHTML={{ __html: v.jobDescription }}></span>
                </Tooltip>
              )}
            </Overlay>
          ) }
          { hideExtra && (
            <animated.button 
              ref={expRefBtn} 
              className="btn btn-primary text-white experience-btn mt-2" 
              onClick={() => {
                setHideExtra(false);
                if (value.isMobile) {
                  setShowTooltip(true);
                }
              }}
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              View More
            </animated.button> 
          ) }
        </div>
      </animated.li>
    )
  }

  return (
    <animated.div style={{...springs}} className="clm-exps clm-fixed-hc bg-white" id={`experiences-${props.id}`}>
      <div className="clm-inner-container clm-container">
        <div className="clm-title">
          <h4 className="experience-section-title">EXPERIENCES</h4>
        </div>
        <ul className="clm-company">
          { 
            experiencesData && experiencesData.length > 0 ? (
              experiencesData.map((v, k) => (
                <ExperiencesLi v={v} k={k} key={k} />
              ))
            ) : (
              <li className="row">
                <div className="col-12 text-center">
                  <p>No experiences found. Please check the data configuration.</p>
                </div>
              </li>
            )
          }
        </ul>
      </div>
    </animated.div>
  )
}

export default PortfolioExperience;