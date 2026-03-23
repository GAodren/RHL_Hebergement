import { Home, MapPin, Ruler, Banknote, Pencil, X, Upload, Save, RotateCcw, Check, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MAX_SELECTED = 4;

export default function SimilarOffers({ comparables = [], selectedComparables = [], onToggleComparable, editedComparables = {}, onEditComparable, onAddComparable }) {
  // Afficher tous les comparables (jusqu'à 12)
  const offersToShow = comparables.slice(0, 12);

  // État pour la section dépliable
  const [isExpanded, setIsExpanded] = useState(false);

  // État pour la modale d'édition/création
  const [editingIndex, setEditingIndex] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({ prix: '', surface: '', photo_url: '', commune: '', type_bien: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const selectedCount = selectedComparables.length;

  // Nettoyer l'URL de la photo si elle commence par "photo_url:"
  const cleanPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
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
      photo_url: edited.photo_url || offer.photo_url || '',
      commune: offer.commune || '',
      type_bien: offer.type_bien || ''
    });
    setPreviewImage(edited.photo_url || cleanPhotoUrl(offer.photo_url));
    setEditingIndex(index);
    setIsCreating(false);
  };

  // Ouvrir la modale de création
  const openCreateModal = () => {
    setEditForm({ prix: '', surface: '', photo_url: '', commune: '', type_bien: '' });
    setPreviewImage(null);
    setEditingIndex('new');
    setIsCreating(true);
  };

  // Fermer la modale
  const closeEditModal = () => {
    setEditingIndex(null);
    setIsCreating(false);
    setEditForm({ prix: '', surface: '', photo_url: '', commune: '', type_bien: '' });
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
    e.target.value = '';
  };

  // Sauvegarder les modifications ou créer
  const saveEdit = () => {
    if (isCreating) {
      if (onAddComparable && editForm.prix && editForm.surface) {
        const prix = Number(editForm.prix);
        onAddComparable({
          prix,
          prix_formatte: `${(prix / 1000000).toFixed(1)} MF`,
          surface: Number(editForm.surface),
          commune: editForm.commune || '',
          type_bien: editForm.type_bien || '',
          photo_url: editForm.photo_url || null,
          manual: true
        });
      }
    } else if (onEditComparable && editingIndex !== null) {
      onEditComparable(editingIndex, {
        prix: Number(editForm.prix),
        surface: Number(editForm.surface),
        photo_url: editForm.photo_url
      });
    }
    closeEditModal();
  };

  // Réinitialiser aux valeurs originales
  const resetEdit = () => {
    if (editingIndex !== null && onEditComparable && !isCreating) {
      onEditComparable(editingIndex, null);
      closeEditModal();
    }
  };

  // Formater le prix pour l'affichage
  const formatPrice = (prix) => {
    if (!prix) return '';
    return `${(prix / 1000000).toFixed(1)} MF`;
  };

  // Composant pour une seule carte d'offre
  const OfferCard = ({ offer, index }) => {
    const [imageError, setImageError] = useState(false);

    const edited = editedComparables[index] || {};
    const displayOffer = {
      ...offer,
      prix: edited.prix !== undefined ? edited.prix : offer.prix,
      surface: edited.surface !== undefined ? edited.surface : offer.surface,
      photo_url: edited.photo_url || offer.photo_url
    };

    const cleanedPhotoUrl = cleanPhotoUrl(displayOffer.photo_url);
    const isSelected = selectedComparables.includes(index);
    const hasEdits = Object.keys(edited).length > 0;
    const isManual = offer.manual === true;
    const canSelect = isSelected || selectedCount < MAX_SELECTED;

    useEffect(() => {
      setImageError(false);
    }, [cleanedPhotoUrl]);

    return (
      <div
        onClick={() => {
          if (canSelect && onToggleComparable) {
            onToggleComparable(index);
          }
        }}
        className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 group ${
          isSelected
            ? 'border-[#0077B6] ring-2 ring-[#0077B6]/20'
            : canSelect
              ? 'border-slate-200 hover:border-slate-300 cursor-pointer'
              : 'border-slate-200 opacity-50 cursor-not-allowed'
        } ${isSelected ? 'cursor-pointer' : ''}`}
      >
        {/* Badge de sélection */}
        <div className="absolute top-3 left-3 z-20">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all ${
            isSelected
              ? 'bg-[#0077B6] text-white'
              : 'bg-white/90 border-2 border-slate-300 text-transparent'
          }`}>
            <Check className="w-4 h-4" />
          </div>
        </div>

        {/* Badge "Modifié" ou "Ajouté" */}
        {(hasEdits || isManual) && (
          <div className="absolute top-3 left-12 z-20">
            <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-md text-white ${
              isManual ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}>
              {isManual ? 'Ajouté' : 'Modifié'}
            </span>
          </div>
        )}

        {/* Bouton Modifier */}
        {onEditComparable && (
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(offer, index);
              }}
              className="p-2 rounded-full shadow-md border bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#0077B6] transition-all"
              title="Modifier ce bien"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Image du bien */}
        <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
          {cleanedPhotoUrl && !imageError ? (
            <img
              src={cleanedPhotoUrl}
              alt={`${displayOffer.type_bien} à ${displayOffer.commune}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-md">
                <Home className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-xs font-medium text-slate-400">Photo non disponible</p>
            </div>
          )}
          {/* Badge du type de bien */}
          {displayOffer.type_bien && (
            <div className={`absolute top-4 ${(hasEdits || isManual) ? 'left-24' : 'left-12'}`}>
              <span className="bg-white/95 backdrop-blur-sm text-slate-700 px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
                {displayOffer.type_bien}
              </span>
            </div>
          )}
        </div>

        {/* Contenu de la carte */}
        <div className="p-4">
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-[#0077B6]" />
              <p className="text-2xl font-bold text-[#0077B6]">
                {formatPrice(displayOffer.prix)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 rounded-lg px-2 py-1.5">
              <Ruler className="w-3.5 h-3.5 text-slate-500" />
              <p className="font-semibold text-xs">
                {displayOffer.surface} m²
              </p>
            </div>
            {displayOffer.commune && (
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 rounded-lg px-2 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <p className="font-semibold text-xs truncate">
                  {displayOffer.commune}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      {/* Titre de la section - cliquable pour déplier */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full mb-6"
      >
        <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-slate-200">
          <div className="flex items-center gap-3">
            <Home className="w-6 h-6 text-[#0077B6]" />
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-800">
                Biens similaires sur le marché
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {offersToShow.length > 0
                  ? `${offersToShow.length} bien${offersToShow.length > 1 ? 's' : ''} disponible${offersToShow.length > 1 ? 's' : ''}`
                  : 'Aucun bien — ajoutez-en manuellement'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Compteur de sélection */}
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
              selectedCount === MAX_SELECTED
                ? 'bg-[#0077B6] text-white'
                : selectedCount > 0
                  ? 'bg-[#E0F4FF] text-[#0077B6]'
                  : 'bg-slate-100 text-slate-500'
            }`}>
              {selectedCount}/{MAX_SELECTED} sélectionné{selectedCount > 1 ? 's' : ''}
            </span>
            {isExpanded
              ? <ChevronUp className="w-5 h-5 text-slate-400" />
              : <ChevronDown className="w-5 h-5 text-slate-400" />
            }
          </div>
        </div>
      </button>

      {/* Grille des offres - dépliable */}
      {isExpanded && (
        <div className="animate-fadeIn">
          {/* Instruction */}
          <p className="text-sm text-slate-500 mb-4">
            Cliquez sur les biens à inclure dans le PDF (4 maximum). Utilisez le bouton <Pencil className="w-3.5 h-3.5 inline" /> pour modifier les détails.
          </p>

          {/* Grille 3 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offersToShow.map((offer, index) => (
              <OfferCard key={index} offer={offer} index={index} />
            ))}

            {/* Carte "Ajouter un bien" */}
            {onAddComparable && (
              <button
                onClick={openCreateModal}
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#0077B6] hover:bg-[#E0F4FF]/30 transition-all duration-300 min-h-[280px] group"
              >
                <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#0077B6] group-hover:bg-[#E0F4FF] flex items-center justify-center transition-all shadow-md">
                  <Plus className="w-7 h-7 text-slate-400 group-hover:text-[#0077B6] transition-colors" />
                </div>
                <span className="text-sm font-semibold text-slate-500 group-hover:text-[#0077B6] transition-colors">
                  Ajouter un bien
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modale d'édition / création */}
      {editingIndex !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header de la modale */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {isCreating
                  ? <><Plus className="w-5 h-5 text-[#0077B6]" /> Ajouter un bien comparable</>
                  : <><Pencil className="w-5 h-5 text-[#0077B6]" /> Modifier le bien comparable</>
                }
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

              {/* Champs Commune et Type de bien - visibles en création et édition de bien manuel */}
              {(isCreating || (editingIndex !== null && !isCreating && comparables[editingIndex]?.manual)) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commune
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={editForm.commune}
                        onChange={(e) => setEditForm(prev => ({ ...prev, commune: e.target.value }))}
                        placeholder="Ex: Papeete"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Type de bien
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={editForm.type_bien}
                        onChange={(e) => setEditForm(prev => ({ ...prev, type_bien: e.target.value }))}
                        placeholder="Ex: F3, Villa"
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0077B6]/20 focus:border-[#0077B6] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

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
              {!isCreating && (
                <button
                  onClick={resetEdit}
                  className="px-4 py-3 border border-orange-300 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                  title="Remettre les valeurs par défaut"
                >
                  <RotateCcw className="w-4 h-4" />
                  Par défaut
                </button>
              )}
              <button
                onClick={saveEdit}
                disabled={isCreating && (!editForm.prix || !editForm.surface)}
                className="flex-1 px-4 py-3 bg-[#0077B6] text-white rounded-xl font-medium hover:bg-[#005f8a] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
