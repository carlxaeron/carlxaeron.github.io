import { parseApiData, parsePaginatedList } from "./adminApi";

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
});
