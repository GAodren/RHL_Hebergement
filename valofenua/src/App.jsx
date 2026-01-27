import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Estimation from './pages/Estimation';
import RapportEstimation from './pages/RapportEstimation';
import About from './pages/About';
import Contact from './pages/Contact';
import MentionsLegales from './pages/MentionsLegales';
import CGV from './pages/CGV';
import Connexion from './pages/Connexion';
import Profil from './pages/Profil';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const location = useLocation();
  const isConnexionPage = location.pathname === '/connexion';

  return (
    <>
      {!isConnexionPage && <Header />}
      <Routes>
        {/* Page de connexion - accessible sans authentification */}
        <Route path="/connexion" element={<Connexion />} />

        {/* Toutes les autres pages nécessitent une authentification */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/estimation" element={<ProtectedRoute><Estimation /></ProtectedRoute>} />
        <Route path="/rapport" element={<ProtectedRoute><RapportEstimation /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/mentions-legales" element={<ProtectedRoute><MentionsLegales /></ProtectedRoute>} />
        <Route path="/cgv" element={<ProtectedRoute><CGV /></ProtectedRoute>} />
        <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
      {!isConnexionPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
