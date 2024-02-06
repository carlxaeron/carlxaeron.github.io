import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import { AnimationDown } from "../../components/Animations";

function PortfolioHome() {
    const themeContext = useContext(ThemeContext);

    return (
        <div className={`clm-cover clm-fixed-hc${themeContext.value.env === 'dev' ? ' no-bg' : ''}`} id="home">
            <div className="clm-c-content">
                { themeContext.value.env === 'dev' && (
                <AnimationDown>
                    <h2>What is Lorem Ipsum? <span>Ipsum</span></h2>
                    <h3>Lorem ipsum</h3><a className="btn btn-primary" href="#projects">sit amet</a>
                </AnimationDown>) }
                { themeContext.value.env === 'prod' && (
                <AnimationDown>
                    <h2>Hello, I'm a <span>Fullstack Web / App Developer</span></h2>
                    <h3>I am a Web Developer who seeks challenging web development job.</h3><a className="btn btn-primary" href="#projects">View my works</a>
                </AnimationDown>
                )}
            </div>
        </div>
    )
}

export default PortfolioHome;