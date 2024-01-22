import "./../styles/sass/app.scss"
import PortfolioAbout from "./Portfolio/About";
import PortfolioContact from "./Portfolio/Contact";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioHome from "./Portfolio/Home";
import PortfolioProject from "./Portfolio/Project";

function Portfolio() {
    return (
        <div>
            <PortfolioHome/>
            <nav className="clm-m-nav">
                <div className="clm-container">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#projects">Projects</a></li>
                        <li><a href="#experiences">Experiences</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
            </nav>
            <PortfolioAbout/>
            <PortfolioProject/>
            <PortfolioExperience/>
            <PortfolioContact/>
        </div>
    )
}

export default Portfolio;