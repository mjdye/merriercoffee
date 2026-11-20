import type { CSSProperties } from "react";

/** The traced script lockup, tinted with the current text color via a CSS mask. */
export function Logo({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <span
      role="img"
      aria-label="Merrier Coffee"
      className={`block bg-current ${className}`}
      style={{
        aspectRatio: "3122 / 1447",
        maskImage: "url(/logo.svg)",
        WebkitMaskImage: "url(/logo.svg)",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}

export function InstagramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className = "",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && <p className="eyebrow text-rust">{eyebrow}</p>}
      <h2 className="heading mt-3 text-2xl sm:text-3xl">{title}</h2>
    </div>
  );
}

export const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-charcoal px-7 py-3.5 eyebrow text-cream transition hover:bg-espresso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";
export const buttonSecondary =
  "inline-flex items-center justify-center rounded-full border border-charcoal/30 px-7 py-3.5 eyebrow transition hover:border-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust";
