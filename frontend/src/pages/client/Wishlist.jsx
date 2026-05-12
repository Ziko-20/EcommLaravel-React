import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getWishlist, supprimerWishlist, ajouterLigne } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const Wishlist = () => {
  const navigate        = useNavigate();
  const { getPanierID } = useCart();
  const { toast }       = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]   = useState(true);

  const charger = () => {
    getWishlist()
      .then((res) => setWishlist(res.data || []))
      .catch(() => setWishlist([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleSupprimer = async (id) => {
    try {
      await supprimerWishlist(id);
      charger();
      toast('Retiré de la wishlist', 'info');
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const handleAjouterPanier = async (produitId) => {
    try {
      const id = await getPanierID();
      await ajouterLigne(id, produitId, 1);
      toast('Produit ajouté au panier', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Heart size={24} className="text-red-400" /> Ma Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-4">Votre wishlist est vide</p>
            <button onClick={() => navigate('/produits')} className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
                <div className="flex items-center justify-center h-40 rounded-xl mb-4 cursor-pointer bg-gray-50" onClick={() => navigate(`/produits/${item.produit?.id}`)}>
                  {item.produit?.image
                    ? <img src={item.produit.image} alt={item.produit.nom_prduit} className="h-full object-contain p-2" />
                    : <Heart size={40} className="text-gray-200" />}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{item.produit?.nom_prduit}</h3>
                <p className="text-green-600 font-bold mt-1">{item.produit?.prix} DH</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleAjouterPanier(item.produit?.id)} className="flex-1 flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-xl py-2 transition-colors">
                    <ShoppingCart size={14} /> Panier
                  </button>
                  <button onClick={() => handleSupprimer(item.id)} className="w-9 h-9 flex items-center justify-center border border-red-100 text-red-400 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
