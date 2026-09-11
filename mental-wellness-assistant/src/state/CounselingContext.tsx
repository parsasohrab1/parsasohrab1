import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AnswerValue,
  ClientGenderRole,
  CounselingAnswer,
  CounselingQuestion,
  CounselingResult,
  MaritalStatus,
  RelationshipSafetyAssessment,
} from "@/types";
import { counselingQuestionById } from "@/data/counselingQuestions";
import {
  assessRelationshipSafety,
  getNextCounselingQuestionId,
  scoreCounselingSession,
} from "@/engine/counselingEngine";
import { textLooksLikeCrisis } from "@/engine/crisisDetector";

interface CounselingState {
  sessionId: string;
  status: MaritalStatus | null;
  genderRole: ClientGenderRole;
  answers: CounselingAnswer[];
  currentQuestion: CounselingQuestion | null;
  isComplete: boolean;
  result: CounselingResult | null;
  safety: RelationshipSafetyAssessment;
  /** Set when a free-typed answer looks like suicidal ideation — distinct
   *  from relationship-safety/abuse risk, and routes to the app's main
   *  suicide-crisis screen instead of RelationshipSafetyScreen. */
  suicideRiskDetected: boolean;
}

interface CounselingApi extends CounselingState {
  startProfile: (status: MaritalStatus, genderRole: ClientGenderRole) => void;
  submitAnswer: (value: AnswerValue, freeText?: string) => void;
  resetCounseling: () => void;
}

const makeSessionId = (): string =>
  `counseling_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const noSafety: RelationshipSafetyAssessment = { triggered: false, reasons: [], severity: "none" };

const initialState = (): CounselingState => ({
  sessionId: makeSessionId(),
  status: null,
  genderRole: "woman",
  answers: [],
  currentQuestion: null,
  isComplete: false,
  result: null,
  safety: noSafety,
  suicideRiskDetected: false,
});

const CounselingContext = createContext<CounselingApi | null>(null);

export const CounselingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CounselingState>(initialState);

  const startProfile = useCallback((status: MaritalStatus, genderRole: ClientGenderRole) => {
    const firstId = getNextCounselingQuestionId([], [], status);
    setState({
      ...initialState(),
      status,
      genderRole,
      currentQuestion: firstId ? counselingQuestionById(firstId) ?? null : null,
    });
  }, []);

  const submitAnswer = useCallback((value: AnswerValue, freeText?: string) => {
    setState((prev) => {
      if (!prev.currentQuestion) return prev;

      const answered: CounselingAnswer = {
        questionId: prev.currentQuestion.id,
        topic: prev.currentQuestion.topic,
        value,
        freeText,
        answeredAt: new Date().toISOString(),
      };
      const answers = [...prev.answers, answered];

      if (freeText && textLooksLikeCrisis(freeText)) {
        return { ...prev, answers, suicideRiskDetected: true, currentQuestion: null, isComplete: true };
      }

      const safety = assessRelationshipSafety(answers);
      if (safety.triggered) {
        return { ...prev, answers, safety, currentQuestion: null, isComplete: true };
      }

      const answeredIds = answers.map((a) => a.questionId);
      const nextId = getNextCounselingQuestionId(answeredIds, answers, prev.status);
      const nextQuestion = nextId ? counselingQuestionById(nextId) ?? null : null;
      const isComplete = nextQuestion === null;
      const result = isComplete ? scoreCounselingSession(prev.sessionId, answers, prev.status) : null;

      return { ...prev, answers, safety, currentQuestion: nextQuestion, isComplete, result };
    });
  }, []);

  const resetCounseling = useCallback(() => {
    setState(initialState());
  }, []);

  const value = useMemo<CounselingApi>(
    () => ({ ...state, startProfile, submitAnswer, resetCounseling }),
    [state, startProfile, submitAnswer, resetCounseling]
  );

  return <CounselingContext.Provider value={value}>{children}</CounselingContext.Provider>;
};

export const useCounseling = (): CounselingApi => {
  const ctx = useContext(CounselingContext);
  if (!ctx) throw new Error("useCounseling must be used within a CounselingProvider");
  return ctx;
};
