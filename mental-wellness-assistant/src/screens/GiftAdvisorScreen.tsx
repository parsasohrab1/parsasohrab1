import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { voiceService } from "@/voice/voiceService";
import { recommendGiftIdeas, ScoredGiftIdea } from "@/engine/giftAdvisorEngine";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { GiftAgeGroup, GiftBudget, GiftInterest, GiftOccasion, GiftProfile, GiftRecipientRelation } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "GiftAdvisor">;

const RELATION_LABEL: Record<GiftRecipientRelation, { fa: string; en: string }> = {
  mother: { fa: "مادر", en: "Mother" },
  father: { fa: "پدر", en: "Father" },
  sibling: { fa: "خواهر/برادر", en: "Sibling" },
  spouse: { fa: "همسر", en: "Spouse" },
  partner: { fa: "دوست‌پسر/دخترم", en: "Partner" },
  friend: { fa: "دوست", en: "Friend" },
  coworker: { fa: "همکار", en: "Coworker" },
  child: { fa: "فرزند", en: "Child" },
  other: { fa: "شخص دیگر", en: "Someone else" },
};

const AGE_GROUP_LABEL: Record<GiftAgeGroup, { fa: string; en: string }> = {
  child: { fa: "کودک", en: "Child" },
  teen: { fa: "نوجوان", en: "Teen" },
  adult: { fa: "بزرگسال", en: "Adult" },
  senior: { fa: "سالمند", en: "Senior" },
};

const OCCASION_LABEL: Record<GiftOccasion, { fa: string; en: string }> = {
  birthday: { fa: "تولد", en: "Birthday" },
  wedding: { fa: "عروسی", en: "Wedding" },
  anniversary: { fa: "سالگرد", en: "Anniversary" },
  graduation: { fa: "فارغ‌التحصیلی", en: "Graduation" },
  holiday: { fa: "مناسبت/عید", en: "Holiday" },
  housewarming: { fa: "خانهٔ جدید", en: "Housewarming" },
  just_because: { fa: "بدون مناسبت خاص", en: "Just because" },
  condolence: { fa: "تسلیت/عزا", en: "Condolence" },
};

const BUDGET_LABEL: Record<GiftBudget, { fa: string; en: string }> = {
  low: { fa: "کم", en: "Low" },
  medium: { fa: "متوسط", en: "Medium" },
  high: { fa: "زیاد", en: "High" },
};

const INTEREST_LABEL: Record<GiftInterest, { fa: string; en: string }> = {
  reading: { fa: "کتاب‌خوانی", en: "Reading" },
  cooking: { fa: "آشپزی", en: "Cooking" },
  sports: { fa: "ورزش", en: "Sports" },
  music: { fa: "موسیقی", en: "Music" },
  art: { fa: "هنر", en: "Art" },
  technology: { fa: "فناوری", en: "Technology" },
  travel: { fa: "سفر", en: "Travel" },
  fashion: { fa: "مد و پوشاک", en: "Fashion" },
  home_decor: { fa: "دکوراسیون", en: "Home decor" },
  gardening: { fa: "باغبانی", en: "Gardening" },
  gaming: { fa: "بازی", en: "Gaming" },
  wellness: { fa: "آرامش و سلامتی", en: "Wellness" },
};

const MAX_INTERESTS = 3;

export default function GiftAdvisorScreen({}: Props) {
  const { locale, voiceEnabled } = useSession();
  const [relation, setRelation] = useState<GiftRecipientRelation | null>(null);
  const [ageGroup, setAgeGroup] = useState<GiftAgeGroup | null>(null);
  const [occasion, setOccasion] = useState<GiftOccasion | null>(null);
  const [budget, setBudget] = useState<GiftBudget | null>(null);
  const [interests, setInterests] = useState<GiftInterest[]>([]);
  const [results, setResults] = useState<ScoredGiftIdea[] | null>(null);

  const say = (text: string) => {
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  const toggleInterest = (interest: GiftInterest) => {
    setInterests((prev) => {
      if (prev.includes(interest)) return prev.filter((i) => i !== interest);
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, interest];
    });
  };

  const canSubmit = relation && ageGroup && occasion && budget;

  const getIdeas = () => {
    if (!relation || !ageGroup || !occasion || !budget) return;
    const profile: GiftProfile = { relation, ageGroup, occasion, budget, interests };
    const ideas = recommendGiftIdeas(profile);
    setResults(ideas);
    if (ideas.length > 0) say(ideas[0].idea.idea[locale]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>پیدا کردن هدیهٔ مناسب</Text>
      <Disclaimer text={DISCLAIMERS.giftAdvisorLimitations} tone="warning" />

      <View style={styles.section}>
        <Text style={styles.question}>هدیه برای کیست؟</Text>
        <View style={styles.chipRow}>
          {(Object.keys(RELATION_LABEL) as GiftRecipientRelation[]).map((r) => (
            <Pressable key={r} style={[styles.chip, relation === r && styles.chipSelected]} onPress={() => setRelation(r)}>
              <Text style={styles.chipText}>{RELATION_LABEL[r][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>ردهٔ سنی</Text>
        <View style={styles.chipRow}>
          {(Object.keys(AGE_GROUP_LABEL) as GiftAgeGroup[]).map((a) => (
            <Pressable key={a} style={[styles.chip, ageGroup === a && styles.chipSelected]} onPress={() => setAgeGroup(a)}>
              <Text style={styles.chipText}>{AGE_GROUP_LABEL[a][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>مناسبت چیست؟</Text>
        <View style={styles.chipRow}>
          {(Object.keys(OCCASION_LABEL) as GiftOccasion[]).map((o) => (
            <Pressable key={o} style={[styles.chip, occasion === o && styles.chipSelected]} onPress={() => setOccasion(o)}>
              <Text style={styles.chipText}>{OCCASION_LABEL[o][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>بودجه</Text>
        <View style={styles.chipRow}>
          {(Object.keys(BUDGET_LABEL) as GiftBudget[]).map((b) => (
            <Pressable key={b} style={[styles.chip, budget === b && styles.chipSelected]} onPress={() => setBudget(b)}>
              <Text style={styles.chipText}>{BUDGET_LABEL[b][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>{`علایق او چیست؟ (حداکثر ${MAX_INTERESTS} مورد، اختیاری)`}</Text>
        <View style={styles.chipRow}>
          {(Object.keys(INTEREST_LABEL) as GiftInterest[]).map((i) => (
            <Pressable key={i} style={[styles.chip, interests.includes(i) && styles.chipSelected]} onPress={() => toggleInterest(i)}>
              <Text style={styles.chipText}>{INTEREST_LABEL[i][locale]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={[styles.primaryButton, !canSubmit && styles.disabledButton]} disabled={!canSubmit} onPress={getIdeas}>
        <Text style={styles.primaryButtonText}>پیشنهاد هدیه بده</Text>
      </Pressable>

      {results !== null && (
        <View style={styles.section}>
          {results.length === 0 ? (
            <Text style={styles.question}>برای این ترکیب، پیشنهادی پیدا نشد — یک علاقهٔ دیگر امتحان کن.</Text>
          ) : (
            results.map(({ idea }) => (
              <View key={idea.id} style={styles.ideaCard}>
                {idea.isBookSuggestion && <Text style={styles.bookTag}>پیشنهاد کتاب (ژانر، نه عنوان مشخص)</Text>}
                <Text style={styles.ideaText}>{idea.idea[locale]}</Text>
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
  ideaCard: { marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#334155", padding: 12 },
  bookTag: { color: "#93c5fd", fontSize: 11, textAlign: "right", marginBottom: 4, fontWeight: "600" },
  ideaText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", lineHeight: 20 },
});
