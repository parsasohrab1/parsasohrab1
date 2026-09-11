import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { voiceService } from "@/voice/voiceService";
import { identifyByText, localPlaceholderLyricsProvider } from "@/engine/songIdEngine";
import TrackCard from "@/components/TrackCard";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { SongIdMatch } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "SongId">;

export default function SongIdScreen({}: Props) {
  const { locale } = useSession();
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<SongIdMatch[] | null>(null);
  const [listening, setListening] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsUnavailable, setLyricsUnavailable] = useState(false);

  const listeningSupported = voiceService.isListeningSupported();

  const runSearch = () => {
    const results = identifyByText(query);
    setMatches(results);
    setSelectedTrackId(null);
    setLyrics(null);
    setLyricsUnavailable(false);
  };

  const startListening = async () => {
    try {
      setListening(true);
      const transcript = await voiceService.listen();
      setListening(false);
      if (transcript) {
        setQuery(transcript);
        const results = identifyByText(transcript);
        setMatches(results);
        setSelectedTrackId(null);
        setLyrics(null);
        setLyricsUnavailable(false);
      }
    } catch {
      setListening(false);
    }
  };

  const showLyrics = async (trackId: string) => {
    setSelectedTrackId(trackId);
    const result = await localPlaceholderLyricsProvider.getLyrics(trackId);
    setLyrics(result.lyrics);
    setLyricsUnavailable(result.source === "unavailable");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>پیدا کردن آهنگ</Text>
      <Disclaimer text={DISCLAIMERS.songIdLimitations} tone="warning" />

      <View style={styles.section}>
        <Text style={styles.question}>اسم آهنگ، اسم خواننده، یا چند کلمه‌ای که یادته رو بگو یا تایپ کن</Text>
        <View style={styles.inputRow}>
          {listeningSupported && (
            <Pressable style={[styles.micButton, listening && styles.micButtonActive]} onPress={startListening}>
              <Text style={styles.micIcon}>🎤</Text>
            </Pressable>
          )}
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder="مثلاً: golden hour یا بارون بهاری..."
            placeholderTextColor="#64748b"
            onSubmitEditing={runSearch}
          />
        </View>
        <Pressable style={styles.primaryButton} onPress={runSearch}>
          <Text style={styles.primaryButtonText}>جستجو در کاتالوگ محلی</Text>
        </Pressable>
      </View>

      {matches !== null && (
        <View style={styles.section}>
          <Text style={styles.question}>
            {matches.length > 0 ? `${matches.length} نتیجهٔ نزدیک پیدا شد:` : "چیزی تو کاتالوگ محلی پیدا نشد."}
          </Text>
          {matches.map((m) => (
            <View key={m.track.id}>
              <TrackCard track={m.track} />
              <Text style={styles.scoreText}>
                {locale === "fa" ? `شباهت متنی: ${m.score}٪` : `Text-match confidence: ${m.score}%`}
              </Text>
              <Pressable style={styles.secondaryButton} onPress={() => showLyrics(m.track.id)}>
                <Text style={styles.secondaryButtonText}>نمایش لیریکس (نمایشی)</Text>
              </Pressable>
              {selectedTrackId === m.track.id && (
                <View style={styles.lyricsBox}>
                  {lyrics ? (
                    <Text style={styles.lyricsText}>{lyrics}</Text>
                  ) : (
                    <Text style={styles.lyricsUnavailable}>
                      {lyricsUnavailable
                        ? "برای این آهنگ لیریکس نمایشی ثبت نشده."
                        : "در حال بارگذاری..."}
                    </Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 40 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 8 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },
  micButtonActive: { backgroundColor: "#dc2626" },
  micIcon: { fontSize: 18 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  scoreText: { color: "#94a3b8", fontSize: 11, textAlign: "right", marginTop: -2, marginBottom: 4 },
  secondaryButton: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
    marginBottom: 8,
  },
  secondaryButtonText: { color: "#cbd5e1", fontSize: 12, fontWeight: "600" },
  lyricsBox: { backgroundColor: "#0f172a", borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: "#334155" },
  lyricsText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", lineHeight: 20 },
  lyricsUnavailable: { color: "#64748b", fontSize: 12, textAlign: "right" },
});
