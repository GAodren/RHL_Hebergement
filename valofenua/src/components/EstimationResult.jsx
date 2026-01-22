import { useNavigate } from 'react-router-dom';
import { Banknote, RotateCcw, MapPin, Ruler, TrendingUp, Home, Calculator, BarChart3, FileText } from 'lucide-react';
import PriceRangeBar from './PriceRangeBar';
import SimilarOffers from './SimilarOffers';
import { formatPriceXPF, formatPriceMF } from '../utils/formatPrice';

export default function EstimationResult({ result, formData, onReset }) {
  const navigate = useNavigate();
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  // Calculs additionnels pour les statistiques
  const ecartPrix = prix_haut - prix_bas;
  const pourcentageEcart = ((ecartPrix / prix_moyen) * 100).toFixed(0);
  const prixM2Bas = Math.round(prix_bas / formData.surface);
  const prixM2Haut = Math.round(prix_haut / formData.surface);

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);
    parts.push(`de ${formData.surface} m²`);
    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
  };

  const StatCard = ({ icon: Icon, label, value, subValue, bgColor, iconColor, borderColor }) => (
    <div className={`${bgColor} ${borderColor} border rounded-xl p-4 transition-transform hover:scale-105`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${iconColor} bg-white/50 rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">{label}</p>
          <p className={`text-lg font-bold ${iconColor} truncate`}>{value}</p>
          {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8 space-y-6">
      {/* En-tête avec badge de succès */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Estimation terminée
            </h2>
            <p className="text-emerald-100 text-sm">
              Basée sur les données du marché polynésien
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 p-3 bg-white/10 backdrop-blur rounded-xl">
          <Home className="w-5 h-5 text-emerald-200" />
          <p className="text-lg font-medium">
            {getBienLabel()}
          </p>
        </div>
      </div>

      {/* Carte principale avec la fourchette de prix */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#0077B6]" />
          <h3 className="text-lg font-semibold text-slate-800">Fourchette de prix estimée</h3>
        </div>

        <PriceRangeBar
          prixBas={prix_bas}
          prixMoyen={prix_moyen}
          prixHaut={prix_haut}
        />

        {/* Valeur centrale mise en avant */}
        <div className="mt-6 text-center p-6 bg-gradient-to-br from-[#E0F4FF] to-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-[#0077B6] font-medium mb-1">Valeur estimée de votre bien</p>
          <p className="text-4xl md:text-5xl font-bold text-[#0077B6]">{formatPriceMF(prix_moyen)}</p>
          <p className="text-slate-500 text-sm mt-2">
            soit {formatPriceXPF(prix_moyen)}
          </p>
        </div>

        {/* Bouton PDF placé juste après l'estimation */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/rapport', { state: { result, formData } })}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
          >
            <FileText className="w-5 h-5" />
            Exporter en PDF
          </button>
        </div>
      </div>

      {/* Grille de statistiques colorées */}
      <div className="grid grid-cols-2 gap-4">
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
          label="Surface"
          value={`${formData.surface} m²`}
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
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-5 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Écart entre prix bas et haut</p>
            <p className="text-xl font-bold text-slate-700">{formatPriceMF(ecartPrix)}</p>
            <p className="text-xs text-slate-500">soit environ ±{pourcentageEcart}% autour de l'estimation</p>
          </div>
        </div>
      </div>

      {/* Offres similaires */}
      <SimilarOffers comparables={result.comparables} />

      {/* Note informative */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <span className="font-semibold">Information :</span> Cette estimation est basée sur les annonces actives du marché immobilier polynésien.
          Elle est fournie à titre indicatif et ne constitue pas une évaluation officielle.
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
