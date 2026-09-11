import { MoodLogEntry } from "@/types";
import {
  greeting,
  journalAcknowledgment,
  reflectionForMood,
  suggestionsForMood,
  summarizeRecentMoods,
} from "@/engine/companionEngine";
import { ALL_MOODS } from "@/engine/moodMusicEngine";

describe("reflectionForMood", () => {
  it("returns a fa/en reflection for every mood", () => {
    for (const mood of ALL_MOODS) {
      const reflection = reflectionForMood(mood);
      expect(reflection.fa.length).toBeGreaterThan(0);
      expect(reflection.en.length).toBeGreaterThan(0);
    }
  });
});

describe("suggestionsForMood", () => {
  it("returns at least one suggestion for every mood", () => {
    for (const mood of ALL_MOODS) {
      expect(suggestionsForMood(mood).length).toBeGreaterThan(0);
    }
  });

  it("points every suggestion at a known screen kind", () => {
    const validKinds = ["music", "favorite_music", "screening", "fitness", "counseling", "recipes", "storytelling"];
    for (const mood of ALL_MOODS) {
      for (const suggestion of suggestionsForMood(mood)) {
        expect(validKinds).toContain(suggestion.kind);
      }
    }
  });
});

describe("journalAcknowledgment", () => {
  it("always returns a non-empty fa/en pair", () => {
    const ack = journalAcknowledgment();
    expect(ack.fa.length).toBeGreaterThan(0);
    expect(ack.en.length).toBeGreaterThan(0);
  });
});

describe("greeting", () => {
  it("uses the stored name when present", () => {
    expect(greeting("سارا", "fa")).toContain("سارا");
    expect(greeting("Sara", "en")).toContain("Sara");
  });

  it("falls back to a generic greeting when no name is stored", () => {
    expect(greeting(null, "fa").length).toBeGreaterThan(0);
    expect(greeting(null, "en").length).toBeGreaterThan(0);
  });
});

describe("summarizeRecentMoods", () => {
  const entryAt = (mood: MoodLogEntry["mood"], daysAgo: number): MoodLogEntry => ({
    mood,
    loggedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  });

  it("returns zero entries for an empty log", () => {
    expect(summarizeRecentMoods([])).toEqual({ totalEntries: 0, mostCommonMood: null });
  });

  it("only counts entries within the given window", () => {
    const log = [entryAt("calm", 1), entryAt("sad", 10)];
    const summary = summarizeRecentMoods(log, 7);
    expect(summary.totalEntries).toBe(1);
    expect(summary.mostCommonMood).toBe("calm");
  });

  it("picks the most frequently logged mood in the window", () => {
    const log = [entryAt("anxious", 1), entryAt("anxious", 2), entryAt("calm", 3)];
    const summary = summarizeRecentMoods(log, 7);
    expect(summary.totalEntries).toBe(3);
    expect(summary.mostCommonMood).toBe("anxious");
  });
});
