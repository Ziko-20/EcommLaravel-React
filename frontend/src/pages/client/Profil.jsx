import React, { useState } from 'react';
import { User, Mail, Phone, MapPinHouse, Lock, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateProfile } from '../../services/authService';

const Profil = () => {
  const { user, setUser } = useAuth();
  const navigate          = useNavigate();
  const { toast }         = useToast();

  const [name, setName]           = useState(user?.name || '');
  const [telephone, setTelephone] = useState(user?.telephone || '');
  const [adresse, setAdresse]     = useState(user?.adresse || '');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirm) {
      toast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    const data = { name, telephone, adresse };
    if (password) { data.password = password; data.password_confirmation = confirm; }

    setLoading(true);
    try {
      const res = await updateProfile(data);
      setUser(res.data.user);
      toast('Profil mis à jour avec succès', 'success');
      setPassword(''); setConfirm('');
    } catch (err) {
      const errors = err.response?.data?.errors;
      toast(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message || 'Erreur'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-screen-sm mx-auto w-full px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User size={24} /> Mon Profil
        </h1>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <User size={36} className="text-green-600" />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <Mail size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { label: 'Nom complet',  icon: User,        value: name,      set: setName,      type: 'text'     },
              { label: 'Téléphone',    icon: Phone,       value: telephone, set: setTelephone, type: 'text'     },
              { label: 'Adresse',      icon: MapPinHouse, value: adresse,   set: setAdresse,   type: 'text'     },
            ].map(({ label, icon: Icon, value, set, type }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500 flex items-center gap-1.5"><Icon size={14} /> {label}</label>
                <input type={type} value={value} onChange={(e) => set(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm" />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-gray-500 flex items-center gap-1.5"><Lock size={14} /> Nouveau mot de passe (optionnel)</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Laisser vide pour ne pas changer" className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm" />
            </div>

            {password && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-500 flex items-center gap-1.5"><Lock size={14} /> Confirmer le mot de passe</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-green-500 text-sm" />
              </div>
            )}

            <button type="submit" disabled={loading} className="mt-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              <Save size={16} /> {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profil;
