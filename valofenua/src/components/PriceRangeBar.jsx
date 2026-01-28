import { formatPriceMF } from '../utils/formatPrice';

export default function PriceRangeBar({ prixBas, prixMoyen, prixHaut }) {
  const range = prixHaut - prixBas;
  const moyenPosition = range > 0 ? ((prixMoyen - prixBas) / range) * 100 : 50;

  return (
    <div className="w-full py-2">
      {/* Prix labels */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-center">
          <div className="inline-flex flex-col items-center px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-lg font-bold text-emerald-600">{formatPriceMF(prixBas)}</div>
            <div className="text-xs text-emerald-600 font-medium">Bas</div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex flex-col items-center px-4 py-2 bg-[#0077B6] rounded-lg shadow">
            <div className="text-xl font-bold text-white">{formatPriceMF(prixMoyen)}</div>
            <div className="text-xs text-blue-100 font-medium">Estimation</div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex flex-col items-center px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-lg font-bold text-amber-600">{formatPriceMF(prixHaut)}</div>
            <div className="text-xs text-amber-600 font-medium">Haut</div>
          </div>
        </div>
      </div>

      {/* Barre */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-emerald-400 via-[#0077B6] to-amber-400 rounded-full" />

        {/* Marqueur prix moyen */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${moyenPosition}%` }}
        >
          <div className="w-5 h-5 bg-white rounded-full border-3 border-[#0077B6] shadow-md" />
        </div>

        {/* Marqueurs aux extrémités */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow" />
        </div>
      </div>
    </div>
  );
}
