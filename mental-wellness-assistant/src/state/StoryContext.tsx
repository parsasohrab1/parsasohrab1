import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ChildAgeRange, ChildGender, NarrationStyle, Story, StepCommand } from "@/types";
import { matchStepCommand } from "@/engine/voiceCommands";
import { pickProtagonistName } from "@/engine/storytellingEngine";

interface StoryState {
  ageRange: ChildAgeRange | null;
  gender: ChildGender;
  style: NarrationStyle;
  protagonistName: string;
  story: Story | null;
  currentParagraphIndex: number;
  isFinished: boolean;
  repeatTick: number;
}

interface StoryApi extends StoryState {
  setAgeRange: (ageRange: ChildAgeRange) => void;
  setGender: (gender: ChildGender) => void;
  setStyle: (style: NarrationStyle) => void;
  startStory: (story: Story) => void;
  handleUtterance: (text: string) => StepCommand;
  endStory: () => void;
  resetSetup: () => void;
}

const initialState: StoryState = {
  ageRange: null,
  gender: "unspecified",
  style: "normal",
  protagonistName: pickProtagonistName("unspecified"),
  story: null,
  currentParagraphIndex: 1,
  isFinished: false,
  repeatTick: 0,
};

const StoryContext = createContext<StoryApi | null>(null);

export const StoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoryState>(initialState);

  const setAgeRange = useCallback((ageRange: ChildAgeRange) => {
    setState((prev) => ({ ...prev, ageRange }));
  }, []);

  const setGender = useCallback((gender: ChildGender) => {
    setState((prev) => ({ ...prev, gender, protagonistName: pickProtagonistName(gender) }));
  }, []);

  const setStyle = useCallback((style: NarrationStyle) => {
    setState((prev) => ({ ...prev, style }));
  }, []);

  const startStory = useCallback((story: Story) => {
    setState((prev) => ({ ...prev, story, currentParagraphIndex: 1, isFinished: false, repeatTick: 0 }));
  }, []);

  const endStory = useCallback(() => {
    setState((prev) => ({ ...prev, story: null, currentParagraphIndex: 1, isFinished: false, repeatTick: 0 }));
  }, []);

  const resetSetup = useCallback(() => {
    setState(initialState);
  }, []);

  const handleUtterance = useCallback((text: string): StepCommand => {
    const command = matchStepCommand(text);

    setState((prev) => {
      if (!prev.story) return prev;
      switch (command) {
        case "next": {
          const isLast = prev.currentParagraphIndex >= prev.story.paragraphs.length;
          return isLast
            ? { ...prev, isFinished: true }
            : { ...prev, currentParagraphIndex: prev.currentParagraphIndex + 1 };
        }
        case "previous":
          return { ...prev, currentParagraphIndex: Math.max(1, prev.currentParagraphIndex - 1) };
        case "repeat":
          return { ...prev, repeatTick: prev.repeatTick + 1 };
        case "stop":
          return { ...prev, story: null, currentParagraphIndex: 1, isFinished: false, repeatTick: 0 };
        default:
          return prev;
      }
    });

    return command;
  }, []);

  const value = useMemo<StoryApi>(
    () => ({ ...state, setAgeRange, setGender, setStyle, startStory, handleUtterance, endStory, resetSetup }),
    [state, setAgeRange, setGender, setStyle, startStory, handleUtterance, endStory, resetSetup]
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};

export const useStory = (): StoryApi => {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error("useStory must be used within a StoryProvider");
  return ctx;
};
