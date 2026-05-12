import React, { useState } from 'react';
import { Mail, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { login as loginApi } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import logoCadree from '../../assets/logoCadree.png';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      const { user, token } = response.data;
      login(user, token);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/produits');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center items-center">
          <img src={logoCadree} alt="logoEcomm" className="w-44" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-2">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <Mail size={14} className="text-gray-500" />
            <label className="text-sm text-gray-500">{t('email')} :</label>
          </div>
          <input
            type="email"
            className="border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2"
            placeholder="exemple@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <KeyRound size={14} className="text-gray-500" />
            <label className="text-sm text-gray-500">{t('password')} :</label>
          </div>
          <input
            type="password"
            className="border border-gray-200 rounded-xl hover:border-green-600 focus:border-green-600 outline-none px-3 py-2"
            placeholder="*********************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white font-bold w-full rounded-xl py-2 hover:bg-green-500 transition-colors duration-200 disabled:opacity-60"
            onClick={handleSubmit}
          >
            {loading ? 'Connexion...' : t('login')}
          </button>
          <p className="text-sm text-gray-400 text-center">
            <Link to="/register" className="transition-colors duration-300 hover:text-gray-900">
              {t('createacc')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
