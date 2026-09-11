import { CareerMilestone, CareerMindsetAnswer, CareerPath } from "@/types";

/**
 * Hand-written career-coaching content — no live job-board connection,
 * no real resume generation. See DISCLAIMERS.careerCoachLimitations.
 */
export const MINDSET_QUESTIONS: { id: string; prompt: { fa: string; en: string }; employeeOption: { fa: string; en: string }; entrepreneurOption: { fa: string; en: string } }[] = [
  {
    id: "security_vs_upside",
    prompt: { fa: "کدوم برات جذاب‌تره؟", en: "Which is more appealing to you?" },
    employeeOption: { fa: "حقوق ثابت و امنیت شغلی", en: "A steady salary and job security" },
    entrepreneurOption: { fa: "درآمد نامطمئن ولی پتانسیل رشد بالا", en: "Uncertain income but high growth potential" },
  },
  {
    id: "instructions_vs_direction",
    prompt: { fa: "کدوم بیشتر بهت حس خوب می‌ده؟", en: "Which feels better to you?" },
    employeeOption: { fa: "دنبال‌کردن دستورالعمل روشن با مسئولیت مشخص", en: "Following clear instructions with defined responsibilities" },
    entrepreneurOption: { fa: "طراحی مسیر خودم و تصمیم‌گیری مستقل", en: "Designing my own path and deciding independently" },
  },
  {
    id: "risk_tolerance",
    prompt: { fa: "با ریسک چطوری؟", en: "How do you feel about risk?" },
    employeeOption: { fa: "ترجیح می‌دم ریسک کم باشه", en: "I prefer to keep risk low" },
    entrepreneurOption: { fa: "برای فرصت بزرگ‌تر از ریسک‌کردن نمی‌ترسم", en: "I don't mind risk for a bigger opportunity" },
  },
];

/** entrepreneur if the majority of answers lean that way (>=2 of 3). */
export const inferMindsetFromAnswers = (answers: CareerMindsetAnswer[]): "employee" | "entrepreneur" => {
  const entrepreneurCount = answers.filter((a) => a.leansEntrepreneur).length;
  return entrepreneurCount >= 2 ? "entrepreneur" : "employee";
};

export const PATHS_BY_MINDSET: Record<"employee" | "entrepreneur", CareerPath[]> = {
  employee: ["resume_applications", "internship", "skill_building"],
  entrepreneur: ["freelancing", "business_startup", "skill_building"],
};

export const PATH_LABEL: Record<CareerPath, { fa: string; en: string }> = {
  resume_applications: { fa: "نوشتن رزومه و ارسال به شرکت‌ها", en: "Resume writing + sending applications" },
  internship: { fa: "کارآموزی و کارورزی", en: "Internships / apprenticeships" },
  skill_building: { fa: "مهارت‌افزایی", en: "Skill-building" },
  freelancing: { fa: "فریلنسری", en: "Freelancing" },
  business_startup: { fa: "راه‌اندازی کسب‌وکار", en: "Starting a business" },
};

const milestone = (id: string, fa: string, en: string): CareerMilestone => ({ id, label: { fa, en }, done: false });

export const MILESTONE_TEMPLATES: Record<CareerPath, CareerMilestone[]> = {
  resume_applications: [
    milestone("resume_1", "رزومه‌ات رو بنویس یا به‌روز کن", "Write or update your resume"),
    milestone("resume_2", "از یک نفر تو همون حوزه بازخورد بگیر", "Get feedback from someone in the field"),
    milestone("resume_3", "این هفته به ۵ شرکت درخواست بده", "Apply to 5 companies this week"),
    milestone("resume_4", "برای ۳ سؤال رایج مصاحبه جواب آماده کن", "Prepare answers for 3 common interview questions"),
    milestone("resume_5", "بعد از هر درخواست، پیگیری کن", "Follow up after each application"),
  ],
  internship: [
    milestone("intern_1", "فرصت‌های کارآموزی حوزه‌ات رو پیدا کن", "Search for internship openings in your field"),
    milestone("intern_2", "۳ برنامه رو برای درخواست انتخاب کن", "Shortlist 3 programs to apply to"),
    milestone("intern_3", "یک معرفی کوتاه از خودت آماده کن", "Prepare a short intro about yourself"),
    milestone("intern_4", "به گزینهٔ اول درخواست بده", "Apply to your top pick"),
    milestone("intern_5", "از شبکهٔ آشنایانت دربارهٔ فرصت‌ها بپرس", "Ask your network about openings"),
  ],
  skill_building: [
    milestone("skill_1", "یک مهارت مرتبط با هدفت رو انتخاب کن", "Pick one skill directly relevant to your goal"),
    milestone("skill_2", "یک منبع رایگان یا مقرون‌به‌صرفه پیدا کن", "Find one free/affordable resource to learn it"),
    milestone("skill_3", "یک زمان هفتگی ثابت برای تمرین بذار", "Set a weekly practice time"),
    milestone("skill_4", "یک پروژهٔ کوچک با اون مهارت بساز", "Build one small project using the skill"),
    milestone("skill_5", "اون رو به رزومه یا نمونه‌کارت اضافه کن", "Add it to your resume/portfolio"),
  ],
  freelancing: [
    milestone("free_1", "یک خدمت مشخص که همین الان می‌تونی ارائه بدی رو انتخاب کن", "Pick one service you can offer today"),
    milestone("free_2", "یک پروفایل تو یک پلتفرم فریلنسری بساز", "Set up a profile on one freelance platform"),
    milestone("free_3", "قیمت شروع کارت رو مشخص کن", "Set your starting price"),
    milestone("free_4", "به ۳ مشتری بالقوه پیام بده یا یک نمونه‌کار منتشر کن", "Reach out to 3 potential clients or post 1 portfolio piece"),
    milestone("free_5", "اولین پروژهٔ کوچکت رو تحویل بده", "Deliver your first small project"),
  ],
  business_startup: [
    milestone("biz_1", "مشکلی که ایده‌ات حل می‌کنه رو در یک جمله بنویس", "Write your idea's problem in one sentence"),
    milestone("biz_2", "با ۳ مشتری بالقوه دربارهٔ ایده صحبت کن", "Talk to 3 potential customers about it"),
    milestone("biz_3", "ساده‌ترین نسخهٔ قابل‌ارائه (MVP) رو مشخص کن", "List your minimum viable version"),
    milestone("biz_4", "هزینهٔ شروع کار رو تخمین بزن", "Estimate your starting costs"),
    milestone("biz_5", "یک هدف مشخص برای ۳۰ روز آینده بذار", "Set one concrete goal for the next 30 days"),
  ],
};

export const JOURNAL_PROMPTS_EMPLOYEE: { fa: string; en: string }[] = [
  { fa: "امروز چه قدمی برای پیدا کردن شغل برداشتی؟", en: "What step did you take today toward finding a job?" },
];
export const JOURNAL_PROMPTS_ENTREPRENEUR: { fa: string; en: string }[] = [
  { fa: "امروز چه قدمی برای کسب‌وکار یا فریلنسری‌ات برداشتی؟", en: "What step did you take today for your business or freelancing?" },
];
