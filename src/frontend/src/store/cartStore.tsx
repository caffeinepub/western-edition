import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./authStore";

export interface CartItem {
  productId: string;
  productName: string;
  material?: string;
  upholstery?: string;
  quantity: number;
  priceSnapshotInr: bigint;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: bigint;
  itemCount: number;
}

const CartContext = createContext<CartState | null>(null);

function cartKey(customerId?: string) {
  return customerId ? `we_cart_${customerId}` : "we_cart_guest";
}

function loadItems(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map(
      (item: CartItem & { priceSnapshotInr: string | bigint }) => ({
        ...item,
        priceSnapshotInr: BigInt(item.priceSnapshotInr),
      }),
    );
  } catch {
    return [];
  }
}

function saveItems(key: string, items: CartItem[]) {
  localStorage.setItem(
    key,
    JSON.stringify(
      items.map((item) => ({
        ...item,
        priceSnapshotInr: item.priceSnapshotInr.toString(),
      })),
    ),
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useAuth();
  const key = cartKey(customer?.id);
  const [items, setItems] = useState<CartItem[]>(() => loadItems(key));

  // Reload items when user changes (login/logout)
  useEffect(() => {
    setItems(loadItems(key));
  }, [key]);

  const persistItems = useCallback(
    (newItems: CartItem[]) => {
      saveItems(key, newItems);
      setItems(newItems);
    },
    [key],
  );

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.productId === item.productId &&
            i.material === item.material &&
            i.upholstery === item.upholstery,
        );
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.productId === item.productId &&
            i.material === item.material &&
            i.upholstery === item.upholstery
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          );
        } else {
          next = [...prev, item];
        }
        saveItems(key, next);
        return next;
      });
    },
    [key],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        saveItems(key, next);
        return next;
      });
    },
    [key],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        let next: CartItem[];
        if (quantity <= 0) {
          next = prev.filter((i) => i.productId !== productId);
        } else {
          next = prev.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          );
        }
        saveItems(key, next);
        return next;
      });
    },
    [key],
  );

  const clearCart = useCallback(() => {
    persistItems([]);
  }, [persistItems]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.priceSnapshotInr * BigInt(item.quantity),
        BigInt(0),
      ),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, total, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
