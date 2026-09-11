/**
 * Synthetic data generator + engine demo.
 *
 * Run with `npm run generate:synthetic`. Generates N fake user profiles
 * (no real user data anywhere in this repo), drives each one through the
 * same adaptive question flow the app uses, scores the session with the
 * real screening engine, and prints everything to the console. This is
 * how the assistant's logic can be sanity-checked without a phone/browser.
 */
import { AnswerValue, AnsweredQuestion, SyntheticUserProfile } from "../src/types";
import { QUESTIONS, questionById } from "../src/data/questionBank";
import { CONDITIONS } from "../src/data/conditions";
import { getNextQuestionId, scoreSession, ScreeningMode } from "../src/engine/screeningEngine";
import { assessCrisis, textLooksLikeCrisis } from "../src/engine/crisisDetector";
import { moodFromScreeningResult, getPlaylistForResult } from "../src/engine/moodMusicEngine";
import { categorizeTracks, recommendForProfile } from "../src/engine/musicSearchEngine";
import { TRACKS } from "../src/data/musicCatalog";
import {
  AGE_RANGE_OPTIONS,
  pickProtagonistName,
  renderParagraph,
  renderTitle,
  storiesForAge,
} from "../src/engine/storytellingEngine";
import {
  getNextCounselingQuestionId,
  scoreCounselingSession,
} from "../src/engine/counselingEngine";
import { counselingQuestionById } from "../src/data/counselingQuestions";
import { scoreFitnessSession } from "../src/engine/fitnessEngine";
import {
  greeting,
  journalAcknowledgment,
  reflectionForMood,
  suggestionsForMood,
  summarizeRecentMoods,
} from "../src/engine/companionEngine";
import { buildQuitPlan, computeStreak, requiresMedicalCaution } from "../src/engine/quitCoachEngine";
import { inferMindset, milestonesForPath, progressSummary, recommendPaths } from "../src/engine/careerCoachEngine";
import { MINDSET_QUESTIONS, PATH_LABEL } from "../src/data/careerStrategies";
import {
  ChildAgeRange,
  ChildGender,
  CounselingAnswer,
  FavoriteMusicProfile,
  FitnessProfile,
  MaritalStatus,
  Mood,
  MoodLogEntry,
  QuitCheckIn,
  QuitProfile,
  CareerMindsetAnswer,
} from "../src/types";

const NUM_SYNTHETIC_USERS = 8;
const MODE: ScreeningMode = "full";

const SCOREABLE_LATENT_CONDITIONS = [
  "depression",
  "gad",
  "adhd",
  "insomnia",
  "ptsd",
  "bipolar",
  "panic",
  "social_anxiety",
];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[rand(0, arr.length - 1)];

/**
 * Simulates an answer value for a question given a synthetic user's
 * hidden ("latent") condition. Items matching the latent condition skew
 * toward higher severity; unrelated items skew low; safety items stay
 * low unless this specific synthetic persona is the one at-risk demo
 * case (see buildAtRiskUser below) — all of this is fabricated data for
 * demonstrating the scoring engine, never a real clinical simulation.
 */
function simulateAnswer(conditionId: string, latentConditionId: string | null): AnswerValue {
  const isTarget = conditionId === latentConditionId;
  const isSafety = conditionId === "suicide_risk";
  if (isSafety) return 0; // default: safe persona; overridden for the at-risk demo user
  if (isTarget) return pick([2, 2, 3]) as AnswerValue;
  return pick([0, 0, 1]) as AnswerValue;
}

function runSyntheticUser(id: string, latentConditionId: string | null, atRisk = false): SyntheticUserProfile {
  const answers: AnsweredQuestion[] = [];
  let answeredIds: string[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const nextId = getNextQuestionId(answeredIds, answers, MODE);
    if (!nextId) break;
    const q = questionById(nextId)!;

    let value: AnswerValue;
    if (q.isSafetyItem && atRisk) {
      value = pick([2, 3]) as AnswerValue; // demo-only: simulates a user who needs the crisis path
    } else {
      value = simulateAnswer(q.conditionId, latentConditionId);
    }

    const freeText =
      atRisk && q.isSafetyItem && value >= 2 ? "دیگه نمی‌تونم ادامه بدم" : undefined;

    answers.push({
      questionId: q.id,
      conditionId: q.conditionId,
      value,
      freeText,
      answeredAt: new Date().toISOString(),
    });
    answeredIds = answers.map((a) => a.questionId);

    // Crisis short-circuits the real app flow too; mirror that here.
    if (assessCrisis(answers).triggered) break;
  }

  return {
    id,
    age: rand(16, 65),
    sex: pick(["female", "male", "other"]),
    trueLatentConditionId: latentConditionId,
    answers,
  };
}

function printUserReport(user: SyntheticUserProfile) {
  console.log("\n" + "=".repeat(70));
  console.log(
    `Synthetic user ${user.id} | age=${user.age} sex=${user.sex} latent=${user.trueLatentConditionId ?? "none"}`
  );
  console.log("-".repeat(70));

  for (const a of user.answers) {
    const q = questionById(a.questionId);
    console.log(
      `  [${a.conditionId.padEnd(20)}] ${q?.text.en.slice(0, 60)}... -> ${a.value}${
        a.freeText ? `  (free text: "${a.freeText}")` : ""
      }`
    );
  }

  const result = scoreSession(user.id, user.answers);
  console.log("  -- Screening result --");
  if (result.crisis.triggered) {
    console.log(`  ⚠️  CRISIS FLOW TRIGGERED (severity=${result.crisis.severity}, reasons=${result.crisis.reasons.join(",")})`);
    console.log("      -> app would route to CrisisScreen with hotline numbers + grounding + music.");
  } else {
    for (const s of [...result.scores].sort((a, b) => b.likelihoodPercent - a.likelihoodPercent)) {
      const name = CONDITIONS.find((c) => c.id === s.conditionId)?.name.en ?? s.conditionId;
      console.log(`  ${String(s.likelihoodPercent).padStart(3)}% [${s.band.padEnd(8)}] ${name}`);
    }
    if (result.referralFlags.length > 0) {
      console.log(`  Referral flags: ${result.referralFlags.join(", ")} (physician referral, not scored)`);
    }
    const mood = moodFromScreeningResult(result);
    const playlist = getPlaylistForResult(result);
    console.log(`  Suggested mood: ${mood} -> playlist "${playlist.title.en}" (${playlist.trackIds.length} tracks)`);
  }
}

function main() {
  console.log(`Generating ${NUM_SYNTHETIC_USERS} synthetic users (mode=${MODE})...`);
  console.log(`Question bank size: ${QUESTIONS.length} | Condition catalog size: ${CONDITIONS.length}`);

  for (let i = 0; i < NUM_SYNTHETIC_USERS - 1; i++) {
    const latent = pick(SCOREABLE_LATENT_CONDITIONS);
    const user = runSyntheticUser(`synthetic_${i + 1}`, latent, false);
    printUserReport(user);
  }

  // One deliberately at-risk synthetic persona to exercise the crisis path end-to-end.
  const atRiskUser = runSyntheticUser("synthetic_at_risk", "depression", true);
  printUserReport(atRiskUser);

  console.log("\n" + "=".repeat(70));
  console.log("Standalone crisis keyword scan demo:");
  const samples = [
    "امروز حالم خوبه و انرژی دارم",
    "دیگه نمی‌خوام زنده باشم",
    "I'm just tired today",
    "I want to end my life",
  ];
  for (const s of samples) {
    console.log(`  "${s}" -> crisisKeywordMatch=${textLooksLikeCrisis(s)}`);
  }
  console.log("=".repeat(70));

  console.log("\nSynthetic marriage-counseling demo (profile asked -> Q&A -> strategies):");

  function runSyntheticCounselingClient(
    label: string,
    status: MaritalStatus,
    highConcernTopicQuestionId: string,
    atRisk: boolean
  ) {
    const answers: CounselingAnswer[] = [];
    let answeredIds: string[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextId = getNextCounselingQuestionId(answeredIds, answers, status);
      if (!nextId) break;
      const q = counselingQuestionById(nextId)!;
      let value: 0 | 1 | 2 | 3;
      if (q.isSafetyItem) {
        value = atRisk ? 3 : 0; // keep the safety item deterministic so this demo is reproducible
      } else if (nextId === highConcernTopicQuestionId) {
        value = 3;
      } else {
        value = pick([0, 0, 1]) as 0 | 1;
      }
      const freeText = atRisk && q.isSafetyItem ? "او همیشه تهدیدم می‌کنه و کنترلم می‌کنه" : undefined;
      answers.push({ questionId: q.id, topic: q.topic, value, freeText, answeredAt: new Date().toISOString() });
      answeredIds = answers.map((a) => a.questionId);
      if (freeText) break; // mirrors the app: a safety disclosure ends the Q&A immediately
    }

    const result = scoreCounselingSession(label, answers, status);
    console.log(`\n  Client: ${label} (${status})`);
    if (result.safety.triggered) {
      console.log(
        `  ⚠️  RELATIONSHIP SAFETY FLOW TRIGGERED (severity=${result.safety.severity}, reasons=${result.safety.reasons.join(",")})`
      );
      console.log("      -> app would route to RelationshipSafetyScreen with hotline numbers, not a strategy list.");
      return;
    }
    console.log(`    Top-concern topics: ${result.topTopics.join(", ") || "none"}`);
    for (const s of result.recommendedStrategies) {
      console.log(`    - ${s.advice.en} [${s.source.en}]`);
    }
  }

  runSyntheticCounselingClient("married_woman_finances", "married", "cq_finances", false);
  runSyntheticCounselingClient("engaged_man_premarital", "engaged", "cq_premarital_readiness", false);
  runSyntheticCounselingClient("married_man_at_risk", "married", "cq_trust", true);

  console.log("\n" + "=".repeat(70));

  console.log("\nSynthetic favorite-music profile demo:");
  const syntheticProfiles: FavoriteMusicProfile[] = [
    {
      favoriteArtists: ["مهتاب کیانی", "بامداد"],
      favoriteGenres: ["سنتی-فیوژن"],
      vocalPreference: "vocal",
      originPreference: "iranian",
      updatedAt: new Date().toISOString(),
    },
    {
      favoriteArtists: ["Ambient Collective"],
      favoriteGenres: ["ambient", "lo-fi"],
      vocalPreference: "instrumental",
      originPreference: "foreign",
      updatedAt: new Date().toISOString(),
    },
    {
      favoriteArtists: [],
      favoriteGenres: ["pop", "پاپ"],
      vocalPreference: "vocal",
      originPreference: "both",
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const [i, profile] of syntheticProfiles.entries()) {
    console.log(`\n  Profile ${i + 1}: artists=[${profile.favoriteArtists.join(", ") || "-"}] genres=[${profile.favoriteGenres.join(", ") || "-"}] vocal=${profile.vocalPreference} origin=${profile.originPreference}`);
    const ranked = recommendForProfile(profile, TRACKS).slice(0, 6);
    const categorized = categorizeTracks(ranked);
    console.log(`    Top picks: ${ranked.map((t) => `${t.title} (${t.artist})`).join(" | ")}`);
    console.log(
      `    Categorized -> vocal+iranian=${categorized.vocalIranian.length}, vocal+foreign=${categorized.vocalForeign.length}, instrumental+iranian=${categorized.instrumentalIranian.length}, instrumental+foreign=${categorized.instrumentalForeign.length}`
    );
  }

  console.log("\n" + "=".repeat(70));
  console.log("Synthetic storytelling setup demo (age range asked -> gender asked -> story rendered):");
  const storySetups: { age: ChildAgeRange; gender: ChildGender }[] = [
    { age: "2-4", gender: "girl" },
    { age: "8-10", gender: "boy" },
    { age: "11-13", gender: "unspecified" },
  ];
  for (const setup of storySetups) {
    const ageLabel = AGE_RANGE_OPTIONS.find((o) => o.value === setup.age)?.label.en ?? setup.age;
    const name = pickProtagonistName(setup.gender);
    const matches = storiesForAge(setup.age);
    const story = matches[0];
    console.log(`\n  Child: age=${ageLabel} gender=${setup.gender} -> protagonist name "${name}"`);
    console.log(`    Stories available for this age: ${matches.length}`);
    if (story) {
      console.log(`    First story: "${renderTitle(story, "en", name)}"`);
      console.log(`    Paragraph 1: ${renderParagraph(story, 1, "en", name)}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Synthetic fitness/BMI demo (profile asked -> BMI computed -> nutrition + exercise tips):");

  const syntheticFitnessProfiles: (FitnessProfile & { label: string })[] = [
    { label: "non_athlete_overweight_lose", athleteStatus: "non_athlete", exercisePurpose: "health_fitness", weightGoal: "lose", heightCm: 170, weightKg: 88 },
    { label: "athlete_muscular_normal_goal", athleteStatus: "athlete", exercisePurpose: "professional_sport", weightGoal: "maintain", heightCm: 180, weightKg: 95 },
    { label: "underweight_wants_to_lose_more", athleteStatus: "non_athlete", exercisePurpose: "health_fitness", weightGoal: "lose", heightCm: 168, weightKg: 45 },
  ];

  for (const { label, ...profile } of syntheticFitnessProfiles) {
    const result = scoreFitnessSession(label, profile);
    if (!result) continue;
    console.log(`\n  Client: ${label}`);
    console.log(`    BMI: ${result.bmi} (${result.bmiCategory})${result.bmiLikelyUnreliable ? " — flagged as likely unreliable (athlete)" : ""}`);
    if (result.cautionNote) {
      console.log(`    ⚠️  CAUTION: ${result.cautionNote.en}`);
    }
    console.log(`    Nutrition tips: ${result.nutritionStrategies.length}, Exercise tips: ${result.exerciseStrategies.length}`);
    for (const s of [...result.nutritionStrategies, ...result.exerciseStrategies].slice(0, 3)) {
      console.log(`      - ${s.advice.en}`);
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("Synthetic companion demo (stored name + a week of mood check-ins -> greeting + summary):");

  const companionName = "سارا";
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const syntheticMoodLog: MoodLogEntry[] = [
    { mood: "anxious", loggedAt: new Date(now - 1 * day).toISOString() },
    { mood: "anxious", loggedAt: new Date(now - 2 * day).toISOString() },
    { mood: "overwhelmed", loggedAt: new Date(now - 3 * day).toISOString() },
    { mood: "calm", loggedAt: new Date(now - 10 * day).toISOString() }, // outside the 7-day window
  ];

  console.log(`\n  Greeting: ${greeting(companionName, "fa")}`);
  const moodSummary = summarizeRecentMoods(syntheticMoodLog);
  console.log(
    `  Recent-mood summary: ${moodSummary.totalEntries} check-ins in the last 7 days, most common: ${moodSummary.mostCommonMood}`
  );

  const todayMood: Mood = "anxious";
  console.log(`  Today's mood check-in: ${todayMood}`);
  console.log(`    Reflection: ${reflectionForMood(todayMood).en}`);
  for (const s of suggestionsForMood(todayMood)) {
    console.log(`    Suggestion -> ${s.kind}: ${s.label.en}`);
  }
  console.log(`  Journal entry acknowledgment: ${journalAcknowledgment().en}`);
  console.log(
    "  NOTE: none of the lines above come from a live language model — see DISCLAIMERS.companionNotRealAI."
  );

  console.log("\n" + "=".repeat(70));
  console.log("Synthetic quit-coach demo (profile asked -> gradual plan -> a week of daily check-ins):");

  const syntheticQuitProfile: QuitProfile = {
    addictionType: "smoking",
    otherDescription: null,
    dailyAmount: "10 cigarettes/day",
    yearsOfHabit: 6,
    pastQuitAttempts: 2,
    primaryTrigger: "stress",
    motivation: "for my kids' health",
  };
  console.log(`\n  Client wants to quit: ${syntheticQuitProfile.addictionType}`);
  console.log(`    Needs medical-supervision caution shown: ${requiresMedicalCaution(syntheticQuitProfile.addictionType)}`);
  const quitPlan = buildQuitPlan(syntheticQuitProfile);
  console.log(`    Plan has ${quitPlan.length} steps:`);
  for (const s of quitPlan) {
    console.log(`      ${s.order}. ${s.title.en} — ${s.advice.en}`);
  }

  const syntheticCheckIns: QuitCheckIn[] = [
    { date: "2026-09-01", usedSubstance: true, cravingLevel: 4, loggedAt: "2026-09-01T20:00:00.000Z" },
    { date: "2026-09-02", usedSubstance: false, cravingLevel: 3, loggedAt: "2026-09-02T20:00:00.000Z" },
    { date: "2026-09-03", usedSubstance: false, cravingLevel: 2, loggedAt: "2026-09-03T20:00:00.000Z" },
    { date: "2026-09-04", usedSubstance: false, cravingLevel: 1, loggedAt: "2026-09-04T20:00:00.000Z" },
  ];
  const streak = computeStreak(syntheticCheckIns);
  console.log(
    `\n  A week of daily check-ins -> current streak: ${streak.currentStreakDays} smoke-free days, average craving: ${streak.averageCraving}`
  );
  console.log(
    "  NOTE: for alcohol/drugs, this plan is intentionally generic and always paired with a medical-supervision caution — see DISCLAIMERS.quitCoachMedicalSupervision."
  );

  console.log("\n" + "=".repeat(70));
  console.log("Synthetic career-coach demo (3 mindset questions -> path -> milestone checklist):");

  const syntheticMindsetAnswers: CareerMindsetAnswer[] = MINDSET_QUESTIONS.map((q, i) => ({
    questionId: q.id,
    leansEntrepreneur: i !== 0, // 2 of 3 lean entrepreneur
  }));
  const mindset = inferMindset(syntheticMindsetAnswers);
  console.log(`\n  Inferred mindset from 3 answers: ${mindset}`);
  const suggestedPaths = recommendPaths(mindset);
  console.log(`  Suggested paths: ${suggestedPaths.map((p) => PATH_LABEL[p].en).join(", ")}`);

  const chosenPath = suggestedPaths[0];
  const milestones = milestonesForPath(chosenPath);
  milestones[0].done = true;
  milestones[1].done = true;
  console.log(`\n  Chose path: ${PATH_LABEL[chosenPath].en}`);
  const progress = progressSummary(milestones);
  console.log(`  Progress: ${progress.done}/${progress.total} (${progress.percent}%)`);
  for (const m of milestones) {
    console.log(`    [${m.done ? "x" : " "}] ${m.label.en}`);
  }
  console.log(
    "  NOTE: 'following the user until success' is an on-device checklist + journal only — no real backend or push-notification tracking. See DISCLAIMERS.careerCoachLimitations."
  );

  console.log("\n" + "=".repeat(70));
  console.log("Done. This is synthetic/demo data only — no real user data exists in this repo.");
}

main();
