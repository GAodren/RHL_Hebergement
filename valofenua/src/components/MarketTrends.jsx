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
  const width = 200;
  const height = 60;
  const padding = { top: 8, right: 8, bottom: 8, left: 8 };

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
    <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#0077B6]" />
          <h3 className="text-sm font-semibold text-slate-800">Tendance du marché</h3>
        </div>
        <span className="text-xs text-slate-400">{commune}</span>
      </div>

      <div className="flex gap-4 items-center">
        {/* Graphique SVG compact */}
        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-14" preserveAspectRatio="xMidYMid meet">
            {/* Gradient de fond */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.2" />
                <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Zone sous la courbe */}
            <path d={areaPath} fill="url(#areaGradient)" />

            {/* Ligne principale - fine et nette */}
            <path
              d={linePath}
              fill="none"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Labels des années */}
          <div className="flex justify-between px-1">
            <span className="text-[10px] text-slate-400">{historique[0]?.annee}</span>
            <span className="text-[10px] text-slate-400">{historique[historique.length - 1]?.annee}</span>
          </div>
        </div>

        {/* Stats compactes */}
        <div className="flex flex-col gap-1 text-right">
          <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span className="text-sm font-bold">
              {isPositive ? '+' : ''}{variation.pourcentage}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">depuis 2020</p>
          <p className="text-xs font-medium text-slate-600 mt-1">
            {formatPriceXPF(historique[historique.length - 1]?.prix || 0)}/m²
          </p>
        </div>
      </div>
    </div>
  );
}
