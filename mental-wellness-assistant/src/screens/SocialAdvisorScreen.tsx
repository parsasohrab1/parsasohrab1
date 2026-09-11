import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { voiceService } from "@/voice/voiceService";
import { personalityInsight, recommendStrategies, ScoredSocialStrategy } from "@/engine/socialAdvisorEngine";
import { ALL_RELATIONS } from "@/data/socialStrategies";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { PersonalityTrait, SocialRelation, SocialScenario, SocialSituationProfile } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "SocialAdvisor">;

const RELATION_LABEL: Record<SocialRelation, { fa: string; en: string }> = {
  mother: { fa: "مادر", en: "Mother" },
  father: { fa: "پدر", en: "Father" },
  sibling: { fa: "خواهر/برادر", en: "Sibling" },
  spouse: { fa: "همسر", en: "Spouse" },
  in_law: { fa: "خانوادهٔ همسر", en: "In-law" },
  friend: { fa: "دوست", en: "Friend" },
  coworker: { fa: "همکار", en: "Coworker" },
  other: { fa: "شخص دیگر", en: "Someone else" },
};

const SCENARIO_LABEL: Record<SocialScenario, { fa: string; en: string }> = {
  financial_boundary: { fa: "مرز مالی", en: "Financial boundary" },
  unsolicited_advice: { fa: "نصیحت ناخواسته", en: "Unsolicited advice" },
  decision_disagreement: { fa: "اختلاف‌نظر در تصمیم", en: "Decision disagreement" },
  generosity_conflict: { fa: "تعارض سر سخاوت/کمک", en: "Generosity/help conflict" },
  boundary_setting: { fa: "مرزگذاری کلی", en: "General boundary-setting" },
  family_expectation: { fa: "انتظار خانوادگی", en: "Family expectation" },
};

const TRAIT_LABEL: Record<PersonalityTrait, { fa: string; en: string }> = {
  generous: { fa: "دست‌ودل‌باز", en: "Generous" },
  frugal: { fa: "محتاط با پول", en: "Frugal" },
  controlling: { fa: "کنترل‌گر", en: "Controlling" },
  flexible: { fa: "انعطاف‌پذیر", en: "Flexible" },
  traditional: { fa: "سنتی", en: "Traditional" },
  modern: { fa: "امروزی", en: "Modern" },
  emotional: { fa: "احساساتی", en: "Emotional" },
  calm: { fa: "آرام", en: "Calm" },
};

const MAX_TRAITS = 3;

export default function SocialAdvisorScreen({}: Props) {
  const { locale, voiceEnabled } = useSession();
  const [relation, setRelation] = useState<SocialRelation | null>(null);
  const [scenario, setScenario] = useState<SocialScenario | null>(null);
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [results, setResults] = useState<ScoredSocialStrategy[] | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  const say = (text: string) => {
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  const toggleTrait = (trait: PersonalityTrait) => {
    setTraits((prev) => {
      if (prev.includes(trait)) return prev.filter((t) => t !== trait);
      if (prev.length >= MAX_TRAITS) return prev;
      return [...prev, trait];
    });
  };

  const getAdvice = () => {
    if (!relation || !scenario) return;
    const profile: SocialSituationProfile = { relation, scenario, traits };
    const strategies = recommendStrategies(profile);
    setResults(strategies);
    const insightText = personalityInsight(traits, locale);
    setInsight(insightText);
    if (insightText) say(insightText);
    if (strategies.length > 0) say(strategies[0].strategy.advice[locale]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>مشاور موقعیت‌های اجتماعی</Text>
      <Disclaimer text={DISCLAIMERS.socialAdvisorLimitations} tone="warning" />

      <View style={styles.section}>
        <Text style={styles.question}>این موقعیت با چه کسی است؟</Text>
        <View style={styles.chipRow}>
          {ALL_RELATIONS.map((r) => (
            <Pressable key={r} style={[styles.chip, relation === r && styles.chipSelected]} onPress={() => setRelation(r)}>
              <Text style={styles.chipText}>{RELATION_LABEL[r][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>موقعیت چه نوعی است؟</Text>
        <View style={styles.chipRow}>
          {(Object.keys(SCENARIO_LABEL) as SocialScenario[]).map((s) => (
            <Pressable key={s} style={[styles.chip, scenario === s && styles.chipSelected]} onPress={() => setScenario(s)}>
              <Text style={styles.chipText}>{SCENARIO_LABEL[s][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>{`ویژگی‌های شخصیتی طرف مقابل چیست؟ (حداکثر ${MAX_TRAITS} مورد، اختیاری)`}</Text>
        <View style={styles.chipRow}>
          {(Object.keys(TRAIT_LABEL) as PersonalityTrait[]).map((t) => (
            <Pressable key={t} style={[styles.chip, traits.includes(t) && styles.chipSelected]} onPress={() => toggleTrait(t)}>
              <Text style={styles.chipText}>{TRAIT_LABEL[t][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        style={[styles.primaryButton, (!relation || !scenario) && styles.disabledButton]}
        disabled={!relation || !scenario}
        onPress={getAdvice}
      >
        <Text style={styles.primaryButtonText}>راهکار بده</Text>
      </Pressable>

      {results !== null && (
        <View style={styles.section}>
          {insight && (
            <View style={styles.insightBox}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          )}
          {results.length === 0 ? (
            <Text style={styles.question}>برای این ترکیب، راهکار خاصی پیدا نشد — یک ویژگی شخصیتی دیگر امتحان کن.</Text>
          ) : (
            results.map(({ strategy }) => (
              <View key={strategy.id} style={styles.strategyCard}>
                <Text style={styles.strategyPersonality}>{strategy.personalityNote[locale]}</Text>
                <Text style={styles.strategyAdvice}>{strategy.advice[locale]}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 40 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 8 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 20 },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  insightBox: { backgroundColor: "#0b2540", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#1d4ed8" },
  insightText: { color: "#dbeafe", fontSize: 13, textAlign: "right", lineHeight: 19 },
  strategyCard: { marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#334155", padding: 12 },
  strategyPersonality: { color: "#94a3b8", fontSize: 12, textAlign: "right", marginBottom: 6, fontStyle: "italic" },
  strategyAdvice: { color: "#e2e8f0", fontSize: 13, textAlign: "right", lineHeight: 20 },
});
