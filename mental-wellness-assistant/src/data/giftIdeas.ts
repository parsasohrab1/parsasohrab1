import { GiftAgeGroup, GiftBudget, GiftIdea, GiftInterest, GiftOccasion } from "@/types";

/**
 * Synthetic, hand-written gift-idea dataset — no real product catalog,
 * no real prices or purchase links. Book "suggestions" are genre/topic
 * categories only, never a specific real title (see
 * DISCLAIMERS.giftAdvisorLimitations).
 */
const ALL_ADULT_AGES: GiftAgeGroup[] = ["teen", "adult", "senior"];
const ALL_AGES: GiftAgeGroup[] = ["child", "teen", "adult", "senior"];
const ALL_OCCASIONS: GiftOccasion[] = [
  "birthday",
  "wedding",
  "anniversary",
  "graduation",
  "holiday",
  "housewarming",
  "just_because",
  "condolence",
];

const idea = (
  id: string,
  interests: GiftInterest[],
  occasions: GiftOccasion[],
  budgets: GiftBudget[],
  ageGroups: GiftAgeGroup[],
  fa: string,
  en: string,
  isBookSuggestion = false
): GiftIdea => ({ id, interests, occasions, budgets, ageGroups, idea: { fa, en }, isBookSuggestion });

export const GIFT_IDEAS: GiftIdea[] = [
  idea(
    "gift_reading_book",
    ["reading"],
    ["birthday", "graduation", "holiday", "just_because"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک رمان معاصر خوش‌نام در ژانر مورد علاقه‌اش (کتاب‌فروشی محلی می‌تواند بهترین گزینهٔ روز را معرفی کند)",
    "A well-reviewed contemporary novel in their favorite genre (a local bookstore can point you to the best current pick)",
    true
  ),
  idea(
    "gift_reading_child_book",
    ["reading"],
    ["birthday", "holiday", "just_because"],
    ["low", "medium"],
    ["child"],
    "یک کتاب مصور مناسب سنش با تصویرسازی زیبا",
    "A beautifully illustrated picture book suited to their age",
    true
  ),
  idea(
    "gift_cooking_board",
    ["cooking"],
    ["housewarming", "wedding", "birthday", "just_because"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک تخته‌سرو یا ست ظروف آشپزی باکیفیت",
    "A quality cutting board or a nice cookware set"
  ),
  idea(
    "gift_cooking_class",
    ["cooking"],
    ["birthday", "just_because"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک کلاس آشپزی برای یادگیری یک غذای جدید",
    "A cooking class to learn a new cuisine"
  ),
  idea(
    "gift_sports_bottle",
    ["sports"],
    ["birthday", "just_because"],
    ["low", "medium"],
    ALL_AGES,
    "یک قمقمهٔ باکیفیت یا لوازم جانبی ورزشی مرتبط با رشتهٔ موردعلاقه‌اش",
    "A quality water bottle or gear accessory related to their favorite sport"
  ),
  idea(
    "gift_sports_membership",
    ["sports"],
    ["birthday", "holiday"],
    ["high"],
    ALL_ADULT_AGES,
    "اشتراک کوتاه‌مدت باشگاه یا کلاس ورزشی موردعلاقه‌اش",
    "A short-term membership to a gym or a class in their favorite sport"
  ),
  idea(
    "gift_music_headphones",
    ["music"],
    ["birthday", "graduation", "just_because"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک هدفون باکیفیت یا لوازم جانبی مرتبط با سازی که می‌نوازد",
    "Quality headphones, or an accessory for an instrument they play"
  ),
  idea(
    "gift_music_concert",
    ["music"],
    ["birthday", "anniversary"],
    ["high"],
    ALL_ADULT_AGES,
    "بلیط یک کنسرت یا رویداد موسیقی که دوست دارد",
    "A ticket to a concert or music event they'd enjoy"
  ),
  idea(
    "gift_art_supplies",
    ["art"],
    ["birthday", "just_because", "holiday"],
    ["low", "medium"],
    ALL_AGES,
    "یک ست طراحی یا نقاشی باکیفیت",
    "A quality sketching or painting supply set"
  ),
  idea(
    "gift_art_class",
    ["art"],
    ["birthday", "just_because"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک کلاس کوتاه هنری (نقاشی، سفالگری، یا عکاسی)",
    "A short art class (painting, pottery, or photography)"
  ),
  idea(
    "gift_technology_accessory",
    ["technology"],
    ["birthday", "graduation", "just_because"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک لوازم جانبی کاربردی برای گوشی یا لپ‌تاپش (کاور، پایه، یا شارژر باکیفیت)",
    "A useful accessory for their phone or laptop (a case, stand, or quality charger)"
  ),
  idea(
    "gift_travel_organizer",
    ["travel"],
    ["birthday", "graduation", "just_because"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک ست سازمان‌دهندهٔ سفر یا چمدان کوچک باکیفیت",
    "A travel organizer set or a nice small suitcase"
  ),
  idea(
    "gift_travel_experience",
    ["travel"],
    ["anniversary", "birthday"],
    ["high"],
    ALL_ADULT_AGES,
    "یک سفر کوتاه یا تجربهٔ گردشگری که همیشه دوست داشته امتحان کند",
    "A short trip or an experience they've always wanted to try"
  ),
  idea(
    "gift_fashion_accessory",
    ["fashion"],
    ["birthday", "just_because", "holiday"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک شال، اکسسوری، یا کیف که با سبک شخصی‌اش هماهنگ باشد",
    "A scarf, accessory, or bag that matches their personal style"
  ),
  idea(
    "gift_home_decor_plant",
    ["home_decor"],
    ["housewarming", "just_because"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک گیاه آپارتمانی زیبا در گلدان شیک",
    "A beautiful houseplant in a stylish pot"
  ),
  idea(
    "gift_home_decor_item",
    ["home_decor"],
    ["housewarming", "wedding"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک شیء دکوری باکیفیت که با فضای خانه‌اش هماهنگ باشد",
    "A quality decorative piece that fits their home's style"
  ),
  idea(
    "gift_gardening_tools",
    ["gardening"],
    ["birthday", "housewarming", "just_because"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک ست ابزار باغبانی یا بستهٔ بذر گیاهان موردعلاقه‌اش",
    "A gardening tool set or a seed kit for plants they'd enjoy growing"
  ),
  idea(
    "gift_gaming_accessory",
    ["gaming"],
    ["birthday", "graduation", "just_because"],
    ["medium", "high"],
    ["child", "teen", "adult"],
    "یک لوازم جانبی بازی یا کارت هدیهٔ فروشگاه بازی موردعلاقه‌اش",
    "A gaming accessory, or a gift card for their favorite game store"
  ),
  idea(
    "gift_wellness_kit",
    ["wellness"],
    ["birthday", "just_because", "holiday"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک ست آرامش‌بخش (شمع، چای گیاهی، دفترچهٔ یادداشت) برای لحظه‌های آرامش",
    "A calming self-care kit (candle, herbal tea, a nice journal) for their downtime"
  ),
  idea(
    "gift_wellness_spa",
    ["wellness"],
    ["birthday", "anniversary"],
    ["high"],
    ALL_ADULT_AGES,
    "یک بستهٔ کوتاه ماساژ یا اسپا برای استراحت واقعی",
    "A short massage or spa package for real rest"
  ),
  idea(
    "gift_condolence_generic",
    [],
    ["condolence"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "به‌جای یک هدیهٔ مادی، یک غذای خانگی برای خانواده ببر یا کاری عملی (خرید، رفت‌وآمد) برایشان انجام بده — در این شرایط، همراهی و کمک عملی معمولاً بیشتر از هر هدیه‌ای ارزش دارد.",
    "Instead of a material gift, bring the family a home-cooked meal or offer practical help (errands, rides) — in this situation, presence and practical support usually matter more than any gift."
  ),
  idea(
    "gift_housewarming_generic",
    [],
    ["housewarming"],
    ["low", "medium"],
    ALL_ADULT_AGES,
    "یک سبد کوچک از وسایل کاربردی خانه (شمع خوش‌بو، حوله، یا ظروف کوچک) همیشه گزینهٔ امنی است.",
    "A small basket of practical home items (a scented candle, towels, or small dishware) is always a safe choice."
  ),
  idea(
    "gift_graduation_generic",
    [],
    ["graduation"],
    ["medium", "high"],
    ALL_ADULT_AGES,
    "یک وسیلهٔ حرفه‌ای کاربردی برای شروع مسیر شغلی جدیدش (کیف اداری، دفترچهٔ باکیفیت) در کنار یک پیام تشویقی صادقانه.",
    "A practical, professional item for their new career path (a work bag, a quality notebook) alongside a sincere, encouraging note."
  ),
];
