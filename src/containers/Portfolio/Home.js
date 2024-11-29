import { useCallback, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "./theme-context";
import { AnimationDown } from "../../components/Animations";
// import Particles from "react-particles";
// import { loadFireflyPreset } from "tsparticles-preset-firefly";

function PortfolioHome() {
    const themeContext = useContext(ThemeContext);

    // const particlesRef = useRef(null)

    // const particlesInit = useCallback(async (engine) => {
    //     await loadFireflyPreset(engine);
    // }, [])

    // const particlesConfig={
    //     preset: "firefly",
    //     position: 'relative',
    // }

    return (
        <div className={`clm-cover clm-fixed-hc${themeContext.value.env === 'dev' ? ' no-bg' : ''}`} id="home">
            {/* <Particles id="particles" ref={particlesRef} options={particlesConfig} autoPlay={true} style={{
                position: 'absolute !important',
            }} init={particlesInit} /> */}
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
                        {/* <h2>Hi, I'm a <span className="mt-4 !text-[2rem] sm:!text-[3rem]">Full-Stack WEB/Software Engineer
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-code mx-auto"
                        >
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                            <text x="12" y="12" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="bold">
                                {"/"}
                            </text>
                        </svg>
                        APP Developer</span></h2> */}
                        <h2 className="!text-[1.5rem] md:!text-[2.9rem]">
                            Hi, I'm a <br />
                            Software Engr., Web/App Developer, Fullstack Developer - ReactJS | NextJS | Vue | NuxtJS | PHP | Laravel | CodeIgniter | Wordpress | Flutter | React Native | Javascript | Typescript
                        </h2>
                    </AnimationDown>
                    <AnimationDown delay={300}>
                        {/* <h3 className="!text-[1rem]">Passionate about crafting innovative, scalable, and secure web solutions. I’m always ready for new challenges that push the boundaries of web development.</h3> */}
                        <h3 className="!text-[1rem]">I’m passionate about building innovative, scalable, and secure web solutions. I love tackling new challenges that push the boundaries of what’s possible in web/app development.</h3>
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