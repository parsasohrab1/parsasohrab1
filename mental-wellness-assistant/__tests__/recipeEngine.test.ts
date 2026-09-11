import { getStep, isLastStep, matchStepCommand, searchRecipes } from "@/engine/recipeEngine";
import { RECIPES } from "@/data/recipeCatalog";
import { CUISINES } from "@/data/cuisines";

describe("searchRecipes", () => {
  it("has at least one recipe for every listed cuisine", () => {
    for (const cuisine of CUISINES) {
      const results = searchRecipes({ cuisineId: cuisine.id });
      expect(results.length).toBeGreaterThan(0);
      expect(results.every((r) => r.cuisineId === cuisine.id)).toBe(true);
    }
  });

  it("filters by free text against title/description/ingredients", () => {
    const results = searchRecipes({ text: "miso" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === "rcp_japanese_miso_soup")).toBe(true);
  });

  it("returns everything when the query is empty", () => {
    expect(searchRecipes({}).length).toBe(RECIPES.length);
  });
});

describe("getStep / isLastStep", () => {
  const recipe = RECIPES[0];

  it("returns the step at a given 1-based index", () => {
    const step = getStep(recipe, 1);
    expect(step?.index).toBe(1);
  });

  it("returns null past the end of the recipe", () => {
    expect(getStep(recipe, recipe.steps.length + 1)).toBeNull();
  });

  it("knows the last step", () => {
    expect(isLastStep(recipe, recipe.steps.length)).toBe(true);
    expect(isLastStep(recipe, 1)).toBe(false);
  });
});

describe("matchStepCommand", () => {
  it("recognizes 'next' in Persian and English", () => {
    expect(matchStepCommand("بعدی")).toBe("next");
    expect(matchStepCommand("انجام دادم")).toBe("next");
    expect(matchStepCommand("next")).toBe("next");
    expect(matchStepCommand("done")).toBe("next");
  });

  it("recognizes 'repeat', 'previous', and 'stop'", () => {
    expect(matchStepCommand("تکرار کن")).toBe("repeat");
    expect(matchStepCommand("say again")).toBe("repeat");
    expect(matchStepCommand("قبلی")).toBe("previous");
    expect(matchStepCommand("go back")).toBe("previous");
    expect(matchStepCommand("تمام کن")).toBe("stop");
    expect(matchStepCommand("stop")).toBe("stop");
  });

  it("falls back to 'unknown' for unrelated text", () => {
    expect(matchStepCommand("امروز هوا خوب است")).toBe("unknown");
    expect(matchStepCommand("")).toBe("unknown");
  });
});
