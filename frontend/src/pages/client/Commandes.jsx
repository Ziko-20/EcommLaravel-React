import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCommandes } from '../../services/productService';

const statutConfig = {
  en_attente: { label: 'En attente',  icon: Clock,       color: 'bg-amber-50 text-amber-600' },
  expediee:   { label: 'Expédiée',    icon: Truck,       color: 'bg-blue-50 text-blue-600'   },
  livree:     { label: 'Livrée',      icon: CheckCircle, color: 'bg-green-50 text-green-600' },
};

const Commandes = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getCommandes()
      .then((res) => setCommandes(res.data.data || []))
      .catch(() => setCommandes([]))
      .finally(() => setLoading(false));
  }, []);

  // Exclure le panier en_attente de la liste des commandes passées
  const commandesPassees = commandes.filter((c) => c.statut !== 'en_attente');

  if (loading) return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <Navbar />
      <div className="flex justify-center items-center h-64 text-gray-400">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-screen-lg mx-auto w-full px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Package size={24} /> Mes Commandes
        </h1>

        {commandesPassees.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Package size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 mb-4">Aucune commande pour le moment</p>
            <button
              onClick={() => navigate('/produits')}
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Commencer mes achats
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {commandesPassees.map((commande) => {
              const cfg = statutConfig[commande.statut] || statutConfig.en_attente;
              const Icon = cfg.icon;
              return (
                <div
                  key={commande.id}
                  onClick={() => navigate(`/commandes/${commande.id}`)}
                  className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Commande #{commande.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{commande.date_commande}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${cfg.color}`}>
                      <Icon size={12} /> {cfg.label}
                    </span>
                    <p className="font-bold text-gray-800 text-sm">{commande.total} DH</p>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Commandes;
