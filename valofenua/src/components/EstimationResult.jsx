import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, RotateCcw, MapPin, Ruler, TrendingUp, Calculator, FileText, Eye, EyeOff } from 'lucide-react';
import PriceRangeBar from './PriceRangeBar';
import PriceAdjuster from './PriceAdjuster';
import SimilarOffers from './SimilarOffers';
import MarketTrends from './MarketTrends';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';
import { updateEstimation } from '../utils/estimations';

// Composant wrapper pour les sections toggleables
function ToggleableSection({ id, visible, onToggle, children, className = '' }) {
  return (
    <div className={`relative ${!visible ? 'opacity-40' : ''} ${className}`}>
      {/* Bouton toggle en haut à droite */}
      <button
        onClick={() => onToggle(id)}
        className={`absolute -top-2 -right-2 z-10 p-1.5 rounded-full shadow-md border transition-all ${
          visible
            ? 'bg-white border-slate-200 text-slate-500 hover:text-[#0077B6] hover:border-[#0077B6]'
            : 'bg-slate-200 border-slate-300 text-slate-400 hover:bg-slate-300'
        }`}
        title={visible ? 'Masquer du PDF' : 'Afficher dans le PDF'}
      >
        {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
      {children}
    </div>
  );
}

export default function EstimationResult({ result, formData, onReset, estimationId, bienPhoto, initialAdjustedPrice }) {
  const navigate = useNavigate();
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  const [adjustedPrice, setAdjustedPrice] = useState(initialAdjustedPrice || prix_moyen);

  // État de visibilité des sections pour le PDF
  const [sectionVisibility, setSectionVisibility] = useState({
    marketTrends: true,
    statsGrid: true,
    similarOffers: true,
  });

  // État pour masquer des biens similaires individuellement (indices des biens masqués)
  const [hiddenComparables, setHiddenComparables] = useState([]);

  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  const prixM2Bas = surfacePrincipale ? Math.round(prix_bas / surfacePrincipale) : 0;
  const prixM2Haut = surfacePrincipale ? Math.round(prix_haut / surfacePrincipale) : 0;

  const handlePriceChange = useCallback((newPrice) => {
    setAdjustedPrice(newPrice);
  }, []);

  const toggleSection = useCallback((sectionId) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);

  const toggleComparable = useCallback((index) => {
    setHiddenComparables(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
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
        estimationId,
        sectionVisibility,
        hiddenComparables
      }
    });
  };

  return (
    <div className="mt-6 space-y-4">
      {/* En-tête - OBLIGATOIRE */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex gap-4 items-center">
          {bienPhoto && (
            <img
              src={bienPhoto}
              alt="Photo du bien"
              className="w-28 h-28 object-cover rounded-lg border-2 border-white/30 flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold text-lg">Estimation terminée</span>
            </div>
            <p className="text-sm text-emerald-100">{getBienLabel()}</p>
          </div>
        </div>
      </div>

      {/* Prix principal - OBLIGATOIRE */}
      <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#0077B6]" />
          <span className="text-base font-semibold text-slate-800">Fourchette de prix estimée</span>
        </div>

        <PriceRangeBar
          prixBas={prix_bas}
          prixMoyen={prix_moyen}
          prixHaut={prix_haut}
        />

        <div className="mt-4 text-center py-4 bg-gradient-to-br from-[#E0F4FF] to-blue-50 rounded-xl border border-blue-200">
          <p className="text-xs text-[#0077B6] font-medium uppercase tracking-wide">Valeur estimée de votre bien</p>
          <p className="text-3xl font-bold text-[#0077B6] mt-1">{formatPriceMF(prix_moyen)}</p>
          <p className="text-xs text-slate-500 mt-1">{formatPriceXPF(prix_moyen)}</p>
        </div>
      </div>

      {/* Ajustement de prix - Interactif uniquement, pas dans le PDF */}
      <PriceAdjuster
        prixBas={prix_bas}
        prixMoyen={prix_moyen}
        prixHaut={prix_haut}
        onPriceChange={handlePriceChange}
        initialValue={initialAdjustedPrice}
      />

      {/* Tendance du marché - TOGGLEABLE */}
      <ToggleableSection
        id="marketTrends"
        visible={sectionVisibility.marketTrends}
        onToggle={toggleSection}
        className="flex justify-center"
      >
        <div className="w-full max-w-sm">
          <MarketTrends commune={formData.commune} />
        </div>
      </ToggleableSection>

      {/* Bouton PDF */}
      <div className="flex justify-center">
        <button
          onClick={handleExportPDF}
          className="w-full max-w-sm flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl text-lg"
        >
          <FileText className="w-5 h-5" />
          Exporter en PDF {adjustedPrice !== prix_moyen && '(prix ajusté)'}
        </button>
      </div>

      {/* Stats en grille - TOGGLEABLE */}
      <ToggleableSection
        id="statsGrid"
        visible={sectionVisibility.statsGrid}
        onToggle={toggleSection}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
            <MapPin className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 uppercase">Prix/m²</p>
            <p className="text-sm font-bold text-blue-600">{formatPriceXPF(prix_m2_moyen)}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
            <Ruler className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 uppercase">Surface</p>
            <p className="text-sm font-bold text-purple-600">{surfacePrincipale} m²</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-200">
            <Calculator className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 uppercase">Prix/m² bas</p>
            <p className="text-sm font-bold text-emerald-600">{formatPriceXPF(prixM2Bas)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-200">
            <Calculator className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xs text-slate-500 uppercase">Prix/m² haut</p>
            <p className="text-sm font-bold text-amber-600">{formatPriceXPF(prixM2Haut)}</p>
          </div>
        </div>
      </ToggleableSection>

      {/* Offres similaires - TOGGLEABLE */}
      <ToggleableSection
        id="similarOffers"
        visible={sectionVisibility.similarOffers}
        onToggle={toggleSection}
      >
        <SimilarOffers
          comparables={result.comparables}
          hiddenComparables={hiddenComparables}
          onToggleComparable={toggleComparable}
        />
      </ToggleableSection>

      {/* Note - toujours affichée (non toggleable) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Information :</span> Cette estimation est basée sur les annonces actives du marché immobilier polynésien et ne constitue pas une évaluation officielle.
        </p>
      </div>

      {/* Nouvelle estimation */}
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077B6] to-[#005f8a] text-white px-6 py-4 rounded-xl font-medium hover:from-[#005f8a] hover:to-[#004a6d] transition-all shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          Nouvelle estimation
        </button>
      </div>
    </div>
  );
}
