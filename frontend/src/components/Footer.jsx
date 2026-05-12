import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3">SmartShop</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre boutique en ligne pour trouver les meilleurs produits au meilleur prix.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Navigation</h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/produits" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Produits</Link></li>
            <li><Link to="/panier"   className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Panier</Link></li>
            <li><Link to="/commandes" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Mes commandes</Link></li>
            <li><Link to="/wishlist" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Wishlist</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Contact</h3>
          <ul className="flex flex-col gap-2">
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={14} /> support@ecommerce.ma
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={14} /> +212 6 00 00 00 00
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin size={14} /> Rabat, Maroc
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SmartShop. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
