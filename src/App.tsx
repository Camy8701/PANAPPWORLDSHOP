import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/layout/CartSidebar";
import NewsletterPopup from "@/components/NewsletterPopup";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useCart } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import { useEffect } from "react";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Lookbook from "./pages/Lookbook";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingReturns from "./pages/ShippingReturns";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/* Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const cart = useCart();

  return (
    <>
      <ScrollToTop />
      <Header cartCount={cart.count} onCartClick={() => cart.setIsOpen(true)} />
      <CartSidebar
        isOpen={cart.isOpen}
        onClose={() => cart.setIsOpen(false)}
        items={cart.items}
        total={cart.total}
        onRemove={cart.removeItem}
        onUpdateQuantity={cart.updateQuantity}
      />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Collection />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:slug" element={<ProductDetail onAddToCart={cart.addItem} />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/checkout" element={<Checkout items={cart.items} total={cart.total} onOrderPlaced={cart.clearCart} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-and-returns" element={<ShippingReturns />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
