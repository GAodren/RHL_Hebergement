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

  // État pour le prix ajusté par l'agent (utilise initialAdjustedPrice si fourni)
  const [adjustedPrice, setAdjustedPrice] = useState(initialAdjustedPrice || prix_moyen);

  // Pour les terrains, on utilise surface_terrain, sinon surface habitable
  const surfacePrincipale = formData.categorie === 'Terrain' ? formData.surface_terrain : formData.surface;

  // Calculs additionnels pour les statistiques
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

  const StatCard = ({ icon: Icon, label, value, subValue, bgColor, iconColor, borderColor }) => (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-3 transition-transform hover:scale-105`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 ${iconColor} bg-white/50 rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">{label}</p>
          <p className={`text-sm font-bold ${iconColor} truncate`}>{value}</p>
          {subValue && <p className="text-[10px] text-slate-500">{subValue}</p>}
        </div>
      </div>
    </div>
  );

  // Naviguer vers le rapport avec le prix ajusté
  const handleExportPDF = async () => {
    const hasAdjusted = adjustedPrice !== prix_moyen;

    // Mettre à jour le prix ajusté dans la base si nécessaire
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
    <div className="mt-6 space-y-4">
      {/* En-tête avec badge de succès - Version compacte */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4 text-white shadow-lg">
        <div className="flex gap-3">
          {/* Photo du bien si disponible */}
          {bienPhoto && (
            <div className="flex-shrink-0">
              <img
                src={bienPhoto}
                alt="Photo du bien"
                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-white/30 shadow-lg"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0">
                <Banknote className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg md:text-xl font-bold">
                  Estimation terminée
                </h2>
                <p className="text-emerald-100 text-xs">
                  Basée sur les données du marché
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur rounded-lg">
              <Home className="w-4 h-4 text-emerald-200 flex-shrink-0" />
              <p className="text-sm font-medium truncate">
                {getBienLabel()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carte principale avec la fourchette de prix - Version compacte */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-5 border border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#0077B6]" />
          <h3 className="text-base font-semibold text-slate-800">Fourchette de prix estimée</h3>
        </div>

        <PriceRangeBar
          prixBas={prix_bas}
          prixMoyen={prix_moyen}
          prixHaut={prix_haut}
        />

        {/* Valeur centrale mise en avant */}
        <div className="mt-4 text-center p-4 bg-gradient-to-br from-[#E0F4FF] to-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-[#0077B6] font-medium mb-1">Valeur estimée de votre bien</p>
          <p className="text-3xl md:text-4xl font-bold text-[#0077B6]">{formatPriceMF(prix_moyen)}</p>
          <p className="text-slate-500 text-xs mt-1">
            soit {formatPriceXPF(prix_moyen)}
          </p>
        </div>
      </div>

      {/* Composant d'ajustement de prix */}
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
      <div className="flex justify-center">
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl text-lg"
        >
          <FileText className="w-5 h-5" />
          Exporter en PDF {adjustedPrice !== prix_moyen && '(prix ajusté)'}
        </button>
      </div>

      {/* Grille de statistiques colorées */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={MapPin}
          label="Prix/m² secteur"
          value={formatPriceXPF(prix_m2_moyen)}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          borderColor="border-blue-200"
        />
        <StatCard
          icon={Ruler}
          label={formData.categorie === 'Terrain' ? 'Surface terrain' : 'Surface habitable'}
          value={`${surfacePrincipale} m²`}
          subValue={formData.categorie === 'Maison' && formData.surface_terrain ? `Terrain: ${formData.surface_terrain} m²` : undefined}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
        <StatCard
          icon={Calculator}
          label="Prix/m² bas"
          value={formatPriceXPF(prixM2Bas)}
          subValue="fourchette basse"
          bgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          borderColor="border-emerald-200"
        />
        <StatCard
          icon={Calculator}
          label="Prix/m² haut"
          value={formatPriceXPF(prixM2Haut)}
          subValue="fourchette haute"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
          borderColor="border-amber-200"
        />
      </div>

      {/* Statistique sur l'écart */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Écart entre prix bas et haut</p>
            <p className="text-base font-bold text-slate-700">{formatPriceMF(ecartPrix)} <span className="text-xs font-normal text-slate-500">(±{pourcentageEcart}%)</span></p>
          </div>
        </div>
      </div>

      {/* Offres similaires */}
      <SimilarOffers comparables={result.comparables} />

      {/* Note informative */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Information :</span> Cette estimation est basée sur les annonces actives du marché immobilier polynésien et ne constitue pas une évaluation officielle.
        </p>
      </div>

      {/* Bouton d'action */}
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
