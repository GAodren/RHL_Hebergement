import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Toujours afficher le loading pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  // Si pas d'utilisateur après vérification, rediriger vers connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Utilisateur authentifié, afficher le contenu
  return children;
}
