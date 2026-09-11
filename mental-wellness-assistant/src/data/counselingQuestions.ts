import { AnswerOption, CounselingQuestion } from "@/types";

/**
 * Question bank for the marriage/relationship guidance flow.
 *
 * Scoring convention (kept consistent with the mental-health question
 * bank): every option is 0-3, and a HIGHER value always means MORE
 * concern/friction in that topic — never the reverse — so
 * engine/counselingEngine.ts can score topics uniformly.
 *
 * Flow: CORE questions (fixed order, filtered by the client's marital
 * status — a married-only or engaged-only item is skipped for the other
 * status) are always asked, including the safety item. Then a few
 * adaptive FOLLOWUP questions are chosen from whichever core topics
 * showed the most concern — see FOLLOWUP_MAP below.
 */

const CONCERN_SCALE: AnswerOption[] = [
  { label: { fa: "هرگز یا تقریباً هرگز", en: "Never or almost never" }, value: 0 },
  { label: { fa: "به‌ندرت", en: "Rarely" }, value: 1 },
  { label: { fa: "گاهی اوقات", en: "Sometimes" }, value: 2 },
  { label: { fa: "اغلب اوقات", en: "Often" }, value: 3 },
];

const SAFETY_SCALE: AnswerOption[] = [
  { label: { fa: "هرگز", en: "Never" }, value: 0 },
  { label: { fa: "فقط یک یا دو بار", en: "Only once or twice" }, value: 1 },
  { label: { fa: "چند بار", en: "Several times" }, value: 2 },
  { label: { fa: "به‌طور مکرر", en: "Repeatedly" }, value: 3 },
];

export const COUNSELING_QUESTIONS: CounselingQuestion[] = [
  // ---- CORE (always asked, filtered by marital status) -----------------
  {
    id: "cq_communication",
    topic: "communication",
    stage: "core",
    text: {
      fa: "چقدر پیش می‌آید که احساس کنید همسر/نامزدتان واقعاً حرف‌هایتان را نمی‌شنود یا بین‌تان سوءتفاهم پیش می‌آید؟",
      en: "How often do you feel your partner isn't really hearing you, or misunderstandings come up between you?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_trust",
    topic: "trust",
    stage: "core",
    text: {
      fa: "چقدر نگرانی، شک یا بی‌اعتمادی نسبت به همسر/نامزدتان دارید؟",
      en: "How much worry, doubt, or mistrust do you feel toward your partner?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_conflict",
    topic: "conflict",
    stage: "core",
    text: {
      fa: "وقتی بین‌تان اختلاف‌نظر پیش می‌آید، چقدر حل‌وفصل‌کردن آن سخت است و بحث‌ها بدون نتیجه می‌مانند؟",
      en: "When disagreements come up, how hard is it to resolve them without the argument going nowhere?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_safety",
    topic: "safety",
    stage: "core",
    isSafetyItem: true,
    text: {
      fa: "آیا همسر/نامزدتان تا به‌حال با تهدید، کنترل شدید (مثل منع‌کردن از دیدن خانواده یا دوستان) یا آسیب فیزیکی شما را ترسانده؟",
      en: "Has your partner ever frightened you with threats, severe control (like keeping you from seeing family or friends), or physical harm?",
    },
    options: SAFETY_SCALE,
  },
  {
    id: "cq_finances",
    topic: "finances",
    stage: "core",
    text: {
      fa: "چقدر دربارهٔ مسائل مالی (خرج‌کردن، پس‌انداز، تصمیم‌های اقتصادی) بین‌تان تنش یا اختلاف‌نظر وجود دارد؟",
      en: "How much tension or disagreement is there between you about money (spending, saving, financial decisions)?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_in_laws",
    topic: "in_laws",
    stage: "core",
    text: {
      fa: "چقدر رابطه با خانوادهٔ همسر/نامزدتان برایتان استرس‌زا یا چالش‌برانگیز است؟",
      en: "How stressful or challenging is your relationship with your partner's family?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_premarital_readiness",
    topic: "premarital_readiness",
    stage: "core",
    appliesTo: ["engaged"],
    text: {
      fa: "چقدر دربارهٔ آماده‌بودن خودتان یا نامزدتان برای شروع زندگی مشترک، تردید یا نگرانی دارید؟",
      en: "How much doubt or worry do you have about whether you or your fiancé(e) are ready to start married life?",
    },
    options: CONCERN_SCALE,
  },

  // ---- FOLLOW-UPS (asked adaptively) ------------------------------------
  {
    id: "cq_connection",
    topic: "connection",
    stage: "followup",
    text: {
      fa: "چقدر احساس می‌کنید بین شما دو نفر فاصلهٔ احساسی افتاده یا صمیمیت کمرنگ شده؟",
      en: "How much emotional distance do you feel has grown between you, or a fading sense of closeness?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_jealousy",
    topic: "jealousy",
    stage: "followup",
    text: {
      fa: "چقدر حسادت یا نگرانی بیش‌ازحد دربارهٔ روابط اجتماعی یکدیگر بین‌تان مشکل ایجاد می‌کند؟",
      en: "How much does jealousy or excessive worry about each other's social relationships cause problems between you?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_shared_decisions",
    topic: "shared_decisions",
    stage: "followup",
    appliesTo: ["married"],
    text: {
      fa: "چقدر در تصمیم‌های مهم زندگی مشترک احساس می‌کنید نظرتان به‌اندازهٔ کافی شنیده نمی‌شود؟",
      en: "In important shared-life decisions, how often do you feel your opinion isn't heard enough?",
    },
    options: CONCERN_SCALE,
  },
  {
    id: "cq_expectations",
    topic: "expectations",
    stage: "followup",
    text: {
      fa: "چقدر احساس می‌کنید انتظاراتتان از ازدواج یا زندگی مشترک با واقعیت فاصله دارد؟",
      en: "How much do you feel your expectations of marriage/shared life differ from reality?",
    },
    options: CONCERN_SCALE,
  },
];

export const counselingQuestionById = (id: string): CounselingQuestion | undefined =>
  COUNSELING_QUESTIONS.find((q) => q.id === id);

/** Fixed order of core questions, before status-based filtering. */
export const CORE_COUNSELING_QUESTION_IDS: string[] = [
  "cq_communication",
  "cq_trust",
  "cq_conflict",
  "cq_safety",
  "cq_finances",
  "cq_in_laws",
  "cq_premarital_readiness",
];

/** Maps a core, scoreable topic to the single follow-up question that
 *  refines it — see engine/counselingEngine.ts for the ranking logic. */
export const COUNSELING_FOLLOWUP_MAP: Record<string, string> = {
  communication: "cq_connection",
  trust: "cq_jealousy",
  finances: "cq_shared_decisions",
  in_laws: "cq_expectations",
};
