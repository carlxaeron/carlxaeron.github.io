import { useEffect } from "react";
import "./../styles/sass/app.scss"
import PortfolioAbout from "./Portfolio/About";
import PortfolioContact from "./Portfolio/Contact";
import PortfolioExperience from "./Portfolio/Experience";
import PortfolioHeaderTop from "./Portfolio/HeaderTop";
import PortfolioHome from "./Portfolio/Home";
import PortfolioProject from "./Portfolio/Project";
import ThemeProvider, { useStore } from "./Portfolio/theme-provider";
import { Button, Modal } from "react-bootstrap";
import ChatAgent from "../components/ChatAgent";

function Portfolio() {
    const { value, setValue } = useStore();

    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        setValue({ isMobile, width: window.innerWidth });
    }

    useEffect(() => {
        handleResize(); // Call the function initially

        window.addEventListener("resize", handleResize); // Add event listener for resize

        setInterval(() => {
            const currentTime = new Date().getTime();
            const doneStorage = sessionStorage.getItem('done');
            const doneTimer = doneStorage && parseInt(sessionStorage.getItem('done'));
            if (doneTimer && doneTimer < currentTime) {
                setValue({ done: false });
                sessionStorage.removeItem('done');
            }
        }, 1000); // Set interval to check for the current time

        return () => {
            window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
        };
    }, []);

    const closeModal = () => {
        setValue({ modal: { ...value.modal, show: false } });
    }

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
            
            <Modal backdrop='static' centered className="z-[999999]" show={value.modal.show} onHide={closeModal} 
                size={value.modal.config?.size}
                fullscreen={value.modal.config?.fullscreen}>
                <Modal.Header closeButton>
                <Modal.Title>{value.modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{value.modal.body}</Modal.Body>
                <Modal.Footer>
                <Button variant="primary" className="text-white" onClick={closeModal}>
                    Close
                </Button>
                {/* <Button variant="primary" onClick={() => {}}>
                    Save Changes
                </Button> */}
                </Modal.Footer>
            </Modal>

            <ChatAgent />
        </ThemeProvider>
        </>
    )
}

export default Portfolio;