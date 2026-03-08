import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  LogOut,
  Package,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetProducts } from "../hooks/useQueries";
import { useAuth } from "../store/authStore";
import { useOrders } from "../store/orderStore";
import type { Order } from "../store/orderStore";
import { useSearchStore } from "../store/searchStore";
import { useWishlist } from "../store/wishlistStore";
import { formatINR, getProductImage } from "../utils/helpers";

// Status badge styles
function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    Shipped: "bg-amber-50 text-amber-700 border-amber-200",
    Delivered: "bg-green-50 text-green-700 border-green-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-block text-[10px] tracking-[0.15em] uppercase font-sans px-2.5 py-1 border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// Auth Form component
function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "login") {
      const result = login(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error ?? "Login failed.");
      } else {
        toast.success("Welcome back!");
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }
      const result = register(email, password, name, phone);
      setLoading(false);
      if (!result.success) {
        setError(result.error ?? "Registration failed.");
      } else {
        toast.success("Account created successfully!");
      }
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-eyebrow mb-3">My Account</p>
          <h1 className="font-serif text-3xl text-foreground">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
        </div>

        {/* Toggle */}
        <div
          className="flex mb-8"
          style={{ borderBottom: "1px solid oklch(0.88 0.003 75)" }}
        >
          <button
            type="button"
            data-ocid="account.login.tab"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className="flex-1 py-3 text-xs tracking-[0.18em] uppercase font-sans transition-colors duration-200"
            style={{
              color: mode === "login" ? "oklch(0.12 0 0)" : "oklch(0.6 0 0)",
              borderBottom:
                mode === "login" ? "1px solid oklch(0.12 0 0)" : "none",
              marginBottom: mode === "login" ? "-1px" : "0",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            data-ocid="account.register.tab"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className="flex-1 py-3 text-xs tracking-[0.18em] uppercase font-sans transition-colors duration-200"
            style={{
              color: mode === "register" ? "oklch(0.12 0 0)" : "oklch(0.6 0 0)",
              borderBottom:
                mode === "register" ? "1px solid oklch(0.12 0 0)" : "none",
              marginBottom: mode === "register" ? "-1px" : "0",
            }}
          >
            Register
          </button>
        </div>

        <form
          data-ocid="account.auth.panel"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {mode === "register" && (
            <>
              <div className="space-y-2">
                <Label
                  htmlFor="auth-name"
                  className="text-[10px] tracking-[0.2em] uppercase font-sans"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  Full Name
                </Label>
                <Input
                  id="auth-name"
                  data-ocid="account.name.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="auth-phone"
                  className="text-[10px] tracking-[0.2em] uppercase font-sans"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  Phone
                </Label>
                <Input
                  id="auth-phone"
                  data-ocid="account.phone.input"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile"
                  required
                  className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="auth-email"
              className="text-[10px] tracking-[0.2em] uppercase font-sans"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Email
            </Label>
            <Input
              id="auth-email"
              data-ocid="account.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
              className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="auth-password"
              className="text-[10px] tracking-[0.2em] uppercase font-sans"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Password
            </Label>
            <Input
              id="auth-password"
              data-ocid="account.password.input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "register" ? "Min. 6 characters" : "Your password"
              }
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label
                htmlFor="auth-confirm"
                className="text-[10px] tracking-[0.2em] uppercase font-sans"
                style={{ color: "oklch(0.55 0 0)" }}
              >
                Confirm Password
              </Label>
              <Input
                id="auth-confirm"
                data-ocid="account.confirm_password.input"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
              />
            </div>
          )}

          {error && (
            <p
              data-ocid="account.auth.error_state"
              className="text-xs font-sans text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            data-ocid="account.auth.submit_button"
            disabled={loading}
            className="w-full h-12 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200 disabled:opacity-50 mt-2"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Order card component
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { cancelOrder } = useOrders();

  const handleCancel = () => {
    const success = cancelOrder(order.id);
    if (success) {
      toast.success("Order cancelled successfully.");
    } else {
      toast.error("Could not cancel this order.");
    }
    setCancelId(null);
  };

  return (
    <div className="border" style={{ borderColor: "oklch(0.88 0.003 75)" }}>
      <div
        className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
        style={{
          borderBottom: expanded ? "1px solid oklch(0.92 0.002 75)" : "none",
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-sans text-xs tracking-[0.1em] text-foreground font-medium">
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs font-sans" style={{ color: "oklch(0.58 0 0)" }}>
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {order.items.length}{" "}
            {order.items.length === 1 ? "piece" : "pieces"} ·{" "}
            {formatINR(order.orderTotal)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {order.status === "Confirmed" && (
            <button
              type="button"
              data-ocid="account.order.delete_button"
              onClick={() => setCancelId(order.id)}
              className="text-[10px] tracking-[0.15em] uppercase font-sans border px-3 py-2 transition-colors duration-200 hover:bg-red-50 hover:border-red-300"
              style={{
                color: "oklch(0.5 0.12 22)",
                borderColor: "oklch(0.78 0.05 22)",
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            data-ocid="account.order.secondary_button"
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-sans transition-opacity duration-200 hover:opacity-50"
            style={{ color: "oklch(0.45 0 0)" }}
          >
            {expanded ? (
              <>
                <ChevronUp size={12} /> Hide
              </>
            ) : (
              <>
                <ChevronDown size={12} /> Details
              </>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          <div>
            <p className="text-eyebrow mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={`${item.productId}-${i}`}
                  className="flex justify-between text-sm font-sans"
                >
                  <span className="text-foreground flex-1">
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
                  <span className="text-foreground ml-4">
                    {formatINR(item.priceSnapshotInr * BigInt(item.quantity))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pt-4"
            style={{ borderTop: "1px solid oklch(0.92 0.002 75)" }}
          >
            <p className="text-eyebrow mb-3">Delivery Address</p>
            <p className="text-sm font-sans text-foreground leading-relaxed">
              {order.deliveryAddress.name}
              <br />
              {order.deliveryAddress.addressLine}
              <br />
              {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
              {order.deliveryAddress.pincode}
              <br />
              +91 {order.deliveryAddress.phone}
            </p>
          </div>

          <div
            className="pt-4"
            style={{ borderTop: "1px solid oklch(0.92 0.002 75)" }}
          >
            <div className="flex justify-between text-sm font-sans">
              <span style={{ color: "oklch(0.55 0 0)" }}>Payment</span>
              <span className="text-foreground capitalize">
                {order.paymentMethod === "cod"
                  ? `COD · Token ₹${order.tokenAmount.toLocaleString("en-IN")}`
                  : order.paymentMethod === "partial"
                    ? `Partial ${order.partialPercent}% paid`
                    : "Prepaid (Online)"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm dialog */}
      <AlertDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
      >
        <AlertDialogContent data-ocid="account.cancel_order.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl">
              Cancel this order?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm">
              This action cannot be undone. Your piece will not be crafted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="account.cancel_order.cancel_button"
              className="rounded-none"
            >
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="account.cancel_order.confirm_button"
              onClick={handleCancel}
              className="rounded-none bg-foreground text-background hover:bg-foreground/80"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Main Account Dashboard
function AccountDashboard() {
  const { customer, logout, updateProfile } = useAuth();
  const { getMyOrders } = useOrders();
  const { productIds: wishlistIds, removeFromWishlist } = useWishlist();
  const { recentSearches, clearSearches } = useSearchStore();
  const { data: allProducts } = useGetProducts();

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(customer?.name ?? "");
  const [editPhone, setEditPhone] = useState(customer?.phone ?? "");

  const myOrders = customer ? getMyOrders(customer.id) : [];
  const wishlistProducts = allProducts?.filter((p) =>
    wishlistIds.includes(p.id),
  );

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    updateProfile(editName, editPhone);
    setEditMode(false);
    toast.success("Profile updated.");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
      <div className="mb-10">
        <p className="text-eyebrow mb-3">My Account</p>
        <h1 className="font-serif text-4xl text-foreground">
          {customer?.name.split(" ")[0]}
        </h1>
      </div>

      <Tabs data-ocid="account.tabs.panel" defaultValue="profile">
        <TabsList
          className="grid grid-cols-4 w-full max-w-lg mb-10 rounded-none h-auto p-0 bg-transparent"
          style={{ borderBottom: "1px solid oklch(0.88 0.003 75)" }}
        >
          {[
            { value: "profile", label: "Profile", icon: User },
            { value: "orders", label: "Orders", icon: Package },
            { value: "wishlist", label: "Wishlist", icon: Heart },
            { value: "searches", label: "Searches", icon: Search },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              data-ocid={`account.${value}.tab`}
              className="rounded-none py-3 text-[10px] tracking-[0.18em] uppercase font-sans gap-2 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-foreground h-auto"
              style={{ color: "oklch(0.5 0 0)" }}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" data-ocid="account.profile.panel">
          <div className="max-w-sm space-y-6">
            {editMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    Full Name
                  </Label>
                  <Input
                    data-ocid="account.profile.name.input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    className="text-[10px] tracking-[0.2em] uppercase font-sans"
                    style={{ color: "oklch(0.55 0 0)" }}
                  >
                    Phone
                  </Label>
                  <Input
                    data-ocid="account.profile.phone.input"
                    value={editPhone}
                    onChange={(e) =>
                      setEditPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    className="rounded-none border-stone h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    data-ocid="account.profile.save_button"
                    onClick={handleSaveProfile}
                    className="px-6 py-2.5 bg-foreground text-background text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    data-ocid="account.profile.cancel_button"
                    onClick={() => {
                      setEditMode(false);
                      setEditName(customer?.name ?? "");
                      setEditPhone(customer?.phone ?? "");
                    }}
                    className="px-6 py-2.5 border text-xs tracking-[0.15em] uppercase font-sans hover:bg-stone transition-colors duration-200"
                    style={{ borderColor: "oklch(0.82 0 0)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  { label: "Name", value: customer?.name },
                  { label: "Email", value: customer?.email },
                  {
                    label: "Phone",
                    value: customer?.phone ? `+91 ${customer.phone}` : "—",
                  },
                  {
                    label: "Member Since",
                    value: customer?.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "—",
                  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase font-sans mb-1"
                      style={{ color: "oklch(0.58 0 0)" }}
                    >
                      {label}
                    </p>
                    <p className="text-sm font-sans text-foreground">{value}</p>
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    data-ocid="account.profile.edit_button"
                    onClick={() => setEditMode(true)}
                    className="px-6 py-2.5 border text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground hover:text-background transition-colors duration-200"
                    style={{ borderColor: "oklch(0.25 0 0)" }}
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    data-ocid="account.logout.button"
                    onClick={() => {
                      logout();
                      toast.success("Logged out.");
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 border text-xs tracking-[0.15em] uppercase font-sans hover:bg-stone transition-colors duration-200"
                    style={{
                      borderColor: "oklch(0.82 0 0)",
                      color: "oklch(0.55 0 0)",
                    }}
                  >
                    <LogOut size={12} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Orders tab */}
        <TabsContent value="orders" data-ocid="account.orders.panel">
          {myOrders.length === 0 ? (
            <div
              data-ocid="account.orders.empty_state"
              className="py-16 text-center"
            >
              <Package
                size={40}
                strokeWidth={1}
                className="mx-auto mb-4"
                style={{ color: "oklch(0.72 0 0)" }}
              />
              <p className="font-serif text-xl text-foreground mb-2">
                No orders yet
              </p>
              <p
                className="text-sm font-sans mb-6"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Your order history will appear here.
              </p>
              <Link
                to="/shop"
                data-ocid="account.orders.shop.link"
                className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {myOrders.map((order, i) => (
                <div key={order.id} data-ocid={`account.order.item.${i + 1}`}>
                  <OrderCard order={order} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist tab */}
        <TabsContent value="wishlist" data-ocid="account.wishlist.panel">
          {wishlistIds.length === 0 || !wishlistProducts?.length ? (
            <div
              data-ocid="account.wishlist.empty_state"
              className="py-16 text-center"
            >
              <Heart
                size={40}
                strokeWidth={1}
                className="mx-auto mb-4"
                style={{ color: "oklch(0.72 0 0)" }}
              />
              <p className="font-serif text-xl text-foreground mb-2">
                Your wishlist is empty
              </p>
              <p
                className="text-sm font-sans mb-6"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Save pieces you love and come back to them anytime.
              </p>
              <Link
                to="/shop"
                data-ocid="account.wishlist.shop.link"
                className="text-xs tracking-[0.15em] uppercase font-sans text-foreground border border-foreground px-8 py-3 inline-block hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                Explore the Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts?.map((product, i) => (
                <div
                  key={product.id}
                  data-ocid={`account.wishlist.item.${i + 1}`}
                  className="group relative"
                >
                  <Link to="/product/$id" params={{ id: product.id }}>
                    <div
                      className="aspect-square overflow-hidden mb-3"
                      style={{ backgroundColor: "oklch(0.975 0.006 75)" }}
                    >
                      <img
                        src={getProductImage(product, i)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="font-serif text-sm text-foreground leading-snug mb-1">
                      {product.name}
                    </h3>
                    <p
                      className="text-xs font-sans"
                      style={{ color: "oklch(0.52 0 0)" }}
                    >
                      {formatINR(product.priceInr)}
                    </p>
                  </Link>
                  <button
                    type="button"
                    data-ocid={`account.wishlist.item.${i + 1}`}
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.success("Removed from wishlist.");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white transition-colors duration-200"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.5}
                      fill="currentColor"
                      style={{ color: "oklch(0.52 0.18 22)" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Recent Searches tab */}
        <TabsContent value="searches" data-ocid="account.searches.panel">
          {recentSearches.length === 0 ? (
            <div
              data-ocid="account.searches.empty_state"
              className="py-16 text-center"
            >
              <Search
                size={40}
                strokeWidth={1}
                className="mx-auto mb-4"
                style={{ color: "oklch(0.72 0 0)" }}
              />
              <p className="font-serif text-xl text-foreground mb-2">
                No recent searches
              </p>
              <p
                className="text-sm font-sans"
                style={{ color: "oklch(0.58 0 0)" }}
              >
                Your search history will appear here.
              </p>
            </div>
          ) : (
            <div className="max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <p
                  className="text-xs font-sans"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  {recentSearches.length} recent{" "}
                  {recentSearches.length === 1 ? "search" : "searches"}
                </p>
                <button
                  type="button"
                  data-ocid="account.searches.delete_button"
                  onClick={() => {
                    clearSearches();
                    toast.success("Search history cleared.");
                  }}
                  className="text-[10px] tracking-[0.15em] uppercase font-sans transition-opacity duration-200 hover:opacity-50"
                  style={{ color: "oklch(0.52 0 0)" }}
                >
                  Clear All
                </button>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: "oklch(0.9 0.002 75)" }}
              >
                {recentSearches.map((term, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: search terms may repeat, index is stable
                    key={`${term}-${i}`}
                    data-ocid={`account.searches.item.${i + 1}`}
                    className="py-3 flex items-center justify-between"
                  >
                    <Link
                      to="/shop"
                      search={{ q: term }}
                      data-ocid={`account.searches.item.${i + 1}`}
                      className="flex items-center gap-3 flex-1 group"
                    >
                      <Search
                        size={12}
                        style={{ color: "oklch(0.65 0 0)" }}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm font-sans text-foreground group-hover:underline underline-offset-2 transition-all duration-200">
                        {term}
                      </span>
                    </Link>
                    <Badge
                      variant="outline"
                      className="text-[9px] tracking-[0.1em] uppercase font-sans rounded-none border-stone"
                      style={{ color: "oklch(0.6 0 0)" }}
                    >
                      Search →
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AccountPage() {
  const { isLoggedIn } = useAuth();

  return (
    <main className="pt-[72px] min-h-screen">
      {isLoggedIn ? <AccountDashboard /> : <AuthForm />}
    </main>
  );
}
