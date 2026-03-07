import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "../backend.d";
import { Category, Material, Room, Upholstery } from "../backend.d";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { ProductCard } from "../components/ProductCard";
import { ShowroomModal } from "../components/ShowroomModal";
import { useGetMostLoved, useGetNewArrivals } from "../hooks/useQueries";

// Fallback product data for when backend is loading/empty
const fallbackProducts: Product[] = [
  {
    id: "sofa-1",
    name: "Ravi Low Profile Sofa",
    category: Category.sofa,
    room: Room.living,
    priceInr: BigInt(285000),
    description: "A sculptural three-seater with natural teak legs.",
    availableMaterials: [Material.naturalTeak],
    availableUpholstery: [Upholstery.performanceBoucle],
    isNewArrival: true,
  },
  {
    id: "dining-1",
    name: "Teak Slab Dining Table",
    category: Category.diningTable,
    room: Room.dining,
    priceInr: BigInt(420000),
    description: "Solid natural teak slab with matte black legs.",
    availableMaterials: [Material.naturalTeak],
    availableUpholstery: [],
    isNewArrival: true,
  },
  {
    id: "bed-1",
    name: "Ananta Platform Bed",
    category: Category.bed,
    room: Room.bedroom,
    priceInr: BigInt(195000),
    description: "Low platform bed in charcoal ash wood.",
    availableMaterials: [Material.charcoalAsh],
    availableUpholstery: [Upholstery.italianVelvet],
    isNewArrival: true,
  },
  {
    id: "media-1",
    name: "Arjuna Media Console",
    category: Category.mediaUnit,
    room: Room.living,
    priceInr: BigInt(138000),
    description: "Wall-mounted media unit in matte walnut.",
    availableMaterials: [Material.matteWalnut],
    availableUpholstery: [],
    isNewArrival: true,
  },
];

export function HomePage() {
  const { data: newArrivals, isLoading } = useGetNewArrivals();
  const { data: mostLoved, isLoading: mostLovedLoading } = useGetMostLoved(6);
  const [showroomOpen, setShowroomOpen] = useState(false);
  const navigate = useNavigate();

  const rooms = [
    {
      label: "Living Room",
      ocid: "categories.living_link",
      img: "/assets/generated/product-sofa-2.dim_800x800.jpg",
      room: "living",
    },
    {
      label: "Bedroom",
      ocid: "categories.bedroom_link",
      img: "/assets/generated/product-bed-1.dim_800x800.jpg",
      room: "bedroom",
    },
    {
      label: "Dining Room",
      ocid: "categories.dining_link",
      img: "/assets/generated/product-dining-1.dim_800x800.jpg",
      room: "dining",
    },
    {
      label: "Decor",
      ocid: "categories.decor_link",
      img: "/assets/generated/product-decor-1.dim_800x800.jpg",
      room: "decor",
    },
  ];

  const ocids = [
    "new_arrivals.item.1",
    "new_arrivals.item.2",
    "new_arrivals.item.3",
    "new_arrivals.item.4",
  ];

  const mostLovedOcids = [
    "most_loved.item.1",
    "most_loved.item.2",
    "most_loved.item.3",
    "most_loved.item.4",
    "most_loved.item.5",
    "most_loved.item.6",
  ];

  const displayProducts = (
    newArrivals && newArrivals.length > 0 ? newArrivals : fallbackProducts
  ).slice(0, 4);

  const displayMostLoved = (
    mostLoved && mostLoved.length > 0 ? mostLoved : fallbackProducts
  ).slice(0, 6);

  return (
    <main>
      {/* ── Hero — asymmetric editorial layout ────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: "620px" }}
      >
        <img
          src="/assets/generated/hero-living.dim_1600x900.jpg"
          alt="Western Edition luxury living room"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Left-side gradient — darkens left edge for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.05) 100%)",
          }}
        />
        {/* Bottom vignette — subtle */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.25), transparent)",
          }}
        />

        {/* Editorial number — top-right, large, ghosted */}
        <span
          className="absolute top-24 right-10 md:right-16 hidden md:block font-serif select-none pointer-events-none"
          style={{
            fontSize: "clamp(6rem, 12vw, 11rem)",
            color: "rgba(255,255,255,0.06)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          01
        </span>

        {/* Text block — bottom-left, not centred */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-14 md:pb-20 max-w-3xl">
          {/* Eyebrow with thin rule */}
          <div className="flex items-center gap-4 mb-7">
            <span
              className="h-px w-8 shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
            />
            <p
              className="text-[10px] tracking-[0.35em] uppercase"
              style={{
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                color: "rgba(255,255,255,0.65)",
              }}
            >
              Western Edition · Est. 2009
            </p>
          </div>

          <h1
            className="font-serif text-white leading-[1.06]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)" }}
          >
            Architectural
            <br />
            Minimalism for the
            <br />
            Modern Indian Home
          </h1>

          {/* CTA — text-link with arrow, not a box-button */}
          <div className="mt-10 flex items-center gap-6">
            <Link
              to="/shop"
              data-ocid="hero.primary_button"
              className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-white transition-opacity duration-300 hover:opacity-65"
              style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
            >
              <span
                className="h-px transition-all duration-400 group-hover:w-10"
                style={{ width: "2rem", backgroundColor: "white" }}
              />
              Explore the Collection
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Shop by Room ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="section-divider mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground whitespace-nowrap px-6">
            Shop by Room
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 md:-mx-12 md:px-12 snap-x snap-mandatory">
          {rooms.map((room) => (
            <button
              type="button"
              key={room.ocid}
              data-ocid={room.ocid}
              onClick={() =>
                navigate({ to: "/shop", search: { room: room.room } })
              }
              className="group relative overflow-hidden flex-shrink-0 w-64 md:w-72 aspect-square block snap-start"
            >
              <img
                src={room.img}
                alt={room.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
                loading="lazy"
              />
              {/* Gradient — stronger at bottom */}
              <div
                className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 55%)",
                }}
              />
              {/* Text — slides up on hover */}
              <div className="absolute bottom-0 left-0 right-0 px-7 pb-7 text-left transition-transform duration-500 group-hover:-translate-y-1">
                <p
                  className="text-[9px] tracking-[0.3em] uppercase mb-2 transition-opacity duration-300"
                  style={{
                    fontFamily: "'Helvetica Neue', Arial, sans-serif",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  Explore
                </p>
                <h3 className="font-serif text-[1.4rem] text-white leading-tight">
                  {room.label}
                </h3>
                {/* Arrow appears on hover */}
                <p
                  className="text-white text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
                >
                  →
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="section-divider mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground whitespace-nowrap px-6">
            New Arrivals
          </h2>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <Skeleton className="aspect-square w-72 bg-stone" />
                <Skeleton className="h-3 w-16 mt-4 bg-stone" />
                <Skeleton className="h-5 w-48 mt-2 bg-stone" />
                <Skeleton className="h-4 w-24 mt-2 bg-stone" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-4">
            {displayProducts.map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
                <ProductCard product={product} index={i} ocid={ocids[i]} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Most Loved ────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="section-divider mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground whitespace-nowrap px-6">
            Most Loved
          </h2>
        </div>

        {mostLovedLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-shrink-0 w-72">
                <Skeleton className="aspect-square w-72 bg-stone" />
                <Skeleton className="h-3 w-16 mt-4 bg-stone" />
                <Skeleton className="h-5 w-48 mt-2 bg-stone" />
                <Skeleton className="h-4 w-24 mt-2 bg-stone" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-4">
            {displayMostLoved.map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-64 md:w-72">
                <ProductCard
                  product={product}
                  index={i}
                  ocid={mostLovedOcids[i]}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── The Western Edition Transformation ───────────────── */}
      <section className="py-16 md:py-28 px-4 md:px-12 max-w-[1400px] mx-auto">
        <div className="section-divider mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground px-6">
            The Western Edition
            <br />
            <span className="pl-6 md:pl-10">Transformation</span>
          </h2>
        </div>
        <BeforeAfterSlider
          beforeSrc="/assets/uploads/Picsart_26-03-08_03-23-38-894-1.jpg"
          afterSrc="/assets/uploads/Picsart_26-03-08_03-23-56-221-2.jpg"
          beforeLabel="Before"
          afterLabel="After"
        />
      </section>

      {/* ── Lead CTA Banner ───────────────────────────────────── */}
      <section
        className="py-20 md:py-24 px-6 text-center hairline-top"
        style={{ backgroundColor: "oklch(0.975 0.004 75)" }}
      >
        <p className="text-eyebrow mb-5">By Appointment</p>
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-6 max-w-xl mx-auto leading-snug">
          Experience the Collection in Our Mumbai Showroom
        </h2>
        <p
          className="text-sm max-w-sm mx-auto mb-10 leading-relaxed"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "oklch(0.52 0 0)",
          }}
        >
          Our design consultants are ready to help you select, customise, and
          curate the perfect pieces for your home.
        </p>
        <button
          type="button"
          onClick={() => setShowroomOpen(true)}
          className="group inline-flex items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-foreground transition-opacity duration-200 hover:opacity-50"
          style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
        >
          <span className="h-px w-8 bg-foreground transition-all duration-400 group-hover:w-12" />
          Book a Showroom Visit
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </section>

      <ShowroomModal open={showroomOpen} onOpenChange={setShowroomOpen} />
    </main>
  );
}
