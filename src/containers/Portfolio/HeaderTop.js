import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "./theme-context";
import sessionstorage from "sessionstorage";
import { AnimationFade } from "../../components/Animations";

function PortfolioHeaderTop({ onToggleSlider, useSlider }) {
  const themeContext = useContext(ThemeContext);

  // fix double call for useEffect because of strictmode is on
  const init = useRef(false);
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    headerRef.current.style.height = `${navRef.current.clientHeight}px`;

    // fix double call for useEffect because of strictmode is on
    if (!init.current) {
      init.current = true;


      if (sessionstorage.getItem('env')) {
        themeContext.setValue({
          env: sessionstorage.getItem('env'),
        })
      } else {
        sessionstorage.setItem('env', themeContext.value.env)
      }
    }
  }, [])

  useEffect(() => {
    sessionstorage.setItem('env', themeContext.value.env)
  }, [themeContext.value.env])

  const handleClick = (data) => {
    themeContext.setValue({
      ...themeContext.value,
      env: themeContext.value.env === 'dev' ? 'prod' : 'dev',
    });
  }

  return (
    <header className="clm-header-fixed" ref={headerRef}>
      <div className="clm-nav" style={{ zIndex: 99999 }} ref={navRef}>
        <div className="clm-container container flex justify-between items-center">
          <div className="">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <AnimationFade>
              <a className="navbar-brand" href="#"><h1 onClick={handleClick}>{themeContext.value.env === 'dev' ? 'Lorem Ipsum' : 'Carl Louis Manuel'}</h1></a>
            </AnimationFade>
          </div>
          <div className="">
            <nav className="clm-nav-menu">
              <ul className="flex items-center gap-2">
                {/* Slider Toggle Button */}
                <li>
                  <button 
                    onClick={onToggleSlider}
                    style={{
                      background: useSlider ? '#ef4444' : 'transparent',
                      color: useSlider ? 'white' : 'white',
                      border: '1px solid white',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      marginRight: '10px'
                    }}
                    title={useSlider ? 'Switch to Original Layout' : 'Switch to Slider Layout'}
                  >
                    {useSlider ? 'Original' : 'Slider'} (WIP)
                  </button>
                </li>
                <li><a href="https://github.com/carlxaeron" target="_blank">
                  <i className="fa fa-github"></i>
                </a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#experiences">Experiences</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav> */}
    </header>)
}

export default PortfolioHeaderTop;