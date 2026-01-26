import { BarChart3, FileText, Zap, MapPin } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: MapPin,
      title: 'Expert du marché polynésien',
      description: 'Données issues des annonces actives sur les 12 communes de Tahiti.',
    },
    {
      icon: BarChart3,
      title: 'Analyse précise',
      description: 'Algorithme basé sur les prix réels du marché local.',
    },
    {
      icon: Zap,
      title: 'Résultat instantané',
      description: 'Obtenez votre estimation en moins de 2 minutes.',
    },
    {
      icon: FileText,
      title: 'Rapports PDF professionnels',
      description: 'Générez des rapports personnalisés avec votre logo pour vos clients.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-4">
          Pourquoi ValoFenua ?
        </h2>
        <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16">
          L'outil d'estimation conçu pour les professionnels de l'immobilier en Polynésie
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-5 p-6 rounded-2xl bg-white border border-slate-100 hover:border-[#0077B6]/20 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E0F4FF] to-[#b8e6ff] rounded-xl flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-[#0077B6]" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold text-slate-800 mb-1">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
