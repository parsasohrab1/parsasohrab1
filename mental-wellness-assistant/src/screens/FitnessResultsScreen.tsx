import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useFitness } from "@/state/FitnessContext";
import { voiceService } from "@/voice/voiceService";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { BmiCategory } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "FitnessResults">;

const CATEGORY_LABELS: Record<BmiCategory, { fa: string; en: string }> = {
  underweight: { fa: "کمبود وزن", en: "Underweight" },
  normal: { fa: "وزن طبیعی", en: "Normal weight" },
  overweight: { fa: "اضافه وزن", en: "Overweight" },
  obese: { fa: "چاقی", en: "Obese" },
};

export default function FitnessResultsScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { result, resetFitness } = useFitness();

  const speakAll = async () => {
    if (!result) return;
    const categoryLabel = CATEGORY_LABELS[result.bmiCategory][locale];
    const intro =
      locale === "fa"
        ? `شاخص تودهٔ بدنی شما حدود ${result.bmi} است که در محدودهٔ «${categoryLabel}» قرار می‌گیرد.`
        : `Your body mass index is about ${result.bmi}, which falls in the "${categoryLabel}" range.`;
    await voiceService.speak(intro, locale);
    if (result.bmiLikelyUnreliable) {
      await voiceService.speak(
        locale === "fa"
          ? "چون ورزشکار هستید، این عدد ممکن است به‌خاطر توده عضلانی دقیق نباشد."
          : "Since you're an athlete, this number may be skewed by muscle mass.",
        locale
      );
    }
    if (result.cautionNote) {
      await voiceService.speak(result.cautionNote[locale], locale);
    }
    for (const s of [...result.nutritionStrategies, ...result.exerciseStrategies]) {
      await voiceService.speak(s.advice[locale], locale);
    }
  };

  useEffect(() => {
    if (voiceEnabled) speakAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, voiceEnabled]);

  if (!result) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>هنوز نتیجه‌ای وجود ندارد.</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace("Welcome")}>
          <Text style={styles.primaryButtonText}>بازگشت</Text>
        </Pressable>
      </View>
    );
  }

  const restart = () => {
    resetFitness();
    navigation.replace("Welcome");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>نتیجهٔ شاخص تودهٔ بدنی</Text>
      <Disclaimer text={DISCLAIMERS.fitnessNotSubstitute} />

      <View style={styles.bmiCard}>
        <Text style={styles.bmiValue}>{result.bmi}</Text>
        <Text style={styles.bmiCategory}>{CATEGORY_LABELS[result.bmiCategory][locale]}</Text>
        {result.bmiLikelyUnreliable && (
          <Text style={styles.bmiNote}>
            چون ورزشکار هستید، این عدد به‌تنهایی ممکن است دقیق نباشد (توده عضلانی را در نظر نمی‌گیرد).
          </Text>
        )}
      </View>

      {result.cautionNote && <Disclaimer text={result.cautionNote} tone="warning" />}

      <Pressable style={styles.replayButton} onPress={speakAll}>
        <Text style={styles.replayButtonText}>🔊 دوباره با صدا بشنو</Text>
      </Pressable>

      {result.nutritionStrategies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>پیشنهادهای تغذیه</Text>
          {result.nutritionStrategies.map((s) => (
            <View key={s.id} style={styles.strategyCard}>
              <Text style={styles.strategyText}>{s.advice[locale]}</Text>
              <Text style={styles.strategySource}>— {s.source[locale]}</Text>
            </View>
          ))}
        </View>
      )}

      {result.exerciseStrategies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>پیشنهادهای فعالیت بدنی</Text>
          {result.exerciseStrategies.map((s) => (
            <View key={s.id} style={styles.strategyCard}>
              <Text style={styles.strategyText}>{s.advice[locale]}</Text>
              <Text style={styles.strategySource}>— {s.source[locale]}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={restart}>
          <Text style={styles.primaryButtonText}>گفتگوی جدید</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  bmiCard: { backgroundColor: "#1e293b", borderRadius: 14, padding: 16, alignItems: "center", marginVertical: 10 },
  bmiValue: { color: "#f8fafc", fontSize: 36, fontWeight: "800" },
  bmiCategory: { color: "#93c5fd", fontSize: 16, fontWeight: "600", marginTop: 4 },
  bmiNote: { color: "#94a3b8", fontSize: 12, textAlign: "center", marginTop: 8, lineHeight: 18 },
  replayButton: {
    alignSelf: "flex-end",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#475569",
    marginBottom: 8,
  },
  replayButtonText: { color: "#e2e8f0", fontSize: 13 },
  section: { marginTop: 12 },
  sectionTitle: { color: "#f8fafc", fontSize: 16, fontWeight: "700", textAlign: "right", marginBottom: 8 },
  strategyCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginVertical: 5 },
  strategyText: { color: "#e2e8f0", fontSize: 14, textAlign: "right", lineHeight: 21 },
  strategySource: { color: "#64748b", fontSize: 11, textAlign: "right", marginTop: 6 },
  actions: { marginTop: 20, marginBottom: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  emptyText: { color: "#cbd5e1", fontSize: 15 },
});
