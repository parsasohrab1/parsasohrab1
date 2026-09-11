import {
  audioRecognitionStub,
  identifyByText,
  localPlaceholderLyricsProvider,
  remoteLyricsProviderStub,
} from "@/engine/songIdEngine";
import { TRACKS } from "@/data/musicCatalog";

describe("identifyByText", () => {
  it("finds an exact title match with a high score", () => {
    const target = TRACKS.find((t) => t.id === "trk_vf_1")!;
    const results = identifyByText(target.title);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].track.id).toBe(target.id);
    expect(results[0].score).toBeGreaterThanOrEqual(90);
  });

  it("finds a fuzzy/partial title match", () => {
    const results = identifyByText("golden hour");
    expect(results.some((m) => m.track.id === "trk_vf_7")).toBe(true);
  });

  it("matches on artist name too, with a lower weight than an exact title", () => {
    const results = identifyByText("The Harbor Lights");
    expect(results.some((m) => m.track.artist === "The Harbor Lights")).toBe(true);
  });

  it("returns an empty array for a query with nothing close in the catalog", () => {
    const results = identifyByText("zzzzz qqqqq nonexistent xkcd 12345");
    expect(results).toEqual([]);
  });

  it("returns an empty array for an empty query", () => {
    expect(identifyByText("")).toEqual([]);
  });

  it("sorts results best match first", () => {
    const results = identifyByText("Golden Hour");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

describe("localPlaceholderLyricsProvider", () => {
  it("returns placeholder lyrics for a track that has them", async () => {
    const result = await localPlaceholderLyricsProvider.getLyrics("trk_vf_1");
    expect(result.lyrics).not.toBeNull();
    expect(result.source).toBe("local_demo_placeholder");
  });

  it("returns unavailable for a track with no placeholder lyrics", async () => {
    const result = await localPlaceholderLyricsProvider.getLyrics("trk_1");
    expect(result.lyrics).toBeNull();
    expect(result.source).toBe("unavailable");
  });
});

describe("unconfigured real-provider stubs", () => {
  it("audioRecognitionStub throws instead of pretending to recognize audio", async () => {
    await expect(audioRecognitionStub.recognizeFromAudio("file://fake.m4a")).rejects.toThrow();
  });

  it("remoteLyricsProviderStub throws instead of pretending to fetch real lyrics", async () => {
    await expect(remoteLyricsProviderStub.getLyrics("trk_vf_1")).rejects.toThrow();
  });
});
