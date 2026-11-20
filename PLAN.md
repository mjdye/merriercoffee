# Merrier Coffee — Build Plan

Mobile coffee cart site. One scrolling page like lowly.coffee: simple and airy, built around a **custom quote** request. No instant pricing anywhere.

## Stack (all free tiers)

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript + Tailwind | Static by default, hosts on your Vercel account |
| Content editing | **Keystatic** (git-based CMS) over Markdown/YAML in `content/` | Free and has no database. Files live in the repo, and you can edit them by hand. Your friend gets a simple admin UI at `/keystatic` (GitHub login) for menu, FAQs, about and events. Every save is a commit, and each commit triggers a Vercel redeploy. |
| Quote form → email | Next Server Action + **Resend** (free: 3k/mo, 100/day) | Sends to `info@merrier.coffee` with Reply-To set to the customer, so he can just hit reply |
| Spam protection | Honeypot field + **Cloudflare Turnstile** (free) | No ugly CAPTCHA |
| Events calendar | **Google Calendar public iCal feed** (dedicated "Merrier Public Events" calendar) | He adds events from his phone. The site fetches the feed with ISR (refreshes about hourly) and **hides the whole section when there are no upcoming events** |
| Images | `next/image`, photos exported from HEIC → JPG/WebP into `public/photos/` | |
| Domain | `merrier.coffee` → Vercel | DNS also needs Resend's SPF/DKIM records |

Fallback for the calendar: if he'd rather not use Google Calendar, an `events` collection in Keystatic works too. It's the same "hide if empty" logic, and he edits it in the admin UI instead of the calendar app.

## Page structure (single page + anchors)

Nav: **Events · How It Works · Menu · Book · FAQ** · IG/FB icons

1. **Hero**: script logo, "Making everyday a little Merrier", a short line ("A full espresso bar for your next event"), CTA "Get a Custom Quote" → #book, and a cart photo.
2. **Events we serve**: 4 cards (Weddings & showers, Corporate, Church & community, Private parties). Editable.
3. **How it works**: 3 steps: Tell us about your event → We send a personalized quote → We show up and pour. Copy stresses that *every event is different, so every quote is too*.
4. **Menu**: Coffee / Non-Coffee / Add-ons from `content/menu.yaml`. Milks: whole, oat, almond. **House-made syrups** is a seasonal list that hides itself if empty. Labeled "Current season" so it's easy to swap.
5. **Upcoming events** (conditional): next ~5 public events with date, name and town. The section isn't rendered at all when the feed is empty.
6. **About**: photo of him at the cart plus a short blurb (draft below, he can edit it).
7. **Photo strip**: 4–6 of his own photos, plus "Follow along @merrier_coffee" and links to IG and FB.
8. **Custom quote form** (#book).
9. **FAQ**: accordion from `content/faq.yaml`.
10. **Footer**: logo, tagline, service area, info@merrier.coffee, IG/FB, "Now booking 2027 dates".

### Quote form fields
Name*, Email*, Phone*, Event type* (select), Event date*, Start/end time of service*, Venue / address*, Estimated guests*, Indoor/outdoor (select), How did you hear about us? (select), Tell us about your event*. Submissions are validated server-side with zod. The success state reads: "Thanks! We'll be in touch with a personalized quote within X days."

### Draft FAQ (he can edit or add)
- What does a quote include? / Why don't you list prices?
- What's on the menu? Can we customize it or add a signature drink?
- Do you offer milk alternatives? (whole, oat, almond)
- Do you have non-coffee or decaf options?
- Do you do iced drinks?
- How much space and power does the cart need? Can you serve outdoors?
- How far in advance should we book?
- What area do you serve? Is there a travel fee?
- Is there a guest minimum or a minimum service time?
- Do you offer drink tickets, open bar, or guest-pay options?
- What's your deposit and cancellation policy?

## Visual direction
- Colors from his existing assets: cream `#FBF8F1` background, charcoal `#2B2B2B` text and logo, rust accent `#A4492A` (from the IG QR code). Optional dark sections in charcoal with cream script, like the logo card.
- Type: wide-tracked uppercase sans for headings (Lato or Montserrat, matching the "COFFEE" lockup) and a warm serif for body/tagline (e.g. Source Serif). Both from Google Fonts via `next/font`.
- The logo needs to be an **SVG** (or high-res transparent PNG). The current files are flattened images.
- Lots of whitespace, real photos only (no stock).
- The real cart is white shiplap with walnut-stained wood trim and a dark-brown round logo badge. That suggests adding a warm wood brown (`#6B3F24`-ish) as a secondary accent and using the **round badge** as the favicon and social avatar.

## Assets on hand (`assets/`, originals; optimized copies go to `public/` at build)
| File | Use |
|---|---|
| `photos/cart-front.jpg` | **Hero**: straight-on cart shot, blue sky, room to crop |
| `photos/cart-with-sign.jpg` | "How it works" or events section |
| `photos/latte-espresso-machine.jpg`, `photos/latte-grinders.jpg` | Menu section / photo strip |
| `photos/owner-headshot.jpg` | About |
| `photos/latte-pour-small.jpg` | Too small (311×553) for anything but a thumbnail; ask for the original |
| `brand/logo-*.jpg` | Reference for tracing an SVG logo until a source file shows up |
| `brand/menu-board.jpg`, `brand/socials-card.jpg` | Reference for menu content and typography |

Things the photos reveal (worth confirming):
- **Payments run through Square**, so guest-pay events are possible.
- **This season's syrups** are handwritten on the A-frame (looks like peppermint mocha, gingerbread, eggnog, vanilla). We should confirm the list.
- The cart runs off a power cord, which matters for the power FAQ.
- A Georgia flag suggests a GA service area.

Logo plan: trace the cream-on-charcoal logo into a clean SVG (script "Merrier" + "COFFEE" lockup, one color, so it can be recolored). Ask whoever designed it for the original first.

## Repo layout
```
app/            page.tsx, layout.tsx, actions/quote.ts, keystatic/, api/keystatic/
components/     Hero, EventTypes, HowItWorks, Menu, UpcomingEvents, About, Gallery, QuoteForm, Faq, Footer
content/        site.yaml, menu.yaml, faq.yaml, about.md, event-types.yaml
lib/            calendar.ts (iCal fetch + parse, future events only), content.ts
public/         logo.svg, photos/, og.jpg
keystatic.config.ts
```

## Build order
1. Scaffold Next + Tailwind + fonts + color tokens; add the logo and photos.
2. Content files + Keystatic config; render all static sections from content.
3. Quote form with Server Action, Resend, Turnstile and honeypot; test with Resend's sandbox sender.
4. Calendar: iCal fetch and parse (`node-ical`), ISR revalidate 3600, hidden when empty.
5. SEO: metadata, OG image, `LocalBusiness` JSON-LD, sitemap.
6. Deploy to Vercel. Env vars: `RESEND_API_KEY`, `TURNSTILE_*`, `GCAL_ICS_URL`, `KEYSTATIC_GITHUB_*`. Then hook up the domain and Resend DNS.

## Draft About blurb (for him to tweak)
> Merrier started with a simple idea: good coffee makes any gathering better. We bring a full espresso bar to weddings, offices, churches and backyard parties, pulling every shot and steaming every latte on site. Whether it's a quiet morning meeting or a 200-guest celebration, our goal is the same: making everyday a little Merrier.

---

## Questions for the owner
1. **Service area**: home city, and how far will you travel? Is there a travel fee?
2. **Event types**: which do you want to highlight (weddings, corporate, church, private, markets/pop-ups)?
3. **Minimums**: a guest count or service-hour minimum? Max guests you can handle?
4. **Cart specs**: footprint, power needs (standard outlet? generator?), indoor/outdoor OK?
5. **Booking**: lead time, deposit, cancellation policy? How fast do you reply to quote requests?
6. **Payment models**: host-paid open bar, drink tickets, guests pay, or a mix?
7. **Menu**: iced versions available? Decaf? Current season's syrups? Will you do custom signature drinks for events?
8. **Facebook URL** (only IG is on the cards).
9. **Logo source file**: is there an SVG/AI/PDF version?
10. **Photos**: OK to use the ones you sent? Any of events in action, or people you need permission from?
11. **Testimonials**: any reviews or texts from past clients we can quote?
12. **Calendar**: OK to use a Google Calendar? Should public listings show client/event names, or just "Private event · Town"?
13. **"How did you hear about us"** options you want to track.
14. **Domain/email**: who controls `merrier.coffee` DNS, and where does `info@merrier.coffee` mailbox live?
15. **About**: is the draft blurb above close? Your name/first name on the site or not?
16. **The pour video/photo**: can you send the full-resolution original?
