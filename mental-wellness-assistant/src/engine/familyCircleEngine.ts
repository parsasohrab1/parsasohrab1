import { FamilyMember, Locale } from "@/types";
import { RELATION_LABEL, TRAIT_LABEL } from "@/data/socialLabels";

/** A short one-line summary for a saved person, used in list UIs —
 *  purely a readout of the user's own name/relation/trait picks. */
export const summarizeMember = (member: FamilyMember, locale: Locale): string => {
  const relationLabel = RELATION_LABEL[member.relation][locale];
  if (member.traits.length === 0) return `${member.name} (${relationLabel})`;
  const traitLabels = member.traits.map((t) => TRAIT_LABEL[t][locale]).join(locale === "fa" ? "، " : ", ");
  return `${member.name} (${relationLabel}) — ${traitLabels}`;
};

/** Groups saved members by relation, preserving insertion order within
 *  each group — used to render the family-circle list in sections. */
export const groupByRelation = (members: FamilyMember[]): Record<string, FamilyMember[]> => {
  const groups: Record<string, FamilyMember[]> = {};
  for (const member of members) {
    if (!groups[member.relation]) groups[member.relation] = [];
    groups[member.relation].push(member);
  }
  return groups;
};
