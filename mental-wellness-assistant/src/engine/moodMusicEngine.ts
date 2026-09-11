import { Mood, Playlist, ScreeningResult } from "@/types";
import { PLAYLISTS, playlistForMood } from "@/data/musicCatalog";

/** Maps a screening result's top condition to a music-therapy mood bucket. */
const CONDITION_TO_MOOD: Record<string, Mood> = {
  depression: "sad",
  bipolar: "overwhelmed",
  gad: "anxious",
  panic: "anxious",
  social_anxiety: "anxious",
  adhd: "overwhelmed",
  ptsd: "overwhelmed",
  ocd: "anxious",
  insomnia: "overwhelmed",
  substance_use: "numb",
  eating_disorder: "sad",
  psychosis_spectrum: "overwhelmed",
  autism_adult: "overwhelmed",
  burnout: "overwhelmed",
};

export const moodFromScreeningResult = (result: ScreeningResult): Mood => {
  const top = result.topConditionIds[0];
  if (top && CONDITION_TO_MOOD[top]) return CONDITION_TO_MOOD[top];
  return "calm";
};

export const getPlaylistForMood = (mood: Mood): Playlist =>
  playlistForMood(mood) ?? PLAYLISTS.find((p) => p.mood === "calm")!;

export const getPlaylistForResult = (result: ScreeningResult): Playlist =>
  getPlaylistForMood(moodFromScreeningResult(result));

export const ALL_MOODS: Mood[] = [
  "sad",
  "anxious",
  "angry",
  "numb",
  "overwhelmed",
  "lonely",
  "hopeful",
  "calm",
];
