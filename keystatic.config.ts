import { config, fields, singleton } from "@keystatic/core";

// Production: GitHub mode, so saves at /keystatic become commits to this repo and Vercel redeploys.
// Development: local mode (edits write straight to content/), unless you start the dev server with
// NEXT_PUBLIC_KEYSTATIC_STORAGE=github, which is how you run the one-time GitHub App setup (see README).
const repo = (process.env.NEXT_PUBLIC_KEYSTATIC_REPO ?? "mjdye/merriercoffee") as `${string}/${string}`;
const useGitHub =
  process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

export default config({
  storage: useGitHub ? { kind: "github", repo } : { kind: "local" },
  ui: {
    brand: { name: "Merrier Coffee" },
    navigation: {
      "Site": ["site", "about"],
      "What we offer": ["menu", "eventTypes", "faq"],
      "Calendar": ["events"],
    },
  },
  singletons: {
    site: singleton({
      label: "Site settings",
      path: "content/site",
      format: { data: "yaml" },
      schema: {
        tagline: fields.text({ label: "Tagline", defaultValue: "Making everyday a little Merrier" }),
        heroHeading: fields.text({ label: "Hero heading" }),
        heroText: fields.text({ label: "Hero text", multiline: true }),
        serviceArea: fields.text({
          label: "Service area",
          description: "Shown in the hero and footer. Leave blank to hide.",
        }),
        email: fields.text({ label: "Contact email", defaultValue: "info@merrier.coffee" }),
        instagram: fields.url({ label: "Instagram URL" }),
        facebook: fields.url({ label: "Facebook URL", description: "Leave blank to hide." }),
        bookingNote: fields.text({
          label: "Booking note",
          description: 'Footer line, e.g. "Now booking 2027 dates". Leave blank to hide.',
        }),
        responseTime: fields.text({
          label: "Quote response time",
          description: 'Shown after someone sends the form, e.g. "within 2 business days".',
        }),
      },
    }),
    about: singleton({
      label: "About",
      path: "content/about",
      format: { data: "yaml" },
      schema: {
        heading: fields.text({ label: "Heading" }),
        body: fields.text({
          label: "Body",
          multiline: true,
          description: "Leave a blank line between paragraphs.",
        }),
      },
    }),
    menu: singleton({
      label: "Menu",
      path: "content/menu",
      format: { data: "yaml" },
      schema: {
        showPrices: fields.checkbox({
          label: "Show prices on the website",
          description: "Off by default so visitors don't read menu prices as event pricing.",
          defaultValue: false,
        }),
        sections: fields.array(
          fields.object({
            title: fields.text({ label: "Section title" }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: "Drink" }),
                price: fields.text({ label: "Price", description: "e.g. 4.00" }),
              }),
              { label: "Items", itemLabel: (p) => p.fields.name.value },
            ),
          }),
          { label: "Menu sections", itemLabel: (p) => p.fields.title.value },
        ),
        milks: fields.text({ label: "Milk options", defaultValue: "Whole, oat & almond milk available" }),
        syrupsLabel: fields.text({ label: "Syrups heading", defaultValue: "House-made syrups" }),
        syrups: fields.array(fields.text({ label: "Syrup" }), {
          label: "This season's syrups",
          description: "Change these each season. The list hides itself when empty.",
          itemLabel: (p) => p.value,
        }),
      },
    }),
    eventTypes: singleton({
      label: "Event types",
      path: "content/event-types",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Title" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          { label: "Event types", itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),
    faq: singleton({
      label: "FAQ",
      path: "content/faq",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            question: fields.text({ label: "Question" }),
            answer: fields.text({ label: "Answer", multiline: true }),
          }),
          { label: "Questions", itemLabel: (p) => p.fields.question.value },
        ),
      },
    }),
    events: singleton({
      label: "Public events",
      path: "content/events",
      format: { data: "yaml" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Event name" }),
            date: fields.date({ label: "Date", validation: { isRequired: true } }),
            time: fields.text({ label: "Time", description: 'Optional, e.g. "8am–12pm"' }),
            location: fields.text({ label: "Location", description: "Optional, e.g. town or venue" }),
            link: fields.url({ label: "Link", description: "Optional event page" }),
          }),
          {
            label: "Upcoming public events",
            description:
              "Events also come from the Google Calendar feed if one is connected. Past events hide automatically, and the section hides when nothing is upcoming.",
            itemLabel: (p) => `${p.fields.date.value ?? ""} · ${p.fields.title.value}`,
          },
        ),
      },
    }),
  },
});
