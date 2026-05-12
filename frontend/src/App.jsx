import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TransitionRegister from './components/TransitionRegister';
import NotFound from './components/NotFound';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Auth
import Login    from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client
import Products      from './pages/client/Products';
import ProductDetail from './pages/client/ProductDetail';
import Panier        from './pages/client/Panier';
import Commandes     from './pages/client/Commandes';
import CommandeDetail from './pages/client/CommandeDetail';
import Wishlist      from './pages/client/Wishlist';
import Profil        from './pages/client/Profil';
import Paiement      from './pages/client/Paiement';

// Admin
import Dashboard      from './Pages/admin/Dashboard';
import AdminProduits  from './Pages/admin/AdminProduits';
import AdminProduitForm from './Pages/admin/AdminProduitForm';
import AdminCategories from './Pages/admin/AdminCategories';
import AdminClients   from './Pages/admin/AdminClients';
import AdminCommandes from './Pages/admin/AdminCommandes';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* Auth */}
            <Route path="/"         element={<TransitionRegister><Login /></TransitionRegister>} />
            <Route path="/register" element={<TransitionRegister><Register /></TransitionRegister>} />

            {/* Client (protégé) */}
            <Route path="/produits"        element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/produits/:id"    element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
            <Route path="/panier"          element={<ProtectedRoute><Panier /></ProtectedRoute>} />
            <Route path="/commandes"       element={<ProtectedRoute><Commandes /></ProtectedRoute>} />
            <Route path="/commandes/:id"   element={<ProtectedRoute><CommandeDetail /></ProtectedRoute>} />
            <Route path="/wishlist"        element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/profil"          element={<ProtectedRoute><Profil /></ProtectedRoute>} />
            <Route path="/paiement"        element={<ProtectedRoute><Paiement /></ProtectedRoute>} />

            {/* Admin (protégé + rôle admin) */}
            <Route path="/admin/dashboard"        element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path="/admin/produits"         element={<AdminRoute><AdminProduits /></AdminRoute>} />
            <Route path="/admin/produits/add"     element={<AdminRoute><AdminProduitForm /></AdminRoute>} />
            <Route path="/admin/produits/edit/:id" element={<AdminRoute><AdminProduitForm /></AdminRoute>} />
            <Route path="/admin/categories"       element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/clients"          element={<AdminRoute><AdminClients /></AdminRoute>} />
            <Route path="/admin/commandes"        element={<AdminRoute><AdminCommandes /></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </AnimatePresence>
      </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
