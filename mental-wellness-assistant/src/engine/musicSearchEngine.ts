import {
  FavoriteMusicProfile,
  MusicSearchQuery,
  MusicTrack,
} from "@/types";
import { TRACKS } from "@/data/musicCatalog";

/**
 * Pluggable "find music" layer.
 *
 * `localCatalogProvider` searches the synthetic catalog that ships in
 * this repo — no network call, works offline, always available.
 *
 * `remoteInternetProvider` is the documented extension point for real
 * internet search/streaming (Spotify Web API, YouTube Data API, Radio
 * Javan, Apple Music, …). This scaffold does not ship API keys or a
 * licensed streaming integration, so it intentionally throws — the UI
 * catches that and explains it to the user instead of silently pretending
 * to search the internet. Wire a real implementation behind this same
 * `MusicSearchProvider` interface and nothing else in the app needs to
 * change.
 */
export interface MusicSearchProvider {
  id: string;
  label: { fa: string; en: string };
  search: (query: MusicSearchQuery) => Promise<MusicTrack[]>;
}

const matchesQuery = (track: MusicTrack, query: MusicSearchQuery): boolean => {
  if (query.mood && !track.moodTags.includes(query.mood)) return false;
  if (query.vocal && query.vocal !== "both") {
    const wantVocal = query.vocal === "vocal";
    if (track.vocal !== wantVocal) return false;
  }
  if (query.origin && query.origin !== "both" && track.origin !== query.origin) return false;
  if (query.text && query.text.trim()) {
    const needle = query.text.trim().toLowerCase();
    const haystack = `${track.title} ${track.artist} ${track.genre}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
};

export const localCatalogProvider: MusicSearchProvider = {
  id: "local_synthetic_catalog",
  label: { fa: "کاتالوگ نمایشی محلی", en: "Local Demo Catalog" },
  search: async (query) => TRACKS.filter((t) => matchesQuery(t, query)),
};

export const remoteInternetProvider: MusicSearchProvider = {
  id: "remote_internet_stub",
  label: { fa: "جستجوی اینترنتی (نیازمند اتصال سرویس واقعی)", en: "Internet Search (needs a real provider wired in)" },
  search: async () => {
    throw new Error(
      "Remote internet music search is not configured in this scaffold. Wire a licensed provider " +
        "(Spotify Web API, YouTube Data API, Radio Javan, Apple Music, …) behind the MusicSearchProvider " +
        "interface in src/engine/musicSearchEngine.ts."
    );
  },
};

export const MUSIC_PROVIDERS: MusicSearchProvider[] = [localCatalogProvider, remoteInternetProvider];

export interface CategorizedTracks {
  vocalIranian: MusicTrack[];
  vocalForeign: MusicTrack[];
  instrumentalIranian: MusicTrack[];
  instrumentalForeign: MusicTrack[];
}

/** Splits any track list into the requested vocal×origin 2x2 grouping. */
export const categorizeTracks = (tracks: MusicTrack[]): CategorizedTracks => ({
  vocalIranian: tracks.filter((t) => t.vocal && t.origin === "iranian"),
  vocalForeign: tracks.filter((t) => t.vocal && t.origin === "foreign"),
  instrumentalIranian: tracks.filter((t) => !t.vocal && t.origin === "iranian"),
  instrumentalForeign: tracks.filter((t) => !t.vocal && t.origin === "foreign"),
});

const scoreTrackForProfile = (track: MusicTrack, profile: FavoriteMusicProfile): number => {
  let score = 0;
  const artistLower = track.artist.toLowerCase();
  const genreLower = track.genre.toLowerCase();

  if (profile.favoriteArtists.some((a) => a.trim() && artistLower.includes(a.trim().toLowerCase()))) {
    score += 5;
  }
  if (profile.favoriteGenres.some((g) => g.trim() && genreLower.includes(g.trim().toLowerCase()))) {
    score += 3;
  }
  if (profile.vocalPreference !== "both") {
    const wantVocal = profile.vocalPreference === "vocal";
    if (track.vocal === wantVocal) score += 1;
  }
  if (profile.originPreference !== "both" && track.origin === profile.originPreference) {
    score += 1;
  }
  return score;
};

/** Ranks the catalog (or any track list) by how well it matches a saved
 *  favorites profile. Ties keep catalog order (stable sort). */
export const recommendForProfile = (
  profile: FavoriteMusicProfile,
  pool: MusicTrack[] = TRACKS
): MusicTrack[] =>
  pool
    .map((track, index) => ({ track, index, score: scoreTrackForProfile(track, profile) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ track }) => track);

export interface ProviderSearchResult {
  providerId: string;
  label: { fa: string; en: string };
  tracks: MusicTrack[];
  error?: string;
}

/** Tries each provider in order and collects results, catching a
 *  provider's failure (e.g. the unconfigured remote stub) instead of
 *  letting it break the whole search. */
export const searchAcrossProviders = async (
  query: MusicSearchQuery,
  providers: MusicSearchProvider[] = MUSIC_PROVIDERS
): Promise<ProviderSearchResult[]> => {
  const results: ProviderSearchResult[] = [];
  for (const provider of providers) {
    try {
      const tracks = await provider.search(query);
      results.push({ providerId: provider.id, label: provider.label, tracks });
    } catch (err) {
      results.push({
        providerId: provider.id,
        label: provider.label,
        tracks: [],
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return results;
};
