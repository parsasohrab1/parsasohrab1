import { AnswerOption, ScreeningQuestion } from "@/types";

/**
 * Question bank for the adaptive voice screening flow.
 *
 * Wording is *inspired by* public-domain-style screening instruments
 * (PHQ-9, GAD-7, ASRS-v1.1, MDQ, PC-PTSD-5, ISI, SCOFF, CAGE-AID and
 * Columbia-Protocol-style safety questions), simplified for a spoken
 * conversational UI. This is NOT a certified reproduction of any single
 * licensed scale and must not be marketed as one.
 *
 * Flow (see engine/screeningEngine.ts):
 *  - CORE_QUESTION_IDS (quick mode) -> 5 questions, always asked in order.
 *  - CORE_QUESTION_IDS (full) -> 8 questions, always asked in order.
 *  - up to 2 more adaptive follow-ups chosen from FOLLOWUP_MAP based on
 *    which core cluster(s) scored highest -> total 5-10 questions.
 */

const FREQ: AnswerOption[] = [
  { label: { fa: "هرگز", en: "Never" }, value: 0 },
  { label: { fa: "گاهی اوقات", en: "Sometimes" }, value: 1 },
  { label: { fa: "اغلب اوقات", en: "Often" }, value: 2 },
  { label: { fa: "تقریباً همیشه", en: "Nearly every day" }, value: 3 },
];

const YES_SCALE: AnswerOption[] = [
  { label: { fa: "کاملاً نه", en: "Not at all" }, value: 0 },
  { label: { fa: "کمی", en: "A little" }, value: 1 },
  { label: { fa: "زیاد", en: "Quite a bit" }, value: 2 },
  { label: { fa: "بله، به‌شدت", en: "Yes, strongly" }, value: 3 },
];

export const QUESTIONS: ScreeningQuestion[] = [
  // ---- CORE (always asked, fixed order) -------------------------------
  {
    id: "core_depression",
    conditionId: "depression",
    stage: "core",
    text: {
      fa: "در دو هفته اخیر، چقدر احساس افت خلق، ناامیدی یا بی‌علاقگی به کارهایی که قبلاً لذت‌بخش بودند داشته‌اید؟",
      en: "Over the last two weeks, how often have you felt down, hopeless, or lost interest in things you used to enjoy?",
    },
    options: FREQ,
  },
  {
    id: "core_safety_1",
    conditionId: "suicide_risk",
    stage: "core",
    isSafetyItem: true,
    text: {
      fa: "آیا اخیراً به این فکر کرده‌اید که کاش زنده نبودید یا دلتان می‌خواست بخوابید و دیگر بیدار نشوید؟",
      en: "Have you recently thought you'd be better off not being alive, or wished you could go to sleep and not wake up?",
    },
    options: FREQ,
  },
  {
    id: "core_gad",
    conditionId: "gad",
    stage: "core",
    text: {
      fa: "چقدر نگرانی‌های مداوم و کنترل‌نشدنی درباره موضوعات مختلف زندگی‌تان داشته‌اید؟",
      en: "How much persistent, hard-to-control worry have you had about different areas of your life?",
    },
    options: FREQ,
  },
  {
    id: "core_adhd",
    conditionId: "adhd",
    stage: "core",
    text: {
      fa: "چقدر برایتان دشوار بوده که روی کارها تمرکز کنید، جزئیات را فراموش نکنید یا بی‌قراری نکنید؟",
      en: "How much trouble have you had focusing on tasks, forgetting details, or feeling restless?",
    },
    options: FREQ,
  },
  {
    id: "core_safety_2",
    conditionId: "suicide_risk",
    stage: "core",
    isSafetyItem: true,
    text: {
      fa: "آیا تا امروز به روش خاصی برای پایان‌دادن به زندگی‌تان فکر کرده یا برای آن برنامه‌ریزی کرده‌اید؟",
      en: "Have you had any specific thoughts or a plan about ending your life?",
    },
    options: FREQ,
  },
  {
    id: "core_insomnia",
    conditionId: "insomnia",
    stage: "core",
    text: {
      fa: "چقدر برای به‌خواب‌رفتن یا حفظ خواب مشکل داشته‌اید یا خوابتان بی‌کیفیت بوده؟",
      en: "How much trouble have you had falling asleep, staying asleep, or getting quality sleep?",
    },
    options: FREQ,
  },
  {
    id: "core_ptsd",
    conditionId: "ptsd",
    stage: "core",
    text: {
      fa: "آیا خاطرات ناخواسته یک اتفاق سخت یا آسیب‌زا در زندگی‌تان به‌طور مکرر به ذهنتان می‌آید یا از یادآوری آن اجتناب می‌کنید؟",
      en: "Do unwanted memories of a difficult or traumatic event keep coming back, or do you avoid reminders of it?",
    },
    options: FREQ,
  },
  {
    id: "core_neuro_motor",
    conditionId: "neuro_motor_referral",
    stage: "core",
    text: {
      fa: "آیا اخیراً متوجه لرزش دست در حالت استراحت، کندشدن حرکات روزمره یا سفتی غیرعادی عضلات شده‌اید؟",
      en: "Have you recently noticed a resting hand tremor, slowed everyday movements, or unusual muscle stiffness?",
    },
    options: YES_SCALE,
  },

  // ---- FOLLOW-UPS (asked adaptively, at most 2 total) ------------------
  {
    id: "followup_bipolar",
    conditionId: "bipolar",
    stage: "followup",
    text: {
      fa: "آیا دوره‌هایی داشته‌اید که چند روز پشت‌سرهم پرانرژی، کم‌نیاز به خواب و به‌طرز غیرعادی پرحرف یا تحریک‌پذیر بوده‌اید؟",
      en: "Have you had stretches of several days feeling unusually high-energy, needing little sleep, and being unusually talkative or irritable?",
    },
    options: YES_SCALE,
  },
  {
    id: "followup_eating",
    conditionId: "eating_disorder",
    stage: "followup",
    text: {
      fa: "آیا نگرانی شما درباره وزن یا شکل بدن به حدی رسیده که الگوی غذاخوردنتان را به‌طور ناسالم تغییر داده؟",
      en: "Has concern about your weight or body shape changed your eating patterns in an unhealthy way?",
    },
    options: YES_SCALE,
  },
  {
    id: "followup_panic",
    conditionId: "panic",
    stage: "followup",
    text: {
      fa: "آیا حملات ناگهانی ترس شدید همراه با تپش قلب، تنگی نفس یا احساس از دست‌دادن کنترل داشته‌اید؟",
      en: "Have you had sudden episodes of intense fear with a racing heart, shortness of breath, or a feeling of losing control?",
    },
    options: FREQ,
  },
  {
    id: "followup_social_anxiety",
    conditionId: "social_anxiety",
    stage: "followup",
    text: {
      fa: "چقدر از قضاوت‌شدن یا شرمنده‌شدن در موقعیت‌های اجتماعی می‌ترسید، طوری که از آن‌ها اجتناب می‌کنید؟",
      en: "How much do you fear being judged or embarrassed in social situations, to the point of avoiding them?",
    },
    options: FREQ,
  },
  {
    id: "followup_autism",
    conditionId: "autism_adult",
    stage: "followup",
    text: {
      fa: "آیا به‌شدت به روال‌ها و الگوهای ثابت وابسته‌اید و تغییر ناگهانی آن‌ها یا محرک‌های حسی (صدا، نور) شما را به‌شدت آزار می‌دهد؟",
      en: "Do you strongly rely on fixed routines, and does sudden change or sensory input (sound, light) strongly bother you?",
    },
    options: YES_SCALE,
  },
  {
    id: "followup_ocd",
    conditionId: "ocd",
    stage: "followup",
    text: {
      fa: "آیا افکار مزاحم و تکرارشونده‌ای دارید که برای کاهش اضطراب ناشی از آن‌ها مجبورید کاری را به‌طور تکراری انجام دهید؟",
      en: "Do you have intrusive, repetitive thoughts that push you to perform an action repeatedly to ease the anxiety they cause?",
    },
    options: YES_SCALE,
  },
  {
    id: "followup_substance",
    conditionId: "substance_use",
    stage: "followup",
    text: {
      fa: "آیا احساس کرده‌اید که باید مصرف الکل یا مواد خود را کم کنید، یا کسی درباره آن به شما نگرانی ابراز کرده؟",
      en: "Have you felt you should cut down on alcohol/substance use, or has someone expressed concern about it?",
    },
    options: YES_SCALE,
  },
  {
    id: "followup_burnout",
    conditionId: "burnout",
    stage: "followup",
    text: {
      fa: "چقدر از نظر هیجانی به‌خاطر فشار کاری یا مسئولیت‌های زندگی، خالی و فرسوده احساس می‌کنید؟",
      en: "How emotionally drained and exhausted do you feel because of work pressure or life responsibilities?",
    },
    options: FREQ,
  },
  {
    id: "followup_psychosis",
    conditionId: "psychosis_spectrum",
    stage: "followup",
    text: {
      fa: "آیا تجربه‌ای داشته‌اید که صداها یا چیزهایی را شنیده یا دیده باشید که دیگران آن‌ها را تجربه نمی‌کنند، یا احساس کنید کسی قصد آسیب‌رساندن به شما را دارد؟",
      en: "Have you experienced hearing or seeing things others don't, or felt strongly that someone intends to harm you?",
    },
    options: YES_SCALE,
  },
];

export const questionById = (id: string): ScreeningQuestion | undefined =>
  QUESTIONS.find((q) => q.id === id);

/** Fixed order of the always-asked core items in "full" mode. */
export const CORE_QUESTION_IDS_FULL: string[] = [
  "core_depression",
  "core_safety_1",
  "core_gad",
  "core_adhd",
  "core_safety_2",
  "core_insomnia",
  "core_ptsd",
  "core_neuro_motor",
];

/** Shortened core set for "quick" mode (5 questions, no follow-ups). */
export const CORE_QUESTION_IDS_QUICK: string[] = [
  "core_depression",
  "core_safety_1",
  "core_gad",
  "core_adhd",
  "core_safety_2",
];

/**
 * Maps a *core, scoreable* cluster to the follow-up question id(s) that
 * refine it into a more specific condition. Engine takes the first item
 * for the top-2 ranked clusters, and both items only when a single
 * cluster clearly dominates (see engine/screeningEngine.ts).
 */
export const FOLLOWUP_MAP: Record<string, string[]> = {
  depression: ["followup_bipolar", "followup_eating"],
  gad: ["followup_panic", "followup_social_anxiety"],
  adhd: ["followup_autism", "followup_ocd"],
  insomnia: ["followup_substance", "followup_burnout"],
  ptsd: ["followup_psychosis"],
};

/** Conditions that receive a real percentage score in results. */
export const SCOREABLE_CONDITION_IDS: string[] = [
  "depression",
  "gad",
  "adhd",
  "insomnia",
  "ptsd",
  "bipolar",
  "eating_disorder",
  "panic",
  "social_anxiety",
  "autism_adult",
  "ocd",
  "substance_use",
  "burnout",
  "psychosis_spectrum",
];
