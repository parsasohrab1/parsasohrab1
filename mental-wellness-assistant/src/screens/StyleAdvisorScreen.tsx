import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useStyle } from "@/state/StyleContext";
import { useWardrobe } from "@/state/useWardrobe";
import { voiceService } from "@/voice/voiceService";
import { recommendMakeupLooks, suggestOutfit } from "@/engine/styleEngine";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { ApplicationPreference, BudgetLevel, FormalityLevel, GarmentCategory, Occasion } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "StyleAdvisor">;

type WizardStep = "occasion" | "budget" | "pref" | "photo" | "wardrobe";

const OCCASION_OPTIONS: { value: Occasion; label: { fa: string; en: string } }[] = [
  { value: "wedding", label: { fa: "عروسی", en: "Wedding" } },
  { value: "birthday", label: { fa: "جشن تولد", en: "Birthday" } },
  { value: "formal_event", label: { fa: "مراسم رسمی", en: "Formal event" } },
  { value: "mourning", label: { fa: "مراسم عزا", en: "Mourning" } },
  { value: "everyday", label: { fa: "روزمره", en: "Everyday" } },
];

const BUDGET_OPTIONS: { value: BudgetLevel; label: { fa: string; en: string } }[] = [
  { value: "has_budget", label: { fa: "بودجه و حوصلهٔ آرایشگاه دارم", en: "I have the budget/time for a salon" } },
  { value: "limited_budget", label: { fa: "بودجه یا وقتم محدود است", en: "My budget or time is limited" } },
];

const PREF_OPTIONS: { value: ApplicationPreference; label: { fa: string; en: string } }[] = [
  { value: "self", label: { fa: "خودم انجام می‌دهم", en: "I'll do it myself" } },
  { value: "friend_or_family", label: { fa: "یک دوست یا خانواده کمکم می‌کند", en: "A friend/family member will help" } },
  { value: "professional", label: { fa: "آرایشگر حرفه‌ای", en: "A professional makeup artist" } },
];

const CATEGORY_OPTIONS: { value: GarmentCategory; label: { fa: string; en: string } }[] = [
  { value: "dress", label: { fa: "پیراهن/لباس یک‌تکه", en: "Dress" } },
  { value: "top", label: { fa: "بالاتنه", en: "Top" } },
  { value: "bottom", label: { fa: "شلوار/دامن", en: "Bottom" } },
  { value: "shoes", label: { fa: "کفش", en: "Shoes" } },
  { value: "outerwear", label: { fa: "کت/ژاکت", en: "Outerwear" } },
  { value: "accessory", label: { fa: "اکسسوری", en: "Accessory" } },
];

const FORMALITY_OPTIONS: { value: FormalityLevel; label: { fa: string; en: string } }[] = [
  { value: "casual", label: { fa: "راحتی/روزمره", en: "Casual" } },
  { value: "semi_formal", label: { fa: "نیمه‌رسمی", en: "Semi-formal" } },
  { value: "formal", label: { fa: "رسمی", en: "Formal" } },
];

export default function StyleAdvisorScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const {
    occasion,
    budget,
    applicationPreference,
    selfPhotoUri,
    setOccasion,
    setBudget,
    setApplicationPreference,
    setSelfPhotoUri,
    finish,
  } = useStyle();
  const { items: wardrobe, addItem, removeItem } = useWardrobe();

  const [wizardStep, setWizardStep] = useState<WizardStep>("occasion");
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);
  const [tagCategory, setTagCategory] = useState<GarmentCategory>("top");
  const [tagFormality, setTagFormality] = useState<FormalityLevel>("casual");
  const [colorNote, setColorNote] = useState("");

  const pickPhoto = async (source: "camera" | "library", onDone: (uri: string) => void) => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({ quality: 0.6 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.6 });

    if (!result.canceled && result.assets[0]) onDone(result.assets[0].uri);
  };

  const finishAndShowResult = () => {
    const look = occasion ? recommendMakeupLooks({ occasion, budget, applicationPreference, selfPhotoUri })[0] ?? null : null;
    const outfitRaw = occasion ? suggestOutfit(occasion, wardrobe) : null;
    const outfit = outfitRaw ? { occasion: occasion!, items: outfitRaw.items, note: outfitRaw.note } : null;
    finish(look, outfit);
    if (voiceEnabled && look) voiceService.speak(look.name[locale], locale);
    navigation.navigate("StyleResults");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>مشاور استایل و آرایش</Text>
      <Disclaimer text={DISCLAIMERS.styleAdvisorLimitations} />

      {wizardStep === "occasion" && (
        <View style={styles.section}>
          <Text style={styles.question}>برای چه مناسبتی می‌خواهید آماده شوید؟</Text>
          <View style={styles.chipRow}>
            {OCCASION_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                style={[styles.chip, occasion === o.value && styles.chipActive]}
                onPress={() => {
                  setOccasion(o.value);
                  setWizardStep("budget");
                }}
              >
                <Text style={[styles.chipText, occasion === o.value && styles.chipTextActive]}>{o.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {wizardStep === "budget" && (
        <View style={styles.section}>
          <Text style={styles.question}>از نظر بودجه و وقت، شرایطتان چطور است؟</Text>
          <View style={styles.chipRow}>
            {BUDGET_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                style={[styles.chip, budget === o.value && styles.chipActive]}
                onPress={() => {
                  setBudget(o.value);
                  setWizardStep("pref");
                }}
              >
                <Text style={[styles.chipText, budget === o.value && styles.chipTextActive]}>{o.label[locale]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {wizardStep === "pref" && (
        <View style={styles.section}>
          <Text style={styles.question}>آرایش را چه کسی انجام می‌دهد؟</Text>
          <View style={styles.chipRow}>
            {PREF_OPTIONS.map((o) => (
              <Pressable
                key={o.value}
                style={[styles.chip, applicationPreference === o.value && styles.chipActive]}
                onPress={() => {
                  setApplicationPreference(o.value);
                  setWizardStep("photo");
                }}
              >
                <Text style={[styles.chipText, applicationPreference === o.value && styles.chipTextActive]}>
                  {o.label[locale]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {wizardStep === "photo" && (
        <View style={styles.section}>
          <Text style={styles.question}>می‌خواهید یک عکس از الان خودتان ثبت کنید؟ (اختیاری)</Text>
          <Text style={styles.note}>این عکس فقط روی گوشی خودتان می‌ماند و به هیچ‌جا ارسال نمی‌شود.</Text>
          {selfPhotoUri && <Image source={{ uri: selfPhotoUri }} style={styles.selfPhoto} />}
          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={() => pickPhoto("camera", setSelfPhotoUri)}>
              <Text style={styles.secondaryButtonText}>گرفتن عکس</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => pickPhoto("library", setSelfPhotoUri)}>
              <Text style={styles.secondaryButtonText}>انتخاب از گالری</Text>
            </Pressable>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => setWizardStep("wardrobe")}>
            <Text style={styles.primaryButtonText}>ادامه</Text>
          </Pressable>
        </View>
      )}

      {wizardStep === "wardrobe" && (
        <View style={styles.section}>
          <Text style={styles.question}>می‌خواهید عکسی از لباس‌ها/کفش‌هایتان اضافه کنید؟ (اختیاری)</Text>

          {wardrobe.length > 0 && (
            <View style={styles.wardrobeGrid}>
              {wardrobe.map((item) => (
                <View key={item.id} style={styles.wardrobeCard}>
                  <Image source={{ uri: item.photoUri }} style={styles.wardrobeThumb} />
                  <Text style={styles.wardrobeLabel}>
                    {CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label[locale]} ·{" "}
                    {FORMALITY_OPTIONS.find((f) => f.value === item.formality)?.label[locale]}
                  </Text>
                  <Pressable onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeText}>حذف</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {pendingPhotoUri ? (
            <View style={styles.tagForm}>
              <Image source={{ uri: pendingPhotoUri }} style={styles.selfPhoto} />
              <Text style={styles.note}>این چه نوع لباسی است؟</Text>
              <View style={styles.chipRow}>
                {CATEGORY_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    style={[styles.chip, tagCategory === o.value && styles.chipActive]}
                    onPress={() => setTagCategory(o.value)}
                  >
                    <Text style={[styles.chipText, tagCategory === o.value && styles.chipTextActive]}>{o.label[locale]}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.note}>چقدر رسمی است؟</Text>
              <View style={styles.chipRow}>
                {FORMALITY_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    style={[styles.chip, tagFormality === o.value && styles.chipActive]}
                    onPress={() => setTagFormality(o.value)}
                  >
                    <Text style={[styles.chipText, tagFormality === o.value && styles.chipTextActive]}>{o.label[locale]}</Text>
                  </Pressable>
                ))}
              </View>
              <TextInput
                style={styles.input}
                value={colorNote}
                onChangeText={setColorNote}
                placeholder="رنگ یا توضیح کوتاه (مثلاً مشکی ساده)"
                placeholderTextColor="#64748b"
              />
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  addItem(pendingPhotoUri, tagCategory, tagFormality, colorNote.trim());
                  setPendingPhotoUri(null);
                  setColorNote("");
                }}
              >
                <Text style={styles.primaryButtonText}>افزودن به کمد لباس</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <Pressable style={styles.secondaryButton} onPress={() => pickPhoto("camera", setPendingPhotoUri)}>
                <Text style={styles.secondaryButtonText}>عکس از لباس</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => pickPhoto("library", setPendingPhotoUri)}>
                <Text style={styles.secondaryButtonText}>انتخاب از گالری</Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.primaryButton} onPress={finishAndShowResult}>
            <Text style={styles.primaryButtonText}>پایان و دریافت پیشنهاد</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  section: { marginTop: 16, gap: 10 },
  question: { color: "#f1f5f9", fontSize: 15, textAlign: "right", fontWeight: "600" },
  note: { color: "#94a3b8", fontSize: 12, textAlign: "right" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  buttonRow: { flexDirection: "row", gap: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 6 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#475569" },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 13, fontWeight: "600" },
  selfPhoto: { width: "100%", height: 220, borderRadius: 14, marginVertical: 8 },
  wardrobeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  wardrobeCard: { width: 110, gap: 4 },
  wardrobeThumb: { width: 110, height: 110, borderRadius: 10 },
  wardrobeLabel: { color: "#94a3b8", fontSize: 10, textAlign: "center" },
  removeText: { color: "#f87171", fontSize: 11, textAlign: "center" },
  tagForm: { gap: 8, backgroundColor: "#1e293b", borderRadius: 14, padding: 12 },
  input: {
    backgroundColor: "#0f172a",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
});
