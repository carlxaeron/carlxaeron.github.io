import { useEffect } from "react";
import "./../styles/sass/app.scss"
import PortfolioAbout from "./Portfolio/About";
import PortfolioContact from "./Portfolio/Contact";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioHeaderTop from "./Portfolio/HeaderTop";
import PortfolioHome from "./Portfolio/Home";
import PortfolioProject from "./Portfolio/Project";
import ThemeProvider, { useStore } from "./Portfolio/theme-provider";

function Portfolio() {
    const { value, setValue } = useStore();

    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        console.log(window.innerWidth);
        setValue({ isMobile });
    }

    useEffect(() => {
        handleResize(); // Call the function initially

        window.addEventListener("resize", handleResize); // Add event listener for resize

        return () => {
            window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
        };
    }, []);

    useEffect(() => {
        console.log(value);
    }, [value]);

    return (
        <>
        <ThemeProvider>
            <PortfolioHeaderTop/>
            <main>
                <PortfolioHome/>
                <div style={{position: 'relative'}}>
                    <PortfolioAbout id='top'/>
                    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 9999}}>
                        <PortfolioAbout id='bottom'/>
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    <PortfolioProject id='top' />
                    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 9999, background: '#eee'}}>
                        <PortfolioProject id='bottom'/>
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    <PortfolioExperience id='top' />
                    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 9999}}>
                        <PortfolioExperience id='bottom'/>
                    </div>
                </div>
                <div style={{position: 'relative'}}>
                    <PortfolioContact id='top' />
                    <div style={{position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 9999, background: '#eee'}}>
                        <PortfolioContact id='bottom'/>
                    </div>
                </div>
            </main>
            <footer>

            </footer>
        </ThemeProvider>
        </>
    )
}

export default Portfolio;