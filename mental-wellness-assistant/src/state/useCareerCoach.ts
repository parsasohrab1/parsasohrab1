import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CareerJournalEntry, CareerMilestone, CareerPath, CareerProfile } from "@/types";
import { milestonesForPath } from "@/engine/careerCoachEngine";

const STORAGE_KEY = "mind_companion_career_coach_v1";

interface CareerCoachData {
  profile: CareerProfile | null;
  milestones: CareerMilestone[];
  journal: CareerJournalEntry[];
}

const EMPTY: CareerCoachData = { profile: null, milestones: [], journal: [] };

/** Persisted career-coach state: mindset + chosen path, a checkable
 *  milestone list, and a free-text journal — the honest, on-device
 *  substitute for "follow the user until final success" (no backend,
 *  no push notifications; see DISCLAIMERS.careerCoachLimitations). */
export function useCareerCoach() {
  const [data, setData] = useState<CareerCoachData>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setData(JSON.parse(raw));
      } catch {
        // Falls back to empty state.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: CareerCoachData) => {
    setData(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const startPath = useCallback(
    (profile: CareerProfile, path: CareerPath) => {
      persist({ profile: { ...profile, chosenPath: path }, milestones: milestonesForPath(path), journal: data.journal });
    },
    [data, persist]
  );

  const toggleMilestone = useCallback(
    (id: string) => {
      const next = data.milestones.map((m) => (m.id === id ? { ...m, done: !m.done } : m));
      persist({ ...data, milestones: next });
    },
    [data, persist]
  );

  const addJournalEntry = useCallback(
    (note: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;
      const entry: CareerJournalEntry = { date: new Date().toISOString().slice(0, 10), note: trimmed, loggedAt: new Date().toISOString() };
      persist({ ...data, journal: [...data.journal, entry] });
    },
    [data, persist]
  );

  const resetProfile = useCallback(() => {
    persist(EMPTY);
  }, [persist]);

  return {
    profile: data.profile,
    milestones: data.milestones,
    journal: data.journal,
    loaded,
    startPath,
    toggleMilestone,
    addJournalEntry,
    resetProfile,
  };
}
