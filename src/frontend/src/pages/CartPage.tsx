import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Category, Room } from "../backend.d";
import type { Product } from "../backend.d";
import { useAuth } from "../store/authStore";
import { useCart } from "../store/cartStore";
import { formatINR } from "../utils/helpers";
import { getProductImage } from "../utils/helpers";

function getCartItemImage(productId: string, index: number): string {
  // Try to build a minimal product stub to get the image
  const stub = {
    id: productId,
    category: Category.sofa,
    room: Room.living,
    name: "",
    description: "",
    isNewArrival: false,
    availableMaterials: [],
    availableUpholstery: [],
    priceInr: BigInt(0),
  } satisfies Product;
  return getProductImage(stub, index);
}

export function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10">
          <p className="text-eyebrow mb-3">Your Selection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Cart
            {itemCount > 0 && (
              <span
                className="ml-4 font-sans text-lg"
                style={{ color: "oklch(0.55 0 0)" }}
              >
                ({itemCount} {itemCount === 1 ? "piece" : "pieces"})
              </span>
            )}
          </h1>
        </div>

        {/* Login notice */}
        {!isLoggedIn && items.length > 0 && (
          <div
            data-ocid="cart.login_notice.panel"
            className="mb-8 p-5 border"
            style={{
              borderColor: "oklch(0.85 0.01 75)",
              backgroundColor: "oklch(0.985 0.003 75)",
            }}
          >
            <p
              className="text-sm font-sans mb-3"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              Log in to save your cart and place orders.
            </p>
            <Link
              to="/account"
              data-ocid="cart.login.button"
              className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-6 py-2.5 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              Log In / Register
            </Link>
          </div>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <div data-ocid="cart.empty_state" className="py-24 text-center">
            <ShoppingBag
              size={48}
              strokeWidth={1}
              className="mx-auto mb-6"
              style={{ color: "oklch(0.75 0 0)" }}
            />
            <h2
              className="font-serif text-2xl mb-3"
              style={{ color: "oklch(0.35 0 0)" }}
            >
              Your cart is empty
            </h2>
            <p
              className="text-sm font-sans mb-8"
              style={{ color: "oklch(0.6 0 0)" }}
            >
              Discover our collection of handcrafted luxury furniture.
            </p>
            <Link
              to="/shop"
              data-ocid="cart.shop.link"
              className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
            >
              Explore the Collection
            </Link>
          </div>
        )}

        {/* Cart content */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
            {/* Items list */}
            <div>
              <div
                className="pb-4 mb-2"
                style={{ borderBottom: "1px solid oklch(0.88 0.003 75)" }}
              >
                <div
                  className="grid grid-cols-[1fr_auto_auto] gap-6 text-[10px] tracking-[0.2em] uppercase font-sans"
                  style={{ color: "oklch(0.6 0 0)" }}
                >
                  <span>Product</span>
                  <span className="w-24 text-center hidden sm:block">Qty</span>
                  <span className="w-24 text-right">Total</span>
                </div>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: "oklch(0.93 0.002 75)" }}
              >
                {items.map((item, i) => (
                  <div
                    key={`${item.productId}-${item.material}-${item.upholstery}`}
                    data-ocid={`cart.item.${i + 1}`}
                    className="py-8 grid grid-cols-[auto_1fr_auto] gap-6 items-start"
                  >
                    {/* Image */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden flex-shrink-0"
                      style={{ backgroundColor: "oklch(0.97 0.005 75)" }}
                    >
                      <img
                        src={getCartItemImage(item.productId, i)}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <h3 className="font-serif text-base text-foreground leading-snug">
                        {item.productName}
                      </h3>
                      {item.material && (
                        <p
                          className="text-xs font-sans"
                          style={{ color: "oklch(0.58 0 0)" }}
                        >
                          Material: {item.material}
                        </p>
                      )}
                      {item.upholstery && (
                        <p
                          className="text-xs font-sans"
                          style={{ color: "oklch(0.58 0 0)" }}
                        >
                          Upholstery: {item.upholstery}
                        </p>
                      )}
                      <p
                        className="text-xs font-sans mt-1"
                        style={{ color: "oklch(0.48 0 0)" }}
                      >
                        {formatINR(item.priceSnapshotInr)} / piece
                      </p>

                      {/* Quantity controls — mobile */}
                      <div className="flex items-center gap-3 mt-3 sm:hidden">
                        <button
                          type="button"
                          data-ocid={`cart.item.${i + 1}`}
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border hover:bg-foreground hover:text-background transition-colors duration-200"
                          style={{ borderColor: "oklch(0.82 0 0)" }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border hover:bg-foreground hover:text-background transition-colors duration-200"
                          style={{ borderColor: "oklch(0.82 0 0)" }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          data-ocid={`cart.item.${i + 1}`}
                          onClick={() => removeItem(item.productId)}
                          className="ml-2 transition-opacity duration-200 hover:opacity-50"
                          style={{ color: "oklch(0.55 0 0)" }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    {/* Quantity + remove — desktop */}
                    <div className="hidden sm:flex flex-col items-end gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border hover:bg-foreground hover:text-background transition-colors duration-200"
                          style={{ borderColor: "oklch(0.82 0 0)" }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-sans text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center border hover:bg-foreground hover:text-background transition-colors duration-200"
                          style={{ borderColor: "oklch(0.82 0 0)" }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-sans text-sm text-foreground w-24 text-right">
                        {formatINR(
                          item.priceSnapshotInr * BigInt(item.quantity),
                        )}
                      </p>
                      <button
                        type="button"
                        data-ocid={`cart.item.${i + 1}`}
                        onClick={() => removeItem(item.productId)}
                        className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase font-sans transition-opacity duration-200 hover:opacity-50 mt-1"
                        style={{ color: "oklch(0.58 0 0)" }}
                      >
                        <Trash2 size={12} strokeWidth={1.5} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div
              className="p-8 sticky top-24"
              style={{
                backgroundColor: "oklch(0.985 0.003 75)",
                border: "1px solid oklch(0.9 0.002 75)",
              }}
            >
              <h2 className="font-serif text-xl text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div
                  className="flex justify-between text-sm font-sans"
                  style={{ color: "oklch(0.48 0 0)" }}
                >
                  <span>
                    Subtotal ({itemCount} {itemCount === 1 ? "piece" : "pieces"}
                    )
                  </span>
                  <span className="text-foreground font-medium">
                    {formatINR(total)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm font-sans"
                  style={{ color: "oklch(0.48 0 0)" }}
                >
                  <span>Delivery</span>
                  <span>Calculated at checkout</span>
                </div>
                <div
                  className="pt-4 mt-2 flex justify-between font-serif text-base text-foreground"
                  style={{ borderTop: "1px solid oklch(0.88 0.003 75)" }}
                >
                  <span>Estimated Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <p
                className="text-xs font-sans mb-6"
                style={{ color: "oklch(0.6 0 0)" }}
              >
                Taxes and white-glove delivery fees will be added at checkout.
                All prices in INR.
              </p>

              <Button
                data-ocid="cart.checkout.primary_button"
                onClick={() => navigate({ to: "/checkout" })}
                className="w-full h-13 bg-foreground text-background hover:bg-foreground/80 rounded-none text-xs tracking-[0.18em] uppercase font-sans py-4"
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? "Proceed to Checkout" : "Log In to Checkout"}
              </Button>

              {!isLoggedIn && (
                <Link
                  to="/account"
                  data-ocid="cart.account.link"
                  className="block text-center mt-3 text-xs tracking-[0.12em] uppercase font-sans text-foreground border border-foreground py-3 hover:bg-foreground hover:text-background transition-colors duration-200"
                >
                  Log In / Register
                </Link>
              )}

              <Link
                to="/shop"
                data-ocid="cart.continue_shopping.link"
                className="block text-center mt-4 text-xs font-sans underline-offset-2 hover:underline transition-all duration-200"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
