import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Lock, ShieldCheck, ArrowLeft,
  CheckCircle2, Loader2, Download, Truck, Banknote,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useToast } from '../../context/ToastContext';

const STEPS   = { FORM: 'form', PROCESSING: 'processing', SUCCESS: 'success' };
const METHODS = { CARD: 'card', COD: 'cod' }; // cod = cash on delivery

const Paiement = () => {
  const navigate      = useNavigate();
  const location      = useLocation();
  const { toast }     = useToast();

  // Le panier passe total + lignes via state
  const { total = 0, lignes = [] } = location.state || {};

  const [step, setStep]       = useState(STEPS.FORM);
  const [method, setMethod]     = useState(METHODS.CARD); // méthode sélectionnée
  const [cardNum, setCardNum]   = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');
  const [name, setName]         = useState('');
  const [errors, setErrors]     = useState({});

  const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const validate = () => {
    // Pas de validation de carte si paiement à la livraison
    if (method === METHODS.COD) return true;
    const e = {};
    if (cardNum.replace(/\s/g, '').length < 16) e.cardNum = 'Numéro de carte invalide (16 chiffres)';
    if (!name.trim())    e.name    = 'Nom du titulaire requis';
    if (expiry.length < 5) e.expiry = 'Date d\'expiration invalide (MM/AA)';
    if (cvv.length < 3)  e.cvv    = 'CVV invalide (3 ou 4 chiffres)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [orderRef] = useState(() =>
    'CMD-' + Date.now().toString(36).toUpperCase()
  );

  const downloadReceipt = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const now   = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit', minute: '2-digit',
    });

    // ── En-tête ──────────────────────────────────────────────
    doc.setFillColor(22, 163, 74); // green-600
    doc.rect(0, 0, pageW, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('REÇU DE PAIEMENT', pageW / 2, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Paiement sécurisé confirmé', pageW / 2, 28, { align: 'center' });

    // ── Référence & date ─────────────────────────────────────
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Référence : ${orderRef}`, 15, 50);
    doc.text(`Date : ${dateStr}  |  Heure : ${timeStr}`, 15, 57);

    // ── Ligne séparatrice ────────────────────────────────────
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 63, pageW - 15, 63);

    // ── Méthode de paiement ──────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Méthode de paiement', 15, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const methodLabel = method === METHODS.COD
      ? 'Paiement à la livraison (espèces)'
      : `Carte bancaire — ${name || '—'}`;
    doc.text(methodLabel, 15, 79);

    // ── Tableau des articles ─────────────────────────────────
    let y = 92;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Détail de la commande', 15, y);
    y += 8;

    // En-tête tableau
    doc.setFillColor(240, 253, 244); // green-50
    doc.rect(15, y, pageW - 30, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 163, 74);
    doc.text('Produit', 18, y + 5.5);
    doc.text('Qté', pageW - 60, y + 5.5, { align: 'right' });
    doc.text('Sous-total', pageW - 18, y + 5.5, { align: 'right' });
    y += 10;

    // Lignes articles
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    if (lignes.length > 0) {
      lignes.forEach((ligne, i) => {
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(15, y - 1, pageW - 30, 8, 'F');
        }
        const nomProduit = ligne.produit?.nom_prduit || 'Produit';
        doc.text(nomProduit.slice(0, 50), 18, y + 5);
        doc.text(String(ligne.quantite), pageW - 60, y + 5, { align: 'right' });
        doc.text(`${ligne.sous_total} DH`, pageW - 18, y + 5, { align: 'right' });
        y += 9;
      });
    } else {
      doc.text('Commande', 18, y + 5);
      doc.text('1', pageW - 60, y + 5, { align: 'right' });
      doc.text(`${total} DH`, pageW - 18, y + 5, { align: 'right' });
      y += 9;
    }

    // ── Total ────────────────────────────────────────────────
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, y, pageW - 15, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Sous-total', 15, y);
    doc.text(`${total} DH`, pageW - 18, y, { align: 'right' });
    y += 7;
    doc.text('Livraison', 15, y);
    doc.setTextColor(22, 163, 74);
    doc.text('Gratuite', pageW - 18, y, { align: 'right' });
    y += 9;

    doc.setFillColor(22, 163, 74);
    doc.rect(15, y - 1, pageW - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL', 18, y + 6);
    doc.text(`${total} DH`, pageW - 18, y + 6, { align: 'right' });
    y += 18;

    // ── Pied de page ─────────────────────────────────────────
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('Merci pour votre achat. Ce document tient lieu de reçu officiel.', pageW / 2, y + 10, { align: 'center' });
    doc.text('Pour toute question, contactez notre service client.', pageW / 2, y + 16, { align: 'center' });

    doc.save(`recu-${orderRef}.pdf`);
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (method === METHODS.COD) {
      // Pas de simulation de traitement pour la livraison
      setStep(STEPS.SUCCESS);
      toast('Commande confirmée — paiement à la livraison', 'success');
      setTimeout(() => navigate('/commandes'), 5000);
    } else {
      setStep(STEPS.PROCESSING);
      setTimeout(() => {
        setStep(STEPS.SUCCESS);
        toast('Paiement effectué avec succès', 'success');
        setTimeout(() => navigate('/commandes'), 5000);
      }, 2200);
    }
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
        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
          method === METHODS.COD ? 'bg-orange-50' : 'bg-green-50'
        }`}>
          {method === METHODS.COD
            ? <Truck size={52} className="text-orange-500" />
            : <CheckCircle2 size={52} className="text-green-500" />}
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-800 text-2xl mb-2">
            {method === METHODS.COD ? 'Commande confirmée' : 'Paiement réussi'}
          </p>
          <p className="text-sm text-gray-500">
            {method === METHODS.COD
              ? 'Vous paierez en espèces à la réception de votre colis.'
              : 'Votre commande a été confirmée.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Référence : <span className="font-mono font-semibold text-gray-600">{orderRef}</span>
          </p>
        </div>

        {/* Badge méthode */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          method === METHODS.COD
            ? 'bg-orange-50 text-orange-700 border border-orange-100'
            : 'bg-green-50 text-green-700 border border-green-100'
        }`}>
          {method === METHODS.COD
            ? <><Truck size={15} /> Paiement à la livraison</>
            : <><CreditCard size={15} /> Carte bancaire</>}
        </div>

        {/* Bouton télécharger le reçu */}
        <button
          onClick={downloadReceipt}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl px-6 py-3 transition-colors shadow-sm"
        >
          <Download size={18} /> Télécharger le reçu PDF
        </button>

        <p className="text-xs text-gray-400">Redirection vers vos commandes dans quelques secondes...</p>
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-[progress_5s_linear_forwards]" />
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

            {/* ── Sélecteur de méthode ── */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <h2 className="font-semibold text-gray-700 text-sm">Choisissez votre mode de paiement</h2>
              <div className="grid grid-cols-2 gap-3">

                {/* Carte bancaire */}
                <button
                  type="button"
                  onClick={() => setMethod(METHODS.CARD)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    method === METHODS.CARD
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <CreditCard size={24} className={method === METHODS.CARD ? 'text-green-600' : 'text-gray-400'} />
                  <span className={`text-xs font-semibold ${method === METHODS.CARD ? 'text-green-700' : 'text-gray-500'}`}>
                    Carte bancaire
                  </span>
                  {method === METHODS.CARD && (
                    <span className="text-[10px] bg-green-500 text-white rounded-full px-2 py-0.5">Sélectionné</span>
                  )}
                </button>

                {/* Paiement à la livraison */}
                <button
                  type="button"
                  onClick={() => setMethod(METHODS.COD)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    method === METHODS.COD
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Banknote size={24} className={method === METHODS.COD ? 'text-orange-500' : 'text-gray-400'} />
                  <span className={`text-xs font-semibold ${method === METHODS.COD ? 'text-orange-700' : 'text-gray-500'}`}>
                    À la livraison
                  </span>
                  {method === METHODS.COD && (
                    <span className="text-[10px] bg-orange-400 text-white rounded-full px-2 py-0.5">Sélectionné</span>
                  )}
                </button>
              </div>
            </div>

            {/* ── Formulaire carte (affiché seulement si carte) ── */}
            {method === METHODS.CARD && (
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard size={16} className="text-green-500" /> Informations de carte
                  </h2>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 48 16" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
                      <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
                    </svg>
                    <svg viewBox="0 0 38 24" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="12" r="10" fill="#EB001B" />
                      <circle cx="24" cy="12" r="10" fill="#F79E1B" />
                      <path d="M19 5.27a10 10 0 0 1 0 13.46A10 10 0 0 1 19 5.27z" fill="#FF5F00" />
                    </svg>
                  </div>
                </div>

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
            )}

            {/* ── Info paiement à la livraison ── */}
            {method === METHODS.COD && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex gap-4">
                <Truck size={28} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-800 text-sm mb-1">Paiement à la livraison</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    Vous réglez en espèces directement au livreur lors de la réception de votre commande.
                    Aucune information bancaire n'est requise.
                  </p>
                </div>
              </div>
            )}

            {/* Sécurité */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-5 py-3">
              <ShieldCheck size={18} className="text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-700">
                {method === METHODS.COD
                  ? 'Aucune information bancaire requise — paiement en espèces à la livraison'
                  : 'Paiement 100% sécurisé'}
              </p>
            </div>

            {/* Bouton confirmer */}
            <button
              type="submit"
              className={`w-full text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 text-base transition-colors shadow-sm ${
                method === METHODS.COD
                  ? 'bg-orange-500 hover:bg-orange-400'
                  : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {method === METHODS.COD
                ? <><Truck size={18} /> Confirmer la commande</>
                : <><Lock size={18} /> Payer {total} DH</>}
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
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center gap-4">

              {/* Visa */}
              <svg viewBox="0 0 48 16" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="16" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
              </svg>

              <div className="w-px h-6 bg-gray-100" />

              {/* Mastercard */}
              <svg viewBox="0 0 38 24" className="h-7 w-auto" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="12" r="10" fill="#EB001B" />
                <circle cx="24" cy="12" r="10" fill="#F79E1B" />
                <path d="M19 5.27a10 10 0 0 1 0 13.46A10 10 0 0 1 19 5.27z" fill="#FF5F00" />
              </svg>

              <div className="w-px h-6 bg-gray-100" />

              {/* CMI */}
              <span className="text-xs font-extrabold tracking-wider text-[#005baa]">CMI</span>

              <div className="w-px h-6 bg-gray-100" />

              {/* Amex */}
              <svg viewBox="0 0 50 16" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="13" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="13" fill="#007BC1" letterSpacing="0.5">AMEX</text>
              </svg>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Paiement;
