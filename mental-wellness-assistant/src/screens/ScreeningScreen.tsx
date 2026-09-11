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
import { voiceService } from "@/voice/voiceService";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";
import { totalQuestionBudget } from "@/engine/screeningEngine";
import { AnswerValue } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "Screening">;

interface Turn {
  from: "assistant" | "user";
  text: string;
}

export default function ScreeningScreen({ navigation }: Props) {
  const {
    currentQuestion,
    submitAnswer,
    submitFreeTextOnly,
    answers,
    mode,
    locale,
    voiceEnabled,
    isComplete,
    crisis,
  } = useSession();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const lastSpokenId = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  useEffect(() => {
    if (!currentQuestion) return;
    if (lastSpokenId.current === currentQuestion.id) return;
    lastSpokenId.current = currentQuestion.id;
    setTurns((prev) => [...prev, { from: "assistant", text: currentQuestion.text[locale] }]);
    if (voiceEnabled) {
      voiceService.speak(currentQuestion.text[locale], locale);
    }
  }, [currentQuestion, locale, voiceEnabled]);

  useEffect(() => {
    if (!isComplete) return;
    voiceService.stopSpeaking();
    const target = crisis.triggered ? "Crisis" : "Results";
    const timer = setTimeout(() => navigation.replace(target), 400);
    return () => clearTimeout(timer);
  }, [isComplete, crisis.triggered, navigation]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const pickOption = (value: AnswerValue, label: string) => {
    setTurns((prev) => [...prev, { from: "user", text: label }]);
    submitAnswer(value);
  };

  const sendFreeText = () => {
    const text = draft.trim();
    if (!text) return;
    setTurns((prev) => [...prev, { from: "user", text }]);
    setDraft("");
    submitFreeTextOnly(text);
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

  const total = totalQuestionBudget(mode);
  const progress = Math.min(answers.length, total);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          پرسش {Math.min(progress + 1, total)} از حدود {total}
        </Text>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.chat}>
        {turns.map((t, i) => (
          <ChatBubble key={i} text={t.text} from={t.from} />
        ))}
      </ScrollView>

      {currentQuestion && (
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

      <View style={styles.inputRow}>
        {listeningSupported && (
          <MicButton listening={listening} onPress={startListening} disabled={!currentQuestion} />
        )}
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="یا اینجا تایپ کنید..."
          placeholderTextColor="#64748b"
          onSubmitEditing={sendFreeText}
          editable={!!currentQuestion}
        />
        <Pressable style={styles.sendButton} onPress={sendFreeText} disabled={!currentQuestion}>
          <Text style={styles.sendText}>ارسال</Text>
        </Pressable>
      </View>
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
