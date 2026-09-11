import { Cuisine } from "@/types";

export const CUISINES: Cuisine[] = [
  { id: "iranian", name: { fa: "ایرانی", en: "Iranian" } },
  { id: "french", name: { fa: "فرانسوی", en: "French" } },
  { id: "italian", name: { fa: "ایتالیایی", en: "Italian" } },
  { id: "american", name: { fa: "آمریکایی", en: "American" } },
  { id: "chinese", name: { fa: "چینی", en: "Chinese" } },
  { id: "finnish", name: { fa: "فنلاندی", en: "Finnish" } },
  { id: "taiwanese", name: { fa: "تایوانی", en: "Taiwanese" } },
  { id: "mexican", name: { fa: "مکزیکی", en: "Mexican" } },
  { id: "japanese", name: { fa: "ژاپنی", en: "Japanese" } },
  { id: "indian", name: { fa: "هندی", en: "Indian" } },
  { id: "thai", name: { fa: "تایلندی", en: "Thai" } },
  { id: "mediterranean", name: { fa: "مدیترانه‌ای", en: "Mediterranean" } },
];

export const cuisineById = (id: string): Cuisine | undefined =>
  CUISINES.find((c) => c.id === id);
