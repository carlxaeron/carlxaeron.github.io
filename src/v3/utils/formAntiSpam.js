/**
 * Shared anti-spam helpers for Contact / Quote forms.
 * Honeypot + formOpenedAt (unix seconds) for server time-trap.
 */

export const FORM_HONEYPOT_NAME = "website";
export const FORM_MIN_SECONDS = 3;

export function createFormOpenedAt() {
  return Math.floor(Date.now() / 1000);
}

/** Payload fields to merge into contact/quotation POST bodies. */
export function antiSpamPayload(form, formOpenedAt) {
  const honeypot =
    form?.elements?.namedItem?.(FORM_HONEYPOT_NAME)?.value ??
    form?.[FORM_HONEYPOT_NAME]?.value ??
    "";
  return {
    [FORM_HONEYPOT_NAME]: typeof honeypot === "string" ? honeypot : "",
    formOpenedAt: formOpenedAt || createFormOpenedAt(),
  };
}
