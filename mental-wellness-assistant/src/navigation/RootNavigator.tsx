import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "@/screens/WelcomeScreen";
import ScreeningScreen from "@/screens/ScreeningScreen";
import ResultsScreen from "@/screens/ResultsScreen";
import CrisisScreen from "@/screens/CrisisScreen";
import MusicScreen from "@/screens/MusicScreen";
import FavoriteMusicScreen from "@/screens/FavoriteMusicScreen";
import RecipeScreen from "@/screens/RecipeScreen";
import CookingScreen from "@/screens/CookingScreen";
import StorytellingScreen from "@/screens/StorytellingScreen";
import StoryPlaybackScreen from "@/screens/StoryPlaybackScreen";
import CounselingScreen from "@/screens/CounselingScreen";
import CounselingResultsScreen from "@/screens/CounselingResultsScreen";
import RelationshipSafetyScreen from "@/screens/RelationshipSafetyScreen";
import FitnessScreen from "@/screens/FitnessScreen";
import FitnessResultsScreen from "@/screens/FitnessResultsScreen";
import SettingsScreen from "@/screens/SettingsScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Screening: undefined;
  Results: undefined;
  Crisis: undefined;
  Music: undefined;
  FavoriteMusic: undefined;
  Recipes: undefined;
  Cooking: undefined;
  Storytelling: undefined;
  StoryPlayback: undefined;
  Counseling: undefined;
  CounselingResults: undefined;
  RelationshipSafety: undefined;
  Fitness: undefined;
  FitnessResults: undefined;
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
        <Stack.Screen name="Recipes" component={RecipeScreen} options={{ title: "رسپی‌های جهانی" }} />
        <Stack.Screen
          name="Cooking"
          component={CookingScreen}
          options={{ title: "راهنمای گام‌به‌گام پخت" }}
        />
        <Stack.Screen
          name="Storytelling"
          component={StorytellingScreen}
          options={{ title: "قصه برای کودکان" }}
        />
        <Stack.Screen
          name="StoryPlayback"
          component={StoryPlaybackScreen}
          options={{ title: "قصه‌گویی", gestureEnabled: false }}
        />
        <Stack.Screen
          name="Counseling"
          component={CounselingScreen}
          options={{ title: "مشاورهٔ زناشویی" }}
        />
        <Stack.Screen
          name="CounselingResults"
          component={CounselingResultsScreen}
          options={{ title: "راهکارهای پیشنهادی" }}
        />
        <Stack.Screen
          name="RelationshipSafety"
          component={RelationshipSafetyScreen}
          options={{ title: "ایمنی رابطه", gestureEnabled: false }}
        />
        <Stack.Screen name="Fitness" component={FitnessScreen} options={{ title: "تغذیه و تناسب اندام" }} />
        <Stack.Screen
          name="FitnessResults"
          component={FitnessResultsScreen}
          options={{ title: "نتیجهٔ BMI" }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "تنظیمات" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
