import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { ALL_MOODS, getPlaylistForMood, moodFromScreeningResult } from "@/engine/moodMusicEngine";
import { trackById } from "@/data/musicCatalog";
import TrackCard from "@/components/TrackCard";
import { Mood } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Music">;

const MOOD_LABEL: Record<Mood, { fa: string; en: string }> = {
  sad: { fa: "غمگین", en: "Sad" },
  anxious: { fa: "مضطرب", en: "Anxious" },
  angry: { fa: "عصبانی", en: "Angry" },
  numb: { fa: "بی‌حس", en: "Numb" },
  overwhelmed: { fa: "درمانده", en: "Overwhelmed" },
  lonely: { fa: "تنها", en: "Lonely" },
  hopeful: { fa: "امیدوار", en: "Hopeful" },
  calm: { fa: "آرام", en: "Calm" },
};

export default function MusicScreen({ navigation }: Props) {
  const { result, locale } = useSession();
  const suggested = result ? moodFromScreeningResult(result) : "calm";
  const [mood, setMood] = useState<Mood>(suggested);

  const playlist = useMemo(() => getPlaylistForMood(mood), [mood]);
  const tracks = playlist.trackIds.map((id) => trackById(id)).filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>الان چه حسی داری؟</Text>
      <View style={styles.moodGrid}>
        {ALL_MOODS.map((m) => (
          <Pressable
            key={m}
            style={[styles.moodChip, mood === m && styles.moodChipActive]}
            onPress={() => setMood(m)}
          >
            <Text style={[styles.moodChipText, mood === m && styles.moodChipTextActive]}>
              {MOOD_LABEL[m][locale]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.playlistTitle}>{playlist.title[locale]}</Text>
      {tracks.map((t) => (
        <TrackCard key={t.id} track={t} />
      ))}

      <Pressable style={styles.favoritesButton} onPress={() => navigation.navigate("FavoriteMusic")}>
        <Text style={styles.favoritesButtonText}>
          موسیقی مورد علاقه‌ام را پیدا و دسته‌بندی کن (باکلام/بی‌کلام، ایرانی/خارجی) ↗
        </Text>
      </Pressable>

      <Text style={styles.note}>
        فهرست بالا داده نمایشی است؛ فقط اولین قطعه یک تُن صوتی واقعی برای نمایش پخش دارد. در نسخه واقعی، این بخش
        باید به یک سرویس موسیقی مجاز مثل Spotify یا Apple Music وصل شود.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 12 },
  moodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  moodChip: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#475569",
  },
  moodChipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  moodChipText: { color: "#cbd5e1", fontSize: 13 },
  moodChipTextActive: { color: "#fff", fontWeight: "700" },
  playlistTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: "700", textAlign: "right", marginBottom: 8 },
  favoritesButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
  },
  favoritesButtonText: { color: "#60a5fa", fontSize: 13, textAlign: "center" },
  note: { color: "#64748b", fontSize: 12, textAlign: "right", marginTop: 16, lineHeight: 18 },
});
