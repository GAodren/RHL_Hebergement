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
  const { user, profile, updateProfile, uploadLogo, loading: authLoading } = useAuth();
  const fileInputRef = useRef(null);

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
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [logoPreview, setLogoPreview] = useState(null);

  // Charger les données du profil
  useEffect(() => {
    if (profile) {
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
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    // Masquer le message après 3 secondes
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier (JPG et PNG uniquement)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formats acceptés : JPG ou PNG uniquement' });
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'L\'image ne doit pas dépasser 2 Mo' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    // Prévisualisation locale
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
    setUploading(false);

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Logo */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ImagePlus className="w-5 h-5 text-[#0077B6]" />
              Logo de l'agence
            </h2>
            <div className="flex items-center gap-6">
              <div
                onClick={handleLogoClick}
                className="relative w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0077B6] transition-colors cursor-pointer overflow-hidden bg-slate-50 flex items-center justify-center group"
              >
                {uploading ? (
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
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleLogoChange}
                className="hidden"
              />
              <div className="text-sm text-slate-500">
                <p>Formats acceptés : JPG, PNG</p>
                <p>Taille maximale : 2 Mo</p>
                <p className="mt-2 text-[#0077B6]">
                  Ce logo apparaîtra sur vos rapports d'estimation PDF
                </p>
              </div>
            </div>
          </div>

          {/* Section Informations personnelles */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0077B6]" />
              Informations personnelles
            </h2>
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
            </div>
          </div>

          {/* Section Informations professionnelles */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0077B6]" />
              Informations professionnelles
            </h2>
            <div className="space-y-4">
              {/* Nom de l'agence */}
              <div>
                <label htmlFor="agence" className="block text-sm font-medium text-slate-700 mb-2">
                  Nom de l'agence
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="agence"
                    name="agence"
                    value={formData.agence}
                    onChange={handleChange}
                    placeholder="Agence Immobilière Tahiti"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>

              {/* Numéro de carte professionnelle */}
              <div>
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

              {/* Adresse de l'agence */}
              <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-slate-700 mb-2">
                  Adresse de l'agence
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
            </div>
          </div>

          {/* Section À propos de l'agence */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0077B6]" />
              À propos de l'agence
            </h2>
            <div>
              <label htmlFor="description_agence" className="block text-sm font-medium text-slate-700 mb-2">
                Description de votre agence
              </label>
              <textarea
                id="description_agence"
                name="description_agence"
                value={formData.description_agence}
                onChange={handleChange}
                rows={4}
                placeholder="Présentez votre agence en quelques lignes... (expertise, années d'expérience, zones couvertes, etc.)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors resize-none"
              />
              <p className="text-xs text-slate-500 mt-2">
                Cette description apparaîtra sur vos rapports d'estimation PDF
              </p>
            </div>
          </div>

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
