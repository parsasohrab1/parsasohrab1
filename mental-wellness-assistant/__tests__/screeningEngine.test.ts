import { AnsweredQuestion } from "@/types";
import {
  getNextQuestionId,
  scoreSession,
  totalQuestionBudget,
} from "@/engine/screeningEngine";
import { CORE_QUESTION_IDS_FULL, CORE_QUESTION_IDS_QUICK, questionById } from "@/data/questionBank";

const answer = (questionId: string, value: 0 | 1 | 2 | 3): AnsweredQuestion => {
  const q = questionById(questionId)!;
  return { questionId, conditionId: q.conditionId, value, answeredAt: new Date().toISOString() };
};

describe("getNextQuestionId", () => {
  it("walks the full core list in fixed order before any follow-up", () => {
    let answeredIds: string[] = [];
    const answers: AnsweredQuestion[] = [];
    for (const expectedId of CORE_QUESTION_IDS_FULL) {
      const next = getNextQuestionId(answeredIds, answers, "full");
      expect(next).toBe(expectedId);
      const a = answer(expectedId, 0);
      answers.push(a);
      answeredIds.push(expectedId);
    }
  });

  it("stops after 5 questions in quick mode with no follow-ups", () => {
    let answeredIds: string[] = [];
    const answers: AnsweredQuestion[] = [];
    for (const id of CORE_QUESTION_IDS_QUICK) {
      answers.push(answer(id, 0));
      answeredIds.push(id);
    }
    expect(getNextQuestionId(answeredIds, answers, "quick")).toBeNull();
    expect(totalQuestionBudget("quick")).toBe(5);
  });

  it("adds exactly 2 adaptive follow-ups in full mode, biased to the highest-scoring cluster", () => {
    let answeredIds: string[] = [];
    const answers: AnsweredQuestion[] = [];
    for (const id of CORE_QUESTION_IDS_FULL) {
      // Make depression score highest (value 3), everything else 0.
      const value = id === "core_depression" ? 3 : 0;
      answers.push(answer(id, value as 0 | 3));
      answeredIds.push(id);
    }

    const followup1 = getNextQuestionId(answeredIds, answers, "full");
    expect(followup1).toBe("followup_bipolar"); // first follow-up of the depression cluster
    answers.push(answer(followup1!, 0));
    answeredIds.push(followup1!);

    const followup2 = getNextQuestionId(answeredIds, answers, "full");
    expect(followup2).not.toBeNull();
    answers.push(answer(followup2!, 0));
    answeredIds.push(followup2!);

    expect(getNextQuestionId(answeredIds, answers, "full")).toBeNull();
    expect(totalQuestionBudget("full")).toBe(10);
  });
});

describe("scoreSession", () => {
  it("produces 0-100 likelihood percentages and a top-condition ranking", () => {
    const answers: AnsweredQuestion[] = [
      answer("core_depression", 3),
      answer("core_gad", 1),
      answer("core_adhd", 0),
    ];
    const result = scoreSession("test-session", answers);
    const depressionScore = result.scores.find((s) => s.conditionId === "depression");
    expect(depressionScore?.likelihoodPercent).toBe(100);
    expect(result.topConditionIds[0]).toBe("depression");
  });

  it("flags neuro_motor_referral without turning it into a psychiatric percentage", () => {
    const answers: AnsweredQuestion[] = [answer("core_neuro_motor", 3)];
    const result = scoreSession("test-session-2", answers);
    expect(result.referralFlags).toContain("neuro_motor_referral");
    expect(result.scores.find((s) => s.conditionId === "neuro_motor_referral")).toBeUndefined();
  });

  it("never scores a condition that was never asked about", () => {
    const answers: AnsweredQuestion[] = [answer("core_depression", 2)];
    const result = scoreSession("test-session-3", answers);
    expect(result.scores.every((s) => s.itemsAnswered > 0)).toBe(true);
    expect(result.scores.find((s) => s.conditionId === "bipolar")).toBeUndefined();
  });
});
