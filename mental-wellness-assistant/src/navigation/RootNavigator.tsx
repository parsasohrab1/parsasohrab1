import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "@/screens/WelcomeScreen";
import ScreeningScreen from "@/screens/ScreeningScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import CrisisScreen from "@/screens/CrisisScreen";
import MusicScreen from "@/screens/MusicScreen";
import FavoriteMusicScreen from "@/screens/FavoriteMusicScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Screening: undefined;
  Results: undefined;
  Crisis: undefined;
  Music: undefined;
  FavoriteMusic: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#f8fafc",
          contentStyle: { backgroundColor: "#0f172a" },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: "دستیار همراه ذهن" }} />
        <Stack.Screen name="Screening" component={ScreeningScreen} options={{ title: "گفتگوی غربالگری" }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: "نتیجه" }} />
        <Stack.Screen
          name="Crisis"
          component={CrisisScreen}
          options={{ title: "کمک فوری", gestureEnabled: false }}
        />
        <Stack.Screen name="Music" component={MusicScreen} options={{ title: "موسیقی آرام‌بخش" }} />
        <Stack.Screen
          name="FavoriteMusic"
          component={FavoriteMusicScreen}
          options={{ title: "موسیقی مورد علاقه" }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "تنظیمات" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
