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
import { useCooking } from "@/state/CookingContext";
import { voiceService } from "@/voice/voiceService";
import { getStep } from "@/engine/recipeEngine";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";

type Props = NativeStackScreenProps<RootStackParamList, "Cooking">;

interface Turn {
  from: "assistant" | "user";
  text: string;
}

export default function CookingScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { recipe, currentStepIndex, isFinished, repeatTick, handleUtterance, endCooking } = useCooking();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const lastSpokenKey = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  useEffect(() => {
    if (!recipe) {
      navigation.replace("Recipes");
    }
  }, [recipe, navigation]);

  useEffect(() => {
    if (!recipe) return;

    if (isFinished) {
      const key = `finished`;
      if (lastSpokenKey.current === key) return;
      lastSpokenKey.current = key;
      const msg =
        locale === "fa"
          ? `${recipe.title.fa} آماده است. نوش جان!`
          : `${recipe.title.en} is ready. Enjoy your meal!`;
      setTurns((prev) => [...prev, { from: "assistant", text: msg }]);
      if (voiceEnabled) voiceService.speak(msg, locale);
      return;
    }

    const step = getStep(recipe, currentStepIndex);
    if (!step) return;
    const key = `${currentStepIndex}:${repeatTick}`;
    if (lastSpokenKey.current === key) return;
    lastSpokenKey.current = key;

    const intro =
      currentStepIndex === 1 && repeatTick === 0
        ? (locale === "fa"
            ? `بیایید ${recipe.title.fa} را با هم درست کنیم. `
            : `Let's cook ${recipe.title.en} together. `)
        : "";
    const stepLabel = locale === "fa" ? `مرحله ${currentStepIndex}: ` : `Step ${currentStepIndex}: `;
    const text = `${intro}${stepLabel}${step.instruction[locale]}`;

    setTurns((prev) => [...prev, { from: "assistant", text }]);
    if (voiceEnabled) voiceService.speak(text, locale);
  }, [recipe, currentStepIndex, repeatTick, isFinished, locale, voiceEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  if (!recipe) return null;

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTurns((prev) => [...prev, { from: "user", text: trimmed }]);
    setDraft("");
    setHint(null);
    const command = handleUtterance(trimmed);
    if (command === "unknown") {
      setHint(
        locale === "fa"
          ? "متوجه نشدم. می‌توانید بگویید: «بعدی»، «تکرار کن»، «قبلی» یا «تمام کن»."
          : "I didn't catch that. Try saying: \"next\", \"repeat\", \"previous\", or \"stop\"."
      );
    }
  };

  const startListening = async () => {
    try {
      setListening(true);
      const transcript = await voiceService.listen();
      setListening(false);
      if (transcript) submit(transcript);
    } catch {
      setListening(false);
    }
  };

  const finishAndLeave = () => {
    endCooking();
    navigation.replace("Recipes");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {isFinished
            ? "آماده شد 🎉"
            : `مرحله ${currentStepIndex} از ${recipe.steps.length} — ${recipe.title[locale]}`}
        </Text>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.chat}>
        {turns.map((t, i) => (
          <ChatBubble key={i} text={t.text} from={t.from} />
        ))}
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </ScrollView>

      {isFinished ? (
        <Pressable style={styles.finishButton} onPress={finishAndLeave}>
          <Text style={styles.finishButtonText}>بازگشت به رسپی‌ها</Text>
        </Pressable>
      ) : (
        <View style={styles.inputRow}>
          {listeningSupported && (
            <MicButton listening={listening} onPress={startListening} />
          )}
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="بعدی / تکرار کن / قبلی / تمام کن..."
            placeholderTextColor="#64748b"
            onSubmitEditing={() => submit(draft)}
          />
          <Pressable style={styles.sendButton} onPress={() => submit(draft)}>
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
  hint: { color: "#f59e0b", fontSize: 12, textAlign: "right", marginTop: 4 },
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
  finishButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center", margin: 16 },
  finishButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
