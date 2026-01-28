import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getHistoriqueCommune, getVariation } from '../data/prixHistorique';
import { formatPriceXPF } from '../utils/formatPrice';

export default function MarketTrends({ commune }) {
  const historique = getHistoriqueCommune(commune);
  const variation = getVariation(commune);

  if (historique.length === 0) {
    return null;
  }

  // Dimensions du graphique
  const width = 100;
  const height = 50;
  const padding = { top: 5, right: 5, bottom: 5, left: 5 };

  // Calculer les échelles
  const prices = historique.map(d => d.prix);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;

  const xScale = (index) => {
    return padding.left + (index / (historique.length - 1)) * (width - padding.left - padding.right);
  };

  const yScale = (price) => {
    return height - padding.bottom - ((price - minPrice) / (maxPrice - minPrice)) * (height - padding.top - padding.bottom);
  };

  // Générer le path pour la ligne
  const linePath = historique
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.prix)}`)
    .join(' ');

  // Générer le path pour le gradient
  const areaPath = `${linePath} L ${xScale(historique.length - 1)} ${height - padding.bottom} L ${padding.left} ${height - padding.bottom} Z`;

  const isPositive = variation.pourcentage >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#0077B6]" />
        <h3 className="text-lg font-semibold text-slate-800">Tendance du marché</h3>
        <span className="text-sm text-slate-500">• {commune}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Graphique SVG */}
        <div className="flex-1">
          <div className="bg-slate-50 rounded-xl p-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
              {/* Gradient de fond */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Zone sous la courbe */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* Ligne principale */}
              <path
                d={linePath}
                fill="none"
                stroke={isPositive ? "#10B981" : "#EF4444"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {historique.map((d, i) => (
                <circle
                  key={d.annee}
                  cx={xScale(i)}
                  cy={yScale(d.prix)}
                  r="2"
                  fill="white"
                  stroke={isPositive ? "#10B981" : "#EF4444"}
                  strokeWidth="1.5"
                />
              ))}
            </svg>

            {/* Labels des années */}
            <div className="flex justify-between mt-2 px-1">
              {historique.map((d) => (
                <span key={d.annee} className="text-xs text-slate-400">{d.annee}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex flex-col gap-3 md:w-48">
          {/* Variation totale */}
          <div className={`rounded-xl p-3 ${isPositive ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            <p className="text-xs text-slate-500 mb-1">Évolution 2020-2025</p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-lg font-bold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{variation.pourcentage}%
              </span>
            </div>
          </div>

          {/* Prix actuel au m² */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Prix/m² actuel</p>
            <p className="text-lg font-bold text-[#0077B6]">
              {formatPriceXPF(historique[historique.length - 1]?.prix || 0)}
            </p>
          </div>

          {/* Prix 2020 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Prix/m² en 2020</p>
            <p className="text-sm font-medium text-slate-600">
              {formatPriceXPF(historique[0]?.prix || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-400 mt-4">
        Évolution moyenne du prix au m² sur la commune. Source : estimations basées sur les tendances du marché.
      </p>
    </div>
  );
}
