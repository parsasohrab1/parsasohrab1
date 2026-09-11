import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import ProbabilityBar from "@/components/ProbabilityBar";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { tipsForCondition } from "@/data/supplementTips";

type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export default function ResultsScreen({ navigation }: Props) {
  const { result, locale, resetSession } = useSession();

  if (!result) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>هنوز نتیجه‌ای وجود ندارد.</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace("Welcome")}>
          <Text style={styles.primaryButtonText}>شروع گفتگو</Text>
        </Pressable>
      </View>
    );
  }

  const sortedScores = [...result.scores].sort((a, b) => b.likelihoodPercent - a.likelihoodPercent);
  const topTips = result.topConditionIds.flatMap((id) => tipsForCondition(id)).slice(0, 4);

  const restart = () => {
    resetSession();
    navigation.replace("Welcome");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>شاخص‌های احتمال (غیرتشخیصی)</Text>
      <Disclaimer text={DISCLAIMERS.screeningResult} />

      {sortedScores.length === 0 ? (
        <Text style={styles.noneText}>بر اساس پاسخ‌ها، نشانه قابل‌توجهی ثبت نشد. همچنان اگر حس خوبی ندارید، صحبت با یک متخصص می‌تواند کمک‌کننده باشد.</Text>
      ) : (
        sortedScores.map((s) => <ProbabilityBar key={s.conditionId} score={s} locale={locale} />)
      )}

      {result.referralFlags.includes("neuro_motor_referral") && (
        <Disclaimer text={DISCLAIMERS.neuroMotorReferral} tone="warning" />
      )}

      {topTips.length > 0 && (
        <View style={styles.tipsSection}>
          <Text style={styles.subheading}>پیشنهادهای سبک زندگی</Text>
          {topTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipText}>• {tip.tip[locale]}</Text>
            </View>
          ))}
          <Disclaimer text={DISCLAIMERS.supplement} />
        </View>
      )}

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Music")}>
          <Text style={styles.primaryButtonText}>پخش موسیقی متناسب با حالم</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={restart}>
          <Text style={styles.secondaryButtonText}>گفتگوی جدید</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  subheading: { color: "#f8fafc", fontSize: 16, fontWeight: "700", textAlign: "right", marginTop: 12, marginBottom: 6 },
  noneText: { color: "#cbd5e1", fontSize: 14, textAlign: "right", lineHeight: 20, marginVertical: 12 },
  tipsSection: { marginTop: 8 },
  tipCard: { backgroundColor: "#1e293b", borderRadius: 10, padding: 10, marginVertical: 4 },
  tipText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", lineHeight: 19 },
  actions: { gap: 10, marginTop: 20, marginBottom: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#475569" },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  emptyText: { color: "#cbd5e1", fontSize: 15 },
});
