import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { Locale, VoiceService } from "@/types";

/**
 * Cross-platform voice abstraction.
 *
 * TTS ("speak"): expo-speech works on iOS, Android *and* web (it wraps
 * window.speechSynthesis there), so it's used unconditionally.
 *
 * STT ("listen"): there is no first-party Expo module for on-device
 * speech-to-text as of SDK 51. This implementation:
 *   - uses the browser's Web Speech API when running on web (Chrome/Edge
 *     support it; Safari/Firefox may not — isListeningSupported() reports
 *     that honestly).
 *   - on iOS/Android, isListeningSupported() returns false so the UI
 *     always falls back to the typing input, per the product requirement
 *     that voice must never be a hard dependency. To add real native
 *     STT, wire a package such as `expo-speech-recognition` or a cloud
 *     STT API here — the rest of the app only depends on this interface.
 */

const speechLang = (locale: Locale = "fa"): string => (locale === "fa" ? "fa-IR" : "en-US");

const speak = async (text: string, locale: Locale = "fa"): Promise<void> => {
  await Speech.stop();
  return new Promise((resolve) => {
    Speech.speak(text, {
      language: speechLang(locale),
      pitch: 1.0,
      rate: 0.95,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
};

const stopSpeaking = async (): Promise<void> => {
  await Speech.stop();
};

type WebSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

const getWebSpeechRecognitionCtor = (): (new () => WebSpeechRecognition) | null => {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

let activeRecognition: WebSpeechRecognition | null = null;

const isListeningSupported = (): boolean => getWebSpeechRecognitionCtor() !== null;

const listen = (): Promise<string> => {
  const Ctor = getWebSpeechRecognitionCtor();
  if (!Ctor) {
    return Promise.reject(
      new Error(
        "Speech-to-text is not available on this platform/browser. Use the typed input instead."
      )
    );
  }
  return new Promise((resolve, reject) => {
    const recognition = new Ctor();
    recognition.lang = "fa-IR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    activeRecognition = recognition;

    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript ?? "";
      resolve(transcript);
    };
    recognition.onerror = (event: any) => {
      reject(new Error(event?.error ?? "speech_recognition_error"));
    };
    recognition.onend = () => {
      activeRecognition = null;
    };
    recognition.start();
  });
};

const stopListening = (): void => {
  activeRecognition?.stop();
  activeRecognition = null;
};

export const voiceService: VoiceService = {
  speak,
  stopSpeaking,
  isListeningSupported,
  listen,
  stopListening,
};
