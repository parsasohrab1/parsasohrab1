import { RelationshipStrategy } from "@/types";

/**
 * Curated strategy dataset for the marriage/relationship guidance flow.
 *
 * Every "psychology"-attributed entry below is an ORIGINAL summary
 * written for this app, inspired by a well-known public therapeutic
 * concept (the idea, not a quotation from any book) — attributed by name
 * so users know where to read more from a licensed source. The
 * proverb-attributed entries are traditional Persian folk sayings
 * (public domain) paired with a short, original note on how they apply.
 *
 * None of this is a substitute for real couples/family counseling — see
 * DISCLAIMERS.counselingNotSubstitute, rendered alongside every result.
 */
export const RELATIONSHIP_STRATEGIES: RelationshipStrategy[] = [
  {
    id: "rs_soft_startup",
    topics: ["communication", "conflict"],
    source: { fa: "الهام‌گرفته از رویکرد جان گاتمن (Gottman Method)", en: "Inspired by John Gottman's Gottman Method" },
    advice: {
      fa: "به‌جای شروع تند و سرزنش‌آمیز گفتگو، با یک «شروع نرم» صحبت کنید: به‌جای «تو هیچ‌وقت...»، بگویید «من وقتی ... پیش می‌آید، این‌طور احساس می‌کنم...».",
      en: "Instead of starting a conversation with criticism, try a 'soft start-up': instead of \"You never...\", say \"When ... happens, I feel...\".",
    },
  },
  {
    id: "rs_five_to_one",
    topics: ["connection", "conflict"],
    source: { fa: "الهام‌گرفته از رویکرد جان گاتمن (Gottman Method)", en: "Inspired by John Gottman's Gottman Method" },
    advice: {
      fa: "برای هر تعامل منفی، تلاش کنید حدود پنج تعامل مثبت (قدردانی، شوخی، محبت کوچک) در رابطه داشته باشید — همین نسبت، رابطه را در برابر تنش‌ها مقاوم نگه می‌دارد.",
      en: "Aim for roughly five positive interactions (appreciation, humor, small affection) for every negative one — that ratio helps a relationship stay resilient under stress.",
    },
  },
  {
    id: "rs_feelings_behind_fight",
    topics: ["connection", "communication"],
    source: { fa: "الهام‌گرفته از زوج‌درمانی هیجان‌محور سو جانسون (EFT)", en: "Inspired by Sue Johnson's Emotionally Focused Therapy (EFT)" },
    advice: {
      fa: "به‌جای تمرکز فقط روی موضوع ظاهری دعوا، سعی کنید احساس عمیق‌تر پشت آن (مثل ترس از طردشدن یا نادیده‌گرفته‌شدن) را با هم به زبان بیاورید.",
      en: "Instead of focusing only on the surface topic of a fight, try naming the deeper feeling behind it (like a fear of rejection or being overlooked) together.",
    },
  },
  {
    id: "rs_secure_base",
    topics: ["trust", "connection"],
    source: { fa: "الهام‌گرفته از نظریهٔ دلبستگی جان بالبی (Attachment Theory)", en: "Inspired by John Bowlby's Attachment Theory" },
    advice: {
      fa: "احساس امنیت در رابطه از این می‌آید که بدانید در لحظات سخت می‌توانید روی همسرتان حساب کنید؛ این امنیت را با کارهای کوچک روزمره (پاسخ‌دادن، حضورداشتن) بسازید، نه فقط با حرف.",
      en: "A sense of security in a relationship comes from knowing you can rely on your partner in hard moments; build that through small daily actions (responding, showing up), not just words.",
    },
  },
  {
    id: "rs_mirroring",
    topics: ["communication", "conflict"],
    source: { fa: "الهام‌گرفته از زوج‌درمانی ایماگو هارویل هندریکس (Imago Relationship Therapy)", en: "Inspired by Harville Hendrix's Imago Relationship Therapy" },
    advice: {
      fa: "پیش از پاسخ‌دادن، حرف همسرتان را با جملات خودتان بازگو کنید («یعنی داری می‌گی...؟») تا مطمئن شوید درست فهمیده‌اید؛ این کار بسیاری از سوءتفاهم‌ها را از ریشه می‌گیرد.",
      en: "Before responding, reflect back what your partner said in your own words (\"So you're saying...?\") to make sure you understood correctly — this stops many misunderstandings at the root.",
    },
  },
  {
    id: "rs_nvc_request",
    topics: ["conflict", "communication"],
    source: { fa: "الهام‌گرفته از ارتباط بدون خشونت مارشال روزنبرگ (Nonviolent Communication)", en: "Inspired by Marshall Rosenberg's Nonviolent Communication" },
    advice: {
      fa: "احساس، نیاز و درخواست مشخص خود را بدون سرزنش بیان کنید: «وقتی X پیش می‌آید، احساس Y می‌کنم چون به Z نیاز دارم؛ می‌شود این کار را با هم انجام بدهیم؟»",
      en: "State your feeling, need, and a specific request without blame: \"When X happens, I feel Y because I need Z — could we try doing this together?\"",
    },
  },
  {
    id: "rs_active_listening",
    topics: ["communication", "connection"],
    source: { fa: "الهام‌گرفته از رویکرد کارل راجرز دربارهٔ گوش‌دادن فعال (Active Listening)", en: "Inspired by Carl Rogers's concept of active listening" },
    advice: {
      fa: "وقتی همسرتان صحبت می‌کند، فقط برای پاسخ‌دادن گوش نکنید؛ سعی کنید واقعاً بفهمید چه احساسی دارد، پیش از هر قضاوت یا راه‌حل‌دادن سریع.",
      en: "When your partner is talking, don't just listen in order to reply — try to really understand what they're feeling before judging or jumping to a solution.",
    },
  },
  {
    id: "rs_alternative_interpretation",
    topics: ["expectations", "trust", "jealousy"],
    source: { fa: "الهام‌گرفته از رفتاردرمانی شناختی آرون بک (Cognitive Behavioral Therapy)", en: "Inspired by Aaron Beck's Cognitive Behavioral Therapy" },
    advice: {
      fa: "بسیاری از تنش‌ها از تعبیرهای خودکار ذهن می‌آیند (مثلاً «دیر جواب داد یعنی دیگر برایش مهم نیستم»)؛ پیش از نتیجه‌گیری، یک تعبیر جایگزین و منطقی‌تر را هم در نظر بگیرید.",
      en: "Many tensions come from automatic interpretations (like \"they replied late, so I don't matter anymore\"); before jumping to conclusions, consider a more reasonable alternative explanation.",
    },
  },
  {
    id: "rs_daily_appreciation",
    topics: ["connection"],
    source: { fa: "الهام‌گرفته از روان‌شناسی مثبت‌گرا مارتین سلیگمن (Positive Psychology)", en: "Inspired by Martin Seligman's Positive Psychology" },
    advice: {
      fa: "هر روز حداقل یک چیز خوب دربارهٔ همسرتان را با صدای بلند به او بگویید؛ قدردانی آشکار و مرتب، رابطه را به‌مرور تقویت می‌کند.",
      en: "Every day, say at least one good thing about your partner out loud to them; regular, visible appreciation strengthens a relationship over time.",
    },
  },
  {
    id: "rs_love_maps",
    topics: ["connection"],
    source: { fa: "الهام‌گرفته از رویکرد جان گاتمن (Gottman Method) — نقشهٔ عشق", en: "Inspired by John Gottman's Gottman Method — 'Love Maps'" },
    advice: {
      fa: "با کنجکاوی واقعی دنیای درونی همسرتان را بشناسید — دغدغه‌ها، رویاها و حال‌وهوای روزمره‌اش را بپرسید، نه فقط مسائل عملی زندگی مشترک.",
      en: "Get to know your partner's inner world with genuine curiosity — ask about their worries, dreams, and everyday mood, not just the practical logistics of shared life.",
    },
  },
  {
    id: "rs_monthly_budget_talk",
    topics: ["finances"],
    source: { fa: "شیوهٔ رایج در مشاورهٔ مالی زوجین", en: "A common practice in couples' financial counseling" },
    advice: {
      fa: "به‌جای مخفی‌کاری یا دعوای ناگهانی سر پول، یک جلسهٔ ثابت ماهانه برای مرور بودجه با هم بگذارید تا شفافیت جای نگرانی را بگیرد.",
      en: "Instead of secrecy or sudden fights about money, set up a regular monthly budget check-in together so transparency replaces anxiety.",
    },
  },
  {
    id: "rs_couple_boundary_with_family",
    topics: ["in_laws", "shared_decisions"],
    source: { fa: "الهام‌گرفته از نظریهٔ سیستم‌های خانواده موری باوئن (Family Systems Theory)", en: "Inspired by Murray Bowen's Family Systems Theory" },
    advice: {
      fa: "مرز سالم با خانوادهٔ همسر یعنی احترام، بدون از دست‌دادن اتحاد زوج؛ تصمیم‌های اصلی زندگی مشترک را اول با هم هماهنگ کنید، بعد با خانواده در میان بگذارید.",
      en: "A healthy boundary with in-laws means respect without losing the couple's unity; align on major shared decisions together first, then share them with family.",
    },
  },
  {
    id: "rs_premarital_topics",
    topics: ["premarital_readiness", "expectations"],
    appliesTo: ["engaged"],
    source: { fa: "شیوهٔ رایج در مشاورهٔ پیش از ازدواج", en: "A common practice in premarital counseling" },
    advice: {
      fa: "پیش از ازدواج، دربارهٔ انتظارات مشترک (فرزندآوری، محل زندگی، نقش‌ها، ارزش‌های مالی و خانوادگی) صریح صحبت کنید؛ سکوت دربارهٔ این موضوعات معمولاً بعدها به تنش تبدیل می‌شود.",
      en: "Before marriage, talk openly about shared expectations (children, where to live, roles, financial and family values) — staying silent on these usually turns into tension later.",
    },
  },

  // ---- Persian proverbs (traditional/public domain) --------------------
  {
    id: "rs_proverb_red_tongue",
    topics: ["communication", "conflict"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«زبان سرخ سر سبز می‌دهد بر باد» — در اوج عصبانیت مراقب کلماتی باشید که به زبان می‌آورید؛ حرفی که در دعوا گفته می‌شود، گاهی آسیبی می‌زند که جبرانش سخت است.",
      en: "\"A careless tongue can cost dearly\" — in the heat of anger, watch the words you choose; something said in a fight can sometimes cause harm that's hard to undo.",
    },
  },
  {
    id: "rs_proverb_two_cooks",
    topics: ["in_laws", "shared_decisions"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«آشپز که دو تا شد، آش یا شور می‌شود یا بی‌نمک» — تصمیم‌های اصلی زندگی مشترک را باید خودِ زوج با هم بگیرند، نه با دخالت زیاد دیگران، حتی اگر با محبت باشد.",
      en: "\"Too many cooks spoil the broth\" — major decisions about shared life should be made by the couple themselves, not with too much outside involvement, even well-meaning.",
    },
  },
  {
    id: "rs_proverb_patience_victory",
    topics: ["conflict", "premarital_readiness"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«صبر و ظفر هر دو دوستان قدیمند» — در حل تعارض، عجله برای رسیدن به نتیجه گاهی کار را بدتر می‌کند؛ کمی صبر و آرامش، فضای گفتگو را بهتر می‌کند.",
      en: "\"Patience and triumph are old friends\" — when resolving conflict, rushing to a conclusion can sometimes make things worse; a little patience improves the conversation.",
    },
  },
  {
    id: "rs_proverb_one_hand",
    topics: ["conflict", "trust"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«یک دست صدا ندارد» — در اکثر اختلاف‌ها هر دو طرف سهمی دارند؛ به‌جای سرزنش یک‌طرفه، سهم خودتان را هم در نظر بگیرید.",
      en: "\"It takes two hands to clap\" — in most disagreements, both sides play a part; instead of one-sided blame, consider your own share too.",
    },
  },
  {
    id: "rs_proverb_dont_postpone",
    topics: ["conflict", "communication"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«کار امروز را به فردا میفکن» — مشکلات کوچک رابطه را به تعویق نیندازید؛ چیزی که امروز حل نشود، معمولاً فردا بزرگ‌تر می‌شود.",
      en: "\"Don't put off today's work until tomorrow\" — don't postpone small relationship issues; what isn't resolved today usually grows bigger tomorrow.",
    },
  },
  {
    id: "rs_proverb_wall_of_denial",
    topics: ["trust"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«دیوار حاشا بلند است» — انکارکردن اشتباهات کوچک، معمولاً اعتماد را بیشتر از خودِ اشتباه از بین می‌برد؛ صداقت، حتی وقتی سخت است، اعتماد را حفظ می‌کند.",
      en: "\"The wall of denial is high\" — denying small mistakes usually damages trust more than the mistake itself; honesty, even when hard, protects trust.",
    },
  },
  {
    id: "rs_proverb_one_flower",
    topics: ["trust", "conflict"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«با یک گل بهار نمی‌شود» — یک هدیه یا عذرخواهی به‌تنهایی رابطه را ترمیم نمی‌کند؛ تغییر واقعی به رفتار مداوم و پیوسته نیاز دارد.",
      en: "\"One flower doesn't make spring\" — a single gift or apology alone won't repair a relationship; real change needs consistent, ongoing behavior.",
    },
  },
  {
    id: "rs_proverb_drop_by_drop",
    topics: ["connection"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«قطره قطره جمع گردد، وانگهی دریا شود» — محبت‌های کوچک روزمره (یک پیام، یک لبخند، یک کمک کوچک) کم‌کم صمیمیتی عمیق می‌سازند.",
      en: "\"Drop by drop, it gathers into a sea\" — small daily acts of affection (a message, a smile, a little help) gradually build deep closeness.",
    },
  },
  {
    id: "rs_proverb_think_before_speak",
    topics: ["communication", "conflict"],
    source: { fa: "ضرب‌المثل فارسی", en: "Persian proverb" },
    advice: {
      fa: "«اول اندیشه، وانگهی گفتار» — پیش از بیان حرف‌های تند در بحبوحهٔ دعوا، چند لحظه مکث کنید؛ همین مکث کوتاه از آسیب‌های غیرضروری جلوگیری می‌کند.",
      en: "\"Think first, speak after\" — before blurting out sharp words in the middle of a fight, pause for a moment; that short pause prevents a lot of unnecessary harm.",
    },
  },
];

export const strategiesForTopic = (topic: string): RelationshipStrategy[] =>
  RELATIONSHIP_STRATEGIES.filter((s) => s.topics.includes(topic as RelationshipStrategy["topics"][number]));

export const strategyById = (id: string): RelationshipStrategy | undefined =>
  RELATIONSHIP_STRATEGIES.find((s) => s.id === id);
