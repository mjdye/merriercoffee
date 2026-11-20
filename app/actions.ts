"use server";

import { Resend } from "resend";
import { z } from "zod";

export type QuoteState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; values?: Record<string, string>; attempt?: number };

const required = (label: string) =>
  z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`);

const QuoteSchema = z.object({
  name: required("Name").max(120),
  email: z.email("Enter a valid email").max(200),
  phone: required("Phone").max(40),
  eventType: required("Event type").max(60),
  eventDate: required("Event date").max(20),
  serviceTime: required("Service time").max(80),
  location: required("Event location").max(300),
  guests: required("Guest count").max(20),
  setting: z.string().max(20).optional(),
  heardFrom: z.string().max(60).optional(),
  details: required("A few details").max(4000),
});

const LABELS: Record<keyof z.infer<typeof QuoteSchema>, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  eventType: "Event type",
  eventDate: "Event date",
  serviceTime: "Service time",
  location: "Location",
  guests: "Estimated guests",
  setting: "Indoor / outdoor",
  heardFrom: "Heard about us from",
  details: "Details",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function verifyTurnstile(token: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured: rely on the honeypot only.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real people never see or fill this field. Pretend it worked so bots move on.
  if (formData.get("company_website")) return { status: "success" };

  const raw = Object.fromEntries(formData);
  // Echo values back so the form can refill itself (React resets forms after an action).
  const values = Object.fromEntries(
    Object.keys(LABELS).flatMap((k) => (typeof raw[k] === "string" ? [[k, raw[k] as string]] : [])),
  );
  const parsed = QuoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fill in the highlighted fields.", fieldErrors, values, attempt: Date.now() };
  }

  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null))) {
    return { status: "error", message: "We couldn't verify you're human. Please try again.", values, attempt: Date.now() };
  }

  const q = parsed.data;
  const rows = (Object.keys(LABELS) as (keyof typeof LABELS)[])
    .filter((k) => q[k])
    .map((k) => [LABELS[k], String(q[k])] as const);

  const subject = `Quote request: ${q.eventType} on ${q.eventDate} (${q.name})`;
  const textBody = rows.map(([l, v]) => `${l}: ${v}`).join("\n");
  const html = `<h2 style="font-family:sans-serif">New quote request</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
${rows
  .map(
    ([l, v]) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap">${l}</td><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<p style="font-family:sans-serif;color:#666;font-size:12px">Reply to this email to respond to ${escapeHtml(q.name)} directly.</p>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[quote] RESEND_API_KEY not set; would have sent:\n${subject}\n${textBody}`);
      return { status: "success" };
    }
    console.error("[quote] RESEND_API_KEY is not set");
    return { status: "error", message: "Sorry, the form isn't working right now. Please email us instead.", values, attempt: Date.now() };
  }

  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.QUOTE_FROM_EMAIL ?? "Merrier Website <onboarding@resend.dev>",
    to: process.env.QUOTE_TO_EMAIL ?? "info@merrier.coffee",
    replyTo: q.email,
    subject,
    text: textBody,
    html,
  });

  if (error) {
    console.error("[quote] Resend error:", error);
    return { status: "error", message: "Sorry, something went wrong sending your request. Please email us instead.", values, attempt: Date.now() };
  }
  return { status: "success" };
}
