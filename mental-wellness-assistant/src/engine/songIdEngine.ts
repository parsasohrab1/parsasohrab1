import { LyricsResult, MusicTrack, SongIdMatch } from "@/types";
import { TRACKS } from "@/data/musicCatalog";
import { PLACEHOLDER_LYRICS } from "@/data/songLyricsPlaceholders";

/**
 * Honest "song ID" — see DISCLAIMERS.songIdLimitations. There is no
 * audio fingerprinting here: `identifyByText` only fuzzy-matches a
 * spoken/typed title, artist, or remembered lyric fragment against
 * this app's own fictional local catalog. Real humming/audio-clip
 * recognition and real lyrics lookup are documented stubs below,
 * intentionally throwing rather than faking a result.
 */
const levenshteinDistance = (a: string, b: string): number => {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

/** 0-100 fuzzy similarity between two strings (100 = identical). */
const similarity = (a: string, b: string): number => {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  if (!normA || !normB) return 0;
  const maxLen = Math.max(normA.length, normB.length);
  const dist = levenshteinDistance(normA, normB);
  return Math.round((1 - dist / maxLen) * 100);
};

const matchScore = (input: string, track: MusicTrack): number => {
  const needle = input.trim().toLowerCase();
  if (!needle) return 0;
  const title = track.title.toLowerCase();
  const artist = track.artist.toLowerCase();

  let best = Math.max(similarity(needle, title), similarity(needle, artist) * 0.8);
  if (title.includes(needle) || needle.includes(title)) best = Math.max(best, 90);

  return Math.round(Math.min(best, 100));
};

/** Fuzzy-matches free text (a title, artist, or remembered fragment)
 *  against the local catalog only. Returns the top matches at or
 *  above minScore, best first. */
export const identifyByText = (
  input: string,
  pool: MusicTrack[] = TRACKS,
  minScore = 40,
  maxResults = 5
): SongIdMatch[] =>
  pool
    .map((track) => ({ track, score: matchScore(input, track) }))
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

export interface AudioRecognitionProvider {
  id: string;
  label: { fa: string; en: string };
  recognizeFromAudio: (audioUri: string) => Promise<SongIdMatch[]>;
}

/** Documented extension point for real audio fingerprinting (humming
 *  or a played clip). Intentionally unimplemented — throws instead of
 *  pretending to recognize audio it never actually analyzed. */
export const audioRecognitionStub: AudioRecognitionProvider = {
  id: "remote_audio_fingerprint_stub",
  label: {
    fa: "تشخیص از روی صدا/زمزمه (نیازمند سرویس واقعی)",
    en: "Recognize from humming/audio (needs a real provider wired in)",
  },
  recognizeFromAudio: async () => {
    throw new Error(
      "Audio-based song recognition (humming or an audio clip) is not configured in this scaffold. Wire a " +
        "licensed audio-fingerprinting provider (ACRCloud, AudD, …) behind the AudioRecognitionProvider " +
        "interface in src/engine/songIdEngine.ts."
    );
  },
};

export interface LyricsProvider {
  id: string;
  label: { fa: string; en: string };
  getLyrics: (trackId: string) => Promise<LyricsResult>;
}

/** Original placeholder "lyrics" for a handful of this app's own
 *  fictional tracks — see src/data/songLyricsPlaceholders.ts. */
export const localPlaceholderLyricsProvider: LyricsProvider = {
  id: "local_demo_placeholder",
  label: { fa: "لیریکس نمایشی محلی", en: "Local Demo Lyrics" },
  getLyrics: async (trackId) => {
    const lyrics = PLACEHOLDER_LYRICS[trackId] ?? null;
    return { trackId, lyrics, source: lyrics ? "local_demo_placeholder" : "unavailable" };
  },
};

/** Documented extension point for real, licensed lyrics lookup. */
export const remoteLyricsProviderStub: LyricsProvider = {
  id: "remote_lyrics_stub",
  label: { fa: "لیریکس واقعی (نیازمند سرویس دارای مجوز)", en: "Real lyrics (needs a licensed provider)" },
  getLyrics: async () => {
    throw new Error(
      "Real lyrics lookup is not configured in this scaffold. Wire a licensed lyrics provider " +
        "(Musixmatch, Genius, …) behind the LyricsProvider interface in src/engine/songIdEngine.ts."
    );
  },
};
