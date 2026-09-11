import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Recipe, StepCommand } from "@/types";
import { matchStepCommand } from "@/engine/recipeEngine";

interface CookingState {
  recipe: Recipe | null;
  currentStepIndex: number;
  isFinished: boolean;
  /** Increments on a "repeat" command so the screen can re-trigger
   *  speech even though the step index itself didn't change. */
  repeatTick: number;
}

interface CookingApi extends CookingState {
  startRecipe: (recipe: Recipe) => void;
  handleUtterance: (text: string) => StepCommand;
  endCooking: () => void;
}

const initialState: CookingState = {
  recipe: null,
  currentStepIndex: 1,
  isFinished: false,
  repeatTick: 0,
};

const CookingContext = createContext<CookingApi | null>(null);

export const CookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CookingState>(initialState);

  const startRecipe = useCallback((recipe: Recipe) => {
    setState({ recipe, currentStepIndex: 1, isFinished: false, repeatTick: 0 });
  }, []);

  const endCooking = useCallback(() => {
    setState(initialState);
  }, []);

  const handleUtterance = useCallback((text: string): StepCommand => {
    const command = matchStepCommand(text);

    setState((prev) => {
      if (!prev.recipe) return prev;
      switch (command) {
        case "next": {
          const isLast = prev.currentStepIndex >= prev.recipe.steps.length;
          return isLast ? { ...prev, isFinished: true } : { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
        }
        case "previous":
          return { ...prev, currentStepIndex: Math.max(1, prev.currentStepIndex - 1) };
        case "repeat":
          return { ...prev, repeatTick: prev.repeatTick + 1 };
        case "stop":
          return initialState;
        default:
          return prev;
      }
    });

    return command;
  }, []);

  const value = useMemo<CookingApi>(
    () => ({ ...state, startRecipe, handleUtterance, endCooking }),
    [state, startRecipe, handleUtterance, endCooking]
  );

  return <CookingContext.Provider value={value}>{children}</CookingContext.Provider>;
};

export const useCooking = (): CookingApi => {
  const ctx = useContext(CookingContext);
  if (!ctx) throw new Error("useCooking must be used within a CookingProvider");
  return ctx;
};
