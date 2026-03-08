import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface OrderItem {
  productId: string;
  productName: string;
  material?: string;
  upholstery?: string;
  quantity: number;
  priceSnapshotInr: bigint;
}

export interface DeliveryAddress {
  name: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export type PaymentMethod = "cod" | "prepaid" | "partial";

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: PaymentMethod;
  tokenAmount: number;
  partialPercent: number;
  orderTotal: bigint;
  status: "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: number;
}

type PlaceOrderInput = Omit<Order, "id" | "createdAt" | "status">;

interface OrderState {
  orders: Order[];
  placeOrder: (order: PlaceOrderInput) => string;
  cancelOrder: (orderId: string) => boolean;
  getMyOrders: (customerId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderState | null>(null);

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem("we_orders");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map(
      (
        o: Order & {
          orderTotal: string;
          items: (OrderItem & { priceSnapshotInr: string })[];
        },
      ) => ({
        ...o,
        orderTotal: BigInt(o.orderTotal),
        items: o.items.map((item) => ({
          ...item,
          priceSnapshotInr: BigInt(item.priceSnapshotInr),
        })),
      }),
    );
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(
    "we_orders",
    JSON.stringify(
      orders.map((o) => ({
        ...o,
        orderTotal: o.orderTotal.toString(),
        items: o.items.map((item) => ({
          ...item,
          priceSnapshotInr: item.priceSnapshotInr.toString(),
        })),
      })),
    ),
  );
}

function generateOrderId(): string {
  const now = Date.now();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `WE${now.toString().slice(-6)}${rand}`;
}

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  const refreshOrders = useCallback(() => {
    setOrders(loadOrders());
  }, []);

  const placeOrder = useCallback((input: PlaceOrderInput): string => {
    const newOrder: Order = {
      ...input,
      id: generateOrderId(),
      createdAt: Date.now(),
      status: "Confirmed",
    };
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      saveOrders(next);
      return next;
    });
    return newOrder.id;
  }, []);

  const cancelOrder = useCallback((orderId: string): boolean => {
    let success = false;
    setOrders((prev) => {
      const order = prev.find((o) => o.id === orderId);
      if (!order || order.status !== "Confirmed") return prev;
      const next = prev.map((o) =>
        o.id === orderId ? { ...o, status: "Cancelled" as const } : o,
      );
      saveOrders(next);
      success = true;
      return next;
    });
    return success;
  }, []);

  const getMyOrders = useCallback(
    (customerId: string): Order[] => {
      return orders
        .filter((o) => o.customerId === customerId)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    [orders],
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
      setOrders((prev) => {
        const next = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
        saveOrders(next);
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      orders,
      placeOrder,
      cancelOrder,
      getMyOrders,
      updateOrderStatus,
      refreshOrders,
    }),
    [
      orders,
      placeOrder,
      cancelOrder,
      getMyOrders,
      updateOrderStatus,
      refreshOrders,
    ],
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders(): OrderState {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
