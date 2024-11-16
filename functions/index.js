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
const { sendError, sendSuccess } = require("./helper");

admin.initializeApp();

exports.contact = onRequest((request, response) => {
  // allow these https://carlxaeron.github.io, http://localhost:3000
  response.setHeader('Access-Control-Allow-Origin', process.env.FIREBASE_DEBUG_MODE === 'true' ? '*' : 'https://carlxaeron.github.io');
  response.setHeader('Access-Control-Allow-Methods', 'POST');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
