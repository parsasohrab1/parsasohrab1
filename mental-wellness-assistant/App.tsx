import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/state/SessionContext";
import { CookingProvider } from "@/state/CookingContext";
import { StoryProvider } from "@/state/StoryContext";
import RootNavigator from "@/navigation/RootNavigator";

export default function App() {
  return (
    <SessionProvider>
      <CookingProvider>
        <StoryProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </StoryProvider>
      </CookingProvider>
    </SessionProvider>
  );
}
