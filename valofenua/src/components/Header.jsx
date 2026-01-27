import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/estimation', label: 'Estimation' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/connexion');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity flex-shrink-0">
            <Logo className="w-10 h-10" />
          </Link>

          {/* Navigation desktop - centrée */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors whitespace-nowrap ${
                  isActive(link.to)
                    ? 'text-[#0077B6]'
                    : 'text-slate-600 hover:text-[#0077B6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {!loading && user && (
              <>
                <Link
                  to="/dashboard"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/dashboard') || isActive('/profil')
                      ? 'bg-[#E0F4FF] text-[#0077B6]'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-[#0077B6]'
                  }`}
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
              </>
            )}
            <Link
              to="/estimation"
              className="bg-[#0077B6] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#005f8a] transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            >
              Estimer mon bien
            </Link>
          </div>

          {/* Menu burger mobile/tablet */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#0077B6] transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation mobile/tablet */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-[#E0F4FF] text-[#0077B6]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Séparateur */}
              <div className="h-px bg-slate-100 my-2"></div>

              {/* Liens d'authentification mobile */}
              {!loading && user && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                      isActive('/dashboard') || isActive('/profil')
                        ? 'bg-[#E0F4FF] text-[#0077B6]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 text-left cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                  </button>
                </>
              )}

              <Link
                to="/estimation"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 bg-[#0077B6] text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-[#005f8a] transition-colors"
              >
                Estimer mon bien
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
