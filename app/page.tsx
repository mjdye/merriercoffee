import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/brand";
import { About, EventTypes, Faq, Footer, Header, Hero, HowItWorks, MenuSection, UpcomingEvents } from "@/components/sections";
import { getAbout, getEventTypes, getFaq, getMenu, getSite } from "@/lib/content";
import { getUpcomingEvents } from "@/lib/events";

export default async function Home() {
  const [site, about, menu, eventTypes, faq, events] = await Promise.all([
    getSite(),
    getAbout(),
    getMenu(),
    getEventTypes(),
    getFaq(),
    getUpcomingEvents(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Merrier Coffee",
    description: site.heroText,
    email: site.email,
    url: "https://merrier.coffee",
    servesCuisine: "Coffee",
    ...(site.serviceArea && { areaServed: site.serviceArea }),
    sameAs: [site.instagram, site.facebook].filter(Boolean),
  };

  return (
    <>
      <Header site={site} />
      <main>
        <Hero site={site} />
        <EventTypes items={eventTypes} />
        <HowItWorks />
        <MenuSection menu={menu} />
        <UpcomingEvents events={events} site={site} />
        <About about={about} />
        <section id="quote" className="bg-cream-dark/60">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
            <SectionHeading eyebrow="Custom quote" title="Let's make your event a little Merrier" align="center" />
            <p className="mx-auto mt-5 mb-12 max-w-2xl text-center font-serif text-lg leading-relaxed text-ink-soft">
              Every event is different, so we don&apos;t do one-size-fits-all pricing. Tell us about yours and
              we&apos;ll send back a quote made just for you.
            </p>
            <QuoteForm eventTypes={eventTypes.map((t) => t.title)} email={site.email} responseTime={site.responseTime} />
          </div>
        </section>
        <Faq items={faq} />
      </main>
      <Footer site={site} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
