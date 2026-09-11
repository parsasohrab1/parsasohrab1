import { AnsweredQuestion, CrisisAssessment } from "@/types";

/**
 * Crisis / self-harm risk detector. Runs on every answer (not only at the
 * end of a session) so the UI can interrupt the screening flow the
 * moment risk is detected — see state/SessionContext.tsx.
 *
 * Two independent signals, either one is enough to trigger:
 *  1. The two mandatory safety scale items (core_safety_1/2).
 *  2. Free-text the user typed (voice-to-text or the typing fallback),
 *     scanned for crisis phrases in Persian and English.
 *
 * This is a coarse heuristic for a demo scaffold, not a validated risk
 * model — a real deployment should have this reviewed by a clinician and
 * almost certainly involve human escalation, not just app UI.
 */

const CRISIS_KEYWORDS: string[] = [
  "خودکشی",
  "خودم رو بکشم",
  "خودمو بکشم",
  "نمی‌خوام زنده باشم",
  "نمیخوام زنده باشم",
  "می‌خوام بمیرم",
  "میخوام بمیرم",
  "دیگه نمی‌تونم ادامه بدم",
  "دیگه نمیتونم ادامه بدم",
  "خودزنی",
  "آسیب به خودم",
  "به خودم آسیب",
  "suicide",
  "kill myself",
  "end my life",
  "end it all",
  "hurt myself",
  "self harm",
  "self-harm",
  "want to die",
  "don't want to live",
  "dont want to live",
];

const normalize = (s: string): string => s.toLowerCase().trim();

const containsCrisisKeyword = (text: string): boolean => {
  const t = normalize(text);
  return CRISIS_KEYWORDS.some((k) => t.includes(normalize(k)));
};

const SAFETY_CONDITION_ID = "suicide_risk";

export const assessCrisis = (answers: AnsweredQuestion[]): CrisisAssessment => {
  const reasons: string[] = [];
  let severity: CrisisAssessment["severity"] = "none";

  const safetyAnswers = answers.filter((a) => a.conditionId === SAFETY_CONDITION_ID);
  for (const a of safetyAnswers) {
    if (a.value >= 2) {
      severity = "urgent";
      reasons.push("safety_scale_high");
    } else if (a.value === 1 && severity === "none") {
      severity = "watch";
      reasons.push("safety_scale_mild");
    }
  }

  const freeTextHits = answers
    .map((a) => a.freeText)
    .filter((t): t is string => !!t && containsCrisisKeyword(t));
  if (freeTextHits.length > 0) {
    severity = "urgent";
    reasons.push("free_text_keyword_match");
  }

  return { triggered: severity !== "none", reasons, severity };
};

/** Exposed separately so free-typed chat messages (outside the formal
 *  question flow) can also be screened in real time by the UI layer. */
export const textLooksLikeCrisis = containsCrisisKeyword;
