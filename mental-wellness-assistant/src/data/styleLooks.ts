import { MakeupLook } from "@/types";

/**
 * A small, text-only catalog of makeup-look descriptions. There is no
 * image generation here — see DISCLAIMERS.styleAdvisorLimitations. Every
 * look is written to be budget- and skill-level-honest (a "DIY, limited
 * budget" look never assumes a full professional kit), and a genuine
 * "no makeup / minimal" option is always included, because that is
 * always a valid choice too.
 */
export const MAKEUP_LOOKS: MakeupLook[] = [
  {
    id: "look_everyday_natural",
    occasions: ["everyday", "birthday"],
    budgets: ["has_budget", "limited_budget"],
    applicationPreferences: ["self", "friend_or_family", "professional"],
    name: { fa: "آرایش طبیعی روزمره", en: "Natural everyday look" },
    steps: [
      { fa: "پوست را با یک مرطوب‌کننده یا BB کرم سبک پوشش بدهید.", en: "A light moisturizer or BB cream for coverage." },
      { fa: "زیر چشم و لکه‌های تیره را با کانسیلر کم بپوشانید.", en: "A little concealer under the eyes and on any dark spots." },
      { fa: "کمی رژگونهٔ صورتی روی گونه‌ها بزنید تا طراوت بگیرد.", en: "A touch of pink blush for freshness." },
      { fa: "یک لایه ریمل و بالم لب رنگی برای پایان کار.", en: "One coat of mascara and a tinted lip balm to finish." },
    ],
    note: {
      fa: "مناسب روزهای عادی یا جشن‌های ساده؛ تمرکز روی طراوت، نه پوشش سنگین.",
      en: "Good for regular days or low-key celebrations; the focus is freshness, not heavy coverage.",
    },
  },
  {
    id: "look_no_makeup",
    occasions: ["everyday", "birthday", "wedding", "formal_event", "mourning"],
    budgets: ["has_budget", "limited_budget"],
    applicationPreferences: ["self"],
    name: { fa: "بدون آرایش یا آرایش حداقلی", en: "No makeup / minimal option" },
    steps: [
      { fa: "پوست را تمیز و مرطوب نگه دارید — این خودش بهترین پایه است.", en: "Clean, well-moisturized skin is the best base on its own." },
      { fa: "در صورت تمایل، فقط از بالم لب و کرم ضدآفتاب استفاده کنید.", en: "If you like, just use a lip balm and sunscreen." },
      { fa: "ابروها را با یک برس شانه کنید تا مرتب به‌نظر برسند.", en: "Brush your eyebrows into place with a spoolie." },
    ],
    note: {
      fa: "آرایش‌نکردن همیشه یک انتخاب کاملاً معتبر است، برای هر مناسبتی.",
      en: "Not wearing makeup is always a perfectly valid choice, for any occasion.",
    },
  },
  {
    id: "look_evening_glam_professional",
    occasions: ["wedding", "formal_event"],
    budgets: ["has_budget"],
    applicationPreferences: ["professional"],
    name: { fa: "آرایش شب کامل با آرایشگاه", en: "Full evening glam at a salon" },
    steps: [
      { fa: "چند روز قبل یک جلسهٔ آزمایشی (trial) با آرایشگر بگذارید تا از نتیجه مطمئن شوید.", en: "Book a trial session with the artist a few days ahead to be sure of the result." },
      { fa: "حتماً حساسیت‌های پوستی یا آلرژی‌های خود را از قبل به آرایشگر بگویید.", en: "Tell the artist about any skin sensitivities or allergies beforehand." },
      { fa: "برای ماندگاری بیشتر، از اسپری فیکساتور (setting spray) استفاده می‌شود.", en: "A setting spray is typically used for longer wear." },
      { fa: "برای هماهنگی با لباس، عکس یا نمونه‌ای از رنگ لباستان را همراه ببرید.", en: "Bring a photo or swatch of your outfit's color to help the look match." },
    ],
    note: {
      fa: "مناسب زمانی که برای آرایشگاه بودجه و وقت دارید و می‌خواهید کاملاً بی‌خیال باشید.",
      en: "Good for when you have the budget and time for a salon visit and want to fully hand it off.",
    },
  },
  {
    id: "look_evening_diy_budget",
    occasions: ["wedding", "formal_event", "birthday"],
    budgets: ["limited_budget"],
    applicationPreferences: ["self", "friend_or_family"],
    name: { fa: "آرایش شب اقتصادی و خودانجام", en: "Budget-friendly DIY evening look" },
    steps: [
      { fa: "به‌جای پوشش سنگین کل صورت، روی یک نقطهٔ قوت تمرکز کنید: یا چشم پررنگ، یا رژ لب پررنگ — نه هر دو با هم.", en: "Instead of heavy coverage everywhere, focus on one strong feature: bold eyes OR a bold lip, not both." },
      { fa: "یک هایلایتر ارزان روی استخوان گونه، پل بینی و بالای لب بزنید تا درخشش بگیرد.", en: "A cheap highlighter on the cheekbones, nose bridge, and cupid's bow adds glow for little cost." },
      { fa: "پیش از شب مراسم، یک بار تمرین کنید تا دست‌تان راه بیفتد.", en: "Do a practice run before the actual event so your hand gets used to it." },
      { fa: "از محصولات چندمنظوره (مثل رژگونهٔ کرمی که روی لب هم قابل‌استفاده است) کمک بگیرید.", en: "Multi-use products (like a cream blush that also works on lips) stretch a small kit further." },
    ],
    note: {
      fa: "نتیجهٔ خوب نیازمند کیف پول سنگین نیست؛ تمرکز و انتخاب هوشمندانه کافی است.",
      en: "A great result doesn't need a big budget — focus and smart choices are enough.",
    },
  },
  {
    id: "look_friend_assisted",
    occasions: ["wedding", "formal_event", "birthday"],
    budgets: ["limited_budget", "has_budget"],
    applicationPreferences: ["friend_or_family"],
    name: { fa: "نکاتی برای وقتی دوستتان آرایشتان می‌کند", en: "Tips for when a friend does your makeup" },
    steps: [
      { fa: "یک یا دو عکس نمونه از سبکی که دوست دارید به دوستتان نشان دهید تا سلیقه‌تان روشن باشد.", en: "Show your friend one or two reference photos of the style you like." },
      { fa: "دربارهٔ حساسیت پوستی یا محصولات خاصی که ترجیح می‌دهید، از قبل صحبت کنید.", en: "Talk beforehand about any skin sensitivities or product preferences." },
      { fa: "زمان کافی در نظر بگیرید و عجله نکنید — نتیجهٔ بهتری می‌گیرید.", en: "Allow enough time and don't rush — you'll get a better result." },
    ],
    note: {
      fa: "آرایش با کمک یک دوست هم می‌تواند نتیجهٔ خیلی خوبی بدهد و هم خودش یک خاطرهٔ خوب بسازد.",
      en: "Getting help from a friend can give a great result and be a nice memory in itself.",
    },
  },
  {
    id: "look_birthday_semiformal",
    occasions: ["birthday"],
    budgets: ["has_budget", "limited_budget"],
    applicationPreferences: ["self", "friend_or_family"],
    name: { fa: "آرایش نیمه‌رسمی برای جشن تولد", en: "Semi-formal birthday look" },
    steps: [
      { fa: "یک سایهٔ چشم رنگی و شاد استفاده کنید — این مناسبت جای بازی‌کردن با رنگ دارد.", en: "A fun, colorful eyeshadow — this occasion is a good excuse to play with color." },
      { fa: "رژ لب یا گلاس با درخشش بالا برای حس جشن‌گونه.", en: "A glossy lip for a celebratory feel." },
      { fa: "کمی برنزر یا رژگونهٔ گرم برای حالت آفتاب‌خورده.", en: "A little bronzer or warm blush for a sun-kissed look." },
    ],
    note: {
      fa: "فضای این آرایش شادتر و کمی جسورتر از آرایش روزمره است.",
      en: "This look is playful and a bit bolder than an everyday look.",
    },
  },
  {
    id: "look_mourning_subdued",
    occasions: ["mourning"],
    budgets: ["has_budget", "limited_budget"],
    applicationPreferences: ["self", "friend_or_family", "professional"],
    name: { fa: "آرایش ملایم و محجوب برای مراسم عزا", en: "A subdued look for a mourning occasion" },
    steps: [
      { fa: "از پوشش مات و طبیعی استفاده کنید؛ از درخشش، گلیتر یا رنگ‌های براق پرهیز کنید.", en: "Use a matte, natural-looking base; avoid shimmer, glitter, or bright colors." },
      { fa: "سایه چشم و رژلب را در تن‌های خنثی و کم‌رنگ نگه دارید.", en: "Keep eyeshadow and lipstick in neutral, muted tones." },
      { fa: "یک ریمل ضدآب می‌تواند به شما کمک کند اگر احتمال اشک‌ریختن هست.", en: "A waterproof mascara can help if there's a chance of tears." },
    ],
    note: {
      fa: "بسته به فرهنگ و رسوم خانواده‌تان، سطح آرایش مناسب می‌تواند متفاوت باشد؛ این فقط یک راهنمای کلی است.",
      en: "What's appropriate can vary by your family's culture and customs — this is only a general guide.",
    },
  },
];

export const lookById = (id: string): MakeupLook | undefined => MAKEUP_LOOKS.find((l) => l.id === id);
