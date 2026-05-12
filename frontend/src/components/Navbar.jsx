import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Languages, ShoppingCart, Heart, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logoCadree from '../assets/logoCadree.png';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="bg-white shadow-sm flex justify-between items-center h-16 px-6 sticky top-0 z-50">
      {/* Logo */}
      <Link to={user ? '/produits' : '/'}>
        <img src={logoCadree} alt="Logo" className="h-8 w-auto" />
      </Link>

      {/* Navigation links */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            <Link to="/produits" className="text-sm text-gray-500 hover:text-gray-900 hover:font-medium transition-colors">
              {t('products')}
            </Link>
            <Link to="/panier" className="text-sm text-gray-500 hover:text-gray-900 hover:font-medium transition-colors flex items-center gap-1">
              <ShoppingCart size={16} />
              {t('cart')}
            </Link>
            <Link to="/wishlist" className="text-sm text-gray-500 hover:text-gray-900 hover:font-medium transition-colors flex items-center gap-1">
              <Heart size={16} />
              Wishlist
            </Link>
            <Link to="/commandes" className="text-sm text-gray-500 hover:text-gray-900 hover:font-medium transition-colors">
              Commandes
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-sm text-gray-500 hover:text-gray-900 hover:font-medium transition-colors flex items-center gap-1">
                <LayoutDashboard size={16} />
                Admin
              </Link>
            )}
          </>
        )}

        {/* Language switcher */}
        <div className="flex items-center gap-1 text-gray-700">
          <Languages size={18} className="text-gray-500" />
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="text-sm text-gray-700 outline-none cursor-pointer bg-transparent"
          >
            <option value="fr">Fr</option>
            <option value="en">En</option>
          </select>
        </div>

        {/* User menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100"
            >
              <User size={16} />
              <span className="max-w-[100px] truncate">{user.name}</span>
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                <Link
                  to="/profil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User size={14} /> {t('profil')}
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/" className="text-sm font-medium text-green-600 hover:text-green-700">
            {t('login')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
