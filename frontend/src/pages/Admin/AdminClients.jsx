import React, { useEffect, useState } from 'react';
import { Users, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { adminGetClients, adminDeleteClient } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const { toast } = useToast();

  const charger = () => {
    adminGetClients()
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer le client "${nom}" ?`)) return;
    try {
      await adminDeleteClient(id);
      charger();
      toast(`Client "${nom}" supprimé`, 'info');
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  const filtered = clients.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users size={24} /> Clients
      </h1>

      {/* Recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Adresse</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Aucun client trouvé</td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Mail size={12} /> {c.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Phone size={12} /> {c.telephone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={12} /> {c.adresse}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
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

export default AdminClients;
