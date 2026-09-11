import { Recipe, RecipeSearchQuery, RecipeStep } from "@/types";
import { RECIPES } from "@/data/recipeCatalog";
import { matchStepCommand } from "./voiceCommands";

export { matchStepCommand };

/**
 * Searches the local recipe catalog by cuisine and/or free text (title,
 * description, ingredients). Same "local now, real API later" shape as
 * engine/musicSearchEngine.ts — swap this for a real recipe API
 * (Spoonacular, Edamam, …) without touching the screens that call it.
 */
export const searchRecipes = (query: RecipeSearchQuery): Recipe[] => {
  return RECIPES.filter((recipe) => {
    if (query.cuisineId && recipe.cuisineId !== query.cuisineId) return false;
    if (query.text && query.text.trim()) {
      const needle = query.text.trim().toLowerCase();
      const haystack = [
        recipe.title.fa,
        recipe.title.en,
        recipe.description.fa,
        recipe.description.en,
        ...recipe.ingredients.map((i) => `${i.fa} ${i.en}`),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
};

export const getStep = (recipe: Recipe, index: number): RecipeStep | null =>
  recipe.steps.find((s) => s.index === index) ?? null;

export const isLastStep = (recipe: Recipe, index: number): boolean => index >= recipe.steps.length;
