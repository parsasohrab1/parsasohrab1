/**
 * Centralized disclaimer strings. Any screen that shows a screening score,
 * a supplement tip, or a crisis response MUST render the matching string
 * from here — do not paraphrase inline, so a single place controls the
 * legal/clinical framing of the whole app.
 */
export const DISCLAIMERS = {
  screeningResult: {
    fa: "این یک ابزار خودارزیابی غیرتشخیصی است، نه یک آزمون بالینی رسمی. درصدهای نشان‌داده‌شده صرفاً «شاخص احتمال» هستند و جایگزین ارزیابی روان‌پزشک یا روان‌شناس بالینی نمی‌شوند. برای تشخیص قطعی حتماً به متخصص مراجعه کنید.",
    en: "This is a non-diagnostic self-report tool, not a formal clinical exam. The percentages shown are only a rough likelihood indicator and do not replace assessment by a licensed psychiatrist or clinical psychologist. Please consult a professional for an actual diagnosis.",
  },
  supplement: {
    fa: "این موارد توصیه‌های عمومی سبک زندگی هستند، نه نسخه پزشکی. پیش از مصرف هر مکمل یا تغییر دارو، حتماً با پزشک یا داروساز خود مشورت کنید.",
    en: "These are general lifestyle suggestions, not a medical prescription. Consult your physician or pharmacist before taking any supplement or changing medication.",
  },
  crisisNotSubstitute: {
    fa: "این دستیار جایگزین کمک اورژانسی نیست. اگر خودتان یا فرد دیگری در خطر فوری هستید، همین حالا با اورژانس یا خط بحران تماس بگیرید.",
    en: "This assistant is not a substitute for emergency help. If you or someone else is in immediate danger, contact emergency services or a crisis line right now.",
  },
  neuroMotorReferral: {
    fa: "علائم حرکتی/عصبی مثل لرزش، کندی حرکت یا سفتی عضلات (مانند آنچه در بیماری پارکینسون دیده می‌شود) نیازمند معاینه فیزیکی توسط متخصص مغز و اعصاب هستند و از طریق پرسش‌وپاسخ صوتی قابل غربالگری نیستند. لطفاً در اسرع وقت به پزشک مراجعه کنید.",
    en: "Motor/neurological symptoms such as tremor, slowed movement, or muscle rigidity (as seen in Parkinson's disease) require an in-person exam by a neurologist and cannot be screened through voice Q&A. Please see a physician promptly.",
  },
  general: {
    fa: "این برنامه یک اسکلت (scaffold) نمایشی با داده‌های ساختگی (synthetic) است و برای استفاده بالینی واقعی طراحی نشده است.",
    en: "This app is a demo scaffold using synthetic data and is not designed for real clinical use.",
  },
} as const;
