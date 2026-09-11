import { PersonalityTrait, SocialSituationProfile, SocialStrategy } from "@/types";
import { SOCIAL_STRATEGIES, TRAIT_INSIGHTS } from "@/data/socialStrategies";

const scoreStrategy = (strategy: SocialStrategy, profile: SocialSituationProfile): number => {
  let score = 0;
  if (strategy.relations.includes(profile.relation)) score += 3;
  if (strategy.scenarios.includes(profile.scenario)) score += 3;
  for (const trait of profile.traits) {
    if (strategy.traits.includes(trait)) score += 2;
  }
  return score;
};

export interface ScoredSocialStrategy {
  strategy: SocialStrategy;
  score: number;
}

/** Matches strategies against the profile; relation+scenario must both
 *  be at least somewhat relevant (score > 0), best matches first. */
export const recommendStrategies = (
  profile: SocialSituationProfile,
  pool: SocialStrategy[] = SOCIAL_STRATEGIES,
  maxResults = 3
): ScoredSocialStrategy[] =>
  pool
    .map((strategy) => ({ strategy, score: scoreStrategy(strategy, profile) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

/** Builds a short, honest "here's how this person seems" sentence from
 *  the traits the USER picked — never an inference about a real
 *  person the app has no access to. Empty list -> null (nothing to say). */
export const personalityInsight = (traits: PersonalityTrait[], locale: "fa" | "en"): string | null => {
  if (traits.length === 0) return null;
  const clauses = traits.map((t) => TRAIT_INSIGHTS[t][locale]);
  if (locale === "fa") {
    return `به‌نظر می‌رسد این شخص ${clauses.join(" و ")}.`;
  }
  return `This person seems to be someone who ${clauses.join(", and ")}.`;
};
