import { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw, Sliders } from 'lucide-react';
import { formatPriceMF, formatPriceXPF } from '../utils/formatPrice';

export default function PriceAdjuster({ prixBas, prixMoyen, prixHaut, onPriceChange }) {
  // Étendre la plage de ±10% au-delà des bornes
  const minPrice = Math.round(prixBas * 0.9);
  const maxPrice = Math.round(prixHaut * 1.1);

  // Palier d'ajustement : 500 000 XPF (0.5 MF)
  const step = 500000;

  const [adjustedPrice, setAdjustedPrice] = useState(prixMoyen);

  // Notifier le parent des changements
  useEffect(() => {
    onPriceChange(adjustedPrice);
  }, [adjustedPrice, onPriceChange]);

  // Calculer le pourcentage par rapport à l'estimation
  const percentageDiff = ((adjustedPrice - prixMoyen) / prixMoyen * 100).toFixed(1);
  const percentageSign = Number(percentageDiff) >= 0 ? '+' : '';

  // Calculer la position du curseur sur la barre (0-100%)
  const sliderPosition = ((adjustedPrice - minPrice) / (maxPrice - minPrice)) * 100;

  // Position des marqueurs prix_bas, prix_moyen, prix_haut
  const positionBas = ((prixBas - minPrice) / (maxPrice - minPrice)) * 100;
  const positionMoyen = ((prixMoyen - minPrice) / (maxPrice - minPrice)) * 100;
  const positionHaut = ((prixHaut - minPrice) / (maxPrice - minPrice)) * 100;

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    // Arrondir au step le plus proche
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

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value === '') {
      setAdjustedPrice(prixMoyen);
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      // Limiter aux bornes
      const clamped = Math.max(minPrice, Math.min(numValue, maxPrice));
      setAdjustedPrice(clamped);
    }
  };

  // Déterminer le badge de positionnement
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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-[#0077B6]" />
        <h3 className="text-lg font-semibold text-slate-800">Ajustez le prix de vente</h3>
      </div>

      {/* Prix ajusté principal */}
      <div className="text-center mb-6">
        <p className="text-sm text-slate-500 mb-1">Prix proposé</p>
        <p className="text-4xl font-bold text-[#0077B6]">{formatPriceMF(adjustedPrice)}</p>
        <p className="text-sm text-slate-500 mt-1">{formatPriceXPF(adjustedPrice)}</p>

        {/* Badge de positionnement */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
            {badge.text}
          </span>
          {adjustedPrice !== prixMoyen && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              Number(percentageDiff) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {percentageSign}{percentageDiff}% vs estimation
            </span>
          )}
        </div>
      </div>

      {/* Barre de slider avec marqueurs */}
      <div className="relative mb-8 pt-6">
        {/* Marqueurs de référence */}
        <div className="absolute top-0 left-0 right-0 h-6">
          {/* Marqueur prix bas */}
          <div
            className="absolute transform -translate-x-1/2 text-center"
            style={{ left: `${positionBas}%` }}
          >
            <div className="text-xs text-emerald-600 font-medium whitespace-nowrap">
              {formatPriceMF(prixBas)}
            </div>
          </div>

          {/* Marqueur prix moyen */}
          <div
            className="absolute transform -translate-x-1/2 text-center"
            style={{ left: `${positionMoyen}%` }}
          >
            <div className="text-xs text-[#0077B6] font-medium whitespace-nowrap">
              {formatPriceMF(prixMoyen)}
            </div>
          </div>

          {/* Marqueur prix haut */}
          <div
            className="absolute transform -translate-x-1/2 text-center"
            style={{ left: `${positionHaut}%` }}
          >
            <div className="text-xs text-amber-600 font-medium whitespace-nowrap">
              {formatPriceMF(prixHaut)}
            </div>
          </div>
        </div>

        {/* Barre de fond avec zones colorées */}
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          {/* Zone sous le marché */}
          <div
            className="absolute h-full bg-blue-200"
            style={{ left: 0, width: `${positionBas}%` }}
          />
          {/* Zone normale (bas à haut) */}
          <div
            className="absolute h-full bg-gradient-to-r from-emerald-300 via-amber-300 to-orange-300"
            style={{ left: `${positionBas}%`, width: `${positionHaut - positionBas}%` }}
          />
          {/* Zone au-dessus du marché */}
          <div
            className="absolute h-full bg-red-200"
            style={{ left: `${positionHaut}%`, right: 0 }}
          />

          {/* Marqueurs verticaux */}
          <div
            className="absolute w-0.5 h-full bg-emerald-500"
            style={{ left: `${positionBas}%` }}
          />
          <div
            className="absolute w-0.5 h-full bg-[#0077B6]"
            style={{ left: `${positionMoyen}%` }}
          />
          <div
            className="absolute w-0.5 h-full bg-amber-500"
            style={{ left: `${positionHaut}%` }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={adjustedPrice}
          onChange={handleSliderChange}
          className="absolute top-6 left-0 w-full h-3 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-6
            [&::-webkit-slider-thumb]:h-6
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#0077B6]
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-6
            [&::-moz-range-thumb]:h-6
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#0077B6]
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-grab"
        />

        {/* Labels min/max */}
        <div className="flex justify-between mt-4 text-xs text-slate-400">
          <span>{formatPriceMF(minPrice)}</span>
          <span>{formatPriceMF(maxPrice)}</span>
        </div>
      </div>

      {/* Contrôles d'ajustement fin */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDecrement}
          className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
        >
          <Minus className="w-4 h-4" />
          0,5 MF
        </button>

        <div className="relative">
          <input
            type="text"
            value={new Intl.NumberFormat('fr-FR').format(adjustedPrice)}
            onChange={handleInputChange}
            className="w-40 text-center px-4 py-2 border border-slate-300 rounded-lg focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none font-medium"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">XPF</span>
        </div>

        <button
          onClick={handleIncrement}
          className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          0,5 MF
        </button>
      </div>

      {/* Bouton reset */}
      {adjustedPrice !== prixMoyen && (
        <div className="mt-4 text-center">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-sm text-[#0077B6] hover:text-[#005f8a] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Revenir à l'estimation ({formatPriceMF(prixMoyen)})
          </button>
        </div>
      )}
    </div>
  );
}
