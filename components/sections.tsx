import Image from "next/image";
import { FacebookIcon, InstagramIcon, Logo, SectionHeading, buttonPrimary, buttonSecondary } from "./brand";
import type { PublicEvent } from "@/lib/events";

import cartFront from "@/public/photos/cart-front.jpg";
import cartWithSign from "@/public/photos/cart-with-sign.jpg";
import latteMachine from "@/public/photos/latte-espresso-machine.jpg";
import latteGrinders from "@/public/photos/latte-grinders.jpg";
import headshot from "@/public/photos/owner-headshot.jpg";

type Site = {
  tagline: string;
  heroHeading: string;
  heroText: string;
  serviceArea: string;
  email: string;
  instagram: string | null;
  facebook: string | null;
  bookingNote: string;
};

const NAV = [
  { href: "#events", label: "Events" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#menu", label: "Menu" },
  { href: "#faq", label: "FAQ" },
];

function Socials({ site, className = "" }: { site: Site; className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {site.instagram && (
        <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="hover:text-rust">
          <InstagramIcon />
        </a>
      )}
      {site.facebook && (
        <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-rust">
          <FacebookIcon />
        </a>
      )}
    </div>
  );
}

export function Header({ site }: { site: Site }) {
  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" aria-label="Merrier Coffee home">
          <Logo className="h-10 w-auto text-charcoal" />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="eyebrow hover:text-rust">
              {n.label}
            </a>
          ))}
          <Socials site={site} />
          <a href="#quote" className={`${buttonPrimary} px-5! py-2.5!`}>
            Get a Quote
          </a>
        </nav>
        {/* Mobile: no-JS disclosure menu */}
        <details className="relative md:hidden">
          <summary className="eyebrow cursor-pointer rounded-full border border-charcoal/30 px-4 py-2">Menu</summary>
          <div className="absolute right-0 mt-2 flex w-56 flex-col gap-1 rounded-2xl border border-charcoal/10 bg-cream p-3 shadow-lg">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="eyebrow rounded-lg px-3 py-2.5 hover:bg-cream-dark">
                {n.label}
              </a>
            ))}
            <a href="#quote" className={`${buttonPrimary} mt-2`}>
              Get a Quote
            </a>
            <Socials site={site} className="justify-center pt-3" />
          </div>
        </details>
      </div>
    </header>
  );
}

export function Hero({ site }: { site: Site }) {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-14 md:pt-16 md:pb-24">
      <div>
        <p className="eyebrow text-rust">
          Mobile espresso bar{site.serviceArea ? ` · ${site.serviceArea}` : ""}
        </p>
        <h1 className="heading mt-4 text-3xl leading-tight sm:text-4xl lg:text-5xl">{site.heroHeading}</h1>
        <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-ink-soft">{site.heroText}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#quote" className={buttonPrimary}>
            Get a Custom Quote
          </a>
          <a href="#menu" className={buttonSecondary}>
            See the Menu
          </a>
        </div>
        <p className="mt-10 font-serif text-xl italic text-ink-soft">{site.tagline}</p>
      </div>
      <div className="relative">
        <Image
          src={cartFront}
          alt="The Merrier Coffee cart set up outdoors with espresso machine and grinders"
          priority
          placeholder="blur"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-4/5 w-full rounded-[2rem] object-cover object-[50%_60%] shadow-xl"
        />
      </div>
    </section>
  );
}

export function EventTypes({ items }: { items: readonly { title: string; description: string }[] }) {
  if (!items.length) return null;
  return (
    <section id="events" className="border-y border-charcoal/10 bg-cream-dark/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <SectionHeading eyebrow="Events we serve" title="Coffee for every kind of gathering" align="center" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <div key={t.title} className="rounded-3xl border border-charcoal/10 bg-cream p-7">
              <h3 className="heading text-base">{t.title}</h3>
              <p className="mt-3 font-serif leading-relaxed text-ink-soft">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Tell us about your event",
    body: "Share the date, location, guest count and anything else on your mind using the quote form.",
  },
  {
    title: "Get a personalized quote",
    body: "Every event is different, so we build a quote around yours: menu, hours, and how drinks are paid for.",
  },
  {
    title: "We pull up & pour",
    body: "We arrive early, set up the full espresso bar, serve your guests, and clean up when we're done.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
      <Image
        src={cartWithSign}
        alt="The Merrier cart with its A-frame menu sign"
        placeholder="blur"
        sizes="(min-width: 768px) 45vw, 100vw"
        className="order-last aspect-4/5 w-full rounded-[2rem] object-cover md:order-first"
      />
      <div>
        <SectionHeading eyebrow="How it works" title="Simple from start to sip" />
        <ol className="mt-10 space-y-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="heading flex size-11 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream">
                {i + 1}
              </span>
              <div>
                <h3 className="heading text-base">{s.title}</h3>
                <p className="mt-2 font-serif leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <a href="#quote" className={`${buttonPrimary} mt-10`}>
          Start Your Quote
        </a>
      </div>
    </section>
  );
}

type Menu = {
  showPrices: boolean;
  sections: readonly { title: string; items: readonly { name: string; price: string }[] }[];
  milks: string;
  syrupsLabel: string;
  syrups: readonly string[];
};

export function MenuSection({ menu }: { menu: Menu }) {
  return (
    <section id="menu" className="bg-charcoal text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <Logo className="w-56 text-cream sm:w-64" />
            <p className="mt-8 font-serif text-lg leading-relaxed text-cream/80">
              Espresso classics and cozy non-coffee drinks, made to order. Want a signature drink for your event? Just
              ask. We love dreaming those up.
            </p>
            <p className="eyebrow mt-6 text-cream/70">{menu.milks}</p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <Image src={latteMachine} alt="Latte with rosetta latte art beside the espresso machine" placeholder="blur" sizes="(min-width: 768px) 20vw, 50vw" className="aspect-3/4 rounded-2xl object-cover" />
              <Image src={latteGrinders} alt="Latte art in a black cup on the cart counter" placeholder="blur" sizes="(min-width: 768px) 20vw, 50vw" className="aspect-3/4 rounded-2xl object-cover" />
            </div>
          </div>
          <div className="space-y-12">
            {menu.sections.map((s) => (
              <div key={s.title}>
                <div className="flex items-center gap-5">
                  <h3 className="heading text-lg">{s.title}</h3>
                  <span className="h-px flex-1 bg-cream/25" />
                </div>
                <ul className="mt-5 space-y-3">
                  {s.items.map((it) => (
                    <li key={it.name} className="flex items-baseline justify-between gap-4 tracking-[0.18em] uppercase">
                      <span>{it.name}</span>
                      {menu.showPrices && it.price && <span className="tabular-nums text-cream/80">${it.price}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {menu.syrups.length > 0 && (
              <div className="rounded-3xl border border-cream/20 p-7">
                <p className="eyebrow text-rust brightness-150">This season</p>
                <h3 className="heading mt-2 text-lg">{menu.syrupsLabel}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {menu.syrups.map((s) => (
                    <li key={s} className="rounded-full bg-cream/10 px-4 py-1.5 font-serif">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(ymd: string) {
  const d = new Date(`${ymd}T12:00:00Z`);
  return {
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    day: d.toLocaleDateString("en-US", { day: "numeric", timeZone: "UTC" }),
    weekday: d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
  };
}

/** Renders nothing at all when there are no upcoming events. */
export function UpcomingEvents({ events, site }: { events: PublicEvent[]; site: Site }) {
  if (!events.length) return null;
  return (
    <section id="upcoming" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading eyebrow="Find the cart" title="Upcoming pop-ups" align="center" />
      <ul className="mx-auto mt-12 max-w-3xl divide-y divide-charcoal/10 border-y border-charcoal/10">
        {events.map((e) => {
          const d = formatDate(e.date);
          const body = (
            <div className="flex items-center gap-6 py-5">
              <div className="w-16 shrink-0 text-center">
                <p className="eyebrow text-rust">{d.month}</p>
                <p className="heading text-3xl tracking-normal">{d.day}</p>
              </div>
              <div className="min-w-0">
                <p className="heading text-base">{e.title}</p>
                <p className="mt-1 font-serif text-ink-soft">
                  {[d.weekday, e.time, e.location].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          );
          return (
            <li key={e.key}>
              {e.link ? (
                <a href={e.link} target="_blank" rel="noopener" className="block hover:bg-cream-dark/60">
                  {body}
                </a>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
      {site.instagram && (
        <p className="mt-8 text-center font-serif text-ink-soft">
          Follow{" "}
          <a href={site.instagram} target="_blank" rel="noopener" className="underline decoration-rust underline-offset-4">
            @merrier_coffee
          </a>{" "}
          for last-minute pop-ups.
        </p>
      )}
    </section>
  );
}

export function About({ about }: { about: { heading: string; paragraphs: string[] } }) {
  return (
    <section id="about" className="border-y border-charcoal/10 bg-cream-dark/60">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.3fr] md:py-24">
        <Image
          src={headshot}
          alt="The owner of Merrier Coffee smiling behind the cart"
          placeholder="blur"
          sizes="(min-width: 768px) 40vw, 100vw"
          className="mx-auto aspect-4/5 w-full max-w-md rounded-[2rem] object-cover object-top"
        />
        <div>
          <SectionHeading eyebrow="About" title={about.heading} />
          <div className="mt-6 space-y-5 font-serif text-lg leading-relaxed text-ink-soft">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ site }: { site: Site }) {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6">
        <Logo className="w-48 text-cream" />
        <p className="font-serif text-lg italic text-cream/80">{site.tagline}</p>
        {site.bookingNote && <p className="eyebrow text-cream/70">{site.bookingNote}</p>}
        <a href={`mailto:${site.email}`} className="font-serif underline decoration-cream/40 underline-offset-4 hover:decoration-cream">
          {site.email}
        </a>
        {site.serviceArea && <p className="eyebrow text-cream/60">Serving {site.serviceArea}</p>}
        <Socials site={site} />
        <p className="text-xs text-cream/50">© Merrier Coffee</p>
      </div>
    </footer>
  );
}

export function Faq({ items }: { items: readonly { question: string; answer: string }[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <SectionHeading eyebrow="Questions" title="Frequently asked" align="center" />
      <div className="mt-12 divide-y divide-charcoal/10 border-y border-charcoal/10">
        {items.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex cursor-pointer items-center justify-between gap-6">
              <span className="heading text-sm sm:text-base">{f.question}</span>
              <span className="text-2xl leading-none text-rust transition group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <p className="mt-4 font-serif leading-relaxed whitespace-pre-line text-ink-soft">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
