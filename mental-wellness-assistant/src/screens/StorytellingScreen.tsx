import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { useStory } from "@/state/StoryContext";
import { voiceService } from "@/voice/voiceService";
import {
  AGE_RANGE_OPTIONS,
  GENDER_OPTIONS,
  STYLE_OPTIONS,
  matchAgeRangeFromText,
  matchGenderFromText,
  matchStyleFromText,
  storiesForAge,
} from "@/engine/storytellingEngine";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";
import StoryCard from "@/components/StoryCard";
import { ChildAgeRange, ChildGender, NarrationStyle, Story } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Storytelling">;

type WizardStep = "age" | "gender" | "style" | "browse";

interface Turn {
  from: "assistant" | "user";
  text: string;
}

const QUESTIONS: Record<Exclude<WizardStep, "browse">, { fa: string; en: string }> = {
  age: {
    fa: "سلام! دوست دارم برایت یک قصه‌ی قشنگ بگویم. اول بگو چند سالته؟",
    en: "Hi! I'd love to tell you a lovely story. First, how old are you?",
  },
  gender: {
    fa: "قهرمان قصه رو یه پسر بذاریم یا یه دختر؟ یا فرقی نمی‌کنه؟",
    en: "Should the hero of the story be a boy or a girl, or doesn't it matter?",
  },
  style: {
    fa: "دوست داری با صدای مهربان و مادرانه برایت بگویم، یا یک‌جوری معمولی و ساده؟",
    en: "Would you like a warm, motherly voice, or a plain, everyday one?",
  },
};

export default function StorytellingScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { ageRange, gender, style, protagonistName, setAgeRange, setGender, setStyle, startStory, resetSetup } =
    useStory();

  // If the child already answered these questions in a previous visit
  // this session, jump straight to browsing instead of re-asking.
  const [wizardStep, setWizardStep] = useState<WizardStep>(ageRange ? "browse" : "age");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const lastSpokenStep = useRef<WizardStep | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  const stories = useMemo(() => (ageRange ? storiesForAge(ageRange) : []), [ageRange]);

  useEffect(() => {
    if (wizardStep === "browse") {
      if (lastSpokenStep.current === "browse") return;
      lastSpokenStep.current = "browse";
      const msg =
        locale === "fa"
          ? "این‌ها قصه‌هایی هستند که برایت دارم. کدام را دوست داری؟"
          : "Here are the stories I have for you. Which one would you like?";
      setTurns((prev) => [...prev, { from: "assistant", text: msg }]);
      if (voiceEnabled) voiceService.speak(msg, locale);
      return;
    }
    if (lastSpokenStep.current === wizardStep) return;
    lastSpokenStep.current = wizardStep;
    const question = QUESTIONS[wizardStep][locale];
    setTurns((prev) => [...prev, { from: "assistant", text: question }]);
    if (voiceEnabled) voiceService.speak(question, locale);
  }, [wizardStep, locale, voiceEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const advanceAfterAge = (value: ChildAgeRange, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setAgeRange(value);
    setHint(null);
    setWizardStep("gender");
  };

  const advanceAfterGender = (value: ChildGender, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setGender(value);
    setHint(null);
    setWizardStep("style");
  };

  const advanceAfterStyle = (value: NarrationStyle, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    setStyle(value);
    setHint(null);
    setWizardStep("browse");
  };

  const submitFreeText = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    if (wizardStep === "age") {
      const match = matchAgeRangeFromText(text);
      const option = AGE_RANGE_OPTIONS.find((o) => o.value === match);
      if (match && option) {
        advanceAfterAge(match, text);
        return;
      }
    } else if (wizardStep === "gender") {
      const match = matchGenderFromText(text);
      if (match) {
        advanceAfterGender(match, text);
        return;
      }
    } else if (wizardStep === "style") {
      const match = matchStyleFromText(text);
      if (match) {
        advanceAfterStyle(match, text);
        return;
      }
    }

    setTurns((prev) => [...prev, { from: "user", text }]);
    setHint(
      locale === "fa" ? "متوجه نشدم؛ می‌توانی یکی از گزینه‌ها را هم لمس کنی." : "I didn't catch that — you can also tap one of the options."
    );
  };

  const startListening = async () => {
    try {
      setListening(true);
      const transcript = await voiceService.listen();
      setListening(false);
      if (transcript) {
        setDraft(transcript);
      }
    } catch {
      setListening(false);
    }
  };

  const beginStory = (story: Story) => {
    startStory(story);
    navigation.navigate("StoryPlayback");
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

        {wizardStep === "age" && (
          <View style={styles.optionsWrap}>
            {AGE_RANGE_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => advanceAfterAge(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {wizardStep === "gender" && (
          <View style={styles.optionsWrap}>
            {GENDER_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => advanceAfterGender(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {wizardStep === "style" && (
          <View style={styles.optionsWrap}>
            {STYLE_OPTIONS.map((opt) => (
              <Pressable key={opt.value} style={styles.optionButton} onPress={() => advanceAfterStyle(opt.value, opt.label[locale])}>
                <Text style={styles.optionText}>{opt.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {wizardStep === "browse" && (
          <View style={styles.storyList}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                {AGE_RANGE_OPTIONS.find((o) => o.value === ageRange)?.label[locale]} ·{" "}
                {GENDER_OPTIONS.find((o) => o.value === gender)?.label[locale]} ·{" "}
                {STYLE_OPTIONS.find((o) => o.value === style)?.label[locale]}
              </Text>
              <Pressable
                onPress={() => {
                  resetSetup();
                  lastSpokenStep.current = null;
                  setTurns([]);
                  setWizardStep("age");
                }}
              >
                <Text style={styles.changeLink}>تغییر سن/جنسیت/سبک</Text>
              </Pressable>
            </View>
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} locale={locale} protagonistName={protagonistName} onStart={() => beginStory(s)} />
            ))}
          </View>
        )}
      </ScrollView>

      {wizardStep !== "browse" && (
        <View style={styles.inputRow}>
          {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="یا اینجا تایپ کن..."
            placeholderTextColor="#64748b"
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
  storyList: { marginTop: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  summaryText: { color: "#94a3b8", fontSize: 12 },
  changeLink: { color: "#60a5fa", fontSize: 12 },
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
