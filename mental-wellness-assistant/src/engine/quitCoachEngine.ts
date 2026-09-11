import { AddictionType, QuitCheckIn, QuitPlanStep, QuitProfile } from "@/types";
import {
  BASE_STEPS,
  DAILY_ENCOURAGEMENT_CLEAN,
  DAILY_ENCOURAGEMENT_SLIP,
  TRIGGER_TIPS,
} from "@/data/quitCoachStrategies";

/** Alcohol and drugs can involve medically dangerous physical
 *  withdrawal — always show the medical-supervision caution for these,
 *  regardless of how the user describes their own usage (self-reported
 *  severity is not a reliable safety signal). See
 *  DISCLAIMERS.quitCoachMedicalSupervision. */
export const requiresMedicalCaution = (addictionType: AddictionType): boolean =>
  addictionType === "alcohol" || addictionType === "drugs";

/** Builds an ordered plan: the base steps for the chosen addiction type,
 *  plus one extra step with a coping tip for the user's stated trigger. */
export const buildQuitPlan = (profile: QuitProfile): QuitPlanStep[] => {
  const base = BASE_STEPS[profile.addictionType];
  if (!profile.primaryTrigger) return base;

  const tip = TRIGGER_TIPS[profile.primaryTrigger];
  const triggerStep: QuitPlanStep = {
    order: base.length + 1,
    title: { fa: "برای محرک خودت آماده باش", en: "Prepare for your specific trigger" },
    advice: tip,
  };
  return [...base, triggerStep];
};

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const encouragementForCheckIn = (checkIn: Pick<QuitCheckIn, "usedSubstance">): { fa: string; en: string } =>
  pickRandom(checkIn.usedSubstance ? DAILY_ENCOURAGEMENT_SLIP : DAILY_ENCOURAGEMENT_CLEAN);

export interface QuitStreakSummary {
  totalCheckIns: number;
  /** Consecutive most-recent days (by check-in order) with no substance use. */
  currentStreakDays: number;
  averageCraving: number | null;
}

/** Check-ins are assumed sorted oldest-to-newest, one per calendar day
 *  (the state layer enforces this). Streak counts backward from the
 *  most recent check-in while usedSubstance stays false. */
export const computeStreak = (checkIns: QuitCheckIn[]): QuitStreakSummary => {
  if (checkIns.length === 0) return { totalCheckIns: 0, currentStreakDays: 0, averageCraving: null };

  let currentStreakDays = 0;
  for (let i = checkIns.length - 1; i >= 0; i--) {
    if (checkIns[i].usedSubstance) break;
    currentStreakDays++;
  }

  const averageCraving = checkIns.reduce((sum, c) => sum + c.cravingLevel, 0) / checkIns.length;

  return { totalCheckIns: checkIns.length, currentStreakDays, averageCraving };
};
