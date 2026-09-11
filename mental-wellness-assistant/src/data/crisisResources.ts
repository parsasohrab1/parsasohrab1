/**
 * Crisis / hotline directory.
 *
 * IMPORTANT: verify and update these numbers for your actual deployment
 * region before shipping — they are provided as a reasonable starting
 * point, not a guarantee of current accuracy. Add more countries as
 * needed; `default` is shown when the user's region is unknown.
 */
export interface CrisisResource {
  region: string;
  label: { fa: string; en: string };
  phone: string;
  note?: { fa: string; en: string };
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    region: "IR",
    label: { fa: "خط مشاوره سلامت روان (ایران)", en: "Iran Mental Health Counseling Line" },
    phone: "1480",
  },
  {
    region: "IR",
    label: { fa: "اورژانس اجتماعی (ایران)", en: "Iran Social Emergency Services" },
    phone: "123",
  },
  {
    region: "IR",
    label: { fa: "اورژانس پزشکی (ایران)", en: "Iran Medical Emergency" },
    phone: "115",
  },
  {
    region: "US",
    label: { fa: "خط بحران و پیشگیری از خودکشی (آمریکا)", en: "US Suicide & Crisis Lifeline" },
    phone: "988",
  },
  {
    region: "default",
    label: {
      fa: "در صورت عدم دسترسی به شماره‌های بالا، با اورژانس محلی خود یا نزدیک‌ترین بیمارستان تماس بگیرید",
      en: "If none of the above apply, contact your local emergency number or nearest hospital",
    },
    phone: "",
  },
];

export const resourcesForRegion = (region: string): CrisisResource[] => {
  const local = CRISIS_RESOURCES.filter((r) => r.region === region);
  const fallback = CRISIS_RESOURCES.filter((r) => r.region === "default");
  return [...local, ...fallback];
};
