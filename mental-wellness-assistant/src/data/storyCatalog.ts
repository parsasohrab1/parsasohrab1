import { Story } from "@/types";

/**
 * Original bedtime/story-time catalog — every story here was written
 * for this app, not copied or adapted from an existing copyrighted or
 * traditional tale, so it can ship freely. `{{NAME}}` is replaced with
 * the child's chosen protagonist name at narration time (see
 * engine/storytellingEngine.ts#renderParagraph).
 *
 * This is a seed set (two stories per age band), not an exhaustive
 * children's library — the schema is simple on purpose so adding more
 * stories, or wiring a real content source, is a drop-in change.
 */
const p = (fa: string, en: string) => ({ fa, en });

export const STORIES: Story[] = [
  // ---- 2-4 -------------------------------------------------------------
  {
    id: "story_bunny_moon",
    ageRanges: ["2-4"],
    title: { fa: "خرگوش کوچولو و ماه", en: "The Little Bunny and the Moon" },
    teaser: { fa: "یک خرگوش کوچولو که دوست ماه مهربان می‌شود.", en: "A little bunny who becomes friends with the gentle moon." },
    paragraphs: [
      p("یکی بود، یکی نبود. {{NAME}} یک خرگوش کوچولوی نرم و سفید بود که توی یک باغ زیبا زندگی می‌کرد.", "Once upon a time, {{NAME}} was a soft little white bunny who lived in a beautiful garden."),
      p("هر شب، {{NAME}} به آسمان نگاه می‌کرد و ماه گرد و نورانی را می‌دید که به او لبخند می‌زد.", "Every night, {{NAME}} looked up at the sky and saw the round, glowing moon smiling down."),
      p("یک شب {{NAME}} به ماه گفت: «سلام ماه مهربان، می‌شود دوست من باشی؟» و ماه با نور ملایمش چشمک زد.", "One night {{NAME}} said, \"Hello, gentle moon, will you be my friend?\" and the moon twinkled softly."),
      p("از آن شب به بعد، هر وقت {{NAME}} کمی می‌ترسید، به ماه نگاه می‌کرد و آرام می‌شد، چون می‌دانست دوستش همیشه آنجاست.", "From that night on, whenever {{NAME}} felt a little scared, looking at the moon made everything feel calm, because a friend was always watching over."),
      p("و {{NAME}} با خیال راحت خوابید، در حالی که نور نرم ماه از پنجره به داخل می‌تابید. شب بخیر، {{NAME}} عزیز.", "And {{NAME}} drifted off to sleep peacefully, with the moon's soft light shining gently through the window. Goodnight, dear {{NAME}}."),
    ],
    moral: { fa: "همیشه یک دوست مهربان همراه ماست، حتی در تاریکی شب.", en: "A gentle friend is always with us, even in the dark." },
  },
  {
    id: "story_curious_chick",
    ageRanges: ["2-4"],
    title: { fa: "جوجه‌ی کنجکاو", en: "The Curious Little Chick" },
    teaser: { fa: "جوجه‌ای که دوست دارد همه‌چیز را بو کند و لمس کند.", en: "A little chick who loves to sniff and touch everything." },
    paragraphs: [
      p("{{NAME}} یک جوجه‌ی کوچولوی زرد بود که همیشه دوست داشت همه‌جای مزرعه را بگردد.", "{{NAME}} was a tiny yellow chick who always loved exploring every corner of the farm."),
      p("یک روز {{NAME}} یک گل قرمز زیبا دید و با نوکش آرام آن را لمس کرد. گل خیلی نرم بود!", "One day {{NAME}} saw a beautiful red flower and gently touched it with a little beak. The flower was so soft!"),
      p("بعد {{NAME}} صدای آب رودخانه را شنید و رفت نزدیک شد. آب سرد و زلال بود و {{NAME}} خیلی خوشحال شد.", "Then {{NAME}} heard the sound of the river and went to look. The water was cool and clear, and {{NAME}} felt so happy."),
      p("مادر مرغه {{NAME}} را صدا زد: «وقت خواب است، کوچولوی من!» و {{NAME}} با خوشحالی به لانه‌ی گرم برگشت.", "Mother hen called out, \"Time for bed, my little one!\" and {{NAME}} happily hopped back to the warm, cozy nest."),
      p("{{NAME}} زیر بال گرم مادر خوابید و رویای گل‌ها و رودخانه را دید. شب بخیر، {{NAME}} کوچولو.", "{{NAME}} snuggled under mother's warm wing and dreamed of flowers and the river. Goodnight, little {{NAME}}."),
    ],
    moral: { fa: "کنجکاوی خوب است، اما وقت خواب هم باید استراحت کرد.", en: "Curiosity is wonderful, but it's good to rest when it's bedtime." },
  },

  // ---- 5-7 ---------------------------------------------------------------
  {
    id: "story_wishing_tree",
    ageRanges: ["5-7"],
    title: { fa: "{{NAME}} و درخت آرزوها", en: "{{NAME}} and the Wishing Tree" },
    teaser: { fa: "کشف یک درخت جادویی که به مهربانی پاسخ می‌دهد.", en: "Discovering a magical tree that answers kindness." },
    paragraphs: [
      p("{{NAME}} در راه مدرسه، درخت بزرگ و قدیمی‌ای را دید که برگ‌های طلایی داشت. کسی می‌گفت آن درخت آرزوها را برآورده می‌کند.", "On the way to school, {{NAME}} noticed a big old tree with golden leaves. Someone said that tree could grant wishes."),
      p("{{NAME}} کنار درخت نشست و گفت: «کاش می‌توانستم به دوستم که تنهاست کمک کنم.» درخت هیچ نگفت، اما یک برگ طلایی آرام افتاد.", "{{NAME}} sat by the tree and said, \"I wish I could help my friend who feels lonely.\" The tree said nothing, but one golden leaf gently fell."),
      p("{{NAME}} برگ را برداشت و فهمید که خودش باید کاری کند. پس فردای آن روز، کنار دوست تنهایش نشست و با او بازی کرد.", "{{NAME}} picked up the leaf and realized the wish had to come true through action. The next day, {{NAME}} sat with the lonely friend and played together."),
      p("دوستش خیلی خوشحال شد و لبخند زد. {{NAME}} فهمید که مهربانی خودش، جادوی واقعی درخت بوده است.", "The friend smiled, so happy to have company. {{NAME}} realized that kindness itself was the tree's real magic."),
      p("از آن روز، {{NAME}} هر روز کنار درخت آرزوها می‌ایستاد و به یاد می‌آورد که بهترین آرزوها، آن‌هایی هستند که خودمان برآورده می‌کنیم.", "From then on, {{NAME}} would stop by the wishing tree and remember that the best wishes are the ones we make come true ourselves."),
    ],
    moral: { fa: "بهترین جادو، مهربانی‌ای است که خودمان به دیگران هدیه می‌دهیم.", en: "The best magic is the kindness we choose to give others." },
  },
  {
    id: "story_colorful_forest",
    ageRanges: ["5-7"],
    title: { fa: "ماجراجویی در جنگل رنگی", en: "Adventure in the Colorful Forest" },
    teaser: { fa: "سفری به جنگلی که هر درختش یک رنگ متفاوت دارد.", en: "A journey through a forest where every tree is a different color." },
    paragraphs: [
      p("{{NAME}} یک نقشه‌ی قدیمی پیدا کرد که به یک جنگل رنگی اشاره می‌کرد، جایی که هر درخت رنگ خودش را داشت.", "{{NAME}} found an old map pointing to a colorful forest, where every tree had its own color."),
      p("وقتی {{NAME}} وارد جنگل شد، درخت‌های آبی، بنفش و نارنجی را دید که آرام در باد می‌رقصیدند.", "When {{NAME}} entered the forest, there were blue, purple, and orange trees swaying gently in the wind."),
      p("یک سنجاب کوچولو به {{NAME}} گفت: «هر رنگ یک هدیه دارد؛ رنگ آبی آرامش می‌دهد و رنگ نارنجی انرژی.»", "A little squirrel told {{NAME}}, \"Each color has a gift — blue brings calm, and orange brings energy.\""),
      p("{{NAME}} زیر درخت آبی نشست و احساس آرامش زیادی کرد، انگار همه‌ی نگرانی‌هایش سبک شده بودند.", "{{NAME}} sat under the blue tree and felt wonderfully calm, as if every worry had become lighter."),
      p("وقتی {{NAME}} به خانه برگشت، تصمیم گرفت هر وقت دلش شلوغ بود، چشم‌هایش را ببندد و آن جنگل آرام‌بخش را در ذهنش تصور کند.", "When {{NAME}} got home, the decision was made: whenever things felt too busy, closing eyes and picturing that calm forest would help."),
    ],
    moral: { fa: "می‌توانیم با تصور یک جای آرام، هر وقت لازم بود آرامش پیدا کنیم.", en: "We can find calm anytime by imagining a peaceful place." },
  },

  // ---- 8-10 ----------------------------------------------------------
  {
    id: "story_river_secret",
    ageRanges: ["8-10"],
    title: { fa: "{{NAME}} و راز رودخانه", en: "{{NAME}} and the River's Secret" },
    teaser: { fa: "حل یک معمای مهربانانه در کنار رودخانه‌ی روستا.", en: "Solving a gentle mystery beside the village river." },
    paragraphs: [
      p("هر سال، ماهی‌های رودخانه‌ی روستا کمتر و کمتر می‌شدند و هیچ‌کس نمی‌دانست چرا. {{NAME}} تصمیم گرفت راز آن را کشف کند.", "Every year, the village river had fewer and fewer fish, and no one knew why. {{NAME}} decided to solve the mystery."),
      p("{{NAME}} چند روز کنار رودخانه نشست و دقت کرد. بالاخره متوجه شد که کارخانه‌ی بالادست، آب کثیف به رودخانه می‌ریزد.", "{{NAME}} spent several days watching the river closely, and finally noticed that a factory upstream was releasing dirty water into it."),
      p("{{NAME}} با چند تا از دوستانش نامه‌ای نوشت و آن را برای مسئول کارخانه فرستاد و از او خواست به فکر ماهی‌ها باشد.", "{{NAME}} and a few friends wrote a letter to the factory manager, asking them to think about the fish."),
      p("مدتی بعد، کارخانه یک سیستم تصفیه نصب کرد و آب رودخانه دوباره تمیز شد. کم‌کم ماهی‌ها هم برگشتند.", "Some time later, the factory installed a filtering system, and the river became clean again. Slowly, the fish began to return."),
      p("{{NAME}} فهمید که حتی یک نفر هم می‌تواند با کمی شجاعت و همکاری، تغییری بزرگ ایجاد کند.", "{{NAME}} learned that even one person, with a little courage and teamwork, can make a big difference."),
    ],
    moral: { fa: "با شجاعت و همکاری، حتی یک نفر می‌تواند دنیای اطرافش را بهتر کند.", en: "With courage and teamwork, even one person can make the world a little better." },
  },
  {
    id: "story_village_hero",
    ageRanges: ["8-10"],
    title: { fa: "قهرمان کوچک دهکده", en: "The Little Hero of the Village" },
    teaser: { fa: "پسری که یاد می‌گیرد قهرمان‌بودن به معنای کمک‌کردن است.", en: "A child who learns that being a hero means helping others." },
    paragraphs: [
      p("{{NAME}} همیشه دوست داشت مثل قهرمان‌های داستان‌ها، شجاع و قوی باشد، اما فکر می‌کرد هنوز خیلی کوچک است.", "{{NAME}} always dreamed of being brave and strong like the heroes in stories, but felt too small to really matter."),
      p("یک روز طوفان شدیدی آمد و پل چوبی روستا آسیب دید. بزرگ‌ترها نگران بودند که چطور آن را درست کنند.", "One day a strong storm damaged the village's wooden bridge, and the grown-ups worried about how to fix it."),
      p("{{NAME}} یادش آمد که پدربزرگش قبلاً نشانش داده بود چطور طناب‌ها را محکم گره بزند. پس با کمک چند بچه‌ی دیگر شروع به کار کرد.", "{{NAME}} remembered grandfather teaching how to tie strong knots, so with a few other kids, the work began."),
      p("بچه‌ها کنار بزرگ‌ترها کار کردند و کمک بزرگی بودند. پل دوباره محکم شد و همه از {{NAME}} تشکر کردند.", "The children worked alongside the adults and were a real help. The bridge became sturdy again, and everyone thanked {{NAME}}."),
      p("{{NAME}} فهمید که قهرمان‌بودن به معنای بزرگ یا قوی بودن نیست؛ بلکه یعنی هر کاری که از دستمان برمی‌آید برای کمک به دیگران انجام دهیم.", "{{NAME}} realized that being a hero isn't about being big or strong — it's about doing whatever you can to help others."),
    ],
    moral: { fa: "قهرمان‌بودن یعنی هر کاری از دستمان برمی‌آید برای کمک به دیگران انجام دهیم.", en: "Being a hero means doing whatever you can, however small, to help others." },
  },

  // ---- 11-13 ---------------------------------------------------------
  {
    id: "story_lost_star",
    ageRanges: ["11-13"],
    title: { fa: "ستاره‌ای که راهش را گم کرد", en: "The Star Who Lost Its Way" },
    teaser: { fa: "داستانی درباره‌ی پیداکردن دوباره‌ی مسیر، وقتی همه‌چیز گیج‌کننده به نظر می‌رسد.", en: "A story about finding your way again when everything feels confusing." },
    paragraphs: [
      p("در آسمان شب، یک ستاره‌ی کوچک به نام {{NAME}} از صف چیده‌شده‌ی صورت فلکی‌اش جدا شد و در تاریکی بی‌کران گم شد.", "High in the night sky, a small star named {{NAME}} drifted away from its constellation and became lost in the vast darkness."),
      p("{{NAME}} مدتی سرگردان بود و فکر می‌کرد دیگر هرگز جایگاه واقعی‌اش را پیدا نخواهد کرد. نور خودش هم کم‌کم کم‌رنگ‌تر می‌شد.", "For a while {{NAME}} wandered, worried that the right place would never be found again, and its light slowly began to dim."),
      p("یک شهاب‌سنگ مهربان از کنارش گذشت و گفت: «نور تو همیشه با تو است؛ فقط باید کمی آرام بگیری و به آسمان اعتماد کنی.»", "A kind passing comet said, \"Your light is always with you; you just need to slow down and trust the sky around you.\""),
      p("{{NAME}} کمی آرام گرفت و به‌جای دویدن در تاریکی، به الگوی ستاره‌های اطرافش دقت کرد. کم‌کم راه آشنا را پیدا کرد.", "{{NAME}} settled down and, instead of rushing through the dark, paid close attention to the pattern of nearby stars. Slowly, a familiar path appeared."),
      p("وقتی {{NAME}} به صورت فلکی خودش برگشت، نورش از همیشه درخشان‌تر بود — چون یاد گرفته بود حتی در گم‌شدن هم می‌توان چیزی آموخت.", "When {{NAME}} returned to its constellation, its light shone brighter than ever — because even getting lost had taught something valuable."),
    ],
    moral: { fa: "حتی وقتی راهمان را گم می‌کنیم، با کمی آرامش و اعتماد می‌توانیم دوباره مسیر را پیدا کنیم.", en: "Even when we lose our way, a little calm and trust can help us find it again." },
  },
  {
    id: "story_bridge_of_kindness",
    ageRanges: ["11-13"],
    title: { fa: "پلی به دنیای مهربانی", en: "A Bridge to a Kinder World" },
    teaser: { fa: "دو دهکده‌ی رقیب که یاد می‌گیرند به‌جای رقابت، با هم همکاری کنند.", en: "Two rival villages learn to cooperate instead of compete." },
    paragraphs: [
      p("دو دهکده در دو طرف یک دره بودند و سال‌ها بود با هم رقابت می‌کردند، حتی گاهی به هم کمک هم نمی‌کردند.", "Two villages sat on either side of a valley, and for years they had competed with one another, sometimes even refusing to help each other."),
      p("{{NAME}} که در یکی از دهکده‌ها زندگی می‌کرد، متوجه شد دهکده‌ی روبه‌رو در قحطی سختی گیر افتاده است.", "{{NAME}}, who lived in one of the villages, noticed that the village across the valley was struggling through a difficult shortage."),
      p("با اینکه بعضی‌ها مخالف بودند، {{NAME}} پیشنهاد داد مقداری از محصولاتشان را برای همسایه‌ها بفرستند.", "Even though some people disagreed, {{NAME}} suggested sending some of their harvest to the neighboring village."),
      p("دهکده‌ی دیگر از این مهربانی شگفت‌زده شد و در فصل بعد، وقتی دهکده‌ی {{NAME}} به مشکل خورد، آن‌ها هم کمک کردند.", "The other village was moved by this kindness, and the next season, when {{NAME}}'s village faced its own trouble, they returned the favor."),
      p("کم‌کم، دو دهکده یک پل چوبی روی دره ساختند — نمادی از دوستی‌ای که با یک قدم کوچک شروع شده بود.", "Slowly, the two villages built a wooden bridge across the valley — a symbol of a friendship that had started with just one small step."),
    ],
    moral: { fa: "یک قدم کوچک مهربانی می‌تواند سال‌ها رقابت را به دوستی تبدیل کند.", en: "One small step of kindness can turn years of rivalry into friendship." },
  },
];

export const storiesForAge = (ageRange: string): Story[] =>
  STORIES.filter((s) => s.ageRanges.includes(ageRange as Story["ageRanges"][number]));

export const storyById = (id: string): Story | undefined => STORIES.find((s) => s.id === id);
