import React from "react";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/state/SessionContext";
import { CookingProvider } from "@/state/CookingContext";
import RootNavigator from "@/navigation/RootNavigator";

export default function App() {
  return (
    <SessionProvider>
      <CookingProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </CookingProvider>
    </SessionProvider>
  );
}
