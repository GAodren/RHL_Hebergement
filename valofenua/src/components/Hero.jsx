import { Link } from 'react-router-dom';
import { Target, HelpCircle, Check } from 'lucide-react';

export default function Hero() {
  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-br from-[#E0F4FF] via-[#f0f9ff] to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight tracking-tight">
          L'outil d'estimation
          <br />
          <span className="text-[#0077B6]">expert en Polynésie</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          La solution professionnelle pour les agents immobiliers. Estimez vos biens en 2 minutes grâce à notre analyse du marché polynésien.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <Link
            to="/estimation"
            className="inline-flex items-center justify-center gap-2 bg-[#0077B6] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#005f8a] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Target className="w-5 h-5" />
            Lancer une estimation
          </Link>
          <button
            onClick={scrollToHowItWorks}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#0077B6] px-8 py-4 rounded-xl font-semibold text-lg border-2 border-[#0077B6] hover:bg-[#E0F4FF] transition-all duration-200"
          >
            <HelpCircle className="w-5 h-5" />
            Comment ça marche ?
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-slate-600">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-medium">Données locales</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-medium">Rapports PDF personnalisés</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-medium">Résultat immédiat</span>
          </div>
        </div>
      </div>
    </section>
  );
}
