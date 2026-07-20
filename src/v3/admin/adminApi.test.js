import {
  isOpenAgreementStatus,
  parseApiData,
  parsePaginatedList,
  pickOpenAgreement,
} from "./adminApi";

describe("adminApi helpers", () => {
  test("parseApiData unwraps Firebase-shaped responses", () => {
    expect(parseApiData({ status: 200, data: { ok: true } })).toEqual({ ok: true });
    expect(parseApiData({ data: [1, 2] })).toEqual([1, 2]);
    expect(parseApiData({ rows: [] })).toEqual({ rows: [] });
  });

  test("parsePaginatedList handles array and Laravel pagination", () => {
    expect(parsePaginatedList([{ id: 1 }])).toEqual({
      rows: [{ id: 1 }],
      meta: null,
    });

    expect(
      parsePaginatedList({
        data: [{ id: 2 }],
        current_page: 2,
        last_page: 5,
        total: 40,
      })
    ).toEqual({
      rows: [{ id: 2 }],
      meta: { currentPage: 2, lastPage: 5, total: 40 },
    });
  });

  test("isOpenAgreementStatus allows draft/sent/viewed only", () => {
    expect(isOpenAgreementStatus("sent")).toBe(true);
    expect(isOpenAgreementStatus("viewed")).toBe(true);
    expect(isOpenAgreementStatus("draft")).toBe(true);
    expect(isOpenAgreementStatus("signed")).toBe(false);
    expect(isOpenAgreementStatus("revoked")).toBe(false);
    expect(isOpenAgreementStatus("expired")).toBe(false);
  });

  test("pickOpenAgreement prefers newest open item from items envelope", () => {
    expect(
      pickOpenAgreement({
        items: [
          { id: 3, status: "signed" },
          { id: 2, status: "sent", signUrl: "https://carlmanuel.com/?sign=abc" },
          { id: 1, status: "viewed" },
        ],
      })
    ).toEqual({ id: 2, status: "sent", signUrl: "https://carlmanuel.com/?sign=abc" });

    expect(pickOpenAgreement({ items: [{ id: 1, status: "revoked" }] })).toBeNull();
  });
});
