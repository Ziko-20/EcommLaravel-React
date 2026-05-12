import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { getProduitById, ajouterLigne, ajouterWishlist } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProductDetail = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { getPanierID } = useCart();
  const { toast }  = useToast();

  const [produit, setProduit]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    getProduitById(id).then((r) => { setProduit(r.data.data); setLoading(false); });
  }, [id]);

  const handleAjouterAuPanier = async () => {
    if (!localStorage.getItem('token')) { navigate('/'); return; }
    try {
      const panierID = await getPanierID();
      await ajouterLigne(panierID, produit.id, quantite);
      toast(`${quantite} article${quantite > 1 ? 's' : ''} ajouté${quantite > 1 ? 's' : ''} au panier`, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Stock insuffisant', 'error');
    }
  };

  const handleWishlist = async () => {
    if (!localStorage.getItem('token')) { navigate('/'); return; }
    try {
      await ajouterWishlist(produit.id);
      toast('Ajouté à la wishlist', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Déjà dans la wishlist', 'info');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Chargement...</div>
      <Footer />
    </div>
  );

  if (!produit) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Produit introuvable</div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />

      <div className="flex-1 w-full px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Retour aux produits
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-sm grid md:grid-cols-2 gap-10">
            {/* Image */}
            <div className="flex items-center justify-center rounded-xl h-80 bg-gray-50">
              <img src={produit.image} alt={produit.nom_prduit} className="h-full object-contain p-4" />
            </div>

            {/* Infos */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-gray-800">{produit.nom_prduit}</h1>
              <p className="text-gray-400 text-sm">{produit.description_prduit}</p>

              <span className={`text-xs w-fit font-medium px-3 py-1 rounded-full ${
                produit.stock_produit > 50 ? 'bg-green-50 text-green-600' :
                produit.stock_produit > 10 ? 'bg-amber-50 text-amber-600' :
                'bg-red-50 text-red-500'
              }`}>
                {produit.stock_produit} en stock
              </span>

              <p className="text-3xl font-bold text-gray-800">{produit.prix} DH</p>

              {/* Sélecteur quantité */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Quantité :</span>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                    disabled={quantite <= 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800">{quantite}</span>
                  <button
                    onClick={() => setQuantite((q) => Math.min(produit.stock_produit, q + 1))}
                    disabled={quantite >= produit.stock_produit}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600 disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">/ {produit.stock_produit} disponibles</span>
              </div>

              <button
                onClick={handleAjouterAuPanier}
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl p-3 transition-all duration-200"
              >
                <ShoppingCart size={18} /> Ajouter au panier — {(produit.prix * quantite).toFixed(2)} DH
              </button>

              <button
                onClick={handleWishlist}
                className="flex items-center justify-center gap-2 border border-red-200 text-red-400 hover:bg-red-50 font-semibold rounded-xl p-3 transition-all duration-200"
              >
                <Heart size={18} /> Ajouter à la wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
