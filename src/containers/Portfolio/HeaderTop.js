import { useEffect, useRef } from "react";
import { AnimationFade } from "../../components/Animations";

function PortfolioHeaderTop() {
  const headerRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (headerRef.current && navRef.current) {
      headerRef.current.style.height = `${navRef.current.clientHeight}px`;
    }
  }, []);

  return (
    <header className="clm-header-fixed" ref={headerRef}>
      <div className="clm-nav" style={{ zIndex: 99999 }} ref={navRef}>
        <div className="clm-container container flex justify-between items-center">
          <div className="">
            <AnimationFade>
              <a className="navbar-brand" href="#home">
                <h1>Carl Louis Manuel</h1>
              </a>
            </AnimationFade>
          </div>
          <div className="">
            <nav className="clm-nav-menu">
              <ul>
                <li><a href="https://github.com/carlxaeron" target="_blank" rel="noopener noreferrer">
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