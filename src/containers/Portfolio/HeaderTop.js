import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "./theme-context";
import sessionstorage from "sessionstorage";
import { AnimationFade } from "../../components/Animations";

function PortfolioHeaderTop() {
    const themeContext = useContext(ThemeContext);

    // fix double call for useEffect because of strictmode is on
    const init = useRef(false);
    const headerRef = useRef(null);
    const navRef = useRef(null);

    useEffect(() => {
        headerRef.current.style.height = `${navRef.current.clientHeight}px`;

        // fix double call for useEffect because of strictmode is on
        if(!init.current) {
            init.current = true;


            if(sessionstorage.getItem('env')) {
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
                <div className="clm-nav" ref={navRef}>
                    <div className="clm-container container">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <AnimationFade>
                            <a className="navbar-brand" href="#"><h1 onClick={handleClick}>{ themeContext.value.env === 'dev' ? 'Lorem Ipsum' : 'Carl Louis Manuel' }</h1></a>
                        </AnimationFade>
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