import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { adminGetProduits, adminDeleteProduit } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const AdminProduits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const { toast }               = useToast();

  const charger = () => {
    adminGetProduits()
      .then((res) => setProduits(res.data || []))
      .catch(() => setProduits([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer "${nom}" ?`)) return;
    try {
      await adminDeleteProduit(id);
      charger();
      toast(`"${nom}" supprimé`, 'info');
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = produits.filter((p) =>
    p.nom_prduit?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package size={24} /> Produits
        </h1>
        <Link
          to="/admin/produits/add"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} /> Ajouter
        </Link>
      </div>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 bg-white pl-10 pr-4 h-11 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-100 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Produit</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Prix</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Aucun produit trouvé</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.nom_prduit} className="w-10 h-10 object-contain rounded-lg bg-gray-50" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{p.nom_prduit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.categorie?.categorie ?? '—'}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.prix} DH</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.stock_produit > 50 ? 'bg-green-50 text-green-600' :
                        p.stock_produit > 10 ? 'bg-amber-50 text-amber-600' :
                        'bg-red-50 text-red-500'
                      }`}>
                        {p.stock_produit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/produits/edit/${p.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.nom_prduit)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProduits;
