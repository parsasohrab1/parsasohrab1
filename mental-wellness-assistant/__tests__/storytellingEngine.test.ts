import {
  matchAgeRangeFromText,
  matchGenderFromText,
  matchStyleFromText,
  pickProtagonistName,
  renderParagraph,
  renderTitle,
  storiesForAge,
} from "@/engine/storytellingEngine";
import { AGE_RANGE_OPTIONS } from "@/engine/storytellingEngine";
import { STORIES } from "@/data/storyCatalog";

describe("storiesForAge", () => {
  it("has at least two stories for every age range", () => {
    for (const opt of AGE_RANGE_OPTIONS) {
      const results = storiesForAge(opt.value);
      expect(results.length).toBeGreaterThanOrEqual(2);
      expect(results.every((s) => s.ageRanges.includes(opt.value))).toBe(true);
    }
  });
});

describe("renderTitle / renderParagraph", () => {
  const storyWithNameInTitle = STORIES.find((s) => s.title.fa.includes("{{NAME}}"))!;

  it("substitutes the {{NAME}} token in the title", () => {
    const title = renderTitle(storyWithNameInTitle, "fa", "کیمیا");
    expect(title).not.toContain("{{NAME}}");
    expect(title).toContain("کیمیا");
  });

  it("substitutes the {{NAME}} token in every paragraph", () => {
    const story = STORIES[0];
    for (let i = 1; i <= story.paragraphs.length; i++) {
      const text = renderParagraph(story, i, "fa", "آرش");
      expect(text).not.toBeNull();
      expect(text).not.toContain("{{NAME}}");
    }
  });

  it("returns null past the last paragraph", () => {
    const story = STORIES[0];
    expect(renderParagraph(story, story.paragraphs.length + 1, "fa", "آرش")).toBeNull();
  });
});

describe("pickProtagonistName", () => {
  it("always returns a non-empty name for every gender option", () => {
    expect(pickProtagonistName("boy").length).toBeGreaterThan(0);
    expect(pickProtagonistName("girl").length).toBeGreaterThan(0);
    expect(pickProtagonistName("unspecified").length).toBeGreaterThan(0);
  });
});

describe("free-text matchers for the setup wizard", () => {
  it("matches age from a spoken number", () => {
    expect(matchAgeRangeFromText("من سه سالمه")).toBe("2-4");
    expect(matchAgeRangeFromText("I'm 9 years old")).toBe("8-10");
    expect(matchAgeRangeFromText("12")).toBe("11-13");
  });

  it("matches age from the option label text", () => {
    expect(matchAgeRangeFromText("۵ تا ۷ سال")).toBe("5-7");
  });

  it("matches gender in Persian and English", () => {
    expect(matchGenderFromText("پسرم")).toBe("boy");
    expect(matchGenderFromText("girl")).toBe("girl");
    expect(matchGenderFromText("فرقی نمی‌کند")).toBe("unspecified");
    expect(matchGenderFromText("امروز هوا خوب است")).toBeNull();
  });

  it("matches narration style in Persian and English", () => {
    expect(matchStyleFromText("مادرانه باشه")).toBe("motherly");
    expect(matchStyleFromText("warm please")).toBe("motherly");
    expect(matchStyleFromText("معمولی")).toBe("normal");
    expect(matchStyleFromText("plain")).toBe("normal");
    expect(matchStyleFromText("امروز هوا خوب است")).toBeNull();
  });
});
