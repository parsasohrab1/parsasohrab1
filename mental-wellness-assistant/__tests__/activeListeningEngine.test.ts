import { EmergencyDetection } from "@/types";
import { detectEmergency, summarizeListeningPeriod } from "@/engine/activeListeningEngine";

describe("detectEmergency", () => {
  it("detects a medical emergency phrase in Persian and English", () => {
    expect(detectEmergency("یکی بیهوش شده، آمبولانس خبر کن")?.category).toBe("medical");
    expect(detectEmergency("she's not breathing, call an ambulance")?.category).toBe("medical");
  });

  it("detects a fire phrase", () => {
    expect(detectEmergency("آتیش گرفته، دود همه‌جا رو گرفته")?.category).toBe("fire");
    expect(detectEmergency("there's smoke everywhere, fire!")?.category).toBe("fire");
  });

  it("detects a police/fight phrase", () => {
    expect(detectEmergency("یکی داره با چاقو تهدید می‌کنه، پلیس رو خبر کن")?.category).toBe("police");
    expect(detectEmergency("please call the police, someone's attacking me")?.category).toBe("police");
  });

  it("detects a duress phrase", () => {
    expect(detectEmergency("ولم کن، اذیتم نکن")?.category).toBe("duress");
    expect(detectEmergency("please leave me alone, stop pressuring me")?.category).toBe("duress");
  });

  it("returns null for ordinary speech with no matching phrase", () => {
    expect(detectEmergency("امروز هوا خیلی خوب بود و رفتیم پارک")).toBeNull();
    expect(detectEmergency("")).toBeNull();
  });

  it("prioritizes medical over other categories when multiple phrases could match", () => {
    // "police" and "ambulance" both present — medical is checked first.
    const result = detectEmergency("call the police, we also need an ambulance, she's bleeding");
    expect(result?.category).toBe("medical");
  });

  it("reports which exact phrase matched, and preserves the original transcript", () => {
    const transcript = "کمک کن، آتش‌سوزی شده";
    const result = detectEmergency(transcript);
    expect(result?.transcript).toBe(transcript);
    expect(result?.matchedPhrase).toBeTruthy();
  });
});

describe("summarizeListeningPeriod", () => {
  it("reports a clean period with no detections", () => {
    const summary = summarizeListeningPeriod(5, []);
    expect(summary.en).toContain("5 exchanges");
    expect(summary.en).toContain("no concerning phrase");
    expect(summary.fa).toContain("۵ گفت‌وگو".replace("۵", "5")); // count is rendered as a plain number
  });

  it("names the detected categories in the summary", () => {
    const detections: EmergencyDetection[] = [
      { category: "duress", matchedPhrase: "ولم کن", transcript: "ولم کن", detectedAt: new Date().toISOString() },
    ];
    const summary = summarizeListeningPeriod(3, detections);
    expect(summary.en).toContain("pressure or coercion");
  });

  it("always includes the non-verbal-behavior caveat, in both languages", () => {
    const summary = summarizeListeningPeriod(0, []);
    expect(summary.en.toLowerCase()).toContain("tone of voice");
    expect(summary.fa).toContain("لحن صدا");
  });
});
