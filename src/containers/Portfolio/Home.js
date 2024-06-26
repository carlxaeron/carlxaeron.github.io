import { useCallback, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "./theme-context";
import { AnimationDown } from "../../components/Animations";
import Particles from "react-particles";
import { loadFireflyPreset } from "tsparticles-preset-firefly";

function PortfolioHome() {
    const themeContext = useContext(ThemeContext);

    const particlesRef = useRef(null)

    const particlesInit = useCallback(async (engine) => {
        await loadFireflyPreset(engine);
    }, [])

    const particlesConfig={
        preset: "firefly",
    }

    useEffect(() => {
        console.log(particlesRef.current.children)
    }, [])

    return (
        <div className={`clm-cover clm-fixed-hc${themeContext.value.env === 'dev' ? ' no-bg' : ''}`} id="home">
            <Particles id="particles" ref={particlesRef} options={particlesConfig} autoPlay={true} style={{
                position: 'absolute !important',
            }} init={particlesInit} />
            <div className="clm-c-content">
                { themeContext.value.env === 'dev' && (
                <>
                    <AnimationDown>
                        <h2>What is Lorem Ipsum? <span>Ipsum</span></h2>
                    </AnimationDown>
                    <AnimationDown delay={300}>
                        <h3>Lorem ipsum</h3>
                    </AnimationDown>
                    <AnimationDown delay={500}>
                        <a className="btn btn-primary" href="#projects">sit amet</a>
                    </AnimationDown>
                </>
                ) }
                { themeContext.value.env === 'prod' && (
                <>
                    <AnimationDown>
                        <h2>Hello, I'm a <span>Fullstack Web / App Developer</span></h2>
                    </AnimationDown>
                    <AnimationDown delay={300}>
                        <h3>I am a Web Developer who seeks challenging web development job.</h3>
                    </AnimationDown>
                    <AnimationDown delay={500}>
                        <a className="btn btn-primary" href="#projects">View my works</a>
                    </AnimationDown>
                </>
                )}
            </div>
        </div>
    )
}

export default PortfolioHome;