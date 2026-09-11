import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuickContact } from "@/types";

const STORAGE_KEY = "mind_companion_quick_contacts_v1";

const makeId = (): string => `qc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

/** A small, on-device address book the user builds themselves — never
 *  a real read of the phone's actual contacts. See
 *  DISCLAIMERS.personalTasksLimitations. */
export function useQuickContacts() {
  const [contacts, setContacts] = useState<QuickContact[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          // Contacts saved before the "trusted" flag existed lack it at
          // runtime even though the type now requires it — normalize on load.
          const parsed: (Omit<QuickContact, "trusted"> & Partial<Pick<QuickContact, "trusted">>)[] = JSON.parse(raw);
          setContacts(parsed.map((c) => ({ ...c, trusted: c.trusted ?? false })));
        }
      } catch {
        // Falls back to an empty list.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: QuickContact[]) => {
    setContacts(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const addContact = useCallback(
    (name: string, phone: string | null, email: string | null) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const contact: QuickContact = {
        id: makeId(),
        name: trimmed,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        trusted: false,
      };
      persist([...contacts, contact]);
    },
    [contacts, persist]
  );

  const removeContact = useCallback(
    (id: string) => {
      persist(contacts.filter((c) => c.id !== id));
    },
    [contacts, persist]
  );

  const toggleTrusted = useCallback(
    (id: string) => {
      persist(contacts.map((c) => (c.id === id ? { ...c, trusted: !c.trusted } : c)));
    },
    [contacts, persist]
  );

  return { contacts, loaded, addContact, removeContact, toggleTrusted };
}
