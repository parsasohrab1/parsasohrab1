import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Locale } from "@/types";

interface Props {
  text: { fa: string; en: string };
  locale?: Locale;
  tone?: "info" | "warning";
}

export default function Disclaimer({ text, locale = "fa", tone = "info" }: Props) {
  return (
    <View style={[styles.box, tone === "warning" ? styles.warning : styles.info]}>
      <Text style={styles.text}>{text[locale]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
  },
  info: {
    backgroundColor: "#0b2540",
    borderColor: "#1d4ed8",
  },
  warning: {
    backgroundColor: "#3a1414",
    borderColor: "#dc2626",
  },
  text: {
    color: "#e2e8f0",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "right",
  },
});
