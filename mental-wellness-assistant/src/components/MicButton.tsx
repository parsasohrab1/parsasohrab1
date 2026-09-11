import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  listening: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export default function MicButton({ listening, disabled, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        listening && styles.listening,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {listening ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.icon}>🎙️</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  listening: { backgroundColor: "#dc2626" },
  disabled: { backgroundColor: "#334155" },
  pressed: { opacity: 0.8 },
  icon: { fontSize: 28 },
});
