import { Button, Form } from "react-bootstrap";
import { firebaseConfig } from "../../config";

function PortfolioContact() {

    const handleSubmit = e => {
        e.preventDefault();
        console.log(e)
        console.log(firebaseConfig);

        // // Initialize Firebase
        // const firebase = initializeApp(firebaseConfig);

        // const db = firestore();

        // // Access the form data
        // const name = e.target.name.value;
        // const email = e.target.email.value;
        // const message = e.target.message.value;

        // // Save the form data to Firestore
        // db.collection("contacts").add({
        //     name: name,
        //     email: email,
        //     message: message
        // })
        // .then(() => {
        //     console.log("Form data saved successfully!");
        //     // Reset the form
        //     e.target.reset();
        // })
        // .catch(error => {
        //     console.error("Error saving form data: ", error);
        // });
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
                            <Form.Control size="md" required type="text" placeholder="Enter your name" />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control size="md" required type="email" placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="message">
                            <Form.Label>Message</Form.Label>
                            <Form.Control size="md" required as="textarea" placeholder="Enter your message" />
                        </Form.Group>
                        <div className="flex justify-content-center">
                            <Button className="text-white mt-3" size="lg" variant="primary" type="submit">
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