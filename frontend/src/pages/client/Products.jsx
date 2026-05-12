import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { getCategories, getProduitsFilter, ajouterLigne } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const Products = () => {
  const { t }           = useTranslation();
  const navigate        = useNavigate();
  const { getPanierID } = useCart();
  const { toast }       = useToast();

  const [loading, setLoading]         = useState(true);
  const [produits, setProduits]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [search, setSearch]           = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [prixMax, setPrixMax]         = useState('');
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);
  const [filterOpen, setFilterOpen]   = useState(false);

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getProduitsFilter(search, prixMax, categorieId, page).then((r) => {
      setProduits(r.data.data.data);
      setLastPage(r.data.data.last_page);
      setLoading(false);
    });
  }, [search, prixMax, categorieId, page]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  const handleAjouterAuPanier = async (e, produitId) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { navigate('/'); return; }
    try {
      const id = await getPanierID();
      await ajouterLigne(id, produitId, 1);
      toast('Produit ajouté au panier', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Stock insuffisant', 'error');
    }
  };

  const hasFilters = categorieId || prixMax;
  const clearFilters = () => { setCategorieId(''); setPrixMax(''); setPage(1); };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-8">

        {/* ── Barre de recherche + filtres ── */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Rechercher un produit..."
                className="w-full bg-white border border-gray-200 pl-11 pr-4 h-11 rounded-2xl shadow-sm text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 placeholder:text-gray-400 transition-all"
              />
              {search && (
                <button onClick={() => { setSearch(''); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 h-11 rounded-2xl border text-sm font-medium transition-all shadow-sm ${
                filterOpen || hasFilters
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtres
              {hasFilters && (
                <span className="w-5 h-5 rounded-full bg-white text-green-600 text-xs font-bold flex items-center justify-center">
                  {[categorieId, prixMax].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {filterOpen && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1.5 min-w-[180px]">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</label>
                <select
                  value={categorieId}
                  onChange={(e) => { setCategorieId(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white outline-none focus:border-green-400 cursor-pointer"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.categorie}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 min-w-[140px]">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prix maximum (DH)</label>
                <input
                  type="number"
                  value={prixMax}
                  onChange={(e) => { setPrixMax(e.target.value); setPage(1); }}
                  placeholder="Ex : 500"
                  min="0"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
                />
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
                  <X size={14} /> Réinitialiser
                </button>
              )}
            </div>
          )}

          {hasFilters && (
            <div className="flex flex-wrap gap-2">
              {categorieId && (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {categories.find((c) => String(c.id) === String(categorieId))?.categorie}
                  <button onClick={() => { setCategorieId(''); setPage(1); }}><X size={11} /></button>
                </span>
              )}
              {prixMax && (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  Max {prixMax} DH
                  <button onClick={() => { setPrixMax(''); setPage(1); }}><X size={11} /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Grille produits ── */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-gray-400 text-sm gap-2">
            <ShoppingCart size={18} className="animate-bounce" /> Chargement...
          </div>
        ) : produits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <Search size={40} className="text-gray-200" />
            <p className="text-sm">Aucun produit trouvé</p>
            <button onClick={clearFilters} className="text-xs text-green-600 hover:underline">Effacer les filtres</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/produits/${p.id}`)}
                className="bg-white flex flex-col rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    p.stock_produit > 50 ? 'bg-green-50 text-green-600' :
                    p.stock_produit > 10 ? 'bg-amber-50 text-amber-600' :
                    'bg-red-50 text-red-500'
                  }`}>
                    {p.stock_produit > 0 ? `${p.stock_produit} en stock` : 'Rupture'}
                  </span>
                </div>
                <div className="flex items-center justify-center h-44 rounded-xl mb-4 bg-gray-50">
                  <img src={p.image} alt={p.nom_prduit} className="h-full w-auto object-contain p-2" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">{p.nom_prduit}</h3>
                <p className="flex-1 text-xs text-gray-400 mt-1 line-clamp-2">{p.description_prduit}</p>
                <p className="font-bold text-gray-800 text-lg mt-3">{p.prix} DH</p>
                <button
                  type="button"
                  onClick={(e) => handleAjouterAuPanier(e, p.id)}
                  className="flex items-center justify-center gap-2 w-full font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl p-2.5 mt-3 transition-all duration-200 text-sm"
                >
                  <ShoppingCart size={16} /> {t('addToCart')}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {lastPage > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl border text-sm font-medium transition-colors ${page === p ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(page + 1)} disabled={page === lastPage} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
