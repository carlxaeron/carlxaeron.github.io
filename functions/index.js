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
const { SKILLS, PROJECTS_DESCRIPTION, COMPANIES, EXPERIENCES, PROJECTS_DESCRIPTION2 } = require("./external-config");
const https = require('https');

admin.initializeApp();

const ADMIN_RECIPIENTS = [
  "info@carlmanuel.com",
  "carllouismanuel09@gmail.com",
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactMailPayload({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const subject = `Portfolio contact from ${name}`;
  const html = `
    <h2>New portfolio contact message</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
  `.trim();
  const text = [
    "New portfolio contact message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  return {
    replyTo: email,
    message: { subject, html, text },
  };
}

function buildQuotationMailPayload({
  name,
  company,
  email,
  phone,
  projectType,
  budgetRange,
  timeline,
  services,
  details,
}) {
  const safeName = escapeHtml(name);
  const safeCompany = escapeHtml(company || "—");
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "—");
  const safeProjectType = escapeHtml(projectType || "—");
  const safeBudget = escapeHtml(budgetRange || "—");
  const safeTimeline = escapeHtml(timeline || "—");
  const safeServices = Array.isArray(services) && services.length
    ? services.map((s) => escapeHtml(s)).join(", ")
    : "—";
  const safeDetails = escapeHtml(details).replace(/\n/g, "<br/>");

  const subject = `Quote request from ${name}${company ? ` (${company})` : ""}`;
  const html = `
    <h2>New portfolio quote request</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Company:</strong> ${safeCompany}</p>
    <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p><strong>Phone:</strong> ${safePhone}</p>
    <p><strong>Project type:</strong> ${safeProjectType}</p>
    <p><strong>Services:</strong> ${safeServices}</p>
    <p><strong>Budget:</strong> ${safeBudget}</p>
    <p><strong>Timeline:</strong> ${safeTimeline}</p>
    <p><strong>Project details:</strong></p>
    <p>${safeDetails}</p>
  `.trim();
  const text = [
    "New portfolio quote request",
    "",
    `Name: ${name}`,
    `Company: ${company || "—"}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Project type: ${projectType || "—"}`,
    `Services: ${Array.isArray(services) && services.length ? services.join(", ") : "—"}`,
    `Budget: ${budgetRange || "—"}`,
    `Timeline: ${timeline || "—"}`,
    "",
    "Project details:",
    details,
  ].join("\n");

  return {
    replyTo: email,
    message: { subject, html, text },
  };
}

function applyCorsHeaders(request, response) {
  const allowedOrigins = [
    "https://carlxaeron.github.io",
    "https://carlmanuel.com",
    "https://www.carlmanuel.com",
    "http://localhost:3000",
  ];
  const origin = request.headers.origin;

  if (allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    response.setHeader("Access-Control-Allow-Origin", "*");
  }

  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function buildMailDocuments(mailContent) {
  return ADMIN_RECIPIENTS.map((recipient) => ({
    to: recipient,
    replyTo: mailContent.replyTo,
    message: mailContent.message,
  }));
}

async function queueMailDocuments(mailContent) {
  const documents = buildMailDocuments(mailContent);
  await Promise.all(
    documents.map((doc) => admin.firestore().collection("mail").add(doc))
  );
}

function createMailTransport() {
  const smtpUri = process.env.SMTP_CONNECTION_URI;
  if (!smtpUri) {
    return null;
  }

  const nodemailer = require("nodemailer");
  const normalizedUri = smtpUri.replace(/^smtp:\/\//, "smtps://");
  return nodemailer.createTransport(normalizedUri);
}

async function sendContactEmailDirect(mailContent) {
  const transporter = createMailTransport();
  if (!transporter) {
    logger.warn("SMTP_CONNECTION_URI not set; direct email skipped");
    return;
  }

  const from = process.env.DEFAULT_FROM || "carllouismanuel09@gmail.com";

  await transporter.sendMail({
    from,
    to: ADMIN_RECIPIENTS.join(", "),
    replyTo: mailContent.replyTo,
    subject: mailContent.message.subject,
    html: mailContent.message.html,
    text: mailContent.message.text,
  });
}

// add new function for API for my AI assistant
exports.assistant = onRequest((request, response) => {
  // Allow these origins
  const allowedOrigins = [
    'https://carlxaeron.github.io',
    'https://carlmanuel.com',
    'https://www.carlmanuel.com',
    'http://localhost:3000',
  ];
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
        'DESCRIPTIONAI': PROJECTS_DESCRIPTION2,
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
  const allowedOrigins = [
    'https://carlxaeron.github.io',
    'https://carlmanuel.com',
    'https://www.carlmanuel.com',
    'http://localhost:3000',
  ];
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

  if (request.method !== "POST") {
    sendError({ response }, { message: "Method not allowed" });
    return;
  }

  const { name, email, message } = request.body;

  // Perform validation on the request body
  if (!name || !email || !message) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const contactRef = admin.firestore().collection("contact").doc();
  const mailPayload = buildContactMailPayload({
    name: trimmedName,
    email: trimmedEmail,
    message: trimmedMessage,
  });

  contactRef
    .set({ name: trimmedName, email: trimmedEmail, message: trimmedMessage, date: new Date() })
    .then(async () => {
      logger.info("Contact data written to Firestore", { structuredData: true });

      try {
        await queueMailDocuments(mailPayload);
        logger.info("Contact email queued in mail collection", { structuredData: true });
      } catch (queueError) {
        logger.error("Failed to queue contact email in Firestore", {
          structuredData: true,
          error: queueError,
        });
      }

      try {
        await sendContactEmailDirect(mailPayload);
        logger.info("Contact email sent via SMTP", { structuredData: true });
      } catch (smtpError) {
        logger.error("Failed to send contact email via SMTP", {
          structuredData: true,
          error: smtpError,
        });
      }

      sendSuccess({ response }, { message: "Contact request received" });
    })
    .catch((error) => {
      logger.error("Error saving contact to Firestore", { structuredData: true, error });
      sendError({ response }, { message: "Error saving contact data" });
    });
});

exports.quotation = onRequest((request, response) => {
  applyCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    sendError({ response }, { message: "Method not allowed" });
    return;
  }

  const {
    name,
    company,
    email,
    phone,
    projectType,
    budgetRange,
    timeline,
    services,
    details,
  } = request.body;

  if (!name || !email || !details) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedDetails = String(details).trim();
  const trimmedCompany = company ? String(company).trim() : "";
  const trimmedPhone = phone ? String(phone).trim() : "";
  const trimmedProjectType = projectType ? String(projectType).trim() : "";
  const trimmedBudget = budgetRange ? String(budgetRange).trim() : "";
  const trimmedTimeline = timeline ? String(timeline).trim() : "";
  const selectedServices = Array.isArray(services)
    ? services.map((s) => String(s).trim()).filter(Boolean)
    : [];

  if (!trimmedName || !trimmedEmail || !trimmedDetails) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const quotationRef = admin.firestore().collection("quotations").doc();
  const mailPayload = buildQuotationMailPayload({
    name: trimmedName,
    company: trimmedCompany,
    email: trimmedEmail,
    phone: trimmedPhone,
    projectType: trimmedProjectType,
    budgetRange: trimmedBudget,
    timeline: trimmedTimeline,
    services: selectedServices,
    details: trimmedDetails,
  });

  quotationRef
    .set({
      name: trimmedName,
      company: trimmedCompany,
      email: trimmedEmail,
      phone: trimmedPhone,
      projectType: trimmedProjectType,
      budgetRange: trimmedBudget,
      timeline: trimmedTimeline,
      services: selectedServices,
      details: trimmedDetails,
      date: new Date(),
    })
    .then(async () => {
      logger.info("Quotation data written to Firestore", { structuredData: true });

      try {
        await queueMailDocuments(mailPayload);
        logger.info("Quotation email queued in mail collection", { structuredData: true });
      } catch (queueError) {
        logger.error("Failed to queue quotation email in Firestore", {
          structuredData: true,
          error: queueError,
        });
      }

      try {
        await sendContactEmailDirect(mailPayload);
        logger.info("Quotation email sent via SMTP", { structuredData: true });
      } catch (smtpError) {
        logger.error("Failed to send quotation email via SMTP", {
          structuredData: true,
          error: smtpError,
        });
      }

      sendSuccess({ response }, { message: "Quote request received" });
    })
    .catch((error) => {
      logger.error("Error saving quotation to Firestore", { structuredData: true, error });
      sendError({ response }, { message: "Error saving quote request" });
    });
});

exports.license = onRequest((request, response) => {
  console.log(request.body);
  const requestBody = request.body;

  const allowedDomains = ['https://vivawellnessdripdotcom.test', 'https://vivawellnessdrip.com', 'https://staging.vivawellnessdrip.com']

  let valid = false;
  if (requestBody.license_key === 'carlxaeron09@gmail.com' && allowedDomains.includes(requestBody.domain)) {
    valid = true;
  }

  if (valid) return sendSuccess({ response, request }, { message: "License validated", data: {
    status: 'valid',
  } });
  else return sendError({ response, request }, { message: "License invalid", data: {
    status: 'invalid',
  } });
});