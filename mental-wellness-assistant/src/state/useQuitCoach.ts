import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuitCheckIn, QuitProfile } from "@/types";

const STORAGE_KEY = "mind_companion_quit_coach_v1";

interface QuitCoachData {
  profile: QuitProfile | null;
  checkIns: QuitCheckIn[];
}

const todayIso = (): string => new Date().toISOString().slice(0, 10);

/** Persisted quit-coach state: the one-time profile Q&A plus an
 *  ongoing, on-device daily check-in log — this is the "daily
 *  feedback" loop, entirely local (no backend, no push notifications;
 *  see the QuitCoachScreen disclaimer). */
export function useQuitCoach() {
  const [data, setData] = useState<QuitCoachData>({ profile: null, checkIns: [] });
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

  const persist = useCallback(async (next: QuitCoachData) => {
    setData(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const setProfile = useCallback(
    (profile: QuitProfile) => {
      persist({ ...data, profile });
    },
    [data, persist]
  );

  const resetProfile = useCallback(() => {
    persist({ profile: null, checkIns: [] });
  }, [persist]);

  /** Adds or replaces today's check-in (only one per calendar day). */
  const logCheckIn = useCallback(
    (usedSubstance: boolean, cravingLevel: number, note?: string) => {
      const today = todayIso();
      const entry: QuitCheckIn = { date: today, usedSubstance, cravingLevel, note, loggedAt: new Date().toISOString() };
      const withoutToday = data.checkIns.filter((c) => c.date !== today);
      const next = [...withoutToday, entry].sort((a, b) => a.date.localeCompare(b.date));
      persist({ ...data, checkIns: next });
    },
    [data, persist]
  );

  const hasCheckedInToday = data.checkIns.some((c) => c.date === todayIso());

  return {
    profile: data.profile,
    checkIns: data.checkIns,
    loaded,
    setProfile,
    resetProfile,
    logCheckIn,
    hasCheckedInToday,
  };
}
