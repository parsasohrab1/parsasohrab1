import {
  AnsweredQuestion,
  ConditionScore,
  ScreeningResult,
} from "@/types";
import {
  CORE_QUESTION_IDS_FULL,
  CORE_QUESTION_IDS_QUICK,
  FOLLOWUP_MAP,
  QUESTIONS,
  SCOREABLE_CONDITION_IDS,
  questionById,
} from "@/data/questionBank";
import { assessCrisis } from "./crisisDetector";

export type ScreeningMode = "quick" | "full";

const FOLLOWUP_BUDGET = 2;

/** All follow-up question ids, in the fixed cluster-priority order used
 *  for the "first round, then second round" interleaving. */
const CLUSTER_PRIORITY = Object.keys(FOLLOWUP_MAP);

const coreClusterQuestionId = (conditionId: string): string | undefined =>
  QUESTIONS.find((q) => q.stage === "core" && q.conditionId === conditionId)?.id;

const answerValue = (answers: AnsweredQuestion[], questionId: string): number =>
  answers.find((a) => a.questionId === questionId)?.value ?? 0;

/** Ranks the 5 core, follow-up-eligible clusters by their core-item score. */
const rankClusters = (answers: AnsweredQuestion[]): string[] => {
  return [...CLUSTER_PRIORITY].sort((a, b) => {
    const qa = coreClusterQuestionId(a);
    const qb = coreClusterQuestionId(b);
    const sa = qa ? answerValue(answers, qa) : 0;
    const sb = qb ? answerValue(answers, qb) : 0;
    return sb - sa; // descending; stable sort keeps CLUSTER_PRIORITY order on ties
  });
};

const orderedFollowupQueue = (answers: AnsweredQuestion[]): string[] => {
  const ranked = rankClusters(answers);
  const firstRound = ranked.map((c) => FOLLOWUP_MAP[c]?.[0]).filter((x): x is string => !!x);
  const secondRound = ranked.map((c) => FOLLOWUP_MAP[c]?.[1]).filter((x): x is string => !!x);
  return [...firstRound, ...secondRound];
};

/**
 * Adaptive question selector. Pure function of the questions answered so
 * far — call it after every answer to get the next question, or null
 * when the session is complete (5 questions in quick mode, up to 10 in
 * full mode).
 */
export const getNextQuestionId = (
  answeredIds: string[],
  answers: AnsweredQuestion[],
  mode: ScreeningMode
): string | null => {
  const coreIds = mode === "quick" ? CORE_QUESTION_IDS_QUICK : CORE_QUESTION_IDS_FULL;
  const nextCore = coreIds.find((id) => !answeredIds.includes(id));
  if (nextCore) return nextCore;

  if (mode === "quick") return null;

  const askedFollowups = answeredIds.filter((id) =>
    orderedFollowupQueue(answers).includes(id)
  );
  if (askedFollowups.length >= FOLLOWUP_BUDGET) return null;

  const queue = orderedFollowupQueue(answers).filter((id) => !answeredIds.includes(id));
  return queue[0] ?? null;
};

export const totalQuestionBudget = (mode: ScreeningMode): number =>
  mode === "quick" ? CORE_QUESTION_IDS_QUICK.length : CORE_QUESTION_IDS_FULL.length + FOLLOWUP_BUDGET;

const bandFor = (percent: number): ConditionScore["band"] => {
  if (percent >= 75) return "high";
  if (percent >= 50) return "elevated";
  if (percent >= 25) return "moderate";
  return "low";
};

const scoreCondition = (
  conditionId: string,
  answers: AnsweredQuestion[]
): ConditionScore | null => {
  const items = answers.filter((a) => a.conditionId === conditionId);
  if (items.length === 0) return null;
  const rawScore = items.reduce((sum, a) => sum + a.value, 0);
  const maxPossible = items.length * 3;
  const likelihoodPercent = Math.round((rawScore / maxPossible) * 100);
  return {
    conditionId,
    itemsAnswered: items.length,
    rawScore,
    maxPossible,
    likelihoodPercent,
    band: bandFor(likelihoodPercent),
  };
};

/**
 * Turns a completed (or in-progress) set of answers into a screening
 * result. Heuristic, non-clinical scoring — see DISCLAIMERS.screeningResult,
 * which every consumer of this result must render alongside it.
 */
export const scoreSession = (
  sessionId: string,
  answers: AnsweredQuestion[]
): ScreeningResult => {
  const scores = SCOREABLE_CONDITION_IDS.map((id) => scoreCondition(id, answers)).filter(
    (s): s is ConditionScore => s !== null
  );

  const topConditionIds = [...scores]
    .filter((s) => s.likelihoodPercent > 0)
    .sort((a, b) => b.likelihoodPercent - a.likelihoodPercent)
    .slice(0, 3)
    .map((s) => s.conditionId);

  const referralFlags: string[] = [];
  const motorAnswer = answers.find((a) => a.conditionId === "neuro_motor_referral");
  if (motorAnswer && motorAnswer.value >= 2) {
    referralFlags.push("neuro_motor_referral");
  }

  return {
    sessionId,
    completedAt: new Date().toISOString(),
    scores,
    topConditionIds,
    referralFlags,
    crisis: assessCrisis(answers),
  };
};

export { questionById };
