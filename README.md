# Merrier Coffee

Website for Merrier Coffee, a mobile espresso cart. Next.js 16 (App Router, Cache Components) + Tailwind 4, hosted on Vercel. Everything runs on free tiers.

```bash
npm install
npm run dev        # http://localhost:3000, editor at http://localhost:3000/keystatic
```

## Editing content

All copy lives in `content/*.yaml`. You can edit those files directly, or use the Keystatic editor at `/keystatic`:

| File | What it holds |
|---|---|
| `content/site.yaml` | Hero text, tagline, service area, email, Instagram/Facebook links, booking note |
| `content/menu.yaml` | Menu sections, milk options, **seasonal syrups** (hidden when empty), `showPrices` toggle |
| `content/event-types.yaml` | The "Events we serve" cards (also used as the form's event-type options) |
| `content/faq.yaml` | FAQ questions and answers |
| `content/about.yaml` | About heading and blurb (blank line = new paragraph) |
| `content/events.yaml` | Manually added public events (optional; see Calendar) |

Blank optional fields hide their UI (e.g. no Facebook URL → no Facebook icon).

## Quote form

`app/actions.ts` validates the form and emails it to `QUOTE_TO_EMAIL` (default `info@merrier.coffee`) via [Resend](https://resend.com), with Reply-To set to the customer. With no `RESEND_API_KEY` in development, it logs the email to the terminal instead. Spam protection is a honeypot field, plus optional Cloudflare Turnstile when its keys are set.

## Calendar

The "Upcoming pop-ups" section merges events from a Google Calendar feed (`GCAL_ICS_URL`) and `content/events.yaml`. Past events drop off automatically, and **the section isn't rendered at all when nothing is upcoming**. The page refreshes the feed about once an hour.

To set it up: create a dedicated Google Calendar (e.g. "Merrier Public Events"). In its settings → *Integrate calendar*, copy the **Public address in iCal format** (make the calendar public) or the **Secret address in iCal format**, and set it as `GCAL_ICS_URL`. Event title, time and location (shortened to venue · town) are shown.

## Images and logo

Originals are in `assets/`. `node scripts/prepare-assets.mjs` (needs `brew install potrace`) resizes photos into `public/photos/`, traces the logo into a recolorable `public/logo.svg`, and builds the round-badge favicon (`app/icon.svg`, `app/apple-icon.png`). Replace the traced logo with the designer's original SVG if one turns up.

## Deploying (Vercel)

1. Import the repo into Vercel. Copy the variables from `.env.example` into the project's environment variables.
2. **Resend:** add and verify the `merrier.coffee` domain (DNS records), create an API key, and set `QUOTE_FROM_EMAIL` to an address on that domain.
3. **Keystatic in production** (one-time setup; the repo `mjdye/merriercoffee` is already set in `keystatic.config.ts`):
   1. Push this repo to GitHub.
   2. Locally, run `NEXT_PUBLIC_KEYSTATIC_STORAGE=github npm run dev`, open http://localhost:3000/keystatic and click **Create GitHub App**. Keystatic creates the app and writes `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` and `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` to `.env` (gitignored). Install the app on the `merriercoffee` repo when GitHub asks.
   3. Copy those four values into Vercel's environment variables.
   4. In the GitHub App's settings (GitHub → Settings → Developer settings → GitHub Apps), add the production callback URL `https://merrier.coffee/api/keystatic/github/oauth/callback`, plus the `*.vercel.app` one if you'll edit from there.
   5. Add the owner as a collaborator on the repo (he needs a free GitHub account). He then signs in at `merrier.coffee/keystatic`, and every Save becomes a commit that Vercel deploys in about a minute.
4. Point the `merrier.coffee` domain at Vercel.
