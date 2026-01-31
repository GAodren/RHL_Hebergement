import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Download,
  Trash2,
  Loader2,
  MapPin,
  Home,
  Building2,
  TreePine,
  Calendar,
  AlertCircle,
  Plus,
  Eye,
  StickyNote,
  X,
  Save,
  CheckCircle
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAuth } from '../context/AuthContext';
import { getEstimations, deleteEstimation, updateEstimation } from '../utils/estimations';
import { formatPriceMF, formatPriceXPF } from '../utils/formatPrice';
import RapportPDF from '../components/RapportPDF';

export default function MesEstimations() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [estimations, setEstimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [noteModal, setNoteModal] = useState({ open: false, estimation: null });
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Charger les estimations
  useEffect(() => {
    loadEstimations();
  }, [user]);

  const loadEstimations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getEstimations(user.id);

    if (fetchError) {
      setError('Erreur lors du chargement des estimations');
      console.error(fetchError);
    } else {
      setEstimations(data || []);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette estimation ?')) return;

    setDeletingId(id);
    const { error: deleteError } = await deleteEstimation(id);

    if (deleteError) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    } else {
      setEstimations(prev => prev.filter(e => e.id !== id));
      setMessage({ type: 'success', text: 'Estimation supprimée' });
    }

    setDeletingId(null);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleViewPDF = (estimation) => {
    // Reconstruire les données pour la page rapport
    const formData = {
      commune: estimation.commune,
      categorie: estimation.categorie,
      type_bien: estimation.type_bien,
      surface: estimation.surface,
      surface_terrain: estimation.surface_terrain,
      etat_bien: estimation.etat_bien,
      caracteristiques: estimation.caracteristiques || [],
    };

    const result = {
      prix_bas: estimation.prix_bas,
      prix_moyen: estimation.prix_moyen,
      prix_haut: estimation.prix_haut,
      prix_m2_moyen: estimation.prix_m2_moyen,
      comparables: estimation.comparables || [],
    };

    navigate('/rapport', {
      state: {
        result,
        formData,
        adjustedPrice: estimation.prix_ajuste,
        bienPhoto: estimation.photo_url,
        fromDashboard: true,
        sectionVisibility: estimation.section_visibility,
        hiddenComparables: estimation.hidden_comparables || [],
      }
    });
  };

  const openNoteModal = (estimation) => {
    setNoteModal({ open: true, estimation });
    setNoteText(estimation.notes || '');
  };

  const closeNoteModal = () => {
    setNoteModal({ open: false, estimation: null });
    setNoteText('');
  };

  const handleSaveNote = async () => {
    if (!noteModal.estimation) return;

    setSavingNote(true);
    const { error: updateError } = await updateEstimation(noteModal.estimation.id, {
      notes: noteText,
    });

    if (updateError) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } else {
      setEstimations(prev => prev.map(e =>
        e.id === noteModal.estimation.id ? { ...e, notes: noteText } : e
      ));
      setMessage({ type: 'success', text: 'Note enregistrée' });
      closeNoteModal();
    }

    setSavingNote(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getCategorieIcon = (categorie) => {
    switch (categorie) {
      case 'Maison': return Home;
      case 'Appartement': return Building2;
      case 'Terrain': return TreePine;
      default: return Home;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBienLabel = (estimation) => {
    const parts = [estimation.categorie];
    if (estimation.type_bien) parts.push(estimation.type_bien);

    const surface = estimation.categorie === 'Terrain'
      ? estimation.surface_terrain
      : estimation.surface;

    if (surface) parts.push(`${surface} m²`);

    return parts.join(' • ');
  };

  const getFileName = (estimation) => {
    const date = new Date(estimation.created_at).toISOString().split('T')[0];
    return `estimation-${estimation.commune.toLowerCase()}-${date}.pdf`;
  };

  // Préparer les données pour le PDF
  const getPDFData = (estimation) => ({
    formData: {
      commune: estimation.commune,
      categorie: estimation.categorie,
      type_bien: estimation.type_bien,
      surface: estimation.surface,
      surface_terrain: estimation.surface_terrain,
      etat_bien: estimation.etat_bien,
      caracteristiques: estimation.caracteristiques || [],
    },
    result: {
      prix_bas: estimation.prix_bas,
      prix_moyen: estimation.prix_moyen,
      prix_haut: estimation.prix_haut,
      prix_m2_moyen: estimation.prix_m2_moyen,
      comparables: estimation.comparables || [],
    },
    adjustedPrice: estimation.prix_ajuste,
    sectionVisibility: estimation.section_visibility,
    hiddenComparables: estimation.hidden_comparables || [],
  });

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0077B6]" />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
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

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Historique des estimations
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              {estimations.length} estimation{estimations.length > 1 ? 's' : ''} réalisée{estimations.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/estimation')}
            className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005f8a] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle estimation
          </button>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Liste vide */}
        {estimations.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Aucune estimation
            </h3>
            <p className="text-slate-500 mb-6">
              Vos estimations apparaîtront ici après avoir effectué une estimation.
            </p>
            <button
              onClick={() => navigate('/estimation')}
              className="inline-flex items-center gap-2 bg-[#0077B6] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#005f8a] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Faire une estimation
            </button>
          </div>
        )}

        {/* Liste des estimations */}
        {estimations.length > 0 && (
          <div className="space-y-4">
            {estimations.map((estimation) => {
              const Icon = getCategorieIcon(estimation.categorie);
              const pdfData = getPDFData(estimation);
              const displayPrice = estimation.prix_ajuste || estimation.prix_moyen;

              return (
                <div
                  key={estimation.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Photo ou icône + infos principales */}
                    <div className="flex items-start gap-4 flex-1">
                      {estimation.photo_url ? (
                        <img
                          src={estimation.photo_url}
                          alt="Photo du bien"
                          className="w-28 h-28 rounded-xl object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-28 h-28 bg-[#E0F4FF] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-12 h-12 text-[#0077B6]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-800">
                            {getBienLabel(estimation)}
                          </h3>
                          {estimation.notes && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                              <StickyNote className="w-3 h-3" />
                              Note
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{estimation.commune}</span>
                          <span className="text-slate-300">•</span>
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(estimation.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="flex items-center gap-6 lg:gap-8">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">
                          {estimation.prix_ajuste ? 'Prix proposé' : 'Estimation'}
                        </p>
                        <p className={`text-lg font-bold ${estimation.prix_ajuste ? 'text-emerald-600' : 'text-[#0077B6]'}`}>
                          {formatPriceMF(displayPrice)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Bouton Note */}
                        <button
                          onClick={() => openNoteModal(estimation)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Ajouter une note"
                        >
                          <StickyNote className="w-5 h-5" />
                        </button>

                        {/* Bouton Voir */}
                        <button
                          onClick={() => handleViewPDF(estimation)}
                          className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-[#E0F4FF] rounded-lg transition-colors"
                          title="Voir le rapport"
                        >
                          <Eye className="w-5 h-5" />
                        </button>

                        {/* Bouton Télécharger */}
                        <PDFDownloadLink
                          document={
                            <RapportPDF
                              result={pdfData.result}
                              formData={pdfData.formData}
                              adjustedPrice={pdfData.adjustedPrice}
                              agentProfile={profile}
                              bienPhoto={estimation.photo_url}
                              sectionVisibility={pdfData.sectionVisibility}
                              hiddenComparables={pdfData.hiddenComparables}
                            />
                          }
                          fileName={getFileName(estimation)}
                          className="p-2 text-slate-400 hover:text-[#0077B6] hover:bg-[#E0F4FF] rounded-lg transition-colors"
                          title="Télécharger le PDF"
                        >
                          {({ loading: pdfLoading }) =>
                            pdfLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Download className="w-5 h-5" />
                            )
                          }
                        </PDFDownloadLink>

                        {/* Bouton Supprimer */}
                        <button
                          onClick={() => handleDelete(estimation.id)}
                          disabled={deletingId === estimation.id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === estimation.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Note affichée si présente */}
                  {estimation.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 italic">
                        "{estimation.notes}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Note */}
        {noteModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  Note sur l'estimation
                </h3>
                <button
                  onClick={closeNoteModal}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {noteModal.estimation && (
                <p className="text-sm text-slate-500 mb-4">
                  {getBienLabel(noteModal.estimation)} à {noteModal.estimation.commune}
                </p>
              )}

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ajoutez une note pour retrouver facilement cette estimation (référence client, adresse du bien, remarques...)"
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0077B6] focus:border-[#0077B6] transition-colors resize-none"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={closeNoteModal}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote}
                  className="flex-1 px-4 py-2 bg-[#0077B6] text-white rounded-lg font-medium hover:bg-[#005f8a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingNote ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
