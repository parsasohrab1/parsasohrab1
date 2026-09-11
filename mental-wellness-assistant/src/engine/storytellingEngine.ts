import { ChildAgeRange, ChildGender, Locale, NarrationStyle, Story } from "@/types";
import { STORIES, storiesForAge } from "@/data/storyCatalog";

export const AGE_RANGE_OPTIONS: { value: ChildAgeRange; label: { fa: string; en: string } }[] = [
  { value: "2-4", label: { fa: "۲ تا ۴ سال", en: "2-4 years" } },
  { value: "5-7", label: { fa: "۵ تا ۷ سال", en: "5-7 years" } },
  { value: "8-10", label: { fa: "۸ تا ۱۰ سال", en: "8-10 years" } },
  { value: "11-13", label: { fa: "۱۱ تا ۱۳ سال", en: "11-13 years" } },
];

export const GENDER_OPTIONS: { value: ChildGender; label: { fa: string; en: string } }[] = [
  { value: "boy", label: { fa: "پسر", en: "Boy" } },
  { value: "girl", label: { fa: "دختر", en: "Girl" } },
  { value: "unspecified", label: { fa: "فرقی نمی‌کند", en: "Doesn't matter" } },
];

export const STYLE_OPTIONS: { value: NarrationStyle; label: { fa: string; en: string } }[] = [
  { value: "motherly", label: { fa: "مادرانه و مهربان", en: "Warm & motherly" } },
  { value: "normal", label: { fa: "معمولی و ساده", en: "Plain & everyday" } },
];

const NAME_POOL: Record<ChildGender, string[]> = {
  boy: ["کاوه", "آرش", "پارسا", "سام"],
  girl: ["کیمیا", "ترانه", "آوا", "نیلا"],
  unspecified: ["مهربون کوچولو", "قهرمان کوچولوی ما", "دوست کوچولوی ما"],
};

export const pickProtagonistName = (gender: ChildGender): string => {
  const pool = NAME_POOL[gender];
  return pool[Math.floor(Math.random() * pool.length)];
};

export { storiesForAge };

const substituteName = (text: string, name: string): string => text.replace(/\{\{NAME\}\}/g, name);

export const renderTitle = (story: Story, locale: Locale, name: string): string =>
  substituteName(story.title[locale], name);

export const renderParagraph = (story: Story, index: number, locale: Locale, name: string): string | null => {
  const paragraph = story.paragraphs[index - 1];
  if (!paragraph) return null;
  return substituteName(paragraph[locale], name);
};

export const renderMoral = (story: Story, locale: Locale, name: string): string =>
  substituteName(story.moral[locale], name);

// ---- Free-text interpretation for the conversational setup wizard -----

/** Persian number words a young child is more likely to say out loud
 *  than a bare digit (e.g. "پنج سالمه" rather than "5 سالمه"). */
const FA_NUMBER_WORDS: Record<string, number> = {
  "دو": 2,
  "سه": 3,
  "چهار": 4,
  "پنج": 5,
  "شش": 6,
  "هفت": 7,
  "هشت": 8,
  "نه": 9,
  "ده": 10,
  "یازده": 11,
  "دوازده": 12,
  "سیزده": 13,
};

const ageRangeForNumber = (n: number): ChildAgeRange => {
  if (n <= 4) return "2-4";
  if (n <= 7) return "5-7";
  if (n <= 10) return "8-10";
  return "11-13";
};

export const matchAgeRangeFromText = (text: string): ChildAgeRange | null => {
  const t = text.toLowerCase();
  const digits = t.match(/\d+/);
  if (digits) return ageRangeForNumber(parseInt(digits[0], 10));

  // Tokenize (rather than substring-search) so a short number word like
  // "ده" (10) can't falsely match inside an unrelated longer word.
  const words = t.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  for (const word of words) {
    if (word in FA_NUMBER_WORDS) return ageRangeForNumber(FA_NUMBER_WORDS[word]);
  }

  const hit = AGE_RANGE_OPTIONS.find(
    (o) => t.includes(o.label.fa.toLowerCase()) || t.includes(o.label.en.toLowerCase())
  );
  return hit?.value ?? null;
};

export const matchGenderFromText = (text: string): ChildGender | null => {
  const t = text.toLowerCase();
  if (t.includes("پسر") || t.includes("boy")) return "boy";
  if (t.includes("دختر") || t.includes("girl")) return "girl";
  if (t.includes("فرق") || t.includes("مهم نیست") || t.includes("matter") || t.includes("either")) return "unspecified";
  return null;
};

export const matchStyleFromText = (text: string): NarrationStyle | null => {
  const t = text.toLowerCase();
  if (t.includes("مادر") || t.includes("مهربان") || t.includes("motherly") || t.includes("warm")) return "motherly";
  if (t.includes("معمولی") || t.includes("عادی") || t.includes("ساده") || t.includes("normal") || t.includes("plain")) {
    return "normal";
  }
  return null;
};

// ---- Narration framing lines --------------------------------------------

export const introLine = (style: NarrationStyle, locale: Locale, name: string, title: string): string => {
  if (locale === "fa") {
    return style === "motherly"
      ? `عزیز دلم ${name}، بیا کنارم بشین تا برایت قصه‌ی «${title}» را با تمام مهربانی‌ام بگویم.`
      : `باشه، این «${title}» است. بریم شروع کنیم.`;
  }
  return style === "motherly"
    ? `Come here, sweet ${name} — let me tell you the story of "${title}" with all my love.`
    : `Alright, here's "${title}". Let's get started.`;
};

export const outroLine = (style: NarrationStyle, locale: Locale, name: string, moral: string): string => {
  if (locale === "fa") {
    return style === "motherly"
      ? `قصه تمام شد، عزیزم. ${moral} حالا وقت خواب است، ${name} کوچولو. شب بخیر و خواب‌های شیرین.`
      : `قصه تمام شد. ${moral} همین بود.`;
  }
  return style === "motherly"
    ? `And that's the end, my love. ${moral} It's time to sleep now, little ${name}. Goodnight and sweet dreams.`
    : `That's the end of the story. ${moral} All done.`;
};

export { STORIES };
