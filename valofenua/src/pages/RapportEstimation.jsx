import { useLocation, useNavigate } from 'react-router-dom';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { ArrowLeft, Download, FileText, Loader2 } from 'lucide-react';
import RapportPDF from '../components/RapportPDF';
import { formatPriceMF } from '../utils/formatPrice';
import { useAuth } from '../context/AuthContext';

export default function RapportEstimation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { result, formData, adjustedPrice, bienPhoto, photosSupplementaires, nomClient, fromDashboard, estimationId, sectionVisibility, hiddenComparables } = location.state || {};

  // Visibilité par défaut si non fournie
  const visibility = sectionVisibility || {
    marketTrends: true,
    statsGrid: true,
    priceGap: true,
    similarOffers: true,
    note: true,
  };

  // Si pas de données, rediriger vers l'estimation
  if (!result || !formData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Aucune estimation à afficher
            </h1>
            <p className="text-slate-600 mb-6">
              Vous devez d'abord effectuer une estimation pour générer un rapport PDF.
            </p>
            <button
              onClick={() => navigate('/estimation')}
              className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#005f8a] transition-colors"
            >
              Faire une estimation
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Prix à afficher (ajusté ou estimé)
  const displayPrice = adjustedPrice || result.prix_moyen;
  const hasAdjustedPrice = adjustedPrice && adjustedPrice !== result.prix_moyen;

  const getBienLabel = () => {
    const parts = [];
    if (formData.categorie) parts.push(formData.categorie);
    if (formData.type_bien) parts.push(formData.type_bien);

    if (formData.categorie === 'Terrain') {
      parts.push(`de ${formData.surface_terrain} m²`);
    } else {
      parts.push(`de ${formData.surface} m²`);
    }

    parts.push(`à ${formData.commune}`);
    return parts.join(' ');
  };

  const getFileName = () => {
    const date = new Date().toISOString().split('T')[0];
    const suffix = hasAdjustedPrice ? '-ajuste' : '';
    return `estimation-valofenua-${formData.commune.toLowerCase()}${suffix}-${date}.pdf`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour - masqué si on vient du dashboard */}
        {fromDashboard ? (
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0077B6] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate('/estimation', { state: { result, formData, adjustedPrice, bienPhoto, estimationId } })}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0077B6] transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'estimation
          </button>
        )}

        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Rapport d'estimation
              </h1>
              <p className="text-slate-600">
                {getBienLabel()} - <span className="font-semibold text-[#0077B6]">{formatPriceMF(displayPrice)}</span>
                {hasAdjustedPrice && (
                  <span className="ml-2 text-sm text-emerald-600 font-medium">(prix ajusté)</span>
                )}
              </p>
            </div>
            <PDFDownloadLink
              document={<RapportPDF result={result} formData={formData} adjustedPrice={adjustedPrice} agentProfile={profile} bienPhoto={bienPhoto} photosSupplementaires={photosSupplementaires || []} nomClient={nomClient} sectionVisibility={visibility} hiddenComparables={hiddenComparables || []} />}
              fileName={getFileName()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077B6] to-[#005f8a] text-white px-6 py-4 rounded-xl font-medium hover:from-[#005f8a] hover:to-[#004a6d] transition-all shadow-lg hover:shadow-xl"
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Préparation...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Télécharger le PDF
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>

        {/* Aperçu du PDF */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-500" />
              <span className="font-medium text-slate-700">Aperçu du document</span>
              {hasAdjustedPrice && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Prix ajusté inclus
                </span>
              )}
            </div>
          </div>

          {/* Vue desktop avec PDFViewer */}
          <div className="hidden md:block">
            <PDFViewer
              style={{
                width: '100%',
                height: '800px',
                border: 'none',
              }}
              showToolbar={false}
            >
              <RapportPDF result={result} formData={formData} adjustedPrice={adjustedPrice} agentProfile={profile} bienPhoto={bienPhoto} photosSupplementaires={photosSupplementaires || []} nomClient={nomClient} sectionVisibility={visibility} hiddenComparables={hiddenComparables || []} />
            </PDFViewer>
          </div>

          {/* Vue mobile - aperçu simplifié */}
          <div className="md:hidden p-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#E0F4FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-[#0077B6]" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">Aperçu non disponible sur mobile</h3>
                <p className="text-sm text-slate-500">Téléchargez le PDF pour le visualiser</p>
              </div>

              {/* Résumé du contenu */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Bien estimé</p>
                  <p className="font-medium text-slate-800">{getBienLabel()}</p>
                </div>

                {hasAdjustedPrice ? (
                  <>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Prix proposé</p>
                      <p className="text-2xl font-bold text-emerald-700">{formatPriceMF(adjustedPrice)}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Estimation algorithmique</p>
                      <p className="font-medium text-slate-600">{formatPriceMF(result.prix_moyen)}</p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Estimation</p>
                    <p className="text-2xl font-bold text-[#0077B6]">{formatPriceMF(result.prix_moyen)}</p>
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Fourchette</p>
                  <p className="font-medium text-slate-800">
                    {formatPriceMF(result.prix_bas)} - {formatPriceMF(result.prix_haut)}
                  </p>
                </div>
              </div>

              {/* Bouton télécharger mobile */}
              <PDFDownloadLink
                document={<RapportPDF result={result} formData={formData} adjustedPrice={adjustedPrice} agentProfile={profile} bienPhoto={bienPhoto} photosSupplementaires={photosSupplementaires || []} nomClient={nomClient} sectionVisibility={visibility} hiddenComparables={hiddenComparables || []} />}
                fileName={getFileName()}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077B6] to-[#005f8a] text-white px-6 py-4 rounded-xl font-medium hover:from-[#005f8a] hover:to-[#004a6d] transition-all shadow-lg"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Préparation...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Télécharger le PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        {/* Note d'information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Astuce :</span> Ce rapport peut être partagé avec un client ou conservé pour vos archives.
            {hasAdjustedPrice && ' Le prix proposé par l\'agent est clairement identifié dans le document.'}
          </p>
        </div>
      </div>
    </main>
  );
}
