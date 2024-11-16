/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const httpResponses = ({ data, message, errCode }) => ({
  success: {
    status: 200,
    message: message || "Success",
    data: data || {}
  },
  error: {
    status: 400,
    message: message || "Error",
    data: data || {},
    errCode: errCode || "",
  }
});

const sendError = ({ request, response }, data) => {
  response.status(400).send(httpResponses(data).error);
}

const sendSuccess = ({ request, response }, data) => {
  response.status(200).send(httpResponses(data).success);
}

exports.contact = onRequest((request, response) => {
  const { name, email, message } = request.body;

  // Perform validation on the request body
  if (!name || !email || !message) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const contactRef = admin.firestore().collection("contact").doc();
  contactRef.set({ name, email, message })
  .then(() => {
    logger.info("Contact data written to Firestore", { structuredData: true });
    sendSuccess({ response }, { message: "Contact request received" });
  })
  .catch((error) => {
    // log the error to the console and also put the error value in the structured data
    logger.error("Error writing contact data to Firestore", { structuredData: true, error });
    sendError({ response }, { message: "Error saving contact data" });
  });
});