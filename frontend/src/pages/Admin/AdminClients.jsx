import React, { useEffect, useState } from 'react';
import {
  Users, Trash2, Search, Mail, Phone,
  MapPin, Pencil, X, Check, AlertTriangle,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { adminGetClients, adminUpdateClient, adminDeleteClient } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

/* ── Modal d'édition ── */
const EditModal = ({ client, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:      client.name      || '',
    email:     client.email     || '',
    telephone: client.telephone || '',
    adresse:   client.adresse   || '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(client.id, form);
      onClose();
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(
        errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Erreur'),
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Pencil size={16} className="text-green-500" /> Modifier le client
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
          {[
            { key: 'name',      label: 'Nom complet',  icon: Users,  type: 'text'  },
            { key: 'email',     label: 'Email',        icon: Mail,   type: 'email' },
            { key: 'telephone', label: 'Téléphone',    icon: Phone,  type: 'text'  },
            { key: 'adresse',   label: 'Adresse',      icon: MapPin, type: 'text'  },
          ].map(({ key, label, icon: Icon, type }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                <Icon size={13} /> {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400 transition-colors"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <Check size={15} /> {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Modal de confirmation de suppression ── */
const DeleteModal = ({ client, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(client.id, client.name);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800 mb-1">Supprimer ce client ?</p>
          <p className="text-sm text-gray-500">
            Le compte de <span className="font-semibold text-gray-700">{client.name}</span> et toutes ses données seront supprimés définitivement.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Trash2 size={14} /> {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Page principale ── */
const AdminClients = () => {
  const [clients, setClients]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [editClient, setEditClient]     = useState(null);
  const [deleteClient, setDeleteClient] = useState(null);
  const { toast } = useToast();

  const charger = () => {
    adminGetClients()
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleSave = async (id, data) => {
    await adminUpdateClient(id, data);
    charger();
    toast('Client mis à jour', 'success');
  };

  const handleDelete = async (id, nom) => {
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
        <span className="ml-2 text-sm font-normal text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
          {clients.length}
        </span>
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
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
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
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-400">ID #{c.id}</p>
                        </div>
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
                      <div className="flex items-center justify-end gap-2">
                        {/* Modifier */}
                        <button
                          onClick={() => setEditClient(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        {/* Supprimer */}
                        <button
                          onClick={() => setDeleteClient(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
                          title="Supprimer"
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

      {/* Modal édition */}
      {editClient && (
        <EditModal
          client={editClient}
          onClose={() => setEditClient(null)}
          onSave={handleSave}
        />
      )}

      {/* Modal suppression */}
      {deleteClient && (
        <DeleteModal
          client={deleteClient}
          onClose={() => setDeleteClient(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default AdminClients;
