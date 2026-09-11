import { CareerMilestone, CareerMindsetAnswer } from "@/types";
import { inferMindset, milestonesForPath, pathCompleted, progressSummary, recommendPaths } from "@/engine/careerCoachEngine";
import { MINDSET_QUESTIONS } from "@/data/careerStrategies";

const allAnswers = (leaningEntrepreneur: boolean[]): CareerMindsetAnswer[] =>
  MINDSET_QUESTIONS.map((q, i) => ({ questionId: q.id, leansEntrepreneur: leaningEntrepreneur[i] }));

describe("inferMindset", () => {
  it("infers entrepreneur when the majority of answers lean that way", () => {
    expect(inferMindset(allAnswers([true, true, false]))).toBe("entrepreneur");
    expect(inferMindset(allAnswers([true, true, true]))).toBe("entrepreneur");
  });

  it("infers employee when the majority of answers lean that way", () => {
    expect(inferMindset(allAnswers([false, false, true]))).toBe("employee");
    expect(inferMindset(allAnswers([false, false, false]))).toBe("employee");
  });
});

describe("recommendPaths", () => {
  it("returns a non-empty, distinct path list for each mindset", () => {
    const employeePaths = recommendPaths("employee");
    const entrepreneurPaths = recommendPaths("entrepreneur");
    expect(employeePaths.length).toBeGreaterThan(0);
    expect(entrepreneurPaths.length).toBeGreaterThan(0);
    expect(employeePaths).toContain("resume_applications");
    expect(entrepreneurPaths).toContain("business_startup");
  });

  it("includes skill_building as a shared recommendation", () => {
    expect(recommendPaths("employee")).toContain("skill_building");
    expect(recommendPaths("entrepreneur")).toContain("skill_building");
  });
});

describe("milestonesForPath", () => {
  it("returns a fresh, unchecked milestone list for every path", () => {
    for (const path of ["resume_applications", "internship", "skill_building", "freelancing", "business_startup"] as const) {
      const milestones = milestonesForPath(path);
      expect(milestones.length).toBeGreaterThan(0);
      expect(milestones.every((m) => m.done === false)).toBe(true);
    }
  });

  it("returns independent copies so mutating one call doesn't affect another", () => {
    const first = milestonesForPath("resume_applications");
    first[0].done = true;
    const second = milestonesForPath("resume_applications");
    expect(second[0].done).toBe(false);
  });
});

describe("progressSummary", () => {
  const milestone = (id: string, done: boolean): CareerMilestone => ({ id, label: { fa: "", en: "" }, done });

  it("computes done/total/percent correctly", () => {
    const milestones = [milestone("a", true), milestone("b", false), milestone("c", true), milestone("d", false)];
    expect(progressSummary(milestones)).toEqual({ total: 4, done: 2, percent: 50 });
  });

  it("handles an empty list without dividing by zero", () => {
    expect(progressSummary([])).toEqual({ total: 0, done: 0, percent: 0 });
  });
});

describe("pathCompleted", () => {
  const milestone = (id: string, done: boolean): CareerMilestone => ({ id, label: { fa: "", en: "" }, done });

  it("is false for an empty list", () => {
    expect(pathCompleted([])).toBe(false);
  });

  it("is false when at least one milestone is unchecked", () => {
    expect(pathCompleted([milestone("a", true), milestone("b", false)])).toBe(false);
  });

  it("is true when every milestone is checked", () => {
    expect(pathCompleted([milestone("a", true), milestone("b", true)])).toBe(true);
  });
});
