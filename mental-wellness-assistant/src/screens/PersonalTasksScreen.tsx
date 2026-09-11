import React, { useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as SMS from "expo-sms";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useQuickContacts } from "@/state/useQuickContacts";
import { voiceService } from "@/voice/voiceService";
import { buildActionUrl, missingInfoFor, parseIntent, resolveContact } from "@/engine/personalTaskEngine";
import MicButton from "@/components/MicButton";
import Disclaimer from "@/components/Disclaimer";
import { DISCLAIMERS } from "@/data/disclaimers";
import { PersonalTaskAction, PersonalTaskIntent, QuickContact } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "PersonalTasks">;

const ACTION_LABEL: Record<PersonalTaskAction, { fa: string; en: string }> = {
  email: { fa: "ایمیل", en: "Email" },
  sms: { fa: "پیامک", en: "Text message" },
  call: { fa: "تماس", en: "Phone call" },
  whatsapp: { fa: "واتساپ", en: "WhatsApp" },
};

export default function PersonalTasksScreen({}: Props) {
  const { locale, voiceEnabled } = useSession();
  const { contacts, loaded, addContact, removeContact } = useQuickContacts();

  const [command, setCommand] = useState("");
  const [listening, setListening] = useState(false);
  const [intent, setIntent] = useState<PersonalTaskIntent | null>(null);
  const [selectedContact, setSelectedContact] = useState<QuickContact | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const listeningSupported = voiceService.isListeningSupported();

  const say = (text: string) => {
    if (voiceEnabled) voiceService.speak(text, locale);
  };

  const resetFlow = () => {
    setIntent(null);
    setSelectedContact(null);
    setMessageDraft("");
    setConfirmed(false);
    setStatusText(null);
  };

  const runCommand = (text: string) => {
    const parsed = parseIntent(text);
    setIntent(parsed);
    const contact = resolveContact(parsed.contactName, contacts);
    setSelectedContact(contact);
    setMessageDraft(parsed.message ?? "");
    setConfirmed(false);
    setStatusText(null);
  };

  const startListening = async () => {
    try {
      setListening(true);
      const transcript = await voiceService.listen();
      setListening(false);
      if (transcript) {
        setCommand(transcript);
        runCommand(transcript);
      }
    } catch {
      setListening(false);
    }
  };

  const setAction = (action: PersonalTaskAction) => {
    if (!intent) return;
    setIntent({ ...intent, action });
  };

  const missing = intent && selectedContact ? missingInfoFor({ ...intent, message: messageDraft || null }, selectedContact) : null;
  const readyToConfirm = intent?.action && selectedContact && (missing?.length ?? 1) === 0;

  const confirmAndAct = async () => {
    if (!intent?.action || !selectedContact) return;
    setConfirmed(true);
    const actionLabel = ACTION_LABEL[intent.action][locale];
    say(
      locale === "fa"
        ? `باشه، برنامهٔ ${actionLabel} رو برای ${selectedContact.name} باز می‌کنم. ارسال نهایی با خودته.`
        : `Okay, opening ${actionLabel} for ${selectedContact.name}. The final send is up to you.`
    );

    if (intent.action === "call") {
      if (!selectedContact.phone) return;
      await Linking.openURL(`tel:${selectedContact.phone}`).catch(() => setStatusText("unavailable"));
      setStatusText("opened");
      return;
    }

    if (intent.action === "sms" && selectedContact.phone) {
      try {
        const available = await SMS.isAvailableAsync();
        if (available) {
          await SMS.sendSMSAsync([selectedContact.phone], messageDraft);
          setStatusText("opened");
          return;
        }
      } catch {
        // Falls through to the Linking fallback below.
      }
    }

    const url = buildActionUrl(intent.action, selectedContact, messageDraft || null, intent.subject);
    if (!url) {
      setStatusText("unavailable");
      return;
    }
    await Linking.openURL(url).catch(() => setStatusText("unavailable"));
    setStatusText("opened");
  };

  const saveContact = () => {
    if (!newName.trim()) return;
    addContact(newName, newPhone, newEmail);
    setNewName("");
    setNewPhone("");
    setNewEmail("");
    setContactFormOpen(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>دستیار کارهای شخصی</Text>
      <Disclaimer text={DISCLAIMERS.personalTasksLimitations} tone="warning" />

      <View style={styles.section}>
        <Text style={styles.question}>مخاطبین سریع</Text>
        {loaded && contacts.length === 0 && !contactFormOpen && (
          <Text style={styles.emptyText}>هنوز مخاطبی اضافه نکرده‌ای.</Text>
        )}
        {contacts.map((c) => (
          <View key={c.id} style={styles.contactRow}>
            <Text style={styles.contactText}>
              {c.name}
              {c.phone ? ` · ${c.phone}` : ""}
              {c.email ? ` · ${c.email}` : ""}
            </Text>
            <Pressable onPress={() => removeContact(c.id)}>
              <Text style={styles.removeText}>حذف</Text>
            </Pressable>
          </View>
        ))}

        {!contactFormOpen ? (
          <Pressable style={styles.secondaryButton} onPress={() => setContactFormOpen(true)}>
            <Text style={styles.secondaryButtonText}>افزودن مخاطب</Text>
          </Pressable>
        ) : (
          <View style={styles.formBox}>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="اسم" placeholderTextColor="#64748b" />
            <TextInput
              style={styles.input}
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="شماره تلفن (اختیاری)"
              placeholderTextColor="#64748b"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="ایمیل (اختیاری)"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.formButtons}>
              <Pressable style={[styles.primaryButton, !newName.trim() && styles.disabledButton]} disabled={!newName.trim()} onPress={saveContact}>
                <Text style={styles.primaryButtonText}>ذخیره</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => setContactFormOpen(false)}>
                <Text style={styles.cancelButtonText}>انصراف</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.question}>چه کاری برات انجام بدم؟</Text>
        <View style={styles.inputRow}>
          {listeningSupported && <MicButton listening={listening} onPress={startListening} />}
          <TextInput
            style={styles.input}
            value={command}
            onChangeText={setCommand}
            placeholder="مثلاً: به مامان پیامک بزن بگو دیر میام"
            placeholderTextColor="#64748b"
            onSubmitEditing={() => runCommand(command)}
          />
        </View>
        <Pressable style={styles.primaryButton} onPress={() => runCommand(command)}>
          <Text style={styles.primaryButtonText}>بررسی کن</Text>
        </Pressable>
      </View>

      {intent && (
        <View style={styles.section}>
          <Text style={styles.question}>نوع کار</Text>
          <View style={styles.chipRow}>
            {(Object.keys(ACTION_LABEL) as PersonalTaskAction[]).map((a) => (
              <Pressable key={a} style={[styles.chip, intent.action === a && styles.chipSelected]} onPress={() => setAction(a)}>
                <Text style={styles.chipText}>{ACTION_LABEL[a][locale]}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.question}>مخاطب</Text>
          {selectedContact ? (
            <Text style={styles.resolvedContact}>{selectedContact.name}</Text>
          ) : (
            <View style={styles.chipRow}>
              {contacts.map((c) => (
                <Pressable key={c.id} style={styles.chip} onPress={() => setSelectedContact(c)}>
                  <Text style={styles.chipText}>{c.name}</Text>
                </Pressable>
              ))}
              {contacts.length === 0 && <Text style={styles.emptyText}>اول یک مخاطب اضافه کن.</Text>}
            </View>
          )}

          {intent.action && intent.action !== "call" && (
            <>
              <Text style={styles.question}>متن پیام</Text>
              <TextInput
                style={styles.input}
                value={messageDraft}
                onChangeText={setMessageDraft}
                placeholder="متن پیام..."
                placeholderTextColor="#64748b"
              />
            </>
          )}

          {readyToConfirm && !confirmed && (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>
                {locale === "fa"
                  ? `آیا اجازه می‌دی برنامهٔ ${ACTION_LABEL[intent.action!][locale]} رو برای ${selectedContact!.name} با این محتوا باز کنم؟ (ارسال نهایی همیشه با خودته)`
                  : `Do you want me to open ${ACTION_LABEL[intent.action!][locale]} for ${selectedContact!.name} with this content? (the final send is always yours)`}
              </Text>
              <Pressable style={styles.primaryButton} onPress={confirmAndAct}>
                <Text style={styles.primaryButtonText}>بله، باز کن</Text>
              </Pressable>
            </View>
          )}

          {statusText === "opened" && <Text style={styles.statusOk}>برنامهٔ مربوطه باز شد — حالا خودت باید ارسال/تماس را نهایی کنی.</Text>}
          {statusText === "unavailable" && <Text style={styles.statusError}>باز کردن این برنامه روی این دستگاه ممکن نشد.</Text>}

          <Pressable style={styles.cancelButton} onPress={resetFlow}>
            <Text style={styles.cancelButtonText}>شروع دوباره</Text>
          </Pressable>
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
  emptyText: { color: "#94a3b8", fontSize: 13, textAlign: "right" },
  contactRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  contactText: { color: "#e2e8f0", fontSize: 13, textAlign: "right", flex: 1 },
  removeText: { color: "#f87171", fontSize: 12, marginStart: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4, flex: 1 },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: "#475569", marginTop: 6 },
  secondaryButtonText: { color: "#cbd5e1", fontSize: 13, fontWeight: "600" },
  formBox: { gap: 8, marginTop: 8 },
  formButtons: { flexDirection: "row", gap: 8 },
  cancelButton: { borderRadius: 14, paddingVertical: 12, alignItems: "center", marginTop: 8, borderWidth: 1, borderColor: "#475569" },
  cancelButtonText: { color: "#cbd5e1", fontSize: 14, fontWeight: "600" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: "#475569" },
  chipSelected: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 13 },
  resolvedContact: { color: "#93c5fd", fontSize: 14, fontWeight: "600", textAlign: "right" },
  confirmBox: { backgroundColor: "#0b2540", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#1d4ed8", gap: 8, marginTop: 8 },
  confirmText: { color: "#dbeafe", fontSize: 13, textAlign: "right", lineHeight: 19 },
  statusOk: { color: "#86efac", fontSize: 13, textAlign: "right", marginTop: 8 },
  statusError: { color: "#f87171", fontSize: 13, textAlign: "right", marginTop: 8 },
});
