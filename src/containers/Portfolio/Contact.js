import { Button, Form } from "react-bootstrap";
import { fb_db } from "../../config";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useStore } from "./theme-provider";

function PortfolioContact() {
    const { value, setValue } = useStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = e => {
        e.preventDefault();

        setLoading(true);

        const db = fb_db;

        // Access the form data
        const name = e.target.name.value;
        const email = e.target.email.value;
        const message = e.target.message.value;

        addDoc(collection(db, "contact"), {
            name: name,
            email: email,
            message: message
        })
        .then(() => {
            console.log("Form data saved successfully!");
            // Reset the form
            e.target.reset();

            setLoading(false);
            showSuccess();
        })
        .catch(error => {
            setLoading(false);
            console.error("Error saving form data: ", error);
        });
    }

    const showSuccess = () => {
        // Set a timer to show the modal for 60mins
        sessionStorage.setItem('done', new Date().getTime() + 3600000);
        setValue({ done: true, modal: { show: true, title: 'Success', body: 'Message succesfully sent! I will respond to your message ASAP.' } });
    }

    return (
        <div className="clm-contact clm-fixed-hc p-3" id="contact">
            <div className="clm-inner-container clm-container">
                <div className="clm-title">
                    <h4>CONTACT</h4>
                </div>
                <div className="clm-contact-form">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                 disabled={loading || value.done}
                                size="md" required type="text" placeholder="Enter your name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                 disabled={loading || value.done}
                                size="md" required type="email" placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control 
                                 disabled={loading || value.done}
                                size="md" required as="textarea" placeholder="Enter your message" />
                        </Form.Group>
                        <div className="flex justify-content-center">
                            <Button disabled={loading || value.done} className="text-white mt-3" size="lg" variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default PortfolioContact;