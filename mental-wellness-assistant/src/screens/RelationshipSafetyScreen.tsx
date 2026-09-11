import React, { useEffect } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useCounseling } from "@/state/CounselingContext";
import { voiceService } from "@/voice/voiceService";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { resourcesForRegion } from "@/data/crisisResources";

type Props = NativeStackScreenProps<RootStackParamList, "RelationshipSafety">;

export default function RelationshipSafetyScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { resetCounseling } = useCounseling();
  const resources = [
    ...resourcesForRegion("IR", "domestic_violence"),
    ...resourcesForRegion("US", "domestic_violence"),
  ].filter((r, i, arr) => arr.findIndex((x) => x.phone === r.phone && x.region === r.region) === i);

  useEffect(() => {
    if (!voiceEnabled) return;
    const message =
      locale === "fa"
        ? "متأسفم که این را می‌شنوم. آنچه توصیف کردی می‌تواند نشانهٔ یک رابطهٔ ناسالم یا خطرناک باشد و مهم است که تنها با آن رو‌به‌رو نشوی. کنارت هستم تا چند راه برای کمک‌گرفتن را با هم مرور کنیم."
        : "I'm sorry to hear that. What you've described could be a sign of an unsafe relationship, and it matters that you don't face it alone. Let's go through a few ways to get support.";
    voiceService.speak(message, locale);
  }, [voiceEnabled, locale]);

  const call = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const iAmSafeNow = () => {
    resetCounseling();
    navigation.replace("Welcome");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>حرف‌هایت مهم است</Text>
      <Text style={styles.body}>
        چیزی که دربارهٔ رابطه‌ات گفتی می‌تواند نشانهٔ رفتار کنترل‌گر، تهدیدآمیز یا خشونت‌آمیز باشد. این
        دستیار نمی‌تواند دربارهٔ این موضوع به‌جای یک متخصص تصمیم بگیرد، اما می‌تواند چند راه برای
        دریافت کمک واقعی را نشانت بدهد.
      </Text>

      <Disclaimer text={DISCLAIMERS.relationshipSafetyNotSubstitute} tone="warning" />

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
        <Text style={styles.subheading}>چند نکته</Text>
        <Text style={styles.tip}>• حرف‌هایت را با یک فرد مورد اعتماد (خانواده، دوست نزدیک) در میان بگذار؛ تنها نمان.</Text>
        <Text style={styles.tip}>• جزئیات مهم (پیام‌ها، تاریخ‌ها) را برای خودت جایی امن یادداشت کن، اگر بعداً به کمک حقوقی نیاز داشتی.</Text>
        <Text style={styles.tip}>• یک مشاور خانواده یا روان‌شناس بالینی دارای مجوز می‌تواند برنامهٔ ایمنی مناسب شرایط خودت را با تو طراحی کند.</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={iAmSafeNow}>
        <Text style={styles.primaryButtonText}>الان در امنیت هستم، ادامه بده</Text>
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
  tip: { color: "#cbd5e1", fontSize: 13, textAlign: "right", marginTop: 6, lineHeight: 19 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 24 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
