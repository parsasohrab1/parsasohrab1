import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useStyle } from "@/state/StyleContext";
import { voiceService } from "@/voice/voiceService";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";

type Props = NativeStackScreenProps<RootStackParamList, "StyleResults">;

export default function StyleResultsScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { result, selfPhotoUri, resetStyle } = useStyle();

  const speakAll = async () => {
    if (!result?.look) return;
    await voiceService.speak(result.look.name[locale], locale);
    for (const step of result.look.steps) {
      await voiceService.speak(step[locale], locale);
    }
    if (result.outfit) await voiceService.speak(result.outfit.note[locale], locale);
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
    resetStyle();
    navigation.replace("Welcome");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>پیشنهاد استایل</Text>
      <Disclaimer text={DISCLAIMERS.styleAdvisorLimitations} />

      {selfPhotoUri && <Image source={{ uri: selfPhotoUri }} style={styles.selfPhoto} />}

      <Pressable style={styles.replayButton} onPress={speakAll}>
        <Text style={styles.replayButtonText}>🔊 دوباره با صدا بشنو</Text>
      </Pressable>

      {result.look && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{result.look.name[locale]}</Text>
          {result.look.steps.map((s, i) => (
            <Text key={i} style={styles.stepText}>
              {i + 1}. {s[locale]}
            </Text>
          ))}
          <Text style={styles.note}>{result.look.note[locale]}</Text>
        </View>
      )}

      {result.outfit && result.outfit.items.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ترکیب لباس پیشنهادی</Text>
          <View style={styles.wardrobeGrid}>
            {result.outfit.items.map((item) => (
              <Image key={item.id} source={{ uri: item.photoUri }} style={styles.wardrobeThumb} />
            ))}
          </View>
          <Text style={styles.note}>{result.outfit.note[locale]}</Text>
        </View>
      )}

      {!result.outfit && (
        <Text style={styles.note}>
          هنوز عکسی از کمد لباستان ثبت نکرده‌اید، پس پیشنهاد ترکیب لباس نداریم — می‌توانید از صفحهٔ قبل چند عکس اضافه کنید.
        </Text>
      )}

      <Pressable style={styles.primaryButton} onPress={restart}>
        <Text style={styles.primaryButtonText}>گفتگوی جدید</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  selfPhoto: { width: "100%", height: 260, borderRadius: 14, marginVertical: 10 },
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
  card: { backgroundColor: "#1e293b", borderRadius: 14, padding: 14, marginVertical: 6, gap: 6 },
  cardTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: "700", textAlign: "right" },
  stepText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", lineHeight: 20 },
  note: { color: "#94a3b8", fontSize: 12, textAlign: "right", marginTop: 6, lineHeight: 18 },
  wardrobeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  wardrobeThumb: { width: 90, height: 90, borderRadius: 10 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 16 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
  emptyText: { color: "#cbd5e1", fontSize: 15 },
});
