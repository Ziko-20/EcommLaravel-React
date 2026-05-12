import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Lock, ShieldCheck, ArrowLeft,
  CheckCircle2, Loader2, Plus, Minus,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../context/ToastContext';

const STEPS = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success' };

const Paiement = () => {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { toast }     = useToast();

  // Le panier passe total + lignes via state
  const { total = 0, lignes = [] } = location.state || {};

  const [step, setStep]       = useState(STEPS.FORM);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry]   = useState('');
  const [cvv, setCvv]         = useState('');
  const [name, setName]       = useState('');
  const [errors, setErrors]   = useState({});

  const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const validate = () => {
    const e = {};
    if (cardNum.replace(/\s/g, '').length < 16) e.cardNum = 'Numéro de carte invalide (16 chiffres)';
    if (!name.trim())    e.name    = 'Nom du titulaire requis';
    if (expiry.length < 5) e.expiry = 'Date d\'expiration invalide (MM/AA)';
    if (cvv.length < 3)  e.cvv    = 'CVV invalide (3 ou 4 chiffres)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStep(STEPS.PROCESSING);
    setTimeout(() => {
      setStep(STEPS.SUCCESS);
      toast('Paiement effectué avec succès', 'success');
      setTimeout(() => navigate('/commandes'), 2500);
    }, 2200);
  };

  /* ── Étape processing ── */
  if (step === STEPS.PROCESSING) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <Loader2 size={40} className="text-green-500 animate-spin" />
        </div>
        <p className="font-semibold text-gray-700 text-lg">Traitement du paiement...</p>
        <p className="text-sm text-gray-400">Veuillez ne pas fermer cette page</p>
      </div>
    </div>
  );

  /* ── Étape succès ── */
  if (step === STEPS.SUCCESS) return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={52} className="text-green-500" />
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800 text-2xl mb-2">Paiement réussi</p>
          <p className="text-sm text-gray-400">Votre commande a été confirmée. Redirection en cours...</p>
        </div>
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-[progress_2.5s_linear_forwards]" />
        </div>
      </div>
    </div>
  );

  /* ── Formulaire ── */
  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-screen-lg mx-auto w-full px-6 py-8">
        {/* Retour */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Retour au panier
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <CreditCard size={24} /> Paiement sécurisé
        </h1>

        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Formulaire (3/5) ── */}
          <form onSubmit={handlePay} className="lg:col-span-3 flex flex-col gap-5">

            {/* Numéro de carte */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                <CreditCard size={16} className="text-green-500" /> Informations de carte
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Numéro de carte</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNum}
                    onChange={(e) => setCardNum(fmtCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm outline-none font-mono tracking-widest transition-colors ${
                      errors.cardNum ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-green-400'
                    }`}
                  />
                  <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                {errors.cardNum && <p className="text-xs text-red-500">{errors.cardNum}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom du titulaire</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="DUPONT JEAN"
                  className={`border rounded-xl px-4 py-3 text-sm outline-none uppercase tracking-wide transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-green-400'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expiration</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                    placeholder="MM/AA"
                    className={`border rounded-xl px-4 py-3 text-sm outline-none font-mono transition-colors ${
                      errors.expiry ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-green-400'
                    }`}
                  />
                  {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    className={`border rounded-xl px-4 py-3 text-sm outline-none font-mono transition-colors ${
                      errors.cvv ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-green-400'
                    }`}
                  />
                  {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-3">
              <ShieldCheck size={18} className="text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-700">
                Paiement 100% sécurisé — Simulation uniquement, aucune donnée réelle n'est transmise.
              </p>
            </div>

            {/* Bouton payer */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 text-base transition-colors shadow-sm"
            >
              <Lock size={18} /> Payer {total} DH
            </button>
          </form>

          {/* ── Récapitulatif (2/5) ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-gray-700 mb-4">Récapitulatif</h2>

              {lignes.length > 0 && (
                <div className="flex flex-col gap-3 mb-4">
                  {lignes.map((ligne) => (
                    <div key={ligne.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {ligne.produit?.image
                          ? <img src={ligne.produit.image} alt="" className="h-full object-contain p-1" />
                          : <CreditCard size={14} className="text-gray-300" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{ligne.produit?.nom_prduit}</p>
                        <p className="text-xs text-gray-400">x{ligne.quantite}</p>
                      </div>
                      <p className="text-xs font-semibold text-gray-700">{ligne.sous_total} DH</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sous-total</span>
                  <span>{total} DH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Livraison</span>
                  <span className="text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{total} DH</span>
                </div>
              </div>
            </div>

            {/* Logos cartes */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center gap-3">
              {['VISA', 'MC', 'AMEX', 'CMI'].map((c) => (
                <span key={c} className="text-xs font-bold text-gray-400 border border-gray-200 rounded-lg px-2 py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Paiement;
