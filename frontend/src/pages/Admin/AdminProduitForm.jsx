import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { adminCreateProduit, adminUpdateProduit, adminGetProduits, adminGetCategories } from '../../services/productService';

const AdminProduitForm = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [form, setForm] = useState({
    nom_prduit:         '',
    description_prduit: '',
    prix:               '',
    stock_produit:      '',
    image:              '',
    categorie_id:       '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const { toast }                   = useToast();

  useEffect(() => {
    adminGetCategories().then((res) => setCategories(res.data || []));

    if (isEdit) {
      adminGetProduits().then((res) => {
        const produit = (res.data || []).find((p) => p.id === parseInt(id));
        if (produit) {
          setForm({
            nom_prduit:         produit.nom_prduit         || '',
            description_prduit: produit.description_prduit || '',
            prix:               produit.prix               || '',
            stock_produit:      produit.stock_produit      || '',
            image:              produit.image              || '',
            categorie_id:       produit.categorie_id       || '',
          });
        }
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await adminUpdateProduit(id, form);
        toast('Produit mis à jour', 'success');
      } else {
        await adminCreateProduit(form);
        toast('Produit créé', 'success');
      }
      navigate('/admin/produits');
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Erreur');
      setError(msg);
      toast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'nom_prduit',         label: 'Nom du produit',    type: 'text'   },
    { name: 'description_prduit', label: 'Description',       type: 'textarea' },
    { name: 'prix',               label: 'Prix (DH)',         type: 'number' },
    { name: 'stock_produit',      label: 'Stock',             type: 'number' },
    { name: 'image',              label: 'URL de l\'image',   type: 'text'   },
  ];

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <ArrowLeft size={16} /> Retour
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ name, label, type }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    rows={3}
                    className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm resize-none"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm"
                  />
                )}
              </div>
            ))}

            {/* Catégorie */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500">Catégorie</label>
              <select
                name="categorie_id"
                value={form.categorie_id}
                onChange={handleChange}
                className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm bg-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.categorie}</option>
                ))}
              </select>
            </div>

            {/* Aperçu image */}
            {form.image && (
              <div className="flex justify-center">
                <img src={form.image} alt="Aperçu" className="h-32 object-contain rounded-xl border border-gray-100 p-2" />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <Save size={16} /> {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer le produit')}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProduitForm;
