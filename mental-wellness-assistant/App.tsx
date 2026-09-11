import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/state/SessionContext";
import { CookingProvider } from "@/state/CookingContext";
import { StoryProvider } from "@/state/StoryContext";
import { CounselingProvider } from "@/state/CounselingContext";
import { FitnessProvider } from "@/state/FitnessContext";
import RootNavigator from "@/navigation/RootNavigator";

export default function App() {
  return (
    <SessionProvider>
      <CookingProvider>
        <StoryProvider>
          <CounselingProvider>
            <FitnessProvider>
              <StatusBar style="light" />
              <RootNavigator />
            </FitnessProvider>
          </CounselingProvider>
        </StoryProvider>
      </CookingProvider>
    </SessionProvider>
  );
}
