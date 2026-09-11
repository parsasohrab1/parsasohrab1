import { GiftIdea, GiftProfile } from "@/types";
import { GIFT_IDEAS } from "@/data/giftIdeas";

const scoreIdea = (idea: GiftIdea, profile: GiftProfile): number => {
  let score = 0;
  if (idea.occasions.includes(profile.occasion)) score += 3;
  if (idea.budgets.includes(profile.budget)) score += 2;
  const interestOverlap = idea.interests.filter((i) => profile.interests.includes(i)).length;
  score += interestOverlap * 3;
  if (idea.interests.length === 0 && idea.occasions.includes(profile.occasion)) score += 1;
  return score;
};

export interface ScoredGiftIdea {
  idea: GiftIdea;
  score: number;
}

/** Age group is a hard filter (never suggest an adult-only idea for a
 *  child recipient); occasion/budget/interest overlap then ranks the
 *  rest. Synthetic dataset only — see DISCLAIMERS.giftAdvisorLimitations. */
export const recommendGiftIdeas = (
  profile: GiftProfile,
  pool: GiftIdea[] = GIFT_IDEAS,
  maxResults = 5
): ScoredGiftIdea[] =>
  pool
    .filter((idea) => idea.ageGroups.includes(profile.ageGroup))
    .map((idea) => ({ idea, score: scoreIdea(idea, profile) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
