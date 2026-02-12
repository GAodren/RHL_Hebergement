import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Logo className="h-12" />
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              L'outil d'estimation immobilière professionnel dédié au marché polynésien.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/estimation" className="text-slate-400 hover:text-white transition-colors">
                  Estimer mon bien
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-lg mb-4">Informations</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="text-slate-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cgv" className="text-slate-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} ValoFenua. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-600 text-center sm:text-right max-w-md">
            Estimation indicative ne constituant pas une évaluation officielle. Les prix affichés sont basés sur les annonces du marché local.
          </p>
        </div>
      </div>
    </footer>
  );
}
