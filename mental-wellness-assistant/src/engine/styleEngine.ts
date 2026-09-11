import { FormalityLevel, MakeupLook, Occasion, StyleProfile, WardrobeItem } from "@/types";
import { MAKEUP_LOOKS } from "@/data/styleLooks";

/**
 * The dress-code level this app associates with each occasion, used to
 * pick wardrobe items. This is a simple, opinionated default — real
 * dress codes vary a lot by culture, family, and specific event, so
 * treat it as a starting suggestion, not a rule.
 */
export const requiredFormalityForOccasion = (occasion: Occasion): FormalityLevel => {
  switch (occasion) {
    case "wedding":
    case "formal_event":
    case "mourning":
      return "formal";
    case "birthday":
      return "semi_formal";
    case "everyday":
    default:
      return "casual";
  }
};

const matchesProfile = (look: MakeupLook, profile: StyleProfile): boolean => {
  if (!profile.occasion || !look.occasions.includes(profile.occasion)) return false;
  if (profile.budget && !look.budgets.includes(profile.budget)) return false;
  if (profile.applicationPreference && !look.applicationPreferences.includes(profile.applicationPreference)) {
    return false;
  }
  return true;
};

/** Returns the makeup looks matching the profile, "no makeup" option
 *  always last so it reads as an equally valid alternative, not the
 *  default pushed to the top. */
export const recommendMakeupLooks = (profile: StyleProfile): MakeupLook[] => {
  const matches = MAKEUP_LOOKS.filter((l) => matchesProfile(l, profile));
  return matches.sort((a, b) => (a.id === "look_no_makeup" ? 1 : b.id === "look_no_makeup" ? -1 : 0));
};

/**
 * Picks one wardrobe item per category (dress OR top+bottom, shoes,
 * optional outerwear/accessory) whose tagged formality is at or above
 * what the occasion calls for. Purely a filter over the tags the user
 * entered themselves — no image analysis (see types.ts's note on
 * StyleProfile scope).
 */
const FORMALITY_RANK: Record<FormalityLevel, number> = { casual: 0, semi_formal: 1, formal: 2 };

const bestItemFor = (items: WardrobeItem[], requiredRank: number): WardrobeItem | null => {
  const eligible = items.filter((i) => FORMALITY_RANK[i.formality] >= requiredRank);
  if (eligible.length === 0) return null;
  // Prefer the closest match rather than the most formal available.
  return [...eligible].sort((a, b) => FORMALITY_RANK[a.formality] - FORMALITY_RANK[b.formality])[0];
};

export const suggestOutfit = (
  occasion: Occasion,
  wardrobe: WardrobeItem[]
): { items: WardrobeItem[]; note: { fa: string; en: string } } | null => {
  const requiredRank = FORMALITY_RANK[requiredFormalityForOccasion(occasion)];

  const dress = bestItemFor(
    wardrobe.filter((i) => i.category === "dress"),
    requiredRank
  );
  const top = bestItemFor(
    wardrobe.filter((i) => i.category === "top"),
    requiredRank
  );
  const bottom = bestItemFor(
    wardrobe.filter((i) => i.category === "bottom"),
    requiredRank
  );
  const shoes = bestItemFor(
    wardrobe.filter((i) => i.category === "shoes"),
    requiredRank
  );
  const outerwear = bestItemFor(
    wardrobe.filter((i) => i.category === "outerwear"),
    requiredRank
  );
  const accessory = bestItemFor(
    wardrobe.filter((i) => i.category === "accessory"),
    requiredRank
  );

  // Prefer a single dress; otherwise fall back to whatever top/bottom
  // pieces are available (even just one of them, rather than dropping
  // both when only one half of the pair has been tagged).
  const topBottomOrDress = dress ? [dress] : [top, bottom].filter((i): i is WardrobeItem => !!i);
  const items = [...topBottomOrDress, shoes, outerwear, accessory].filter((i): i is WardrobeItem => !!i);

  if (items.length === 0) return null;

  const missing: string[] = [];
  if (!dress && !(top && bottom)) missing.push("یک لباس رسمی‌تر (پیراهن، یا بالاتنه و شلوار/دامن)");
  if (!shoes) missing.push("کفش مناسب");

  const noteFa =
    missing.length > 0
      ? `این ترکیب از چیزهایی که ثبت کرده‌اید ساخته شده؛ به نظر می‌رسد هنوز ${missing.join(" و ")} با درجهٔ رسمیت کافی برای این مناسبت ثبت نکرده‌اید.`
      : "این ترکیب بر اساس برچسب‌هایی که خودتان روی لباس‌هایتان زده‌اید انتخاب شده است.";
  const noteEn =
    missing.length > 0
      ? "This combination is built from what you've tagged; it looks like you haven't logged a formal-enough item for some pieces yet."
      : "This combination was picked based on the tags you added to your own clothes.";

  return { items, note: { fa: noteFa, en: noteEn } };
};

export { MAKEUP_LOOKS };
