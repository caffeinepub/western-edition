import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./authStore";

interface WishlistState {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
}

const WishlistContext = createContext<WishlistState | null>(null);

function wishlistKey(customerId?: string) {
  return customerId ? `we_wishlist_${customerId}` : "we_wishlist_guest";
}

function loadIds(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useAuth();
  const key = wishlistKey(customer?.id);
  const [productIds, setProductIds] = useState<string[]>(() => loadIds(key));

  useEffect(() => {
    setProductIds(loadIds(key));
  }, [key]);

  const persist = useCallback(
    (ids: string[]) => {
      localStorage.setItem(key, JSON.stringify(ids));
      setProductIds(ids);
    },
    [key],
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      setProductIds((prev) => {
        if (prev.includes(productId)) return prev;
        const next = [...prev, productId];
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setProductIds((prev) => {
        const next = prev.filter((id) => id !== productId);
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const toggle = useCallback(
    (productId: string) => {
      setProductIds((prev) => {
        const next = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const value = useMemo(
    () => ({
      productIds,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      toggle,
    }),
    [productIds, addToWishlist, removeFromWishlist, isWishlisted, toggle],
  );

  // satisfy persist usage
  void persist;

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistState {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
