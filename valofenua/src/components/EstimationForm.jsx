import { useState } from 'react';
import { Target, Loader2, AlertCircle } from 'lucide-react';
import { getEstimation, COMMUNES, CATEGORIES, TYPES_BIEN } from '../utils/api';
import EstimationResult from './EstimationResult';

export default function EstimationForm() {
  const [formData, setFormData] = useState({
    commune: '',
    categorie: '',
    type_bien: '',
    surface: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.commune) {
      setError('Veuillez sélectionner une commune');
      return;
    }
    if (!formData.categorie) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }
    if (!formData.surface || Number(formData.surface) < 10) {
      setError('Veuillez entrer une surface valide (minimum 10 m²)');
      return;
    }

    setLoading(true);

    try {
      const data = await getEstimation(formData);
      setResult(data);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'estimation. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      commune: '',
      categorie: '',
      type_bien: '',
      surface: '',
    });
  };

  if (result) {
    return <EstimationResult result={result} formData={formData} onReset={handleReset} />;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="space-y-6">
        {/* Commune */}
        <div>
          <label htmlFor="commune" className="block text-sm font-medium text-slate-700 mb-2">
            Commune <span className="text-red-500">*</span>
          </label>
          <select
            id="commune"
            name="commune"
            value={formData.commune}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez une commune</option>
            {COMMUNES.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="categorie" className="block text-sm font-medium text-slate-700 mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez une catégorie</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Type de bien */}
        <div>
          <label htmlFor="type_bien" className="block text-sm font-medium text-slate-700 mb-2">
            Type de bien
          </label>
          <select
            id="type_bien"
            name="type_bien"
            value={formData.type_bien}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all bg-white"
          >
            <option value="">Sélectionnez un type (optionnel)</option>
            {TYPES_BIEN.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Surface */}
        <div>
          <label htmlFor="surface" className="block text-sm font-medium text-slate-700 mb-2">
            Surface habitable (m²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="surface"
            name="surface"
            value={formData.surface}
            onChange={handleChange}
            min="10"
            placeholder="Ex: 120"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all"
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0077B6] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#005f8a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Obtenir mon estimation
            </>
          )}
        </button>
      </div>
    </form>
  );
}
