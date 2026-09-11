import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSession } from "@/state/SessionContext";
import { useFavoriteMusic } from "@/state/useFavoriteMusic";
import {
  categorizeTracks,
  localCatalogProvider,
  recommendForProfile,
  remoteInternetProvider,
} from "@/engine/musicSearchEngine";
import { TRACKS } from "@/data/musicCatalog";
import TrackCard from "@/components/TrackCard";
import { MusicTrack, OriginPreference, VocalPreference } from "@/types";

const VOCAL_OPTIONS: { value: VocalPreference; label: { fa: string; en: string } }[] = [
  { value: "both", label: { fa: "هر دو", en: "Both" } },
  { value: "vocal", label: { fa: "باکلام", en: "Vocal" } },
  { value: "instrumental", label: { fa: "بی‌کلام", en: "Instrumental" } },
];

const ORIGIN_OPTIONS: { value: OriginPreference; label: { fa: string; en: string } }[] = [
  { value: "both", label: { fa: "هر دو", en: "Both" } },
  { value: "iranian", label: { fa: "ایرانی", en: "Iranian" } },
  { value: "foreign", label: { fa: "خارجی", en: "Foreign" } },
];

const CATEGORY_LABELS: Record<string, { fa: string; en: string }> = {
  vocalIranian: { fa: "باکلام ایرانی", en: "Vocal · Iranian" },
  vocalForeign: { fa: "باکلام خارجی", en: "Vocal · Foreign" },
  instrumentalIranian: { fa: "بی‌کلام ایرانی", en: "Instrumental · Iranian" },
  instrumentalForeign: { fa: "بی‌کلام خارجی", en: "Instrumental · Foreign" },
};

export default function FavoriteMusicScreen() {
  const { locale } = useSession();
  const {
    profile,
    addArtist,
    removeArtist,
    addGenre,
    removeGenre,
    setVocalPreference,
    setOriginPreference,
  } = useFavoriteMusic();

  const [artistDraft, setArtistDraft] = useState("");
  const [genreDraft, setGenreDraft] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<MusicTrack[] | null>(null);
  const [internetNotice, setInternetNotice] = useState<string | null>(null);

  const recommended = useMemo(() => recommendForProfile(profile, TRACKS).slice(0, 12), [profile]);
  const categorized = useMemo(() => categorizeTracks(recommended), [recommended]);

  const runLocalSearch = async () => {
    setInternetNotice(null);
    const tracks = await localCatalogProvider.search({
      text: searchText,
      vocal: profile.vocalPreference,
      origin: profile.originPreference,
    });
    setSearchResults(tracks);
  };

  const tryInternetSearch = async () => {
    try {
      await remoteInternetProvider.search({ text: searchText });
    } catch (err) {
      setInternetNotice(err instanceof Error ? err.message : String(err));
    }
  };

  const renderCategory = (key: keyof typeof categorized) => {
    const tracks = categorized[key];
    if (tracks.length === 0) return null;
    return (
      <View style={styles.categoryBlock} key={key}>
        <Text style={styles.categoryTitle}>
          {CATEGORY_LABELS[key][locale]} ({tracks.length})
        </Text>
        {tracks.map((t) => (
          <TrackCard key={t.id} track={t} />
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>موسیقی مورد علاقه‌ات</Text>
      <Text style={styles.subheading}>
        هنرمندان و ژانرهای موردعلاقه‌ات را اضافه کن تا دستیار پیشنهادهای بهتری از بین موزیک‌های باکلام،
        بی‌کلام، ایرانی و خارجی به تو بدهد.
      </Text>

      <Text style={styles.sectionTitle}>هنرمندان مورد علاقه</Text>
      <View style={styles.chipRow}>
        {profile.favoriteArtists.map((a) => (
          <Pressable key={a} style={styles.chip} onPress={() => removeArtist(a)}>
            <Text style={styles.chipText}>{a} ✕</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={artistDraft}
          onChangeText={setArtistDraft}
          placeholder="نام هنرمند..."
          placeholderTextColor="#64748b"
          onSubmitEditing={() => {
            addArtist(artistDraft);
            setArtistDraft("");
          }}
        />
        <Pressable
          style={styles.addButton}
          onPress={() => {
            addArtist(artistDraft);
            setArtistDraft("");
          }}
        >
          <Text style={styles.addButtonText}>افزودن</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>ژانرهای مورد علاقه</Text>
      <View style={styles.chipRow}>
        {profile.favoriteGenres.map((g) => (
          <Pressable key={g} style={styles.chip} onPress={() => removeGenre(g)}>
            <Text style={styles.chipText}>{g} ✕</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={genreDraft}
          onChangeText={setGenreDraft}
          placeholder="مثلاً پاپ، سنتی، راک..."
          placeholderTextColor="#64748b"
          onSubmitEditing={() => {
            addGenre(genreDraft);
            setGenreDraft("");
          }}
        />
        <Pressable
          style={styles.addButton}
          onPress={() => {
            addGenre(genreDraft);
            setGenreDraft("");
          }}
        >
          <Text style={styles.addButtonText}>افزودن</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>باکلام یا بی‌کلام؟</Text>
      <View style={styles.optionRow}>
        {VOCAL_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.optionChip, profile.vocalPreference === opt.value && styles.optionChipActive]}
            onPress={() => setVocalPreference(opt.value)}
          >
            <Text
              style={[
                styles.optionChipText,
                profile.vocalPreference === opt.value && styles.optionChipTextActive,
              ]}
            >
              {opt.label[locale]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>ایرانی یا خارجی؟</Text>
      <View style={styles.optionRow}>
        {ORIGIN_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={[styles.optionChip, profile.originPreference === opt.value && styles.optionChipActive]}
            onPress={() => setOriginPreference(opt.value)}
          >
            <Text
              style={[
                styles.optionChipText,
                profile.originPreference === opt.value && styles.optionChipTextActive,
              ]}
            >
              {opt.label[locale]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>جستجو در کاتالوگ</Text>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="نام آهنگ، هنرمند یا ژانر..."
          placeholderTextColor="#64748b"
          onSubmitEditing={runLocalSearch}
        />
        <Pressable style={styles.addButton} onPress={runLocalSearch}>
          <Text style={styles.addButtonText}>جستجو</Text>
        </Pressable>
      </View>
      <Pressable style={styles.internetButton} onPress={tryInternetSearch}>
        <Text style={styles.internetButtonText}>جستجوی اینترنتی (نسخه نمایشی)</Text>
      </Pressable>
      {internetNotice && <Text style={styles.internetNotice}>{internetNotice}</Text>}

      {searchResults && (
        <View style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>نتایج جستجو ({searchResults.length})</Text>
          {searchResults.length === 0 && <Text style={styles.noneText}>چیزی در کاتالوگ محلی پیدا نشد.</Text>}
          {searchResults.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>پیشنهادهای دسته‌بندی‌شده برای تو</Text>
      {renderCategory("vocalIranian")}
      {renderCategory("vocalForeign")}
      {renderCategory("instrumentalIranian")}
      {renderCategory("instrumentalForeign")}

      <Text style={styles.note}>
        این پیشنهادها از کاتالوگ نمایشی محلی این اپ می‌آیند (نه جستجوی زنده اینترنت). برای اتصال واقعی به
        اینترنت و سرویس‌های موسیقی مجاز (مثل Spotify، YouTube Music یا رادیو جوان)، فایل
        src/engine/musicSearchEngine.ts نقطه اتصال آماده دارد.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 6 },
  subheading: { color: "#cbd5e1", fontSize: 13, lineHeight: 19, textAlign: "right", marginBottom: 16 },
  sectionTitle: { color: "#f8fafc", fontSize: 15, fontWeight: "700", textAlign: "right", marginTop: 18, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: { backgroundColor: "#1e293b", borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { color: "#e2e8f0", fontSize: 13 },
  addRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  addButton: { backgroundColor: "#2563eb", borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" },
  addButtonText: { color: "#fff", fontWeight: "600" },
  optionRow: { flexDirection: "row", gap: 8 },
  optionChip: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  optionChipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  optionChipText: { color: "#cbd5e1", fontSize: 13 },
  optionChipTextActive: { color: "#fff", fontWeight: "700" },
  internetButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#475569",
    borderStyle: "dashed",
  },
  internetButtonText: { color: "#94a3b8", fontSize: 13 },
  internetNotice: { color: "#f59e0b", fontSize: 12, textAlign: "right", marginTop: 8, lineHeight: 18 },
  categoryBlock: { marginTop: 12 },
  categoryTitle: { color: "#f1f5f9", fontSize: 14, fontWeight: "700", textAlign: "right", marginBottom: 6 },
  noneText: { color: "#94a3b8", fontSize: 13, textAlign: "right" },
  note: { color: "#64748b", fontSize: 12, textAlign: "right", marginTop: 20, lineHeight: 18 },
});
