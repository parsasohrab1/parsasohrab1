import { AnsweredQuestion } from "@/types";
import { assessCrisis, textLooksLikeCrisis } from "@/engine/crisisDetector";

const safetyAnswer = (value: 0 | 1 | 2 | 3, freeText?: string): AnsweredQuestion => ({
  questionId: "core_safety_1",
  conditionId: "suicide_risk",
  value,
  freeText,
  answeredAt: new Date().toISOString(),
});

describe("assessCrisis", () => {
  it("reports no crisis when safety answers are all 0", () => {
    const result = assessCrisis([safetyAnswer(0)]);
    expect(result.triggered).toBe(false);
    expect(result.severity).toBe("none");
  });

  it("flags 'watch' severity for a mild passive safety answer", () => {
    const result = assessCrisis([safetyAnswer(1)]);
    expect(result.triggered).toBe(true);
    expect(result.severity).toBe("watch");
  });

  it("flags 'urgent' severity for a high safety-scale answer", () => {
    const result = assessCrisis([safetyAnswer(3)]);
    expect(result.triggered).toBe(true);
    expect(result.severity).toBe("urgent");
  });

  it("flags 'urgent' when free text matches a crisis keyword, even with a low scale answer", () => {
    const result = assessCrisis([safetyAnswer(0, "دیگه نمی‌خوام زنده باشم")]);
    expect(result.triggered).toBe(true);
    expect(result.severity).toBe("urgent");
    expect(result.reasons).toContain("free_text_keyword_match");
  });
});

describe("textLooksLikeCrisis", () => {
  it("matches Persian and English crisis phrases", () => {
    expect(textLooksLikeCrisis("می‌خوام بمیرم")).toBe(true);
    expect(textLooksLikeCrisis("I want to end my life")).toBe(true);
  });

  it("does not match ordinary text", () => {
    expect(textLooksLikeCrisis("امروز هوا خوب بود")).toBe(false);
    expect(textLooksLikeCrisis("I had a decent day")).toBe(false);
  });
});
