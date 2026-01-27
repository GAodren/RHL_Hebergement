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

  // Composant pour une seule carte d'offre avec gestion d'état pour l'image
  const OfferCard = ({ offer, index }) => {
    const [imageError, setImageError] = useState(false);
    const cleanedPhotoUrl = cleanPhotoUrl(offer.photo_url);

    return (
      <div
        key={index}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-[#0077B6]/40 group"
      >
        {/* Image du bien */}
        <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
          {cleanedPhotoUrl && !imageError ? (
            <img
              src={cleanedPhotoUrl}
              alt={`${offer.type_bien} à ${offer.commune}`}
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
          <div className="absolute top-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
              {offer.type_bien}
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
                {offer.prix_formatte || `${(offer.prix / 1000000).toFixed(1)} MF`}
              </p>
            </div>
          </div>

          {/* Surface et Commune côte à côte */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              <Ruler className="w-4 h-4 text-slate-500" />
              <p className="font-semibold text-sm">
                {offer.surface} m²
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 rounded-lg px-3 py-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="font-semibold text-sm truncate">
                {offer.commune}
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
    </div>
  );
}
