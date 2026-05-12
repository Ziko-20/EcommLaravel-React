import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCommandeById } from '../../services/productService';

const etapes = [
  { statut: 'en_attente', label: 'Commande passée',  icon: Clock       },
  { statut: 'expediee',   label: 'En cours de livraison', icon: Truck  },
  { statut: 'livree',     label: 'Livrée',            icon: CheckCircle },
];

const statutIndex = { en_attente: 0, expediee: 1, livree: 2 };

const CommandeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getCommandeById(id)
      .then((res) => setCommande(res.data.data))
      .catch(() => setCommande(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Chargement...</div>
      <Footer />
    </div>
  );

  if (!commande) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center items-center text-gray-400">Commande introuvable</div>
      <Footer />
    </div>
  );

  const currentStep = statutIndex[commande.statut] ?? 0;
  const lignes = commande.ligne_commande || [];

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-screen-lg mx-auto w-full px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft size={16} /> Retour aux commandes
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package size={24} /> Commande #{commande.id}
          </h1>
          <p className="text-sm text-gray-400">{commande.date_commande}</p>
        </div>

        {/* Suivi de commande */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-6">Suivi de la commande</h2>
          <div className="flex items-center justify-between relative">
            {/* Ligne de progression */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-green-500 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (etapes.length - 1)) * 100}%` }}
            />

            {etapes.map((etape, index) => {
              const Icon = etape.icon;
              const done = index <= currentStep;
              return (
                <div key={etape.statut} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-medium text-center max-w-[80px] ${done ? 'text-green-600' : 'text-gray-400'}`}>
                    {etape.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">Articles commandés</h2>
          <div className="flex flex-col gap-3">
            {lignes.map((ligne) => (
              <div key={ligne.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {ligne.produit?.image ? (
                    <img src={ligne.produit.image} alt={ligne.produit.nom_prduit} className="h-full object-contain p-1" />
                  ) : (
                    <ShoppingBag size={20} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{ligne.produit?.nom_prduit}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Quantité : {ligne.quantite}</p>
                </div>
                <p className="font-bold text-gray-800 text-sm">{ligne.sous_total} DH</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Sous-total</span>
            <span>{commande.total} DH</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Livraison</span>
            <span className="text-green-600">Gratuite</span>
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>{commande.total} DH</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CommandeDetail;
