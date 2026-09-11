import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mood, MoodLogEntry } from "@/types";

const STORAGE_KEY = "mind_companion_mood_log_v1";
const MAX_ENTRIES = 200;

/** A simple, on-device mood check-in history — timestamps + mood + an
 *  optional note, nothing more. Used for the companion's "how have you
 *  been lately" summary (counts only, never a clinical interpretation). */
export function useMoodLog() {
  const [log, setLog] = useState<MoodLogEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setLog(JSON.parse(raw));
      } catch {
        // Falls back to an empty log.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const logMood = useCallback(
    (mood: Mood, note?: string) => {
      const entry: MoodLogEntry = { mood, note, loggedAt: new Date().toISOString() };
      const next = [...log, entry].slice(-MAX_ENTRIES);
      setLog(next);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
        // Best-effort persistence; in-memory state already updated.
      });
    },
    [log]
  );

  return { log, loaded, logMood };
}
