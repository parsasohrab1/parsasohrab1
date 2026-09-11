import { FavoriteMusicProfile, MusicTrack } from "@/types";
import {
  categorizeTracks,
  localCatalogProvider,
  recommendForProfile,
  remoteInternetProvider,
} from "@/engine/musicSearchEngine";
import { TRACKS } from "@/data/musicCatalog";

const baseProfile = (overrides: Partial<FavoriteMusicProfile> = {}): FavoriteMusicProfile => ({
  favoriteArtists: [],
  favoriteGenres: [],
  vocalPreference: "both",
  originPreference: "both",
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe("categorizeTracks", () => {
  it("splits the catalog into all four vocal x origin buckets, each non-empty", () => {
    const groups = categorizeTracks(TRACKS);
    expect(groups.vocalIranian.length).toBeGreaterThan(0);
    expect(groups.vocalForeign.length).toBeGreaterThan(0);
    expect(groups.instrumentalIranian.length).toBeGreaterThan(0);
    expect(groups.instrumentalForeign.length).toBeGreaterThan(0);

    const total =
      groups.vocalIranian.length +
      groups.vocalForeign.length +
      groups.instrumentalIranian.length +
      groups.instrumentalForeign.length;
    expect(total).toBe(TRACKS.length);
  });

  it("never mislabels a track's own vocal/origin flags", () => {
    const groups = categorizeTracks(TRACKS);
    for (const t of groups.vocalIranian) {
      expect(t.vocal).toBe(true);
      expect(t.origin).toBe("iranian");
    }
    for (const t of groups.instrumentalForeign) {
      expect(t.vocal).toBe(false);
      expect(t.origin).toBe("foreign");
    }
  });
});

describe("localCatalogProvider.search", () => {
  it("filters by vocal preference", async () => {
    const results = await localCatalogProvider.search({ vocal: "instrumental" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => !t.vocal)).toBe(true);
  });

  it("filters by origin preference", async () => {
    const results = await localCatalogProvider.search({ origin: "iranian" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => t.origin === "iranian")).toBe(true);
  });

  it("filters by free text against title/artist/genre", async () => {
    const results = await localCatalogProvider.search({ text: "Ambient Collective" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((t) => t.artist === "Ambient Collective")).toBe(true);
  });
});

describe("remoteInternetProvider.search", () => {
  it("is an honest stub: it rejects instead of pretending to search the internet", async () => {
    await expect(remoteInternetProvider.search({ text: "anything" })).rejects.toThrow(/not configured/i);
  });
});

describe("recommendForProfile", () => {
  const pool: MusicTrack[] = TRACKS;

  it("ranks a favorite artist's tracks above the rest", () => {
    const profile = baseProfile({ favoriteArtists: ["Marina & the Tides"] });
    const ranked = recommendForProfile(profile, pool);
    const topArtists = ranked.slice(0, 2).map((t) => t.artist);
    expect(topArtists).toEqual(["Marina & the Tides", "Marina & the Tides"]);
  });

  it("boosts tracks matching both vocal and origin preference", () => {
    const profile = baseProfile({ vocalPreference: "vocal", originPreference: "iranian" });
    const ranked = recommendForProfile(profile, pool);
    expect(ranked[0].vocal).toBe(true);
    expect(ranked[0].origin).toBe("iranian");
  });

  it("falls back to catalog order when nothing matches the profile", () => {
    const profile = baseProfile();
    const ranked = recommendForProfile(profile, pool);
    expect(ranked.map((t) => t.id)).toEqual(pool.map((t) => t.id));
  });
});
