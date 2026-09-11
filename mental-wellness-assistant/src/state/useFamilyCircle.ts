import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FamilyMember, PersonalityTrait, SocialRelation } from "@/types";

const STORAGE_KEY = "mind_companion_family_circle_v1";

const makeId = (): string => `fam_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

/** Persisted "people around the user" list — name + relation + a few
 *  self-picked traits, on-device only. See
 *  DISCLAIMERS.familyCircleLimitations: this is storage and lookup,
 *  not real knowledge of anyone. */
export function useFamilyCircle() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setMembers(JSON.parse(raw));
      } catch {
        // Falls back to an empty list.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: FamilyMember[]) => {
    setMembers(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const addMember = useCallback(
    (name: string, relation: SocialRelation, traits: PersonalityTrait[], notes: string | null) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const member: FamilyMember = { id: makeId(), name: trimmed, relation, traits, notes: notes?.trim() || null };
      persist([...members, member]);
    },
    [members, persist]
  );

  const updateMember = useCallback(
    (id: string, updates: Partial<Omit<FamilyMember, "id">>) => {
      persist(members.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    },
    [members, persist]
  );

  const removeMember = useCallback(
    (id: string) => {
      persist(members.filter((m) => m.id !== id));
    },
    [members, persist]
  );

  return { members, loaded, addMember, updateMember, removeMember };
}
