import { useState, useEffect, useRef } from 'react';
import { Minus, Plus, RotateCcw, Sliders, Edit3, Check, X, Percent } from 'lucide-react';
import { formatPriceMF, formatPriceXPF } from '../utils/formatPrice';

export default function PriceAdjuster({ prixBas, prixMoyen, prixHaut, onPriceChange, onCommissionChange, initialValue, initialCommission }) {
  const minPrice = Math.round(prixBas * 0.9);
  const maxPrice = Math.round(prixHaut * 1.1);
  const step = 500000;

  const [adjustedPrice, setAdjustedPrice] = useState(initialValue || prixMoyen);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [commission, setCommission] = useState(initialCommission || 0);
  const [showCommission, setShowCommission] = useState(initialCommission > 0);
  const inputRef = useRef(null);

  useEffect(() => {
    onPriceChange(adjustedPrice);
  }, [adjustedPrice, onPriceChange]);

  useEffect(() => {
    if (onCommissionChange) {
      onCommissionChange(commission);
    }
  }, [commission, onCommissionChange]);

  // Calcul du prix final avec commission
  const commissionAmount = Math.round(adjustedPrice * (commission / 100));
  const finalPrice = adjustedPrice + commissionAmount;

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
    setIsCustomMode(false);
  };

  const handleCommissionChange = (e) => {
    const value = e.target.value;
    // Permettre les valeurs vides ou les nombres avec maximum 2 décimales
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numValue = value === '' ? 0 : parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
        setCommission(numValue);
      }
    }
  };

  const handleToggleCommission = () => {
    if (showCommission) {
      setCommission(0);
    }
    setShowCommission(!showCommission);
  };

  // Mode prix personnalisé
  const handleEnableCustomMode = () => {
    setIsCustomMode(true);
    // Convertir le prix actuel en millions pour l'affichage
    setCustomPriceInput((adjustedPrice / 1000000).toFixed(1).replace('.', ','));
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCustomPriceSubmit = () => {
    // Convertir l'input en nombre (gérer la virgule française)
    const cleanedInput = customPriceInput.replace(',', '.').replace(/\s/g, '');
    const valueInMillions = parseFloat(cleanedInput);

    if (!isNaN(valueInMillions) && valueInMillions > 0) {
      const newPrice = Math.round(valueInMillions * 1000000);
      setAdjustedPrice(newPrice);
    }
    setIsCustomMode(false);
  };

  const handleCustomPriceCancel = () => {
    setIsCustomMode(false);
    setCustomPriceInput('');
  };

  const handleCustomInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCustomPriceSubmit();
    } else if (e.key === 'Escape') {
      handleCustomPriceCancel();
    }
  };

  // Vérifier si le prix est en dehors de la fourchette normale
  const isOutOfRange = adjustedPrice < minPrice || adjustedPrice > maxPrice;

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
    <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-[#0077B6]" />
        <span className="text-base font-semibold text-slate-800">Ajustez le prix de vente</span>
      </div>

      {/* Prix et badges */}
      <div className="text-center mb-4">
        {isCustomMode ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={customPriceInput}
                onChange={(e) => setCustomPriceInput(e.target.value)}
                onKeyDown={handleCustomInputKeyDown}
                placeholder="Ex: 120,5"
                className="w-40 text-2xl font-bold text-[#0077B6] border-2 border-[#0077B6] rounded-lg pl-3 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-slate-400 pointer-events-none">MF</span>
            </div>
            <button
              onClick={handleCustomPriceSubmit}
              className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              title="Valider"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCustomPriceCancel}
              className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors"
              title="Annuler"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="text-3xl font-bold text-[#0077B6]">{formatPriceMF(adjustedPrice)}</p>
            <button
              onClick={handleEnableCustomMode}
              className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-blue-50 rounded-lg transition-colors"
              title="Saisir un prix personnalisé"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
        )}
        <p className="text-sm text-slate-500">{formatPriceXPF(adjustedPrice)}</p>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
            {badge.text}
          </span>
          {isOutOfRange && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
              Prix personnalisé
            </span>
          )}
          {adjustedPrice !== prixMoyen && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              Number(percentageDiff) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {percentageSign}{percentageDiff}% vs estimation
            </span>
          )}
        </div>
      </div>

      {/* Message si prix hors fourchette */}
      {isOutOfRange && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-purple-700">
            Vous avez défini un prix personnalisé en dehors de la fourchette estimée.
            <button
              onClick={handleReset}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Revenir à l'estimation
            </button>
          </p>
        </div>
      )}

      {/* Slider */}
      <div className={`relative mb-6 pt-6 ${isOutOfRange ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Marqueurs */}
        <div className="absolute top-0 left-0 right-0">
          <span className="text-xs text-emerald-600 font-medium absolute" style={{ left: `${positionBas}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixBas)}
          </span>
          <span className="text-xs text-[#0077B6] font-medium absolute" style={{ left: `${positionMoyen}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixMoyen)}
          </span>
          <span className="text-xs text-amber-600 font-medium absolute" style={{ left: `${positionHaut}%`, transform: 'translateX(-50%)' }}>
            {formatPriceMF(prixHaut)}
          </span>
        </div>

        {/* Barre */}
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
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
          className="absolute top-6 left-0 w-full h-3 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#0077B6]
            [&::-webkit-slider-thumb]:border-3
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#0077B6]
            [&::-moz-range-thumb]:border-3
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-lg"
        />

        <div className="flex justify-between mt-3 text-xs text-slate-400">
          <span>{formatPriceMF(minPrice)}</span>
          <span>{formatPriceMF(maxPrice)}</span>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDecrement}
          className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 font-medium transition-colors"
        >
          <Minus className="w-4 h-4" />
          0,5 MF
        </button>

        {adjustedPrice !== prixMoyen && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 text-[#0077B6] hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        )}

        <button
          onClick={handleIncrement}
          className="flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          0,5 MF
        </button>
      </div>

      {/* Section Commission */}
      <div className="mt-5 pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Ajouter votre commission</span>
          </div>
          <button
            onClick={handleToggleCommission}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showCommission ? 'bg-[#0077B6]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                showCommission ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {showCommission && (
          <div className="bg-slate-50 rounded-lg p-4 space-y-4">
            {/* Input pourcentage */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-600 flex-shrink-0">Taux de commission :</label>
              <div className="relative flex-1 max-w-32">
                <input
                  type="number"
                  value={commission || ''}
                  onChange={handleCommissionChange}
                  placeholder="0"
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-full px-3 py-2 pr-8 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6] transition-colors text-center font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">%</span>
              </div>
            </div>

            {/* Boutons de présets */}
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6].map((percent) => (
                <button
                  key={percent}
                  onClick={() => setCommission(percent)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    commission === percent
                      ? 'bg-[#0077B6] text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#0077B6] hover:text-[#0077B6]'
                  }`}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Récapitulatif avec commission */}
            {commission > 0 && (
              <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Prix de vente</span>
                  <span className="font-medium text-slate-700">{formatPriceMF(adjustedPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Commission ({commission}%)</span>
                  <span className="font-medium text-emerald-600">+ {formatPriceMF(commissionAmount)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between">
                  <span className="text-sm font-semibold text-slate-700">Prix final TTC</span>
                  <span className="text-lg font-bold text-[#0077B6]">{formatPriceMF(finalPrice)}</span>
                </div>
                <p className="text-xs text-slate-400 text-center">
                  soit {formatPriceXPF(finalPrice)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
