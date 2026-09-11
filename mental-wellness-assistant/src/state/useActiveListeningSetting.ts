import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "mind_companion_active_listening_enabled_v1";

/** Persisted opt-in consent for the active-listening feature — off by
 *  default. Once the user turns it on, it stays on for next time too. */
export function useActiveListeningSetting() {
  const [enabled, setEnabledState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setEnabledState(raw === "true");
      } catch {
        // Falls back to disabled.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const setEnabled = useCallback(async (next: boolean) => {
    setEnabledState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  return { enabled, loaded, setEnabled };
}
