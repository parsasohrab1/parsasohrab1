import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Locale, Story } from "@/types";
import { renderTitle } from "@/engine/storytellingEngine";

interface Props {
  story: Story;
  locale: Locale;
  protagonistName: string;
  onStart: () => void;
}

export default function StoryCard({ story, locale, protagonistName, onStart }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{renderTitle(story, locale, protagonistName)}</Text>
      <Text style={styles.teaser}>{story.teaser[locale]}</Text>
      <Pressable style={styles.startButton} onPress={onStart}>
        <Text style={styles.startButtonText}>این قصه رو بگو</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#1e293b", borderRadius: 14, padding: 14, marginVertical: 6 },
  title: { color: "#f1f5f9", fontSize: 16, fontWeight: "700", textAlign: "right" },
  teaser: { color: "#cbd5e1", fontSize: 13, textAlign: "right", marginTop: 6, lineHeight: 19 },
  startButton: { backgroundColor: "#2563eb", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginTop: 12 },
  startButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
