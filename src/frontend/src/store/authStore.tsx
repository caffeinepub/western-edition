import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: number;
}

interface StoredCustomer extends Customer {
  passwordHash: string;
}

interface AuthState {
  customer: Customer | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (name: string, phone: string) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function getStoredCustomers(): StoredCustomer[] {
  try {
    return JSON.parse(localStorage.getItem("we_customers") ?? "[]");
  } catch {
    return [];
  }
}

function saveCustomers(customers: StoredCustomer[]) {
  localStorage.setItem("we_customers", JSON.stringify(customers));
}

function generateId(): string {
  return `cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateToken(): string {
  return `tok_${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem("we_session") ?? "null");
      if (session?.token && session?.customerId) {
        const customers = getStoredCustomers();
        const found = customers.find((c) => c.id === session.customerId);
        if (found) {
          const { passwordHash: _pw, ...rest } = found;
          setCustomer(rest);
          setToken(session.token);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const customers = getStoredCustomers();
      const found = customers.find(
        (c) => c.email.toLowerCase() === email.toLowerCase(),
      );
      if (!found)
        return { success: false, error: "No account found with this email." };
      if (found.passwordHash !== simpleHash(password)) {
        return { success: false, error: "Incorrect password." };
      }
      const newToken = generateToken();
      const { passwordHash: _pw, ...rest } = found;
      setCustomer(rest);
      setToken(newToken);
      localStorage.setItem(
        "we_session",
        JSON.stringify({ token: newToken, customerId: found.id }),
      );
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    (
      email: string,
      password: string,
      name: string,
      phone: string,
    ): { success: boolean; error?: string } => {
      const customers = getStoredCustomers();
      if (
        customers.find((c) => c.email.toLowerCase() === email.toLowerCase())
      ) {
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      }
      const newCustomer: StoredCustomer = {
        id: generateId(),
        email: email.toLowerCase(),
        name,
        phone,
        passwordHash: simpleHash(password),
        createdAt: Date.now(),
      };
      saveCustomers([...customers, newCustomer]);
      const newToken = generateToken();
      const { passwordHash: _pw, ...rest } = newCustomer;
      setCustomer(rest);
      setToken(newToken);
      localStorage.setItem(
        "we_session",
        JSON.stringify({ token: newToken, customerId: newCustomer.id }),
      );
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem("we_session");
  }, []);

  const updateProfile = useCallback(
    (name: string, phone: string) => {
      if (!customer) return;
      const customers = getStoredCustomers();
      const updated = customers.map((c) =>
        c.id === customer.id ? { ...c, name, phone } : c,
      );
      saveCustomers(updated);
      setCustomer((prev) => (prev ? { ...prev, name, phone } : prev));
    },
    [customer],
  );

  const value = useMemo(
    () => ({
      customer,
      token,
      isLoggedIn: !!customer,
      login,
      register,
      logout,
      updateProfile,
    }),
    [customer, token, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
