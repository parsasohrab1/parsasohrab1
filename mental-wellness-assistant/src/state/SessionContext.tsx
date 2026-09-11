import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AnsweredQuestion,
  AnswerValue,
  CrisisAssessment,
  Locale,
  ScreeningQuestion,
  ScreeningResult,
} from "@/types";
import { questionById } from "@/data/questionBank";
import { getNextQuestionId, ScreeningMode, scoreSession } from "@/engine/screeningEngine";
import { assessCrisis } from "@/engine/crisisDetector";

interface SessionState {
  sessionId: string;
  mode: ScreeningMode;
  locale: Locale;
  voiceEnabled: boolean;
  answers: AnsweredQuestion[];
  currentQuestion: ScreeningQuestion | null;
  crisis: CrisisAssessment;
  result: ScreeningResult | null;
  isComplete: boolean;
}

interface SessionApi extends SessionState {
  startSession: (mode: ScreeningMode) => void;
  submitAnswer: (value: AnswerValue, freeText?: string) => void;
  submitFreeTextOnly: (freeText: string) => void;
  setLocale: (locale: Locale) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  resetSession: () => void;
}

const makeSessionId = (): string =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initialState = (): SessionState => ({
  sessionId: makeSessionId(),
  mode: "full",
  locale: "fa",
  voiceEnabled: true,
  answers: [],
  currentQuestion: null,
  crisis: { triggered: false, reasons: [], severity: "none" },
  result: null,
  isComplete: false,
});

const SessionContext = createContext<SessionApi | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SessionState>(initialState);

  const startSession = useCallback((mode: ScreeningMode) => {
    const firstId = getNextQuestionId([], [], mode);
    setState({
      ...initialState(),
      mode,
      currentQuestion: firstId ? questionById(firstId) ?? null : null,
    });
  }, []);

  const applyAnswer = useCallback(
    (value: AnswerValue, freeText?: string) => {
      setState((prev) => {
        if (!prev.currentQuestion) return prev;
        const answered: AnsweredQuestion = {
          questionId: prev.currentQuestion.id,
          conditionId: prev.currentQuestion.conditionId,
          value,
          freeText,
          answeredAt: new Date().toISOString(),
        };
        const answers = [...prev.answers, answered];
        const crisis = assessCrisis(answers);

        if (crisis.triggered) {
          return { ...prev, answers, crisis, currentQuestion: null, isComplete: true };
        }

        const answeredIds = answers.map((a) => a.questionId);
        const nextId = getNextQuestionId(answeredIds, answers, prev.mode);
        const nextQuestion = nextId ? questionById(nextId) ?? null : null;
        const isComplete = nextQuestion === null;
        const result = isComplete ? scoreSession(prev.sessionId, answers) : null;

        return { ...prev, answers, crisis, currentQuestion: nextQuestion, isComplete, result };
      });
    },
    []
  );

  const submitAnswer = useCallback(
    (value: AnswerValue, freeText?: string) => applyAnswer(value, freeText),
    [applyAnswer]
  );

  /** For the "type instead" fallback when the user writes prose rather
   *  than picking an option — maps free text to a coarse severity guess
   *  (keyword scan already runs inside assessCrisis regardless). */
  const submitFreeTextOnly = useCallback(
    (freeText: string) => {
      const lower = freeText.toLowerCase();
      const heavyWords = ["خیلی", "همیشه", "شدید", "always", "severe", "constantly"];
      const mildWords = ["کمی", "گاهی", "a little", "sometimes"];
      let guessed: AnswerValue = 1;
      if (heavyWords.some((w) => lower.includes(w))) guessed = 3;
      else if (mildWords.some((w) => lower.includes(w))) guessed = 1;
      applyAnswer(guessed, freeText);
    },
    [applyAnswer]
  );

  const setLocale = useCallback((locale: Locale) => {
    setState((prev) => ({ ...prev, locale }));
  }, []);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, voiceEnabled: enabled }));
  }, []);

  const resetSession = useCallback(() => {
    setState(initialState());
  }, []);

  const value = useMemo<SessionApi>(
    () => ({
      ...state,
      startSession,
      submitAnswer,
      submitFreeTextOnly,
      setLocale,
      setVoiceEnabled,
      resetSession,
    }),
    [state, startSession, submitAnswer, submitFreeTextOnly, setLocale, setVoiceEnabled, resetSession]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionApi => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
};
