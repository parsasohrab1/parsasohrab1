import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useCompanionProfile } from "@/state/useCompanionProfile";
import { useMoodLog } from "@/state/useMoodLog";
import { voiceService } from "@/voice/voiceService";
import { ALL_MOODS } from "@/engine/moodMusicEngine";
import { greeting, journalAcknowledgment, reflectionForMood, suggestionsForMood, summarizeRecentMoods } from "@/engine/companionEngine";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { CompanionSuggestion, Mood } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Companion">;

interface Turn {
  from: "assistant" | "user";
  text: string;
}

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

const SUGGESTION_TARGET: Record<CompanionSuggestion["kind"], keyof RootStackParamList> = {
  music: "Music",
  favorite_music: "FavoriteMusic",
  screening: "Screening",
  fitness: "Fitness",
  counseling: "Counseling",
  recipes: "Recipes",
  storytelling: "Storytelling",
};

export default function CompanionScreen({ navigation }: Props) {
  const { locale, voiceEnabled, startSession } = useSession();
  const { profile, loaded: profileLoaded, setName, addFact, removeFact } = useCompanionProfile();
  const { log, loaded: logLoaded, logMood } = useMoodLog();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [factDraft, setFactDraft] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState<CompanionSuggestion[]>([]);
  const initialized = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  const say = (text: string) => {
    setTurns((prev) => [...prev, { from: "assistant", text }]);
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  useEffect(() => {
    if (!profileLoaded || !logLoaded || initialized.current) return;
    initialized.current = true;
    say(greeting(profile.name, locale));
    const summary = summarizeRecentMoods(log);
    if (summary.totalEntries > 0 && summary.mostCommonMood) {
      const label = MOOD_LABEL[summary.mostCommonMood][locale];
      say(
        locale === "fa"
          ? `این چند روز اخیر، بیشتر حس «${label}» رو ثبت کرده بودی.`
          : `Over the last few days, you've mostly logged feeling "${label}".`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLoaded, logLoaded]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const pickMood = (mood: Mood) => {
    setTurns((prev) => [...prev, { from: "user", text: MOOD_LABEL[mood][locale] }]);
    logMood(mood);
    const reflection = reflectionForMood(mood);
    say(reflection[locale]);
    setActiveSuggestions(suggestionsForMood(mood));
  };

  const goToSuggestion = (s: CompanionSuggestion) => {
    if (s.kind === "screening") {
      startSession("quick");
    }
    navigation.navigate(SUGGESTION_TARGET[s.kind]);
  };

  const sendJournalEntry = () => {
    const text = draft.trim();
    if (!text) return;
    setTurns((prev) => [...prev, { from: "user", text }]);
    setDraft("");
    say(journalAcknowledgment()[locale]);
  };

  const startListening = async () => {
    try {
      setListening(true);
      const transcript = await voiceService.listen();
      setListening(false);
      if (transcript) setDraft(transcript);
    } catch {
      setListening(false);
    }
  };

  const submitName = () => {
    const name = nameDraft.trim();
    if (!name) return;
    setName(name);
    setTurns((prev) => [...prev, { from: "user", text: name }]);
    setNameDraft("");
    say(locale === "fa" ? `خوشحالم که اسمت رو دونستم، ${name}!` : `Great to know your name, ${name}!`);
  };

  const submitFact = () => {
    const fact = factDraft.trim();
    if (!fact) return;
    addFact(fact);
    setFactDraft("");
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={80}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.heading}>رفیق همراه</Text>
        <Disclaimer text={DISCLAIMERS.companionNotRealAI} tone="warning" />

        {!profile.name && (
          <View style={styles.section}>
            <Text style={styles.question}>اسمت چیه؟</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={nameDraft}
                onChangeText={setNameDraft}
                placeholder="اسمت..."
                placeholderTextColor="#64748b"
                onSubmitEditing={submitName}
              />
              <Pressable style={styles.sendButton} onPress={submitName}>
                <Text style={styles.sendText}>ثبت</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.chat}>
          {turns.map((t, i) => (
            <ChatBubble key={i} text={t.text} from={t.from} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>امروز حالت چطوره؟</Text>
          <View style={styles.chipRow}>
            {ALL_MOODS.map((m) => (
              <Pressable key={m} style={styles.chip} onPress={() => pickMood(m)}>
                <Text style={styles.chipText}>{MOOD_LABEL[m][locale]}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {activeSuggestions.length > 0 && (
          <View style={styles.section}>
            {activeSuggestions.map((s, i) => (
              <Pressable key={i} style={styles.secondaryButton} onPress={() => goToSuggestion(s)}>
                <Text style={styles.secondaryButtonText}>{s.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.question}>دربارهٔ من چی می‌دونی؟</Text>
          {profile.aboutMe.map((fact, i) => (
            <View key={i} style={styles.factRow}>
              <Text style={styles.factText}>• {fact}</Text>
              <Pressable onPress={() => removeFact(i)}>
                <Text style={styles.removeText}>حذف</Text>
              </Pressable>
            </View>
          ))}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={factDraft}
              onChangeText={setFactDraft}
              placeholder="مثلاً: عاشق نقاشی‌ام..."
              placeholderTextColor="#64748b"
              onSubmitEditing={submitFact}
            />
            <Pressable style={styles.sendButton} onPress={submitFact}>
              <Text style={styles.sendText}>افزودن</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputRow}>
        {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="هر چی دلت می‌خواد بگو..."
          placeholderTextColor="#64748b"
          onSubmitEditing={sendJournalEntry}
        />
        <Pressable style={styles.sendButton} onPress={sendJournalEntry}>
          <Text style={styles.sendText}>ارسال</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, gap: 4, paddingBottom: 16 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  chat: { marginVertical: 8 },
  section: { marginTop: 16, gap: 8 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  secondaryButton: { borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#475569", marginTop: 6 },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 13, fontWeight: "600" },
  factRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  factText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", flex: 1 },
  removeText: { color: "#f87171", fontSize: 12, marginStart: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  sendButton: { backgroundColor: "#2563eb", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: "#fff", fontWeight: "600" },
});
