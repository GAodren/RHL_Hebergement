import { FileText, MapPin, Clock, TrendingUp, Home, Building2 } from 'lucide-react';

export default function Stats() {
  // Statistiques principales du service
  const mainStats = [
    {
      icon: FileText,
      value: '1300+',
      label: 'annonces analysées',
      description: 'sur le marché polynésien',
    },
    {
      icon: MapPin,
      value: '12',
      label: 'communes couvertes',
      description: 'de Tahiti et alentours',
    },
    {
      icon: Clock,
      value: '2 min',
      label: 'temps moyen',
      description: 'pour obtenir une estimation',
    },
  ];

  // Statistiques du marché immobilier polynésien (données 2025)
  const marketStats = [
    {
      icon: Home,
      value: '90 MF',
      label: 'Prix moyen maison',
      description: 'à Tahiti en 2025',
    },
    {
      icon: Building2,
      value: '160 000',
      label: 'EUR/appartement T2',
      description: 'prix d\'entrée',
    },
    {
      icon: TrendingUp,
      value: '+25%',
      label: 'Évolution des prix',
      description: 'ces dernières années',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {mainStats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-[#E0F4FF] rounded-xl flex items-center justify-center mb-4">
                <stat.icon className="w-7 h-7 text-[#0077B6]" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-[#0077B6] mb-2">
                {stat.value}
              </div>
              <div className="text-slate-700 font-semibold">{stat.label}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Titre du marché */}
        <div className="mt-16 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            Le marché immobilier polynésien
          </h2>
          <p className="mt-2 text-slate-600">
            Quelques chiffres clés pour mieux comprendre le contexte local
          </p>
        </div>

        {/* Statistiques du marché */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {marketStats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-[#E0F4FF] to-white border border-[#0077B6]/10 hover:border-[#0077B6]/20 transition-colors"
            >
              <div className="w-12 h-12 bg-[#0077B6] rounded-lg flex items-center justify-center mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                {stat.value}
              </div>
              <div className="text-slate-700 font-medium text-sm">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Note sur les données */}
        <p className="mt-8 text-center text-xs text-slate-400">
          Sources : analyses du marché local 2025. Ces chiffres sont indicatifs.
        </p>
      </div>
    </section>
  );
}
