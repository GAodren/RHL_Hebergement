import { useState, useRef } from 'react';
import { Target, Loader2, AlertCircle, ImagePlus, X } from 'lucide-react';
import { getEstimation, COMMUNES, CATEGORIES, TYPES_BIEN_MAISON, TYPES_BIEN_APPARTEMENT } from '../utils/api';
import { saveEstimation } from '../utils/estimations';
import { useAuth } from '../context/AuthContext';
import EstimationResult from './EstimationResult';

export default function EstimationForm({ initialState }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(
    initialState?.formData || {
      commune: '',
      categorie: '',
      type_bien: '',
      surface: '',
      surface_terrain: '',
    }
  );
  const [result, setResult] = useState(initialState?.result || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bienPhoto, setBienPhoto] = useState(null);
  const currentEstimationId = useRef(null);
  const fileInputRef = useRef(null);

  // Gestion de l'upload de photo
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    // Convertir en base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setBienPhoto(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setBienPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si on change la catégorie, on reset les champs conditionnels
    if (name === 'categorie') {
      setFormData((prev) => ({
        ...prev,
        categorie: value,
        type_bien: '',
        surface: '',
        surface_terrain: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

    // Validation spécifique par catégorie
    if (formData.categorie === 'Terrain') {
      if (!formData.surface_terrain || Number(formData.surface_terrain) < 10) {
        setError('Veuillez entrer une surface terrain valide (minimum 10 m²)');
        return;
      }
    } else {
      if (!formData.surface || Number(formData.surface) < 10) {
        setError('Veuillez entrer une surface habitable valide (minimum 10 m²)');
        return;
      }
      // Type de bien requis pour appartement
      if (formData.categorie === 'Appartement' && !formData.type_bien) {
        setError('Veuillez sélectionner un type de bien');
        return;
      }
    }

    setLoading(true);

    try {
      const data = await getEstimation(formData);
      setResult(data);

      // Sauvegarder automatiquement l'estimation
      if (user) {
        const { data: savedEstimation, error: saveError } = await saveEstimation(
          user.id,
          formData,
          data
        );
        if (savedEstimation) {
          currentEstimationId.current = savedEstimation.id;
        }
        if (saveError) {
          console.error('Erreur sauvegarde estimation:', saveError);
        }
      }
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
      surface_terrain: '',
    });
    setBienPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    currentEstimationId.current = null;
  };

  // Obtenir les types de bien selon la catégorie
  const getTypesForCategory = () => {
    switch (formData.categorie) {
      case 'Maison':
        return TYPES_BIEN_MAISON;
      case 'Appartement':
        return TYPES_BIEN_APPARTEMENT;
      default:
        return [];
    }
  };

  // Vérifier si le type de bien est requis
  const isTypeBienRequired = formData.categorie === 'Appartement';

  if (result) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <EstimationResult
          result={result}
          formData={formData}
          onReset={handleReset}
          estimationId={currentEstimationId.current}
          bienPhoto={bienPhoto}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-xl mx-auto">
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

        {/* Champs conditionnels avec animation */}
        <div
          className={`space-y-6 overflow-hidden transition-all duration-300 ease-in-out ${
            formData.categorie ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Type de bien - Maison ou Appartement */}
          {(formData.categorie === 'Maison' || formData.categorie === 'Appartement') && (
            <div className="animate-fadeIn">
              <label htmlFor="type_bien" className="block text-sm font-medium text-slate-700 mb-2">
                Type de bien {isTypeBienRequired && <span className="text-red-500">*</span>}
              </label>
              <select
                id="type_bien"
                name="type_bien"
                value={formData.type_bien}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all bg-white"
              >
                <option value="">
                  {isTypeBienRequired ? 'Sélectionnez un type' : 'Sélectionnez un type (optionnel)'}
                </option>
                {getTypesForCategory().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Surface habitable - Maison ou Appartement */}
          {(formData.categorie === 'Maison' || formData.categorie === 'Appartement') && (
            <div className="animate-fadeIn">
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
          )}

          {/* Surface terrain - Maison (optionnel) ou Terrain (requis) */}
          {(formData.categorie === 'Maison' || formData.categorie === 'Terrain') && (
            <div className="animate-fadeIn">
              <label htmlFor="surface_terrain" className="block text-sm font-medium text-slate-700 mb-2">
                Surface terrain (m²) {formData.categorie === 'Terrain' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                id="surface_terrain"
                name="surface_terrain"
                value={formData.surface_terrain}
                onChange={handleChange}
                min="10"
                placeholder={formData.categorie === 'Terrain' ? 'Ex: 800' : 'Ex: 500 (optionnel)'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#0077B6] focus:ring-2 focus:ring-[#0077B6]/20 outline-none transition-all"
              />
            </div>
          )}

          {/* Photo du bien (optionnel) */}
          <div className="animate-fadeIn">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Photo du bien <span className="text-slate-400 font-normal">(optionnel)</span>
            </label>
            <p className="text-xs text-slate-500 mb-3">
              Ajoutez une photo pour personnaliser votre rapport PDF
            </p>

            {bienPhoto ? (
              <div className="relative inline-block">
                <img
                  src={bienPhoto}
                  alt="Photo du bien"
                  className="max-w-full max-h-48 object-contain rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Supprimer la photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl py-12 px-6 text-center cursor-pointer hover:border-[#0077B6] hover:bg-[#E0F4FF]/30 transition-colors"
              >
                <ImagePlus className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 text-sm font-medium">Cliquez pour ajouter une photo</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG • Max 5 Mo</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
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

        {/* Message de patience pendant le chargement */}
        {loading && (
          <p className="text-center text-sm text-slate-500 mt-3">
            Veuillez patienter, l'analyse prend environ 10 secondes...
          </p>
        )}
      </div>
    </form>
  );
}
