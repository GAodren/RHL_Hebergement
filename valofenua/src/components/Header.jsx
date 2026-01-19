import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/estimation', label: 'Estimation' },
    { to: '/about', label: 'À propos' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="hover:opacity-90 transition-opacity">
            <Logo className="w-10 h-10" />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-[#0077B6]'
                    : 'text-slate-600 hover:text-[#0077B6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <Link
            to="/estimation"
            className="hidden md:inline-flex bg-[#0077B6] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#005f8a] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Estimer mon bien
          </Link>

          {/* Menu burger mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-[#0077B6] transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-100 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-[#E0F4FF] text-[#0077B6]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
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
