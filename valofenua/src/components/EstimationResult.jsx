import { Banknote, RotateCcw } from 'lucide-react';
import PriceRangeBar from './PriceRangeBar';
import { formatPriceXPF } from '../utils/formatPrice';

export default function EstimationResult({ result, formData, onReset }) {
  const { prix_bas, prix_moyen, prix_haut, prix_m2_moyen } = result;

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);
    parts.push(`de ${formData.surface} m²`);
    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <Banknote className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
          Estimation pour votre bien
        </h2>
      </div>

      <p className="text-lg text-slate-600 mb-6">
        {getBienLabel()}
      </p>

      <PriceRangeBar
        prixBas={prix_bas}
        prixMoyen={prix_moyen}
        prixHaut={prix_haut}
      />

      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
        <p className="text-slate-600">
          <span className="font-medium">Prix au m² dans le secteur :</span>{' '}
          <span className="text-[#0077B6] font-semibold">{formatPriceXPF(prix_m2_moyen)}</span>
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-200 transition-colors"
      >
        <RotateCcw className="w-5 h-5" />
        Nouvelle estimation
      </button>
    </div>
  );
}
