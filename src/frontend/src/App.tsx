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
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ShopPage } from "./pages/ShopPage";

// Layout component
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

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  shopRoute,
  productRoute,
  aboutRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

// Re-export Link for convenience in components
export { Link };
