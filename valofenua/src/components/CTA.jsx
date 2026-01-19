import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#0077B6] to-[#005f8a]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pret a estimer votre bien ?
        </h2>
        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-xl mx-auto">
          Obtenez une estimation gratuite en moins de 2 minutes
        </p>
        <Link
          to="/estimation"
          className="inline-flex items-center justify-center gap-2 bg-white text-[#0077B6] px-10 py-5 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
          <Target className="w-6 h-6" />
          Estimer maintenant
        </Link>
      </div>
    </section>
  );
}
