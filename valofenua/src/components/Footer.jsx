import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0077B6] rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ValoFenua</span>
          </div>
          <div className="text-center md:text-right text-slate-400">
            <p className="font-medium text-slate-300">Estimation immobiliere en Polynesie francaise</p>
            <p className="text-sm mt-1">Donnees basees sur les annonces de immobilier.pf</p>
            <p className="mt-4 text-xs text-slate-500">
              Estimation indicative ne constituant pas une evaluation officielle. &copy; 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
