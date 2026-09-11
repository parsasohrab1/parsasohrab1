import { CareerMilestone, CareerMindsetAnswer, CareerPath } from "@/types";
import {
  inferMindsetFromAnswers,
  MILESTONE_TEMPLATES,
  PATHS_BY_MINDSET,
} from "@/data/careerStrategies";

export const inferMindset = inferMindsetFromAnswers;

export const recommendPaths = (mindset: "employee" | "entrepreneur"): CareerPath[] => PATHS_BY_MINDSET[mindset];

export const milestonesForPath = (path: CareerPath): CareerMilestone[] =>
  MILESTONE_TEMPLATES[path].map((m) => ({ ...m }));

export interface CareerProgressSummary {
  total: number;
  done: number;
  percent: number;
}

export const progressSummary = (milestones: CareerMilestone[]): CareerProgressSummary => {
  const total = milestones.length;
  const done = milestones.filter((m) => m.done).length;
  return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
};

/** True once every milestone in the current path is checked off. */
export const pathCompleted = (milestones: CareerMilestone[]): boolean =>
  milestones.length > 0 && milestones.every((m) => m.done);

export type { CareerMindsetAnswer };
