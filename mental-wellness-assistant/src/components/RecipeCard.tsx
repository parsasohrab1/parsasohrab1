import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Locale, Recipe } from "@/types";
import { cuisineById } from "@/data/cuisines";

interface Props {
  recipe: Recipe;
  locale: Locale;
  onStart: () => void;
}

export default function RecipeCard({ recipe, locale, onStart }: Props) {
  const cuisine = cuisineById(recipe.cuisineId);
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.meta}>
          {recipe.totalTimeMinutes} دقیقه · {recipe.servings} نفر
        </Text>
        <Text style={styles.title}>{recipe.title[locale]}</Text>
      </View>
      {cuisine && <Text style={styles.cuisine}>{cuisine.name[locale]}</Text>}
      <Text style={styles.description}>{recipe.description[locale]}</Text>
      <Pressable style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>شروع پخت با راهنمای صوتی</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#1e293b", borderRadius: 14, padding: 14, marginVertical: 6 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "#f1f5f9", fontSize: 16, fontWeight: "700", textAlign: "right" },
  meta: { color: "#94a3b8", fontSize: 12 },
  cuisine: { color: "#60a5fa", fontSize: 12, textAlign: "right", marginTop: 4 },
  description: { color: "#cbd5e1", fontSize: 13, textAlign: "right", marginTop: 6, lineHeight: 19 },
  startButton: { backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 12 },
  startButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
