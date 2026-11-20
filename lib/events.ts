import ical, { type ParameterValue, type VEvent } from "node-ical";
import { cacheLife } from "next/cache";
import { getManualEvents } from "./content";

export const TIME_ZONE = "America/New_York";
const MAX_EVENTS = 6;
const LOOKAHEAD_DAYS = 120;

export type PublicEvent = {
  key: string;
  title: string;
  /** Calendar date in the business's time zone, YYYY-MM-DD. */
  date: string;
  time?: string;
  location?: string;
  link?: string;
  /** Sort key: ISO start time (or date for all-day/manual events). */
  sort: string;
};

const text = (v: ParameterValue | undefined) => (typeof v === "string" ? v : v?.val ?? "").trim();

/** YYYY-MM-DD for an instant, as seen in the business's time zone. */
function ymdInZone(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Date-only iCal values are created at local midnight on the server, so read them with local getters. */
function ymdLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function timeRange(start: Date, end?: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" });
  const tidy = (s: string) => s.replace(":00", "").replace(" ", "").toLowerCase();
  return end ? `${tidy(fmt.format(start))}–${tidy(fmt.format(end))}` : tidy(fmt.format(start));
}

/** Town/venue only: drop the street address Google Calendar adds after the first comma pair. */
function shortLocation(loc: string) {
  const parts = loc.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 2) return loc;
  // "Venue, 123 Main St, Town, GA 30000, USA" → "Venue · Town"
  const town = parts.length >= 4 ? parts[parts.length - 3] : parts[1];
  return `${parts[0]} · ${town}`;
}

async function getCalendarEvents(now: Date): Promise<PublicEvent[]> {
  const url = process.env.GCAL_ICS_URL;
  if (!url) return [];
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Calendar feed responded ${res.status}`);
    const data = ical.sync.parseICS(await res.text());
    const to = new Date(now.getTime() + LOOKAHEAD_DAYS * 86_400_000);
    const from = new Date(now.getTime() - 86_400_000); // include today's all-day events

    return Object.values(data)
      .filter((c): c is VEvent => c?.type === "VEVENT" && c.status !== "CANCELLED")
      .flatMap((ev) => ical.expandRecurringEvent(ev, { from, to }))
      .map((inst) => {
        const start = new Date(inst.start);
        const end = inst.end ? new Date(inst.end) : undefined;
        const location = text(inst.event.location);
        return {
          key: `${inst.event.uid}-${start.toISOString()}`,
          title: text(inst.summary) || "Pop-up",
          date: inst.isFullDay ? ymdLocal(start) : ymdInZone(start),
          time: inst.isFullDay ? undefined : timeRange(start, end),
          location: location ? shortLocation(location) : undefined,
          link: inst.event.url || undefined,
          sort: inst.isFullDay ? ymdLocal(start) : `${ymdInZone(start)}T${start.toISOString().slice(11)}`,
          endsAt: end ?? start,
        };
      })
      .filter((e) => (e.time ? e.endsAt > now : e.date >= ymdInZone(now)))
      .map(({ endsAt, ...e }) => (void endsAt, e));
  } catch (err) {
    // A broken feed should never break the page: log it and fall back to manual events only.
    console.error("[events] could not load calendar feed:", err);
    return [];
  }
}

/**
 * Upcoming public events from the Google Calendar feed (GCAL_ICS_URL) plus any added in Keystatic.
 * Cached for an hour, so new calendar entries show up within about an hour.
 */
export async function getUpcomingEvents(): Promise<PublicEvent[]> {
  "use cache";
  cacheLife("hours");

  const now = new Date();
  const today = ymdInZone(now);

  const manual: PublicEvent[] = (await getManualEvents())
    .filter((e) => e.date && e.date >= today && e.title)
    .map((e, i) => ({
      key: `manual-${i}-${e.date}`,
      title: e.title,
      date: e.date!,
      time: e.time || undefined,
      location: e.location || undefined,
      link: e.link || undefined,
      sort: e.date!,
    }));

  const fromCalendar = await getCalendarEvents(now);

  return [...manual, ...fromCalendar]
    .sort((a, b) => a.sort.localeCompare(b.sort))
    .slice(0, MAX_EVENTS);
}
