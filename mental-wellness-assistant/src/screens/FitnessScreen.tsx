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
import { useFitness } from "@/state/FitnessContext";
import { voiceService } from "@/voice/voiceService";
import { parseHeightCmFromText, parseWeightKgFromText } from "@/engine/fitnessEngine";
import { AthleteStatus, ExercisePurpose, WeightGoal } from "@/types";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";

type Props = NativeStackScreenProps<RootStackParamList, "Fitness">;

type WizardStep = "athlete" | "purpose" | "goal" | "height" | "weight";

interface Turn {
  from: "assistant" | "user";
  text: string;
}

const QUESTIONS: Record<WizardStep, { fa: string; en: string }> = {
  athlete: {
    fa: "سلام! برای پیشنهاد راهکار تغذیه و ورزش مناسب، چند سؤال کوتاه می‌پرسم. اول بگو: ورزشکار هستید یا نه؟",
    en: "Hi! I'll ask a few quick questions to suggest suitable nutrition and exercise tips. First: are you an athlete or not?",
  },
  purpose: {
    fa: "هدفتان از ورزش‌کردن بیشتر سلامتی و تناسب‌اندام عمومی است یا ورزش حرفه‌ای/رقابتی؟",
    en: "Is your goal with exercise mainly general health and fitness, or competitive/professional sport?",
  },
  goal: {
    fa: "از نظر وزن، هدفتان چیست؟",
    en: "What's your goal regarding weight?",
  },
  height: {
    fa: "قدتان به سانتی‌متر چقدر است؟",
    en: "What is your height in centimeters?",
  },
  weight: {
    fa: "وزنتان به کیلوگرم چقدر است؟",
    en: "What is your weight in kilograms?",
  },
};

const ATHLETE_OPTIONS: { value: AthleteStatus; label: { fa: string; en: string } }[] = [
  { value: "athlete", label: { fa: "ورزشکار هستم", en: "I'm an athlete" } },
  { value: "non_athlete", label: { fa: "ورزشکار نیستم", en: "I'm not an athlete" } },
];

const PURPOSE_OPTIONS: { value: ExercisePurpose; label: { fa: string; en: string } }[] = [
  { value: "health_fitness", label: { fa: "سلامتی و تناسب‌اندام", en: "Health & fitness" } },
  { value: "professional_sport", label: { fa: "ورزش حرفه‌ای/رقابتی", en: "Professional/competitive sport" } },
];

const GOAL_OPTIONS: { value: WeightGoal; label: { fa: string; en: string } }[] = [
  { value: "lose", label: { fa: "کاهش وزن", en: "Lose weight" } },
  { value: "gain", label: { fa: "افزایش وزن", en: "Gain weight" } },
  { value: "maintain", label: { fa: "حفظ وزن فعلی", en: "Maintain current weight" } },
];

export default function FitnessScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { setAthleteStatus, setExercisePurpose, setWeightGoal, setHeight, submitWeight } = useFitness();

  const [wizardStep, setWizardStep] = useState<WizardStep>("athlete");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const lastSpokenStep = useRef<WizardStep | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  useEffect(() => {
    if (lastSpokenStep.current === wizardStep) return;
    lastSpokenStep.current = wizardStep;
    const question = QUESTIONS[wizardStep][locale];
    setTurns((prev) => [...prev, { from: "assistant", text: question }]);
    if (voiceEnabled) voiceService.speak(question, locale);
  }, [wizardStep, locale, voiceEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const pickAthlete = (value: AthleteStatus, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setAthleteStatus(value);
    setWizardStep("purpose");
  };

  const pickPurpose = (value: ExercisePurpose, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setExercisePurpose(value);
    setWizardStep("goal");
  };

  const pickGoal = (value: WeightGoal, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setWeightGoal(value);
    setWizardStep("height");
  };

  const submitFreeText = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setHint(null);

    if (wizardStep === "height") {
      const cm = parseHeightCmFromText(text);
      if (cm === null || cm < 50 || cm > 250) {
        setTurns((prev) => [...prev, { from: "user", text }]);
        setHint(locale === "fa" ? "لطفاً قد خود را به‌صورت یک عدد (سانتی‌متر) بنویسید، مثلاً ۱۷۵." : "Please enter your height as a number in centimeters, e.g. 175.");
        return;
      }
      setTurns((prev) => [...prev, { from: "user", text: `${cm} سانتی‌متر` }]);
      setHeight(cm);
      setWizardStep("weight");
      return;
    }

    if (wizardStep === "weight") {
      const kg = parseWeightKgFromText(text);
      if (kg === null || kg < 20 || kg > 300) {
        setTurns((prev) => [...prev, { from: "user", text }]);
        setHint(locale === "fa" ? "لطفاً وزن خود را به‌صورت یک عدد (کیلوگرم) بنویسید، مثلاً ۷۰." : "Please enter your weight as a number in kilograms, e.g. 70.");
        return;
      }
      setTurns((prev) => [...prev, { from: "user", text: `${kg} کیلوگرم` }]);
      submitWeight(kg);
      navigation.replace("FitnessResults");
      return;
    }
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

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView ref={scrollRef} contentContainerStyle={styles.chat}>
        {turns.map((t, i) => (
          <ChatBubble key={i} text={t.text} from={t.from} />
        ))}
        {hint && <Text style={styles.hint}>{hint}</Text>}

        {wizardStep === "athlete" && (
          <View style={styles.optionsWrap}>
            {ATHLETE_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => pickAthlete(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {wizardStep === "purpose" && (
          <View style={styles.optionsWrap}>
            {PURPOSE_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => pickPurpose(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {wizardStep === "goal" && (
          <View style={styles.optionsWrap}>
            {GOAL_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => pickGoal(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {(wizardStep === "height" || wizardStep === "weight") && (
        <View style={styles.inputRow}>
          {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={wizardStep === "height" ? "مثلاً ۱۷۵" : "مثلاً ۷۰"}
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            onSubmitEditing={submitFreeText}
          />
          <Pressable style={styles.sendButton} onPress={submitFreeText}>
            <Text style={styles.sendText}>ارسال</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chat: { padding: 16, flexGrow: 1, justifyContent: "flex-end" },
  hint: { color: "#f59e0b", fontSize: 12, textAlign: "right", marginTop: 4 },
  optionsWrap: { gap: 8, marginTop: 8 },
  optionButton: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  optionText: { color: "#e2e8f0", fontSize: 15, textAlign: "right" },
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
