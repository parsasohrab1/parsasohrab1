import { EmergencyContact } from "@/types";

/**
 * Real emergency-service numbers, used by the "active listening" feature
 * to place calls the user still has to confirm (see types.ts's note on
 * ActiveListening scope).
 *
 * IMPORTANT: these are Iran's standard national emergency numbers.
 * Verify and update for your actual deployment region before shipping —
 * this is a reasonable starting point, not a guarantee of accuracy for
 * every locale (same caveat as src/data/crisisResources.ts).
 */
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    category: "police",
    label: { fa: "پلیس ۱۱۰", en: "Police (110)" },
    phone: "110",
  },
  {
    category: "fire",
    label: { fa: "آتش‌نشانی ۱۲۵", en: "Fire department (125)" },
    phone: "125",
  },
  {
    category: "medical",
    label: { fa: "اورژانس پزشکی ۱۱۵", en: "Medical emergency / ambulance (115)" },
    phone: "115",
  },
];

export const emergencyContactForCategory = (
  category: EmergencyContact["category"]
): EmergencyContact | undefined => EMERGENCY_CONTACTS.find((c) => c.category === category);
