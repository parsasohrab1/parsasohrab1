import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  text: string;
  from: "assistant" | "user";
}

export default function ChatBubble({ text, from }: Props) {
  const isAssistant = from === "assistant";
  return (
    <View style={[styles.row, { justifyContent: isAssistant ? "flex-start" : "flex-end" }]}>
      <View style={[styles.bubble, isAssistant ? styles.assistantBubble : styles.userBubble]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginVertical: 6, width: "100%" },
  bubble: { maxWidth: "82%", borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  assistantBubble: { backgroundColor: "#1e293b", borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: "#2563eb", borderTopRightRadius: 4 },
  text: { color: "#f1f5f9", fontSize: 15, textAlign: "right", lineHeight: 21 },
});
