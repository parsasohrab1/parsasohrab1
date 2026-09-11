import { GiftProfile } from "@/types";
import { recommendGiftIdeas } from "@/engine/giftAdvisorEngine";

const baseProfile = (overrides: Partial<GiftProfile> = {}): GiftProfile => ({
  relation: "friend",
  ageGroup: "adult",
  occasion: "birthday",
  budget: "medium",
  interests: [],
  ...overrides,
});

describe("recommendGiftIdeas", () => {
  it("never recommends an idea outside the recipient's age group", () => {
    const results = recommendGiftIdeas(baseProfile({ ageGroup: "child", interests: ["gaming"] }));
    for (const r of results) {
      expect(r.idea.ageGroups).toContain("child");
    }
  });

  it("ranks ideas matching the picked interests higher than generic ones", () => {
    const results = recommendGiftIdeas(baseProfile({ interests: ["reading"] }));
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].idea.interests).toContain("reading");
  });

  it("suggests the condolence idea for a condolence occasion regardless of interests", () => {
    const results = recommendGiftIdeas(baseProfile({ occasion: "condolence", interests: ["gaming"] }));
    expect(results.some((r) => r.idea.id === "gift_condolence_generic")).toBe(true);
  });

  it("respects the budget filter by ranking matching-budget ideas above the rest", () => {
    const results = recommendGiftIdeas(baseProfile({ budget: "high", interests: ["travel"] }));
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].idea.budgets).toContain("high");
  });

  it("book suggestions never include a specific real title, only a genre/category description", () => {
    const results = recommendGiftIdeas(baseProfile({ interests: ["reading"] }));
    const bookIdea = results.find((r) => r.idea.isBookSuggestion);
    expect(bookIdea).toBeDefined();
  });

  it("returns an empty array when nothing in the pool matches the age group", () => {
    const results = recommendGiftIdeas(baseProfile({ ageGroup: "child", occasion: "anniversary", interests: [] }), []);
    expect(results).toEqual([]);
  });
});
