import React, { useEffect, useState } from 'react';
import { Tag, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import {
  adminGetCategories,
  adminCreateCategorie,
  adminUpdateCategorie,
  adminDeleteCategorie,
} from '../../services/productService';
import Pagination from '../../components/Pagination';

const PER_PAGE = 7;

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newNom, setNewNom]         = useState('');
  const [editId, setEditId]         = useState(null);
  const [editNom, setEditNom]       = useState('');
  const [error, setError]           = useState('');
  const [page, setPage]             = useState(1);
  const { toast }                   = useToast();

  const charger = () => {
    adminGetCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { charger(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNom.trim()) return;
    try {
      await adminCreateCategorie({ categorie: newNom.trim() });
      setNewNom('');
      charger();
      setPage(1); // retour page 1 après ajout
      toast('Catégorie créée', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  const handleUpdate = async (id) => {
    if (!editNom.trim()) return;
    try {
      await adminUpdateCategorie(id, { categorie: editNom.trim() });
      setEditId(null);
      charger();
      toast('Catégorie mise à jour', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Erreur', 'error');
    }
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Supprimer "${nom}" ?`)) return;
    try {
      await adminDeleteCategorie(id);
      charger();
      toast(`"${nom}" supprimée`, 'info');
    } catch {
      toast('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Tag size={24} /> Catégories
      </h1>

      {/* Formulaire d'ajout */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Ajouter une catégorie</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-3">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newNom}
            onChange={(e) => setNewNom(e.target.value)}
            placeholder="Nom de la catégorie"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={16} /> Ajouter
          </button>
        </form>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-400">Chargement...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-400">Aucune catégorie</td>
                </tr>
              ) : (
                categories
                  .slice((page - 1) * PER_PAGE, page * PER_PAGE)
                  .map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-400">{c.id}</td>
                    <td className="px-6 py-4">
                      {editId === c.id ? (
                        <input
                          type="text"
                          value={editNom}
                          onChange={(e) => setEditNom(e.target.value)}
                          className="border border-green-300 rounded-lg px-3 py-1 text-sm outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-800">{c.categorie}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editId === c.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(c.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditId(c.id); setEditNom(c.categorie); }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id, c.categorie)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination
            page={page}
            totalPages={Math.ceil(categories.length / PER_PAGE)}
            onPage={setPage}
            total={categories.length}
            perPage={PER_PAGE}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;
