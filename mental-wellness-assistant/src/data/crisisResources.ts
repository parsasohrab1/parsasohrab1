/**
 * Crisis / hotline directory, shared by the suicide-risk crisis flow and
 * the relationship-safety flow (both need "who do I call right now").
 *
 * IMPORTANT: verify and update these numbers for your actual deployment
 * region before shipping — they are provided as a reasonable starting
 * point, not a guarantee of current accuracy. Add more countries as
 * needed; `default` is shown when the user's region is unknown.
 */
export type CrisisResourceCategory = "suicide_crisis" | "domestic_violence" | "general";

export interface CrisisResource {
  region: string;
  category: CrisisResourceCategory;
  label: { fa: string; en: string };
  phone: string;
  note?: { fa: string; en: string };
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    region: "IR",
    category: "general",
    label: { fa: "خط مشاوره سلامت روان (ایران)", en: "Iran Mental Health Counseling Line" },
    phone: "1480",
  },
  {
    region: "IR",
    category: "general",
    label: { fa: "اورژانس اجتماعی (ایران)", en: "Iran Social Emergency Services" },
    phone: "123",
  },
  {
    region: "IR",
    category: "general",
    label: { fa: "اورژانس پزشکی (ایران)", en: "Iran Medical Emergency" },
    phone: "115",
  },
  {
    region: "US",
    category: "suicide_crisis",
    label: { fa: "خط بحران و پیشگیری از خودکشی (آمریکا)", en: "US Suicide & Crisis Lifeline" },
    phone: "988",
  },
  {
    region: "US",
    category: "domestic_violence",
    label: { fa: "خط ملی خشونت خانگی (آمریکا)", en: "US National Domestic Violence Hotline" },
    phone: "1-800-799-7233",
  },
  {
    region: "default",
    category: "general",
    label: {
      fa: "در صورت عدم دسترسی به شماره‌های بالا، با اورژانس محلی خود یا نزدیک‌ترین بیمارستان تماس بگیرید",
      en: "If none of the above apply, contact your local emergency number or nearest hospital",
    },
    phone: "",
  },
];

/** All resources for a region (optionally narrowed to one category),
 *  always including the region-agnostic `default` fallback. */
export const resourcesForRegion = (region: string, category?: CrisisResourceCategory): CrisisResource[] => {
  const matches = (r: CrisisResource) => (category ? r.category === category || r.category === "general" : true);
  const local = CRISIS_RESOURCES.filter((r) => r.region === region && matches(r));
  const fallback = CRISIS_RESOURCES.filter((r) => r.region === "default" && matches(r));
  return [...local, ...fallback];
};
