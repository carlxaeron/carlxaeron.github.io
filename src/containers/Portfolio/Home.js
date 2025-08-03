import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "./theme-context";
import { AnimationDown } from "../../components/Animations";
// import Particles from "react-particles";
// import { loadFireflyPreset } from "tsparticles-preset-firefly";

function PortfolioHome() {
    const themeContext = useContext(ThemeContext);
    const [typedText, setTypedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);

    // const particlesRef = useRef(null)

    // const particlesInit = useCallback(async (engine) => {
    //     await loadFireflyPreset(engine);
    // }, [])

    // const particlesConfig={
    //     preset: "firefly",
    //     position: 'relative',
    // }

    // {/* <Particles id="particles" ref={particlesRef} options={particlesConfig} autoPlay={true} style={{
    //             position: 'absolute !important',
    //         }} init={particlesInit} /> */}

    const fullText = "Hi, I'm a Software Engineer & Full-Stack Developer";
    const technologies = "ReactJS | NextJS | Vue | NuxtJS | PHP | Laravel | CodeIgniter | WordPress | Flutter | React Native | JavaScript | TypeScript";

    useEffect(() => {
        if (isTyping && currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setTypedText(fullText.slice(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, 100);
            return () => clearTimeout(timeout);
        } else if (currentIndex >= fullText.length) {
            setIsTyping(false);
        }
    }, [currentIndex, isTyping, fullText]);

    return (
        <div className={`clm-cover clm-fixed-hc${themeContext.value.env === 'dev' ? ' no-bg' : ''}`} id="home">
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
                        <h2 className="!text-[1.5rem] md:!text-[2.9rem] animate-pulse">
                            <span className="typing-text">{typedText}</span>
                            <span className="animate-pulse">|</span>
                        </h2>
                    </AnimationDown>
                    <AnimationDown delay={200}>
                        <h2 className="!text-[1.5rem] md:!text-[2.9rem] hover:scale-105 transition-all duration-300 cursor-pointer hover:text-primary">
                            <span className="hover:animate-bounce inline-block">ReactJS</span> | <span className="hover:animate-bounce inline-block">NextJS</span> | <span className="hover:animate-bounce inline-block">Vue</span> | <span className="hover:animate-bounce inline-block">NuxtJS</span> | <span className="hover:animate-bounce inline-block">PHP</span> | <span className="hover:animate-bounce inline-block">Laravel</span> | <span className="hover:animate-bounce inline-block">CodeIgniter</span> | <span className="hover:animate-bounce inline-block">WordPress</span> | <span className="hover:animate-bounce inline-block">Flutter</span> | <span className="hover:animate-bounce inline-block">React Native</span> | <span className="hover:animate-bounce inline-block">JavaScript</span> | <span className="hover:animate-bounce inline-block">TypeScript</span>
                        </h2>
                    </AnimationDown>
                    <AnimationDown delay={300}>
                        {/* <h3 className="!text-[1rem]">Passionate about crafting innovative, scalable, and secure web solutions. I'm always ready for new challenges that push the boundaries of web development.</h3> */}
                        <h3 className="!text-[1rem] hover:scale-105 transition-transform duration-300">I'm passionate about building innovative, scalable, and secure web solutions. I love tackling new challenges that push the boundaries of what's possible in web/app development.</h3>
                    </AnimationDown>
                    <AnimationDown delay={500}>
                        <a className="btn btn-primary hover:scale-110 transition-transform duration-300 hover:shadow-lg animate-pulse" href="#projects">View my works</a>
                    </AnimationDown>
                </>
                )}
            </div>
        </div>
    )
}

export default PortfolioHome;