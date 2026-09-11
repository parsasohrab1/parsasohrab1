import { AddictionType, QuitPlanStep, QuitTrigger } from "@/types";

/**
 * Hand-written, general/educational quit-coaching content — no live
 * model, no personalized medical plan. See
 * DISCLAIMERS.quitCoachMedicalSupervision: for alcohol/drugs this is
 * deliberately generic and always paired with a "see a doctor" caution,
 * never a substitute for medical detox guidance.
 */
const step = (
  order: number,
  faTitle: string,
  enTitle: string,
  faAdvice: string,
  enAdvice: string
): QuitPlanStep => ({ order, title: { fa: faTitle, en: enTitle }, advice: { fa: faAdvice, en: enAdvice } });

export const BASE_STEPS: Record<AddictionType, QuitPlanStep[]> = {
  smoking: [
    step(
      1,
      "روز صفر را مشخص کن",
      "Pick a quit date",
      "یک تاریخ مشخص (نه لزوماً همین امروز) را برای شروع کاهش انتخاب کن؛ داشتن یک نقطهٔ شروع مشخص، انگیزه را واقعی‌تر می‌کند.",
      "Choose a specific date (not necessarily today) to start cutting back — having a concrete start line makes the intention feel real."
    ),
    step(
      2,
      "به‌جای قطع ناگهانی، کاهش تدریجی",
      "Reduce gradually, not all at once",
      "هر هفته تعداد نخ‌های روزانه را حدود ۲۰ درصد کم کن، به‌جای قطع یک‌بارهٔ کامل — نرخ موفقیت بلندمدت کاهش تدریجی برای بیشتر افراد بالاتر است.",
      "Cut your daily count by roughly 20% each week instead of stopping cold turkey — for most people, gradual reduction has a better long-term success rate."
    ),
    step(
      3,
      "محرک‌هایت را بشناس و جایگزین کن",
      "Know your triggers and swap them",
      "لحظه‌هایی را که معمولاً سیگار می‌کشی (بعد از غذا، با قهوه، موقع استرس) شناسایی کن و برای هرکدام یک جایگزین کوچک آماده کن (آدامس، پیاده‌روی کوتاه، نفس عمیق).",
      "Identify the moments you usually smoke (after meals, with coffee, when stressed) and have a small substitute ready for each one (gum, a short walk, a deep breath)."
    ),
    step(
      4,
      "با روزهای لغزش مهربان باش",
      "Be kind to yourself on slip-up days",
      "اگر یک روز دوباره کشیدی، این یعنی شکست کامل نیست؛ همان روز بعد دوباره از همان‌جا ادامه بده، نه از صفر با احساس گناه.",
      "If you smoke again on some day, that's not total failure — pick right back up the next day, not from zero and not with guilt."
    ),
    step(
      5,
      "برای علائم ترک آماده باش",
      "Be ready for withdrawal symptoms",
      "بی‌قراری، تحریک‌پذیری یا میل شدید در چند هفتهٔ اول طبیعی است و معمولاً با گذشت زمان کم می‌شود؛ نوشیدن آب کافی و خواب منظم کمک‌کننده‌اند.",
      "Restlessness, irritability, or strong cravings are normal in the first few weeks and usually fade with time; staying hydrated and keeping a regular sleep schedule help."
    ),
  ],
  alcohol: [
    step(
      1,
      "قبل از هر چیز، با پزشک مشورت کن",
      "Talk to a doctor before anything else",
      "اگر مصرف روزانه یا سنگین داری، کاهش یا قطع ناگهانی می‌تواند خطرناک باشد؛ حتماً پیش از شروع هر برنامه‌ای با پزشک یا مرکز ترک اعتیاد مشورت کن.",
      "If you drink daily or heavily, cutting back or stopping suddenly can be dangerous — please consult a physician or an addiction-treatment center before starting any plan."
    ),
    step(
      2,
      "الگوی مصرفت را یادداشت کن",
      "Track your drinking pattern",
      "چند روز مصرف واقعی‌ات (نه آنچه فکر می‌کنی) را بدون قضاوت یادداشت کن — این تصویر واقعی، پایهٔ هر برنامهٔ کاهش خوبی است.",
      "Write down your actual drinking for a few days (not what you assume it is), without judgment — this honest picture is the basis of any good reduction plan."
    ),
    step(
      3,
      "روزهای بدون الکل را برنامه‌ریزی کن",
      "Schedule alcohol-free days",
      "چند روز مشخص در هفته را به‌عنوان «روز بدون الکل» تعیین کن و کم‌کم تعدادشان را زیاد کن.",
      "Set specific days of the week as \"alcohol-free days\" and gradually increase how many there are."
    ),
    step(
      4,
      "موقعیت‌های پرخطر را از قبل برنامه‌ریزی کن",
      "Plan ahead for high-risk situations",
      "برای مهمانی‌ها یا جمع‌های دوستانه از قبل فکر کن چه بگویی یا چه نوشیدنی جایگزینی سفارش بدهی.",
      "For parties or social gatherings, decide in advance what to say or what non-alcoholic drink to order."
    ),
    step(
      5,
      "علائم هشدار را بشناس",
      "Know the warning signs",
      "لرزش دست، تعریق شدید، تپش قلب یا اضطراب شدید بعد از کاهش مصرف می‌تواند نشانهٔ ترک جسمی خطرناک باشد — در این حالت فوراً به پزشک مراجعه کن.",
      "Hand tremors, heavy sweating, a racing heart, or severe anxiety after cutting back can signal dangerous physical withdrawal — see a doctor immediately if this happens."
    ),
  ],
  drugs: [
    step(
      1,
      "قبل از هر چیز، حمایت پزشکی پیدا کن",
      "Find medical support before anything else",
      "بسیاری از مواد (اپیوئیدها، بنزودیازپین‌ها و برخی دیگر) ترک جسمی خطرناکی دارند؛ اولین قدم واقعی، تماس با پزشک یا مرکز ترک اعتیاد دارای مجوز است، نه تلاش انفرادی.",
      "Many substances (opioids, benzodiazepines, and others) carry dangerous physical withdrawal — the real first step is contacting a physician or a licensed treatment center, not going it alone."
    ),
    step(
      2,
      "صادقانه با یک متخصص صحبت کن",
      "Be honest with a professional",
      "دقیق‌ترین اطلاعات را (نوع ماده، مقدار، تناوب مصرف) با پزشک یا مشاور در میان بگذار تا برنامهٔ ایمن مناسب حالت خودت طراحی شود.",
      "Share the most accurate information (substance, amount, frequency) with a doctor or counselor so a safe plan can be designed for your specific situation."
    ),
    step(
      3,
      "یک شبکهٔ حمایتی بساز",
      "Build a support network",
      "به یک نفر قابل‌اعتماد (خانواده، دوست، یا گروه حمایتی) بگو در حال تلاش برای ترک هستی — تنها بودن در این مسیر ریسک بازگشت را بالا می‌برد.",
      "Tell someone you trust (family, a friend, or a support group) that you're trying to quit — going through this alone raises the risk of relapse."
    ),
    step(
      4,
      "از موقعیت‌ها و افراد پرخطر فاصله بگیر",
      "Distance yourself from high-risk people and places",
      "تا جایی که می‌توانی، از مکان‌ها یا افرادی که مصرف را یادآوری یا تشویق می‌کنند دوری کن، حداقل در ماه‌های اول.",
      "As much as you can, stay away from places or people that remind you of or encourage use, at least in the first few months."
    ),
    step(
      5,
      "برنامه‌ای برای لحظه‌های بحرانی داشته باش",
      "Have a plan for crisis moments",
      "شمارهٔ یک پزشک، مشاور یا مرکز کمک اورژانسی را همیشه در دسترس داشته باش تا در لحظهٔ میل شدید یا بحران، به‌جای تنهایی، تماس بگیری.",
      "Keep a doctor's, counselor's, or emergency helpline's number always at hand, so that in a moment of intense craving or crisis, you reach out instead of facing it alone."
    ),
  ],
  other: [
    step(
      1,
      "عادت را دقیق تعریف کن",
      "Define the habit clearly",
      "دقیقاً بنویس چه عادتی، چند بار در روز/هفته، و در چه موقعیت‌هایی رخ می‌دهد.",
      "Write down exactly what the habit is, how often it happens, and in what situations."
    ),
    step(
      2,
      "دلیل واقعی‌ات برای ترک را یادداشت کن",
      "Write down your real reason for quitting",
      "یک یا دو دلیل شخصی و واقعی (نه چیزی که دیگران می‌گویند) بنویس تا روزهای سخت به آن برگردی.",
      "Write down one or two personal, real reasons (not what others say) so you can return to them on hard days."
    ),
    step(
      3,
      "کاهش تدریجی و قابل‌سنجش",
      "Gradual, measurable reduction",
      "یک هدف کوچک و قابل‌اندازه‌گیری برای هفتهٔ اول تعیین کن، نه یک هدف بزرگ و مبهم.",
      "Set one small, measurable goal for the first week, rather than one big, vague goal."
    ),
    step(
      4,
      "جایگزین سالم پیدا کن",
      "Find a healthy replacement",
      "برای لحظه‌هایی که عادت رخ می‌دهد، یک فعالیت جایگزین کوتاه (چند دقیقه‌ای) آماده داشته باش.",
      "For the moments the habit usually happens, have a short (few-minute) replacement activity ready."
    ),
    step(
      5,
      "پیشرفت را جشن بگیر",
      "Celebrate progress",
      "هر هفته‌ای که کاهش داشتی را به‌عنوان یک موفقیت واقعی به خودت یادآوری کن، حتی اگر کوچک باشد.",
      "Remind yourself that every week with less of the habit is a real win, even a small one."
    ),
  ],
};

export const TRIGGER_TIPS: Record<QuitTrigger, { fa: string; en: string }> = {
  stress: {
    fa: "وقتی محرک اصلی‌ات استرس است: یک تکنیک تنفس ۳۰ ثانیه‌ای (۴ شماره دم، ۴ شماره نگه‌داشتن، ۴ شماره بازدم) را همین حالا امتحان کن؛ و برای موقعیت‌های استرس‌زای تکرارشونده، از قبل یک واکنش جایگزین آماده کن.",
    en: "If stress is your main trigger: try a 30-second breathing technique right now (inhale for 4, hold for 4, exhale for 4), and prepare an alternative response in advance for recurring stressful situations.",
  },
  social: {
    fa: "وقتی محرک اصلی‌ات جمع‌های دوستانه است: از قبل تصمیم بگیر در آن موقعیت چه بگویی یا چه‌کار کنی، و اگر می‌توانی یک دوست حامی را در جریان بگذار تا کنارت باشد.",
    en: "If social settings are your main trigger: decide in advance what you'll say or do in that situation, and if you can, let a supportive friend know so they can be there for you.",
  },
  boredom: {
    fa: "وقتی محرک اصلی‌ات بی‌حوصلگی است: یک فهرست کوتاه از کارهای جایگزین (پیاده‌روی، تماس با یک دوست، یک سرگرمی) همیشه آماده داشته باش تا در لحظهٔ بی‌حوصلگی سراغش بروی.",
    en: "If boredom is your main trigger: always keep a short list of alternative activities (a walk, calling a friend, a hobby) ready to turn to in a bored moment.",
  },
  habit_routine: {
    fa: "وقتی محرک اصلی‌ات یک روتین ثابت است (مثلاً بعد از غذا یا با قهوه): همان توالی را حفظ کن ولی یک جزء را عوض کن — مثلاً قهوه را بخور ولی جای سیگار، چند دقیقه قدم بزن.",
    en: "If a fixed routine is your main trigger (like after a meal or with coffee): keep the same sequence but swap one part — for example, still have the coffee, but take a short walk instead of the habit.",
  },
  physical_craving: {
    fa: "وقتی محرک اصلی‌ات میل جسمی/فیزیکی است: بدان که اغلب ولع‌ها در عرض چند دقیقه (معمولاً کمتر از ۱۰ دقیقه) فروکش می‌کنند؛ در آن چند دقیقه خودت را با آب‌خوردن یا حرکت بدنی کوتاه سرگرم کن.",
    en: "If a physical craving is your main trigger: know that most urges peak and fade within a few minutes (often under 10) — get through those minutes with water or a bit of movement.",
  },
  other: {
    fa: "برای هر محرکی که داری، یک قدم کوچک اما مشخص برای لحظهٔ وقوعش آماده کن؛ داشتن یک برنامهٔ از‌پیش‌فکرشده، تصمیم‌گیری در لحظهٔ سخت را آسان‌تر می‌کند.",
    en: "Whatever your trigger is, prepare one small but specific step for the moment it happens; having a plan ready ahead of time makes the hard moment easier to get through.",
  },
};

export const DAILY_ENCOURAGEMENT_CLEAN: { fa: string; en: string }[] = [
  { fa: "امروز رو بدون این عادت رد کردی — این یک موفقیت واقعیه، هرچقدر هم کوچیک به‌نظر برسه.", en: "You got through today without it — that's a real win, however small it feels." },
  { fa: "هر روزی که اضافه می‌کنی، مسیر رو محکم‌تر می‌کنه. همینطور ادامه بده.", en: "Every extra day makes the path a little stronger. Keep going like this." },
  { fa: "خوشحالم که امروز رو موفق بودی. فردا هم یک روز جدیده — قدم‌به‌قدم.", en: "Glad today went well. Tomorrow is a new day too — one step at a time." },
];

export const DAILY_ENCOURAGEMENT_SLIP: { fa: string; en: string }[] = [
  { fa: "یک روز لغزش به‌معنی شکست کامل نیست. فردا دوباره از همینجا ادامه بده.", en: "One slip doesn't mean total failure. Pick right back up tomorrow from here." },
  { fa: "به‌جای سرزنش خودت، ببین امروز چه چیزی محرک بود تا دفعهٔ بعد آماده‌تر باشی.", en: "Instead of blaming yourself, notice what triggered it today so you're more ready next time." },
  { fa: "خیلی‌ها قبل از موفقیت نهایی، چند بار این مسیر رو دوباره شروع کردن. ادامه دادن مهم‌تر از کامل‌بودنه.", en: "Many people restart this path a few times before lasting success. Continuing matters more than being perfect." },
];
