import { FitnessStrategy } from "@/types";

/**
 * General nutrition + exercise strategy dataset for the fitness/BMI
 * guidance flow. Every entry is general, population-level guidance
 * (inspired by widely published public-health sources like WHO physical
 * activity guidelines and common sports-nutrition principles) — never an
 * individualized meal or training plan. See DISCLAIMERS.fitnessNotSubstitute,
 * rendered alongside every result.
 */
export const FITNESS_STRATEGIES: FitnessStrategy[] = [
  // ---- Nutrition ---------------------------------------------------------
  {
    id: "n_balanced_plate",
    type: "nutrition",
    bmiCategories: ["normal"],
    weightGoals: ["maintain"],
    source: { fa: "اصل عمومی «بشقاب سالم»", en: "The general 'healthy plate' principle" },
    advice: {
      fa: "بشقاب متعادل را هدف بگیرید: نیمی سبزیجات، یک‌چهارم پروتئین کم‌چرب، یک‌چهارم غلات کامل.",
      en: "Aim for a balanced plate: half vegetables, a quarter lean protein, a quarter whole grains.",
    },
  },
  {
    id: "n_calorie_deficit",
    type: "nutrition",
    bmiCategories: ["overweight", "obese"],
    weightGoals: ["lose"],
    source: { fa: "اصول عمومی مدیریت وزن", en: "General weight-management principles" },
    advice: {
      fa: "به‌جای رژیم‌های شدید و ناگهانی، یک کسری کالری ملایم و پایدار هدف بگیرید — کاهش تدریجی حدود نیم تا یک کیلوگرم در هفته معمولاً پایدارتر است.",
      en: "Instead of extreme, sudden diets, aim for a modest, sustainable calorie deficit — losing roughly 0.5-1 kg per week tends to be more sustainable.",
    },
  },
  {
    id: "n_protein_satiety",
    type: "nutrition",
    bmiCategories: ["overweight", "obese"],
    weightGoals: ["lose"],
    source: { fa: "اصول عمومی تغذیه در کاهش وزن", en: "General nutrition principles for weight loss" },
    advice: {
      fa: "افزایش پروتئین در هر وعده به احساس سیری بیشتر کمک می‌کند و در دوران کاهش وزن، از دست‌رفتن بافت عضلانی را کاهش می‌دهد.",
      en: "More protein at each meal helps with satiety and, during weight loss, helps preserve muscle mass.",
    },
  },
  {
    id: "n_calorie_surplus",
    type: "nutrition",
    bmiCategories: ["underweight"],
    weightGoals: ["gain"],
    source: { fa: "اصول عمومی تغذیه در افزایش وزن سالم", en: "General nutrition principles for healthy weight gain" },
    advice: {
      fa: "یک مازاد کالری ملایم و پایدار، همراه با غذاهای غنی از انرژی (آجیل، روغن‌های سالم، لبنیات کامل) بهتر از پرخوری ناگهانی و فرآورده‌های پرشکر است.",
      en: "A modest, steady calorie surplus with energy-dense whole foods (nuts, healthy oils, whole dairy) works better than sudden overeating or sugary processed food.",
    },
  },
  {
    id: "n_frequent_meals",
    type: "nutrition",
    bmiCategories: ["underweight"],
    weightGoals: ["gain"],
    source: { fa: "اصول عمومی تغذیه در افزایش وزن سالم", en: "General nutrition principles for healthy weight gain" },
    advice: {
      fa: "اگر اشتهای کمی دارید، وعده‌های کوچک‌تر و مکررتر (۵ تا ۶ بار در روز) می‌تواند رسیدن به مازاد کالری لازم را راحت‌تر کند.",
      en: "If your appetite is small, more frequent, smaller meals (5-6 times a day) can make it easier to reach the calorie surplus you need.",
    },
  },
  {
    id: "n_hydration",
    type: "nutrition",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    source: { fa: "توصیهٔ عمومی سلامت", en: "General health guidance" },
    advice: {
      fa: "آب کافی در طول روز بنوشید؛ گاهی تشنگی با گرسنگی اشتباه گرفته می‌شود و کم‌آبی می‌تواند احساس گرسنگی کاذب ایجاد کند.",
      en: "Stay well hydrated through the day; thirst is sometimes mistaken for hunger, and dehydration can trigger a false sense of hunger.",
    },
  },
  {
    id: "n_athlete_protein_timing",
    type: "nutrition",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    athleteStatus: ["athlete"],
    source: { fa: "اصول عمومی تغذیهٔ ورزشی", en: "General sports-nutrition principles" },
    advice: {
      fa: "مصرف پروتئین در بازهٔ ۱ تا ۲ ساعت پس از تمرین به ریکاوری عضلانی کمک می‌کند.",
      en: "Eating protein within roughly 1-2 hours after training supports muscle recovery.",
    },
  },
  {
    id: "n_athlete_carb_fuel",
    type: "nutrition",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    athleteStatus: ["athlete"],
    exercisePurposes: ["professional_sport"],
    source: { fa: "اصول عمومی تغذیهٔ ورزشی", en: "General sports-nutrition principles" },
    advice: {
      fa: "برای تمرینات شدید و طولانی، کربوهیدرات‌های پیچیده منبع اصلی انرژی بدن هستند؛ کاهش شدید کربوهیدرات می‌تواند به افت عملکرد منجر شود.",
      en: "For intense, prolonged training, complex carbohydrates are the body's main fuel source; cutting carbs too aggressively can hurt performance.",
    },
  },
  {
    id: "n_whole_foods",
    type: "nutrition",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    source: { fa: "اصول عمومی تغذیهٔ سالم", en: "General healthy-eating principles" },
    advice: {
      fa: "تمرکز بر غذاهای کامل و کم‌فرآوری (سبزیجات، میوه، غلات کامل، پروتئین بدون چربی)، برای اکثر افراد پایدارتر از شمارش وسواسی کالری است.",
      en: "Focusing on whole, minimally processed foods (vegetables, fruit, whole grains, lean protein) tends to be more sustainable than obsessively counting calories.",
    },
  },

  // ---- Exercise / physical activity --------------------------------------
  {
    id: "e_who_guideline",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    exercisePurposes: ["health_fitness"],
    source: { fa: "راهنمای عمومی فعالیت بدنی (سازمان جهانی بهداشت)", en: "General WHO physical activity guidelines" },
    advice: {
      fa: "به‌عنوان یک هدف کلی، حدود ۱۵۰ دقیقه فعالیت هوازی با شدت متوسط در هفته، به‌علاوه دو جلسه تمرین قدرتی، برای بیشتر بزرگسالان توصیه می‌شود.",
      en: "As a general target, about 150 minutes of moderate aerobic activity per week, plus two strength-training sessions, is commonly recommended for most adults.",
    },
  },
  {
    id: "e_start_low_impact",
    type: "exercise",
    bmiCategories: ["obese"],
    source: { fa: "توصیهٔ عمومی برای شروع ایمن فعالیت بدنی", en: "General guidance for starting physical activity safely" },
    advice: {
      fa: "شروع با فعالیت‌های کم‌فشار مثل پیاده‌روی، شنا یا دوچرخهٔ ثابت، فشار کمتری به مفاصل وارد می‌کند و شروعی پایدارتر می‌سازد.",
      en: "Starting with low-impact activities like walking, swimming, or stationary cycling puts less strain on the joints and makes for a more sustainable start.",
    },
  },
  {
    id: "e_strength_for_loss",
    type: "exercise",
    bmiCategories: ["overweight", "obese"],
    weightGoals: ["lose"],
    source: { fa: "اصول عمومی تمرین در کاهش وزن", en: "General exercise principles for weight loss" },
    advice: {
      fa: "ترکیب تمرین قدرتی با فعالیت هوازی در دوران کاهش وزن کمک می‌کند بیشتر چربی از دست برود، نه بافت عضلانی.",
      en: "Combining strength training with cardio during weight loss helps preserve muscle while losing more fat.",
    },
  },
  {
    id: "e_strength_for_gain",
    type: "exercise",
    bmiCategories: ["underweight"],
    weightGoals: ["gain"],
    source: { fa: "اصول عمومی تمرین در افزایش وزن سالم", en: "General exercise principles for healthy weight gain" },
    advice: {
      fa: "برای افزایش وزن به‌صورت سالم، تمرین قدرتی پیشرونده (نه فقط کاردیو) کمک می‌کند مازاد کالری بیشتر صرف ساخت عضله شود.",
      en: "For healthy weight gain, progressive strength training (not just cardio) helps direct the calorie surplus toward building muscle.",
    },
  },
  {
    id: "e_progressive_overload",
    type: "exercise",
    bmiCategories: ["underweight", "normal"],
    weightGoals: ["gain"],
    source: { fa: "اصل کلی تمرین قدرتی (اورلود پیش‌رونده)", en: "A core strength-training principle (progressive overload)" },
    advice: {
      fa: "افزایش تدریجی وزنه یا شدت تمرین در طول زمان، اصل کلیدی برای ساخت عضله است.",
      en: "Gradually increasing weight or training intensity over time is a key principle for building muscle.",
    },
  },
  {
    id: "e_recovery_days",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    athleteStatus: ["athlete"],
    source: { fa: "اصول عمومی فیزیولوژی ورزشی", en: "General exercise-physiology principles" },
    advice: {
      fa: "روزهای استراحت و ریکاوری به‌اندازهٔ خود تمرین اهمیت دارند؛ تمرین بیش‌ازحد بدون ریکاوری کافی، خطر آسیب و افت عملکرد را بالا می‌برد.",
      en: "Rest and recovery days matter as much as training itself; overtraining without adequate recovery raises injury risk and hurts performance.",
    },
  },
  {
    id: "e_periodization",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    exercisePurposes: ["professional_sport"],
    source: { fa: "اصل عمومی برنامه‌ریزی دوره‌ای تمرین (Periodization)", en: "The general principle of training periodization" },
    advice: {
      fa: "برای ورزش حرفه‌ای، برنامه‌ریزی دوره‌ای تمرین زیر نظر یک مربی متخصص، به رسیدن به اوج عملکرد در زمان مسابقه کمک می‌کند.",
      en: "For competitive sport, periodized training planned with a specialized coach helps you peak at the right time for competition.",
    },
  },
  {
    id: "e_consistency_over_intensity",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    exercisePurposes: ["health_fitness"],
    source: { fa: "توصیهٔ عمومی برای پایداری فعالیت بدنی", en: "General guidance for sustaining physical activity" },
    advice: {
      fa: "برای اهداف سلامتی عمومی، تداوم یک فعالیت متوسط و لذت‌بخش، مهم‌تر از شدت بسیار بالا و کوتاه‌مدت است.",
      en: "For general health goals, sticking with a moderate, enjoyable activity consistently matters more than a short burst of very high intensity.",
    },
  },
  {
    id: "e_daily_movement",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    source: { fa: "توصیهٔ عمومی سلامت", en: "General health guidance" },
    advice: {
      fa: "حرکت‌های ساده در طول روز (پله به‌جای آسانسور، یک پیاده‌روی کوتاه) در کنار تمرین اصلی جمع می‌شوند و اثر واقعی دارند.",
      en: "Simple everyday movement (stairs instead of the elevator, a short walk) adds up alongside your main workout and genuinely helps.",
    },
  },
  {
    id: "e_listen_to_body",
    type: "exercise",
    bmiCategories: ["underweight", "normal", "overweight", "obese"],
    source: { fa: "توصیهٔ عمومی ایمنی ورزشی", en: "General exercise-safety guidance" },
    advice: {
      fa: "درد شدید یا غیرعادی هنگام تمرین، نشانه‌ای برای توقف و مراجعه به متخصص است، نه چیزی که باید نادیده گرفته شود.",
      en: "Sharp or unusual pain during exercise is a signal to stop and see a professional, not something to push through.",
    },
  },
];
