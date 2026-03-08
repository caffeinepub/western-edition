import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./authStore";

interface SearchState {
  recentSearches: string[];
  addSearch: (term: string) => void;
  clearSearches: () => void;
}

const SearchContext = createContext<SearchState | null>(null);

function searchKey(customerId?: string) {
  return customerId ? `we_searches_${customerId}` : "we_searches_guest";
}

function loadSearches(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const { customer } = useAuth();
  const key = searchKey(customer?.id);
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    loadSearches(key),
  );

  useEffect(() => {
    setRecentSearches(loadSearches(key));
  }, [key]);

  const addSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase(),
        );
        const next = [trimmed, ...filtered].slice(0, 10);
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  const clearSearches = useCallback(() => {
    localStorage.removeItem(key);
    setRecentSearches([]);
  }, [key]);

  const value = useMemo(
    () => ({ recentSearches, addSearch, clearSearches }),
    [recentSearches, addSearch, clearSearches],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchStore(): SearchState {
  const ctx = useContext(SearchContext);
  if (!ctx)
    throw new Error("useSearchStore must be used within SearchProvider");
  return ctx;
}
