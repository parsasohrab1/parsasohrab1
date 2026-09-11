import React, { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useCounseling } from "@/state/CounselingContext";
import { voiceService } from "@/voice/voiceService";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";

type Props = NativeStackScreenProps<RootStackParamList, "CounselingResults">;

const TOPIC_LABELS: Record<string, { fa: string; en: string }> = {
  communication: { fa: "ارتباط کلامی", en: "Communication" },
  trust: { fa: "اعتماد", en: "Trust" },
  finances: { fa: "مسائل مالی", en: "Finances" },
  in_laws: { fa: "خانوادهٔ همسر", en: "In-laws" },
  conflict: { fa: "حل تعارض", en: "Conflict resolution" },
  expectations: { fa: "انتظارات", en: "Expectations" },
  premarital_readiness: { fa: "آمادگی برای ازدواج", en: "Premarital readiness" },
  connection: { fa: "صمیمیت و ارتباط عاطفی", en: "Emotional connection" },
  shared_decisions: { fa: "تصمیم‌گیری مشترک", en: "Shared decisions" },
  jealousy: { fa: "حسادت", en: "Jealousy" },
};

export default function CounselingResultsScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { result, resetCounseling } = useCounseling();

  const speakAll = async () => {
    if (!result) return;
    const intro =
      locale === "fa"
        ? "بر اساس گفتگویمان، این چند راهکار می‌تواند کمک‌کننده باشد."
        : "Based on our conversation, here are a few suggestions that might help.";
    await voiceService.speak(intro, locale);
    for (const strategy of result.recommendedStrategies) {
      await voiceService.speak(strategy.advice[locale], locale);
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
    resetCounseling();
    navigation.replace("Welcome");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>راهکارهای پیشنهادی</Text>
      <Disclaimer text={DISCLAIMERS.counselingNotSubstitute} />

      {result.topTopics.length > 0 && (
        <View style={styles.topicsRow}>
          {result.topTopics.map((t) => (
            <View key={t} style={styles.topicChip}>
              <Text style={styles.topicChipText}>{TOPIC_LABELS[t]?.[locale] ?? t}</Text>
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.replayButton} onPress={speakAll}>
        <Text style={styles.replayButtonText}>🔊 دوباره با صدا بشنو</Text>
      </Pressable>

      {result.recommendedStrategies.map((strategy) => (
        <View key={strategy.id} style={styles.strategyCard}>
          <Text style={styles.strategyText}>{strategy.advice[locale]}</Text>
          <Text style={styles.strategySource}>— {strategy.source[locale]}</Text>
        </View>
      ))}

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
  topicsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 10 },
  topicChip: { backgroundColor: "#1e293b", borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  topicChipText: { color: "#93c5fd", fontSize: 12 },
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
  strategyCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, marginVertical: 5 },
  strategyText: { color: "#e2e8f0", fontSize: 14, textAlign: "right", lineHeight: 21 },
  strategySource: { color: "#64748b", fontSize: 11, textAlign: "right", marginTop: 6 },
  actions: { marginTop: 20, marginBottom: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  emptyText: { color: "#cbd5e1", fontSize: 15 },
});
