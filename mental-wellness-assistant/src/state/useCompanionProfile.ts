import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompanionProfile } from "@/types";

const STORAGE_KEY = "mind_companion_companion_profile_v1";

const defaultProfile = (): CompanionProfile => ({ name: null, aboutMe: [] });

/** What the companion "knows" about the user — name and a short list of
 *  self-shared facts, persisted on-device only. See
 *  DISCLAIMERS.companionNotRealAI: this is storage and lookup, not
 *  understanding. */
export function useCompanionProfile() {
  const [profile, setProfile] = useState<CompanionProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProfile(JSON.parse(raw));
      } catch {
        // Falls back to an empty profile.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: CompanionProfile) => {
    setProfile(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const setName = useCallback(
    (name: string) => {
      persist({ ...profile, name: name.trim() || null });
    },
    [profile, persist]
  );

  const addFact = useCallback(
    (fact: string) => {
      const trimmed = fact.trim();
      if (!trimmed) return;
      persist({ ...profile, aboutMe: [...profile.aboutMe, trimmed] });
    },
    [profile, persist]
  );

  const removeFact = useCallback(
    (index: number) => {
      persist({ ...profile, aboutMe: profile.aboutMe.filter((_, i) => i !== index) });
    },
    [profile, persist]
  );

  return { profile, loaded, setName, addFact, removeFact };
}
