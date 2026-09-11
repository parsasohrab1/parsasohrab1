import { SocialSituationProfile } from "@/types";
import { personalityInsight, recommendStrategies } from "@/engine/socialAdvisorEngine";

describe("recommendStrategies", () => {
  it("matches the trousseau-shopping example: mother, financial boundary, generous", () => {
    const profile: SocialSituationProfile = { relation: "mother", scenario: "financial_boundary", traits: ["generous"] };
    const results = recommendStrategies(profile);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].strategy.id).toBe("soc_generous_financial");
  });

  it("returns different top strategies for different traits on the same relation/scenario", () => {
    const generous = recommendStrategies({ relation: "mother", scenario: "financial_boundary", traits: ["generous"] });
    const frugal = recommendStrategies({ relation: "mother", scenario: "financial_boundary", traits: ["frugal"] });
    expect(generous[0].strategy.id).not.toBe(frugal[0].strategy.id);
  });

  it("still returns relevant generic strategies when no trait is picked", () => {
    const results = recommendStrategies({ relation: "spouse", scenario: "boundary_setting", traits: [] });
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.strategy.relations).toContain("spouse");
      expect(r.strategy.scenarios).toContain("boundary_setting");
    }
  });

  it("excludes strategies that don't match the relation or scenario at all", () => {
    const results = recommendStrategies({ relation: "coworker", scenario: "family_expectation", traits: [] });
    for (const r of results) {
      expect(r.strategy.relations.includes("coworker") || r.strategy.scenarios.includes("family_expectation")).toBe(true);
    }
  });

  it("sorts results best match first", () => {
    const results = recommendStrategies({ relation: "mother", scenario: "unsolicited_advice", traits: ["traditional"] });
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

describe("personalityInsight", () => {
  it("returns null when no traits are picked", () => {
    expect(personalityInsight([], "en")).toBeNull();
  });

  it("builds a sentence mentioning every picked trait", () => {
    const insight = personalityInsight(["generous", "traditional"], "en");
    expect(insight).toContain("generous");
    expect(insight).toContain("traditional");
  });

  it("supports both locales", () => {
    expect(personalityInsight(["calm"], "fa")).toContain("آرام");
    expect(personalityInsight(["calm"], "en")).toContain("calmly");
  });
});
