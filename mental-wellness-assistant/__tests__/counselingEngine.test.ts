import { CounselingAnswer } from "@/types";
import {
  assessRelationshipSafety,
  estimateQuestionBudget,
  getNextCounselingQuestionId,
  recommendStrategies,
  scoreCounselingSession,
  scoreTopics,
} from "@/engine/counselingEngine";
import { CORE_COUNSELING_QUESTION_IDS, counselingQuestionById } from "@/data/counselingQuestions";

const answer = (questionId: string, value: 0 | 1 | 2 | 3, freeText?: string): CounselingAnswer => {
  const q = counselingQuestionById(questionId)!;
  return { questionId, topic: q.topic, value, freeText, answeredAt: new Date().toISOString() };
};

describe("getNextCounselingQuestionId", () => {
  it("skips the engaged-only premarital-readiness question for a married client", () => {
    let answeredIds: string[] = [];
    const answers: CounselingAnswer[] = [];
    const expectedForMarried = CORE_COUNSELING_QUESTION_IDS.filter((id) => id !== "cq_premarital_readiness");

    for (const expectedId of expectedForMarried) {
      const next = getNextCounselingQuestionId(answeredIds, answers, "married");
      expect(next).toBe(expectedId);
      answers.push(answer(expectedId, 0));
      answeredIds.push(expectedId);
    }
  });

  it("asks the premarital-readiness question for an engaged client", () => {
    let answeredIds: string[] = [];
    const answers: CounselingAnswer[] = [];
    for (const expectedId of CORE_COUNSELING_QUESTION_IDS) {
      const next = getNextCounselingQuestionId(answeredIds, answers, "engaged");
      expect(next).toBe(expectedId);
      answers.push(answer(expectedId, 0));
      answeredIds.push(expectedId);
    }
  });

  it("adds up to 3 adaptive follow-ups after the core questions, then stops", () => {
    let answeredIds: string[] = [];
    const answers: CounselingAnswer[] = [];
    const coreForMarried = CORE_COUNSELING_QUESTION_IDS.filter((id) => id !== "cq_premarital_readiness");
    for (const id of coreForMarried) {
      answers.push(answer(id, 0));
      answeredIds.push(id);
    }

    let followupCount = 0;
    let next = getNextCounselingQuestionId(answeredIds, answers, "married");
    while (next) {
      followupCount++;
      answers.push(answer(next, 0));
      answeredIds.push(next);
      next = getNextCounselingQuestionId(answeredIds, answers, "married");
    }
    expect(followupCount).toBe(3);
    expect(estimateQuestionBudget("married")).toBe(coreForMarried.length + 3);
  });

  it("never asks the married-only shared-decisions follow-up for an engaged client", () => {
    let answeredIds: string[] = [];
    const answers: CounselingAnswer[] = [];
    // Make finances the highest-concern core topic so shared_decisions
    // would be its mapped follow-up if it were eligible.
    for (const id of CORE_COUNSELING_QUESTION_IDS) {
      const value = id === "cq_finances" ? 3 : 0;
      answers.push(answer(id, value as 0 | 3));
      answeredIds.push(id);
    }
    const askedFollowups: string[] = [];
    let next = getNextCounselingQuestionId(answeredIds, answers, "engaged");
    while (next) {
      askedFollowups.push(next);
      answers.push(answer(next, 0));
      answeredIds.push(next);
      next = getNextCounselingQuestionId(answeredIds, answers, "engaged");
    }
    expect(askedFollowups).not.toContain("cq_shared_decisions");
  });
});

describe("scoreTopics / scoreCounselingSession", () => {
  it("never includes the safety topic in the scored topics", () => {
    const answers: CounselingAnswer[] = [answer("cq_safety", 0), answer("cq_trust", 2)];
    const scores = scoreTopics(answers);
    expect(scores.find((s) => s.topic === "safety")).toBeUndefined();
    expect(scores.find((s) => s.topic === "trust")).toBeDefined();
  });

  it("produces 0-100 concern percentages and ranks the top topic first", () => {
    const answers: CounselingAnswer[] = [answer("cq_trust", 3), answer("cq_communication", 1)];
    const result = scoreCounselingSession("test-session", answers, "married");
    const trust = result.topicScores.find((s) => s.topic === "trust");
    expect(trust?.concernPercent).toBe(100);
    expect(result.topTopics[0]).toBe("trust");
  });
});

describe("recommendStrategies", () => {
  it("returns strategies relevant to the highest-concern topic first", () => {
    const answers: CounselingAnswer[] = [answer("cq_finances", 3)];
    const result = scoreCounselingSession("test-session-2", answers, "married");
    expect(result.recommendedStrategies.length).toBeGreaterThan(0);
    expect(result.recommendedStrategies[0].topics).toContain("finances");
  });

  it("never recommends the engaged-only premarital strategy to a married client", () => {
    const answers: CounselingAnswer[] = [answer("cq_expectations", 3)];
    const result = scoreCounselingSession("test-session-3", answers, "married");
    expect(result.recommendedStrategies.find((s) => s.id === "rs_premarital_topics")).toBeUndefined();
    for (const strategy of result.recommendedStrategies) {
      if (strategy.appliesTo) expect(strategy.appliesTo).toContain("married");
    }
  });

  it("always returns at least a few strategies even with minimal answers", () => {
    const strategies = recommendStrategies(scoreTopics([answer("cq_communication", 1)]), "married");
    expect(strategies.length).toBeGreaterThanOrEqual(3);
  });
});

describe("assessRelationshipSafety", () => {
  it("reports no risk when the safety answer is 0", () => {
    const result = assessRelationshipSafety([answer("cq_safety", 0)]);
    expect(result.triggered).toBe(false);
  });

  it("flags 'urgent' for a high safety-scale answer", () => {
    const result = assessRelationshipSafety([answer("cq_safety", 3)]);
    expect(result.triggered).toBe(true);
    expect(result.severity).toBe("urgent");
  });

  it("flags 'urgent' when free text mentions abusive behavior, even with a low scale answer", () => {
    const result = assessRelationshipSafety([answer("cq_trust", 0, "او همیشه تهدیدم می‌کنه و کنترل می‌کنه")]);
    expect(result.triggered).toBe(true);
    expect(result.severity).toBe("urgent");
  });

  it("does not confuse ordinary free text with an abuse disclosure", () => {
    const result = assessRelationshipSafety([answer("cq_trust", 0, "کلا رابطه خوبیه، فقط گاهی سر برنامه‌ریزی بحث داریم")]);
    expect(result.triggered).toBe(false);
  });
});
