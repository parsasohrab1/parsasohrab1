import { EmergencyCategory, EmergencyDetection } from "@/types";

/**
 * Keyword scan over a speech-to-text transcript (or typed text) — see
 * types.ts's note on ActiveListening scope for what this is and isn't.
 *
 * Checked in this order (most objectively life-threatening first):
 * medical -> fire -> police -> duress. The first category with a
 * matching phrase wins; this is a coarse heuristic for a demo scaffold,
 * not a validated safety-triage model.
 */
const MEDICAL_PHRASES: string[] = [
  "بیهوش",
  "سکته",
  "خون‌ریزی",
  "خونریزی",
  "نفسش بالا نمیاد",
  "نفس نمی‌کشه",
  "آمبولانس",
  "unconscious",
  "heart attack",
  "not breathing",
  "can't breathe",
  "bleeding",
  "call an ambulance",
  "ambulance",
];

const FIRE_PHRASES: string[] = [
  "آتیش",
  "آتش‌سوزی",
  "آتش سوزی",
  "داره می‌سوزه",
  "دود زیاده",
  "fire",
  "smoke",
  "it's burning",
  "burning smell",
];

const POLICE_PHRASES: string[] = [
  "پلیس",
  "دعوا",
  "نزاع",
  "دارن می‌زننم",
  "دارن میزنن",
  "چاقو",
  "اسلحه",
  "call the police",
  "he's hitting",
  "she's hitting",
  "someone's attacking",
  "weapon",
  "stabbing",
];

const DURESS_PHRASES: string[] = [
  "ولم کن",
  "دست بردار",
  "مجبورم نکن",
  "اذیتم نکن",
  "نمی‌تونم حرف بزنم",
  "تهدیدم نکن",
  "let me go",
  "leave me alone",
  "stop pressuring me",
  "get away from me",
  "stop threatening me",
];

const CATEGORY_PHRASES: { category: EmergencyCategory; phrases: string[] }[] = [
  { category: "medical", phrases: MEDICAL_PHRASES },
  { category: "fire", phrases: FIRE_PHRASES },
  { category: "police", phrases: POLICE_PHRASES },
  { category: "duress", phrases: DURESS_PHRASES },
];

export const detectEmergency = (transcript: string): EmergencyDetection | null => {
  const t = transcript.toLowerCase().trim();
  if (!t) return null;

  for (const { category, phrases } of CATEGORY_PHRASES) {
    const match = phrases.find((p) => t.includes(p.toLowerCase()));
    if (match) {
      return { category, matchedPhrase: match, transcript, detectedAt: new Date().toISOString() };
    }
  }
  return null;
};

const CATEGORY_LABEL: Record<EmergencyCategory, { fa: string; en: string }> = {
  police: { fa: "درگیری", en: "a fight" },
  fire: { fa: "آتش‌سوزی", en: "fire" },
  medical: { fa: "وضعیت پزشکی اورژانسی", en: "a medical emergency" },
  duress: { fa: "فشار یا اجبار", en: "pressure or coercion" },
};

/**
 * Builds a periodic check-in summary for a caregiving-monitoring use
 * case (e.g. checking in on a nanny/babysitter while a parent is
 * elsewhere). IMPORTANT — read before changing the wording: this can
 * only ever report what it counted and what keyword categories matched
 * in TRANSCRIBED SPEECH during the period. It cannot and does not
 * assess a caregiver's tone, warmth, or general behavior, and it cannot
 * hear non-verbal sounds like a child crying — doing that would need a
 * real audio-classification model, well outside this scaffold. Never
 * word this as "the nanny behaved well" or "the child was ignored" —
 * only as what was transcribed and matched, with that limitation stated
 * plainly every time.
 */
export const summarizeListeningPeriod = (
  transcriptCount: number,
  detections: EmergencyDetection[]
): { fa: string; en: string } => {
  const categories = Array.from(new Set(detections.map((d) => d.category)));

  const bodyFa =
    categories.length === 0
      ? `در این بازه ${transcriptCount} گفت‌وگو شنیده شد و هیچ عبارت نگران‌کننده‌ای در آن‌ها تشخیص داده نشد.`
      : `در این بازه ${transcriptCount} گفت‌وگو شنیده شد و عباراتی مرتبط با ${categories
          .map((c) => CATEGORY_LABEL[c].fa)
          .join("، ")} در آن‌ها تشخیص داده شد.`;
  const bodyEn =
    categories.length === 0
      ? `In this period, ${transcriptCount} exchanges were heard and no concerning phrase was detected in them.`
      : `In this period, ${transcriptCount} exchanges were heard, and phrases related to ${categories
          .map((c) => CATEGORY_LABEL[c].en)
          .join(", ")} were detected in them.`;

  const caveatFa =
    " این خلاصه فقط بر اساس جملاتی است که واضح گفته شده و به‌درستی به متن تبدیل شده‌اند؛ لحن صدا، گریهٔ کودک یا رفتار غیرکلامی را تشخیص نمی‌دهد و جایگزین حضور یا اعتماد واقعی نیست.";
  const caveatEn =
    " This summary is based only on sentences that were clearly spoken and correctly transcribed; it does not detect tone of voice, a child crying, or non-verbal behavior, and is not a substitute for real presence or trust.";

  return { fa: bodyFa + caveatFa, en: bodyEn + caveatEn };
};
