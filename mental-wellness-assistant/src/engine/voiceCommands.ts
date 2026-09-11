import { StepCommand } from "@/types";

/**
 * Shared "what did the user mean" parser for any step-by-step voice flow
 * (cooking guide, storytelling, …). Recognizes "next"/"بعدی",
 * "repeat"/"تکرار کن", "previous"/"قبلی", and "stop"/"تمام کن" from
 * either a voice transcript or typed text, in Persian or English,
 * without requiring an exact phrase.
 */
const NEXT_PHRASES = ["بعدی", "ادامه بده", "انجام دادم", "انجام شد", "تمام شد", "next", "continue", "done", "finished", "ok", "okay"];
const REPEAT_PHRASES = ["تکرار", "دوباره بگو", "دوباره", "repeat", "again", "say again"];
const PREVIOUS_PHRASES = ["قبلی", "برگرد", "previous", "back", "go back"];
const STOP_PHRASES = ["توقف", "تمام کن", "بسه", "کافیه", "stop", "cancel", "quit", "exit"];

export const matchStepCommand = (text: string): StepCommand => {
  const t = text.trim().toLowerCase();
  if (!t) return "unknown";
  if (STOP_PHRASES.some((p) => t.includes(p))) return "stop";
  if (REPEAT_PHRASES.some((p) => t.includes(p))) return "repeat";
  if (PREVIOUS_PHRASES.some((p) => t.includes(p))) return "previous";
  if (NEXT_PHRASES.some((p) => t.includes(p))) return "next";
  return "unknown";
};
