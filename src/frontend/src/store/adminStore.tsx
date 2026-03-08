import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DEFAULT_ADMIN_EMAIL = "admin@westernedition.in";
const DEFAULT_ADMIN_PASSWORD = "WE@Admin2024";

interface AdminState {
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
}

const AdminContext = createContext<AdminState | null>(null);

function getAdminCreds(): { email: string; password: string } {
  try {
    const stored = localStorage.getItem("we_admin_creds");
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return { email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD };
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem("we_admin_session");
      if (session) {
        const { token } = JSON.parse(session);
        if (token) setAdminToken(token);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const creds = getAdminCreds();
      if (
        email.toLowerCase() === creds.email.toLowerCase() &&
        password === creds.password
      ) {
        const token = `admin_tok_${Date.now()}`;
        setAdminToken(token);
        localStorage.setItem("we_admin_session", JSON.stringify({ token }));
        return { success: true };
      }
      return { success: false, error: "Invalid admin credentials." };
    },
    [],
  );

  const logout = useCallback(() => {
    setAdminToken(null);
    localStorage.removeItem("we_admin_session");
  }, []);

  const value = useMemo(
    () => ({
      isAdminLoggedIn: !!adminToken,
      adminToken,
      login,
      logout,
    }),
    [adminToken, login, logout],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin(): AdminState {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
