import { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw, Sliders } from 'lucide-react';
import { formatPriceMF, formatPriceXPF } from '../utils/formatPrice';

export default function PriceAdjuster({ prixBas, prixMoyen, prixHaut, onPriceChange, initialValue }) {
  const minPrice = Math.round(prixBas * 0.9);
  const maxPrice = Math.round(prixHaut * 1.1);
  const step = 500000;

  const [adjustedPrice, setAdjustedPrice] = useState(initialValue || prixMoyen);

  useEffect(() => {
    onPriceChange(adjustedPrice);
  }, [adjustedPrice, onPriceChange]);

  const percentageDiff = ((adjustedPrice - prixMoyen) / prixMoyen * 100).toFixed(1);
  const percentageSign = Number(percentageDiff) >= 0 ? '+' : '';

  const positionBas = ((prixBas - minPrice) / (maxPrice - minPrice)) * 100;
  const positionMoyen = ((prixMoyen - minPrice) / (maxPrice - minPrice)) * 100;
  const positionHaut = ((prixHaut - minPrice) / (maxPrice - minPrice)) * 100;

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    const rounded = Math.round(value / step) * step;
    setAdjustedPrice(rounded);
  };

  const handleIncrement = () => {
    setAdjustedPrice((prev) => Math.min(prev + step, maxPrice));
  };

  const handleDecrement = () => {
    setAdjustedPrice((prev) => Math.max(prev - step, minPrice));
  };

  const handleReset = () => {
    setAdjustedPrice(prixMoyen);
  };

  const getBadge = () => {
    if (adjustedPrice < prixBas) {
      return { text: 'Sous le marché', color: 'bg-blue-100 text-blue-700' };
    } else if (adjustedPrice <= prixMoyen - (prixMoyen - prixBas) * 0.3) {
      return { text: 'Prix bas', color: 'bg-emerald-100 text-emerald-700' };
    } else if (adjustedPrice <= prixMoyen + (prixHaut - prixMoyen) * 0.3) {
      return { text: 'Dans la moyenne', color: 'bg-amber-100 text-amber-700' };
    } else if (adjustedPrice <= prixHaut) {
      return { text: 'Prix haut', color: 'bg-orange-100 text-orange-700' };
    } else {
      return { text: 'Au-dessus du marché', color: 'bg-red-100 text-red-700' };
    }
  };

  const badge = getBadge();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="w-4 h-4 text-[#0077B6]" />
        <span className="text-sm font-semibold text-slate-800">Ajustez le prix</span>
      </div>

      {/* Prix et badges */}
      <div className="text-center mb-3">
        <p className="text-2xl font-bold text-[#0077B6]">{formatPriceMF(adjustedPrice)}</p>
        <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${badge.color}`}>
            {badge.text}
          </span>
          {adjustedPrice !== prixMoyen && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              Number(percentageDiff) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {percentageSign}{percentageDiff}%
            </span>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative mb-4 pt-4">
        {/* Marqueurs */}
        <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
          <span className="text-[9px] text-emerald-600 font-medium" style={{ position: 'absolute', left: `${positionBas}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixBas)}
          </span>
          <span className="text-[9px] text-[#0077B6] font-medium" style={{ position: 'absolute', left: `${positionMoyen}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixMoyen)}
          </span>
          <span className="text-[9px] text-amber-600 font-medium" style={{ position: 'absolute', left: `${positionHaut}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixHaut)}
          </span>
        </div>

        {/* Barre */}
        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mt-1">
          <div className="absolute h-full bg-blue-200" style={{ left: 0, width: `${positionBas}%` }} />
          <div
            className="absolute h-full bg-gradient-to-r from-emerald-300 via-amber-300 to-orange-300"
            style={{ left: `${positionBas}%`, width: `${positionHaut - positionBas}%` }}
          />
          <div className="absolute h-full bg-red-200" style={{ left: `${positionHaut}%`, right: 0 }} />
          <div className="absolute w-0.5 h-full bg-emerald-500" style={{ left: `${positionBas}%` }} />
          <div className="absolute w-0.5 h-full bg-[#0077B6]" style={{ left: `${positionMoyen}%` }} />
          <div className="absolute w-0.5 h-full bg-amber-500" style={{ left: `${positionHaut}%` }} />
        </div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={adjustedPrice}
          onChange={handleSliderChange}
          className="absolute top-4 left-0 w-full h-3 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#0077B6]
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#0077B6]
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow"
        />

        <div className="flex justify-between mt-2 text-[9px] text-slate-400">
          <span>{formatPriceMF(minPrice)}</span>
          <span>{formatPriceMF(maxPrice)}</span>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleDecrement}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 font-medium transition-colors"
        >
          <Minus className="w-3 h-3" />
          0,5 MF
        </button>

        {adjustedPrice !== prixMoyen && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-[#0077B6] hover:bg-blue-50 rounded text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}

        <button
          onClick={handleIncrement}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 font-medium transition-colors"
        >
          <Plus className="w-3 h-3" />
          0,5 MF
        </button>
      </div>
    </div>
  );
}
