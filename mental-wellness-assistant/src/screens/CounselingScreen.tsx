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
import { useCounseling } from "@/state/CounselingContext";
import { voiceService } from "@/voice/voiceService";
import { estimateQuestionBudget } from "@/engine/counselingEngine";
import { AnswerValue, ClientGenderRole, MaritalStatus } from "@/types";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";

type Props = NativeStackScreenProps<RootStackParamList, "Counseling">;

interface Turn {
  from: "assistant" | "user";
  text: string;
}

interface ProfileOption {
  status: MaritalStatus;
  genderRole: ClientGenderRole;
  label: { fa: string; en: string };
}

const PROFILE_OPTIONS: ProfileOption[] = [
  { status: "married", genderRole: "woman", label: { fa: "زن متأهل", en: "Married woman" } },
  { status: "married", genderRole: "man", label: { fa: "مرد متأهل", en: "Married man" } },
  { status: "engaged", genderRole: "woman", label: { fa: "دختر مجرد در حال ازدواج", en: "Woman getting married" } },
  { status: "engaged", genderRole: "man", label: { fa: "پسر مجرد در حال ازدواج", en: "Man getting married" } },
];

const INTRO_QUESTION = {
  fa: "سلام. برای اینکه راهنمایی مناسب‌تری بدهم، بگو کدام‌یک به شرایط تو نزدیک‌تر است؟",
  en: "Hi. To give you more relevant guidance, which of these best describes your situation?",
};

export default function CounselingScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { status, currentQuestion, answers, isComplete, safety, suicideRiskDetected, startProfile, submitAnswer } =
    useCounseling();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const lastSpokenId = useRef<string | null>(null);
  const introSpoken = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  useEffect(() => {
    if (introSpoken.current) return;
    introSpoken.current = true;
    setTurns([{ from: "assistant", text: INTRO_QUESTION[locale] }]);
    if (voiceEnabled) voiceService.speak(INTRO_QUESTION[locale], locale);
  }, [locale, voiceEnabled]);

  useEffect(() => {
    if (!currentQuestion) return;
    if (lastSpokenId.current === currentQuestion.id) return;
    lastSpokenId.current = currentQuestion.id;
    setTurns((prev) => [...prev, { from: "assistant", text: currentQuestion.text[locale] }]);
    if (voiceEnabled) voiceService.speak(currentQuestion.text[locale], locale);
  }, [currentQuestion, locale, voiceEnabled]);

  useEffect(() => {
    if (!isComplete) return;
    voiceService.stopSpeaking();
    const target = suicideRiskDetected ? "Crisis" : safety.triggered ? "RelationshipSafety" : "CounselingResults";
    const timer = setTimeout(() => navigation.replace(target), 400);
    return () => clearTimeout(timer);
  }, [isComplete, suicideRiskDetected, safety.triggered, navigation]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const pickProfile = (opt: ProfileOption) => {
    setTurns((prev) => [...prev, { from: "user", text: opt.label[locale] }]);
    startProfile(opt.status, opt.genderRole);
  };

  const pickOption = (value: AnswerValue, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    submitAnswer(value);
  };

  const sendFreeText = () => {
    const text = draft.trim();
    if (!text) return;
    setTurns((prev) => [...prev, { from: "user", text }]);
    setDraft("");
    // Free text during counseling doesn't map to a 0-3 scale value on its
    // own; treat it as a moderate-concern answer while still passing the
    // raw text through so the safety/crisis keyword scans can run on it.
    submitAnswer(2, text);
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

  const total = status ? estimateQuestionBudget(status) : null;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {status && total && (
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            پرسش {Math.min(answers.length + 1, total)} از حدود {total}
          </Text>
        </View>
      )}

      <ScrollView ref={scrollRef} contentContainerStyle={styles.chat}>
        {turns.map((t, i) => (
          <ChatBubble key={i} text={t.text} from={t.from} />
        ))}
      </ScrollView>

      {!status && (
        <View style={styles.optionsWrap}>
          {PROFILE_OPTIONS.map((opt, i) => (
            <Pressable key={i} style={styles.optionButton} onPress={() => pickProfile(opt)}>
              <Text style={styles.optionText}>{opt.label[locale]}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {status && currentQuestion && (
        <View style={styles.optionsWrap}>
          {currentQuestion.options.map((opt) => (
            <Pressable
              key={opt.value}
              style={styles.optionButton}
              onPress={() => pickOption(opt.value, opt.label[locale])}
            >
              <Text style={styles.optionText}>{opt.label[locale]}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {status && currentQuestion && (
        <View style={styles.inputRow}>
          {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="یا اینجا تایپ کنید..."
            placeholderTextColor="#64748b"
            onSubmitEditing={sendFreeText}
          />
          <Pressable style={styles.sendButton} onPress={sendFreeText}>
            <Text style={styles.sendText}>ارسال</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progressRow: { paddingHorizontal: 20, paddingTop: 12 },
  progressText: { color: "#94a3b8", fontSize: 12, textAlign: "right" },
  chat: { padding: 16, flexGrow: 1, justifyContent: "flex-end" },
  optionsWrap: { paddingHorizontal: 16, gap: 8, marginBottom: 8 },
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
