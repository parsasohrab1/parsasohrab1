import { QuitCheckIn, QuitProfile } from "@/types";
import {
  buildQuitPlan,
  computeStreak,
  encouragementForCheckIn,
  requiresMedicalCaution,
} from "@/engine/quitCoachEngine";

const baseProfile = (overrides: Partial<QuitProfile> = {}): QuitProfile => ({
  addictionType: "smoking",
  otherDescription: null,
  dailyAmount: null,
  yearsOfHabit: null,
  pastQuitAttempts: null,
  primaryTrigger: null,
  motivation: null,
  ...overrides,
});

describe("requiresMedicalCaution", () => {
  it("flags alcohol and drugs as always needing medical caution", () => {
    expect(requiresMedicalCaution("alcohol")).toBe(true);
    expect(requiresMedicalCaution("drugs")).toBe(true);
  });

  it("does not flag smoking or other habits", () => {
    expect(requiresMedicalCaution("smoking")).toBe(false);
    expect(requiresMedicalCaution("other")).toBe(false);
  });
});

describe("buildQuitPlan", () => {
  it("returns the base steps for the addiction type when no trigger is set", () => {
    const plan = buildQuitPlan(baseProfile());
    expect(plan.length).toBeGreaterThan(0);
    expect(plan.every((s) => s.title.fa.length > 0 && s.advice.en.length > 0)).toBe(true);
  });

  it("appends a trigger-specific step when a trigger is set", () => {
    const withoutTrigger = buildQuitPlan(baseProfile());
    const withTrigger = buildQuitPlan(baseProfile({ primaryTrigger: "stress" }));
    expect(withTrigger.length).toBe(withoutTrigger.length + 1);
    expect(withTrigger[withTrigger.length - 1].advice.en).toContain("breathing");
  });

  it("builds a distinct plan per addiction type", () => {
    const smoking = buildQuitPlan(baseProfile({ addictionType: "smoking" }));
    const alcohol = buildQuitPlan(baseProfile({ addictionType: "alcohol" }));
    expect(smoking[0].advice.en).not.toBe(alcohol[0].advice.en);
  });
});

describe("encouragementForCheckIn", () => {
  it("always returns a non-empty fa/en message for both outcomes", () => {
    const clean = encouragementForCheckIn({ usedSubstance: false });
    const slip = encouragementForCheckIn({ usedSubstance: true });
    expect(clean.fa.length).toBeGreaterThan(0);
    expect(clean.en.length).toBeGreaterThan(0);
    expect(slip.fa.length).toBeGreaterThan(0);
    expect(slip.en.length).toBeGreaterThan(0);
  });
});

describe("computeStreak", () => {
  const checkIn = (date: string, usedSubstance: boolean, cravingLevel = 2): QuitCheckIn => ({
    date,
    usedSubstance,
    cravingLevel,
    loggedAt: `${date}T00:00:00.000Z`,
  });

  it("returns zeros for an empty log", () => {
    expect(computeStreak([])).toEqual({ totalCheckIns: 0, currentStreakDays: 0, averageCraving: null });
  });

  it("counts a streak of consecutive clean days from the most recent entry", () => {
    const log = [checkIn("2026-01-01", true), checkIn("2026-01-02", false), checkIn("2026-01-03", false)];
    const summary = computeStreak(log);
    expect(summary.totalCheckIns).toBe(3);
    expect(summary.currentStreakDays).toBe(2);
  });

  it("resets the streak to zero if the most recent day was a slip", () => {
    const log = [checkIn("2026-01-01", false), checkIn("2026-01-02", true)];
    const summary = computeStreak(log);
    expect(summary.currentStreakDays).toBe(0);
  });

  it("computes the average craving level across all check-ins", () => {
    const log = [checkIn("2026-01-01", false, 4), checkIn("2026-01-02", false, 2)];
    const summary = computeStreak(log);
    expect(summary.averageCraving).toBe(3);
  });
});
