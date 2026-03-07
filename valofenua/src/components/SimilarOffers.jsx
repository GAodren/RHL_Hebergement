import { Home, MapPin, Ruler, Banknote, Eye, EyeOff, Pencil, X, Upload, Save } from 'lucide-react';
import { useState, useRef } from 'react';

export default function SimilarOffers({ comparables, hiddenComparables = [], onToggleComparable, editedComparables = {}, onEditComparable }) {
  // Ne rien afficher si pas de comparables
  if (!comparables || !Array.isArray(comparables) || comparables.length === 0) {
    return null;
  }

  // Limiter à 5 offres maximum
  const offersToShow = comparables.slice(0, 5);

  // État pour la modale d'édition
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ prix: '', surface: '', photo_url: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Nettoyer l'URL de la photo si elle commence par "photo_url:"
  const cleanPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    // Si l'URL commence par "photo_url:", extraire seulement l'URL
    if (photoUrl.startsWith('photo_url:')) {
      return photoUrl.substring('photo_url:'.length).trim();
    }
    return photoUrl;
  };

  // Ouvrir la modale d'édition
  const openEditModal = (offer, index) => {
    const edited = editedComparables[index] || {};
    setEditForm({
      prix: edited.prix !== undefined ? edited.prix : offer.prix,
      surface: edited.surface !== undefined ? edited.surface : offer.surface,
      photo_url: edited.photo_url || offer.photo_url || ''
    });
    setPreviewImage(edited.photo_url || cleanPhotoUrl(offer.photo_url));
    setEditingIndex(index);
  };

  // Fermer la modale
  const closeEditModal = () => {
    setEditingIndex(null);
    setEditForm({ prix: '', surface: '', photo_url: '' });
    setPreviewImage(null);
  };

  // Gérer l'import d'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditForm(prev => ({ ...prev, photo_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Sauvegarder les modifications
  const saveEdit = () => {
    if (onEditComparable && editingIndex !== null) {
      onEditComparable(editingIndex, {
        prix: Number(editForm.prix),
        surface: Number(editForm.surface),
        photo_url: editForm.photo_url
      });
    }
    closeEditModal();
  };

  // Formater le prix pour l'affichage
  const formatPrice = (prix) => {
    if (!prix) return '';
    return `${(prix / 1000000).toFixed(1)} MF`;
  };

  // Composant pour une seule carte d'offre avec gestion d'état pour l'image
  const OfferCard = ({ offer, index }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Appliquer les modifications éditées si elles existent
    const edited = editedComparables[index] || {};
    const displayOffer = {
      ...offer,
      prix: edited.prix !== undefined ? edited.prix : offer.prix,
      surface: edited.surface !== undefined ? edited.surface : offer.surface,
      photo_url: edited.photo_url || offer.photo_url
    };

    const cleanedPhotoUrl = cleanPhotoUrl(displayOffer.photo_url);
    const isHidden = hiddenComparables.includes(index);
    const hasEdits = Object.keys(edited).length > 0;

    return (
      <div
        key={index}
        className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border ${hasEdits ? 'border-emerald-300' : 'border-slate-200'} hover:border-[#0077B6]/40 group ${isHidden ? 'opacity-40' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge "Modifié" si des modifications ont été faites */}
        {hasEdits && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              Modifié
            </span>
          </div>
        )}

        {/* Boutons d'action en haut à droite */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {/* Bouton Modifier - visible au survol */}
          {onEditComparable && isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(offer, index);
              }}
              className="p-1.5 rounded-full shadow-md border bg-[#0077B6] border-[#0077B6] text-white hover:bg-[#005f8a] transition-all"
              title="Modifier ce bien"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {/* Bouton toggle pour masquer/afficher dans le PDF */}
          {onToggleComparable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComparable(index);
              }}
              className={`p-1.5 rounded-full shadow-md border transition-all ${
                !isHidden
                  ? 'bg-white/90 backdrop-blur-sm border-slate-200 text-slate-500 hover:text-[#0077B6] hover:border-[#0077B6]'
                  : 'bg-slate-200/90 backdrop-blur-sm border-slate-300 text-slate-400 hover:bg-slate-300'
              }`}
              title={!isHidden ? 'Masquer du PDF' : 'Afficher dans le PDF'}
            >
              {!isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Image du bien */}
        <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
          {cleanedPhotoUrl && !imageError ? (
            <img
              src={cleanedPhotoUrl}
              alt={`${displayOffer.type_bien} à ${displayOffer.commune}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-3 shadow-md">
                <Home className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-400">Photo non disponible</p>
            </div>
          )}
          {/* Badge du type de bien en overlay */}
          <div className={`absolute top-4 ${hasEdits ? 'left-20' : 'left-4'}`}>
            <span className="bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
              {displayOffer.type_bien}
            </span>
          </div>
        </div>

        {/* Contenu de la carte */}
        <div className="p-6">
          {/* Prix - Très prominent */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-[#0077B6]" />
              <p className="text-3xl font-bold text-[#0077B6]">
                {formatPrice(displayOffer.prix)}
              </p>
            </div>
          </div>

          {/* Surface et Commune côte à côte */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              <Ruler className="w-4 h-4 text-slate-500" />
              <p className="font-semibold text-sm">
                {displayOffer.surface} m²
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="font-semibold text-sm truncate">
                {displayOffer.commune}
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      {/* Titre de la section */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-3 flex items-center gap-3">
          <Home className="w-7 h-7 text-[#0077B6]" />
          Biens similaires sur le marché
        </h3>
        <p className="text-slate-600 text-lg">
          Ces offres comparables vous donnent une idée du marché actuel dans votre secteur
        </p>
      </div>

      {/* Grille des offres - 2 colonnes max pour plus de largeur */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {offersToShow.map((offer, index) => (
          <OfferCard key={index} offer={offer} index={index} />
        ))}
      </div>

      {/* Note en bas */}
      {comparables.length > 5 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 bg-slate-50 inline-block px-4 py-2 rounded-full">
            + {comparables.length - 5} autre{comparables.length - 5 > 1 ? 's' : ''} bien
            {comparables.length - 5 > 1 ? 's' : ''} comparable{comparables.length - 5 > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Modale d'édition */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header de la modale */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#0077B6]" />
                Modifier le bien comparable
              </h3>
              <button
                onClick={closeEditModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Corps de la modale */}
            <div className="p-5 space-y-5">
              {/* Zone d'import d'image */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Photo du bien
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-[#0077B6] transition-colors"
                >
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Aperçu"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Changer l'image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Cliquez pour importer une image</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG (max 5 Mo)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Champ Prix */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prix (en XPF)
                </label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={editForm.prix}
                    onChange={(e) => setEditForm(prev => ({ ...prev, prix: e.target.value }))}
                    placeholder="Ex: 45000000"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6] transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Soit {editForm.prix ? formatPrice(Number(editForm.prix)) : '0 MF'}
                </p>
              </div>

              {/* Champ Surface */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Surface (en m²)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={editForm.surface}
                    onChange={(e) => setEditForm(prev => ({ ...prev, surface: e.target.value }))}
                    placeholder="Ex: 120"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer de la modale */}
            <div className="flex gap-3 p-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-3 bg-[#0077B6] text-white rounded-xl font-medium hover:bg-[#005f8a] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
