import React, { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useQuitCoach } from "@/state/useQuitCoach";
import { voiceService } from "@/voice/voiceService";
import { buildQuitPlan, computeStreak, encouragementForCheckIn, requiresMedicalCaution } from "@/engine/quitCoachEngine";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { AddictionType, QuitTrigger } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "QuitCoach">;

const ADDICTION_LABEL: Record<AddictionType, { fa: string; en: string }> = {
  smoking: { fa: "سیگار", en: "Smoking" },
  alcohol: { fa: "الکل", en: "Alcohol" },
  drugs: { fa: "مواد مخدر", en: "Drugs" },
  other: { fa: "عادت دیگر", en: "Another habit" },
};

const TRIGGER_LABEL: Record<QuitTrigger, { fa: string; en: string }> = {
  stress: { fa: "استرس", en: "Stress" },
  social: { fa: "جمع‌های دوستانه", en: "Social settings" },
  boredom: { fa: "بی‌حوصلگی", en: "Boredom" },
  habit_routine: { fa: "روتین/عادت ثابت", en: "Routine/habit" },
  physical_craving: { fa: "میل جسمی", en: "Physical craving" },
  other: { fa: "چیز دیگری", en: "Something else" },
};

const CRAVING_LEVELS = [0, 1, 2, 3, 4, 5];

export default function QuitCoachScreen({}: Props) {
  const { locale, voiceEnabled } = useSession();
  const { profile, checkIns, loaded, setProfile, logCheckIn, hasCheckedInToday } = useQuitCoach();

  const [addictionType, setAddictionType] = useState<AddictionType | null>(null);
  const [otherDescription, setOtherDescription] = useState("");
  const [dailyAmount, setDailyAmount] = useState("");
  const [yearsOfHabit, setYearsOfHabit] = useState("");
  const [pastQuitAttempts, setPastQuitAttempts] = useState("");
  const [primaryTrigger, setPrimaryTrigger] = useState<QuitTrigger | null>(null);
  const [motivation, setMotivation] = useState("");

  const [cravingLevel, setCravingLevel] = useState(0);
  const [checkInNote, setCheckInNote] = useState("");
  const [lastEncouragement, setLastEncouragement] = useState<string | null>(null);

  const spokenPlan = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const say = (text: string) => {
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  useEffect(() => {
    if (!loaded || !profile || spokenPlan.current) return;
    spokenPlan.current = true;
    const plan = buildQuitPlan(profile);
    const intro =
      locale === "fa"
        ? `این یک برنامهٔ تدریجی برای توئه. مرحلهٔ اول: ${plan[0].advice.fa}`
        : `Here's a gradual plan for you. Step one: ${plan[0].advice.en}`;
    say(intro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, profile]);

  const submitProfile = () => {
    if (!addictionType) return;
    setProfile({
      addictionType,
      otherDescription: addictionType === "other" ? otherDescription.trim() || null : null,
      dailyAmount: dailyAmount.trim() || null,
      yearsOfHabit: yearsOfHabit.trim() ? Number(yearsOfHabit) : null,
      pastQuitAttempts: pastQuitAttempts.trim() ? Number(pastQuitAttempts) : null,
      primaryTrigger,
      motivation: motivation.trim() || null,
    });
  };

  const submitCheckIn = (usedSubstance: boolean) => {
    logCheckIn(usedSubstance, cravingLevel, checkInNote.trim() || undefined);
    const msg = encouragementForCheckIn({ usedSubstance });
    setLastEncouragement(msg[locale]);
    say(msg[locale]);
    setCheckInNote("");
    setCravingLevel(0);
  };

  if (!loaded) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>در حال بارگذاری...</Text>
      </ScrollView>
    );
  }

  if (!profile) {
    return (
      <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
        <Text style={styles.heading}>ترک عادت، قدم‌به‌قدم</Text>
        <Disclaimer text={DISCLAIMERS.quitCoachMedicalSupervision} tone="warning" />

        <View style={styles.section}>
          <Text style={styles.question}>چه چیزی رو می‌خوای ترک کنی؟</Text>
          <View style={styles.chipRow}>
            {(Object.keys(ADDICTION_LABEL) as AddictionType[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.chip, addictionType === t && styles.chipSelected]}
                onPress={() => setAddictionType(t)}
              >
                <Text style={styles.chipText}>{ADDICTION_LABEL[t][locale]}</Text>
              </Pressable>
            ))}
          </View>
          {addictionType === "other" && (
            <TextInput
              style={styles.input}
              value={otherDescription}
              onChangeText={setOtherDescription}
              placeholder="این عادت چیه؟"
              placeholderTextColor="#64748b"
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>معمولاً چقدر/چند بار مصرف می‌کنی؟ (اختیاری)</Text>
          <TextInput
            style={styles.input}
            value={dailyAmount}
            onChangeText={setDailyAmount}
            placeholder="مثلاً: روزی ۱۰ نخ سیگار..."
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>چند ساله این عادت رو داری؟ (اختیاری)</Text>
          <TextInput
            style={styles.input}
            value={yearsOfHabit}
            onChangeText={setYearsOfHabit}
            keyboardType="numeric"
            placeholder="مثلاً: ۵"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>قبلاً چند بار تلاش کردی ترک کنی؟ (اختیاری)</Text>
          <TextInput
            style={styles.input}
            value={pastQuitAttempts}
            onChangeText={setPastQuitAttempts}
            keyboardType="numeric"
            placeholder="مثلاً: ۲"
            placeholderTextColor="#64748b"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>معمولاً چی باعث میل به مصرف می‌شه؟</Text>
          <View style={styles.chipRow}>
            {(Object.keys(TRIGGER_LABEL) as QuitTrigger[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.chip, primaryTrigger === t && styles.chipSelected]}
                onPress={() => setPrimaryTrigger(t)}
              >
                <Text style={styles.chipText}>{TRIGGER_LABEL[t][locale]}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.question}>دلیل اصلیت برای ترک چیه؟ (اختیاری)</Text>
          <TextInput
            style={styles.input}
            value={motivation}
            onChangeText={setMotivation}
            placeholder="مثلاً: برای سلامتی بچه‌هام..."
            placeholderTextColor="#64748b"
          />
        </View>

        <Pressable
          style={[styles.primaryButton, !addictionType && styles.disabledButton]}
          disabled={!addictionType}
          onPress={submitProfile}
        >
          <Text style={styles.primaryButtonText}>ساخت برنامهٔ ترک</Text>
        </Pressable>
      </ScrollView>
    );
  }

  const plan = buildQuitPlan(profile);
  const streak = computeStreak(checkIns);
  const caution = requiresMedicalCaution(profile.addictionType);

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>برنامهٔ ترک تو</Text>
      {caution && <Disclaimer text={DISCLAIMERS.quitCoachMedicalSupervision} tone="warning" />}

      <View style={styles.section}>
        <Text style={styles.question}>وضعیت فعلی</Text>
        <Text style={styles.statLine}>
          {locale === "fa"
            ? `روزهای متوالی بدون مصرف: ${streak.currentStreakDays} — تعداد کل ثبت‌ها: ${streak.totalCheckIns}`
            : `Consecutive substance-free days: ${streak.currentStreakDays} — total check-ins: ${streak.totalCheckIns}`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>قدم‌های برنامه</Text>
        {plan.map((s) => (
          <View key={s.order} style={styles.planStep}>
            <Text style={styles.planStepTitle}>
              {s.order}. {s.title[locale]}
            </Text>
            <Text style={styles.planStepAdvice}>{s.advice[locale]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>{hasCheckedInToday ? "امروز ثبت شد ✓" : "چک‌این امروز"}</Text>
        <Text style={styles.subQuestion}>میزان میل امروزت چقدره؟ (۰ تا ۵)</Text>
        <View style={styles.chipRow}>
          {CRAVING_LEVELS.map((lvl) => (
            <Pressable
              key={lvl}
              style={[styles.chip, cravingLevel === lvl && styles.chipSelected]}
              onPress={() => setCravingLevel(lvl)}
            >
              <Text style={styles.chipText}>{lvl}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.input}
          value={checkInNote}
          onChangeText={setCheckInNote}
          placeholder="یادداشت (اختیاری)..."
          placeholderTextColor="#64748b"
        />
        <View style={styles.checkInButtons}>
          <Pressable style={styles.secondaryButtonSuccess} onPress={() => submitCheckIn(false)}>
            <Text style={styles.secondaryButtonText}>امروز مصرف نکردم</Text>
          </Pressable>
          <Pressable style={styles.secondaryButtonSlip} onPress={() => submitCheckIn(true)}>
            <Text style={styles.secondaryButtonText}>امروز مصرف کردم</Text>
          </Pressable>
        </View>
        {lastEncouragement && <Text style={styles.encouragement}>{lastEncouragement}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 40 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 8 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  subQuestion: { color: "#cbd5e1", fontSize: 13, textAlign: "right" },
  statLine: { color: "#cbd5e1", fontSize: 13, textAlign: "right" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 20 },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  planStep: { marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: "#334155", padding: 12 },
  planStepTitle: { color: "#e2e8f0", fontSize: 14, fontWeight: "700", textAlign: "right" },
  planStepAdvice: { color: "#cbd5e1", fontSize: 13, textAlign: "right", marginTop: 4, lineHeight: 19 },
  checkInButtons: { flexDirection: "row", gap: 8, marginTop: 4 },
  secondaryButtonSuccess: {
    flex: 1,
    backgroundColor: "#14532d",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonSlip: {
    flex: 1,
    backgroundColor: "#3a1414",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#f1f5f9", fontSize: 13, fontWeight: "600" },
  encouragement: { color: "#93c5fd", fontSize: 13, textAlign: "right", marginTop: 8 },
});
