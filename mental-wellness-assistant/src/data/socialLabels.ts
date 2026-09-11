import { PersonalityTrait, SocialRelation } from "@/types";

/**
 * Shared display labels for the social-advisor domain, reused by
 * SocialAdvisorScreen, FamilyCircleScreen, and familyCircleEngine.ts
 * so a saved family-circle person and a social-advisor situation
 * speak the same vocabulary.
 */
export const RELATION_LABEL: Record<SocialRelation, { fa: string; en: string }> = {
  mother: { fa: "مادر", en: "Mother" },
  father: { fa: "پدر", en: "Father" },
  sibling: { fa: "خواهر/برادر", en: "Sibling" },
  spouse: { fa: "همسر", en: "Spouse" },
  in_law: { fa: "خانوادهٔ همسر", en: "In-law" },
  friend: { fa: "دوست", en: "Friend" },
  coworker: { fa: "همکار", en: "Coworker" },
  other: { fa: "شخص دیگر", en: "Someone else" },
};

export const TRAIT_LABEL: Record<PersonalityTrait, { fa: string; en: string }> = {
  generous: { fa: "دست‌ودل‌باز", en: "Generous" },
  frugal: { fa: "محتاط با پول", en: "Frugal" },
  controlling: { fa: "کنترل‌گر", en: "Controlling" },
  flexible: { fa: "انعطاف‌پذیر", en: "Flexible" },
  traditional: { fa: "سنتی", en: "Traditional" },
  modern: { fa: "امروزی", en: "Modern" },
  emotional: { fa: "احساساتی", en: "Emotional" },
  calm: { fa: "آرام", en: "Calm" },
};
