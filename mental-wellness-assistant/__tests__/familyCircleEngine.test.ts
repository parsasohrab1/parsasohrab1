import { FamilyMember } from "@/types";
import { groupByRelation, summarizeMember } from "@/engine/familyCircleEngine";

const member = (overrides: Partial<FamilyMember> = {}): FamilyMember => ({
  id: "m1",
  name: "مامان",
  relation: "mother",
  traits: [],
  notes: null,
  ...overrides,
});

describe("summarizeMember", () => {
  it("includes the name and relation label", () => {
    const summary = summarizeMember(member(), "en");
    expect(summary).toContain("مامان");
    expect(summary).toContain("Mother");
  });

  it("includes trait labels when traits are picked", () => {
    const summary = summarizeMember(member({ traits: ["generous", "traditional"] }), "en");
    expect(summary).toContain("Generous");
    expect(summary).toContain("Traditional");
  });

  it("omits the trailing trait list when no traits are picked", () => {
    const summary = summarizeMember(member(), "en");
    expect(summary).not.toContain("—");
  });

  it("supports both locales", () => {
    expect(summarizeMember(member(), "fa")).toContain("مادر");
  });
});

describe("groupByRelation", () => {
  it("groups members by relation, preserving order within each group", () => {
    const members = [
      member({ id: "1", name: "A", relation: "mother" }),
      member({ id: "2", name: "B", relation: "friend" }),
      member({ id: "3", name: "C", relation: "mother" }),
    ];
    const groups = groupByRelation(members);
    expect(groups.mother.map((m) => m.name)).toEqual(["A", "C"]);
    expect(groups.friend.map((m) => m.name)).toEqual(["B"]);
  });

  it("returns an empty object for an empty list", () => {
    expect(groupByRelation([])).toEqual({});
  });
});
