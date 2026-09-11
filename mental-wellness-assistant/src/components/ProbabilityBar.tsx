import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConditionScore, Locale } from "@/types";
import { conditionById } from "@/data/conditions";

interface Props {
  score: ConditionScore;
  locale?: Locale;
}

const BAND_COLOR: Record<ConditionScore["band"], string> = {
  low: "#22c55e",
  moderate: "#eab308",
  elevated: "#f97316",
  high: "#ef4444",
};

export default function ProbabilityBar({ score, locale = "fa" }: Props) {
  const condition = conditionById(score.conditionId);
  if (!condition) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.percent}>{score.likelihoodPercent}٪</Text>
        <Text style={styles.name}>{condition.name[locale]}</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${score.likelihoodPercent}%`, backgroundColor: BAND_COLOR[score.band] },
          ]}
        />
      </View>
      <Text style={styles.desc}>{condition.shortDescription[locale]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  name: { color: "#f1f5f9", fontSize: 15, fontWeight: "600" },
  percent: { color: "#cbd5e1", fontSize: 14 },
  track: { height: 10, borderRadius: 6, backgroundColor: "#1e293b", overflow: "hidden" },
  fill: { height: "100%", borderRadius: 6 },
  desc: { color: "#94a3b8", fontSize: 12, marginTop: 4, textAlign: "right" },
});
