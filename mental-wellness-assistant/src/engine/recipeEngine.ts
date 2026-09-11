import { Recipe, RecipeSearchQuery, RecipeStep, StepCommand } from "@/types";
import { RECIPES } from "@/data/recipeCatalog";

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

/**
 * Interprets a step-advance utterance (voice transcript or typed text,
 * Persian or English) so the cooking guide can react to "بعدی" / "next",
 * "تکرار کن" / "repeat", "قبلی" / "previous", or "تمام کن" / "stop"
 * without the user needing to phrase it exactly.
 */
const NEXT_PHRASES = ["بعدی", "انجام دادم", "انجام شد", "تمام شد", "next", "done", "finished", "ok", "okay"];
const REPEAT_PHRASES = ["تکرار", "دوباره بگو", "دوباره", "repeat", "again", "say again"];
const PREVIOUS_PHRASES = ["قبلی", "برگرد", "previous", "back", "go back"];
const STOP_PHRASES = ["توقف", "تمام کن", "کافیه", "stop", "cancel", "quit", "exit"];

export const matchStepCommand = (text: string): StepCommand => {
  const t = text.trim().toLowerCase();
  if (!t) return "unknown";
  if (STOP_PHRASES.some((p) => t.includes(p))) return "stop";
  if (REPEAT_PHRASES.some((p) => t.includes(p))) return "repeat";
  if (PREVIOUS_PHRASES.some((p) => t.includes(p))) return "previous";
  if (NEXT_PHRASES.some((p) => t.includes(p))) return "next";
  return "unknown";
};
