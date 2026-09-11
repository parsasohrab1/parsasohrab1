import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useFamilyCircle } from "@/state/useFamilyCircle";
import { summarizeMember } from "@/engine/familyCircleEngine";
import { ALL_RELATIONS } from "@/data/socialStrategies";
import { RELATION_LABEL, TRAIT_LABEL } from "@/data/socialLabels";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { PersonalityTrait, SocialRelation } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "FamilyCircle">;

const MAX_TRAITS = 3;

export default function FamilyCircleScreen({ navigation }: Props) {
  const { locale } = useSession();
  const { members, loaded, addMember, removeMember } = useFamilyCircle();

  const [name, setName] = useState("");
  const [relation, setRelation] = useState<SocialRelation | null>(null);
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [notes, setNotes] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const toggleTrait = (trait: PersonalityTrait) => {
    setTraits((prev) => {
      if (prev.includes(trait)) return prev.filter((t) => t !== trait);
      if (prev.length >= MAX_TRAITS) return prev;
      return [...prev, trait];
    });
  };

  const canSave = name.trim().length > 0 && relation !== null;

  const save = () => {
    if (!relation || !canSave) return;
    addMember(name, relation, traits, notes);
    setName("");
    setRelation(null);
    setTraits([]);
    setNotes("");
    setFormOpen(false);
  };

  const getAdviceFor = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    navigation.navigate("SocialAdvisor", {
      presetRelation: member.relation,
      presetTraits: member.traits,
      presetName: member.name,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>خانواده و اطرافیان</Text>
      <Disclaimer text={DISCLAIMERS.familyCircleLimitations} tone="warning" />

      <View style={styles.section}>
        {loaded && members.length === 0 && !formOpen && (
          <Text style={styles.emptyText}>هنوز کسی را اضافه نکرده‌ای. با دکمهٔ پایین شروع کن.</Text>
        )}
        {members.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <Text style={styles.memberSummary}>{summarizeMember(member, locale)}</Text>
            {member.notes && <Text style={styles.memberNotes}>{member.notes}</Text>}
            <View style={styles.memberButtons}>
              <Pressable style={styles.adviceButton} onPress={() => getAdviceFor(member.id)}>
                <Text style={styles.adviceButtonText}>راهکار برای این فرد</Text>
              </Pressable>
              <Pressable style={styles.removeButton} onPress={() => removeMember(member.id)}>
                <Text style={styles.removeButtonText}>حذف</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {!formOpen ? (
        <Pressable style={styles.primaryButton} onPress={() => setFormOpen(true)}>
          <Text style={styles.primaryButtonText}>افزودن فرد جدید</Text>
        </Pressable>
      ) : (
        <View style={styles.section}>
          <Text style={styles.question}>اسم</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="مثلاً: مامان..."
            placeholderTextColor="#64748b"
          />

          <Text style={styles.question}>رابطه</Text>
          <View style={styles.chipRow}>
            {ALL_RELATIONS.map((r) => (
              <Pressable key={r} style={[styles.chip, relation === r && styles.chipSelected]} onPress={() => setRelation(r)}>
                <Text style={styles.chipText}>{RELATION_LABEL[r][locale]}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.question}>{`ویژگی‌های شخصیتی (حداکثر ${MAX_TRAITS} مورد، اختیاری)`}</Text>
          <View style={styles.chipRow}>
            {(Object.keys(TRAIT_LABEL) as PersonalityTrait[]).map((t) => (
              <Pressable key={t} style={[styles.chip, traits.includes(t) && styles.chipSelected]} onPress={() => toggleTrait(t)}>
                <Text style={styles.chipText}>{TRAIT_LABEL[t][locale]}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.question}>یادداشت (اختیاری)</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="هر چیز دیگه‌ای که دوست داری یادت بمونه..."
            placeholderTextColor="#64748b"
          />

          <View style={styles.formButtons}>
            <Pressable style={[styles.primaryButton, !canSave && styles.disabledButton]} disabled={!canSave} onPress={save}>
              <Text style={styles.primaryButtonText}>ذخیره</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setFormOpen(false)}>
              <Text style={styles.cancelButtonText}>انصراف</Text>
            </Pressable>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 40 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 8 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600", marginTop: 8 },
  emptyText: { color: "#94a3b8", fontSize: 13, textAlign: "right" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  input: {
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, flex: 1 },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  formButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
  cancelButton: { borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 8, flex: 1, borderWidth: 1, borderColor: "#475569" },
  cancelButtonText: { color: "#cbd5e1", fontSize: 15, fontWeight: "600" },
  memberCard: { marginTop: 10, borderRadius: 12, borderWidth: 1, borderColor: "#334155", padding: 12 },
  memberSummary: { color: "#e2e8f0", fontSize: 14, fontWeight: "600", textAlign: "right" },
  memberNotes: { color: "#94a3b8", fontSize: 12, textAlign: "right", marginTop: 4 },
  memberButtons: { flexDirection: "row", gap: 8, marginTop: 8 },
  adviceButton: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center", borderWidth: 1, borderColor: "#475569" },
  adviceButtonText: { color: "#cbd5e1", fontSize: 12, fontWeight: "600" },
  removeButton: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14, alignItems: "center", borderWidth: 1, borderColor: "#7f1d1d" },
  removeButtonText: { color: "#f87171", fontSize: 12, fontWeight: "600" },
});
