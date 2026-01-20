import { Home, MapPin, Ruler, Banknote } from 'lucide-react';
import { useState } from 'react';

export default function SimilarOffers({ comparables }) {
  // Ne rien afficher si pas de comparables
  if (!comparables || !Array.isArray(comparables) || comparables.length === 0) {
    return null;
  }

  // Limiter à 5 offres maximum
  const offersToShow = comparables.slice(0, 5);

  // Nettoyer l'URL de la photo si elle commence par "photo_url:"
  const cleanPhotoUrl = (photoUrl) => {
    if (!photoUrl) return null;
    // Si l'URL commence par "photo_url:", extraire seulement l'URL
    if (photoUrl.startsWith('photo_url:')) {
      return photoUrl.substring('photo_url:'.length).trim();
    }
    return photoUrl;
  };

  // Tronquer la description à un certain nombre de caractères
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return 'Aucune description disponible';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Composant pour une seule carte d'offre avec gestion d'état pour l'image
  const OfferCard = ({ offer, index }) => {
    const [imageError, setImageError] = useState(false);
    const cleanedPhotoUrl = cleanPhotoUrl(offer.photo_url);

    return (
      <div
        key={index}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-[#0077B6]/30"
      >
        {/* Image du bien */}
        <div className="h-48 bg-slate-200 relative overflow-hidden">
          {cleanedPhotoUrl && !imageError ? (
            <img
              src={cleanedPhotoUrl}
              alt={`${offer.type_bien} à ${offer.commune}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-2">
                <Home className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-sm text-slate-400">Photo non disponible</p>
            </div>
          )}
        </div>

        {/* Contenu de la carte */}
        <div className="p-5">
          {/* Prix */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="w-4 h-4 text-[#0077B6]" />
              <p className="text-2xl font-bold text-[#0077B6]">
                {offer.prix_formatte || `${(offer.prix / 1000000).toFixed(1)} MF`}
              </p>
            </div>
          </div>

          {/* Type et surface */}
          <div className="flex items-center gap-2 mb-2 text-slate-700">
            <Ruler className="w-4 h-4 text-slate-400" />
            <p className="font-medium">
              {offer.type_bien} · {offer.surface} m²
            </p>
          </div>

          {/* Commune */}
          <div className="flex items-center gap-2 mb-3 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <p className="text-sm">{offer.commune}</p>
          </div>

          {/* Description */}
          <div className="border-t border-slate-100 pt-3">
            <p className="text-sm text-slate-600 leading-relaxed">
              {truncateDescription(offer.description)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8">
      {/* Titre de la section */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Home className="w-6 h-6 text-[#0077B6]" />
          Biens similaires sur le marché
        </h3>
        <p className="text-slate-600">
          Ces offres comparables vous donnent une idée du marché actuel dans votre secteur
        </p>
      </div>

      {/* Grille des offres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {offersToShow.map((offer, index) => (
          <OfferCard key={index} offer={offer} index={index} />
        ))}
      </div>

      {/* Note en bas */}
      {comparables.length > 5 && (
        <p className="text-sm text-slate-500 mt-4 text-center">
          {comparables.length - 5} autre{comparables.length - 5 > 1 ? 's' : ''} bien
          {comparables.length - 5 > 1 ? 's' : ''} comparable{comparables.length - 5 > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
