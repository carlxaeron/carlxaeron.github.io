import { Button, Form } from "react-bootstrap";
import { fb_db } from "../../config";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useStore } from "./theme-provider";
import axios from "axios";
import { mapping } from "../../mapping";

function PortfolioContact() {
    const { value, setValue } = useStore();
    const [loading, setLoading] = useState(false);
    const isDemo = process.env.NODE_ENV === 'development';
    const isRequired = !isDemo;

    const handleSubmit = e => {
        e.preventDefault();

        // if(isDemo) {
        //     showSuccess();
        //     return;
        // }

        setLoading(true);

        axios.post(mapping.contact, {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value
        }).then(response => {
            console.log(response);
            showSuccess();
            setLoading(false);
            // Reset the form
            e.target.reset();
        }).catch(error => {
            console.error(error);
            if(error?.response?.data?.errCode !== 'test') showFail();
            setLoading(false);
        });
    }

    const showSuccess = () => {
        // Set a timer to show the modal for 60mins
        if(!isDemo) sessionStorage.setItem('done', new Date().getTime() + 3600000);
        setValue({ done: !isDemo, modal: { show: true, title: 'Success', body: 'Message succesfully sent! I will respond to your message ASAP.' } });
    }

    const showFail = () => {
        // Set a timer to show the modal for 10secs
        if(!isDemo) sessionStorage.setItem('done', new Date().getTime() + 10000);
        setValue({ modal: { show: true, title: 'Error', body: 'Message not sent. Please try again later after 10secs.' }, done: true });
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
                                size="md" required={isRequired} type="text" placeholder="Enter your name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                 disabled={loading || value.done}
                                size="md" required={isRequired} type="email" placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control 
                                 disabled={loading || value.done}
                                size="md" required={isRequired} as="textarea" placeholder="Enter your message" />
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