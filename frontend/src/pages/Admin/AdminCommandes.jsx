import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronDown, Clock, Truck, CheckCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { adminGetCommandes, adminUpdateStatutCommande } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Pagination';

const PER_PAGE = 7;

const statutConfig = {
  en_attente: { label: 'En attente',  color: 'bg-amber-50 text-amber-600',  icon: Clock       },
  expediee:   { label: 'Expédiée',    color: 'bg-blue-50 text-blue-600',    icon: Truck       },
  livree:     { label: 'Livrée',      color: 'bg-green-50 text-green-600',  icon: CheckCircle },
};

const AdminCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('');
  const [page, setPage]           = useState(1);
  const { toast }                 = useToast();

  const charger = () => {
    adminGetCommandes()
      .then((res) => setCommandes(res.data || []))
      .catch(() => setCommandes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleStatut = async (id, statut) => {
    try {
      await adminUpdateStatutCommande(id, statut);
      charger();
      const labels = { en_attente: 'En attente', expediee: 'Expédiée', livree: 'Livrée' };
      toast(`Statut mis à jour : ${labels[statut]}`, 'success');
    } catch {
      toast('Erreur lors de la mise à jour', 'error');
    }
  };

  const filtered = filter
    ? commandes.filter((c) => c.statut === filter)
    : commandes;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Remet à la page 1 quand le filtre change
  const handleFilter = (val) => { setFilter(val); setPage(1); };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag size={24} /> Commandes
        </h1>
        <select
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white outline-none focus:border-green-500"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="expediee">Expédiée</option>
          <option value="livree">Livrée</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">Aucune commande</td>
                </tr>
              ) : (
                paginated.map((commande) => {
                  const cfg  = statutConfig[commande.statut] || statutConfig.en_attente;
                  const Icon = cfg.icon;
                  return (
                    <tr key={commande.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono">#{commande.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{commande.user?.name ?? '—'}</p>
                          <p className="text-xs text-gray-400">{commande.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{commande.date_commande}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{commande.total} DH</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 w-fit text-xs font-medium px-3 py-1 rounded-full ${cfg.color}`}>
                          <Icon size={12} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={commande.statut}
                            onChange={(e) => handleStatut(commande.id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-green-500 cursor-pointer appearance-none pr-7"
                          >
                            <option value="en_attente">En attente</option>
                            <option value="expediee">Expédiée</option>
                            <option value="livree">Livrée</option>
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPage={setPage}
            total={filtered.length}
            perPage={PER_PAGE}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCommandes;
