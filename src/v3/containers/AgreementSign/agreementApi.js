import { mapping } from "../../../mapping";

/**
 * @param {string} token
 * @returns {string}
 */
export function publicAgreementUrl(token) {
  return `${mapping.agreementBase}/${encodeURIComponent(token)}`;
}

/**
 * @param {string} token
 * @returns {string}
 */
export function publicAgreementSignUrl(token) {
  return `${publicAgreementUrl(token)}/sign`;
}

/**
 * Pull inner body (or fragment) from admin-generated printable HTML documents.
 * @param {string} filledHtml
 * @returns {string}
 */
export function extractAgreementBodyHtml(filledHtml) {
  const raw = String(filledHtml || "").trim();
  if (!raw) return "";

  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  if (/^<!DOCTYPE/i.test(raw) || /^<html[\s>]/i.test(raw)) {
    const afterHead = raw.match(/<\/head>\s*([\s\S]*)/i);
    if (afterHead) {
      return afterHead[1]
        .replace(/<\/?html[^>]*>/gi, "")
        .replace(/<\/?body[^>]*>/gi, "")
        .trim();
    }
  }

  return raw;
}

/**
 * Render typed name as a PNG data URL when the canvas pad is empty.
 * @param {string} name
 * @returns {string}
 */
export function typedNameToSignatureDataUrl(name) {
  const text = String(name || "").trim();
  if (!text || typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 140;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111111";
  ctx.font = '52px "Segoe Script", "Brush Script MT", "Apple Chancery", cursive';
  ctx.textBaseline = "middle";
  ctx.fillText(text, 28, canvas.height / 2);
  return canvas.toDataURL("image/png");
}

/**
 * @param {Response} res
 * @returns {Promise<{ ok: boolean, status: number, message: string, data: object }>}
 */
async function parseEnvelope(res) {
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }

  const message =
    (json && typeof json.message === "string" && json.message) ||
    (res.ok ? "OK" : `Request failed (${res.status})`);
  const data = json && json.data && typeof json.data === "object" ? json.data : {};

  return {
    ok: res.ok,
    status: res.status,
    message,
    data,
  };
}

/**
 * @param {string} token
 */
export async function fetchPublicAgreement(token) {
  const res = await fetch(publicAgreementUrl(token), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return parseEnvelope(res);
}

/**
 * @param {string} token
 * @param {{ signatoryName: string, signatoryTitle?: string, signedAt?: string, signatureData: string }} payload
 */
export async function submitPublicAgreementSign(token, payload) {
  const res = await fetch(publicAgreementSignUrl(token), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signatoryName: payload.signatoryName,
      signatoryTitle: payload.signatoryTitle || "",
      signedAt: payload.signedAt || "",
      signatureData: payload.signatureData,
    }),
  });
  return parseEnvelope(res);
}
