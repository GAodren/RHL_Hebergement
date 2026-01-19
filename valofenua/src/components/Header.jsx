import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[#0077B6] font-bold text-xl hover:text-[#005f8a] transition-colors">
          <div className="w-9 h-9 bg-[#0077B6] rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span>ValoFenua</span>
        </Link>
        <Link
          to="/estimation"
          className="bg-[#0077B6] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#005f8a] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Estimer mon bien
        </Link>
      </div>
    </header>
  );
}
