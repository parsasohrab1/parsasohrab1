import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const { startSession } = useSession();

  const begin = (mode: "quick" | "full") => {
    startSession(mode);
    navigation.navigate("Screening");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>دستیار همراه ذهن</Text>
      <Text style={styles.subtitle}>
        یک گفتگوی کوتاه صوتی یا نوشتاری، برای فهمیدن این‌که این روزها چه می‌گذرد و پیشنهاد کمک مناسب —
        موسیقی آرام‌بخش، پیشنهادهای سبک زندگی، یا در صورت نیاز، راه‌های دریافت کمک فوری.
      </Text>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.primaryButton} onPress={() => begin("full")}>
          <Text style={styles.primaryButtonText}>شروع گفتگوی کامل (تا ۱۰ پرسش)</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => begin("quick")}>
          <Text style={styles.secondaryButtonText}>گفتگوی سریع (۵ پرسش)</Text>
        </Pressable>
      </View>

      <Pressable style={styles.textLink} onPress={() => navigation.navigate("Music")}>
        <Text style={styles.textLinkText}>فقط می‌خواهم موسیقی آرام‌بخش گوش بدهم ↗</Text>
      </Pressable>
      <Pressable style={styles.textLink} onPress={() => navigation.navigate("FavoriteMusic")}>
        <Text style={styles.textLinkText}>موسیقی مورد علاقه‌ام را پیدا و دسته‌بندی کن ↗</Text>
      </Pressable>
      <Pressable style={styles.textLink} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.textLinkText}>تنظیمات زبان و صدا ↗</Text>
      </Pressable>

      <Disclaimer text={DISCLAIMERS.screeningResult} />
      <Disclaimer text={DISCLAIMERS.crisisNotSubstitute} tone="warning" />
      <Disclaimer text={DISCLAIMERS.general} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 32, gap: 4 },
  title: { color: "#f8fafc", fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 12 },
  subtitle: { color: "#cbd5e1", fontSize: 15, lineHeight: 22, textAlign: "right", marginBottom: 24 },
  buttonGroup: { gap: 12, marginBottom: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  secondaryButton: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
  },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 15, fontWeight: "600" },
  textLink: { paddingVertical: 10, alignItems: "center" },
  textLinkText: { color: "#60a5fa", fontSize: 14 },
});
