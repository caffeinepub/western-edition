import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../store/authStore";
import { useCart } from "../store/cartStore";
import { useOrders } from "../store/orderStore";
import type { DeliveryAddress, PaymentMethod } from "../store/orderStore";
import { formatINR } from "../utils/helpers";

function calculateTokenAmount(total: bigint): number {
  const t = Number(total);
  if (t < 100000) return 500;
  if (t < 300000) return 1000;
  return 2000;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isLoggedIn, customer } = useAuth();
  const { items, total, clearCart } = useCart();
  const { placeOrder } = useOrders();

  const [address, setAddress] = useState<DeliveryAddress>({
    name: customer?.name ?? "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    phone: customer?.phone ?? "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryAddress, string>>
  >({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [partialPercent, setPartialPercent] = useState(30);
  const [placing, setPlacing] = useState(false);

  // Redirect if empty cart or not logged in
  if (items.length === 0) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl mb-4 text-foreground">
            Your cart is empty
          </p>
          <Link
            to="/shop"
            className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="font-serif text-2xl mb-3 text-foreground">
            Please log in to continue
          </p>
          <p
            className="text-sm font-sans mb-8"
            style={{ color: "oklch(0.55 0 0)" }}
          >
            You need an account to place an order.
          </p>
          <Link
            to="/account"
            data-ocid="checkout.login.link"
            className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
          >
            Log In / Register
          </Link>
        </div>
      </main>
    );
  }

  const tokenAmount = calculateTokenAmount(total);
  const partialAmount = (Number(total) * partialPercent) / 100;

  const validateAddress = (): boolean => {
    const newErrors: Partial<Record<keyof DeliveryAddress, string>> = {};
    if (!address.name.trim()) newErrors.name = "Full name is required.";
    if (!address.addressLine.trim())
      newErrors.addressLine = "Address is required.";
    if (!address.city.trim()) newErrors.city = "City is required.";
    if (!address.state.trim()) newErrors.state = "State is required.";
    if (!/^\d{6}$/.test(address.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    if (!/^\d{10}$/.test(address.phone))
      newErrors.phone = "Enter a valid 10-digit phone number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateAddress()) return;
    if (paymentMethod === "prepaid") {
      toast.info("Razorpay Integration Coming Soon", {
        description:
          "Prepaid payment will be available shortly. Please use COD or Partial Payment for now.",
      });
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const orderId = placeOrder({
        customerId: customer!.id,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          material: item.material,
          upholstery: item.upholstery,
          quantity: item.quantity,
          priceSnapshotInr: item.priceSnapshotInr,
        })),
        deliveryAddress: address,
        paymentMethod,
        tokenAmount: paymentMethod === "cod" ? tokenAmount : 0,
        partialPercent: paymentMethod === "partial" ? partialPercent : 0,
        orderTotal: total,
      });
      clearCart();
      setPlacing(false);
      navigate({ to: "/order-confirmed", search: { orderId } });
    }, 800);
  };

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="pt-[72px] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Header */}
        <div className="mb-10">
          <p className="text-eyebrow mb-3">Final Step</p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">
          {/* Left: Delivery address */}
          <div>
            <h2 className="font-serif text-xl text-foreground mb-6">
              Delivery Address
            </h2>

            <form
              data-ocid="checkout.address.panel"
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                handlePlaceOrder();
              }}
            >
              <div className="space-y-2">
                <Label
                  htmlFor="checkout-name"
                  className="text-[10px] tracking-[0.2em] uppercase font-sans"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  Full Name
                </Label>
                <Input
                  id="checkout-name"
                  data-ocid="checkout.name.input"
                  value={address.name}
                  onChange={(e) => handleAddressChange("name", e.target.value)}
                  placeholder="As per government ID"
                  className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                />
                {errors.name && (
                  <p
                    data-ocid="checkout.name.error_state"
                    className="text-xs font-sans text-destructive"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="checkout-address"
                  className="text-[10px] tracking-[0.2em] uppercase font-sans"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  Address Line
                </Label>
                <Input
                  id="checkout-address"
                  data-ocid="checkout.address.input"
                  value={address.addressLine}
                  onChange={(e) =>
                    handleAddressChange("addressLine", e.target.value)
                  }
                  placeholder="House/Flat no., Street, Area"
                  className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                />
                {errors.addressLine && (
                  <p
                    data-ocid="checkout.address.error_state"
                    className="text-xs font-sans text-destructive"
                  >
                    {errors.addressLine}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="checkout-city"
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    City
                  </Label>
                  <Input
                    id="checkout-city"
                    data-ocid="checkout.city.input"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    placeholder="Mumbai"
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                  {errors.city && (
                    <p className="text-xs font-sans text-destructive">
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="checkout-state"
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    State
                  </Label>
                  <Input
                    id="checkout-state"
                    data-ocid="checkout.state.input"
                    value={address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    placeholder="Maharashtra"
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                  {errors.state && (
                    <p className="text-xs font-sans text-destructive">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="checkout-pincode"
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    Pincode
                  </Label>
                  <Input
                    id="checkout-pincode"
                    data-ocid="checkout.pincode.input"
                    value={address.pincode}
                    onChange={(e) =>
                      handleAddressChange(
                        "pincode",
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="400001"
                    maxLength={6}
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                  {errors.pincode && (
                    <p
                      data-ocid="checkout.pincode.error_state"
                      className="text-xs font-sans text-destructive"
                    >
                      {errors.pincode}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="checkout-phone"
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    Phone
                  </Label>
                  <Input
                    id="checkout-phone"
                    data-ocid="checkout.phone.input"
                    value={address.phone}
                    onChange={(e) =>
                      handleAddressChange(
                        "phone",
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                  {errors.phone && (
                    <p
                      data-ocid="checkout.phone.error_state"
                      className="text-xs font-sans text-destructive"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Right: Order summary + payment */}
          <div className="space-y-6">
            {/* Items summary */}
            <div
              className="p-6"
              style={{
                backgroundColor: "oklch(0.985 0.003 75)",
                border: "1px solid oklch(0.9 0.002 75)",
              }}
            >
              <h2 className="font-serif text-lg text-foreground mb-5">
                Your Order
              </h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.material}`}
                    className="flex justify-between text-sm font-sans gap-4"
                  >
                    <span className="text-foreground flex-1 leading-snug">
                      {item.productName}
                      {item.material && (
                        <span style={{ color: "oklch(0.6 0 0)" }}>
                          {" "}
                          · {item.material}
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <span style={{ color: "oklch(0.6 0 0)" }}>
                          {" "}
                          × {item.quantity}
                        </span>
                      )}
                    </span>
                    <span className="text-foreground shrink-0">
                      {formatINR(item.priceSnapshotInr * BigInt(item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="pt-4 flex justify-between font-serif text-base text-foreground"
                style={{ borderTop: "1px solid oklch(0.88 0.003 75)" }}
              >
                <span>Subtotal</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <h2 className="font-serif text-lg text-foreground mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* COD */}
                <label
                  data-ocid="checkout.payment.cod.toggle"
                  className="flex gap-4 p-5 cursor-pointer transition-colors duration-200"
                  style={{
                    border: `1px solid ${paymentMethod === "cod" ? "oklch(0.12 0 0)" : "oklch(0.88 0.002 75)"}`,
                    backgroundColor:
                      paymentMethod === "cod"
                        ? "oklch(0.985 0.003 75)"
                        : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-0.5 accent-foreground"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-sans text-foreground font-medium">
                      Cash on Delivery
                    </p>
                    <p
                      className="text-xs font-sans mt-1 leading-relaxed"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      Pay ₹{tokenAmount.toLocaleString("en-IN")} token now, rest
                      on delivery
                    </p>
                  </div>
                </label>

                {/* Prepaid */}
                <label
                  data-ocid="checkout.payment.prepaid.toggle"
                  className="flex gap-4 p-5 cursor-pointer transition-colors duration-200"
                  style={{
                    border: `1px solid ${paymentMethod === "prepaid" ? "oklch(0.12 0 0)" : "oklch(0.88 0.002 75)"}`,
                    backgroundColor:
                      paymentMethod === "prepaid"
                        ? "oklch(0.985 0.003 75)"
                        : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="prepaid"
                    checked={paymentMethod === "prepaid"}
                    onChange={() => setPaymentMethod("prepaid")}
                    className="mt-0.5 accent-foreground"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-sans text-foreground font-medium">
                      Prepaid — Full Payment
                    </p>
                    <p
                      className="text-xs font-sans mt-1 leading-relaxed"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      Pay {formatINR(total)} online via Razorpay
                    </p>
                  </div>
                </label>

                {/* Partial */}
                <label
                  data-ocid="checkout.payment.partial.toggle"
                  className="flex gap-4 p-5 cursor-pointer transition-colors duration-200"
                  style={{
                    border: `1px solid ${paymentMethod === "partial" ? "oklch(0.12 0 0)" : "oklch(0.88 0.002 75)"}`,
                    backgroundColor:
                      paymentMethod === "partial"
                        ? "oklch(0.985 0.003 75)"
                        : "white",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="partial"
                    checked={paymentMethod === "partial"}
                    onChange={() => setPaymentMethod("partial")}
                    className="mt-0.5 accent-foreground"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-sans text-foreground font-medium">
                      Partial Payment
                    </p>
                    <p
                      className="text-xs font-sans mt-1"
                      style={{ color: "oklch(0.55 0 0)" }}
                    >
                      Pay a percentage now, rest on delivery
                    </p>
                    {paymentMethod === "partial" && (
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-xs font-sans">
                          <span style={{ color: "oklch(0.55 0 0)" }}>
                            Pay now ({partialPercent}%)
                          </span>
                          <span className="text-foreground font-medium">
                            {formatINR(BigInt(Math.round(partialAmount)))}
                          </span>
                        </div>
                        <Slider
                          data-ocid="checkout.partial.toggle"
                          min={10}
                          max={100}
                          step={5}
                          value={[partialPercent]}
                          onValueChange={([v]) => setPartialPercent(v)}
                          className="w-full"
                        />
                        <div
                          className="flex justify-between text-[10px] font-sans"
                          style={{ color: "oklch(0.65 0 0)" }}
                        >
                          <span>10%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Place order */}
            <button
              type="button"
              data-ocid="checkout.place_order.primary_button"
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full h-14 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>

            <p
              className="text-xs font-sans text-center"
              style={{ color: "oklch(0.6 0 0)" }}
            >
              All pieces are made-to-order. Estimated delivery 4–6 weeks.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
