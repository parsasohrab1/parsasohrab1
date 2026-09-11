import { StyleProfile, WardrobeItem } from "@/types";
import { recommendMakeupLooks, requiredFormalityForOccasion, suggestOutfit } from "@/engine/styleEngine";

const baseProfile = (overrides: Partial<StyleProfile> = {}): StyleProfile => ({
  occasion: "wedding",
  budget: "has_budget",
  applicationPreference: "professional",
  selfPhotoUri: null,
  ...overrides,
});

describe("requiredFormalityForOccasion", () => {
  it("maps occasions to a sensible default formality level", () => {
    expect(requiredFormalityForOccasion("wedding")).toBe("formal");
    expect(requiredFormalityForOccasion("formal_event")).toBe("formal");
    expect(requiredFormalityForOccasion("mourning")).toBe("formal");
    expect(requiredFormalityForOccasion("birthday")).toBe("semi_formal");
    expect(requiredFormalityForOccasion("everyday")).toBe("casual");
  });
});

describe("recommendMakeupLooks", () => {
  it("only returns looks matching occasion, budget, and application preference", () => {
    const looks = recommendMakeupLooks(baseProfile());
    expect(looks.length).toBeGreaterThan(0);
    for (const look of looks) {
      expect(look.occasions).toContain("wedding");
      expect(look.budgets).toContain("has_budget");
      expect(look.applicationPreferences).toContain("professional");
    }
  });

  it("always includes the no-makeup option for self application", () => {
    const looks = recommendMakeupLooks(baseProfile({ applicationPreference: "self", budget: "limited_budget" }));
    expect(looks.find((l) => l.id === "look_no_makeup")).toBeDefined();
  });

  it("puts the no-makeup option last rather than first", () => {
    const looks = recommendMakeupLooks(baseProfile({ applicationPreference: "self", budget: "limited_budget" }));
    const noMakeupIndex = looks.findIndex((l) => l.id === "look_no_makeup");
    expect(noMakeupIndex).toBe(looks.length - 1);
  });

  it("returns nothing when no occasion is set", () => {
    expect(recommendMakeupLooks(baseProfile({ occasion: null }))).toEqual([]);
  });
});

describe("suggestOutfit", () => {
  const item = (overrides: Partial<WardrobeItem>): WardrobeItem => ({
    id: Math.random().toString(36),
    photoUri: "file:///fake.jpg",
    category: "top",
    formality: "casual",
    colorNote: "",
    addedAt: new Date().toISOString(),
    ...overrides,
  });

  it("returns null when the wardrobe has nothing formal enough", () => {
    const wardrobe = [item({ category: "top", formality: "casual" })];
    expect(suggestOutfit("wedding", wardrobe)).toBeNull();
  });

  it("prefers a single dress over a separate top+bottom when both qualify", () => {
    const wardrobe = [
      item({ category: "dress", formality: "formal" }),
      item({ category: "top", formality: "formal" }),
      item({ category: "bottom", formality: "formal" }),
    ];
    const result = suggestOutfit("wedding", wardrobe);
    expect(result?.items.some((i) => i.category === "dress")).toBe(true);
    expect(result?.items.some((i) => i.category === "top")).toBe(false);
  });

  it("falls back to a lone top when there's no matching bottom or dress", () => {
    const wardrobe = [item({ category: "top", formality: "formal" })];
    const result = suggestOutfit("wedding", wardrobe);
    expect(result?.items.some((i) => i.category === "top")).toBe(true);
  });

  it("includes shoes when tagged formal enough", () => {
    const wardrobe = [
      item({ category: "dress", formality: "formal" }),
      item({ category: "shoes", formality: "formal" }),
    ];
    const result = suggestOutfit("wedding", wardrobe);
    expect(result?.items.some((i) => i.category === "shoes")).toBe(true);
  });

  it("never picks a casual-only item for a formal occasion", () => {
    const wardrobe = [
      item({ category: "dress", formality: "casual" }),
      item({ category: "dress", formality: "formal" }),
    ];
    const result = suggestOutfit("wedding", wardrobe);
    const dress = result?.items.find((i) => i.category === "dress");
    expect(dress?.formality).toBe("formal");
  });
});
