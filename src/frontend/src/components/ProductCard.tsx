import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "../backend.d";
import { useWishlist } from "../store/wishlistStore";
import { formatINR, getCategoryLabel, getProductImage } from "../utils/helpers";

interface ProductCardProps {
  product: Product;
  index?: number;
  ocid?: string;
}

export function ProductCard({ product, index = 0, ocid }: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      data-ocid={ocid}
      className="group block"
    >
      {/* Image container — warm ivory ground, reveal overlay on hover */}
      <div
        className="relative overflow-hidden aspect-square"
        style={{ backgroundColor: "oklch(0.975 0.006 75)" }}
      >
        {/* Wishlist heart */}
        <button
          type="button"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white transition-all duration-200"
          style={{ backdropFilter: "blur(4px)" }}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            fill={wishlisted ? "currentColor" : "none"}
            style={{
              color: wishlisted ? "oklch(0.52 0.18 22)" : "oklch(0.45 0 0)",
            }}
          />
        </button>
        <img
          src={getProductImage(product, index)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Hover overlay — slides up from bottom */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-5 transition-all duration-400"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
            opacity: 0,
            transform: "translateY(6px)",
          }}
          aria-hidden="true"
        >
          <span
            className="text-white text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            View Piece
          </span>
          <span className="text-white text-sm" aria-hidden="true">
            →
          </span>
        </div>

        {/* CSS hover state via sibling trick — apply via group */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-5 opacity-0 group-hover:opacity-100 transition-all duration-400 group-hover:translate-y-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)",
            transform: "translateY(4px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <span
            className="text-white text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            View Piece
          </span>
          <span className="text-white text-sm leading-none">→</span>
        </div>
      </div>

      {/* Info — tighter, more editorial */}
      <div className="pt-4 pb-1">
        {/* Category with flanking rule */}
        <div className="flex items-center gap-3 mb-2.5">
          <span
            className="h-px flex-shrink-0 w-4"
            style={{ backgroundColor: "oklch(0.75 0 0)" }}
          />
          <p
            className="text-[9px] tracking-[0.28em] uppercase flex-shrink-0"
            style={{
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              color: "oklch(0.62 0 0)",
            }}
          >
            {getCategoryLabel(product.category)}
          </p>
        </div>

        {/* Product name — Playfair, slightly larger, with gentle hover shift */}
        <h3
          className="font-serif text-[17px] leading-snug text-foreground transition-opacity duration-300 group-hover:opacity-55"
          style={{ letterSpacing: "0.01em" }}
        >
          {product.name}
        </h3>

        {/* Price — lighter, tracked, separated */}
        <p
          className="mt-2 text-[12px] tracking-[0.08em]"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: "oklch(0.48 0 0)",
          }}
        >
          {formatINR(product.priceInr)}
        </p>
      </div>
    </Link>
  );
}
