import React, { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { getCommandes, supprimerLigne, modifierLigne } from '../../services/productService';

const Panier = () => {
  const navigate        = useNavigate();
  const { setCommandeId } = useCart();
  const { toast }       = useToast();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading]   = useState(true);

  const chargerPanier = () => {
    getCommandes()
      .then((res) => {
        const enAttente = res.data.data.find((c) => c.statut === 'en_attente');
        setCommande(enAttente || null);
      })
      .catch(() => setCommande(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { chargerPanier(); }, []);

  const handleSupprimer = async (ligneId) => {
    try {
      await supprimerLigne(commande.id, ligneId);
      chargerPanier();
      toast('Article retiré du panier', 'info');
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const handleModifier = async (ligneId, nouvelleQte) => {
    if (!commande || nouvelleQte < 1) return;
    try {
      await modifierLigne(commande.id, ligneId, nouvelleQte);
      chargerPanier();
    } catch (err) {
      toast(err.response?.data?.message || 'Stock insuffisant', 'error');
    }
  };

  const handlePaySuccess = () => {
    toast('Paiement effectué avec succès', 'success');
    setTimeout(() => navigate('/commandes'), 800);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Chargement...</div>
    </div>
  );

  const lignes = commande?.ligne_commande || [];

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-screen-lg mx-auto w-full px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} /> Mon Panier
        </h1>

        {lignes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-4">Votre panier est vide</p>
            <button onClick={() => navigate('/produits')} className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
              Découvrir les produits
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {lignes.map((ligne) => (
                <div key={ligne.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    {ligne.produit?.image
                      ? <img src={ligne.produit.image} alt={ligne.produit.nom_prduit} className="h-full object-contain p-1" />
                      : <ShoppingBag size={24} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{ligne.produit?.nom_prduit}</h3>
                    <p className="text-green-600 font-bold mt-1">{ligne.produit?.prix} DH</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleModifier(ligne.id, ligne.quantite - 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{ligne.quantite}</span>
                    <button onClick={() => handleModifier(ligne.id, ligne.quantite + 1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                      <Plus size={12} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-800 w-20 text-right text-sm">{ligne.sous_total} DH</p>
                  <button onClick={() => handleSupprimer(ligne.id)} className="text-red-400 hover:text-red-600 transition-colors ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
              <h2 className="font-bold text-gray-800 mb-4">Résumé</h2>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Sous-total ({lignes.length} article{lignes.length > 1 ? 's' : ''})</span>
                <span>{commande?.total} DH</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Livraison</span>
                <span className="text-green-600">Gratuite</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>{commande?.total} DH</span>
              </div>
              <button
                onClick={() => navigate('/paiement', { state: { total: commande?.total, lignes } })}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
              >
                Passer au paiement <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Panier;
