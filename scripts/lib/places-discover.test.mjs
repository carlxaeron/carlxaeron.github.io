import assert from "node:assert/strict";
import test from "node:test";
import {
  GOVERNMENT_TYPES,
  isAlreadyClient,
  isGovernmentPlace,
  normalizeWebsite,
  pickTypesForDay,
  rankProspects,
  scoreProspect,
  slugifyBusinessName,
  loadPlacesApiKey,
  normalizeLegacyPlace,
} from "./places-discover.mjs";

test("slugifyBusinessName normalizes names", () => {
  assert.equal(slugifyBusinessName("Ohana Business & Café"), "ohana-business-and-cafe");
});

test("isGovernmentPlace uses types and name heuristics", () => {
  assert.equal(
    isGovernmentPlace({ types: ["local_government_office"], displayName: { text: "City Hall" } }),
    true
  );
  assert.equal(
    isGovernmentPlace({ types: ["restaurant"], displayName: { text: "Barangay Hall Canteen" } }),
    true
  );
  assert.equal(
    isGovernmentPlace({ types: ["cafe"], displayName: { text: "Bean There Cafe" } }),
    false
  );
  assert.ok(GOVERNMENT_TYPES.has("police"));
});

test("scoreProspect prefers no website", () => {
  const noWeb = scoreProspect({ websiteUri: null, rating: 4, userRatingCount: 40 });
  const withWeb = scoreProspect(
    { websiteUri: "https://example.com", rating: 4, userRatingCount: 40 },
    { hasHttps: true, hasViewport: true, loadMs: 800 }
  );
  assert.ok(noWeb > withWeb);
  assert.equal(scoreProspect({ types: ["city_hall"], displayName: { text: "X" } }), 0);
});

test("normalizeWebsite accepts bare hosts", () => {
  assert.equal(normalizeWebsite("example.com"), "https://example.com/");
  assert.equal(normalizeWebsite(""), null);
});

test("isAlreadyClient matches slug and name", () => {
  const index = {
    bySlug: new Set(["extra-rice"]),
    byName: new Set(["extra rice trading"]),
    byHost: new Set(["oldsite.com"]),
  };
  assert.equal(
    isAlreadyClient({ displayName: { text: "Extra Rice Trading" } }, index),
    true
  );
  assert.equal(
    isAlreadyClient(
      { displayName: { text: "New Cafe" }, websiteUri: "https://www.oldsite.com/" },
      index
    ),
    true
  );
  assert.equal(isAlreadyClient({ displayName: { text: "Brand New Spa" } }, index), false);
});

test("rankProspects filters gov and existing and sorts by score", () => {
  const index = {
    bySlug: new Set(["known-cafe"]),
    byName: new Set(),
    byHost: new Set(),
  };
  const ranked = rankProspects(
    [
      {
        id: "1",
        displayName: { text: "Known Cafe" },
        types: ["cafe"],
        businessStatus: "OPERATIONAL",
      },
      {
        id: "2",
        displayName: { text: "City Hall Annex" },
        types: ["local_government_office"],
        businessStatus: "OPERATIONAL",
      },
      {
        id: "3",
        displayName: { text: "Fresh Bakery" },
        types: ["bakery"],
        businessStatus: "OPERATIONAL",
        userRatingCount: 55,
        rating: 4.2,
      },
      {
        id: "4",
        displayName: { text: "Closed Shop" },
        types: ["store"],
        businessStatus: "CLOSED_PERMANENTLY",
      },
    ],
    { existingIndex: index }
  );
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0].name, "Fresh Bakery");
  assert.ok(ranked[0].score >= 45);
});

test("pickTypesForDay is stable for a seed", () => {
  const a = pickTypesForDay(["a", "b", "c", "d"], 3, 20260811);
  const b = pickTypesForDay(["a", "b", "c", "d"], 3, 20260811);
  assert.deepEqual(a, b);
  assert.equal(a.length, 3);
});

test("loadPlacesApiKey accepts either env name", () => {
  assert.equal(loadPlacesApiKey({ GOOGLE_PLACE_API_KEY: " abc " }), "abc");
  assert.equal(loadPlacesApiKey({ GOOGLE_PLACES_API_KEY: "xyz" }), "xyz");
  assert.equal(loadPlacesApiKey({}), null);
});

test("normalizeLegacyPlace maps nearby JSON", () => {
  const p = normalizeLegacyPlace({
    place_id: "abc",
    name: "Test Cafe",
    vicinity: "Rodriguez",
    types: ["cafe"],
    rating: 4.1,
    user_ratings_total: 12,
    business_status: "OPERATIONAL",
  });
  assert.equal(p.id, "abc");
  assert.equal(p.displayName.text, "Test Cafe");
  assert.equal(p.userRatingCount, 12);
});
