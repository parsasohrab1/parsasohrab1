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
import { FavoriteMusicProfile } from "../src/types";

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
  console.log("Done. This is synthetic/demo data only — no real user data exists in this repo.");
}

main();
