import {
  CounselingAnswer,
  CounselingResult,
  MaritalStatus,
  RelationshipSafetyAssessment,
  RelationshipStrategy,
  RelationshipTopic,
  TopicScore,
} from "@/types";
import {
  CORE_COUNSELING_QUESTION_IDS,
  COUNSELING_FOLLOWUP_MAP,
  COUNSELING_QUESTIONS,
  counselingQuestionById,
} from "@/data/counselingQuestions";
import { strategiesForTopic } from "@/data/relationshipStrategies";

const FOLLOWUP_BUDGET = 3;
const MIN_RECOMMENDED_STRATEGIES = 3;
const MAX_RECOMMENDED_STRATEGIES = 5;

const appliesToStatus = (appliesTo: MaritalStatus[] | undefined, status: MaritalStatus | null): boolean =>
  !appliesTo || (status !== null && appliesTo.includes(status));

/** Core question ids, in fixed order, filtered to the ones relevant to
 *  this client's marital status. */
const coreQuestionIdsForStatus = (status: MaritalStatus | null): string[] =>
  CORE_COUNSELING_QUESTION_IDS.filter((id) => {
    const q = counselingQuestionById(id);
    return q ? appliesToStatus(q.appliesTo, status) : false;
  });

const answerValue = (answers: CounselingAnswer[], questionId: string): number =>
  answers.find((a) => a.questionId === questionId)?.value ?? 0;

/** Ranks the core topics that have a mapped follow-up, filtered to ones
 *  whose follow-up question actually applies to this status. */
const rankFollowupTopics = (answers: CounselingAnswer[], status: MaritalStatus | null): string[] => {
  const eligible = Object.entries(COUNSELING_FOLLOWUP_MAP).filter(([, followupId]) => {
    const q = counselingQuestionById(followupId);
    return q ? appliesToStatus(q.appliesTo, status) : false;
  });
  return eligible
    .map(([topic]) => topic)
    .sort((a, b) => {
      const coreIdFor = (topic: string) => COUNSELING_QUESTIONS.find((q) => q.stage === "core" && q.topic === topic)?.id;
      const sa = answerValue(answers, coreIdFor(a) ?? "");
      const sb = answerValue(answers, coreIdFor(b) ?? "");
      return sb - sa;
    });
};

export const getNextCounselingQuestionId = (
  answeredIds: string[],
  answers: CounselingAnswer[],
  status: MaritalStatus | null
): string | null => {
  const coreIds = coreQuestionIdsForStatus(status);
  const nextCore = coreIds.find((id) => !answeredIds.includes(id));
  if (nextCore) return nextCore;

  const rankedTopics = rankFollowupTopics(answers, status);
  const followupQueue = rankedTopics.map((t) => COUNSELING_FOLLOWUP_MAP[t]);
  const askedFollowups = answeredIds.filter((id) => followupQueue.includes(id));
  if (askedFollowups.length >= FOLLOWUP_BUDGET) return null;

  const nextFollowup = followupQueue.find((id) => !answeredIds.includes(id));
  return nextFollowup ?? null;
};

export const estimateQuestionBudget = (status: MaritalStatus | null): number =>
  coreQuestionIdsForStatus(status).length + FOLLOWUP_BUDGET;

const bandFor = (percent: number): TopicScore["band"] =>
  percent >= 67 ? "high" : percent >= 34 ? "moderate" : "low";

export const scoreTopics = (answers: CounselingAnswer[]): TopicScore[] => {
  const topics = Array.from(new Set(answers.map((a) => a.topic))).filter((t) => t !== "safety");
  return topics.map((topic) => {
    const items = answers.filter((a) => a.topic === topic);
    const raw = items.reduce((sum, a) => sum + a.value, 0);
    const max = items.length * 3;
    const concernPercent = max > 0 ? Math.round((raw / max) * 100) : 0;
    return {
      topic,
      itemsAnswered: items.length,
      concernPercent,
      band: bandFor(concernPercent),
    };
  });
};

export const recommendStrategies = (
  topicScores: TopicScore[],
  status: MaritalStatus | null
): RelationshipStrategy[] => {
  const ranked = [...topicScores].sort((a, b) => b.concernPercent - a.concernPercent);
  const picked: RelationshipStrategy[] = [];
  const seenIds = new Set<string>();

  const tryAddFromTopic = (topic: RelationshipTopic) => {
    for (const strategy of strategiesForTopic(topic)) {
      if (picked.length >= MAX_RECOMMENDED_STRATEGIES) return;
      if (seenIds.has(strategy.id)) continue;
      if (!appliesToStatus(strategy.appliesTo, status)) continue;
      picked.push(strategy);
      seenIds.add(strategy.id);
    }
  };

  for (const s of ranked) {
    if (picked.length >= MAX_RECOMMENDED_STRATEGIES) break;
    tryAddFromTopic(s.topic);
  }

  // Backfill from any remaining topics if the top-concern ones didn't
  // yield enough strategies, so the client always gets a useful list.
  if (picked.length < MIN_RECOMMENDED_STRATEGIES) {
    for (const s of ranked) {
      if (picked.length >= MIN_RECOMMENDED_STRATEGIES) break;
      tryAddFromTopic(s.topic);
    }
  }

  return picked.slice(0, MAX_RECOMMENDED_STRATEGIES);
};

/** Domestic-abuse / coercive-control keyword scan, separate from (and
 *  narrower than) the suicide-crisis keyword scan in crisisDetector.ts —
 *  callers should check both on any free-typed answer. */
const ABUSE_KEYWORDS: string[] = [
  "کتک",
  "می‌زنه",
  "میزنه",
  "تهدیدم کرد",
  "تهدید می‌کنه",
  "کنترل می‌کنه",
  "اجازه نمی‌ده",
  "اجازه نمیده",
  "hits me",
  "hit me",
  "beats me",
  "threatens me",
  "controls me",
  "won't let me",
  "wont let me",
  "abuse",
];

const containsAbuseKeyword = (text: string): boolean => {
  const t = text.toLowerCase().trim();
  return ABUSE_KEYWORDS.some((k) => t.includes(k.toLowerCase()));
};

export const assessRelationshipSafety = (answers: CounselingAnswer[]): RelationshipSafetyAssessment => {
  const reasons: string[] = [];
  let severity: RelationshipSafetyAssessment["severity"] = "none";

  const safetyAnswers = answers.filter((a) => a.topic === "safety");
  for (const a of safetyAnswers) {
    if (a.value >= 2) {
      severity = "urgent";
      reasons.push("safety_scale_high");
    } else if (a.value === 1 && severity === "none") {
      severity = "watch";
      reasons.push("safety_scale_mild");
    }
  }

  const freeTextHits = answers
    .map((a) => a.freeText)
    .filter((t): t is string => !!t && containsAbuseKeyword(t));
  if (freeTextHits.length > 0) {
    severity = "urgent";
    reasons.push("free_text_abuse_keyword_match");
  }

  return { triggered: severity !== "none", reasons, severity };
};

export const scoreCounselingSession = (
  sessionId: string,
  answers: CounselingAnswer[],
  status: MaritalStatus | null
): CounselingResult => {
  const topicScores = scoreTopics(answers);
  const topTopics = [...topicScores]
    .filter((s) => s.concernPercent > 0)
    .sort((a, b) => b.concernPercent - a.concernPercent)
    .slice(0, 3)
    .map((s) => s.topic);

  return {
    sessionId,
    completedAt: new Date().toISOString(),
    topicScores,
    topTopics,
    recommendedStrategies: recommendStrategies(topicScores, status),
    safety: assessRelationshipSafety(answers),
  };
};

export { counselingQuestionById };
