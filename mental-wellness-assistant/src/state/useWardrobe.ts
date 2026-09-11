import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FormalityLevel, GarmentCategory, WardrobeItem } from "@/types";

const STORAGE_KEY = "mind_companion_wardrobe_v1";

/**
 * A user's self-tagged wardrobe photos, persisted on-device only (see
 * DISCLAIMERS.styleAdvisorLimitations — nothing is ever uploaded, and
 * there's no automatic image recognition; category/formality/color are
 * whatever the user typed in themselves).
 */
export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        // Corrupt/missing storage just falls back to an empty wardrobe.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: WardrobeItem[]) => {
    setItems(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best-effort persistence; in-memory state already updated.
    }
  }, []);

  const addItem = useCallback(
    (photoUri: string, category: GarmentCategory, formality: FormalityLevel, colorNote: string) => {
      const item: WardrobeItem = {
        id: `wardrobe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        photoUri,
        category,
        formality,
        colorNote,
        addedAt: new Date().toISOString(),
      };
      persist([...items, item]);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  return { items, loaded, addItem, removeItem };
}
