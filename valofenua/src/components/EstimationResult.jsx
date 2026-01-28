import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, RotateCcw, MapPin, Ruler, TrendingUp, Home, Calculator, BarChart3, FileText } from 'lucide-react';
import PriceRangeBar from './PriceRangeBar';
import PriceAdjuster from './PriceAdjuster';
import SimilarOffers from './SimilarOffers';
import MarketTrends from './MarketTrends';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';
import { updateEstimation } from '../utils/estimations';

export default function EstimationResult({ result, formData, onReset, estimationId, bienPhoto, initialAdjustedPrice }) {
  const navigate = useNavigate();
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  const [adjustedPrice, setAdjustedPrice] = useState(initialAdjustedPrice || prix_moyen);

  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  const ecartPrix = prix_haut - prix_bas;
  const pourcentageEcart = ((ecartPrix / prix_moyen) * 100).toFixed(0);
  const prixM2Bas = surfacePrincipale ? Math.round(prix_bas / surfacePrincipale) : 0;
  const prixM2Haut = surfacePrincipale ? Math.round(prix_haut / surfacePrincipale) : 0;

  const handlePriceChange = useCallback((newPrice) => {
    setAdjustedPrice(newPrice);
  }, []);

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);

    if (formData.categorie === 'Terrain') {
      parts.push(`de ${formData.surface_terrain} m²`);
    } else {
      parts.push(`de ${formData.surface} m²`);
      if (formData.surface_terrain) {
        parts.push(`(terrain ${formData.surface_terrain} m²)`);
      }
    }

    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
  };

  const handleExportPDF = async () => {
    const hasAdjusted = adjustedPrice !== prix_moyen;

    if (estimationId && hasAdjusted) {
      await updateEstimation(estimationId, { prix_ajuste: adjustedPrice });
    }

    navigate('/rapport', {
      state: {
        result,
        formData,
        adjustedPrice: hasAdjusted ? adjustedPrice : null,
        bienPhoto,
        estimationId
      }
    });
  };

  return (
    <div className="mt-4 space-y-3 max-w-xl mx-auto">
      {/* En-tête compact */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg p-3 text-white shadow">
        <div className="flex gap-3 items-center">
          {bienPhoto && (
            <img
              src={bienPhoto}
              alt="Photo du bien"
              className="w-14 h-14 object-cover rounded-lg border border-white/30 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold text-sm">Estimation terminée</span>
            </div>
            <p className="text-xs text-emerald-100 truncate mt-0.5">{getBienLabel()}</p>
          </div>
        </div>
      </div>

      {/* Prix principal */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-slate-100">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-4 h-4 text-[#0077B6]" />
          <span className="text-sm font-medium text-slate-700">Fourchette de prix</span>
        </div>

        <PriceRangeBar
          prixBas={prix_bas}
          prixMoyen={prix_moyen}
          prixHaut={prix_haut}
        />

        <div className="mt-3 text-center py-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[10px] text-[#0077B6] font-medium uppercase tracking-wide">Valeur estimée</p>
          <p className="text-2xl font-bold text-[#0077B6]">{formatPriceMF(prix_moyen)}</p>
          <p className="text-[10px] text-slate-500">{formatPriceXPF(prix_moyen)}</p>
        </div>
      </div>

      {/* Ajustement de prix */}
      <PriceAdjuster
        prixBas={prix_bas}
        prixMoyen={prix_moyen}
        prixHaut={prix_haut}
        onPriceChange={handlePriceChange}
        initialValue={initialAdjustedPrice}
      />

      {/* Tendance du marché */}
      <MarketTrends commune={formData.commune} />

      {/* Bouton PDF */}
      <button
        onClick={handleExportPDF}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow text-sm"
      >
        <FileText className="w-4 h-4" />
        Exporter en PDF {adjustedPrice !== prix_moyen && '(prix ajusté)'}
      </button>

      {/* Stats en grille compacte */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
          <MapPin className="w-3.5 h-3.5 text-blue-600 mx-auto mb-1" />
          <p className="text-[9px] text-slate-500 uppercase">Prix/m²</p>
          <p className="text-xs font-bold text-blue-600">{(prix_m2_moyen / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-100">
          <Ruler className="w-3.5 h-3.5 text-purple-600 mx-auto mb-1" />
          <p className="text-[9px] text-slate-500 uppercase">Surface</p>
          <p className="text-xs font-bold text-purple-600">{surfacePrincipale} m²</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
          <Calculator className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
          <p className="text-[9px] text-slate-500 uppercase">m² bas</p>
          <p className="text-xs font-bold text-emerald-600">{(prixM2Bas / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-2 text-center border border-amber-100">
          <Calculator className="w-3.5 h-3.5 text-amber-600 mx-auto mb-1" />
          <p className="text-[9px] text-slate-500 uppercase">m² haut</p>
          <p className="text-xs font-bold text-amber-600">{(prixM2Haut / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Écart */}
      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-200">
        <BarChart3 className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-xs text-slate-600">Écart bas/haut : </span>
          <span className="text-xs font-semibold text-slate-700">{formatPriceMF(ecartPrix)}</span>
          <span className="text-[10px] text-slate-400 ml-1">(±{pourcentageEcart}%)</span>
        </div>
      </div>

      {/* Offres similaires */}
      <SimilarOffers comparables={result.comparables} />

      {/* Note */}
      <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
        <span className="font-medium">Note :</span> Estimation indicative basée sur le marché polynésien, ne constitue pas une évaluation officielle.
      </p>

      {/* Nouvelle estimation */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 bg-[#0077B6] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#005f8a] transition-colors text-sm"
      >
        <RotateCcw className="w-4 h-4" />
        Nouvelle estimation
      </button>
    </div>
  );
}
