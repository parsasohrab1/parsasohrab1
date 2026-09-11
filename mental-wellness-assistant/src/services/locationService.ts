import * as Location from "expo-location";
import { Platform } from "react-native";
import { LocationInfo } from "@/types";

const formatAddress = (a: Location.LocationGeocodedAddress): string =>
  [a.streetNumber && a.street ? `${a.street} ${a.streetNumber}` : a.street, a.district, a.city, a.region, a.country]
    .filter(Boolean)
    .join("، ");

/**
 * Best-effort "where am I right now" for the active-listening emergency
 * flow. Returns null if location permission is denied — callers should
 * fall back to reading no address rather than blocking the emergency
 * call/message. Reverse geocoding (turning coordinates into a street
 * address) isn't supported by expo-location on web, so `address` stays
 * null there — the coordinates are still returned and can be read aloud.
 */
export const getCurrentLocationInfo = async (): Promise<LocationInfo | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    const { latitude, longitude } = position.coords;

    let address: string | null = null;
    if (Platform.OS !== "web") {
      try {
        const results = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (results[0]) address = formatAddress(results[0]);
      } catch {
        // Reverse geocoding can fail (offline, unsupported region); the
        // caller still gets usable coordinates.
      }
    }

    return { latitude, longitude, address };
  } catch {
    return null;
  }
};
