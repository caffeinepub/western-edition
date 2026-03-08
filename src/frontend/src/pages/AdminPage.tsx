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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useGetProducts, useGetShowroomLeads } from "../hooks/useQueries";
import { useAdmin } from "../store/adminStore";
import { useOrders } from "../store/orderStore";
import type { Order } from "../store/orderStore";
import { formatINR, getCategoryLabel, getRoomLabel } from "../utils/helpers";

type AdminTab = "dashboard" | "products" | "orders" | "leads" | "settings";

// ─── Admin Login ────────────────────────────────────────────────
function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = login(email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm bg-white border border-stone-200 p-8">
        <div className="text-center mb-8">
          <p
            className="font-sans text-[11px] tracking-[0.3em] uppercase mb-2"
            style={{ color: "oklch(0.58 0 0)" }}
          >
            Western Edition
          </p>
          <h1 className="font-serif text-2xl text-foreground">Admin Panel</h1>
        </div>

        <form
          data-ocid="admin.login.panel"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label
              htmlFor="admin-email"
              className="text-[10px] tracking-[0.2em] uppercase font-sans text-stone-500"
            >
              Email
            </Label>
            <Input
              id="admin-email"
              data-ocid="admin.login.email.input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@westernedition.in"
              autoComplete="email"
              required
              className="rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="text-[10px] tracking-[0.2em] uppercase font-sans text-stone-500"
            >
              Password
            </Label>
            <Input
              id="admin-password"
              data-ocid="admin.login.password.input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your admin password"
              autoComplete="current-password"
              required
              className="rounded-none h-11 text-sm font-sans focus-visible:ring-0 focus-visible:border-foreground"
            />
          </div>

          {error && (
            <p
              data-ocid="admin.login.error_state"
              className="text-xs font-sans text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            data-ocid="admin.login.submit_button"
            disabled={loading}
            className="w-full h-11 bg-foreground text-background text-xs tracking-[0.2em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div
          className="mt-6 p-3 text-xs font-sans"
          style={{
            backgroundColor: "oklch(0.97 0.002 75)",
            color: "oklch(0.58 0 0)",
          }}
        >
          Default: admin@westernedition.in / WE@Admin2024
        </div>
      </div>
    </div>
  );
}

// ─── Product Form ────────────────────────────────────────────────
interface ProductFormData {
  id: string;
  name: string;
  category: string;
  room: string;
  priceInr: string;
  description: string;
  isNewArrival: boolean;
}

function ProductSheet({
  open,
  onClose,
  editProduct,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  editProduct?: Product | null;
  onSave: (data: ProductFormData) => void;
}) {
  const [form, setForm] = useState<ProductFormData>({
    id: editProduct?.id ?? "",
    name: editProduct?.name ?? "",
    category: editProduct?.category ?? "sofa",
    room: editProduct?.room ?? "living",
    priceInr: editProduct?.priceInr?.toString() ?? "",
    description: editProduct?.description ?? "",
    isNewArrival: editProduct?.isNewArrival ?? false,
  });

  const isEdit = !!editProduct;

  const handleSave = () => {
    if (!form.name.trim() || !form.priceInr || !form.id.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    onSave(form);
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        data-ocid="admin.product.sheet"
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">
            {isEdit ? "Edit Product" : "Add Product"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
                Product ID *
              </Label>
              <Input
                data-ocid="admin.product.id.input"
                value={form.id}
                onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                placeholder="prod001"
                disabled={isEdit}
                className="rounded-none h-10 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
                Price (INR) *
              </Label>
              <Input
                data-ocid="admin.product.price.input"
                type="number"
                value={form.priceInr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceInr: e.target.value }))
                }
                placeholder="150000"
                className="rounded-none h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
              Product Name *
            </Label>
            <Input
              data-ocid="admin.product.name.input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Arjuna Sofa"
              className="rounded-none h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  data-ocid="admin.product.category.select"
                  className="rounded-none h-10 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sofa">Sofa</SelectItem>
                  <SelectItem value="diningTable">Dining Table</SelectItem>
                  <SelectItem value="bed">Bed</SelectItem>
                  <SelectItem value="mediaUnit">Media Unit</SelectItem>
                  <SelectItem value="decor">Decor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
                Room
              </Label>
              <Select
                value={form.room}
                onValueChange={(v) => setForm((f) => ({ ...f, room: v }))}
              >
                <SelectTrigger
                  data-ocid="admin.product.room.select"
                  className="rounded-none h-10 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living">Living Room</SelectItem>
                  <SelectItem value="dining">Dining Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="decor">Decor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] tracking-[0.18em] uppercase font-sans text-stone-500">
              Description
            </Label>
            <Textarea
              data-ocid="admin.product.description.textarea"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Product description..."
              rows={3}
              className="rounded-none text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              data-ocid="admin.product.new_arrival.switch"
              checked={form.isNewArrival}
              onCheckedChange={(v) =>
                setForm((f) => ({ ...f, isNewArrival: v }))
              }
            />
            <Label className="text-sm font-sans text-foreground">
              Mark as New Arrival
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              data-ocid="admin.product.save_button"
              onClick={handleSave}
              className="flex-1 h-11 bg-foreground text-background text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
            <button
              type="button"
              data-ocid="admin.product.cancel_button"
              onClick={onClose}
              className="px-6 h-11 border text-xs tracking-[0.15em] uppercase font-sans hover:bg-stone-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Products Tab ────────────────────────────────────────────────
function ProductsTab() {
  const { data: products, isLoading } = useGetProducts();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (data: ProductFormData) => {
    const adminProducts = getAdminProducts();
    const newProduct: Product = {
      id: data.id,
      name: data.name,
      category: data.category as Product["category"],
      room: data.room as Product["room"],
      priceInr: BigInt(data.priceInr),
      description: data.description,
      isNewArrival: data.isNewArrival,
      availableMaterials: [],
      availableUpholstery: [],
    };

    const existing = adminProducts.findIndex((p) => p.id === data.id);
    let updated: Product[];
    if (existing >= 0) {
      updated = adminProducts.map((p) => (p.id === data.id ? newProduct : p));
    } else {
      updated = [...adminProducts, newProduct];
    }
    saveAdminProducts(updated);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setSheetOpen(false);
    setEditProduct(null);
    toast.success(existing >= 0 ? "Product updated." : "Product added.");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const deleted = getDeletedIds();
    if (!deleted.includes(deleteId)) {
      localStorage.setItem(
        "we_admin_deleted",
        JSON.stringify([...deleted, deleteId]),
      );
    }
    // Also remove from admin products
    const adminProds = getAdminProducts().filter((p) => p.id !== deleteId);
    saveAdminProducts(adminProds);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setDeleteId(null);
    toast.success("Product deleted.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-foreground">Products</h2>
        <button
          type="button"
          data-ocid="admin.products.open_modal_button"
          onClick={() => {
            setEditProduct(null);
            setSheetOpen(true);
          }}
          className="px-5 py-2.5 bg-foreground text-background text-xs tracking-[0.15em] uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
        >
          + Add Product
        </button>
      </div>

      {isLoading ? (
        <div
          data-ocid="admin.products.loading_state"
          className="text-sm font-sans text-stone-500 py-8"
        >
          Loading products...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table data-ocid="admin.products.table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase">
                  Name
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase hidden md:table-cell">
                  Room
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase">
                  Price
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase hidden md:table-cell">
                  New?
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-[0.2em] uppercase text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product, i) => (
                <TableRow
                  key={product.id}
                  data-ocid={`admin.products.row.${i + 1}`}
                >
                  <TableCell className="font-sans text-sm text-foreground max-w-[200px]">
                    <span className="truncate block">{product.name}</span>
                    <span className="text-[10px] text-stone-400">
                      {product.id}
                    </span>
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600 hidden sm:table-cell">
                    {getCategoryLabel(product.category)}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600 hidden md:table-cell">
                    {getRoomLabel(product.room)}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-foreground">
                    {formatINR(product.priceInr)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {product.isNewArrival && (
                      <Badge
                        variant="outline"
                        className="text-[9px] tracking-widest uppercase rounded-none border-stone-300 text-stone-500"
                      >
                        New
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        data-ocid={`admin.products.row.${i + 1}`}
                        onClick={() => {
                          setEditProduct(product);
                          setSheetOpen(true);
                        }}
                        className="text-[10px] tracking-widest uppercase font-sans text-stone-500 hover:text-foreground transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.products.row.${i + 1}`}
                        onClick={() => setDeleteId(product.id)}
                        className="text-[10px] tracking-widest uppercase font-sans text-red-400 hover:text-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditProduct(null);
        }}
        editProduct={editProduct}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="admin.product.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl">
              Delete this product?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-sans text-sm">
              This action cannot be undone. The product will be removed from the
              catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="admin.product.delete.cancel_button"
              className="rounded-none"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="admin.product.delete.confirm_button"
              onClick={handleDelete}
              className="rounded-none bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Orders Tab ────────────────────────────────────────────────
function OrdersTab() {
  const { orders, updateOrderStatus } = useOrders();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusOptions: Order["status"][] = [
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const statusColors: Record<Order["status"], string> = {
    Confirmed: "bg-blue-50 text-blue-700",
    Shipped: "bg-amber-50 text-amber-700",
    Delivered: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-6">Orders</h2>
      {orders.length === 0 ? (
        <div
          data-ocid="admin.orders.empty_state"
          className="py-12 text-center text-sm font-sans text-stone-400"
        >
          No orders yet.
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order, i) => (
            <div
              key={order.id}
              data-ocid={`admin.orders.row.${i + 1}`}
              className="border border-stone-200 overflow-hidden"
            >
              <div className="p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans text-sm font-medium text-foreground">
                    {order.id}
                  </span>
                  <span className="text-xs font-sans text-stone-400">
                    {order.deliveryAddress.name} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN")} ·{" "}
                    {formatINR(order.orderTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <select
                    data-ocid={`admin.orders.row.${i + 1}`}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value as Order["status"],
                      )
                    }
                    className={`text-[10px] tracking-widest uppercase font-sans px-3 py-1.5 border-0 rounded outline-none cursor-pointer ${statusColors[order.status]}`}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId((id) => (id === order.id ? null : order.id))
                    }
                    className="text-stone-400 hover:text-foreground transition-colors duration-200"
                    aria-label="Toggle details"
                  >
                    {expandedId === order.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                </div>
              </div>

              {expandedId === order.id && (
                <div className="px-4 pb-4 space-y-4 border-t border-stone-100">
                  <div className="pt-4">
                    <p className="text-[10px] tracking-widest uppercase text-stone-400 mb-2">
                      Items
                    </p>
                    {order.items.map((item, j) => (
                      <div
                        key={`${item.productId}-${j}`}
                        className="flex justify-between text-sm font-sans py-1"
                      >
                        <span className="text-foreground">
                          {item.productName}
                          {item.quantity > 1 && (
                            <span className="text-stone-400">
                              {" "}
                              × {item.quantity}
                            </span>
                          )}
                        </span>
                        <span className="text-foreground">
                          {formatINR(
                            item.priceSnapshotInr * BigInt(item.quantity),
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-sans text-stone-600">
                    <strong>Address:</strong>{" "}
                    {order.deliveryAddress.addressLine},{" "}
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.pincode} · +91{" "}
                    {order.deliveryAddress.phone}
                  </div>
                  <div className="text-sm font-sans text-stone-600">
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod === "cod"
                      ? `COD (Token ₹${order.tokenAmount.toLocaleString("en-IN")})`
                      : order.paymentMethod === "partial"
                        ? `Partial ${order.partialPercent}% paid`
                        : "Prepaid (Online)"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────
function LeadsTab() {
  const { data: leads, isLoading } = useGetShowroomLeads();

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-6">
        Showroom Leads
      </h2>
      {isLoading ? (
        <div
          data-ocid="admin.leads.loading_state"
          className="text-sm font-sans text-stone-400 py-8"
        >
          Loading...
        </div>
      ) : !leads?.length ? (
        <div
          data-ocid="admin.leads.empty_state"
          className="py-12 text-center text-sm font-sans text-stone-400"
        >
          No showroom leads yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table data-ocid="admin.leads.table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase">
                  Name
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase hidden sm:table-cell">
                  Email
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase">
                  Phone
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase hidden md:table-cell">
                  Pincode
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase hidden lg:table-cell">
                  Message
                </TableHead>
                <TableHead className="font-sans text-[10px] tracking-widest uppercase hidden md:table-cell">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, i) => (
                <TableRow key={lead.id} data-ocid={`admin.leads.row.${i + 1}`}>
                  <TableCell className="font-sans text-sm text-foreground">
                    {lead.name}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600 hidden sm:table-cell">
                    {lead.email}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600">
                    {lead.phone}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600 hidden md:table-cell">
                    {lead.pincode}
                  </TableCell>
                  <TableCell className="font-sans text-sm text-stone-600 max-w-[200px] hidden lg:table-cell">
                    <span className="truncate block">{lead.message}</span>
                  </TableCell>
                  <TableCell className="font-sans text-xs text-stone-400 hidden md:table-cell">
                    {new Date(
                      Number(lead.timestamp) / 1_000_000,
                    ).toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────
function SettingsTab() {
  const [razorpayKey, setRazorpayKey] = useState(
    () => localStorage.getItem("we_razorpay_key") ?? "",
  );
  const [adminEmail, setAdminEmail] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("we_admin_creds") ?? "{}").email ??
        "admin@westernedition.in"
      );
    } catch {
      return "admin@westernedition.in";
    }
  });
  const [adminPassword, setAdminPassword] = useState("");

  const handleSaveRazorpay = () => {
    localStorage.setItem("we_razorpay_key", razorpayKey);
    toast.success("Razorpay key saved.");
  };

  const handleSaveAdminCreds = () => {
    if (!adminEmail.trim()) return;
    const current = (() => {
      try {
        return JSON.parse(localStorage.getItem("we_admin_creds") ?? "{}");
      } catch {
        return {};
      }
    })();
    localStorage.setItem(
      "we_admin_creds",
      JSON.stringify({
        email: adminEmail,
        password: adminPassword || current.password || "WE@Admin2024",
      }),
    );
    toast.success("Admin credentials updated.");
    setAdminPassword("");
  };

  return (
    <div className="max-w-md space-y-10">
      <h2 className="font-serif text-xl text-foreground">Settings</h2>

      {/* Razorpay */}
      <div>
        <p className="text-[10px] tracking-widest uppercase font-sans text-stone-500 mb-1">
          Razorpay Integration
        </p>
        <p className="text-xs font-sans text-stone-400 mb-4">
          Razorpay integration is currently in placeholder mode. Enter your live
          key here when ready.
        </p>
        <div className="space-y-3">
          <Input
            data-ocid="admin.settings.razorpay.input"
            value={razorpayKey}
            onChange={(e) => setRazorpayKey(e.target.value)}
            placeholder="rzp_live_xxxxxxxxxxxx"
            className="rounded-none h-10 text-sm font-sans"
          />
          <button
            type="button"
            data-ocid="admin.settings.razorpay.save_button"
            onClick={handleSaveRazorpay}
            className="px-5 py-2 bg-foreground text-background text-xs tracking-widest uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
          >
            Save Key
          </button>
        </div>
      </div>

      {/* Admin credentials */}
      <div>
        <p className="text-[10px] tracking-widest uppercase font-sans text-stone-500 mb-4">
          Admin Credentials
        </p>
        <div className="space-y-3">
          <Input
            data-ocid="admin.settings.email.input"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="admin@westernedition.in"
            className="rounded-none h-10 text-sm font-sans"
          />
          <Input
            data-ocid="admin.settings.password.input"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="New password (leave blank to keep current)"
            className="rounded-none h-10 text-sm font-sans"
          />
          <button
            type="button"
            data-ocid="admin.settings.credentials.save_button"
            onClick={handleSaveAdminCreds}
            className="px-5 py-2 bg-foreground text-background text-xs tracking-widest uppercase font-sans hover:bg-foreground/80 transition-colors duration-200"
          >
            Update Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Stats ────────────────────────────────────────────────
function DashboardTab() {
  const { data: products } = useGetProducts();
  const { orders } = useOrders();
  const { data: leads } = useGetShowroomLeads();

  const customers = (() => {
    try {
      return JSON.parse(localStorage.getItem("we_customers") ?? "[]").length;
    } catch {
      return 0;
    }
  })();

  const stats = [
    {
      label: "Total Products",
      value: products?.length ?? 0,
      icon: Package,
      ocid: "admin.dashboard.products.card",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      ocid: "admin.dashboard.orders.card",
    },
    {
      label: "Showroom Leads",
      value: leads?.length ?? 0,
      icon: BarChart3,
      ocid: "admin.dashboard.leads.card",
    },
    {
      label: "Total Customers",
      value: customers,
      icon: Users,
      ocid: "admin.dashboard.customers.card",
    },
  ];

  return (
    <div>
      <h2 className="font-serif text-xl text-foreground mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, ocid }) => (
          <div
            key={label}
            data-ocid={ocid}
            className="p-5 border border-stone-200 bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[10px] tracking-widest uppercase font-sans text-stone-400">
                {label}
              </p>
              <Icon size={16} className="text-stone-300" />
            </div>
            <p className="font-serif text-3xl text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div>
          <p className="text-[10px] tracking-widest uppercase font-sans text-stone-400 mb-4">
            Recent Orders
          </p>
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border border-stone-100 text-sm font-sans"
              >
                <span className="text-foreground font-medium">{order.id}</span>
                <span className="text-stone-400 hidden sm:block">
                  {order.deliveryAddress.name}
                </span>
                <span className="text-foreground">
                  {formatINR(order.orderTotal)}
                </span>
                <span
                  className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded ${
                    order.status === "Confirmed"
                      ? "bg-blue-50 text-blue-600"
                      : order.status === "Shipped"
                        ? "bg-amber-50 text-amber-600"
                        : order.status === "Delivered"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper functions ─────────────────────────────────────────────
function getAdminProducts(): Product[] {
  try {
    return JSON.parse(localStorage.getItem("we_admin_products") ?? "[]").map(
      (p: Product & { priceInr: string | bigint }) => ({
        ...p,
        priceInr: BigInt(p.priceInr),
      }),
    );
  } catch {
    return [];
  }
}

function saveAdminProducts(products: Product[]) {
  localStorage.setItem(
    "we_admin_products",
    JSON.stringify(
      products.map((p) => ({
        ...p,
        priceInr: p.priceInr.toString(),
      })),
    ),
  );
}

function getDeletedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem("we_admin_deleted") ?? "[]");
  } catch {
    return [];
  }
}

// ─── Admin Dashboard Layout ────────────────────────────────────────────────
function AdminDashboard() {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ size: number; className?: string }>;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "leads", label: "Leads", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-stone-200 fixed top-0 bottom-0 left-0">
        <div className="p-6 border-b border-stone-100">
          <p className="font-serif text-sm text-foreground">WE Admin</p>
          <p
            className="text-[10px] tracking-widest uppercase font-sans mt-0.5"
            style={{ color: "oklch(0.65 0 0)" }}
          >
            Western Edition
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              data-ocid={`admin.nav.${id}.link`}
              onClick={() => setActiveTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs font-sans tracking-[0.08em] transition-colors duration-200"
              style={{
                color: activeTab === id ? "oklch(0.12 0 0)" : "oklch(0.55 0 0)",
                backgroundColor:
                  activeTab === id ? "oklch(0.97 0.002 75)" : "transparent",
              }}
            >
              <Icon
                size={15}
                className={activeTab === id ? "text-foreground" : ""}
              />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-stone-100">
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={() => {
              logout();
              toast.success("Logged out.");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-sans tracking-[0.08em] transition-colors duration-200 hover:bg-stone-50"
            style={{ color: "oklch(0.55 0 0)" }}
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 flex items-center justify-between px-4 h-14">
        <p className="font-serif text-sm text-foreground">WE Admin</p>
        <button
          type="button"
          onClick={() => setSidebarOpen((v) => !v)}
          className="p-2 text-stone-500"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {sidebarOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-stone-200 p-3 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-sans tracking-[0.08em]"
              style={{
                color: activeTab === id ? "oklch(0.12 0 0)" : "oklch(0.55 0 0)",
                backgroundColor:
                  activeTab === id ? "oklch(0.97 0.002 75)" : "transparent",
              }}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-sans text-stone-400"
          >
            <LogOut size={14} />
            Log Out
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0 p-6 lg:p-10 min-h-screen">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

// ─── Main Export ────────────────────────────────────────────────
export function AdminPage() {
  const { isAdminLoggedIn } = useAdmin();
  return isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />;
}
