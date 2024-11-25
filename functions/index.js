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
const { SKILLS, PROJECTS_DESCRIPTION, COMPANIES, EXPERIENCES } = require("./external-config");
const https = require('https');

admin.initializeApp();

// add new function for API for my AI assistant
exports.assistant = onRequest((request, response) => {
  // Allow these origins
  const allowedOrigins = ['https://carlxaeron.github.io', 'http://localhost:3000'];
  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    response.setHeader('Access-Control-Allow-Origin', '*');
  }

  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  const { messages } = request.body;

  // Perform validation on the request body
  if (!messages) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const data = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are Carl Louis Manuel assistant and you will only answer from these data and answer it professionally: ' + JSON.stringify({
        ...SKILLS,
        'DESCRIPTION': PROJECTS_DESCRIPTION,
        ...COMPANIES,
        ...EXPERIENCES,
      }) },
      ...messages,
    ],
  };

  // Send message to AI assistant
  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    // i want to add payload
    body: {
      "model": "gpt-3.5-turbo",
      "messages": messages,
    },
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const json = JSON.parse(data);

      if(json.choices) {
        logger.info("AI assistant response", { structuredData: true, response: json });
        // Send success response to the client
        sendSuccess({ response }, { message: "", data: json.choices });
      } else {
        logger.error("Error sending request to AI assistant", { structuredData: true, error: json, data: process.env });
        sendError({ response }, { message: "Error sending request to AI assistant" });
      }
    });
  });

  req.on('error', (error) => {
    logger.error("Error sending request to AI assistant", { structuredData: true, error, data: process.env });
    sendError({ response }, { message: "Error sending request to AI assistant" });
  });

  req.write(JSON.stringify(data));
  req.end();
});

exports.contact = onRequest((request, response) => {
  // Allow these origins
  const allowedOrigins = ['https://carlxaeron.github.io', 'http://localhost:3000'];
  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    response.setHeader('Access-Control-Allow-Origin', '*');
  }

  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  const { name, email, message } = request.body;

  // Perform validation on the request body
  if (!name || !email || !message) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  // Save contact data to Firestore
  const contactRef = admin.firestore().collection("contact").doc();
  contactRef.set({ name, email, message, date: new Date() })
  .then(() => {
    logger.info("Contact data written to Firestore", { structuredData: true });

    // Send email to admin
    admin.firestore().collection('mail').add({
      to: 'carlxaeron09@gmail.com',
      message: {
        subject: 'Hello from Firebase!',
        html: 'This is an <code>HTML</code> email body.',
      },
    }).then(() => {
      logger.info("Email sent to admin", { structuredData: true });

      // Send success response to the client
      sendSuccess({ response }, { message: "Contact request received" });
    }).catch((error) => {
      logger.error("Error sending email to admin", { structuredData: true, error });
    });
  })
  .catch((error) => {
    // log the error to the console and also put the error value in the structured data
    logger.error("Error writing contact data to Firestore", { structuredData: true, error });
    sendError({ response }, { message: "Error saving contact data" });
  });
});
