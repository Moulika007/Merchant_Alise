import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import SellerDashboard from './pages/SellerDashboard';
import CartPage from './pages/buyer/CartPage';
import BuyerDashboard from './pages/BuyerDashboard';
import ProductDetailsPage from './pages/buyer/ProductDetailsPage';

// Protected Route Wrapper
const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { role, isLoading } = useAuth();
  if (isLoading) return null; // wait for localStorage to restore auth state
  if (role !== 'seller') {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

import Navbar from './components/layout/Navbar';
import ScrollToTopButton from './components/layout/ScrollToTopButton';
import Footer from './components/layout/Footer';

function Layout() {
  return (
    <div className="min-h-screen bg-muted font-sans text-primary flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="store" element={<HomePage />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="buyer/*" element={<BuyerDashboard />} />
              <Route path="seller/*" element={
                <SellerRoute>
                  <SellerDashboard />
                </SellerRoute>
              } />
            </Route>
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}
