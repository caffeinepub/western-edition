import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  useNavigate as _useNavigate,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { WhatsAppFloat } from "./components/WhatsAppFloat";
import { AboutPage } from "./pages/AboutPage";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { OrderConfirmedPage } from "./pages/OrderConfirmedPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ShopPage } from "./pages/ShopPage";

import { AdminProvider } from "./store/adminStore";
// Providers
import { AuthProvider } from "./store/authStore";
import { CartProvider } from "./store/cartStore";
import { OrderProvider } from "./store/orderStore";
import { SearchProvider } from "./store/searchStore";
import { WishlistProvider } from "./store/wishlistStore";

// Layout component — standard site layout with Navbar/Footer
function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
}

// Admin layout — full screen, no Navbar/Footer
function AdminLayout() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const adminRootRoute = createRootRoute({
  component: AdminLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: ShopPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetailPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderConfirmedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmed",
  component: OrderConfirmedPage,
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) ?? "",
  }),
});

const accountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/account",
  component: AccountPage,
});

const adminRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  shopRoute,
  productRoute,
  aboutRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmedRoute,
  accountRoute,
]);

const adminRouteTree = adminRootRoute.addChildren([adminRoute]);

const router = createRouter({ routeTree });
const adminRouter = createRouter({ routeTree: adminRouteTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Determine which router to use based on current path
function AppContent() {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return (
      <AdminProvider>
        <OrderProvider>
          <RouterProvider router={adminRouter} />
        </OrderProvider>
      </AdminProvider>
    );
  }

  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <RouterProvider router={router} />
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default function App() {
  return <AppContent />;
}

// Re-export Link for convenience in components
export { Link };
