import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Heart, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Material, Upholstery } from "../backend.d";
import { ShowroomModal } from "../components/ShowroomModal";
import { useGetProductById, useRecordView } from "../hooks/useQueries";
import { useCart } from "../store/cartStore";
import { useWishlist } from "../store/wishlistStore";
import {
  formatINR,
  getCategoryLabel,
  getMaterialLabel,
  getProductImage,
  getRoomLabel,
  getUpholsteryLabel,
  isValidPincode,
} from "../utils/helpers";

export function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: product, isLoading, isError } = useGetProductById(id ?? "");
  const recordViewMutation = useRecordView();

  // biome-ignore lint/correctness/useExhaustiveDependencies: fire-and-forget on id change only
  useEffect(() => {
    if (id) {
      recordViewMutation.mutate({ productId: id });
    }
  }, [id]);

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );
  const [selectedUpholstery, setSelectedUpholstery] =
    useState<Upholstery | null>(null);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<
    "idle" | "valid" | "invalid"
  >("idle");
  const [showroomOpen, setShowroomOpen] = useState(false);
  const [cartError, setCartError] = useState("");

  const { addItem } = useCart();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    if (product.availableMaterials.length > 0 && !selectedMaterial) {
      setCartError("Please select a material.");
      return;
    }
    if (product.availableUpholstery.length > 0 && !selectedUpholstery) {
      setCartError("Please select an upholstery.");
      return;
    }
    setCartError("");
    addItem({
      productId: product.id,
      productName: product.name,
      material: selectedMaterial
        ? getMaterialLabel(selectedMaterial)
        : undefined,
      upholstery: selectedUpholstery
        ? getUpholsteryLabel(selectedUpholstery)
        : undefined,
      quantity: 1,
      priceSnapshotInr: product.priceInr,
    });
    toast.success(`${product.name} added to cart.`);
  };

  const handleCheckPincode = () => {
    if (isValidPincode(pincode)) {
      setPincodeResult("valid");
    } else {
      setPincodeResult("invalid");
    }
  };

  const handlePincodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheckPincode();
  };

  const materialOcids: Record<string, string> = {
    naturalTeak: "product.material_naturalteak.button",
    matteWalnut: "product.material_mattewalnut.button",
    charcoalAsh: "product.material_charcoalash.button",
  };

  const upholsteryOcids: Record<string, string> = {
    italianVelvet: "product.upholstery_velvet.button",
    performanceBoucle: "product.upholstery_boucle.button",
  };

  return (
    <main className="pt-16">
      {/* Breadcrumb */}
      <nav
        className="max-w-[1400px] mx-auto px-6 md:px-12 pt-8 pb-4"
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
          <li>
            <Link
              to="/"
              className="hover:text-foreground transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <ChevronRight size={12} />
          </li>
          <li>
            <Link
              to="/shop"
              className="hover:text-foreground transition-colors duration-200"
            >
              Shop
            </Link>
          </li>
          {product && (
            <>
              <li>
                <ChevronRight size={12} />
              </li>
              <li className="text-foreground">{product.name}</li>
            </>
          )}
        </ol>
      </nav>

      {/* Loading */}
      {isLoading && (
        <div
          data-ocid="product.loading_state"
          className="max-w-[1400px] mx-auto px-6 md:px-12 py-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <Skeleton className="aspect-square bg-stone" />
            <div className="space-y-6">
              <Skeleton className="h-3 w-24 bg-stone" />
              <Skeleton className="h-10 w-80 bg-stone" />
              <Skeleton className="h-px w-full bg-stone" />
              <Skeleton className="h-8 w-40 bg-stone" />
              <Skeleton className="h-20 w-full bg-stone" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          data-ocid="product.error_state"
          className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 text-center"
        >
          <p className="font-serif text-2xl text-foreground mb-3">
            Product not found
          </p>
          <p className="text-sm font-sans text-muted-foreground mb-8">
            This piece may no longer be available.
          </p>
          <Link
            to="/shop"
            className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            Browse the Collection
          </Link>
        </div>
      )}

      {/* Product detail */}
      {!isLoading && !isError && product && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — Image */}
            <div className="relative overflow-hidden bg-ivory aspect-square">
              <img
                src={getProductImage(product, 0)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right — Product Info */}
            <div className="space-y-8">
              {/* Category & Room */}
              <div className="flex items-center gap-3">
                <span className="text-eyebrow">
                  {getCategoryLabel(product.category)}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block" />
                <span className="text-eyebrow">
                  {getRoomLabel(product.room)}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Divider */}
              <div className="hairline-bottom" />

              {/* Price */}
              <p className="font-serif text-2xl text-foreground tracking-wide">
                {formatINR(product.priceInr)}
              </p>

              {/* Description */}
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Material Selector */}
              {product.availableMaterials.length > 0 && (
                <div>
                  <p className="text-eyebrow mb-4">Select Material</p>
                  <div className="flex flex-wrap gap-3">
                    {product.availableMaterials.map((mat) => (
                      <button
                        type="button"
                        key={mat}
                        data-ocid={
                          materialOcids[mat] ?? `product.material_${mat}.button`
                        }
                        onClick={() => setSelectedMaterial(mat)}
                        className={`material-pill ${selectedMaterial === mat ? "selected" : ""}`}
                      >
                        {getMaterialLabel(mat)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upholstery Selector */}
              {product.availableUpholstery.length > 0 && (
                <div>
                  <p className="text-eyebrow mb-4">Select Upholstery</p>
                  <div className="flex flex-wrap gap-3">
                    {product.availableUpholstery.map((up) => (
                      <button
                        type="button"
                        key={up}
                        data-ocid={
                          upholsteryOcids[up] ??
                          `product.upholstery_${up}.button`
                        }
                        onClick={() => setSelectedUpholstery(up)}
                        className={`material-pill ${selectedUpholstery === up ? "selected" : ""}`}
                      >
                        {getUpholsteryLabel(up)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Calculator */}
              <div className="border border-stone p-6">
                <p className="text-eyebrow mb-4">
                  Check Delivery to Your Pincode
                </p>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setPincodeResult("idle");
                    }}
                    onKeyDown={handlePincodeKeyDown}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    data-ocid="shipping.pincode.input"
                    className="border-stone rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground flex-1"
                  />
                  <button
                    type="button"
                    data-ocid="shipping.check.button"
                    onClick={handleCheckPincode}
                    className="px-6 h-11 bg-foreground text-background text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200 shrink-0"
                  >
                    Check
                  </button>
                </div>

                {/* Shipping result */}
                {pincodeResult === "valid" && (
                  <div
                    data-ocid="shipping.result.success_state"
                    className="mt-4 flex items-start gap-2 text-sm font-sans"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-foreground">
                      White-glove delivery available to {pincode}. Estimated 4–6
                      weeks.
                    </span>
                  </div>
                )}

                {pincodeResult === "invalid" && (
                  <div
                    data-ocid="shipping.result.error_state"
                    className="mt-4 flex items-start gap-2 text-sm font-sans"
                  >
                    <XCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-destructive"
                      strokeWidth={1.5}
                    />
                    <span className="text-destructive">
                      Please enter a valid 6-digit Indian pincode.
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Cart */}
              {cartError && (
                <p
                  data-ocid="product.cart.error_state"
                  className="text-xs font-sans text-destructive"
                >
                  {cartError}
                </p>
              )}

              <button
                type="button"
                data-ocid="product.add_to_cart.primary_button"
                onClick={handleAddToCart}
                className="w-full h-14 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
              >
                Add to Cart
              </button>

              {/* Wishlist toggle */}
              <button
                type="button"
                data-ocid="product.wishlist.toggle"
                onClick={() => product && toggleWishlist(product.id)}
                className="w-full h-12 flex items-center justify-center gap-3 border text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-200"
                style={{
                  borderColor: wishlisted
                    ? "oklch(0.52 0.18 22)"
                    : "oklch(0.82 0 0)",
                  color: wishlisted ? "oklch(0.45 0.18 22)" : "oklch(0.42 0 0)",
                }}
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  fill={wishlisted ? "currentColor" : "none"}
                />
                {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              {/* Book a Showroom Visit */}
              <button
                type="button"
                data-ocid="product.book_showroom.open_modal_button"
                onClick={() => setShowroomOpen(true)}
                className="w-full h-12 border border-foreground text-foreground text-xs tracking-[0.2em] uppercase font-sans hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Book a Showroom Visit
              </button>

              {/* Craftsmanship note */}
              <p className="text-xs font-sans text-muted-foreground leading-relaxed border-l-2 border-stone pl-4">
                All Western Edition pieces are handcrafted to order in our
                workshops across Rajasthan and South India. Lead time 8–12
                weeks. 10-year craftsmanship warranty included.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product not found (no data) */}
      {!isLoading && !isError && !product && (
        <div
          data-ocid="product.error_state"
          className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 text-center"
        >
          <p className="font-serif text-2xl text-foreground mb-3">
            Product not found
          </p>
          <Link
            to="/shop"
            className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors duration-200 inline-block mt-6"
          >
            Browse the Collection
          </Link>
        </div>
      )}

      <ShowroomModal
        open={showroomOpen}
        onOpenChange={setShowroomOpen}
        productName={product?.name}
      />
    </main>
  );
}
