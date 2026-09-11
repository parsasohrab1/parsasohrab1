import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TrustedContact } from "@/types";

const STORAGE_KEY = "mind_companion_trusted_contact_v1";

/**
 * The one close, trusted person the "active listening" duress flow can
 * offer to message. Captured once via a short Q&A (see
 * ActiveListeningScreen) and persisted on-device only — never sent
 * anywhere except as the recipient of a message the user themselves
 * sends via their own SMS app.
 */
export function useTrustedContact() {
  const [contact, setContact] = useState<TrustedContact | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setContact(JSON.parse(raw));
      } catch {
        // Corrupt/missing storage just falls back to "no contact set".
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveContact = useCallback(async (next: TrustedContact) => {
    setContact(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const clearContact = useCallback(async () => {
    setContact(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // Best-effort.
    }
  }, []);

  return { contact, loaded, saveContact, clearContact };
}
