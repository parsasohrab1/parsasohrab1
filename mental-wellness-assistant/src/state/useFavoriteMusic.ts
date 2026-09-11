import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteMusicProfile, OriginPreference, VocalPreference } from "@/types";

const STORAGE_KEY = "mind_companion_favorite_music_profile_v1";

const defaultProfile = (): FavoriteMusicProfile => ({
  favoriteArtists: [],
  favoriteGenres: [],
  vocalPreference: "both",
  originPreference: "both",
  updatedAt: new Date().toISOString(),
});

/**
 * Persists the listener's music taste on-device (AsyncStorage) so it
 * survives app restarts. Nothing here is sent anywhere — this is local
 * preference data, not an account profile.
 */
export function useFavoriteMusic() {
  const [profile, setProfile] = useState<FavoriteMusicProfile>(defaultProfile);
  const [loaded, setLoaded] = useState(false);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProfile(JSON.parse(raw));
      } catch {
        // Corrupt/missing storage just falls back to defaults.
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  /** Applies `updater` to the latest profile, updates state, and
   *  best-effort persists the result — the single write path every
   *  mutator below goes through. */
  const mutate = useCallback((updater: (prev: FavoriteMusicProfile) => FavoriteMusicProfile) => {
    const next = { ...updater(profileRef.current), updatedAt: new Date().toISOString() };
    profileRef.current = next;
    setProfile(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // Best-effort persistence; in-memory state already updated.
    });
  }, []);

  const addArtist = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      mutate((prev) =>
        prev.favoriteArtists.some((a) => a.toLowerCase() === trimmed.toLowerCase())
          ? prev
          : { ...prev, favoriteArtists: [...prev.favoriteArtists, trimmed] }
      );
    },
    [mutate]
  );

  const removeArtist = useCallback(
    (name: string) => {
      mutate((prev) => ({ ...prev, favoriteArtists: prev.favoriteArtists.filter((a) => a !== name) }));
    },
    [mutate]
  );

  const addGenre = useCallback(
    (genre: string) => {
      const trimmed = genre.trim();
      if (!trimmed) return;
      mutate((prev) =>
        prev.favoriteGenres.some((g) => g.toLowerCase() === trimmed.toLowerCase())
          ? prev
          : { ...prev, favoriteGenres: [...prev.favoriteGenres, trimmed] }
      );
    },
    [mutate]
  );

  const removeGenre = useCallback(
    (genre: string) => {
      mutate((prev) => ({ ...prev, favoriteGenres: prev.favoriteGenres.filter((g) => g !== genre) }));
    },
    [mutate]
  );

  const setVocalPreference = useCallback(
    (vocalPreference: VocalPreference) => {
      mutate((prev) => ({ ...prev, vocalPreference }));
    },
    [mutate]
  );

  const setOriginPreference = useCallback(
    (originPreference: OriginPreference) => {
      mutate((prev) => ({ ...prev, originPreference }));
    },
    [mutate]
  );

  const reset = useCallback(() => {
    mutate(() => defaultProfile());
  }, [mutate]);

  return {
    profile,
    loaded,
    addArtist,
    removeArtist,
    addGenre,
    removeGenre,
    setVocalPreference,
    setOriginPreference,
    reset,
  };
}
