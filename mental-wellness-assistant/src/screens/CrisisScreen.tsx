import React, { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { voiceService } from "@/voice/voiceService";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { resourcesForRegion } from "@/data/crisisResources";
import { BREATHING_SCRIPT, GENTLE_JOKES } from "@/data/comfortContent";

type Props = NativeStackScreenProps<RootStackParamList, "Crisis">;

export default function CrisisScreen({ navigation }: Props) {
  const { locale, voiceEnabled, resetSession, result } = useSession();
  const [joke, setJoke] = useState<string | null>(null);
  const resources = resourcesForRegion("IR");

  useEffect(() => {
    if (!voiceEnabled) return;
    const openingMessage =
      locale === "fa"
        ? "متوجه شدم که این لحظه ممکن است خیلی سخت باشد. تو تنها نیستی و کمک در دسترس است. بیایید اول چند نفس عمیق بکشیم و شماره‌های کمک را ببینیم."
        : "It sounds like this moment might be really hard. You're not alone, and help is available. Let's take a few deep breaths together and look at some support lines.";
    voiceService.speak(openingMessage, locale);
  }, [voiceEnabled, locale]);

  const call = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const playBreathing = async () => {
    for (const line of BREATHING_SCRIPT) {
      await voiceService.speak(line[locale], locale);
    }
  };

  const showJoke = () => {
    const pick = GENTLE_JOKES[Math.floor(Math.random() * GENTLE_JOKES.length)];
    setJoke(pick[locale]);
    if (voiceEnabled) voiceService.speak(pick[locale], locale);
  };

  const iAmSafeNow = () => {
    if (result) {
      navigation.replace("Results");
    } else {
      resetSession();
      navigation.replace("Welcome");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>تو تنها نیستی</Text>
      <Text style={styles.body}>
        متوجه شدیم که ممکن است این روزها بسیار سخت بگذرد. اگر همین الان در خطر فوری هستید یا فکر آسیب‌رساندن به
        خودتان دارید، لطفاً همین حالا با یکی از شماره‌های زیر تماس بگیرید یا نزد یک فرد مورد اعتماد بروید.
      </Text>

      <Disclaimer text={DISCLAIMERS.crisisNotSubstitute} tone="warning" />

      <View style={styles.resourceList}>
        {resources.map((r, i) => (
          <View key={i} style={styles.resourceCard}>
            <Text style={styles.resourceLabel}>{r.label[locale]}</Text>
            {r.phone ? (
              <Pressable style={styles.callButton} onPress={() => call(r.phone)}>
                <Text style={styles.callButtonText}>تماس با {r.phone}</Text>
              </Pressable>
            ) : (
              <Text style={styles.resourceNote}>{r.label[locale]}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>یک تمرین تنفس آرام</Text>
        <Pressable style={styles.secondaryButton} onPress={playBreathing}>
          <Text style={styles.secondaryButtonText}>شروع تمرین تنفس صوتی (4-7-8)</Text>
        </Pressable>
        {BREATHING_SCRIPT.map((line, i) => (
          <Text style={styles.breathLine} key={i}>
            {line[locale]}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>موسیقی آرام‌بخش</Text>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Music")}>
          <Text style={styles.secondaryButtonText}>پخش موسیقی آرام‌بخش</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.subheading}>کمی سبکی، فقط اگر آماده‌اید</Text>
        <Pressable style={styles.secondaryButton} onPress={showJoke}>
          <Text style={styles.secondaryButtonText}>یک جوک ملایم بشنوم</Text>
        </Pressable>
        {joke && <Text style={styles.jokeText}>{joke}</Text>}
      </View>

      <Pressable style={styles.primaryButton} onPress={iAmSafeNow}>
        <Text style={styles.primaryButtonText}>الان احساس امنیت دارم، ادامه بده</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  body: { color: "#e2e8f0", fontSize: 15, lineHeight: 22, textAlign: "right", marginBottom: 4 },
  resourceList: { gap: 8, marginVertical: 12 },
  resourceCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, gap: 8 },
  resourceLabel: { color: "#f1f5f9", fontSize: 14, textAlign: "right" },
  resourceNote: { color: "#94a3b8", fontSize: 12, textAlign: "right" },
  callButton: { backgroundColor: "#dc2626", borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  callButtonText: { color: "#fff", fontWeight: "700" },
  section: { marginTop: 16 },
  subheading: { color: "#f8fafc", fontSize: 16, fontWeight: "700", textAlign: "right", marginBottom: 8 },
  secondaryButton: { borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#475569" },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 14, fontWeight: "600" },
  breathLine: { color: "#94a3b8", fontSize: 12, textAlign: "right", marginTop: 6 },
  jokeText: { color: "#e2e8f0", fontSize: 14, textAlign: "right", marginTop: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 24 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
