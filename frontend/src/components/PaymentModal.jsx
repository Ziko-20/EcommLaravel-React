import React, { useState } from 'react';
import {
  X, CreditCard, Lock, CheckCircle2,
  Loader2, ShieldCheck,
} from 'lucide-react';

const STEPS = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success' };

const PaymentModal = ({ total, onClose, onSuccess }) => {
  const [step, setStep]         = useState(STEPS.FORM);
  const [cardNum, setCardNum]   = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');
  const [name, setName]         = useState('');
  const [error, setError]       = useState('');

  /* ── formatters ── */
  const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handlePay = (e) => {
    e.preventDefault();
    setError('');
    if (cardNum.replace(/\s/g, '').length < 16) return setError('Numéro de carte invalide');
    if (expiry.length < 5)  return setError('Date d\'expiration invalide');
    if (cvv.length < 3)     return setError('CVV invalide');
    if (!name.trim())       return setError('Nom du titulaire requis');

    setStep(STEPS.PROCESSING);
    setTimeout(() => {
      setStep(STEPS.SUCCESS);
      setTimeout(() => onSuccess(), 2000);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={step === STEPS.FORM ? onClose : undefined} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── Processing ── */}
        {step === STEPS.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <Loader2 size={48} className="text-green-500 animate-spin" />
            <p className="font-semibold text-gray-700">Traitement du paiement...</p>
            <p className="text-xs text-gray-400">Veuillez patienter</p>
          </div>
        )}

        {/* ── Success ── */}
        {step === STEPS.SUCCESS && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-4">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
            <p className="font-bold text-gray-800 text-lg">Paiement réussi !</p>
            <p className="text-sm text-gray-400 text-center">
              Votre commande a été confirmée. Vous allez être redirigé...
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {step === STEPS.FORM && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-green-600" />
                <span className="font-bold text-gray-800">Paiement sécurisé</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Total */}
            <div className="mx-6 mt-4 bg-green-50 rounded-2xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Montant à payer</span>
              <span className="font-bold text-green-700 text-lg">{total} DH</span>
            </div>

            <form onSubmit={handlePay} className="px-6 py-4 flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              {/* Numéro de carte */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Numéro de carte</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNum}
                    onChange={(e) => setCardNum(fmtCard(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-400 font-mono tracking-widest"
                  />
                  <CreditCard size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
              </div>

              {/* Nom */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom du titulaire</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="DUPONT Jean"
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 uppercase"
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expiration</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                    placeholder="MM/AA"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 font-mono"
                  />
                </div>
              </div>

              {/* Cartes acceptées */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} className="text-green-500" />
                Paiement 100% sécurisé — Simulation uniquement
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors mt-1"
              >
                <Lock size={15} /> Payer {total} DH
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
