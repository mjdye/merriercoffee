"use client";

import Script from "next/script";
import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { buttonPrimary } from "./brand";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const HEARD_FROM = ["Instagram", "Facebook", "Saw the cart at an event", "Friend or family", "Google", "Other"];

const inputClass =
  "mt-2 w-full rounded-xl border border-charcoal/20 bg-white/70 px-4 py-3 font-serif text-base text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-charcoal focus:ring-2 focus:ring-rust/30 aria-invalid:border-rust";

function Field({
  name,
  label,
  error,
  className = "",
  children,
}: {
  name: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className={`block ${className}`}>
      <span className="eyebrow">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-sm text-rust">{error}</span>}
    </label>
  );
}

export function QuoteForm({ eventTypes, email, responseTime }: { eventTypes: string[]; email: string; responseTime: string }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, { status: "idle" });
  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};
  // Shared props per field: refill after a failed submit and flag errors.
  const f = (name: string, fallback = "") => ({
    id: name,
    name,
    defaultValue: values[name] ?? fallback,
    "aria-invalid": errors[name] ? true : undefined,
  });

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-charcoal/10 bg-cream p-10 text-center" role="status">
        <p className="eyebrow text-rust">Request sent</p>
        <h3 className="heading mt-3 text-2xl">Thank you!</h3>
        <p className="mx-auto mt-4 max-w-md font-serif text-lg leading-relaxed text-ink-soft">
          We got your details and will be in touch{responseTime ? ` ${responseTime}` : " soon"} with a personalized quote.
        </p>
      </div>
    );
  }

  return (
    <form
      // Remount after each failed attempt so every field (selects included) refills from `values`.
      key={state.status === "error" ? state.attempt : "form"}
      action={action}
      className="rounded-3xl border border-charcoal/10 bg-cream p-6 sm:p-10" noValidate>
      {TURNSTILE_SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Your name *" error={errors.name}>
          <input {...f("name")} autoComplete="name" required className={inputClass} />
        </Field>
        <Field name="email" label="Email *" error={errors.email}>
          <input {...f("email")} type="email" autoComplete="email" required className={inputClass} />
        </Field>
        <Field name="phone" label="Phone *" error={errors.phone}>
          <input {...f("phone")} type="tel" autoComplete="tel" required className={inputClass} />
        </Field>
        <Field name="eventType" label="Type of event *" error={errors.eventType}>
          <select {...f("eventType")} required className={inputClass}>
            <option value="" disabled>
              Choose one…
            </option>
            {eventTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
            <option>Other</option>
          </select>
        </Field>
        <Field name="eventDate" label="Event date *" error={errors.eventDate}>
          <input {...f("eventDate")} type="date" required className={inputClass} />
        </Field>
        <Field name="serviceTime" label="Service start & end time *" error={errors.serviceTime}>
          <input {...f("serviceTime")} placeholder="e.g. 9am – 12pm" required className={inputClass} />
        </Field>
        <Field name="location" label="Venue & address *" error={errors.location} className="sm:col-span-2">
          <input {...f("location")} autoComplete="street-address" required className={inputClass} />
        </Field>
        <Field name="guests" label="Estimated guests *" error={errors.guests}>
          <input {...f("guests")} inputMode="numeric" placeholder="e.g. 120" required className={inputClass} />
        </Field>
        <Field name="setting" label="Indoor or outdoor?">
          <select {...f("setting")} className={inputClass}>
            <option value="">Not sure yet</option>
            <option>Indoor</option>
            <option>Outdoor</option>
            <option>Both</option>
          </select>
        </Field>
        <Field name="heardFrom" label="How did you hear about us?" className="sm:col-span-2">
          <select {...f("heardFrom")} className={inputClass}>
            <option value="">Choose one…</option>
            {HEARD_FROM.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </Field>
        <Field name="details" label="Tell us about your event *" error={errors.details} className="sm:col-span-2">
          <textarea
            {...f("details")}
            rows={5}
            required
            placeholder="What's the occasion? Any drinks you have in mind, who's covering drinks, or anything else we should know."
            className={inputClass}
          />
        </Field>
      </div>

      {TURNSTILE_SITE_KEY && <div className="cf-turnstile mt-6" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />}

      {state.status === "error" && (
        <p className="mt-6 rounded-xl bg-rust/10 px-4 py-3 font-serif text-rust" role="alert">
          {state.message}
        </p>
      )}

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={pending} className={`${buttonPrimary} disabled:opacity-60`}>
          {pending ? "Sending…" : "Request My Quote"}
        </button>
        <p className="font-serif text-sm text-ink-soft">
          Prefer email?{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
        </p>
      </div>
    </form>
  );
}
