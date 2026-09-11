import { FitnessProfile } from "@/types";
import {
  bmiCategory,
  calculateBMI,
  cautionNoteFor,
  isBmiLikelyUnreliable,
  parseHeightCmFromText,
  parseWeightKgFromText,
  recommendFitnessStrategies,
  scoreFitnessSession,
} from "@/engine/fitnessEngine";

describe("calculateBMI / bmiCategory", () => {
  it("computes BMI from height (cm) and weight (kg)", () => {
    expect(calculateBMI(180, 81)).toBeCloseTo(25.0, 1);
    expect(calculateBMI(160, 45)).toBeCloseTo(17.6, 1);
  });

  it("classifies BMI into the standard WHO bands", () => {
    expect(bmiCategory(17)).toBe("underweight");
    expect(bmiCategory(18.5)).toBe("normal");
    expect(bmiCategory(24.9)).toBe("normal");
    expect(bmiCategory(25)).toBe("overweight");
    expect(bmiCategory(29.9)).toBe("overweight");
    expect(bmiCategory(30)).toBe("obese");
    expect(bmiCategory(42)).toBe("obese");
  });
});

describe("parseHeightCmFromText / parseWeightKgFromText", () => {
  it("parses a plain centimeter value", () => {
    expect(parseHeightCmFromText("175")).toBe(175);
    expect(parseHeightCmFromText("۱۸۰ سانتی‌متر")).toBe(180);
  });

  it("treats a value under 3 as meters and converts to cm", () => {
    expect(parseHeightCmFromText("1.75")).toBe(175);
    expect(parseHeightCmFromText("1,80 متر")).toBe(180);
  });

  it("parses weight in kilograms, including Persian digits", () => {
    expect(parseWeightKgFromText("70")).toBe(70);
    expect(parseWeightKgFromText("۶۵.۵ کیلوگرم")).toBe(65.5);
  });

  it("returns null when no number can be found", () => {
    expect(parseHeightCmFromText("نمی‌دونم")).toBeNull();
    expect(parseWeightKgFromText("")).toBeNull();
  });
});

describe("isBmiLikelyUnreliable", () => {
  it("flags athlete profiles and not non-athletes", () => {
    const athlete: FitnessProfile = { athleteStatus: "athlete", exercisePurpose: null, weightGoal: null, heightCm: null, weightKg: null };
    const nonAthlete: FitnessProfile = { ...athlete, athleteStatus: "non_athlete" };
    expect(isBmiLikelyUnreliable(athlete)).toBe(true);
    expect(isBmiLikelyUnreliable(nonAthlete)).toBe(false);
  });
});

describe("cautionNoteFor", () => {
  it("warns when an already-underweight client wants to lose more", () => {
    expect(cautionNoteFor("underweight", "lose")).not.toBeNull();
  });

  it("warns when an already-obese client wants to gain more", () => {
    expect(cautionNoteFor("obese", "gain")).not.toBeNull();
  });

  it("stays quiet for sensible goal/BMI combinations", () => {
    expect(cautionNoteFor("normal", "maintain")).toBeNull();
    expect(cautionNoteFor("overweight", "lose")).toBeNull();
    expect(cautionNoteFor("underweight", "gain")).toBeNull();
  });
});

describe("recommendFitnessStrategies", () => {
  const baseProfile: FitnessProfile = {
    athleteStatus: "non_athlete",
    exercisePurpose: "health_fitness",
    weightGoal: "lose",
    heightCm: 170,
    weightKg: 90,
  };

  it("only returns strategies matching the BMI category and goal", () => {
    const { nutrition, exercise } = recommendFitnessStrategies(baseProfile, "obese");
    expect(nutrition.length).toBeGreaterThan(0);
    expect(exercise.length).toBeGreaterThan(0);
    for (const s of [...nutrition, ...exercise]) {
      expect(s.bmiCategories).toContain("obese");
      if (s.weightGoals) expect(s.weightGoals).toContain("lose");
    }
  });

  it("never returns an athlete-only strategy for a non-athlete", () => {
    const { nutrition } = recommendFitnessStrategies(baseProfile, "obese");
    expect(nutrition.find((s) => s.id === "n_athlete_protein_timing")).toBeUndefined();
  });

  it("includes athlete-only strategies for an athlete profile", () => {
    const athleteProfile: FitnessProfile = { ...baseProfile, athleteStatus: "athlete" };
    const { nutrition } = recommendFitnessStrategies(athleteProfile, "normal");
    expect(nutrition.find((s) => s.id === "n_athlete_protein_timing")).toBeDefined();
  });
});

describe("scoreFitnessSession", () => {
  it("returns null until both height and weight are known", () => {
    const incomplete: FitnessProfile = { athleteStatus: "non_athlete", exercisePurpose: "health_fitness", weightGoal: "maintain", heightCm: 170, weightKg: null };
    expect(scoreFitnessSession("s1", incomplete)).toBeNull();
  });

  it("produces a full result once height and weight are set", () => {
    const complete: FitnessProfile = { athleteStatus: "non_athlete", exercisePurpose: "health_fitness", weightGoal: "maintain", heightCm: 170, weightKg: 65 };
    const result = scoreFitnessSession("s2", complete);
    expect(result).not.toBeNull();
    expect(result!.bmiCategory).toBe("normal");
    expect(result!.nutritionStrategies.length).toBeGreaterThan(0);
  });
});
