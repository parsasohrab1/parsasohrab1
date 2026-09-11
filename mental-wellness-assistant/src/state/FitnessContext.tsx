import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AthleteStatus, ExercisePurpose, FitnessProfile, FitnessResult, WeightGoal } from "@/types";
import { scoreFitnessSession } from "@/engine/fitnessEngine";

interface FitnessState {
  sessionId: string;
  profile: FitnessProfile;
  result: FitnessResult | null;
}

interface FitnessApi extends FitnessState {
  setAthleteStatus: (v: AthleteStatus) => void;
  setExercisePurpose: (v: ExercisePurpose) => void;
  setWeightGoal: (v: WeightGoal) => void;
  setHeight: (heightCm: number) => void;
  /** Setting weight is the last wizard step — it also computes the result. */
  submitWeight: (weightKg: number) => void;
  resetFitness: () => void;
}

const makeSessionId = (): string => `fitness_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initialState = (): FitnessState => ({
  sessionId: makeSessionId(),
  profile: { athleteStatus: null, exercisePurpose: null, weightGoal: null, heightCm: null, weightKg: null },
  result: null,
});

const FitnessContext = createContext<FitnessApi | null>(null);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FitnessState>(initialState);

  const setAthleteStatus = useCallback((v: AthleteStatus) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, athleteStatus: v } }));
  }, []);

  const setExercisePurpose = useCallback((v: ExercisePurpose) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, exercisePurpose: v } }));
  }, []);

  const setWeightGoal = useCallback((v: WeightGoal) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, weightGoal: v } }));
  }, []);

  const setHeight = useCallback((heightCm: number) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, heightCm } }));
  }, []);

  const submitWeight = useCallback((weightKg: number) => {
    setState((prev) => {
      const profile = { ...prev.profile, weightKg };
      const result = scoreFitnessSession(prev.sessionId, profile);
      return { ...prev, profile, result };
    });
  }, []);

  const resetFitness = useCallback(() => {
    setState(initialState());
  }, []);

  const value = useMemo<FitnessApi>(
    () => ({ ...state, setAthleteStatus, setExercisePurpose, setWeightGoal, setHeight, submitWeight, resetFitness }),
    [state, setAthleteStatus, setExercisePurpose, setWeightGoal, setHeight, submitWeight, resetFitness]
  );

  return <FitnessContext.Provider value={value}>{children}</FitnessContext.Provider>;
};

export const useFitness = (): FitnessApi => {
  const ctx = useContext(FitnessContext);
  if (!ctx) throw new Error("useFitness must be used within a FitnessProvider");
  return ctx;
};
