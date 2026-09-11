import { CompanionSuggestion, Mood, MoodLogEntry } from "@/types";
import { JOURNAL_ACKNOWLEDGMENTS, MOOD_REFLECTIONS, MOOD_SUGGESTIONS, pickRandom } from "@/data/companionResponses";

/** Picks one pre-written, mood-matched reflection line — see
 *  DISCLAIMERS.companionNotRealAI: this is a lookup, not understanding. */
export const reflectionForMood = (mood: Mood): { fa: string; en: string } => pickRandom(MOOD_REFLECTIONS[mood]);

export const suggestionsForMood = (mood: Mood): CompanionSuggestion[] => MOOD_SUGGESTIONS[mood] ?? [];

export const journalAcknowledgment = (): { fa: string; en: string } => pickRandom(JOURNAL_ACKNOWLEDGMENTS);

/** A short, honest summary of recent logged moods — counts only, no
 *  clinical interpretation. */
export const summarizeRecentMoods = (
  log: MoodLogEntry[],
  days = 7
): { totalEntries: number; mostCommonMood: Mood | null } => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = log.filter((e) => new Date(e.loggedAt).getTime() >= cutoff);
  if (recent.length === 0) return { totalEntries: 0, mostCommonMood: null };

  const counts = new Map<Mood, number>();
  for (const entry of recent) {
    counts.set(entry.mood, (counts.get(entry.mood) ?? 0) + 1);
  }
  let mostCommonMood: Mood | null = null;
  let max = 0;
  for (const [mood, count] of counts) {
    if (count > max) {
      max = count;
      mostCommonMood = mood;
    }
  }
  return { totalEntries: recent.length, mostCommonMood };
};

const GREETING_WITH_NAME = { fa: (name: string) => `سلام ${name} عزیز! خوشحالم که برگشتی.`, en: (name: string) => `Hi ${name}! I'm glad you're back.` };
const GREETING_NO_NAME = { fa: "سلام! خوشحالم که اینجایی.", en: "Hi! I'm glad you're here." };

export const greeting = (name: string | null, locale: "fa" | "en"): string =>
  name ? GREETING_WITH_NAME[locale](name) : locale === "fa" ? GREETING_NO_NAME.fa : GREETING_NO_NAME.en;
