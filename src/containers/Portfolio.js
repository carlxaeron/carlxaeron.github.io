import "./../styles/sass/app.scss"
import PortfolioAbout from "./Portfolio/About";
import PortfolioContact from "./Portfolio/Contact";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioHeaderTop from "./Portfolio/HeaderTop";
import PortfolioHome from "./Portfolio/Home";
import PortfolioProject from "./Portfolio/Project";
import ThemeProvider from "./Portfolio/theme-provider";

function Portfolio() {
    return (
        <>
        <ThemeProvider>
            <PortfolioHeaderTop/>
            <main>
                <PortfolioHome/>
                <PortfolioAbout/>
                <PortfolioProject/>
                <PortfolioExperience/>
                <PortfolioContact/>
            </main>
            <footer>

            </footer>
        </ThemeProvider>
        </>
    )
}

export default Portfolio;