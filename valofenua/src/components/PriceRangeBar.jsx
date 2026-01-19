import { formatPriceMF } from '../utils/formatPrice';

export default function PriceRangeBar({ prixBas, prixMoyen, prixHaut }) {
  // Calculer la position du prix moyen sur la barre (en pourcentage)
  const range = prixHaut - prixBas;
  const moyenPosition = range > 0 ? ((prixMoyen - prixBas) / range) * 100 : 50;

  return (
    <div className="w-full py-4">
      {/* Prix labels */}
      <div className="flex justify-between items-end mb-4">
        <div className="text-center flex-1">
          <div className="inline-flex flex-col items-center px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-lg md:text-xl font-bold text-emerald-600">{formatPriceMF(prixBas)}</div>
            <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Bas</div>
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="inline-flex flex-col items-center px-4 py-3 bg-gradient-to-br from-[#0077B6] to-[#005f8a] rounded-xl shadow-lg transform scale-110">
            <div className="text-xl md:text-2xl font-bold text-white">{formatPriceMF(prixMoyen)}</div>
            <div className="text-xs text-blue-100 font-medium uppercase tracking-wide">Estimation</div>
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="inline-flex flex-col items-center px-3 py-2 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-lg md:text-xl font-bold text-amber-600">{formatPriceMF(prixHaut)}</div>
            <div className="text-xs text-amber-600 font-medium uppercase tracking-wide">Haut</div>
          </div>
        </div>
      </div>

      {/* Barre de progression colorée */}
      <div className="relative mt-6">
        {/* Barre de fond avec gradient */}
        <div className="h-4 bg-gradient-to-r from-emerald-400 via-[#0077B6] to-amber-400 rounded-full shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
        </div>

        {/* Marqueur du prix moyen */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
          style={{ left: `${moyenPosition}%` }}
        >
          <div className="w-6 h-6 bg-white rounded-full shadow-lg border-4 border-[#0077B6] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0077B6] rounded-full" />
          </div>
        </div>

        {/* Marqueurs aux extrémités */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow" />
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-white shadow" />
        </div>
      </div>

      {/* Légende */}
      <div className="flex justify-between mt-3 text-xs text-slate-500">
        <span>Prix minimum</span>
        <span>Prix maximum</span>
      </div>
    </div>
  );
}
