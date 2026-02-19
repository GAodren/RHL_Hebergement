import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building2,
  Phone,
  Mail,
  CreditCard,
  Upload,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ImagePlus,
  MapPin,
  Globe,
  FileText
} from 'lucide-react';

export default function Profil({ embedded = false }) {
  const { user, profile, updateProfile, uploadLogo, uploadAgentPhoto, loading: authLoading } = useAuth();
  const logoInputRef = useRef(null);
  const photoAgentInputRef = useRef(null);
  const hasInitialized = useRef(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    agence: '',
    numero_carte_pro: '',
    adresse: '',
    site_web: '',
    description_agence: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [photoAgentPreview, setPhotoAgentPreview] = useState(null);

  // Charger les données du profil uniquement au premier chargement
  useEffect(() => {
    if (profile && !hasInitialized.current) {
      hasInitialized.current = true;
      setFormData({
        nom: profile.nom || '',
        prenom: profile.prenom || '',
        telephone: profile.telephone || '',
        agence: profile.agence || '',
        numero_carte_pro: profile.numero_carte_pro || '',
        adresse: profile.adresse || '',
        site_web: profile.site_web || '',
        description_agence: profile.description_agence || '',
      });
      setLogoPreview(profile.logo_url || null);
      setPhotoAgentPreview(profile.photo_agent_url || null);
    }
  }, [profile]);

  // Compteur de lignes (retours à la ligne uniquement)
  const MAX_DESCRIPTION_LINES = 10;

  const countLines = (text) => {
    if (!text) return 0;
    // Compte le nombre de retours à la ligne + 1 (première ligne)
    return (text.match(/\n/g) || []).length + 1;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limiter la description à 10 lignes
    if (name === 'description_agence') {
      const lines = countLines(value);
      if (lines > MAX_DESCRIPTION_LINES) {
        return; // Ne pas mettre à jour si dépassement
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const { error } = await updateProfile(formData);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } else {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
    }
    setSaving(false);

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handlePhotoAgentClick = () => {
    photoAgentInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formats acceptés : JPG ou PNG uniquement' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 2 Mo' });
      return;
    }

    setUploadingLogo(true);
    setMessage({ type: '', text: '' });

    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result);
    reader.readAsDataURL(file);

    const { error, url } = await uploadLogo(file);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'upload du logo' });
      setLogoPreview(profile?.logo_url || null);
    } else {
      setMessage({ type: 'success', text: 'Logo mis à jour avec succès' });
      setLogoPreview(url);
    }
    setUploadingLogo(false);

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePhotoAgentChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formats acceptés : JPG ou PNG uniquement' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 2 Mo' });
      return;
    }

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });

    const reader = new FileReader();
    reader.onload = (e) => setPhotoAgentPreview(e.target?.result);
    reader.readAsDataURL(file);

    const { error, url } = await uploadAgentPhoto(file);

    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors de l\'upload de la photo' });
      setPhotoAgentPreview(profile?.photo_agent_url || null);
    } else {
      setMessage({ type: 'success', text: 'Photo mise à jour avec succès' });
      setPhotoAgentPreview(url);
    }
    setUploadingPhoto(false);

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6]"></div>
      </div>
    );
  }

  const content = (
    <div className={embedded ? "py-8 px-4" : "min-h-screen bg-slate-50 py-12 px-4"}>
      <div className="max-w-2xl mx-auto">
        {/* En-tête */}
        {!embedded && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Mon Profil
            </h1>
            <p className="text-slate-600 mt-1">
              Gérez vos informations personnelles et professionnelles
            </p>
          </div>
        )}

        {/* Message de feedback */}
        {message.text && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========== SECTION AGENCE ========== */}
          <div className="border-b-2 border-[#0077B6] pb-2">
            <h2 className="text-xl font-bold text-[#0077B6] flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Mon Agence
            </h2>
          </div>

          {/* Logo de l'agence */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-[#0077B6]" />
              Logo de l'agence
            </h3>
            <div className="flex items-center gap-6">
              <div
                onClick={handleLogoClick}
                className="relative w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0077B6] transition-colors cursor-pointer overflow-hidden bg-slate-50 flex items-center justify-center group"
              >
                {uploadingLogo ? (
                  <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
                ) : logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="Logo de l'agence"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">Cliquez pour ajouter</span>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="text-sm text-slate-500">
                <p>Formats acceptés : JPG, PNG</p>
                <p>Taille maximale : 2 Mo</p>
              </div>
            </div>
          </div>

          {/* Informations de l'agence */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0077B6]" />
              Informations de l'agence
            </h3>
            <div className="space-y-4">
              {/* Nom de l'agence */}
              <div>
                <label htmlFor="agence" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom de l'agence
                </label>
                <input
                  type="text"
                  id="agence"
                  name="agence"
                  value={formData.agence}
                  onChange={handleChange}
                  placeholder="Agence Immobilière Tahiti"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                />
              </div>

              {/* Adresse de l'agence */}
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="123 Rue du Commerce, 98713 Papeete"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              {/* Site web */}
              <div>
                <label htmlFor="site_web" className="block text-sm font-medium text-slate-700 mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    id="site_web"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    placeholder="https://www.mon-agence.pf"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              {/* Description de l'agence */}
              <div>
                <label htmlFor="description_agence" className="block text-sm font-medium text-slate-700 mb-2">
                  Description de l'agence
                  <span className={`font-normal ml-2 ${countLines(formData.description_agence) >= MAX_DESCRIPTION_LINES ? 'text-amber-500' : 'text-slate-400'}`}>
                    ({countLines(formData.description_agence)}/{MAX_DESCRIPTION_LINES} lignes)
                  </span>
                </label>
                <textarea
                  id="description_agence"
                  name="description_agence"
                  value={formData.description_agence}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Présentez votre agence en quelques lignes (10 lignes max)..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* ========== SECTION AGENT ========== */}
          <div className="border-b-2 border-[#0077B6] pb-2 mt-10">
            <h2 className="text-xl font-bold text-[#0077B6] flex items-center gap-2">
              <User className="w-6 h-6" />
              Mon Profil Agent
            </h2>
          </div>

          {/* Photo de l'agent */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0077B6]" />
              Ma photo
            </h3>
            <div className="flex items-center gap-6">
              <div
                onClick={handlePhotoAgentClick}
                className="relative w-32 h-32 rounded-full border-2 border-dashed border-slate-300 hover:border-[#0077B6] transition-colors cursor-pointer overflow-hidden bg-slate-50 flex items-center justify-center group"
              >
                {uploadingPhoto ? (
                  <Loader2 className="w-8 h-8 text-[#0077B6] animate-spin" />
                ) : photoAgentPreview ? (
                  <>
                    <img
                      src={photoAgentPreview}
                      alt="Photo de l'agent"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs text-slate-500">Ajouter</span>
                  </div>
                )}
              </div>
              <input
                ref={photoAgentInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoAgentChange}
                className="hidden"
              />
              <div className="text-sm text-slate-500">
                <p>Formats acceptés : JPG, PNG</p>
                <p>Taille maximale : 2 Mo</p>
                <p className="mt-2 text-[#0077B6]">
                  Cette photo apparaîtra sur vos rapports PDF
                </p>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0077B6]" />
              Informations personnelles
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prénom */}
              <div>
                <label htmlFor="prenom" className="block text-sm font-medium text-slate-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                />
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                />
              </div>

              {/* Email (lecture seule) */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  L'email ne peut pas être modifié
                </p>
              </div>

              {/* Téléphone */}
              <div className="sm:col-span-2">
                <label htmlFor="telephone" className="block text-sm font-medium text-slate-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="87 12 34 56"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              {/* Numéro de carte professionnelle */}
              <div className="sm:col-span-2">
                <label htmlFor="numero_carte_pro" className="block text-sm font-medium text-slate-700 mb-2">
                  Numéro de carte professionnelle
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="numero_carte_pro"
                    name="numero_carte_pro"
                    value={formData.numero_carte_pro}
                    onChange={handleChange}
                    placeholder="CPI XXXX XXXX XXXX"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message de feedback (en bas) */}
          {message.text && (
            <div className={`flex items-center gap-3 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Bouton Enregistrer */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#0077B6] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#005f8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  return embedded ? content : <main>{content}</main>;
}
