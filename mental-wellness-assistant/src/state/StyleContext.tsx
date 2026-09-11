import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ApplicationPreference, BudgetLevel, MakeupLook, Occasion, OutfitSuggestion, StyleResult } from "@/types";

interface StyleState {
  sessionId: string;
  occasion: Occasion | null;
  budget: BudgetLevel | null;
  applicationPreference: ApplicationPreference | null;
  selfPhotoUri: string | null;
  result: StyleResult | null;
}

interface StyleApi extends StyleState {
  setOccasion: (v: Occasion) => void;
  setBudget: (v: BudgetLevel) => void;
  setApplicationPreference: (v: ApplicationPreference) => void;
  setSelfPhotoUri: (uri: string | null) => void;
  finish: (look: MakeupLook | null, outfit: OutfitSuggestion | null) => void;
  resetStyle: () => void;
}

const makeSessionId = (): string => `style_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const initialState = (): StyleState => ({
  sessionId: makeSessionId(),
  occasion: null,
  budget: null,
  applicationPreference: null,
  selfPhotoUri: null,
  result: null,
});

const StyleContext = createContext<StyleApi | null>(null);

export const StyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StyleState>(initialState);

  const setOccasion = useCallback((v: Occasion) => setState((prev) => ({ ...prev, occasion: v })), []);
  const setBudget = useCallback((v: BudgetLevel) => setState((prev) => ({ ...prev, budget: v })), []);
  const setApplicationPreference = useCallback(
    (v: ApplicationPreference) => setState((prev) => ({ ...prev, applicationPreference: v })),
    []
  );
  const setSelfPhotoUri = useCallback((uri: string | null) => setState((prev) => ({ ...prev, selfPhotoUri: uri })), []);

  const finish = useCallback((look: MakeupLook | null, outfit: OutfitSuggestion | null) => {
    setState((prev) => ({
      ...prev,
      result: { sessionId: prev.sessionId, completedAt: new Date().toISOString(), look, outfit },
    }));
  }, []);

  const resetStyle = useCallback(() => setState(initialState()), []);

  const value = useMemo<StyleApi>(
    () => ({
      ...state,
      setOccasion,
      setBudget,
      setApplicationPreference,
      setSelfPhotoUri,
      finish,
      resetStyle,
    }),
    [state, setOccasion, setBudget, setApplicationPreference, setSelfPhotoUri, finish, resetStyle]
  );

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
};

export const useStyle = (): StyleApi => {
  const ctx = useContext(StyleContext);
  if (!ctx) throw new Error("useStyle must be used within a StyleProvider");
  return ctx;
};
