import { ConditionDef } from "@/types";

/**
 * Condition catalog. Item wording throughout the question bank is
 * *inspired by* well-known public screening instruments (PHQ-9, GAD-7,
 * ASRS-v1.1, MDQ, PC-PTSD-5, ISI, SCOFF, CAGE-AID, Columbia-style safety
 * questions) but has been paraphrased/simplified for a conversational
 * voice UI and is NOT the validated instrument itself. Do not present
 * results as equivalent to the licensed scales.
 */
export const CONDITIONS: ConditionDef[] = [
  {
    id: "depression",
    category: "mood",
    name: { fa: "افسردگی", en: "Depression" },
    shortDescription: {
      fa: "افت خلق، بی‌علاقگی به فعالیت‌ها، خستگی مداوم",
      en: "Low mood, loss of interest, persistent fatigue",
    },
  },
  {
    id: "bipolar",
    category: "mood",
    name: { fa: "اختلال دوقطبی", en: "Bipolar Disorder" },
    shortDescription: {
      fa: "نوسان شدید بین دوره‌های پرانرژی/تحریک‌پذیر و دوره‌های افسردگی",
      en: "Swings between high-energy/irritable episodes and depressive episodes",
    },
  },
  {
    id: "gad",
    category: "anxiety",
    name: { fa: "اضطراب فراگیر", en: "Generalized Anxiety" },
    shortDescription: {
      fa: "نگرانی مداوم و کنترل‌نشدنی درباره موضوعات مختلف",
      en: "Persistent, hard-to-control worry across many topics",
    },
  },
  {
    id: "panic",
    category: "anxiety",
    name: { fa: "اختلال پانیک", en: "Panic Disorder" },
    shortDescription: {
      fa: "حملات ناگهانی ترس شدید همراه با علائم جسمی",
      en: "Sudden waves of intense fear with physical symptoms",
    },
  },
  {
    id: "social_anxiety",
    category: "anxiety",
    name: { fa: "اضطراب اجتماعی", en: "Social Anxiety" },
    shortDescription: {
      fa: "ترس شدید از قضاوت‌شدن در موقعیت‌های اجتماعی",
      en: "Intense fear of judgment in social situations",
    },
  },
  {
    id: "adhd",
    category: "attention",
    name: { fa: "نقص توجه/بیش‌فعالی (ADHD)", en: "ADHD" },
    shortDescription: {
      fa: "مشکل تمرکز، فراموشی، بی‌قراری از دوران کودکی",
      en: "Trouble focusing, forgetfulness, restlessness since childhood",
    },
  },
  {
    id: "ptsd",
    category: "trauma",
    name: { fa: "استرس پس از سانحه (PTSD)", en: "PTSD" },
    shortDescription: {
      fa: "یادآوری ناخواسته یک رویداد آسیب‌زا، اجتناب و برانگیختگی",
      en: "Intrusive memories of a traumatic event, avoidance, hyperarousal",
    },
  },
  {
    id: "ocd",
    category: "anxiety",
    name: { fa: "وسواس فکری-عملی (OCD)", en: "OCD" },
    shortDescription: {
      fa: "افکار مزاحم تکرارشونده و رفتارهای تکراری برای کاهش اضطراب",
      en: "Intrusive recurring thoughts and repetitive anxiety-reducing rituals",
    },
  },
  {
    id: "insomnia",
    category: "sleep_substance",
    name: { fa: "بی‌خوابی", en: "Insomnia" },
    shortDescription: {
      fa: "مشکل در به خواب رفتن یا حفظ خواب، خواب بی‌کیفیت",
      en: "Trouble falling/staying asleep, poor sleep quality",
    },
  },
  {
    id: "substance_use",
    category: "sleep_substance",
    name: { fa: "سوءمصرف مواد یا الکل", en: "Substance Use" },
    shortDescription: {
      fa: "استفاده از مواد/الکل که کنترل آن دشوار شده",
      en: "Substance/alcohol use that has become hard to control",
    },
  },
  {
    id: "eating_disorder",
    category: "eating",
    name: { fa: "اختلال خوردن", en: "Eating Disorder" },
    shortDescription: {
      fa: "نگرانی شدید درباره وزن/شکل بدن، الگوهای غذاخوردن ناسالم",
      en: "Severe concern about weight/shape, unhealthy eating patterns",
    },
  },
  {
    id: "psychosis_spectrum",
    category: "psychotic_spectrum",
    name: { fa: "تجربه‌های شبه‌روان‌پریشی", en: "Psychotic-Spectrum Experiences" },
    shortDescription: {
      fa: "شنیدن/دیدن چیزهایی که دیگران تجربه نمی‌کنند، بدگمانی شدید",
      en: "Hearing/seeing things others don't, marked suspiciousness",
    },
  },
  {
    id: "autism_adult",
    category: "neurodevelopmental",
    name: { fa: "طیف اوتیسم (بزرگسال)", en: "Adult Autism Spectrum" },
    shortDescription: {
      fa: "الگوهای ثابت رفتاری، حساسیت حسی، دشواری در تعامل اجتماعی",
      en: "Fixed behavioral patterns, sensory sensitivity, social-interaction difficulty",
    },
  },
  {
    id: "burnout",
    category: "stress",
    name: { fa: "فرسودگی شغلی/استرس مزمن", en: "Burnout / Chronic Stress" },
    shortDescription: {
      fa: "خستگی هیجانی مزمن مرتبط با فشار کاری یا زندگی",
      en: "Chronic emotional exhaustion tied to work/life pressure",
    },
  },
  {
    id: "suicide_risk",
    category: "safety",
    name: { fa: "ایمنی و خطر آسیب به خود", en: "Safety / Self-Harm Risk" },
    shortDescription: {
      fa: "همیشه پرسیده می‌شود؛ برای شناسایی نیاز فوری به کمک، نه امتیازدهی رقابتی",
      en: "Always asked; used for urgent-help detection, not a competing score",
    },
  },
  {
    id: "neuro_motor_referral",
    category: "safety",
    name: {
      fa: "علائم حرکتی/عصبی (مثل لرزش، کندی حرکت) — نیازمند ارجاع پزشکی",
      en: "Motor/neurological symptoms (e.g. tremor, slowed movement) — needs medical referral",
    },
    shortDescription: {
      fa: "بیماری‌هایی مثل پارکینسون عصبی‌-حرکتی هستند، نه روانی، و با پرسش‌وپاسخ صوتی قابل غربالگری نیستند. این دستیار فقط علائم هشدار را شناسایی و ارجاع می‌دهد.",
      en: "Conditions like Parkinson's are neuro-motor, not psychiatric, and cannot be screened by Q&A. This assistant only flags warning signs and refers to a physician.",
    },
    referralOnly: true,
  },
];

export const conditionById = (id: string): ConditionDef | undefined =>
  CONDITIONS.find((c) => c.id === id);
