import { PersonalityTrait, SocialRelation, SocialStrategy } from "@/types";

/**
 * Hand-written, general social-situations guidance — not a real read
 * of anyone's personality (see DISCLAIMERS.socialAdvisorLimitations).
 */
export const ALL_RELATIONS: SocialRelation[] = ["mother", "father", "sibling", "spouse", "in_law", "friend", "coworker", "other"];

export const TRAIT_INSIGHTS: Record<PersonalityTrait, { fa: string; en: string }> = {
  generous: { fa: "دست‌ودل‌باز است و کمک‌کردن برایش نوعی ابراز محبت است", en: "is generous, and helping is one of the ways they show love" },
  frugal: { fa: "به مسائل مالی و برنامه‌ریزی حساس است", en: "is careful and planning-focused about money" },
  controlling: { fa: "تمایل دارد تصمیم‌ها را هدایت کند — معمولاً از سر نگرانی، نه بدخواهی", en: "tends to steer decisions — usually from worry, not ill intent" },
  flexible: { fa: "معمولاً انعطاف‌پذیر است و راحت‌تر کنار می‌آید", en: "is usually flexible and easier to reach agreement with" },
  traditional: { fa: "دیدگاه‌هایش ریشه در ارزش‌ها و آداب سنتی دارد", en: "holds views rooted in traditional values and customs" },
  modern: { fa: "به دیدگاه‌های جدید و متفاوت بازتر است", en: "is more open to new and different perspectives" },
  emotional: { fa: "واکنش‌های احساسی قوی‌تری نشان می‌دهد", en: "tends to have stronger emotional reactions" },
  calm: { fa: "معمولاً آرام و منطقی برخورد می‌کند", en: "usually approaches things calmly and logically" },
};

const strategy = (
  id: string,
  relations: SocialRelation[],
  scenarios: SocialStrategy["scenarios"],
  traits: PersonalityTrait[],
  personalityFa: string,
  personalityEn: string,
  adviceFa: string,
  adviceEn: string
): SocialStrategy => ({
  id,
  relations,
  scenarios,
  traits,
  personalityNote: { fa: personalityFa, en: personalityEn },
  advice: { fa: adviceFa, en: adviceEn },
});

export const SOCIAL_STRATEGIES: SocialStrategy[] = [
  strategy(
    "soc_generous_financial",
    ["mother", "father", "in_law"],
    ["financial_boundary", "generosity_conflict"],
    ["generous"],
    "به‌نظر می‌رسد این شخص دست‌ودل‌باز است و پیشنهاد کمک مالی، برایش نوعی ابراز محبت است — نه اصرار بی‌جا.",
    "This person seems generous, and offering financial help is their way of showing love — not overstepping.",
    "با قدردانی از سخاوتش، مرز خودت را هم روشن بگو؛ مثلاً دربارهٔ هزینهٔ جهیزیه: «ممنونم که همیشه حواستون به ماست، ولی این بار ترجیح می‌دیم خودمون از پسش بربیایم — اگه لازم شد، حتماً روی کمکتون حساب می‌کنیم.» این‌طوری هم سخاوتش را رد نکرده‌ای، هم مرزت را گفته‌ای.",
    "Acknowledge their generosity while still stating your own boundary — for example, about trousseau costs: \"Thank you for always looking out for us, but this time we'd rather handle it ourselves — if we need help, we'll definitely count on you.\" That way you're not rejecting their generosity, just stating your boundary."
  ),
  strategy(
    "soc_frugal_financial",
    ["mother", "father", "in_law"],
    ["financial_boundary", "generosity_conflict"],
    ["frugal"],
    "این شخص احتمالاً به مسائل مالی حساس و برنامه‌ریزی‌محور است.",
    "This person is likely careful and planning-focused about money.",
    "به‌جای درخواست مستقیم کمک مالی یا رد پیشنهادش، روی برنامه‌ریزی و توجیه منطقی هزینه تمرکز کن؛ نشان بده این هزینه حساب‌شده است، نه ولخرجی — این با ارزش‌های او هم‌خوانی دارد.",
    "Instead of directly asking for financial help or flatly rejecting their input, focus on the planning and logic behind the expense — showing it's calculated, not wasteful, aligns with what they value."
  ),
  strategy(
    "soc_controlling_decision",
    ["mother", "father", "in_law", "spouse"],
    ["decision_disagreement", "unsolicited_advice", "boundary_setting"],
    ["controlling"],
    "رفتار کنترل‌گرانه معمولاً از نگرانی زیاد یا عادت به تصمیم‌گیری برای دیگران می‌آید، نه لزوماً بدخواهی.",
    "Controlling behavior usually comes from deep worry or a habit of deciding for others, not necessarily ill will.",
    "با قاطعیت آرام مرز بگذار: «می‌دونم نگرانمی و این نشونهٔ محبتته، ولی این تصمیم رو من می‌گیرم.» تکرار آرام و بدون دعوا، معمولاً مؤثرتر از توجیه طولانی است.",
    "Set the boundary with calm firmness: \"I know you're worried and that's your way of caring, but this is my decision to make.\" Calm repetition without arguing usually works better than a long justification."
  ),
  strategy(
    "soc_flexible_decision",
    ["mother", "father", "sibling", "spouse", "friend", "in_law", "coworker", "other"],
    ["decision_disagreement"],
    ["flexible"],
    "این شخص معمولاً انعطاف‌پذیر است و راحت‌تر با نظر متفاوت کنار می‌آید.",
    "This person is usually flexible and adapts more easily to a different opinion.",
    "می‌توانی صادقانه دیدگاهت را مطرح کنی؛ احتمال زیاد بدون تنش زیاد به یک توافق مشترک می‌رسید.",
    "You can state your view honestly — you're likely to reach an agreement without much friction."
  ),
  strategy(
    "soc_traditional_expectation",
    ["mother", "father", "in_law"],
    ["family_expectation", "unsolicited_advice"],
    ["traditional"],
    "دیدگاه‌های این شخص احتمالاً ریشه در ارزش‌ها و آداب سنتی دارد.",
    "This person's views likely stem from traditional values and customs.",
    "به‌جای رد مستقیم انتظارش، اول ارزشی که پشت حرفش هست را تأیید کن، بعد نسخهٔ خودت را به‌عنوان یک راه دیگر (نه رد کامل سنت) مطرح کن.",
    "Instead of directly rejecting their expectation, first acknowledge the value behind it, then offer your own approach as another path — not a rejection of tradition."
  ),
  strategy(
    "soc_modern_expectation",
    ["mother", "father", "sibling", "friend"],
    ["family_expectation", "unsolicited_advice"],
    ["modern"],
    "این شخص نسبتاً به دیدگاه‌های جدید بازتر است.",
    "This person is relatively open to new perspectives.",
    "می‌توانی دیدگاه متفاوتت را با استدلال روشن مطرح کنی؛ احتمال بیشتری هست که با منطق قانع شود.",
    "You can present your different view with clear reasoning — they're more likely to be persuaded by logic."
  ),
  strategy(
    "soc_emotional_conflict",
    ["mother", "father", "sibling", "spouse", "friend", "in_law", "coworker", "other"],
    ["decision_disagreement", "boundary_setting", "generosity_conflict"],
    ["emotional"],
    "این شخص واکنش‌های احساسی قوی‌تری نشان می‌دهد.",
    "This person tends to have stronger emotional reactions.",
    "پیش از مطرح‌کردن مرز یا مخالفت، حس خوب و ارزشش برایت را تأیید کن و با لحن گرم صحبت کن؛ لحن تند می‌تواند واکنش احساسی بیشتری ایجاد کند.",
    "Before stating a boundary or disagreement, acknowledge how much they matter to you and use a warm tone — a sharp tone can trigger a stronger emotional reaction."
  ),
  strategy(
    "soc_calm_conflict",
    ["mother", "father", "sibling", "spouse", "friend", "in_law", "coworker", "other"],
    ["decision_disagreement", "boundary_setting"],
    ["calm"],
    "این شخص معمولاً آرام و منطقی برخورد می‌کند.",
    "This person usually approaches things calmly and logically.",
    "می‌توانی مستقیم و شفاف صحبت کنی؛ احتمالاً بدون تنش زیاد گفتگو خواهید کرد.",
    "You can speak directly and clearly — the conversation is likely to stay low-tension."
  ),
  strategy(
    "soc_unsolicited_advice_generic",
    ["mother", "father", "sibling", "in_law", "friend", "coworker", "other"],
    ["unsolicited_advice"],
    [],
    "هر کسی که نصیحت ناخواسته می‌دهد، معمولاً از سر دلسوزی این کار را می‌کند، حتی اگر لحنش سنگین باشد.",
    "Someone giving unsolicited advice is usually doing it out of concern, even if the tone feels heavy.",
    "با تشکر از دلسوزی‌اش، روشن بگو تصمیم نهایی را خودت می‌گیری: «ممنون که نگرانمی، فکر می‌کنم رو این موضوع تصمیم خودمو گرفتم.»",
    "Thank them for caring, then clearly state that the final decision is yours: \"Thanks for worrying about me — I think I've made my decision on this.\""
  ),
  strategy(
    "soc_boundary_setting_generic",
    ["mother", "father", "sibling", "spouse", "in_law", "friend", "coworker", "other"],
    ["boundary_setting"],
    [],
    "مرزگذاری سالم دربارهٔ رفتار خودت است، نه سرزنش طرف مقابل.",
    "Healthy boundary-setting is about your own needs, not blaming the other person.",
    "مرزها را با جمله‌های «من» بیان کن، نه با سرزنش: «من به این فضا نیاز دارم» بهتر از «تو همیشه زیادی دخالت می‌کنی» جواب می‌دهد.",
    "State boundaries with \"I\" statements, not blame: \"I need this space\" lands better than \"You always interfere too much.\""
  ),
  strategy(
    "soc_coworker_boundary_controlling",
    ["coworker"],
    ["boundary_setting", "unsolicited_advice", "decision_disagreement"],
    ["controlling"],
    "همکار کنترل‌گر معمولاً می‌خواهد کارها طبق روش خودش پیش برود، اغلب برای کاهش استرس خودش دربارهٔ نتیجهٔ کار.",
    "A controlling coworker usually wants things done their way, often to reduce their own stress about the outcome.",
    "روی حوزهٔ مسئولیت خودت واضح و حرفه‌ای صحبت کن: «این بخش رو من مدیریت می‌کنم، اگه نگرانی خاصی هست خوشحال می‌شم بشنوم.»",
    "Speak clearly and professionally about your own area of responsibility: \"I'm handling this part — happy to hear any specific concerns you have.\""
  ),
  strategy(
    "soc_friend_frugal_generosity",
    ["friend"],
    ["generosity_conflict", "financial_boundary"],
    ["frugal"],
    "این دوست احتمالاً به تعادل مالی در رابطه‌ها حساس است.",
    "This friend is likely sensitive to financial balance in relationships.",
    "دربارهٔ هزینه‌های مشترک شفاف و از قبل صحبت کن؛ برنامه‌ریزی روشن، احتمال دلخوری را کم می‌کند.",
    "Talk about shared costs clearly and in advance — clear planning reduces the chance of hurt feelings."
  ),
  strategy(
    "soc_spouse_decision_disagreement_generic",
    ["spouse"],
    ["decision_disagreement", "boundary_setting"],
    [],
    "در تصمیم‌های مشترک زناشویی، شنیده‌شدن معمولاً مهم‌تر از برنده‌شدن بحث است.",
    "In shared marital decisions, feeling heard usually matters more than winning the argument.",
    "قبل از ارائهٔ نظر خودت، نظر همسرت را کامل و بدون قطع‌کردن گوش کن؛ سپس دیدگاهت را با «من» بیان کن، نه با مقایسه یا سرزنش.",
    "Before stating your view, listen to your spouse's full opinion without interrupting; then share yours with \"I\" statements, not comparisons or blame."
  ),
  strategy(
    "soc_sibling_family_expectation",
    ["sibling"],
    ["family_expectation", "unsolicited_advice"],
    [],
    "انتظارهای خواهر/برادر معمولاً از عادت‌های مشترک دوران کودکی یا نقش خانوادگی می‌آید.",
    "Sibling expectations often come from shared childhood habits or family roles.",
    "به او یادآوری کن که نقش‌ها می‌توانند با گذر زمان تغییر کنند: «می‌دونم قبلاً این‌جوری بود، ولی الان دوست دارم اینطوری پیش بره.»",
    "Remind them that roles can shift over time: \"I know it used to be this way, but I'd like this to go differently now.\""
  ),
];
