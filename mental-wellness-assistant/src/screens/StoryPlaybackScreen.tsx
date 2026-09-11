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
import { useStory } from "@/state/StoryContext";
import { voiceService, speakStory } from "@/voice/voiceService";
import { introLine, outroLine, renderMoral, renderParagraph, renderTitle } from "@/engine/storytellingEngine";
import ChatBubble from "@/components/ChatBubble";
import MicButton from "@/components/MicButton";

type Props = NativeStackScreenProps<RootStackParamList, "StoryPlayback">;

interface Turn {
  from: "assistant" | "user";
  text: string;
}

export default function StoryPlaybackScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { story, style, protagonistName, currentParagraphIndex, isFinished, repeatTick, handleUtterance, endStory } =
    useStory();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const lastSpokenKey = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();

  useEffect(() => {
    if (!story) {
      navigation.replace("Storytelling");
    }
  }, [story, navigation]);

  useEffect(() => {
    if (!story) return;
    const title = renderTitle(story, locale, protagonistName);

    if (isFinished) {
      const key = "finished";
      if (lastSpokenKey.current === key) return;
      lastSpokenKey.current = key;
      const moral = renderMoral(story, locale, protagonistName);
      const text = outroLine(style, locale, protagonistName, moral);
      setTurns((prev) => [...prev, { from: "assistant", text }]);
      if (voiceEnabled) speakStory(text, locale, style);
      return;
    }

    const paragraph = renderParagraph(story, currentParagraphIndex, locale, protagonistName);
    if (!paragraph) return;
    const key = `${currentParagraphIndex}:${repeatTick}`;
    if (lastSpokenKey.current === key) return;
    lastSpokenKey.current = key;

    const intro = currentParagraphIndex === 1 && repeatTick === 0 ? introLine(style, locale, protagonistName, title) + " " : "";
    const text = `${intro}${paragraph}`;

    setTurns((prev) => [...prev, { from: "assistant", text }]);
    if (voiceEnabled) speakStory(text, locale, style);
  }, [story, currentParagraphIndex, repeatTick, isFinished, style, locale, protagonistName, voiceEnabled]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  if (!story) return null;

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
          ? "متوجه نشدم. می‌توانی بگویی: «بعدی»، «تکرار کن»، «قبلی» یا «تمام کن»."
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
    endStory();
    navigation.replace("Storytelling");
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
            ? "پایان قصه 🌙"
            : `${renderTitle(story, locale, protagonistName)} — بخش ${currentParagraphIndex} از ${story.paragraphs.length}`}
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
          <Text style={styles.finishButtonText}>یک قصه‌ی دیگر</Text>
        </Pressable>
      ) : (
        <View style={styles.inputRow}>
          {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="ادامه بده / تکرار کن / قبلی / تمام کن..."
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
