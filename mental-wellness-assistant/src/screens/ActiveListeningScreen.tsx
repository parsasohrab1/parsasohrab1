import React, { useEffect, useRef, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import * as SMS from "expo-sms";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { useSession } from "@/state/SessionContext";
import { useActiveListeningSetting } from "@/state/useActiveListeningSetting";
import { useTrustedContact } from "@/state/useTrustedContact";
import { voiceService } from "@/voice/voiceService";
import { detectEmergency, summarizeListeningPeriod } from "@/engine/activeListeningEngine";
import { getCurrentLocationInfo } from "@/services/locationService";
import { emergencyContactForCategory } from "@/data/emergencyContacts";
import Disclaimer from "@/components/Disclaimer";
import ChatBubble from "@/components/ChatBubble";
import { DISCLAIMERS } from "@/data/disclaimers";
import { EmergencyDetection, LocationInfo } from "@/types";

type Props = NativeStackScreenProps<RootStackParamList, "ActiveListening">;

type Phase = "consent" | "ask_contact_name" | "ask_contact_phone" | "idle" | "listening" | "confirming";

interface Turn {
  from: "assistant" | "user";
  text: string;
}

const CATEGORY_MESSAGE: Record<EmergencyDetection["category"], { fa: string; en: string }> = {
  police: {
    fa: "به نظر می‌رسد یک درگیری یا نیاز به پلیس شنیده شد.",
    en: "It sounds like a fight or a need for the police was heard.",
  },
  fire: {
    fa: "به نظر می‌رسد صحبتی دربارهٔ آتش‌سوزی شنیده شد.",
    en: "It sounds like a fire was mentioned.",
  },
  medical: {
    fa: "به نظر می‌رسد یک وضعیت پزشکی اورژانسی شنیده شد.",
    en: "It sounds like a medical emergency was mentioned.",
  },
  duress: {
    fa: "به نظر می‌رسد کسی تحت فشار یا اجبار قرار دارد.",
    en: "It sounds like someone is being pressured or coerced.",
  },
};

export default function ActiveListeningScreen({ navigation }: Props) {
  const { locale, voiceEnabled } = useSession();
  const { enabled, loaded: settingLoaded, setEnabled } = useActiveListeningSetting();
  const { contact, loaded: contactLoaded, saveContact } = useTrustedContact();

  const [phase, setPhase] = useState<Phase>("consent");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [detection, setDetection] = useState<EmergencyDetection | null>(null);
  const [location, setLocation] = useState<LocationInfo | null | "loading">(null);
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [summaryIntervalMinutes, setSummaryIntervalMinutes] = useState<30 | 60 | null>(null);
  const [lastSummary, setLastSummary] = useState<{ fa: string; en: string } | null>(null);
  const stopRequestedRef = useRef(false);
  const initialized = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const listeningSupported = voiceService.isListeningSupported();
  const periodTranscriptCountRef = useRef(0);
  const periodDetectionsRef = useRef<EmergencyDetection[]>([]);

  useEffect(() => {
    if (!settingLoaded || !contactLoaded || initialized.current) return;
    initialized.current = true;
    setPhase(enabled ? "idle" : "consent");
  }, [settingLoaded, contactLoaded, enabled]);

  const fireSummary = () => {
    const summary = summarizeListeningPeriod(periodTranscriptCountRef.current, periodDetectionsRef.current);
    periodTranscriptCountRef.current = 0;
    periodDetectionsRef.current = [];
    setLastSummary(summary);
    say(summary[locale]);
  };

  useEffect(() => {
    if (phase !== "listening" || !summaryIntervalMinutes) return;
    const id = setInterval(fireSummary, summaryIntervalMinutes * 60 * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, summaryIntervalMinutes]);

  const say = (text: string, from: Turn["from"] = "assistant") => {
    setTurns((prev) => [...prev, { from, text }]);
    if (from === "assistant" && voiceEnabled) voiceService.speak(text, locale);
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  const enableFeature = async () => {
    say(
      locale === "fa"
        ? "گوش فعال را روشن کردی. این قابلیت فقط تا وقتی این صفحه باز است کار می‌کند."
        : "You turned active listening on. It only works while this screen stays open.",
      "user"
    );
    await setEnabled(true);
    if (!contact) {
      setPhase("ask_contact_name");
      say(
        locale === "fa"
          ? "دوست داری اسم و شمارهٔ یک دوست مورد اعتماد رو هم ثبت کنم؟ اگر متوجه بشم کسی تحت فشارت گذاشته، بهش پیام می‌فرستم که فوری باهات تماس بگیرد. می‌تونی این مرحله را رد کنی."
          : "Want me to save a trusted friend's name and number too? If I notice you're being pressured, I can message them to call you right away. You can skip this."
      );
    } else {
      setPhase("idle");
    }
  };

  const pendingNameRef = useRef<string>("");

  const submitContactName = () => {
    const name = draft.trim();
    if (!name) return;
    say(name, "user");
    pendingNameRef.current = name;
    setDraft("");
    setPhase("ask_contact_phone");
    say(locale === "fa" ? "شمارهٔ تماسش چند است؟" : "What is their phone number?");
  };

  const submitContactPhone = async () => {
    const phone = draft.trim();
    if (!phone) return;
    say(phone, "user");
    setDraft("");
    await saveContact({ name: pendingNameRef.current || "دوست مورد اعتماد", phone });
    say(locale === "fa" ? "ذخیره شد. حالا آماده‌ام." : "Saved. I'm ready now.");
    setPhase("idle");
  };

  const skipContactSetup = () => {
    say(locale === "fa" ? "رد کردن" : "Skip", "user");
    setPhase("idle");
  };

  const startListeningLoop = async () => {
    stopRequestedRef.current = false;
    setPhase("listening");
    say(locale === "fa" ? "شروع کردم به گوش‌دادن..." : "I've started listening...");

    let consecutiveErrors = 0;
    while (!stopRequestedRef.current) {
      let transcript = "";
      try {
        transcript = await voiceService.listen();
        consecutiveErrors = 0;
      } catch {
        consecutiveErrors++;
        if (consecutiveErrors >= 3) {
          say(
            locale === "fa"
              ? "چند بار پشت‌سرهم نتوانستم صدا را تشخیص دهم؛ گوش‌دادن را متوقف کردم."
              : "I couldn't pick up audio several times in a row, so I stopped listening."
          );
          setPhase("idle");
          return;
        }
        continue;
      }
      if (stopRequestedRef.current) break;
      if (!transcript.trim()) continue;

      setTurns((prev) => [...prev, { from: "user", text: transcript }]);
      periodTranscriptCountRef.current += 1;
      const found = detectEmergency(transcript);
      if (found) {
        periodDetectionsRef.current.push(found);
        setDetection(found);
        setPhase("confirming");
        setLocation("loading");
        getCurrentLocationInfo().then(setLocation);
        say(CATEGORY_MESSAGE[found.category][locale]);
        return;
      }
    }
    setPhase("idle");
  };

  const stopListening = () => {
    stopRequestedRef.current = true;
    voiceService.stopListening();
    setPhase("idle");
  };

  const callNumber = (phone: string) => Linking.openURL(`tel:${phone}`);

  /** Always opens the phone's own SMS composer (expo-sms) or, if that
   *  module isn't available on this platform, the "sms:" URL scheme —
   *  either way the user still has to tap Send themselves. Never sends
   *  silently. */
  const sendSmsToContact = async (phone: string, message: string) => {
    try {
      const available = await SMS.isAvailableAsync();
      if (available) {
        const result = await SMS.sendSMSAsync([phone], message);
        setSmsStatus(result.result);
        return;
      }
    } catch {
      // Falls through to the Linking fallback below.
    }
    Linking.openURL(`sms:${phone}?body=${encodeURIComponent(message)}`).catch(() => {
      setSmsStatus("unavailable");
    });
  };

  const messageTrustedContact = async () => {
    if (!contact) return;
    const message = locale === "fa" ? "با من تماس بگیر، فوری!" : "Call me right now!";
    await sendSmsToContact(contact.phone, message);
  };

  const falseAlarmContinue = () => {
    setDetection(null);
    setLocation(null);
    setSmsStatus(null);
    startListeningLoop();
  };

  const backToIdle = () => {
    setDetection(null);
    setLocation(null);
    setSmsStatus(null);
    setPhase("idle");
  };

  const contactForDetection = detection && detection.category !== "duress" ? emergencyContactForCategory(detection.category) : null;

  return (
    <ScrollView contentContainerStyle={styles.container} ref={scrollRef}>
      <Text style={styles.heading}>گوش فعال</Text>
      <Disclaimer text={DISCLAIMERS.activeListeningLimitations} tone="warning" />

      <View style={styles.chat}>
        {turns.map((t, i) => (
          <ChatBubble key={i} text={t.text} from={t.from} />
        ))}
      </View>

      {phase === "consent" && (
        <View style={styles.actions}>
          <Text style={styles.body}>
            با روشن‌کردن این قابلیت، وقتی این صفحه باز است، دستیار گفتار اطراف را به متن تبدیل می‌کند و
            دنبال عبارات مرتبط با درگیری، آتش‌سوزی، نیاز پزشکی یا فشار/اجبار می‌گردد.
          </Text>
          <Pressable style={styles.primaryButton} onPress={enableFeature}>
            <Text style={styles.primaryButtonText}>بله، گوش فعال را روشن کن</Text>
          </Pressable>
        </View>
      )}

      {(phase === "ask_contact_name" || phase === "ask_contact_phone") && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={phase === "ask_contact_name" ? "اسم دوست..." : "شماره تماس..."}
            placeholderTextColor="#64748b"
            keyboardType={phase === "ask_contact_phone" ? "phone-pad" : "default"}
            onSubmitEditing={phase === "ask_contact_name" ? submitContactName : submitContactPhone}
          />
          <Pressable
            style={styles.sendButton}
            onPress={phase === "ask_contact_name" ? submitContactName : submitContactPhone}
          >
            <Text style={styles.sendText}>ارسال</Text>
          </Pressable>
          {phase === "ask_contact_name" && (
            <Pressable style={styles.skipButton} onPress={skipContactSetup}>
              <Text style={styles.skipText}>رد کردن</Text>
            </Pressable>
          )}
        </View>
      )}

      {phase === "idle" && (
        <View style={styles.actions}>
          <Text style={styles.body}>
            {contact
              ? `دوست مورد اعتماد ثبت‌شده: ${contact.name} (${contact.phone})`
              : "هنوز دوست مورد اعتمادی ثبت نکرده‌اید."}
          </Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => {
              setPhase("ask_contact_name");
              say(locale === "fa" ? "اسم دوست مورد اعتمادت چیه؟" : "What is your trusted friend's name?");
            }}
          >
            <Text style={styles.secondaryButtonText}>{contact ? "ویرایش دوست مورد اعتماد" : "ثبت دوست مورد اعتماد"}</Text>
          </Pressable>

          <Text style={styles.body}>
            برای اطمینان‌خاطر (مثلاً وقتی پرستار بچه کنارتان است)، می‌توانید هر چند وقت یک‌بار خلاصهٔ
            آنچه شنیده شده را دریافت کنید:
          </Text>
          <View style={styles.chipRow}>
            {[
              { value: null as 30 | 60 | null, label: "فقط دستی" },
              { value: 30 as 30 | 60 | null, label: "هر ۳۰ دقیقه" },
              { value: 60 as 30 | 60 | null, label: "هر ۶۰ دقیقه" },
            ].map((opt) => (
              <Pressable
                key={String(opt.value)}
                style={[styles.chip, summaryIntervalMinutes === opt.value && styles.chipActive]}
                onPress={() => setSummaryIntervalMinutes(opt.value)}
              >
                <Text style={[styles.chipText, summaryIntervalMinutes === opt.value && styles.chipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {listeningSupported ? (
            <Pressable style={styles.primaryButton} onPress={startListeningLoop}>
              <Text style={styles.primaryButtonText}>شروع گوش‌دادن</Text>
            </Pressable>
          ) : (
            <Text style={styles.unsupportedText}>
              تشخیص گفتار روی این دستگاه/مرورگر در دسترس نیست، پس این قابلیت اینجا قابل‌استفاده نیست.
            </Text>
          )}
        </View>
      )}

      {phase === "listening" && (
        <View style={styles.actions}>
          <Text style={styles.listeningIndicator}>🎙️ در حال گوش‌دادن...</Text>
          {summaryIntervalMinutes && (
            <Text style={styles.body}>خلاصهٔ بعدی خودکار: هر {summaryIntervalMinutes} دقیقه</Text>
          )}
          <Pressable style={styles.secondaryButton} onPress={fireSummary}>
            <Text style={styles.secondaryButtonText}>دریافت خلاصه الان</Text>
          </Pressable>
          {lastSummary && (
            <View style={styles.summaryCard}>
              <Text style={styles.body}>{lastSummary[locale]}</Text>
              {contact && (
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => sendSmsToContact(contact.phone, lastSummary[locale])}
                >
                  <Text style={styles.secondaryButtonText}>ارسال این خلاصه به {contact.name}</Text>
                </Pressable>
              )}
            </View>
          )}
          <Pressable style={styles.stopButton} onPress={stopListening}>
            <Text style={styles.stopButtonText}>توقف</Text>
          </Pressable>
        </View>
      )}

      {phase === "confirming" && detection && (
        <View style={styles.actions}>
          <Text style={styles.detectedPhrase}>عبارت شنیده‌شده: «{detection.matchedPhrase}»</Text>

          <Text style={styles.body}>
            {location === "loading"
              ? "در حال یافتن موقعیت مکانی..."
              : location === null
                ? "موقعیت مکانی در دسترس نیست."
                : location.address
                  ? `آدرس تقریبی: ${location.address}`
                  : `مختصات: ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}
          </Text>

          {contactForDetection && (
            <Pressable style={styles.callButton} onPress={() => callNumber(contactForDetection.phone)}>
              <Text style={styles.callButtonText}>تماس با {contactForDetection.label[locale]}</Text>
            </Pressable>
          )}

          {detection.category === "duress" &&
            (contact ? (
              <Pressable style={styles.callButton} onPress={messageTrustedContact}>
                <Text style={styles.callButtonText}>ارسال پیام به {contact.name}: «با من تماس بگیر، فوری!»</Text>
              </Pressable>
            ) : (
              <Text style={styles.body}>دوست مورد اعتمادی ثبت نشده؛ می‌توانید در عوض با پلیس تماس بگیرید.</Text>
            ))}
          {detection.category === "duress" && (
            <Pressable
              style={styles.secondaryButton}
              onPress={() => callNumber(emergencyContactForCategory("police")!.phone)}
            >
              <Text style={styles.secondaryButtonText}>تماس با پلیس ۱۱۰</Text>
            </Pressable>
          )}
          {smsStatus && <Text style={styles.body}>وضعیت پیامک: {smsStatus}</Text>}

          <Pressable style={styles.secondaryButton} onPress={falseAlarmContinue}>
            <Text style={styles.secondaryButtonText}>اشتباه بود، به گوش‌دادن ادامه بده</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={backToIdle}>
            <Text style={styles.secondaryButtonText}>بازگشت</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={styles.textLink} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.textLinkText}>بازگشت به صفحهٔ اصلی</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 4, paddingBottom: 48 },
  heading: { color: "#f8fafc", fontSize: 20, fontWeight: "700", textAlign: "right", marginBottom: 4 },
  chat: { marginTop: 8, marginBottom: 8 },
  body: { color: "#e2e8f0", fontSize: 14, textAlign: "right", lineHeight: 21, marginVertical: 6 },
  actions: { gap: 10, marginTop: 8 },
  primaryButton: { backgroundColor: "#2563eb", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  secondaryButton: { borderRadius: 12, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#475569" },
  secondaryButtonText: { color: "#e2e8f0", fontSize: 13, fontWeight: "600" },
  unsupportedText: { color: "#f59e0b", fontSize: 13, textAlign: "right", lineHeight: 19 },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "right",
  },
  sendButton: { backgroundColor: "#2563eb", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: "#fff", fontWeight: "600" },
  skipButton: { paddingHorizontal: 10, paddingVertical: 10 },
  skipText: { color: "#94a3b8", fontSize: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 18, paddingVertical: 7, paddingHorizontal: 13, borderWidth: 1, borderColor: "#475569" },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#cbd5e1", fontSize: 12 },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  summaryCard: { backgroundColor: "#1e293b", borderRadius: 12, padding: 12, gap: 8 },
  listeningIndicator: { color: "#f8fafc", fontSize: 16, textAlign: "center" },
  stopButton: { backgroundColor: "#dc2626", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  stopButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  detectedPhrase: { color: "#f59e0b", fontSize: 13, textAlign: "right" },
  callButton: { backgroundColor: "#dc2626", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  callButtonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  textLink: { paddingVertical: 16, alignItems: "center" },
  textLinkText: { color: "#60a5fa", fontSize: 13 },
});
