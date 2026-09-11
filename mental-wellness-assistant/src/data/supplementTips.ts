import { SupplementTip } from "@/types";
import { DISCLAIMERS } from "./disclaimers";

/**
 * General lifestyle/wellness suggestions, intentionally NOT dosed or
 * framed as treatment for a diagnosed condition. Every tip carries the
 * same supplement disclaimer — never show one without the other.
 */
export const SUPPLEMENT_TIPS: SupplementTip[] = [
  {
    id: "tip_sleep_hygiene",
    conditionIds: ["insomnia", "depression", "gad", "burnout"],
    tip: {
      fa: "یک ساعت خواب ثابت داشته باشید، ۹۰ دقیقه قبل از خواب از صفحه‌نمایش دور شوید و اتاق را تاریک و خنک نگه دارید.",
      en: "Keep a consistent sleep schedule, avoid screens for 90 minutes before bed, and keep the room dark and cool.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_sunlight_vitd",
    conditionIds: ["depression", "burnout"],
    tip: {
      fa: "روزانه ۱۵ تا ۲۰ دقیقه در نور طبیعی روز قدم بزنید؛ نور طبیعی و ویتامین D در تنظیم خلق نقش دارند.",
      en: "Get 15-20 minutes of natural daylight daily; sunlight exposure and vitamin D play a role in mood regulation.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_magnesium_food",
    conditionIds: ["gad", "insomnia", "panic"],
    tip: {
      fa: "غذاهای غنی از منیزیم مثل اسفناج، بادام و موز را در برنامه غذایی‌تان بگنجانید؛ کمبود منیزیم گاهی با تنش عصبی مرتبط است.",
      en: "Include magnesium-rich foods like spinach, almonds, and bananas; low magnesium is sometimes linked with nervous tension.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_omega3",
    conditionIds: ["depression", "bipolar"],
    tip: {
      fa: "مصرف منابع امگا-۳ مثل ماهی چرب یا گردو دو تا سه بار در هفته، به‌عنوان یک عادت غذایی مفید عمومی توصیه می‌شود.",
      en: "Eating omega-3 sources like fatty fish or walnuts two to three times a week is a broadly recommended general dietary habit.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_hydration_caffeine",
    conditionIds: ["gad", "panic", "adhd"],
    tip: {
      fa: "مصرف کافئین را در بعدازظهر کاهش دهید و آب کافی بنوشید؛ کافئین زیاد می‌تواند علائم اضطراب و تپش قلب را تشدید کند.",
      en: "Cut back on afternoon caffeine and stay hydrated; excess caffeine can worsen anxiety and heart-racing symptoms.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_movement",
    conditionIds: ["burnout", "depression", "adhd", "gad"],
    tip: {
      fa: "۲۰ تا ۳۰ دقیقه فعالیت بدنی ملایم (مثل پیاده‌روی سریع) در بیشتر روزهای هفته می‌تواند به بهبود خلق و کاهش استرس کمک کند.",
      en: "20-30 minutes of light physical activity (like brisk walking) most days of the week can help improve mood and reduce stress.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
  {
    id: "tip_professional_referral",
    conditionIds: [
      "depression",
      "bipolar",
      "gad",
      "panic",
      "social_anxiety",
      "adhd",
      "ptsd",
      "ocd",
      "insomnia",
      "eating_disorder",
      "substance_use",
      "psychosis_spectrum",
      "autism_adult",
      "burnout",
    ],
    tip: {
      fa: "بهترین قدم بعدی، رزرو یک وقت ویزیت با روان‌پزشک یا روان‌شناس بالینی برای ارزیابی دقیق و برنامه درمانی مناسب شماست.",
      en: "The best next step is booking an appointment with a psychiatrist or clinical psychologist for a proper assessment and treatment plan.",
    },
    disclaimer: DISCLAIMERS.supplement,
  },
];

export const tipsForCondition = (conditionId: string): SupplementTip[] =>
  SUPPLEMENT_TIPS.filter((t) => t.conditionIds.includes(conditionId));
