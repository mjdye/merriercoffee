import { createReader } from "@keystatic/core/reader";
import { cacheLife } from "next/cache";
import keystaticConfig from "../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

// Content only changes on deploy in production, so cache it for good there.
// In dev, use a one-minute revalidate so edits made at /keystatic show up within about a minute.
// (Shorter lifetimes make Next.js treat the page as dynamic, which doesn't match production.)
function contentCache() {
  if (process.env.NODE_ENV === "development") cacheLife("minutes");
  else cacheLife("max");
}

export async function getSite() {
  "use cache";
  contentCache();
  const site = await reader.singletons.site.readOrThrow();
  return site;
}

export async function getAbout() {
  "use cache";
  contentCache();
  const about = await reader.singletons.about.readOrThrow();
  return {
    heading: about.heading,
    paragraphs: about.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
  };
}

export async function getMenu() {
  "use cache";
  contentCache();
  return reader.singletons.menu.readOrThrow();
}

export async function getEventTypes() {
  "use cache";
  contentCache();
  return (await reader.singletons.eventTypes.readOrThrow()).items;
}

export async function getFaq() {
  "use cache";
  contentCache();
  return (await reader.singletons.faq.readOrThrow()).items;
}

export async function getManualEvents() {
  "use cache";
  contentCache();
  return (await reader.singletons.events.read())?.items ?? [];
}
