import { MusicTrack, Playlist } from "@/types";
import { DEMO_CALMING_TONE_DATA_URI } from "./demoTone";

/**
 * Synthetic music catalog, tagged along three axes so it can be browsed
 * or searched by any combination of them:
 *   1. mood (moodTags)
 *   2. vocal (باکلام) vs instrumental (بی‌کلام)
 *   3. origin: iranian (ایرانی) vs foreign (خارجی)
 *
 * Every artist/title here is FICTIONAL — invented for this demo so the
 * catalog can ship with the repo without impersonating real musicians or
 * infringing real recordings. `audioUrl` is null for all of them except
 * one generated demo tone, so playback wiring (search → filter → play)
 * is testable end to end without a licensed streaming API. See
 * src/engine/musicSearchEngine.ts for where a real provider (Spotify Web
 * API, YouTube Data API, Radio Javan, Apple Music, …) would plug in.
 */
export const TRACKS: MusicTrack[] = [
  // ---- instrumental / foreign (ambient, originally the only category) --
  {
    id: "trk_calm_tone_demo",
    title: "Calming Tone (Demo)",
    artist: "Synthetic Demo Audio",
    moodTags: ["anxious", "overwhelmed", "sad"],
    vocal: false,
    origin: "foreign",
    genre: "ambient",
    durationSec: 90,
    audioUrl: DEMO_CALMING_TONE_DATA_URI,
  },
  { id: "trk_1", title: "Slow Breath", artist: "Ambient Collective", moodTags: ["anxious", "overwhelmed"], vocal: false, origin: "foreign", genre: "ambient", durationSec: 210, audioUrl: null },
  { id: "trk_2", title: "Quiet Shore", artist: "Ambient Collective", moodTags: ["sad", "lonely"], vocal: false, origin: "foreign", genre: "ambient", durationSec: 245, audioUrl: null },
  { id: "trk_3", title: "Soft Rain Piano", artist: "Nocturne Studio", moodTags: ["sad", "calm"], vocal: false, origin: "foreign", genre: "instrumental piano", durationSec: 198, audioUrl: null },
  { id: "trk_4", title: "Warm Light", artist: "Nocturne Studio", moodTags: ["hopeful", "calm"], vocal: false, origin: "foreign", genre: "instrumental piano", durationSec: 183, audioUrl: null },
  { id: "trk_5", title: "Steady Ground", artist: "Root & Branch", moodTags: ["angry", "overwhelmed"], vocal: false, origin: "foreign", genre: "downtempo", durationSec: 220, audioUrl: null },
  { id: "trk_6", title: "Gentle Return", artist: "Root & Branch", moodTags: ["numb", "lonely"], vocal: false, origin: "foreign", genre: "downtempo", durationSec: 205, audioUrl: null },
  { id: "trk_7", title: "Morning Window", artist: "Faraway Sound", moodTags: ["hopeful"], vocal: false, origin: "foreign", genre: "lo-fi", durationSec: 176, audioUrl: null },
  { id: "trk_8", title: "Held", artist: "Faraway Sound", moodTags: ["overwhelmed", "sad"], vocal: false, origin: "foreign", genre: "lo-fi", durationSec: 230, audioUrl: null },
  { id: "trk_9", title: "Low Tide", artist: "Sable Grove", moodTags: ["angry", "numb"], vocal: false, origin: "foreign", genre: "ambient", durationSec: 192, audioUrl: null },
  { id: "trk_10", title: "First Light", artist: "Sable Grove", moodTags: ["calm", "hopeful"], vocal: false, origin: "foreign", genre: "ambient", durationSec: 201, audioUrl: null },

  // ---- vocal / foreign (fictional pop, folk, indie) --------------------
  { id: "trk_vf_1", title: "Paper Boats", artist: "The Harbor Lights", moodTags: ["hopeful", "calm"], vocal: true, origin: "foreign", genre: "indie pop", durationSec: 214, audioUrl: null },
  { id: "trk_vf_2", title: "Still Here", artist: "The Harbor Lights", moodTags: ["sad", "hopeful"], vocal: true, origin: "foreign", genre: "indie pop", durationSec: 198, audioUrl: null },
  { id: "trk_vf_3", title: "Slow Down", artist: "June Meadow", moodTags: ["anxious", "overwhelmed"], vocal: true, origin: "foreign", genre: "folk", durationSec: 225, audioUrl: null },
  { id: "trk_vf_4", title: "Learning to Float", artist: "June Meadow", moodTags: ["numb", "calm"], vocal: true, origin: "foreign", genre: "folk", durationSec: 209, audioUrl: null },
  { id: "trk_vf_5", title: "Fire in the Chest", artist: "Greyfield Radio", moodTags: ["angry"], vocal: true, origin: "foreign", genre: "rock", durationSec: 187, audioUrl: null },
  { id: "trk_vf_6", title: "Ordinary Days", artist: "Greyfield Radio", moodTags: ["lonely", "sad"], vocal: true, origin: "foreign", genre: "rock", durationSec: 231, audioUrl: null },
  { id: "trk_vf_7", title: "Golden Hour", artist: "Marina & the Tides", moodTags: ["hopeful", "calm"], vocal: true, origin: "foreign", genre: "pop", durationSec: 195, audioUrl: null },
  { id: "trk_vf_8", title: "Weightless", artist: "Marina & the Tides", moodTags: ["anxious", "calm"], vocal: true, origin: "foreign", genre: "pop", durationSec: 203, audioUrl: null },

  // ---- vocal / iranian (fictional Persian pop / traditional-fusion) ----
  { id: "trk_vi_1", title: "بارانِ بهاری", artist: "گروه آوای شرق", moodTags: ["hopeful", "calm"], vocal: true, origin: "iranian", genre: "پاپ", durationSec: 240, audioUrl: null },
  { id: "trk_vi_2", title: "شب آروم", artist: "گروه آوای شرق", moodTags: ["sad", "lonely"], vocal: true, origin: "iranian", genre: "پاپ", durationSec: 218, audioUrl: null },
  { id: "trk_vi_3", title: "نفس تازه", artist: "سارا نیک‌آیین", moodTags: ["anxious", "overwhelmed"], vocal: true, origin: "iranian", genre: "پاپ ملایم", durationSec: 205, audioUrl: null },
  { id: "trk_vi_4", title: "دل‌تنگی", artist: "سارا نیک‌آیین", moodTags: ["lonely", "sad"], vocal: true, origin: "iranian", genre: "پاپ ملایم", durationSec: 227, audioUrl: null },
  { id: "trk_vi_5", title: "روزهای روشن", artist: "بامداد", moodTags: ["hopeful"], vocal: true, origin: "iranian", genre: "پاپ سنتی", durationSec: 212, audioUrl: null },
  { id: "trk_vi_6", title: "آتش درون", artist: "بامداد", moodTags: ["angry"], vocal: true, origin: "iranian", genre: "راک فارسی", durationSec: 199, audioUrl: null },
  { id: "trk_vi_7", title: "قصه‌ی آرامش", artist: "مهتاب کیانی", moodTags: ["calm", "hopeful"], vocal: true, origin: "iranian", genre: "سنتی-فیوژن", durationSec: 233, audioUrl: null },
  { id: "trk_vi_8", title: "بی‌قراری", artist: "مهتاب کیانی", moodTags: ["numb", "overwhelmed"], vocal: true, origin: "iranian", genre: "سنتی-فیوژن", durationSec: 221, audioUrl: null },

  // ---- instrumental / iranian (fictional Persian classical/instrumental)
  { id: "trk_ii_1", title: "رقص سنتور", artist: "کوهسار (گروه بی‌کلام)", moodTags: ["calm", "hopeful"], vocal: false, origin: "iranian", genre: "سنتی بی‌کلام", durationSec: 256, audioUrl: null },
  { id: "trk_ii_2", title: "نسیم تار", artist: "کوهسار (گروه بی‌کلام)", moodTags: ["sad", "calm"], vocal: false, origin: "iranian", genre: "سنتی بی‌کلام", durationSec: 242, audioUrl: null },
  { id: "trk_ii_3", title: "سکوت کویر", artist: "آوای نی", moodTags: ["lonely", "numb"], vocal: false, origin: "iranian", genre: "سنتی بی‌کلام", durationSec: 268, audioUrl: null },
  { id: "trk_ii_4", title: "طلوع", artist: "آوای نی", moodTags: ["hopeful"], vocal: false, origin: "iranian", genre: "سنتی بی‌کلام", durationSec: 229, audioUrl: null },
  { id: "trk_ii_5", title: "امواج آرام", artist: "پیانو شرقی", moodTags: ["anxious", "overwhelmed"], vocal: false, origin: "iranian", genre: "پیانو فیوژن", durationSec: 214, audioUrl: null },
  { id: "trk_ii_6", title: "خلوت", artist: "پیانو شرقی", moodTags: ["calm"], vocal: false, origin: "iranian", genre: "پیانو فیوژن", durationSec: 200, audioUrl: null },
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
