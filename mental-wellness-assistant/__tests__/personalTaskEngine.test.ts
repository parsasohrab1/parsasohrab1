import { QuickContact } from "@/types";
import {
  buildActionUrl,
  detectAction,
  extractContactName,
  extractMessage,
  extractSubject,
  missingInfoFor,
  parseIntent,
  realAutomationStub,
  resolveContact,
} from "@/engine/personalTaskEngine";

describe("detectAction", () => {
  it("detects each action from Persian and English keywords", () => {
    expect(detectAction("به مامان ایمیل بزن")).toBe("email");
    expect(detectAction("send an email to mom")).toBe("email");
    expect(detectAction("به علی پیامک بده")).toBe("sms");
    expect(detectAction("text Ali")).toBe("sms");
    expect(detectAction("به بابا زنگ بزن")).toBe("call");
    expect(detectAction("call dad")).toBe("call");
    expect(detectAction("پیام واتساپ بفرست")).toBe("whatsapp");
  });

  it("returns null when no action keyword is present", () => {
    expect(detectAction("سلام چطوری")).toBeNull();
  });
});

describe("extractContactName / extractMessage / extractSubject", () => {
  it("extracts the contact name after 'به'/'to'", () => {
    expect(extractContactName("به مامان پیامک بده")).toBe("مامان");
    expect(extractContactName("send an email to mom")).toBe("mom");
  });

  it("extracts the message after a 'بگو'/'saying' marker", () => {
    expect(extractMessage("به مامان پیامک بده بگو دیر میام")).toBe("دیر میام");
    expect(extractMessage("text Ali saying I'll be late")).toBe("I'll be late");
  });

  it("extracts the subject after 'با موضوع'/'subject', stopping before a message marker", () => {
    expect(extractSubject("به بابا ایمیل بزن با موضوع تولد بگو تبریک میگم")).toBe("تولد");
  });

  it("returns null when there's nothing to extract", () => {
    expect(extractContactName("سلام")).toBeNull();
    expect(extractMessage("سلام")).toBeNull();
    expect(extractSubject("سلام")).toBeNull();
  });
});

describe("parseIntent", () => {
  it("combines action, contact, and message from one command", () => {
    const intent = parseIntent("به مامان پیامک بده بگو دیر میام");
    expect(intent).toEqual({ action: "sms", contactName: "مامان", message: "دیر میام", subject: null });
  });
});

describe("resolveContact", () => {
  const contacts: QuickContact[] = [
    { id: "1", name: "مامان", phone: "0912", email: null, trusted: false },
    { id: "2", name: "Ali", phone: null, email: "ali@example.com", trusted: false },
  ];

  it("matches a saved contact case-insensitively", () => {
    expect(resolveContact("مامان", contacts)?.id).toBe("1");
    expect(resolveContact("ali", contacts)?.id).toBe("2");
  });

  it("returns null for no match or a null name", () => {
    expect(resolveContact("nobody", contacts)).toBeNull();
    expect(resolveContact(null, contacts)).toBeNull();
  });
});

describe("missingInfoFor", () => {
  const contactWithPhoneOnly: QuickContact = { id: "1", name: "مامان", phone: "0912", email: null, trusted: false };

  it("flags a missing contact first, ignoring other gaps", () => {
    const missing = missingInfoFor({ action: "sms", contactName: "x", message: "hi", subject: null }, null);
    expect(missing).toEqual(["contact"]);
  });

  it("flags a missing email for an email action even if phone exists", () => {
    const missing = missingInfoFor({ action: "email", contactName: "مامان", message: "hi", subject: null }, contactWithPhoneOnly);
    expect(missing).toContain("email");
  });

  it("flags a missing message for sms/email/whatsapp but not for a call", () => {
    const withMessage = missingInfoFor({ action: "call", contactName: "مامان", message: null, subject: null }, contactWithPhoneOnly);
    expect(withMessage).not.toContain("message");
    const withoutMessage = missingInfoFor({ action: "sms", contactName: "مامان", message: null, subject: null }, contactWithPhoneOnly);
    expect(withoutMessage).toContain("message");
  });

  it("returns an empty array when everything needed is present", () => {
    const missing = missingInfoFor({ action: "sms", contactName: "مامان", message: "hi", subject: null }, contactWithPhoneOnly);
    expect(missing).toEqual([]);
  });
});

describe("buildActionUrl", () => {
  const contact: QuickContact = { id: "1", name: "Mom", phone: "+15551234567", email: "mom@example.com", trusted: false };

  it("builds a mailto: URL with encoded subject and body", () => {
    const url = buildActionUrl("email", contact, "I'll be late", "Update");
    expect(url).toBe(`mailto:mom@example.com?subject=Update&body=${encodeURIComponent("I'll be late")}`);
    expect(url).toContain("mailto:mom@example.com");
    expect(url).toContain("subject=Update");
  });

  it("builds an sms: URL with the encoded body", () => {
    const url = buildActionUrl("sms", contact, "hi there", null);
    expect(url).toBe(`sms:${contact.phone}?body=hi%20there`);
  });

  it("builds a wa.me URL stripping non-digit characters from the phone", () => {
    const url = buildActionUrl("whatsapp", contact, "hey", null);
    expect(url).toBe(`https://wa.me/${contact.phone}?text=hey`);
  });

  it("returns null for call (handled directly via tel:, not this helper)", () => {
    expect(buildActionUrl("call", contact, null, null)).toBeNull();
  });

  it("returns null when the required contact field is missing", () => {
    const noEmail: QuickContact = { ...contact, email: null };
    expect(buildActionUrl("email", noEmail, "hi", null)).toBeNull();
  });
});

describe("realAutomationStub", () => {
  it("throws instead of pretending to actually send/call", async () => {
    const contact: QuickContact = { id: "1", name: "Mom", phone: "123", email: "mom@example.com", trusted: false };
    await expect(realAutomationStub.execute("email", contact, "hi", null)).rejects.toThrow();
  });
});
