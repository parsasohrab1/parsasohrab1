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

/**
 * Style/makeup advisor domain. NOTE ON SCOPE: this app does NOT do real
 * image generation or computer vision — it cannot render a photo of a
 * makeup look applied to your actual face, or automatically recognize
 * what's in a photo of your wardrobe. Recommendations are text/voice
 * descriptions from a small curated dataset, matched against occasion,
 * budget, and who's doing the makeup; wardrobe "matching" works off tags
 * the user enters themselves about their own photos, not automated
 * visual analysis. Every photo stays on-device only (local file URI),
 * never uploaded anywhere — there's no backend in this scaffold to
 * upload to. See DISCLAIMERS.styleAdvisorLimitations.
 */
export type Occasion = "wedding" | "birthday" | "formal_event" | "mourning" | "everyday";
export type BudgetLevel = "has_budget" | "limited_budget";
export type ApplicationPreference = "self" | "friend_or_family" | "professional";
export type GarmentCategory = "dress" | "top" | "bottom" | "shoes" | "outerwear" | "accessory";
export type FormalityLevel = "casual" | "semi_formal" | "formal";

export interface StyleProfile {
  occasion: Occasion | null;
  budget: BudgetLevel | null;
  applicationPreference: ApplicationPreference | null;
  /** Local file URI only — never uploaded. */
  selfPhotoUri: string | null;
}

export interface MakeupLook {
  id: string;
  occasions: Occasion[];
  budgets: BudgetLevel[];
  applicationPreferences: ApplicationPreference[];
  name: { fa: string; en: string };
  /** Step-by-step text description — not a rendered image. */
  steps: { fa: string; en: string }[];
  note: { fa: string; en: string };
}

export interface WardrobeItem {
  id: string;
  photoUri: string;
  category: GarmentCategory;
  formality: FormalityLevel;
  colorNote: string;
  addedAt: string;
}

export interface OutfitSuggestion {
  occasion: Occasion;
  items: WardrobeItem[];
  note: { fa: string; en: string };
}

export interface StyleResult {
  sessionId: string;
  completedAt: string;
  look: MakeupLook | null;
  outfit: OutfitSuggestion | null;
}

/**
 * "Companion" domain — a persisted, warm-toned presence layered on top
 * of the rest of the app. NOTE ON SCOPE (important, read before
 * extending): there is no real language-model conversation here. This
 * app is entirely static, pre-written content — question banks, canned
 * strategy text, scripted reflections — with no live AI text generation
 * anywhere in it. "Getting to know" the user means storing facts they
 * explicitly tell it and choosing pre-written, mood-matched responses
 * from a small dataset; it is not understanding in any real sense. A
 * genuinely open-ended companion that can respond intelligently to
 * anything would need a real LLM API wired in behind a backend (this
 * scaffold has none) — documented as the extension point, not built
 * here. See DISCLAIMERS.companionNotRealAI, always shown on this screen.
 */
export interface CompanionProfile {
  name: string | null;
  /** Short facts the user chose to share about themselves (hobbies,
   *  what stresses them, what cheers them up, ...), verbatim. */
  aboutMe: string[];
}

export interface MoodLogEntry {
  mood: Mood;
  note?: string;
  loggedAt: string;
}

/** Which existing app module a companion suggestion points to — the
 *  screen itself maps this to an actual navigation call. */
export type CompanionSuggestionKind =
  | "music"
  | "favorite_music"
  | "screening"
  | "fitness"
  | "counseling"
  | "recipes"
  | "storytelling";

export interface CompanionSuggestion {
  kind: CompanionSuggestionKind;
  label: { fa: string; en: string };
}

/**
 * Quit-coach ("ترک اعتیاد") domain. See
 * DISCLAIMERS.quitCoachMedicalSupervision, always shown on this screen:
 * this is general, motivational, gradual-reduction guidance only — never
 * a substitute for medical detox/supervision, which alcohol and some
 * drugs genuinely require.
 */
export type AddictionType = "smoking" | "alcohol" | "drugs" | "other";

export type QuitTrigger = "stress" | "social" | "boredom" | "habit_routine" | "physical_craving" | "other";

export interface QuitProfile {
  addictionType: AddictionType;
  /** Free-text description, only used/shown when addictionType === "other". */
  otherDescription: string | null;
  /** Free-text as the user said it (e.g. "10 cigarettes a day", "a few beers on weekends"). */
  dailyAmount: string | null;
  yearsOfHabit: number | null;
  pastQuitAttempts: number | null;
  primaryTrigger: QuitTrigger | null;
  /** The user's own stated reason for wanting to quit — used to personalize encouragement. */
  motivation: string | null;
}

export interface QuitPlanStep {
  order: number;
  title: { fa: string; en: string };
  advice: { fa: string; en: string };
}

export interface QuitCheckIn {
  /** Calendar day the check-in belongs to, as an ISO date (YYYY-MM-DD). */
  date: string;
  usedSubstance: boolean;
  /** 0 (no craving) to 5 (very strong craving). */
  cravingLevel: number;
  note?: string;
  loggedAt: string;
}

/**
 * Career-coach ("مشاور شغلی") domain. Mindset is discovered from a
 * short chip-based Q&A (never free-text NLU) and used to recommend a
 * subset of paths; "following the user until final success" is
 * implemented honestly as a local, on-device milestone checklist plus
 * a free-text journal — never a real push-notification/backend
 * tracking system, which this scaffold has no backend for.
 */
export type CareerMindset = "employee" | "entrepreneur";

export type CareerPath = "resume_applications" | "internship" | "skill_building" | "freelancing" | "business_startup";

export interface CareerMindsetAnswer {
  questionId: string;
  leansEntrepreneur: boolean;
}

export interface CareerProfile {
  mindset: CareerMindset;
  chosenPath: CareerPath | null;
}

export interface CareerMilestone {
  id: string;
  label: { fa: string; en: string };
  done: boolean;
}

export interface CareerJournalEntry {
  date: string;
  note: string;
  loggedAt: string;
}

/**
 * Song-identification domain. IMPORTANT SCOPE NOTE: there is no audio
 * fingerprinting or humming recognition here — this app cannot listen
 * to hummed melodies or an audio clip and identify a real song, and it
 * does not attempt to fake that. What it does do, honestly: fuzzy
 * text matching of a spoken/typed title, artist, or remembered lyric
 * fragment against this app's own small, fictional local music
 * catalog (see src/data/musicCatalog.ts — every track is invented for
 * this demo), plus a couple of original placeholder "lyrics" snippets
 * for a handful of those fictional tracks so the display pipeline is
 * testable without shipping any real, copyrighted lyrics. See
 * DISCLAIMERS.songIdLimitations, and engine/songIdEngine.ts for the
 * documented extension point (a real audio-fingerprinting provider
 * like ACRCloud/AudD, and a real lyrics provider like
 * Musixmatch/Genius) that a production build would need.
 */
export interface SongIdMatch {
  track: MusicTrack;
  /** 0-100 fuzzy text-match confidence against the local catalog only. */
  score: number;
}

export interface LyricsResult {
  trackId: string;
  lyrics: string | null;
  source: "local_demo_placeholder" | "unavailable";
}

/**
 * Social-situations advisor domain. Given a relation, a scenario, and
 * a few chip-picked personality traits of the OTHER person (never
 * free-text analysis of a third party — see DISCLAIMERS below), this
 * matches a small hand-written strategy dataset. It is general social
 * guidance, not a real psychological read of anyone.
 */
export type SocialRelation = "mother" | "father" | "sibling" | "spouse" | "in_law" | "friend" | "coworker" | "other";

export type SocialScenario =
  | "financial_boundary"
  | "unsolicited_advice"
  | "decision_disagreement"
  | "generosity_conflict"
  | "boundary_setting"
  | "family_expectation";

export type PersonalityTrait = "generous" | "frugal" | "controlling" | "flexible" | "traditional" | "modern" | "emotional" | "calm";

export interface SocialSituationProfile {
  relation: SocialRelation;
  scenario: SocialScenario;
  traits: PersonalityTrait[];
}

export interface SocialStrategy {
  id: string;
  relations: SocialRelation[];
  scenarios: SocialScenario[];
  traits: PersonalityTrait[];
  personalityNote: { fa: string; en: string };
  advice: { fa: string; en: string };
}

/**
 * Gift-recommendation domain. Synthetic, hand-written gift ideas only
 * — no real e-commerce/product data or prices, and book "suggestions"
 * are genre/topic categories to look for, never a specific real title
 * asserted as authoritative (to avoid copyright/accuracy overreach —
 * this app has no live catalog of real books). See
 * DISCLAIMERS.giftAdvisorLimitations.
 */
export type GiftRecipientRelation = "mother" | "father" | "sibling" | "spouse" | "partner" | "friend" | "coworker" | "child" | "other";

export type GiftAgeGroup = "child" | "teen" | "adult" | "senior";

export type GiftOccasion = "birthday" | "wedding" | "anniversary" | "graduation" | "holiday" | "housewarming" | "just_because" | "condolence";

export type GiftBudget = "low" | "medium" | "high";

export type GiftInterest =
  | "reading"
  | "cooking"
  | "sports"
  | "music"
  | "art"
  | "technology"
  | "travel"
  | "fashion"
  | "home_decor"
  | "gardening"
  | "gaming"
  | "wellness";

export interface GiftProfile {
  relation: GiftRecipientRelation;
  ageGroup: GiftAgeGroup;
  occasion: GiftOccasion;
  budget: GiftBudget;
  interests: GiftInterest[];
}

export interface GiftIdea {
  id: string;
  interests: GiftInterest[];
  occasions: GiftOccasion[];
  budgets: GiftBudget[];
  ageGroups: GiftAgeGroup[];
  idea: { fa: string; en: string };
  isBookSuggestion?: boolean;
}

/**
 * Family-circle domain: a persisted, on-device list of the people
 * around the user (family, close friends, anyone influential in their
 * life) — a name, a relation, and a few user-picked personality
 * traits, reusing the same SocialRelation/PersonalityTrait vocabulary
 * as the social-situations advisor. This is explicitly NOT real
 * psychological knowledge of anyone; see
 * DISCLAIMERS.familyCircleLimitations. The point is only to let the
 * user save a person once and reuse that profile across many later
 * social-advisor situations, instead of re-picking relation/traits
 * every time.
 */
export interface FamilyMember {
  id: string;
  name: string;
  relation: SocialRelation;
  traits: PersonalityTrait[];
  notes: string | null;
}

/**
 * Personal-tasks domain: voice/typed commands like "email Mom saying
 * I'll be late" resolved against a small local address book, then
 * turned into a native mail/SMS/phone/WhatsApp action. IMPORTANT SCOPE
 * NOTE: every action only OPENS the relevant native app pre-filled —
 * it never sends an email, sends a text, places a call, or posts
 * anything by itself. The user's own final tap inside that other app
 * is always required; this is not a technical limitation to work
 * around but a deliberate safety boundary (silent, unconfirmed sending
 * is how spam/harassment tools work). There is also no real access to
 * the user's actual email account, SMS thread history, call log, or
 * phone contacts — only what the user explicitly saves here, on this
 * device. And there is no generic "connect to any app" capability:
 * only apps with a public URL scheme (mailto:, sms:, tel:, wa.me) can
 * be opened this way. See DISCLAIMERS.personalTasksLimitations and
 * engine/personalTaskEngine.ts's documented real-automation stub.
 */
export type PersonalTaskAction = "email" | "sms" | "call" | "whatsapp";

export interface QuickContact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface PersonalTaskIntent {
  /** null when the free-text parser couldn't detect an action — the
   *  screen then falls back to asking the user to pick one via chips. */
  action: PersonalTaskAction | null;
  contactName: string | null;
  message: string | null;
  subject: string | null;
}

export type PersonalTaskMissingInfo = "contact" | "phone" | "email" | "message";
