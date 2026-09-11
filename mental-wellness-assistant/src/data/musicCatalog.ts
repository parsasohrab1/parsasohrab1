import { MusicTrack, Playlist } from "@/types";
import { DEMO_CALMING_TONE_DATA_URI } from "./demoTone";

/**
 * Synthetic music catalog. Metadata only for most tracks — `audioUrl` is
 * null except for one generated demo tone, so playback wiring (MicButton
 * → mood → playlist → <TrackCard/> → expo-av) is testable end to end
 * without depending on a licensed streaming API. Wire a real
 * Spotify/Apple Music/CDN URL per track before shipping.
 */
export const TRACKS: MusicTrack[] = [
  {
    id: "trk_calm_tone_demo",
    title: "Calming Tone (Demo)",
    artist: "Synthetic Demo Audio",
    moodTags: ["anxious", "overwhelmed", "sad"],
    durationSec: 90,
    audioUrl: DEMO_CALMING_TONE_DATA_URI,
  },
  { id: "trk_1", title: "Slow Breath", artist: "Ambient Collective", moodTags: ["anxious", "overwhelmed"], durationSec: 210, audioUrl: null },
  { id: "trk_2", title: "Quiet Shore", artist: "Ambient Collective", moodTags: ["sad", "lonely"], durationSec: 245, audioUrl: null },
  { id: "trk_3", title: "Soft Rain Piano", artist: "Nocturne Studio", moodTags: ["sad", "calm"], durationSec: 198, audioUrl: null },
  { id: "trk_4", title: "Warm Light", artist: "Nocturne Studio", moodTags: ["hopeful", "calm"], durationSec: 183, audioUrl: null },
  { id: "trk_5", title: "Steady Ground", artist: "Root & Branch", moodTags: ["angry", "overwhelmed"], durationSec: 220, audioUrl: null },
  { id: "trk_6", title: "Gentle Return", artist: "Root & Branch", moodTags: ["numb", "lonely"], durationSec: 205, audioUrl: null },
  { id: "trk_7", title: "Morning Window", artist: "Faraway Sound", moodTags: ["hopeful"], durationSec: 176, audioUrl: null },
  { id: "trk_8", title: "Held", artist: "Faraway Sound", moodTags: ["overwhelmed", "sad"], durationSec: 230, audioUrl: null },
  { id: "trk_9", title: "Low Tide", artist: "Sable Grove", moodTags: ["angry", "numb"], durationSec: 192, audioUrl: null },
  { id: "trk_10", title: "First Light", artist: "Sable Grove", moodTags: ["calm", "hopeful"], durationSec: 201, audioUrl: null },
];

export const PLAYLISTS: Playlist[] = [
  {
    id: "pl_anxious",
    mood: "anxious",
    title: { fa: "آرام‌سازی برای اضطراب", en: "Calm for Anxiety" },
    trackIds: ["trk_calm_tone_demo", "trk_1", "trk_5"],
  },
  {
    id: "pl_sad",
    mood: "sad",
    title: { fa: "همراهی در دل‌تنگی", en: "Companionship for Sadness" },
    trackIds: ["trk_2", "trk_3", "trk_8"],
  },
  {
    id: "pl_overwhelmed",
    mood: "overwhelmed",
    title: { fa: "زمین‌گیرشدن و آرامش", en: "Grounding & Ease" },
    trackIds: ["trk_calm_tone_demo", "trk_1", "trk_8"],
  },
  {
    id: "pl_numb",
    mood: "numb",
    title: { fa: "بازگشت آرام به احساس", en: "A Gentle Way Back" },
    trackIds: ["trk_6", "trk_9"],
  },
  {
    id: "pl_lonely",
    mood: "lonely",
    title: { fa: "تو تنها نیستی", en: "You're Not Alone" },
    trackIds: ["trk_2", "trk_6"],
  },
  {
    id: "pl_angry",
    mood: "angry",
    title: { fa: "فروکش‌کردن خشم", en: "Letting the Heat Settle" },
    trackIds: ["trk_5", "trk_9"],
  },
  {
    id: "pl_hopeful",
    mood: "hopeful",
    title: { fa: "نور امید", en: "A Little Light" },
    trackIds: ["trk_4", "trk_7", "trk_10"],
  },
  {
    id: "pl_calm",
    mood: "calm",
    title: { fa: "حفظ آرامش", en: "Staying Steady" },
    trackIds: ["trk_4", "trk_10"],
  },
];

export const trackById = (id: string): MusicTrack | undefined =>
  TRACKS.find((t) => t.id === id);

export const playlistForMood = (mood: Playlist["mood"]): Playlist | undefined =>
  PLAYLISTS.find((p) => p.mood === mood);
