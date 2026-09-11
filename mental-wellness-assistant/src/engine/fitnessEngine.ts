import { BmiCategory, FitnessProfile, FitnessResult, FitnessStrategy } from "@/types";
import { FITNESS_STRATEGIES } from "@/data/fitnessStrategies";

/** Standard WHO adult BMI bands — a population-level screening tool, not
 *  an individual diagnosis (see DISCLAIMERS.fitnessNotSubstitute). */
export const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const bmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const normalizeDigits = (text: string): string =>
  text.replace(/[۰-۹٠-٩]/g, (ch) => {
    const p = PERSIAN_DIGITS.indexOf(ch);
    if (p !== -1) return String(p);
    const a = ARABIC_INDIC_DIGITS.indexOf(ch);
    return a !== -1 ? String(a) : ch;
  });

const extractFirstNumber = (text: string): number | null => {
  const normalized = normalizeDigits(text).replace(/,/g, ".");
  const match = normalized.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

/** Parses a spoken/typed height answer into centimeters. Accepts plain
 *  cm ("175", "۱۷۵ سانتی‌متر") or meters ("1.75", "1,75 متر") — a value
 *  under 3 is assumed to be meters and converted. Only metric units are
 *  supported in this scaffold. */
export const parseHeightCmFromText = (text: string): number | null => {
  const n = extractFirstNumber(text);
  if (n === null || n <= 0) return null;
  return Math.round(n < 3 ? n * 100 : n);
};

/** Parses a spoken/typed weight answer into kilograms. Metric only. */
export const parseWeightKgFromText = (text: string): number | null => {
  const n = extractFirstNumber(text);
  if (n === null || n <= 0) return null;
  return Math.round(n * 10) / 10;
};

const matchesProfile = (strategy: FitnessStrategy, profile: FitnessProfile, category: BmiCategory): boolean => {
  if (!strategy.bmiCategories.includes(category)) return false;
  if (strategy.weightGoals && (!profile.weightGoal || !strategy.weightGoals.includes(profile.weightGoal))) {
    return false;
  }
  if (strategy.athleteStatus && (!profile.athleteStatus || !strategy.athleteStatus.includes(profile.athleteStatus))) {
    return false;
  }
  if (
    strategy.exercisePurposes &&
    (!profile.exercisePurpose || !strategy.exercisePurposes.includes(profile.exercisePurpose))
  ) {
    return false;
  }
  return true;
};

export const recommendFitnessStrategies = (
  profile: FitnessProfile,
  category: BmiCategory
): { nutrition: FitnessStrategy[]; exercise: FitnessStrategy[] } => ({
  nutrition: FITNESS_STRATEGIES.filter((s) => s.type === "nutrition" && matchesProfile(s, profile, category)),
  exercise: FITNESS_STRATEGIES.filter((s) => s.type === "exercise" && matchesProfile(s, profile, category)),
});

/** Muscular athletes routinely read as "overweight"/"obese" on BMI
 *  despite low body fat — BMI doesn't distinguish muscle from fat. */
export const isBmiLikelyUnreliable = (profile: FitnessProfile): boolean => profile.athleteStatus === "athlete";

/** Flags a goal that runs counter to the BMI reading in a way worth a
 *  gentle, non-blocking caution (e.g. already underweight and wanting to
 *  lose more — a pattern worth a doctor's input, possibly an eating-
 *  disorder screen). Never refuses to show general strategies either way. */
export const cautionNoteFor = (
  category: BmiCategory,
  weightGoal: FitnessProfile["weightGoal"]
): FitnessResult["cautionNote"] => {
  if (category === "underweight" && weightGoal === "lose") {
    return {
      fa: "وزن فعلی شما پایین‌تر از محدودهٔ طبیعی است؛ کاهش بیشتر وزن می‌تواند برای سلامتی خطرناک باشد. لطفاً پیش از هر اقدامی با پزشک یا متخصص تغذیه مشورت کنید. اگر نگرانی دربارهٔ رابطه‌تان با غذا دارید، بخش «غربالگری سلامت روان» این اپ هم می‌تواند نقطهٔ شروع مفیدی باشد.",
      en: "Your current weight is already below the typical healthy range; losing more could be risky for your health. Please talk to a physician or registered dietitian before doing anything. If you're worried about your relationship with food, this app's mental-health screening is also a useful starting point.",
    };
  }
  if (category === "obese" && weightGoal === "gain") {
    return {
      fa: "وزن فعلی شما در محدودهٔ چاقی است؛ افزایش بیشتر وزن معمولاً خطرات سلامتی را بالا می‌برد. اگر دلیل پزشکی مشخصی برای افزایش وزن دارید، حتماً این کار را زیر نظر یک متخصص انجام دهید.",
      en: "Your current weight is already in the obese range; gaining more weight usually increases health risks. If you have a specific medical reason to gain weight, please do it under a professional's supervision.",
    };
  }
  return null;
};

export const scoreFitnessSession = (sessionId: string, profile: FitnessProfile): FitnessResult | null => {
  if (profile.heightCm === null || profile.weightKg === null) return null;
  const bmi = calculateBMI(profile.heightCm, profile.weightKg);
  const category = bmiCategory(bmi);
  const { nutrition, exercise } = recommendFitnessStrategies(profile, category);

  return {
    sessionId,
    completedAt: new Date().toISOString(),
    bmi,
    bmiCategory: category,
    bmiLikelyUnreliable: isBmiLikelyUnreliable(profile),
    cautionNote: cautionNoteFor(category, profile.weightGoal),
    nutritionStrategies: nutrition,
    exerciseStrategies: exercise,
  };
};
