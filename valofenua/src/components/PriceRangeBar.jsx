import { formatPriceMF } from '../utils/formatPrice';

export default function PriceRangeBar({ prixBas, prixMoyen, prixHaut }) {
  const range = prixHaut - prixBas;
  const moyenPosition = range > 0 ? ((prixMoyen - prixBas) / range) * 100 : 50;

  return (
    <div className="w-full">
      {/* Prix en ligne */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-center">
          <span className="text-sm font-bold text-emerald-600">{formatPriceMF(prixBas)}</span>
          <span className="text-[10px] text-emerald-500 ml-1">bas</span>
        </div>
        <div className="text-center px-3 py-1 bg-[#0077B6] rounded-full">
          <span className="text-sm font-bold text-white">{formatPriceMF(prixMoyen)}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-amber-500 mr-1">haut</span>
          <span className="text-sm font-bold text-amber-600">{formatPriceMF(prixHaut)}</span>
        </div>
      </div>

      {/* Barre */}
      <div className="relative">
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-[#0077B6] to-amber-400 rounded-full" />

        {/* Marqueur prix moyen */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${moyenPosition}%` }}
        >
          <div className="w-3.5 h-3.5 bg-white rounded-full border-2 border-[#0077B6] shadow-sm" />
        </div>
      </div>
    </div>
  );
}
