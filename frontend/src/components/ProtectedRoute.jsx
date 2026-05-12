import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protège les routes qui nécessitent une connexion
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      Chargement...
    </div>
  );

  if (!user) return <Navigate to="/" replace />;
  return children;
};

// Protège les routes admin
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400">
      Chargement...
    </div>
  );

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/produits" replace />;
  return children;
};
