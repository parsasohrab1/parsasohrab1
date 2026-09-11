import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useCooking } from "@/state/CookingContext";
import { searchRecipes } from "@/engine/recipeEngine";
import { CUISINES } from "@/data/cuisines";
import RecipeCard from "@/components/RecipeCard";
import { CuisineId } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Recipes">;

export default function RecipeScreen({ navigation }: Props) {
  const { locale } = useSession();
  const { startRecipe } = useCooking();
  const [text, setText] = useState("");
  const [cuisineId, setCuisineId] = useState<CuisineId | null>(null);

  const results = useMemo(
    () => searchRecipes({ text, cuisineId: cuisineId ?? undefined }),
    [text, cuisineId]
  );

  const beginCooking = (recipeId: string) => {
    const recipe = results.find((r) => r.id === recipeId);
    if (!recipe) return;
    startRecipe(recipe);
    navigation.navigate("Cooking");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>چه غذایی می‌خواهی بپزی؟</Text>
      <Text style={styles.subheading}>
        از بین آشپزی‌های ایرانی، فرانسوی، ایتالیایی، آمریکایی، چینی، فنلاندی، تایوانی، مکزیکی، ژاپنی،
        هندی، تایلندی و مدیترانه‌ای جستجو کن؛ بعد از انتخاب، دستیار مرحله‌به‌مرحله و با صدا راهنمایی‌ات
        می‌کند.
      </Text>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="نام غذا یا یک ماده اولیه را تایپ کن..."
        placeholderTextColor="#64748b"
      />

      <View style={styles.cuisineRow}>
        <Pressable
          style={[styles.cuisineChip, cuisineId === null && styles.cuisineChipActive]}
          onPress={() => setCuisineId(null)}
        >
          <Text style={[styles.cuisineChipText, cuisineId === null && styles.cuisineChipTextActive]}>
            همه
          </Text>
        </Pressable>
        {CUISINES.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.cuisineChip, cuisineId === c.id && styles.cuisineChipActive]}
            onPress={() => setCuisineId(c.id)}
          >
            <Text style={[styles.cuisineChipText, cuisineId === c.id && styles.cuisineChipTextActive]}>
              {c.name[locale]}
            </Text>
          </Pressable>
        ))}
      </View>

      {results.length === 0 && <Text style={styles.noneText}>رسپی‌ای با این مشخصات پیدا نشد.</Text>}
      {results.map((r) => (
        <RecipeCard key={r.id} recipe={r} locale={locale} onStart={() => beginCooking(r.id)} />
      ))}

      <Text style={styles.note}>
        این پایگاه‌داده یک نمونهٔ اولیهٔ قابل‌گسترش از چند آشپزی دنیاست، نه یک بانک اطلاعاتی کامل و
        نامحدود از «تمام غذاهای دنیا». برای پوشش کامل‌تر، یک سرویس رسپی واقعی (مثل Spoonacular یا
        Edamam) را پشت src/engine/recipeEngine.ts وصل کنید.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 6 },
  subheading: { color: "#cbd5e1", fontSize: 13, lineHeight: 19, textAlign: "right", marginBottom: 16 },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
    marginBottom: 12,
  },
  cuisineRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  cuisineChip: { borderRadius: 18, paddingVertical: 7, paddingHorizontal: 13, borderWidth: 1, borderColor: "#475569" },
  cuisineChipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  cuisineChipText: { color: "#cbd5e1", fontSize: 12 },
  cuisineChipTextActive: { color: "#fff", fontWeight: "700" },
  noneText: { color: "#94a3b8", fontSize: 13, textAlign: "right", marginTop: 12 },
  note: { color: "#64748b", fontSize: 12, textAlign: "right", marginTop: 20, lineHeight: 18 },
});
