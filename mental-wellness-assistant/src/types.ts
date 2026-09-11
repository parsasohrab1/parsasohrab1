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

/** ایرانی (Iranian) vs خارجی (foreign/international) origin tag. */
export type MusicOrigin = "iranian" | "foreign";

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  moodTags: Mood[];
  /** true = باکلام (vocal/has lyrics), false = بی‌کلام (instrumental). */
  vocal: boolean;
  origin: MusicOrigin;
  genre: string;
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

export type VocalPreference = "vocal" | "instrumental" | "both";
export type OriginPreference = MusicOrigin | "both";

/**
 * A listener's music taste, captured once (voice or typed) and reused to
 * rank/filter the catalog. Persisted locally on-device only — see
 * state/useFavoriteMusic.ts — never sent anywhere.
 */
export interface FavoriteMusicProfile {
  favoriteArtists: string[];
  favoriteGenres: string[];
  vocalPreference: VocalPreference;
  originPreference: OriginPreference;
  updatedAt: string;
}

export interface MusicSearchQuery {
  text?: string;
  mood?: Mood;
  vocal?: VocalPreference;
  origin?: OriginPreference;
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

/**
 * Recipe / cooking-guide domain. The catalog in src/data/recipeCatalog.ts
 * is a seed set spanning several world cuisines, not an exhaustive
 * database of "every dish in the world" — see recipeCatalog.ts for the
 * honest scope note and the extension point for a real recipe API.
 */
export type CuisineId =
  | "iranian"
  | "french"
  | "italian"
  | "american"
  | "chinese"
  | "finnish"
  | "taiwanese"
  | "mexican"
  | "japanese"
  | "indian"
  | "thai"
  | "mediterranean";

export interface Cuisine {
  id: CuisineId;
  name: { fa: string; en: string };
}

export interface RecipeStep {
  index: number;
  instruction: { fa: string; en: string };
}

export interface Recipe {
  id: string;
  cuisineId: CuisineId;
  title: { fa: string; en: string };
  description: { fa: string; en: string };
  servings: number;
  totalTimeMinutes: number;
  ingredients: { fa: string; en: string }[];
  steps: RecipeStep[];
}

export interface RecipeSearchQuery {
  text?: string;
  cuisineId?: CuisineId;
}

/** What the cooking assistant understood from a step-advance utterance. */
export type StepCommand = "next" | "repeat" | "previous" | "stop" | "unknown";

/**
 * Children's storytelling domain. The narrator asks the child's age
 * range and gender first (to pick age-appropriate stories and a
 * matching protagonist name), then narrates paragraph by paragraph in
 * one of two voice styles.
 */
export type ChildAgeRange = "2-4" | "5-7" | "8-10" | "11-13";
export type ChildGender = "boy" | "girl" | "unspecified";
/** "motherly" = warmer, slower, higher-pitched narration; "normal" = a
 *  plain, everyday narration pace. See voice/voiceService.ts#speakStory. */
export type NarrationStyle = "motherly" | "normal";

export interface StorySetup {
  ageRange: ChildAgeRange | null;
  gender: ChildGender;
  style: NarrationStyle;
  /** Chosen once gender is picked, reused for every {{NAME}} token so
   *  the same protagonist name is used throughout a session. */
  protagonistName: string;
}

export interface Story {
  id: string;
  ageRanges: ChildAgeRange[];
  title: { fa: string; en: string };
  teaser: { fa: string; en: string };
  /** Each paragraph may contain the token {{NAME}}, substituted with
   *  StorySetup.protagonistName at narration time. */
  paragraphs: { fa: string; en: string }[];
  moral: { fa: string; en: string };
}

export interface StorySearchQuery {
  ageRange?: ChildAgeRange;
}

/**
 * Marriage/relationship guidance domain. NOTE ON SCOPE: this produces
 * general, non-clinical relationship suggestions drawn from a small
 * curated dataset (see data/relationshipStrategies.ts) — never a
 * replacement for a licensed couples/family therapist, and never advice
 * for an unsafe or abusive relationship, which routes to
 * RelationshipSafetyScreen instead of a strategy list.
 */
export type MaritalStatus = "married" | "engaged";
/** Captured only to phrase questions naturally (e.g. "همسرت" vs
 *  "نامزدت"); it never changes which advice is given. */
export type ClientGenderRole = "woman" | "man";

export interface CounselingProfile {
  status: MaritalStatus | null;
  genderRole: ClientGenderRole;
}

export type RelationshipTopic =
  | "communication"
  | "trust"
  | "finances"
  | "in_laws"
  | "conflict"
  | "expectations"
  | "premarital_readiness"
  | "connection"
  | "shared_decisions"
  | "jealousy"
  | "safety";

export interface CounselingQuestion {
  id: string;
  topic: RelationshipTopic;
  /** Which marital-status profiles this question is asked of; omit for
   *  "both". */
  appliesTo?: MaritalStatus[];
  stage: QuestionStage;
  text: { fa: string; en: string };
  options: AnswerOption[];
  /** Marks the always-asked item(s) that feed the relationship-safety gate. */
  isSafetyItem?: boolean;
}

export interface CounselingAnswer {
  questionId: string;
  topic: RelationshipTopic;
  value: AnswerValue;
  freeText?: string;
  answeredAt: string;
}

export interface TopicScore {
  topic: RelationshipTopic;
  itemsAnswered: number;
  /** 0-100 heuristic concern level for this topic — higher means the
   *  client's answers suggest more friction/need in this area. */
  concernPercent: number;
  band: "low" | "moderate" | "high";
}

export interface RelationshipStrategy {
  id: string;
  topics: RelationshipTopic[];
  appliesTo?: MaritalStatus[];
  /** Attribution: either a well-known therapeutic approach (the advice
   *  text is an original summary written for this app, not a quotation)
   *  or a traditional Persian proverb. */
  source: { fa: string; en: string };
  advice: { fa: string; en: string };
}

export interface RelationshipSafetyAssessment {
  triggered: boolean;
  reasons: string[];
  severity: "none" | "watch" | "urgent";
}

export interface CounselingResult {
  sessionId: string;
  completedAt: string;
  topicScores: TopicScore[];
  topTopics: RelationshipTopic[];
  recommendedStrategies: RelationshipStrategy[];
  safety: RelationshipSafetyAssessment;
}

/**
 * Fitness/nutrition guidance domain. NOTE ON SCOPE: BMI is a rough,
 * widely-used screening indicator — it does not account for muscle
 * mass, bone density, or individual health history, and is especially
 * unreliable for muscular athletes. This flow gives general,
 * non-clinical suggestions, never an individualized medical, dietetic,
 * or training plan — see DISCLAIMERS.fitnessNotSubstitute.
 */
export type AthleteStatus = "athlete" | "non_athlete";
export type ExercisePurpose = "health_fitness" | "professional_sport";
export type WeightGoal = "lose" | "gain" | "maintain";
export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export interface FitnessProfile {
  athleteStatus: AthleteStatus | null;
  exercisePurpose: ExercisePurpose | null;
  weightGoal: WeightGoal | null;
  heightCm: number | null;
  weightKg: number | null;
}

export type FitnessAdviceType = "nutrition" | "exercise";

export interface FitnessStrategy {
  id: string;
  type: FitnessAdviceType;
  bmiCategories: BmiCategory[];
  weightGoals?: WeightGoal[];
  /** Restricts to athletes or non-athletes; omit for both. */
  athleteStatus?: AthleteStatus[];
  exercisePurposes?: ExercisePurpose[];
  source: { fa: string; en: string };
  advice: { fa: string; en: string };
}

export interface FitnessResult {
  sessionId: string;
  completedAt: string;
  bmi: number;
  bmiCategory: BmiCategory;
  /** True for a muscular-athlete profile where BMI is a poor proxy for
   *  body composition — surfaced as a caveat, not hidden. */
  bmiLikelyUnreliable: boolean;
  /** Set when the stated weight goal runs counter to the BMI reading in
   *  a way worth a gentle caution (e.g. already underweight and wanting
   *  to lose more) — never blocks the result, just flags it. */
  cautionNote: { fa: string; en: string } | null;
  nutritionStrategies: FitnessStrategy[];
  exerciseStrategies: FitnessStrategy[];
}

/**
 * "Active listening" domain — an opt-in, foreground-only feature.
 *
 * NOTE ON SCOPE (read before touching this code): this is a keyword scan
 * over TRANSCRIBED SPEECH (via voiceService's existing speech-to-text),
 * not an acoustic classifier — it cannot hear a physical fight, a fire's
 * crackle, or a scream as a *sound*; it only reacts when someone's words
 * are picked up by STT and contain a matching phrase. It only runs while
 * ActiveListeningScreen is open and in the foreground — there is no
 * background/always-on listening in this scaffold, which would require
 * ejecting from the Expo managed workflow for a native background-audio
 * service. It NEVER calls emergency services or sends a message on its
 * own; every action opens the system dialer or SMS composer prefilled,
 * and still requires the user's own tap to actually go through. See
 * DISCLAIMERS.activeListeningLimitations, always rendered on this screen.
 */
export type EmergencyCategory = "police" | "fire" | "medical" | "duress";

export interface EmergencyDetection {
  category: EmergencyCategory;
  matchedPhrase: string;
  transcript: string;
  detectedAt: string;
}

/** Real emergency-service numbers — "duress" has none; that path messages
 *  a trusted contact instead (see TrustedContact). */
export interface EmergencyContact {
  category: Exclude<EmergencyCategory, "duress">;
  label: { fa: string; en: string };
  phone: string;
}

/** A close, trusted person the user can ask this feature to message —
 *  captured once via a short Q&A, persisted on-device only. */
export interface TrustedContact {
  name: string;
  phone: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  /** Reverse-geocoded address, when available (native platforms only;
   *  null on web or if reverse geocoding fails — coordinates still work
   *  everywhere as a fallback). */
  address: string | null;
}
