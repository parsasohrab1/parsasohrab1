import React, { useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useCareerCoach } from "@/state/useCareerCoach";
import { voiceService } from "@/voice/voiceService";
import { inferMindset, milestonesForPath, progressSummary, recommendPaths } from "@/engine/careerCoachEngine";
import { MINDSET_QUESTIONS, PATH_LABEL } from "@/data/careerStrategies";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { CareerMindsetAnswer, CareerPath } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "CareerCoach">;

export default function CareerCoachScreen({}: Props) {
  const { locale, voiceEnabled } = useSession();
  const { profile, milestones, journal, loaded, startPath, toggleMilestone, addJournalEntry } = useCareerCoach();

  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [journalDraft, setJournalDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const say = (text: string) => {
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  const answerQuestion = (questionId: string, leansEntrepreneur: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: leansEntrepreneur }));
  };

  const allAnswered = MINDSET_QUESTIONS.every((q) => q.id in answers);

  const choosePath = (path: CareerPath) => {
    const mindsetAnswers: CareerMindsetAnswer[] = MINDSET_QUESTIONS.map((q) => ({
      questionId: q.id,
      leansEntrepreneur: answers[q.id],
    }));
    const mindset = inferMindset(mindsetAnswers);
    startPath({ mindset, chosenPath: path }, path);
    const intro =
      locale === "fa"
        ? `عالیه! این مسیر رو شروع کردیم: ${PATH_LABEL[path].fa}. اولین قدم رو تو چک‌لیست ببین.`
        : `Great! Starting this path: ${PATH_LABEL[path].en}. Check your first step in the checklist.`;
    say(intro);
  };

  const submitJournal = () => {
    if (!journalDraft.trim()) return;
    addJournalEntry(journalDraft);
    setJournalDraft("");
    say(locale === "fa" ? "ثبت شد. ادامه بده، دارم دنبالت می‌کنم." : "Logged. Keep going — I'm tracking your progress.");
  };

  if (!loaded) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>در حال بارگذاری...</Text>
      </ScrollView>
    );
  }

  if (!profile || !profile.chosenPath) {
    const mindsetAnswers: CareerMindsetAnswer[] = MINDSET_QUESTIONS.filter((q) => q.id in answers).map((q) => ({
      questionId: q.id,
      leansEntrepreneur: answers[q.id],
    }));
    const mindset = allAnswered ? inferMindset(mindsetAnswers) : null;
    const suggestedPaths = mindset ? recommendPaths(mindset) : [];

    return (
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.heading}>مشاور شغلی و کارآفرینی</Text>
        <Disclaimer text={DISCLAIMERS.careerCoachLimitations} tone="warning" />

        <View style={styles.section}>
          <Text style={styles.question}>چند سؤال کوتاه برای شناخت روحیه‌ات:</Text>
          {MINDSET_QUESTIONS.map((q) => (
            <View key={q.id} style={styles.subSection}>
              <Text style={styles.subQuestion}>{q.prompt[locale]}</Text>
              <View style={styles.chipColumn}>
                <Pressable
                  style={[styles.chip, answers[q.id] === false && styles.chipSelected]}
                  onPress={() => answerQuestion(q.id, false)}
                >
                  <Text style={styles.chipText}>{q.employeeOption[locale]}</Text>
                </Pressable>
                <Pressable
                  style={[styles.chip, answers[q.id] === true && styles.chipSelected]}
                  onPress={() => answerQuestion(q.id, true)}
                >
                  <Text style={styles.chipText}>{q.entrepreneurOption[locale]}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {allAnswered && mindset && (
          <View style={styles.section}>
            <Text style={styles.question}>
              {locale === "fa"
                ? `روحیهٔ تو بیشتر شبیه ${mindset === "entrepreneur" ? "کارآفرینی" : "کارمندی"}ه. یکی از این مسیرها رو انتخاب کن:`
                : `Your mindset leans more ${mindset === "entrepreneur" ? "entrepreneurial" : "employee"}. Pick one path:`}
            </Text>
            <View style={styles.chipColumn}>
              {suggestedPaths.map((path) => (
                <Pressable key={path} style={styles.primaryButton} onPress={() => choosePath(path)}>
                  <Text style={styles.primaryButtonText}>{PATH_LABEL[path][locale]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  const progress = progressSummary(milestones);

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{PATH_LABEL[profile.chosenPath][locale]}</Text>
      <Disclaimer text={DISCLAIMERS.careerCoachLimitations} tone="warning" />

      <View style={styles.section}>
        <Text style={styles.question}>
          {locale === "fa"
            ? `پیشرفت: ${progress.done} از ${progress.total} (${progress.percent}%)`
            : `Progress: ${progress.done}/${progress.total} (${progress.percent}%)`}
        </Text>
        {milestones.map((m) => (
          <Pressable key={m.id} style={styles.milestoneRow} onPress={() => toggleMilestone(m.id)}>
            <Text style={styles.milestoneCheck}>{m.done ? "☑" : "☐"}</Text>
            <Text style={[styles.milestoneText, m.done && styles.milestoneDone]}>{m.label[locale]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>دفترچهٔ پیشرفت</Text>
        <Text style={styles.subQuestion}>امروز چه قدمی برداشتی؟</Text>
        <TextInput
          style={styles.input}
          value={journalDraft}
          onChangeText={setJournalDraft}
          placeholder="یادداشت امروز..."
          placeholderTextColor="#64748b"
          onSubmitEditing={submitJournal}
        />
        <Pressable style={styles.primaryButton} onPress={submitJournal}>
          <Text style={styles.primaryButtonText}>ثبت</Text>
        </Pressable>
        {journal
          .slice()
          .reverse()
          .slice(0, 5)
          .map((entry, i) => (
            <View key={i} style={styles.journalRow}>
              <Text style={styles.journalDate}>{entry.date}</Text>
              <Text style={styles.journalNote}>{entry.note}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 40 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 8 },
  subSection: { marginTop: 12, gap: 6 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  subQuestion: { color: "#cbd5e1", fontSize: 13, textAlign: "right" },
  chipColumn: { gap: 8 },
  chip: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13, textAlign: "right" },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  milestoneRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  milestoneCheck: { color: "#60a5fa", fontSize: 16 },
  milestoneText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", flex: 1 },
  milestoneDone: { color: "#64748b", textDecorationLine: "line-through" },
  journalRow: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#1e293b", paddingTop: 6 },
  journalDate: { color: "#64748b", fontSize: 11, textAlign: "right" },
  journalNote: { color: "#cbd5e1", fontSize: 13, textAlign: "right", marginTop: 2 },
});
