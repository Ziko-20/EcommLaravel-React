import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, MapPinHouse, Phone, Lock } from 'lucide-react';
import { register } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import logoCadree from '../../assets/logoCadree.png';
import { Link, useNavigate } from 'react-router-dom';
/* import LogoAnimation from '../assets/LogoVid.mp4'
 */const Register = () => {

const { t } = useTranslation();
const navigate = useNavigate();
const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [telephone, setTelephone] = useState('');
  const [nom, setNom]           = useState('');
  const [adresse, setAdresse]   = useState('');
  const [password, setPassword] = useState('');
  const [indicatif, setIndicatif] = useState('+212');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await register({
        email,
        password,
        password_confirmation: password,
        adresse,
        name: nom,
        telephone: indicatif + telephone,
      });
      const { user, token } = response.data;
      login(user, token);
      navigate('/produits');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(' '));
      } else {
        setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  /* Indicatifs Telephone */
  const countries = [
  { code: "+212", flag: "🇲🇦", name: "Maroc" },{ code: "+1",   flag: "🇺🇸", name: "États-Unis" },{ code: "+33",  flag: "🇫🇷", name: "France" },{ code: "+44",  flag: "🇬🇧", name: "Royaume-Uni" },{ code: "+49",  flag: "🇩🇪", name: "Allemagne" },{ code: "+34",  flag: "🇪🇸", name: "Espagne" },{ code: "+39",  flag: "🇮🇹", name: "Italie" },{ code: "+32",  flag: "🇧🇪", name: "Belgique" },{ code: "+41",  flag: "🇨🇭", name: "Suisse" },{ code: "+31",  flag: "🇳🇱", name: "Pays-Bas" },{ code: "+351", flag: "🇵🇹", name: "Portugal" },{ code: "+216", flag: "🇹🇳", name: "Tunisie" },{ code: "+213", flag: "🇩🇿", name: "Algérie" },{ code: "+20",  flag: "🇪🇬", name: "Égypte" },{ code: "+221", flag: "🇸🇳", name: "Sénégal" },{ code: "+225", flag: "🇨🇮", name: "Côte d'Ivoire" },{ code: "+237", flag: "🇨🇲", name: "Cameroun" },{ code: "+966", flag: "🇸🇦", name: "Arabie Saoudite" },{ code: "+971", flag: "🇦🇪", name: "Émirats Arabes Unis" },{ code: "+974", flag: "🇶🇦", name: "Qatar" },{ code: "+965", flag: "🇰🇼", name: "Koweït" },{ code: "+962", flag: "🇯🇴", name: "Jordanie" },{ code: "+961", flag: "🇱🇧", name: "Liban" },{ code: "+90",  flag: "🇹🇷", name: "Turquie" },{ code: "+91",  flag: "🇮🇳", name: "Inde" },{ code: "+86",  flag: "🇨🇳", name: "Chine" },{ code: "+81",  flag: "🇯🇵", name: "Japon" },{ code: "+82",  flag: "🇰🇷", name: "Corée du Sud" },{ code: "+55",  flag: "🇧🇷", name: "Brésil" },{ code: "+52",  flag: "🇲🇽", name: "Mexique" },{ code: "+27",  flag: "🇿🇦", name: "Afrique du Sud" },{ code: "+234", flag: "🇳🇬", name: "Nigeria" },{ code: "+254", flag: "🇰🇪", name: "Kenya" },{ code: "+7",   flag: "🇷🇺", name: "Russie" },{ code: "+380", flag: "🇺🇦", name: "Ukraine" },{ code: "+48",  flag: "🇵🇱", name: "Pologne" },{ code: "+46",  flag: "🇸🇪", name: "Suède" },{ code: "+47",  flag: "🇳🇴", name: "Norvège" },{ code: "+45",  flag: "🇩🇰", name: "Danemark" },{ code: "+358", flag: "🇫🇮", name: "Finlande" },{ code: "+61",  flag: "🇦🇺", name: "Australie" },{ code: "+64",  flag: "🇳🇿", name: "Nouvelle-Zélande" },{ code: "+54",  flag: "🇦🇷", name: "Argentine" },{ code: "+56",  flag: "🇨🇱", name: "Chili" },{ code: "+57",  flag: "🇨🇴", name: "Colombie" },{ code: "+58",  flag: "🇻🇪", name: "Venezuela" },{ code: "+51",  flag: "🇵🇪", name: "Pérou" },
];

  return (
  <div className='w-full flex items-center justify-center max-h-screen bg-slate-100'>

    <div className='bg-white rounded-2xl shadow-lg p-12 w-full max-w-md flex flex-col gap-6'>

      <div className='flex justify-center items-center'>
        <img src={logoCadree} alt="logoEcomm" className='w-44' />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      {/* NOM */}
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <User size={14} className='text-gray-500' />
          <label htmlFor="" className='text-sm text-gray-500'>{t('name')}:</label>
        </div>

        <input
          type="text"
        placeholder='Verrill Duclos' 
          className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2'
          onChange={(e) => setNom(e.target.value)}
        />
      </div>

      {/* EMAIL */}
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <Mail size={14} className='text-gray-500' />
          <label htmlFor="" className='text-sm text-gray-500'>{t('email')}:</label>
        </div>
        <input
          type="text"
          className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2'
          placeholder='exemple@gmail.com'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* TELEPHONE */} 

      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>

          <Phone size={14} className='text-gray-500' />
          <label htmlFor="" className='text-sm text-gray-500'>{t('phone')}:</label> 

        </div>
        <div className='flex flex-row gap-2'>
          <select
            name="indicatif"
            className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2'
            defaultValue="+212"
            onChange={(e) => setIndicatif(e.target.value)}
          >
            {countries.map((c) => ( 

              <option key={c.code} value={c.code}> 

                {c.flag} {c.code}
              </option>
            ))} 

          </select> 

          <input
            type="tel"
            name="telephone"

            placeholder="6 12 34 56 78"

            onChange={(e) => setTelephone(e.target.value)}
            className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2 w-full'

          />
        </div>
      </div>

      {/* adresssss */}

      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <MapPinHouse size={14} className='text-gray-500' />

          <label htmlFor="" className='text-sm text-gray-500'>{t('adress')}:</label>

        </div>
        <input
          type="text"
          className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2'
          placeholder='12 Rue Al Atlas, Appartement 5, Rabat'
          onChange={(e) => setAdresse(e.target.value)}
        />
      </div>

      {/* passsword */}
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center'>
          <Lock size={14} className='text-gray-500' />
          <label htmlFor="" className='text-sm text-gray-500'>{t('password')}:</label>
        </div>
        <input
          type="password"
          className='border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2'
          placeholder='*********************'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* boutoon */}
      <div className='flex flex-col gap-3'>
        <button
          type="submit"
          disabled={loading}
          className='bg-green-600 text-white font-bold w-full rounded-xl py-2 hover:bg-green-500 transition-colors duration-200 disabled:opacity-60'
          onClick={handleSubmit}
        >
          {loading ? 'Inscription...' : t('Register')}
        </button>

        <p className='text-sm text-gray-400 text-center'>
          <Link to="/" className='transition-colors duration-300 hover:text-gray-900'>
            {t('login')}
          </Link>
        </p>
      </div>

    </div>

  </div>
)
}

export default Register;
