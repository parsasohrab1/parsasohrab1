import React from "react";
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSession } from "@/state/SessionContext";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { voiceService } from "@/voice/voiceService";

export default function SettingsScreen() {
  const { locale, setLocale, voiceEnabled, setVoiceEnabled } = useSession();
  const listeningSupported = voiceService.isListeningSupported();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <Switch value={voiceEnabled} onValueChange={setVoiceEnabled} />
        <Text style={styles.rowLabel}>پاسخ‌گویی صوتی (متن‌به‌گفتار)</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.statusBadge}>{listeningSupported ? "فعال" : "غیرفعال — از تایپ استفاده کنید"}</Text>
        <Text style={styles.rowLabel}>تشخیص گفتار (گفتار‌به‌متن)</Text>
      </View>

      <Text style={styles.sectionTitle}>زبان</Text>
      <View style={styles.langRow}>
        <Pressable
          style={[styles.langChip, locale === "fa" && styles.langChipActive]}
          onPress={() => setLocale("fa")}
        >
          <Text style={styles.langChipText}>فارسی</Text>
        </Pressable>
        <Pressable
          style={[styles.langChip, locale === "en" && styles.langChipActive]}
          onPress={() => setLocale("en")}
        >
          <Text style={styles.langChipText}>English</Text>
        </Pressable>
      </View>

      <Disclaimer text={DISCLAIMERS.general} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  row: { flexDirection: "row-reverse", alignItems: "center", gap: 12 },
  rowLabel: { color: "#e2e8f0", fontSize: 15, flex: 1, textAlign: "right" },
  statusBadge: { color: "#94a3b8", fontSize: 12 },
  sectionTitle: { color: "#f8fafc", fontSize: 15, fontWeight: "700", textAlign: "right", marginTop: 8 },
  langRow: { flexDirection: "row", gap: 10 },
  langChip: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 18, borderWidth: 1, borderColor: "#475569" },
  langChipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  langChipText: { color: "#f1f5f9", fontWeight: "600" },
});
