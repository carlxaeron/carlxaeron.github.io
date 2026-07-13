/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");
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

function applyCorsHeaders(request, response, options = {}) {
  const allowedOrigins = [
    "https://carlxaeron.github.io",
    "https://carlmanuel.com",
    "https://www.carlmanuel.com",
    "http://localhost:3000",
  ];
  const origin = request.headers.origin;
  const methods = options.methods || "POST, OPTIONS";

  if (allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    response.setHeader("Access-Control-Allow-Origin", "*");
  }

  response.setHeader("Access-Control-Allow-Methods", methods);
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip || "";
}

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(`${ip}:carlxaeron-portfolio`).digest("hex").slice(0, 16);
}

function parseDevice(userAgent = "") {
  const ua = String(userAgent).toLowerCase();
  if (/mobile|android|iphone|ipad/.test(ua)) return "Mobile";
  if (/tablet|ipad/.test(ua)) return "Tablet";
  return "Desktop";
}

function incrementCount(map, key, amount = 1) {
  const normalized = key || "—";
  map.set(normalized, (map.get(normalized) || 0) + amount);
}

function topEntries(map, limit = 8) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function formatTopList(entries) {
  if (!entries.length) return "<li>No data yet</li>";
  return entries.map(([label, count]) => `<li><strong>${escapeHtml(label)}</strong> — ${count}</li>`).join("");
}

function buildWeeklyVisitReportPayload(stats) {
  const subject = `Weekly portfolio visit report — ${stats.weekLabel}`;
  const html = `
    <h2>Portfolio weekly visit report</h2>
    <p><strong>Period:</strong> ${escapeHtml(stats.weekLabel)}</p>
    <ul>
      <li><strong>Total events:</strong> ${stats.totalEvents}</li>
      <li><strong>Page views:</strong> ${stats.pageViews}</li>
      <li><strong>Section views:</strong> ${stats.sectionViews}</li>
      <li><strong>Preview views:</strong> ${stats.previewViews}</li>
      <li><strong>Unique visitors:</strong> ${stats.uniqueVisitors}</li>
      <li><strong>Unique sessions:</strong> ${stats.uniqueSessions}</li>
      <li><strong>Preview likes:</strong> ${stats.totalLikes || 0}</li>
      <li><strong>Preview dislikes:</strong> ${stats.totalDislikes || 0}</li>
    </ul>
    <h3>Top sections</h3>
    <ul>${formatTopList(stats.topSections)}</ul>
    <h3>Top preview slugs</h3>
    <ul>${formatTopList(stats.topPreviews)}</ul>
    <h3>Top referrers</h3>
    <ul>${formatTopList(stats.topReferrers)}</ul>
    <h3>Devices</h3>
    <ul>${formatTopList(stats.devices)}</ul>
    <p style="margin-top:24px;color:#666;font-size:12px;">Visit records include visitor IP for your admin review in Firestore.</p>
  `.trim();

  const text = [
    "Portfolio weekly visit report",
    "",
    `Period: ${stats.weekLabel}`,
    `Total events: ${stats.totalEvents}`,
    `Preview likes: ${stats.totalLikes || 0}`,
    `Preview dislikes: ${stats.totalDislikes || 0}`,
    "",
    "Top preview slugs:",
    ...topEntries(stats.topPreviewsMap || new Map()).map(([k, v]) => `- ${k}: ${v}`),
  ].join("\n");

  return {
    replyTo: "info@carlmanuel.com",
    message: { subject, html, text },
  };
}

async function countQuery(query) {
  const snap = await query.count().get();
  return snap.data().count;
}

function bucketByDay(dates, days = 7) {
  const buckets = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets.push({ date: key, count: 0 });
  }
  const index = new Map(buckets.map((b, i) => [b.date, i]));
  dates.forEach((dateValue) => {
    const d = dateValue?.toDate ? dateValue.toDate() : new Date(dateValue);
    const key = d.toISOString().slice(0, 10);
    if (index.has(key)) buckets[index.get(key)].count += 1;
  });
  return buckets;
}

async function buildAnalyticsSummary() {
  const db = admin.firestore();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalVisits, totalLikes, totalDislikes, recentVisitsSnap, feedbackSnap] = await Promise.all([
    countQuery(db.collection("visits")),
    countQuery(db.collection("preview_feedback").where("sentiment", "==", "like")),
    countQuery(db.collection("preview_feedback").where("sentiment", "==", "dislike")),
    db.collection("visits").where("date", ">=", weekAgo).get(),
    db.collection("preview_feedback").get(),
  ]);

  const visitors = new Set();
  const previewViews = new Map();
  const previewLikes = new Map();
  const previewDislikes = new Map();
  const visitDates = [];

  recentVisitsSnap.forEach((doc) => {
    const data = doc.data();
    if (data.visitorId) visitors.add(data.visitorId);
    if (data.date) visitDates.push(data.date);
    if (data.previewSlug) incrementCount(previewViews, data.previewSlug);
  });

  feedbackSnap.forEach((doc) => {
    const data = doc.data();
    if (!data.previewSlug) return;
    if (data.sentiment === "like") incrementCount(previewLikes, data.previewSlug);
    if (data.sentiment === "dislike") incrementCount(previewDislikes, data.previewSlug);
  });

  const previewSlugs = new Set([...previewViews.keys(), ...previewLikes.keys(), ...previewDislikes.keys()]);
  const previewStats = [...previewSlugs].map((slug) => ({
    slug,
    views: previewViews.get(slug) || 0,
    likes: previewLikes.get(slug) || 0,
    dislikes: previewDislikes.get(slug) || 0,
  })).sort((a, b) => b.views - a.views);

  return {
    clientSites: 8,
    totalVisits,
    uniqueVisitorsWeek: visitors.size,
    totalLikes,
    totalDislikes,
    visitsByDay: bucketByDay(visitDates),
    previewStats,
    generatedAt: new Date().toISOString(),
  };
}

async function aggregateWeeklyVisitStats(weekAgo, now) {
  const snapshot = await admin.firestore()
    .collection("visits")
    .where("date", ">=", weekAgo)
    .where("date", "<", now)
    .get();

  const visitors = new Set();
  const sessions = new Set();
  const topSections = new Map();
  const topPreviews = new Map();
  const topReferrers = new Map();
  const devices = new Map();

  let pageViews = 0;
  let sectionViews = 0;
  let previewViews = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.visitorId) visitors.add(data.visitorId);
    if (data.sessionId) sessions.add(data.sessionId);

    if (data.eventType === "pageview") pageViews += 1;
    if (data.eventType === "section_view") sectionViews += 1;
    if (data.eventType === "preview_view") previewViews += 1;

    if (data.section) incrementCount(topSections, data.section);
    if (data.previewSlug) incrementCount(topPreviews, data.previewSlug);
    incrementCount(topReferrers, data.referrer || "Direct / none");
    incrementCount(devices, data.device || "Unknown");
  });

  const weekLabel = `${weekAgo.toISOString().slice(0, 10)} → ${now.toISOString().slice(0, 10)}`;

  const feedbackSnap = await admin.firestore()
    .collection("preview_feedback")
    .where("date", ">=", weekAgo)
    .where("date", "<", now)
    .get();

  let totalLikes = 0;
  let totalDislikes = 0;
  feedbackSnap.forEach((doc) => {
    const data = doc.data();
    if (data.sentiment === "like") totalLikes += 1;
    if (data.sentiment === "dislike") totalDislikes += 1;
  });

  return {
    weekLabel,
    totalEvents: snapshot.size,
    pageViews,
    sectionViews,
    previewViews,
    uniqueVisitors: visitors.size,
    uniqueSessions: sessions.size,
    totalLikes,
    totalDislikes,
    topSections: topEntries(topSections),
    topPreviews: topEntries(topPreviews),
    topReferrers: topEntries(topReferrers),
    devices: topEntries(devices),
    topSectionsMap: topSections,
    topPreviewsMap: topPreviews,
    topReferrersMap: topReferrers,
  };
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

exports.trackVisit = onRequest((request, response) => {
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
    visitorId,
    sessionId,
    eventType,
    section,
    previewSlug,
    path,
    referrer,
    userAgent,
    language,
    screen,
    viewport,
  } = request.body || {};

  if (!visitorId || !sessionId) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const normalizedEvent = String(eventType || "pageview").trim().slice(0, 32);
  const clientIp = getClientIp(request);
  const visitRef = admin.firestore().collection("visits").doc();

  visitRef
    .set({
      visitorId: String(visitorId).slice(0, 64),
      sessionId: String(sessionId).slice(0, 64),
      eventType: normalizedEvent,
      section: section ? String(section).slice(0, 32) : null,
      previewSlug: previewSlug ? String(previewSlug).slice(0, 64) : null,
      path: path ? String(path).slice(0, 512) : null,
      referrer: referrer ? String(referrer).slice(0, 512) : null,
      userAgent: userAgent ? String(userAgent).slice(0, 512) : null,
      language: language ? String(language).slice(0, 32) : null,
      screen: screen || null,
      viewport: viewport || null,
      device: parseDevice(userAgent),
      ipAddress: clientIp ? String(clientIp).slice(0, 45) : null,
      ipHash: hashIp(clientIp),
      date: new Date(),
    })
    .then(() => {
      logger.info("Visit tracked in Firestore", { structuredData: true, eventType: normalizedEvent });
      sendSuccess({ response }, { message: "Visit recorded" });
    })
    .catch((error) => {
      logger.error("Error saving visit to Firestore", { structuredData: true, error });
      sendError({ response }, { message: "Error saving visit data" });
    });
});

exports.weeklyVisitReport = onSchedule(
  {
    schedule: "0 8 * * 1",
    timeZone: "Asia/Manila",
  },
  async () => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const reportId = weekAgo.toISOString().slice(0, 10);
    const reportRef = admin.firestore().collection("analytics_reports").doc(reportId);
    const existing = await reportRef.get();
    if (existing.exists) {
      logger.info("Weekly visit report already sent", { reportId });
      return;
    }

    const stats = await aggregateWeeklyVisitStats(weekAgo, now);
    const mailPayload = buildWeeklyVisitReportPayload(stats);

    try {
      await queueMailDocuments(mailPayload);
      logger.info("Weekly visit report queued in mail collection", { structuredData: true, reportId });
    } catch (queueError) {
      logger.error("Failed to queue weekly visit report", { structuredData: true, error: queueError });
      throw queueError;
    }

    try {
      await sendContactEmailDirect(mailPayload);
      logger.info("Weekly visit report sent via SMTP", { structuredData: true, reportId });
    } catch (smtpError) {
      logger.error("Failed to send weekly visit report via SMTP", { structuredData: true, error: smtpError });
    }

    await reportRef.set({
      reportId,
      sentAt: new Date(),
      stats: {
        totalEvents: stats.totalEvents,
        uniqueVisitors: stats.uniqueVisitors,
        uniqueSessions: stats.uniqueSessions,
        pageViews: stats.pageViews,
        sectionViews: stats.sectionViews,
        previewViews: stats.previewViews,
      },
    });
  }
);

exports.previewFeedback = onRequest(async (request, response) => {
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
    visitorId,
    sessionId,
    previewSlug,
    sentiment,
    comment,
    previewLabel,
  } = request.body || {};

  if (!visitorId || !sessionId || !previewSlug || !sentiment) {
    sendError({ response }, { message: "Missing required fields" });
    return;
  }

  const normalizedSentiment = String(sentiment).trim().toLowerCase();
  if (normalizedSentiment !== "like" && normalizedSentiment !== "dislike") {
    sendError({ response }, { message: "Invalid sentiment" });
    return;
  }

  const trimmedComment = comment ? String(comment).trim() : "";
  if (normalizedSentiment === "dislike" && !trimmedComment) {
    sendError({ response }, { message: "Comment is required when disliking" });
    return;
  }

  const slug = String(previewSlug).slice(0, 64);
  const vid = String(visitorId).slice(0, 64);

  const existing = await admin.firestore()
    .collection("preview_feedback")
    .where("visitorId", "==", vid)
    .where("previewSlug", "==", slug)
    .limit(1)
    .get();

  if (!existing.empty) {
    sendError({ response }, { message: "You already submitted feedback for this preview" });
    return;
  }

  const clientIp = getClientIp(request);

  try {
    await admin.firestore().collection("preview_feedback").add({
      visitorId: vid,
      sessionId: String(sessionId).slice(0, 64),
      previewSlug: slug,
      previewLabel: previewLabel ? String(previewLabel).slice(0, 128) : null,
      sentiment: normalizedSentiment,
      comment: trimmedComment ? trimmedComment.slice(0, 1000) : null,
      ipAddress: clientIp ? String(clientIp).slice(0, 45) : null,
      ipHash: hashIp(clientIp),
      date: new Date(),
    });

    logger.info("Preview feedback saved", { structuredData: true, previewSlug: slug, sentiment: normalizedSentiment });
    sendSuccess({ response }, { message: "Feedback recorded" });
  } catch (error) {
    logger.error("Error saving preview feedback", { structuredData: true, error });
    sendError({ response }, { message: "Error saving feedback" });
  }
});

exports.analyticsSummary = onRequest(async (request, response) => {
  applyCorsHeaders(request, response, { methods: "GET, OPTIONS" });

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "GET") {
    sendError({ response }, { message: "Method not allowed" });
    return;
  }

  try {
    const summary = await buildAnalyticsSummary();
    sendSuccess({ response }, { message: "OK", data: summary });
  } catch (error) {
    logger.error("Error building analytics summary", { structuredData: true, error });
    sendError({ response }, { message: "Error loading analytics" });
  }
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