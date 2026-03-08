import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export function OrderConfirmedPage() {
  const search = useSearch({ strict: false }) as { orderId?: string };
  const orderId = search?.orderId ?? "";

  return (
    <main className="pt-[72px] min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md w-full py-20">
        {/* Success icon */}
        <div className="flex justify-center mb-8">
          <CheckCircle2
            size={64}
            strokeWidth={1}
            className="text-foreground"
            aria-hidden="true"
          />
        </div>

        <p className="text-eyebrow mb-4">Confirmed</p>

        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6 leading-tight">
          Order Placed
        </h1>

        {orderId && (
          <div
            className="inline-block px-6 py-3 mb-8 font-sans text-sm tracking-widest"
            style={{
              backgroundColor: "oklch(0.975 0.004 75)",
              border: "1px solid oklch(0.88 0.003 75)",
              color: "oklch(0.35 0 0)",
            }}
          >
            {orderId}
          </div>
        )}

        <p
          className="text-sm font-sans mb-2 leading-relaxed"
          style={{ color: "oklch(0.48 0 0)" }}
        >
          Thank you for your order. Your piece is now being handcrafted.
        </p>
        <p
          className="text-sm font-sans mb-12 leading-relaxed"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          Estimated delivery: <span className="text-foreground">4–6 weeks</span>
        </p>

        {/* Divider */}
        <div
          className="h-px w-12 mx-auto mb-12"
          style={{ backgroundColor: "oklch(0.82 0 0)" }}
        />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account"
            data-ocid="order_confirmed.track_order.link"
            className="text-xs tracking-[0.18em] uppercase font-sans text-background bg-foreground px-8 py-3.5 hover:bg-foreground/80 transition-colors duration-200 w-full sm:w-auto text-center"
          >
            Track Order
          </Link>
          <Link
            to="/shop"
            data-ocid="order_confirmed.continue_shopping.link"
            className="text-xs tracking-[0.18em] uppercase font-sans text-foreground border border-foreground px-8 py-3.5 hover:bg-foreground hover:text-background transition-colors duration-200 w-full sm:w-auto text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
