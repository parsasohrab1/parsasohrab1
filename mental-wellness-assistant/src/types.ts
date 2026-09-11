/**
 * Core domain types for the mental-wellness screening & support engine.
 *
 * NOTE ON SCOPE: this app produces a *self-report likelihood indicator*,
 * not a clinical diagnosis. Every place that surfaces a score to the user
 * must also surface the disclaimer in src/data/disclaimers.ts.
 */

export type Locale = "fa" | "en";

export type ConditionCategory =
  | "mood"
  | "anxiety"
  | "attention"
  | "trauma"
  | "psychotic_spectrum"
  | "sleep_substance"
  | "eating"
  | "neurodevelopmental"
  | "stress"
  | "safety";

/** A screenable mental-health condition cluster (or a safety-net cluster). */
export interface ConditionDef {
  id: string;
  category: ConditionCategory;
  name: { fa: string; en: string };
  shortDescription: { fa: string; en: string };
  /** True for clusters (e.g. Parkinsonian motor symptoms) that this app
   *  can only flag for urgent physician referral, never score. */
  referralOnly?: boolean;
}

export type AnswerValue = 0 | 1 | 2 | 3;

export interface AnswerOption {
  label: { fa: string; en: string };
  value: AnswerValue;
}

export type QuestionStage = "core" | "followup";

export interface ScreeningQuestion {
  id: string;
  conditionId: string;
  stage: QuestionStage;
  text: { fa: string; en: string };
  options: AnswerOption[];
  /** Marks items that feed the safety/crisis gate in addition to scoring. */
  isSafetyItem?: boolean;
}

export interface AnsweredQuestion {
  questionId: string;
  conditionId: string;
  value: AnswerValue;
  /** Present only when the user typed a free-text reply instead of (or in
   *  addition to) picking an option — scanned by the crisis detector. */
  freeText?: string;
  answeredAt: string;
}

export interface ConditionScore {
  conditionId: string;
  itemsAnswered: number;
  rawScore: number;
  maxPossible: number;
  /** 0-100, heuristic, NOT a clinical probability. */
  likelihoodPercent: number;
  band: "low" | "moderate" | "elevated" | "high";
}

export interface ScreeningResult {
  sessionId: string;
  completedAt: string;
  scores: ConditionScore[];
  topConditionIds: string[];
  referralFlags: string[];
  crisis: CrisisAssessment;
}

export interface CrisisAssessment {
  triggered: boolean;
  reasons: string[];
  severity: "none" | "watch" | "urgent";
}

export type Mood =
  | "sad"
  | "anxious"
  | "angry"
  | "numb"
  | "overwhelmed"
  | "lonely"
  | "hopeful"
  | "calm";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  moodTags: Mood[];
  durationSec: number;
  /** null = catalog metadata only; wire a real CDN/Spotify/Apple Music URL
   *  in production. One demo tone is provided so playback wiring is testable. */
  audioUrl: string | null;
}

export interface Playlist {
  id: string;
  mood: Mood;
  title: { fa: string; en: string };
  trackIds: string[];
}

export interface SupplementTip {
  id: string;
  conditionIds: string[];
  tip: { fa: string; en: string };
  /** Always render alongside the tip. */
  disclaimer: { fa: string; en: string };
}

export interface SyntheticUserProfile {
  id: string;
  age: number;
  sex: "female" | "male" | "other";
  trueLatentConditionId: string | null;
  answers: AnsweredQuestion[];
}

export interface VoiceService {
  speak: (text: string, locale?: Locale) => Promise<void>;
  stopSpeaking: () => Promise<void>;
  isListeningSupported: () => boolean;
  listen: () => Promise<string>;
  stopListening: () => void;
}
