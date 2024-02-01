import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import { useSpring, animated } from "@react-spring/web";

function PortfolioHome() {
    const springs = useSpring({
        from: { y: -200, opacity: 0, },
        to: { y: 0, opacity: 1, },
    })

    const themeContext = useContext(ThemeContext);

    return (
        <div className={`clm-cover clm-fixed-hc${themeContext.value.env === 'dev' ? ' no-bg' : ''}`} id="home">
            <div className="clm-c-content">
                { themeContext.value.env === 'dev' && (
                <>
                    <animated.h2 style={{...springs}}>What is Lorem Ipsum? <span>Ipsum</span></animated.h2>
                    <animated.h3 style={{...springs}}>Lorem ipsum</animated.h3><a className="btn btn-primary" href="#projects">sit amet</a>
                </>) }
                { themeContext.value.env === 'prod' && (
                <>
                    <animated.h2 style={{...springs}}>Hello, I'm a <span>Fullstack PHP Developer</span></animated.h2>
                    <animated.h3 style={{...springs}}>I am a Web Developer who seeks challenging web development job.</animated.h3><a className="btn btn-primary" href="#projects">View my works</a>
                </>
                )}
            </div>
        </div>
    )
}

export default PortfolioHome;