import { createFormOpenedAt, FORM_HONEYPOT_NAME, antiSpamPayload } from "./formAntiSpam";

describe("formAntiSpam", () => {
  test("createFormOpenedAt returns unix seconds", () => {
    const before = Math.floor(Date.now() / 1000);
    const opened = createFormOpenedAt();
    const after = Math.floor(Date.now() / 1000);
    expect(opened).toBeGreaterThanOrEqual(before);
    expect(opened).toBeLessThanOrEqual(after);
  });

  test("antiSpamPayload reads honeypot and openedAt", () => {
    const form = {
      elements: {
        namedItem: (name) =>
          name === FORM_HONEYPOT_NAME ? { value: "" } : null,
      },
    };
    expect(antiSpamPayload(form, 1700000000)).toEqual({
      website: "",
      formOpenedAt: 1700000000,
    });
  });
});
