import JSZip from "jszip";
import { buildPreviewPortfolioUrl } from "../config/previewWhitelist";

export const SERVICE_AGREEMENT_TEMPLATE_URL =
  `${process.env.PUBLIC_URL || ""}/templates/client-service-agreement.md`.replace(
    /\/+/g,
    "/"
  );

export const CLIENT_CATALOG_URL =
  `${process.env.PUBLIC_URL || ""}/data/client-catalog.json`.replace(/\/+/g, "/");

export const PROVIDER_DEFAULTS = {
  providerLegalName: "CarlManuel Software Development Services",
  providerTradeName: "Carl Manuel (carlmanuel.com)",
  providerSignatoryName: "Carl Louis Manuel",
  providerSignatoryTitle: "Proprietor / Authorized representative",
  providerAddress: "Philippines",
  providerTin: "N/A",
  bankName: "BDO Unibank",
  accountName: "Carl Louis Manuel",
  accountNumber: "To be confirmed on invoice",
  ewalletDetails: "GCash — request number on invoice",
  otherPaymentMethod: "—",
  kickoffDays: "3",
  firstDraftDays: "5",
  revisionWindowDays: "5",
  includedRevisionRounds: "2",
  clientFeedbackDays: "5",
  balanceDueDays: "14",
  lateFeePercent: "2",
  hostingIncludedMonths: "1",
  confidentialityYears: "2",
  terminationNoticeDays: "7",
  curePeriodDays: "14",
  disputeDays: "30",
  venueCityProvince: "Metro Manila",
  addonAmountOrNone: "None",
  heroDescription: "Hero with business positioning and primary call-to-action",
  servicesDescription: "Services or offerings section with key packages",
  aboutDescription: "About the business, credentials, and service area",
  faqDescription: "Frequently asked questions accordion",
  contactDescription: "Contact section with click-to-call, email, and location",
  otherSections: "As scoped in quotation",
  adminModule1: "Dashboard",
  adminModule1Desc: "Overview metrics and quick actions",
  adminModule2: "Core workflow",
  adminModule2Desc: "Primary business workflow pages (jobs, bookings, orders, etc.)",
  adminModule3: "Settings",
  adminModule3Desc: "Business profile and demo configuration",
  exclusion1: "Production backend, payment processing, or live customer data hosting",
  exclusion2: "Ongoing content updates after warranty unless under maintenance agreement",
  addon1Name: "—",
  addon1Fee: "—",
  addon1Notes: "—",
};

let catalogCache = null;

export function formatIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parsePesoAmount(value) {
  if (value == null || value === "") return null;
  const digits = String(value).replace(/[^\d.]/g, "");
  if (!digits) return null;
  const num = Number.parseFloat(digits);
  return Number.isFinite(num) ? num : null;
}

export function formatPeso(amount) {
  if (amount == null || !Number.isFinite(amount)) return "";
  return `₱${Math.round(amount).toLocaleString("en-PH")}`;
}

export function splitDepositBalance(quotedAmount) {
  const total = parsePesoAmount(quotedAmount);
  if (total == null) {
    return { deposit: "", balance: "", total: quotedAmount || "" };
  }
  const half = Math.round(total / 2);
  const balance = total - half;
  return {
    deposit: formatPeso(half),
    balance: formatPeso(balance),
    total: formatPeso(total),
  };
}

export function indexClientCatalog(clients = []) {
  const bySlug = {};
  clients.forEach((entry) => {
    if (entry?.slug) bySlug[entry.slug] = entry;
  });
  return bySlug;
}

export async function fetchClientCatalog() {
  if (catalogCache) return catalogCache;
  const res = await fetch(CLIENT_CATALOG_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load client catalog.");
  }
  const payload = await res.json();
  catalogCache = indexClientCatalog(payload.clients || []);
  return catalogCache;
}

export async function fetchServiceAgreementTemplate() {
  const res = await fetch(SERVICE_AGREEMENT_TEMPLATE_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Could not load service agreement template.");
  }
  return res.text();
}

export function buildAgreementFormValues({
  site,
  outreach = null,
  catalogEntry = null,
  now = new Date(),
} = {}) {
  const slug = site?.id || catalogEntry?.slug || outreach?.slug || "";
  const previewUrl =
    catalogEntry?.quotation?.previewUrl ||
    outreach?.preview_url ||
    (slug ? buildPreviewPortfolioUrl(slug) : "");
  const quotedAmount =
    catalogEntry?.quotation?.quotedAmount || outreach?.quoted_amount || "₱15,000";
  const { deposit, balance, total } = splitDepositBalance(quotedAmount);
  const navPages = catalogEntry?.system?.navPages || [];
  const systemNavPages = navPages.length ? navPages.join(", ") : "Dashboard, core modules, Settings";

  return {
    slug,
    businessName:
      catalogEntry?.businessName ||
      outreach?.business_name ||
      site?.label ||
      "",
    clientLegalName:
      catalogEntry?.contact?.name ||
      outreach?.contact_name ||
      catalogEntry?.businessName ||
      outreach?.business_name ||
      "",
    clientAddress: catalogEntry?.sources?.address || "",
    clientEmail: catalogEntry?.contact?.email || outreach?.contact_email || "",
    clientPhone: catalogEntry?.contact?.phone || "",
    clientTin: "",
    packageName:
      catalogEntry?.quotation?.packageName ||
      outreach?.package_name ||
      "Starter Business Website",
    quotedAmount: total || quotedAmount,
    totalAmount: total || quotedAmount,
    depositAmount: deposit,
    balanceAmount: balance,
    timeline:
      catalogEntry?.quotation?.timeline ||
      outreach?.timeline ||
      "5–7 business days after content approval",
    paymentTerms:
      catalogEntry?.quotation?.paymentTerms ||
      "50% upfront to begin · 50% on delivery (not the full amount upfront)",
    previewUrl,
    industry: catalogEntry?.industry || "",
    systemType: catalogEntry?.system?.type || "service",
    systemLabel: catalogEntry?.system?.label || "Business admin system",
    systemNavPages,
    adminPath: catalogEntry?.system?.adminPath || "/admin/",
    clientContactName:
      catalogEntry?.contact?.name ||
      outreach?.contact_name ||
      catalogEntry?.businessName ||
      "",
    clientSignatoryName:
      catalogEntry?.contact?.name ||
      outreach?.contact_name ||
      "",
    clientSignatoryTitle: "Owner / Authorized representative",
    agreementDate: formatDisplayDate(now),
    acceptanceDate: formatDisplayDate(now),
    date: formatIsoDate(now),
    ...PROVIDER_DEFAULTS,
  };
}

export function agreementValuesToPlaceholders(values) {
  return {
    DATE: values.date || formatIsoDate(),
    AGREEMENT_DATE: values.agreementDate || formatDisplayDate(),
    ACCEPTANCE_DATE: values.acceptanceDate || values.agreementDate || formatDisplayDate(),
    CLIENT_LEGAL_NAME: values.clientLegalName || values.businessName || "",
    BUSINESS_NAME: values.businessName || "",
    PROVIDER_LEGAL_NAME:
      values.providerLegalName || PROVIDER_DEFAULTS.providerLegalName,
    PROVIDER_TRADE_NAME:
      values.providerTradeName || PROVIDER_DEFAULTS.providerTradeName,
    PROVIDER_SIGNATORY_NAME:
      values.providerSignatoryName || PROVIDER_DEFAULTS.providerSignatoryName,
    PROVIDER_SIGNATORY_TITLE:
      values.providerSignatoryTitle || PROVIDER_DEFAULTS.providerSignatoryTitle,
    PROVIDER_ADDRESS: values.providerAddress || PROVIDER_DEFAULTS.providerAddress,
    CLIENT_ADDRESS: values.clientAddress || "To be provided by Client",
    CLIENT_EMAIL: values.clientEmail || "",
    CLIENT_PHONE: values.clientPhone || "",
    PROVIDER_TIN: values.providerTin || PROVIDER_DEFAULTS.providerTin,
    CLIENT_TIN: values.clientTin || "N/A",
    PACKAGE_NAME: values.packageName || "",
    SYSTEM_TYPE: values.systemType || "",
    SYSTEM_LABEL: values.systemLabel || "",
    SYSTEM_NAV_PAGES: values.systemNavPages || "",
    PREVIEW_URL: values.previewUrl || "",
    KICKOFF_DAYS: values.kickoffDays || PROVIDER_DEFAULTS.kickoffDays,
    FIRST_DRAFT_DAYS: values.firstDraftDays || PROVIDER_DEFAULTS.firstDraftDays,
    REVISION_WINDOW_DAYS:
      values.revisionWindowDays || PROVIDER_DEFAULTS.revisionWindowDays,
    TIMELINE: values.timeline || "",
    QUOTED_AMOUNT: values.quotedAmount || "",
    ADDON_AMOUNT_OR_NONE:
      values.addonAmountOrNone || PROVIDER_DEFAULTS.addonAmountOrNone,
    TOTAL_AMOUNT: values.totalAmount || values.quotedAmount || "",
    DEPOSIT_AMOUNT: values.depositAmount || "",
    BALANCE_AMOUNT: values.balanceAmount || "",
    BANK_NAME: values.bankName || PROVIDER_DEFAULTS.bankName,
    ACCOUNT_NAME: values.accountName || PROVIDER_DEFAULTS.accountName,
    ACCOUNT_NUMBER: values.accountNumber || PROVIDER_DEFAULTS.accountNumber,
    EWALLET_DETAILS: values.ewalletDetails || PROVIDER_DEFAULTS.ewalletDetails,
    OTHER_PAYMENT_METHOD:
      values.otherPaymentMethod || PROVIDER_DEFAULTS.otherPaymentMethod,
    BALANCE_DUE_DAYS: values.balanceDueDays || PROVIDER_DEFAULTS.balanceDueDays,
    LATE_FEE_PERCENT: values.lateFeePercent || PROVIDER_DEFAULTS.lateFeePercent,
    HOSTING_INCLUDED_MONTHS:
      values.hostingIncludedMonths || PROVIDER_DEFAULTS.hostingIncludedMonths,
    INCLUDED_REVISION_ROUNDS:
      values.includedRevisionRounds || PROVIDER_DEFAULTS.includedRevisionRounds,
    CLIENT_CONTACT_NAME: values.clientContactName || values.clientLegalName || "",
    CLIENT_FEEDBACK_DAYS:
      values.clientFeedbackDays || PROVIDER_DEFAULTS.clientFeedbackDays,
    SLUG: values.slug || "",
    CONFIDENTIALITY_YEARS:
      values.confidentialityYears || PROVIDER_DEFAULTS.confidentialityYears,
    TERMINATION_NOTICE_DAYS:
      values.terminationNoticeDays || PROVIDER_DEFAULTS.terminationNoticeDays,
    CURE_PERIOD_DAYS: values.curePeriodDays || PROVIDER_DEFAULTS.curePeriodDays,
    DISPUTE_DAYS: values.disputeDays || PROVIDER_DEFAULTS.disputeDays,
    VENUE_CITY_PROVINCE:
      values.venueCityProvince || PROVIDER_DEFAULTS.venueCityProvince,
    CLIENT_SIGNATORY_NAME:
      values.clientSignatoryName || values.clientContactName || "",
    CLIENT_SIGNATORY_TITLE:
      values.clientSignatoryTitle || "Owner / Authorized representative",
    INDUSTRY: values.industry || "",
    ADMIN_PATH: values.adminPath || "/admin/",
    HERO_DESCRIPTION: values.heroDescription || PROVIDER_DEFAULTS.heroDescription,
    SERVICES_DESCRIPTION:
      values.servicesDescription || PROVIDER_DEFAULTS.servicesDescription,
    ABOUT_DESCRIPTION: values.aboutDescription || PROVIDER_DEFAULTS.aboutDescription,
    FAQ_DESCRIPTION: values.faqDescription || PROVIDER_DEFAULTS.faqDescription,
    CONTACT_DESCRIPTION:
      values.contactDescription || PROVIDER_DEFAULTS.contactDescription,
    OTHER_SECTIONS: values.otherSections || PROVIDER_DEFAULTS.otherSections,
    ADMIN_MODULE_1: values.adminModule1 || PROVIDER_DEFAULTS.adminModule1,
    ADMIN_MODULE_1_DESC:
      values.adminModule1Desc || PROVIDER_DEFAULTS.adminModule1Desc,
    ADMIN_MODULE_2: values.adminModule2 || PROVIDER_DEFAULTS.adminModule2,
    ADMIN_MODULE_2_DESC:
      values.adminModule2Desc || PROVIDER_DEFAULTS.adminModule2Desc,
    ADMIN_MODULE_3: values.adminModule3 || PROVIDER_DEFAULTS.adminModule3,
    ADMIN_MODULE_3_DESC:
      values.adminModule3Desc || PROVIDER_DEFAULTS.adminModule3Desc,
    EXCLUSION_1: values.exclusion1 || PROVIDER_DEFAULTS.exclusion1,
    EXCLUSION_2: values.exclusion2 || PROVIDER_DEFAULTS.exclusion2,
    ADDON_1_NAME: values.addon1Name || PROVIDER_DEFAULTS.addon1Name,
    ADDON_1_FEE: values.addon1Fee || PROVIDER_DEFAULTS.addon1Fee,
    ADDON_1_NOTES: values.addon1Notes || PROVIDER_DEFAULTS.addon1Notes,
  };
}

export function fillServiceAgreementTemplate(template, values) {
  const placeholders = agreementValuesToPlaceholders(values);
  let output = template;
  Object.entries(placeholders).forEach(([key, value]) => {
    const token = `{{${key}}}`;
    output = output.split(token).join(String(value ?? ""));
  });
  return output;
}

export function buildAgreementFilename(slug, ext = "md", date = new Date()) {
  const safeSlug = String(slug || "client")
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${safeSlug || "client"}-service-agreement-${formatIsoDate(date)}.${ext}`;
}

export function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function markdownToPrintableHtml(markdown, title = "Client Service Agreement") {
  const lines = markdown.split("\n");
  const htmlParts = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    htmlParts.push("<table>");
    tableRows.forEach((row, index) => {
      const tag = index === 0 ? "th" : "td";
      htmlParts.push(
        `<tr>${row.map((cell) => `<${tag}>${cell}</${tag}>`).join("")}</tr>`
      );
    });
    htmlParts.push("</table>");
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) return;
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((cell) => {
          let value = escapeHtml(cell.trim());
          value = value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
          value = value.replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2">$1</a>'
          );
          return value;
        });
      tableRows.push(cells);
      return;
    }

    if (inTable) flushTable();

    if (!trimmed) {
      htmlParts.push("<br />");
      return;
    }

    if (trimmed === "---") {
      htmlParts.push("<hr />");
      return;
    }

    let content = escapeHtml(trimmed);
    content = content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    if (trimmed.startsWith("# ")) {
      htmlParts.push(`<h1>${content.slice(2)}</h1>`);
      return;
    }
    if (trimmed.startsWith("## ")) {
      htmlParts.push(`<h2>${content.slice(3)}</h2>`);
      return;
    }
    if (trimmed.startsWith("### ")) {
      htmlParts.push(`<h3>${content.slice(4)}</h3>`);
      return;
    }
    if (trimmed.startsWith("#### ")) {
      htmlParts.push(`<h4>${content.slice(5)}</h4>`);
      return;
    }
    if (trimmed.startsWith("> ")) {
      htmlParts.push(`<blockquote>${content.slice(2)}</blockquote>`);
      return;
    }
    if (trimmed.startsWith("- ")) {
      htmlParts.push(`<p>• ${content.slice(2)}</p>`);
      return;
    }

    htmlParts.push(`<p>${content}</p>`);
  });

  if (inTable) flushTable();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Georgia, "Times New Roman", serif; color: #111; line-height: 1.55; max-width: 820px; margin: 2rem auto; padding: 0 1.5rem; }
    h1, h2, h3, h4 { font-family: Arial, Helvetica, sans-serif; line-height: 1.25; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.95rem; }
    th, td { border: 1px solid #ccc; padding: 0.45rem 0.6rem; vertical-align: top; text-align: left; }
    th { background: #f5f5f5; }
    hr { border: none; border-top: 1px solid #ccc; margin: 1.5rem 0; }
    blockquote { margin: 1rem 0; padding-left: 1rem; border-left: 3px solid #ccc; color: #444; }
    a { color: #00473e; }
    @media print { body { margin: 0; max-width: none; } }
  </style>
</head>
<body>
${htmlParts.join("\n")}
</body>
</html>`;
}

function escapeXml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wTextRuns(text) {
  const parts = [];
  const pattern = /(\*\*(.+?)\*\*)/g;
  let lastIndex = 0;
  let match;
  const source = String(text ?? "");
  while ((match = pattern.exec(source)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        `<w:r><w:t xml:space="preserve">${escapeXml(source.slice(lastIndex, match.index))}</w:t></w:r>`
      );
    }
    parts.push(
      `<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${escapeXml(match[2])}</w:t></w:r>`
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < source.length || !parts.length) {
    parts.push(
      `<w:r><w:t xml:space="preserve">${escapeXml(source.slice(lastIndex))}</w:t></w:r>`
    );
  }
  return parts.join("");
}

function wParagraph(text, { style = null, italic = false } = {}) {
  const pPr = [];
  if (style) pPr.push(`<w:pStyle w:val="${style}"/>`);
  const props = pPr.length ? `<w:pPr>${pPr.join("")}</w:pPr>` : "";
  if (italic) {
    return `<w:p>${props}<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
  }
  return `<w:p>${props}${wTextRuns(text)}</w:p>`;
}

function wTable(rows) {
  if (!rows.length) return "";
  const colCount = Math.max(...rows.map((row) => row.length));
  const width = Math.floor(9000 / Math.max(colCount, 1));
  const grid = Array.from({ length: colCount }, () => `<w:gridCol w:w="${width}"/>`).join("");
  const body = rows
    .map((cells, rowIndex) => {
      const padded = [...cells];
      while (padded.length < colCount) padded.push("");
      const cellXml = padded
        .map((cell) => {
          const shading =
            rowIndex === 0
              ? "<w:tcPr><w:shd w:val=\"clear\" w:fill=\"F5F5F5\"/></w:tcPr>"
              : "<w:tcPr/>";
          return `<w:tc>${shading}${wParagraph(cell)}</w:tc>`;
        })
        .join("");
      return `<w:tr>${cellXml}</w:tr>`;
    })
    .join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblBorders>
    <w:top w:val="single" w:sz="4" w:color="CCCCCC"/>
    <w:left w:val="single" w:sz="4" w:color="CCCCCC"/>
    <w:bottom w:val="single" w:sz="4" w:color="CCCCCC"/>
    <w:right w:val="single" w:sz="4" w:color="CCCCCC"/>
    <w:insideH w:val="single" w:sz="4" w:color="CCCCCC"/>
    <w:insideV w:val="single" w:sz="4" w:color="CCCCCC"/>
  </w:tblBorders></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${body}</w:tbl>`;
}

function markdownToWordBodyXml(markdown) {
  const lines = String(markdown || "").split("\n");
  const parts = [];
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    parts.push(wTable(tableRows));
    tableRows = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) return;
      tableRows.push(
        trimmed
          .slice(1, -1)
          .split("|")
          .map((cell) => cell.trim())
      );
      return;
    }

    if (tableRows.length) flushTable();

    if (!trimmed) {
      parts.push("<w:p/>");
      return;
    }
    if (trimmed === "---") {
      parts.push(
        '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="CCCCCC"/></w:pBdr></w:pPr></w:p>'
      );
      return;
    }

    let content = trimmed
      .replace(/^#+\s+/, "")
      .replace(/^>\s+/, "")
      .replace(/^-\s+/, "• ");
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

    if (trimmed.startsWith("# ")) {
      parts.push(wParagraph(content, { style: "Heading1" }));
      return;
    }
    if (trimmed.startsWith("## ")) {
      parts.push(wParagraph(content, { style: "Heading2" }));
      return;
    }
    if (trimmed.startsWith("### ") || trimmed.startsWith("#### ")) {
      parts.push(wParagraph(content, { style: "Heading3" }));
      return;
    }
    if (trimmed.startsWith("> ")) {
      parts.push(wParagraph(content, { italic: true }));
      return;
    }

    parts.push(wParagraph(content));
  });

  if (tableRows.length) flushTable();
  return parts.join("") || wParagraph("");
}

/**
 * Convert filled markdown agreement into a Word (.docx) Blob (OOXML via JSZip).
 * Avoids the `docx` npm package — CRA Babel cannot compile its modern syntax.
 */
export async function markdownToDocxBlob(markdown, title = "Client Service Agreement") {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${markdownToWordBodyXml(markdown)}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`;

  const now = new Date().toISOString();
  const core = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>${escapeXml(PROVIDER_DEFAULTS.providerLegalName)}</dc:creator>
  <cp:lastModifiedBy>${escapeXml(PROVIDER_DEFAULTS.providerSignatoryName)}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;

  const app = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>carlmanuel.com admin</Application>
</Properties>`;

  const zip = new JSZip();
  zip.file("[Content_Types].xml", contentTypes);
  zip.folder("_rels").file(".rels", rels);
  zip.folder("word").file("document.xml", documentXml);
  zip.folder("word").folder("_rels").file("document.xml.rels", docRels);
  zip.folder("docProps").file("core.xml", core);
  zip.folder("docProps").file("app.xml", app);

  return zip.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export function downloadBlobFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function generateServiceAgreementDownloads(values, template) {
  const source = template || (await fetchServiceAgreementTemplate());
  const markdown = fillServiceAgreementTemplate(source, values);
  const title = `${values.businessName || "Client"} — Service Agreement`;
  const html = markdownToPrintableHtml(markdown, title);
  const docxBlob = await markdownToDocxBlob(markdown, title);

  return {
    markdown,
    html,
    docxBlob,
    mdFilename: buildAgreementFilename(values.slug, "md"),
    htmlFilename: buildAgreementFilename(values.slug, "html"),
    docxFilename: buildAgreementFilename(values.slug, "docx"),
  };
}

/**
 * Turn printable full-document HTML into an <article> fragment for API / sign page.
 * Sign page and signed-notify email embed this inside a host layout (not a full document).
 */
export function extractAgreementArticleHtml(printableHtml) {
  const source = String(printableHtml || "").trim();
  if (!source) return "";

  const bodyMatch = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const inner = (bodyMatch ? bodyMatch[1] : source).trim();
  if (!inner) return "";
  if (/^<article[\s>]/i.test(inner)) return inner;
  return `<article class="service-agreement">${inner}</article>`;
}

const CLIENT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidClientEmail(email) {
  return CLIENT_EMAIL_RE.test(String(email || "").trim());
}

/**
 * Build POST /admin/agreements body from form values + filled HTML.
 */
export function buildAgreementSendPayload(values, filledHtml) {
  const clientName =
    String(values?.clientSignatoryName || "").trim() ||
    String(values?.clientContactName || "").trim() ||
    String(values?.clientLegalName || "").trim() ||
    String(values?.businessName || "").trim();

  return {
    slug: String(values?.slug || "").trim(),
    businessName: String(values?.businessName || "").trim(),
    clientEmail: String(values?.clientEmail || "").trim().toLowerCase(),
    clientName,
    formJson: { ...(values || {}) },
    filledHtml: String(filledHtml || ""),
  };
}

export function recalcAmountFields(values, quotedAmount) {
  const { deposit, balance, total } = splitDepositBalance(quotedAmount);
  return {
    ...values,
    quotedAmount: total || quotedAmount,
    totalAmount: total || quotedAmount,
    depositAmount: deposit,
    balanceAmount: balance,
  };
}
