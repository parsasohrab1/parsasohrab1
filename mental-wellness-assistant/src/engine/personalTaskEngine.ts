import { PersonalTaskAction, PersonalTaskIntent, PersonalTaskMissingInfo, QuickContact } from "@/types";

/**
 * Best-effort keyword/regex parsing of a free-text command like "به
 * مامان ایمیل بزن بگو دیر میام" — NOT real natural-language
 * understanding, just pattern matching (same honesty level as the
 * text parsers in fitnessEngine/storytellingEngine). See
 * DISCLAIMERS.personalTasksLimitations for what this section can and
 * cannot actually do.
 */
const ACTION_KEYWORDS: Record<PersonalTaskAction, string[]> = {
  email: ["ایمیل", "email", "e-mail"],
  sms: ["پیامک", "اس ام اس", "sms", "text message", "text"],
  call: ["تماس", "زنگ بزن", "زنگ", "call", "phone"],
  whatsapp: ["واتساپ", "whatsapp"],
};

export const detectAction = (text: string): PersonalTaskAction | null => {
  const lower = text.toLowerCase();
  for (const action of Object.keys(ACTION_KEYWORDS) as PersonalTaskAction[]) {
    if (ACTION_KEYWORDS[action].some((keyword) => lower.includes(keyword))) return action;
  }
  return null;
};

const CONTACT_PATTERNS = [/به\s+([^\s,،]+)/, /\bto\s+([a-zA-Z؀-ۿ]+)/i];

export const extractContactName = (text: string): string | null => {
  for (const pattern of CONTACT_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const MESSAGE_MARKERS = ["بگو", "بنویس", "saying", "say that", "say"];

export const extractMessage = (text: string): string | null => {
  const lower = text.toLowerCase();
  for (const marker of MESSAGE_MARKERS) {
    const idx = lower.indexOf(marker.toLowerCase());
    if (idx !== -1) {
      const rest = text.slice(idx + marker.length).trim().replace(/^[:\s]+/, "");
      if (rest) return rest;
    }
  }
  return null;
};

const SUBJECT_MARKERS = ["با موضوع", "subject"];

export const extractSubject = (text: string): string | null => {
  const lower = text.toLowerCase();
  for (const marker of SUBJECT_MARKERS) {
    const idx = lower.indexOf(marker.toLowerCase());
    if (idx !== -1) {
      const rest = text.slice(idx + marker.length).trim().replace(/^[:\s]+/, "");
      const stopIdx = MESSAGE_MARKERS.reduce((min, m) => {
        const i = rest.toLowerCase().indexOf(m.toLowerCase());
        return i !== -1 && i < min ? i : min;
      }, rest.length);
      const subject = rest.slice(0, stopIdx).trim();
      if (subject) return subject;
    }
  }
  return null;
};

export const parseIntent = (text: string): PersonalTaskIntent => ({
  action: detectAction(text),
  contactName: extractContactName(text),
  message: extractMessage(text),
  subject: extractSubject(text),
});

/** Case-insensitive substring match against saved Quick Contacts. */
export const resolveContact = (name: string | null, contacts: QuickContact[]): QuickContact | null => {
  if (!name) return null;
  const needle = name.trim().toLowerCase();
  if (!needle) return null;
  return contacts.find((c) => c.name.toLowerCase().includes(needle) || needle.includes(c.name.toLowerCase())) ?? null;
};

/** What's still needed before this intent can actually be acted on. */
export const missingInfoFor = (intent: PersonalTaskIntent, contact: QuickContact | null): PersonalTaskMissingInfo[] => {
  const missing: PersonalTaskMissingInfo[] = [];
  if (!contact) {
    missing.push("contact");
    return missing;
  }
  if ((intent.action === "sms" || intent.action === "call" || intent.action === "whatsapp") && !contact.phone) {
    missing.push("phone");
  }
  if (intent.action === "email" && !contact.email) {
    missing.push("email");
  }
  if ((intent.action === "email" || intent.action === "sms" || intent.action === "whatsapp") && !intent.message) {
    missing.push("message");
  }
  return missing;
};

/** Builds the URL that Linking.openURL would open — the app that
 *  opens is always the one responsible for the final send/call tap.
 *  Returns null for "call", which the screen builds directly from the
 *  phone number (no message content applies to a phone call). */
export const buildActionUrl = (
  action: PersonalTaskAction,
  contact: QuickContact,
  message: string | null,
  subject: string | null
): string | null => {
  switch (action) {
    case "email":
      if (!contact.email) return null;
      return `mailto:${contact.email}?subject=${encodeURIComponent(subject ?? "")}&body=${encodeURIComponent(message ?? "")}`;
    case "sms":
      if (!contact.phone) return null;
      return `sms:${contact.phone}?body=${encodeURIComponent(message ?? "")}`;
    case "whatsapp":
      if (!contact.phone) return null;
      return `https://wa.me/${contact.phone.replace(/[^\d+]/g, "")}?text=${encodeURIComponent(message ?? "")}`;
    case "call":
      return null;
  }
};

export interface RealAutomationProvider {
  id: string;
  label: { fa: string; en: string };
  /** Would actually send/call via a licensed, OAuth-consented service
   *  (Gmail API, Twilio, WhatsApp Business API, …) instead of just
   *  opening a native composer. Not implemented in this scaffold. */
  execute: (action: PersonalTaskAction, contact: QuickContact, message: string | null, subject: string | null) => Promise<void>;
}

/** Documented extension point for real, account-authorized automation
 *  (actually sending, not just opening a composer). Intentionally
 *  throws — see DISCLAIMERS.personalTasksLimitations. */
export const realAutomationStub: RealAutomationProvider = {
  id: "remote_automation_stub",
  label: { fa: "ارسال خودکار واقعی (نیازمند سرویس مجاز)", en: "Real automatic sending (needs a licensed service)" },
  execute: async () => {
    throw new Error(
      "Real automatic sending/calling is not configured in this scaffold. Wire a licensed, user-consented " +
        "service (Gmail API for email, Twilio for SMS/calls, WhatsApp Business API, …) behind the " +
        "RealAutomationProvider interface in src/engine/personalTaskEngine.ts."
    );
  },
};
