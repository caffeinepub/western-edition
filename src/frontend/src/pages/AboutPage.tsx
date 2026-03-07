import { Link } from "@tanstack/react-router";

export function AboutPage() {
  const stats = [
    { value: "15+", label: "Years of Craft" },
    { value: "200+", label: "Designs Created" },
    { value: "Pan-India", label: "White-Glove Delivery" },
  ];

  return (
    <main className="pt-16">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ height: "60vh", minHeight: "400px" }}
      >
        <img
          src="/assets/generated/about-craftsmanship.dim_1200x800.jpg"
          alt="Indian artisan crafting furniture"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 60%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase font-sans mb-4"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-white">
            Made in India. Made to Last.
          </h1>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 md:py-28 px-6">
        <article className="max-w-[720px] mx-auto">
          {/* Philosophy */}
          <div className="mb-16">
            <div className="section-divider mb-10">
              <h2 className="font-serif text-3xl text-foreground px-6 whitespace-nowrap">
                Our Philosophy
              </h2>
            </div>
            <div className="space-y-5 text-base font-sans leading-relaxed text-muted-foreground">
              <p>
                Western Edition was born from a single conviction: that Indian
                homes deserve furniture as thoughtfully designed as any piece
                from Milan or Copenhagen — with the warmth and materiality of
                Indian craft at its soul.
              </p>
              <p>
                We draw our design language from the quiet grandeur of Indian
                architecture: the clean geometry of Mughal jali screens, the
                honest joinery of Kerala's teak houses, the contemplative
                serenity of Chandigarh's modernist legacy.
              </p>
              <p>
                Every material we use is sustainably sourced from Indian forests
                — certified teak from Kerala, walnut from Himachal Pradesh, ash
                from the Western Ghats — and worked by master craftsmen who have
                inherited their skills across generations.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hairline-bottom mb-16" />

          {/* The Craft */}
          <div className="mb-16">
            <div className="section-divider mb-10">
              <h2 className="font-serif text-3xl text-foreground px-6 whitespace-nowrap">
                The Craft
              </h2>
            </div>
            <div className="space-y-5 text-base font-sans leading-relaxed text-muted-foreground">
              <p>
                Our production centres are located in Jodhpur, Rajasthan and
                Mysuru, Karnataka — two of India's most storied furniture-making
                traditions. Each workshop is a partnership, not a factory: we
                work with master artisans (karigar) who have refined their craft
                over 20, 30, even 40 years.
              </p>
              <p>
                Every surface is hand-sanded through seven progressive grits.
                Joints are hand-cut and fitted for a tolerance of under half a
                millimetre. Finishing — whether natural oil, wax, or lacquer —
                is applied by hand in five coats, each buffed to a perfect
                sheen.
              </p>
              <p>
                All Western Edition furniture comes with our 10-Year
                Craftsmanship Warranty. If a joint loosens, a surface chips, or
                any structural issue arises from workmanship within a decade of
                purchase, we will repair or replace it — at no cost to you.
              </p>
            </div>
          </div>

          {/* Feature callout */}
          <blockquote className="border-l-2 border-foreground pl-8 py-2 mb-16">
            <p className="font-serif text-xl text-foreground leading-relaxed">
              "We believe a truly beautiful object does not announce itself — it
              simply belongs."
            </p>
            <cite className="mt-4 block text-xs tracking-[0.2em] uppercase font-sans text-muted-foreground not-italic">
              — Priya Nair, Founder & Creative Director
            </cite>
          </blockquote>
        </article>
      </section>

      {/* Stats Bar */}
      <section className="hairline-top hairline-bottom">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-12 md:py-16 text-center ${
                  i < stats.length - 1 ? "md:border-r border-stone" : ""
                } ${i > 0 ? "border-t md:border-t-0 border-stone" : ""}`}
              >
                <p className="font-serif text-4xl md:text-5xl text-foreground mb-3">
                  {stat.value}
                </p>
                <p className="text-eyebrow">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 text-center">
        <p className="text-eyebrow mb-4">Explore the Range</p>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8 max-w-lg mx-auto leading-tight">
          Experience the Collection
        </h2>
        <p className="text-sm font-sans text-muted-foreground max-w-md mx-auto mb-12 leading-relaxed">
          Each piece is available to view and experience in our Mumbai showroom,
          and delivered with white-glove installation across India.
        </p>
        <Link
          to="/shop"
          data-ocid="about.shop_link"
          className="inline-block px-12 py-4 text-xs tracking-[0.2em] uppercase font-sans bg-foreground text-background hover:bg-foreground/80 transition-colors duration-200"
        >
          Shop the Collection
        </Link>
      </section>
    </main>
  );
}
